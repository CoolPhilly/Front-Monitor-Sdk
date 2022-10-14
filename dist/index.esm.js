const config = {
    sdkVersion: '',
    appid: '',
    uuid: '',
    requestUrl: '',
    isImmediate: false,
    extra: null,
};
function setConfig(options) {
    for (const key in config) {
        if (options[key]) {
            config[key] = options[key];
        }
    }
}

var TrackerConfig;
(function (TrackerConfig) {
    TrackerConfig["version"] = "1.0.0";
})(TrackerConfig || (TrackerConfig = {}));

function uuid() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const txt = 'test';
    ctx === null || ctx === void 0 ? void 0 : ctx.fillText(txt, 10, 10);
    return canvas.toDataURL();
}

// 兼容性判断
const compatibility = {
    canUseSendBeacon: !!navigator.sendBeacon,
};
function defaultReport(params, url) {
    url = !!url ? url : config.requestUrl;
    if (!url)
        console.log('请设置上传 url 地址');
    params = Object.assign(params, { appid: config.appid, uuid: config.uuid, sdkversion: config.sdkVersion }, { reportTime: new Date().getTime() });
    console.log(params);
    if (compatibility.canUseSendBeacon && params) {
        let headers = {
            type: "application/x-www-form-urlencoded",
        };
        //封装blob
        let blob = new Blob([JSON.stringify(params)], headers);
        navigator.sendBeacon(url, blob);
    }
    else {
        // 使用img标签上报
        const img = new Image();
        img.src = `${url}?data=${encodeURIComponent(JSON.stringify(params))}`;
    }
}

const MAX_CACHE_COUNT = 5; // 上报数据最大缓存数
const MAX_WAITING_TIME = 5000; // 最大等待时间
let reportDatas = [];
let timer = null; // 定时器
/**
 * 可以理解为异步执行
 * requestIdleCallback 是浏览器空闲时会自动执行内部函数
 * requestAnimationFrame 是浏览器必须执行的
 * 关于 requestIdleCallback 和  requestAnimationFrame 可以参考 https://www.cnblogs.com/cangqinglang/p/13877078.html
 */
const nextTime = window.requestIdleCallback || window.requestAnimationFrame || ((callback) => setTimeout(callback, 17));
function send(url) {
    if (reportDatas.length) {
        const datas = reportDatas.slice(0, MAX_CACHE_COUNT); // 需要上报的数据
        reportDatas = reportDatas.slice(MAX_CACHE_COUNT); // 剩下的待上报数据
        defaultReport(datas, url);
        if (reportDatas.length) {
            nextTime(send); // 继续上报剩余内容,在下一个时间择机传输
        }
    }
}
function timedReport(params, url) {
    reportDatas.push(params);
    clearTimeout(timer);
    reportDatas.length >= MAX_CACHE_COUNT
        ? send(url)
        : (timer = setTimeout(() => {
            send(url);
        }, MAX_WAITING_TIME));
}

function reportTracker(params, url) {
    url = !!url ? url : config.requestUrl;
    if (config.isImmediate) {
        defaultReport(params, url);
    }
    else {
        // 定时上报
        timedReport(params, url);
    }
}

function pv() {
    reportTracker({
        type: 'behavior',
        subType: 'pv',
        startTime: performance.now(),
        pageURL: location.href,
        referrer: document.referrer,
    });
}

//keyof 获取的是类型
const createHistoryEvent = (type) => {
    const origin = window.history[type];
    //this是假参数
    return function () {
        const res = origin.apply(this, arguments);
        const e = new Event(type);
        /*
            Event创建自定义事件
            dispatchEvent派发事件
            addEventListener监听事件
            removeEventListener删除事件
            其实也就是发布订阅模式
        */
        window.dispatchEvent(e);
        return res;
    };
};
window.history["pushState"] = createHistoryEvent("pushState");
window.history["replaceState"] = createHistoryEvent("replaceState");
function pageChange(customEventList) {
    customEventList.forEach((item) => {
        let from = '';
        window.addEventListener(item, () => {
            const to = location.href;
            reportTracker({
                from,
                to,
                type: 'behavior',
                subType: item,
                startTime: performance.now(),
            });
            from = to;
        }, true);
    });
}

function pageAccessDuration() {
    window.addEventListener('beforeunload', () => {
        defaultReport({
            type: 'behavior',
            subType: 'page-access-duration',
            startTime: performance.now(),
            pageURL: location.href,
        }, config.requestUrl);
    }, true);
}

function userBehavior() {
    pv();
    pageAccessDuration();
    pageChange(["pushState", "replaceState", "popstate", "hashchange"]);
}

function baseError() {
    // 捕获资源加载失败错误 js css img...
    window.addEventListener('error', e => {
        const target = e.target;
        if (!target)
            return;
        if (target.src || target.href) {
            const url = target.src || target.href;
            reportTracker({
                url,
                type: 'error',
                subType: 'resource',
                startTime: e.timeStamp,
                html: target.outerHTML,
                resourceType: target.tagName,
                paths: e.composedPath().map((item) => item.tagName).filter(Boolean),
                pageURL: location.href,
            });
        }
    }, true);
    // 监听 js 错误
    window.onerror = (msg, url, line, column, error) => {
        reportTracker({
            msg,
            line,
            column,
            error: error.stack,
            subType: 'js',
            pageURL: url,
            type: 'error',
            startTime: performance.now(),
        });
    };
    // 监听 promise 错误
    window.addEventListener('unhandledrejection', e => {
        var _a;
        reportTracker({
            reason: (_a = e.reason) === null || _a === void 0 ? void 0 : _a.stack,
            subType: 'promise',
            type: 'error',
            startTime: e.timeStamp,
            pageURL: location.href,
        });
    });
    // 监听Vue报错
    if (config.extra.vue) {
        config.extra.vue.config.errorHandler = (err, vm, info) => {
            console.error(err);
            reportTracker({
                info,
                error: err.stack,
                subType: 'vue',
                type: 'error',
                startTime: performance.now(),
                pageURL: location.href,
            });
        };
    }
    //persisted可以来判断是否是缓存中的页面触发的pageshow事件
    window.addEventListener('pageshow', event => {
        if (event.persisted) {
            baseError();
        }
    }, true);
}

function fpFcpPaint() {
    const entryHandler = (list) => {
        for (const entry of list.getEntries()) {
            if (entry.name === "first-paint") {
                observer.disconnect();
                const json = entry.toJSON();
                delete json.duration;
                const reportData = Object.assign(Object.assign({}, json), { subType: 'FP', type: 'performance', pageURL: location.href });
                reportTracker(reportData);
            }
            if (entry.name === "first-contentful-paint") {
                observer.disconnect();
                const json = entry.toJSON();
                delete json.duration;
                const reportData = Object.assign(Object.assign({}, json), { subType: 'FCP', type: 'performance', pageURL: location.href });
                reportTracker(reportData);
            }
        }
    };
    // PerformanceObserver() 构造函数使用给定的观察者 callback 生成一个新的 PerformanceObserver 对象.
    // 当通过 observe() 方法注册的 条目类型 的 性能条目事件 被记录下来时,调用该观察者回调. 
    // 调用回调时，其第一个参数是 性能观察条目列表 (en-US)，第二个参数是 观察者 对象。
    const observer = new PerformanceObserver(entryHandler);
    // buffered 属性表示是否观察缓存数据，也就是说观察代码添加时机比事情触发时机晚也没关系。
    observer.observe({ type: "paint", buffered: true });
}

function lcpPaint() {
    const entryHandler = (list) => {
        var _a;
        if (observer) {
            observer.disconnect();
        }
        for (const entry of list.getEntries()) {
            const json = entry.toJSON();
            delete json.duration;
            const reportData = Object.assign(Object.assign({}, json), { target: (_a = entry.element) === null || _a === void 0 ? void 0 : _a.tagName, name: entry.entryType, subType: 'LCP', type: 'performance', pageURL: location.href });
            reportTracker(reportData);
        }
    };
    const observer = new PerformanceObserver(entryHandler);
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
}

// 当纯 HTML 被完全加载以及解析时，DOMContentLoaded 事件会被触发，不用等待 css、img、iframe 加载完。
// 当整个页面及所有依赖资源如样式表和图片都已完成加载时，将触发 load 事件。
function pageLoad() {
    ['load', 'DOMContentLoaded'].forEach(type => onEvent(type));
}
function onEvent(type) {
    function callback() {
        reportTracker({
            type: 'performance',
            subType: type,
            startTime: performance.now(),
        });
    }
    window.addEventListener(type, callback, true);
}

function newXhrSendOpen() {
    // open方法
    let oldOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, async = true, username, password) {
        this.method = method;
        this.url = url;
        oldOpen.apply(this, [method, url, async, username, password]);
    };
    // 记录send方法
    let oldSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (...args) {
        this.startTime = Date.now();
        const handler = (eventType) => () => {
            this.endTime = Date.now();
            this.duration = this.endTime - this.startTime;
            const { status, duration, startTime, endTime, url, method } = this;
            const reportData = {
                status,
                startTime,
                endTime,
                duration,
                eventType: eventType,
                url,
                method: (method || 'GET').toUpperCase(),
                subType: 'xhr',
                type: 'performance',
                response: this.response ? JSON.stringify(this.response) : "",
                param: args[0] || "",
            };
            reportTracker(reportData);
        };
        // 监听load、error、abort事件
        this.addEventListener("load", handler("load"), false); // load 事件表示服务器传来的数据接收完毕
        this.addEventListener("error", handler("error"), false); // error 事件表示请求出错
        this.addEventListener("abort", handler("abort"), false); // abort 事件表示请求被中断（比如用户取消请求）
        return oldSend.apply(this, args);
    };
}

const originalFetch = window.fetch;
function newFetch() {
    window.fetch = function newFetch(url, config) {
        const startTime = Date.now();
        const reportData = {
            duration: 0,
            startTime,
            endTime: 0,
            url,
            method: ((config === null || config === void 0 ? void 0 : config.method) || 'GET').toUpperCase(),
            status: 0,
            success: false,
            subType: 'fetch',
            type: 'performance',
        };
        return originalFetch(url, config)
            .then(res => {
            reportData.endTime = Date.now();
            reportData.duration = reportData.endTime - reportData.startTime;
            const data = res.clone();
            reportData.status = data.status;
            reportData.success = data.ok;
            reportTracker(reportData);
            return res;
        })
            .catch(err => {
            reportData.endTime = Date.now();
            reportData.duration = reportData.endTime - reportData.startTime;
            reportData.status = 0;
            reportData.success = false;
            reportTracker(reportData);
            throw err;
        });
    };
}

// 判断文档是否加载
let hasAlreadyCollected = false;
function observeEvent(entryType) {
    function entryHandler(list) {
        const data = list.getEntries ? list.getEntries() : list;
        for (const entry of data) {
            // console.log(entry);
            if (entryType === 'navigation') {
                if (hasAlreadyCollected)
                    return;
                if (observer) {
                    observer.disconnect();
                }
                hasAlreadyCollected = true;
            }
            // nextHopProtocol 属性为空，说明资源解析错误或者跨域
            // beacon 用于上报数据，所以不统计。xhr fetch 单独统计
            if (filter(entry.initiatorType)) {
                return;
            }
            reportTracker({
                name: entry.name,
                subType: entryType,
                type: 'performance',
                sourceType: entry.initiatorType,
                duration: entry.duration,
                dns: entry.domainLookupEnd - entry.domainLookupStart,
                tcp: entry.connectEnd - entry.connectStart,
                redirect: entry.redirectEnd - entry.redirectStart,
                ttfb: entry.responseStart,
                protocol: entry.nextHopProtocol,
                responseBodySize: entry.encodedBodySize,
                responseHeaderSize: entry.transferSize - entry.encodedBodySize,
                resourceSize: entry.decodedBodySize,
                startTime: performance.now(),
            });
        }
    }
    let observer;
    if (!!window.PerformanceObserver) {
        observer = new PerformanceObserver(entryHandler);
        observer.observe({ type: entryType, buffered: true });
    }
    else {
        const data = window.performance.getEntriesByType(entryType);
        entryHandler(data);
    }
}
function observeEntries() {
    if (document.readyState === "complete") {
        console.log("complete");
        observeEvent('resource');
        observeEvent('navigation');
    }
    else {
        window.addEventListener("load", () => {
            console.log("load");
            observeEvent('resource');
            observeEvent('navigation');
        });
    }
}
// 不统计以下类型的资源
const preventType = ['fetch', 'xmlhttprequest', 'beacon'];
function filter(type) {
    return preventType.includes(type);
}

// import observeEntries from './observeEntries'
// import observeLCP from './observeLCP'
// import observeCLS from './observeCLS'
// import observeFID from './observeFID'
// import observerLoad from './observerLoad'
// import observeFirstScreenPaint from './observeFirstScreenPaint'
// import xhr from './xhr'
// import fetch from './fetch'
// import fps from './fps'
// import onVueRouter from './onVueRouter'
// import config from '../config'
function performance$1() {
    fpFcpPaint();
    lcpPaint();
    pageLoad();
    newXhrSendOpen();
    newFetch();
    observeEntries();
    // observeLCP()
    // observeCLS()
    // observeFID()
    // xhr()
    // fetch()
    // fps()
    // observerLoad()
    // observeFirstScreenPaint()
    // if (config.vue?.Vue && config.vue?.router) {
    //     onVueRouter(config.vue.Vue, config.vue.router)
    // }
}

class Tracker {
    constructor(options) {
        this.options = Object.assign(this.initDef(), options);
        setConfig(this.options);
        this.installTracker();
    }
    // 初始化函数
    initDef() {
        return {
            sdkVersion: TrackerConfig.version,
            uuid: uuid()
        };
    }
    //设置用户id
    setUserId(uuid) {
        this.options.uuid = uuid;
    }
    //手动上报
    sendReport(data, url) {
        reportTracker(data, url);
    }
    installTracker() {
        // 行为监控
        if (this.options.userbehavior) {
            userBehavior();
        }
        // 报错监控
        if (this.options.baseError) {
            baseError();
        }
        // 性能监控
        if (this.options.performance) {
            performance$1();
        }
    }
}

export { Tracker as default };
