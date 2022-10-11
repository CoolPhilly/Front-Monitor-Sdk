import reportTracker from "../../utils/reportTracker";
import config from "../../core/config";

export default function baseError() {

    // 捕获资源加载失败错误 js css img...
    window.addEventListener('error', e => {
        const target:any = e.target
        if (!target) return
        if (target.src || target.href) {
            const url = target.src || target.href
            reportTracker({
                url,
                type: 'error',
                subType: 'resource',
                startTime: e.timeStamp,
                html: target.outerHTML,
                resourceType: target.tagName,
                paths: e.composedPath().map( (item:any) => item.tagName).filter(Boolean),
                pageURL: location.href,
            })
        }
    }, true)

    // 监听 js 错误
    window.onerror = (msg, url, line, column, error:any) => {
        reportTracker({
            msg,
            line,
            column,
            error: error.stack ,
            subType: 'js',
            pageURL: url,
            type: 'error',
            startTime: performance.now(),
        })
    }

    // 监听 promise 错误
    window.addEventListener('unhandledrejection', e => {
        reportTracker({
            reason: e.reason?.stack,
            subType: 'promise',
            type: 'error',
            startTime: e.timeStamp,
            pageURL: location.href,
        })
    })

    // 监听Vue报错
    if (config.extra.vue) {
        config.extra.vue.config.errorHandler = (err: { stack: any; }, vm: any, info: any) => {
            console.error(err)

            reportTracker({
                info,
                error: err.stack,
                subType: 'vue',
                type: 'error',
                startTime: performance.now(),
                pageURL: location.href,
            })
        }
    }

    //persisted可以来判断是否是缓存中的页面触发的pageshow事件
    window.addEventListener('pageshow', event => {
        if (event.persisted) {
            baseError()
        }
    }, true)
}