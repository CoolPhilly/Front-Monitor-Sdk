'use strict';

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

/*

TypeScript Md5
==============

Based on work by
* Joseph Myers: http://www.myersdaily.org/joseph/javascript/md5-text.html
* André Cruz: https://github.com/satazor/SparkMD5
* Raymond Hill: https://github.com/gorhill/yamd5.js

Effectively a TypeScrypt re-write of Raymond Hill JS Library

The MIT License (MIT)

Copyright (C) 2014 Raymond Hill

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.



            DO WHAT YOU WANT TO PUBLIC LICENSE
                    Version 2, December 2004

 Copyright (C) 2015 André Cruz <amdfcruz@gmail.com>

 Everyone is permitted to copy and distribute verbatim or modified
 copies of this license document, and changing it is allowed as long
 as the name is changed.

            DO WHAT YOU WANT TO PUBLIC LICENSE
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

  0. You just DO WHAT YOU WANT TO.


*/
class Md5 {
    constructor() {
        this._dataLength = 0;
        this._bufferLength = 0;
        this._state = new Int32Array(4);
        this._buffer = new ArrayBuffer(68);
        this._buffer8 = new Uint8Array(this._buffer, 0, 68);
        this._buffer32 = new Uint32Array(this._buffer, 0, 17);
        this.start();
    }
    static hashStr(str, raw = false) {
        return this.onePassHasher
            .start()
            .appendStr(str)
            .end(raw);
    }
    static hashAsciiStr(str, raw = false) {
        return this.onePassHasher
            .start()
            .appendAsciiStr(str)
            .end(raw);
    }
    static _hex(x) {
        const hc = Md5.hexChars;
        const ho = Md5.hexOut;
        let n;
        let offset;
        let j;
        let i;
        for (i = 0; i < 4; i += 1) {
            offset = i * 8;
            n = x[i];
            for (j = 0; j < 8; j += 2) {
                ho[offset + 1 + j] = hc.charAt(n & 0x0F);
                n >>>= 4;
                ho[offset + 0 + j] = hc.charAt(n & 0x0F);
                n >>>= 4;
            }
        }
        return ho.join('');
    }
    static _md5cycle(x, k) {
        let a = x[0];
        let b = x[1];
        let c = x[2];
        let d = x[3];
        // ff()
        a += (b & c | ~b & d) + k[0] - 680876936 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[1] - 389564586 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[2] + 606105819 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[3] - 1044525330 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[4] - 176418897 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[5] + 1200080426 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[6] - 1473231341 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[7] - 45705983 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[8] + 1770035416 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[9] - 1958414417 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[10] - 42063 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[11] - 1990404162 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[12] + 1804603682 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[13] - 40341101 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[14] - 1502002290 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[15] + 1236535329 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        // gg()
        a += (b & d | c & ~d) + k[1] - 165796510 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[6] - 1069501632 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[11] + 643717713 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[0] - 373897302 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[5] - 701558691 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[10] + 38016083 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[15] - 660478335 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[4] - 405537848 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[9] + 568446438 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[14] - 1019803690 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[3] - 187363961 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[8] + 1163531501 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[13] - 1444681467 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[2] - 51403784 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[7] + 1735328473 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[12] - 1926607734 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        // hh()
        a += (b ^ c ^ d) + k[5] - 378558 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[8] - 2022574463 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[11] + 1839030562 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[14] - 35309556 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[1] - 1530992060 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[4] + 1272893353 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[7] - 155497632 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[10] - 1094730640 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[13] + 681279174 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[0] - 358537222 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[3] - 722521979 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[6] + 76029189 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[9] - 640364487 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[12] - 421815835 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[15] + 530742520 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[2] - 995338651 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        // ii()
        a += (c ^ (b | ~d)) + k[0] - 198630844 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[7] + 1126891415 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[14] - 1416354905 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[5] - 57434055 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[12] + 1700485571 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[3] - 1894986606 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[10] - 1051523 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[1] - 2054922799 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[8] + 1873313359 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[15] - 30611744 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[6] - 1560198380 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[13] + 1309151649 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[4] - 145523070 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[11] - 1120210379 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[2] + 718787259 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[9] - 343485551 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        x[0] = a + x[0] | 0;
        x[1] = b + x[1] | 0;
        x[2] = c + x[2] | 0;
        x[3] = d + x[3] | 0;
    }
    /**
     * Initialise buffer to be hashed
     */
    start() {
        this._dataLength = 0;
        this._bufferLength = 0;
        this._state.set(Md5.stateIdentity);
        return this;
    }
    // Char to code point to to array conversion:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt
    // #Example.3A_Fixing_charCodeAt_to_handle_non-Basic-Multilingual-Plane_characters_if_their_presence_earlier_in_the_string_is_unknown
    /**
     * Append a UTF-8 string to the hash buffer
     * @param str String to append
     */
    appendStr(str) {
        const buf8 = this._buffer8;
        const buf32 = this._buffer32;
        let bufLen = this._bufferLength;
        let code;
        let i;
        for (i = 0; i < str.length; i += 1) {
            code = str.charCodeAt(i);
            if (code < 128) {
                buf8[bufLen++] = code;
            }
            else if (code < 0x800) {
                buf8[bufLen++] = (code >>> 6) + 0xC0;
                buf8[bufLen++] = code & 0x3F | 0x80;
            }
            else if (code < 0xD800 || code > 0xDBFF) {
                buf8[bufLen++] = (code >>> 12) + 0xE0;
                buf8[bufLen++] = (code >>> 6 & 0x3F) | 0x80;
                buf8[bufLen++] = (code & 0x3F) | 0x80;
            }
            else {
                code = ((code - 0xD800) * 0x400) + (str.charCodeAt(++i) - 0xDC00) + 0x10000;
                if (code > 0x10FFFF) {
                    throw new Error('Unicode standard supports code points up to U+10FFFF');
                }
                buf8[bufLen++] = (code >>> 18) + 0xF0;
                buf8[bufLen++] = (code >>> 12 & 0x3F) | 0x80;
                buf8[bufLen++] = (code >>> 6 & 0x3F) | 0x80;
                buf8[bufLen++] = (code & 0x3F) | 0x80;
            }
            if (bufLen >= 64) {
                this._dataLength += 64;
                Md5._md5cycle(this._state, buf32);
                bufLen -= 64;
                buf32[0] = buf32[16];
            }
        }
        this._bufferLength = bufLen;
        return this;
    }
    /**
     * Append an ASCII string to the hash buffer
     * @param str String to append
     */
    appendAsciiStr(str) {
        const buf8 = this._buffer8;
        const buf32 = this._buffer32;
        let bufLen = this._bufferLength;
        let i;
        let j = 0;
        for (;;) {
            i = Math.min(str.length - j, 64 - bufLen);
            while (i--) {
                buf8[bufLen++] = str.charCodeAt(j++);
            }
            if (bufLen < 64) {
                break;
            }
            this._dataLength += 64;
            Md5._md5cycle(this._state, buf32);
            bufLen = 0;
        }
        this._bufferLength = bufLen;
        return this;
    }
    /**
     * Append a byte array to the hash buffer
     * @param input array to append
     */
    appendByteArray(input) {
        const buf8 = this._buffer8;
        const buf32 = this._buffer32;
        let bufLen = this._bufferLength;
        let i;
        let j = 0;
        for (;;) {
            i = Math.min(input.length - j, 64 - bufLen);
            while (i--) {
                buf8[bufLen++] = input[j++];
            }
            if (bufLen < 64) {
                break;
            }
            this._dataLength += 64;
            Md5._md5cycle(this._state, buf32);
            bufLen = 0;
        }
        this._bufferLength = bufLen;
        return this;
    }
    /**
     * Get the state of the hash buffer
     */
    getState() {
        const s = this._state;
        return {
            buffer: String.fromCharCode.apply(null, Array.from(this._buffer8)),
            buflen: this._bufferLength,
            length: this._dataLength,
            state: [s[0], s[1], s[2], s[3]]
        };
    }
    /**
     * Override the current state of the hash buffer
     * @param state New hash buffer state
     */
    setState(state) {
        const buf = state.buffer;
        const x = state.state;
        const s = this._state;
        let i;
        this._dataLength = state.length;
        this._bufferLength = state.buflen;
        s[0] = x[0];
        s[1] = x[1];
        s[2] = x[2];
        s[3] = x[3];
        for (i = 0; i < buf.length; i += 1) {
            this._buffer8[i] = buf.charCodeAt(i);
        }
    }
    /**
     * Hash the current state of the hash buffer and return the result
     * @param raw Whether to return the value as an `Int32Array`
     */
    end(raw = false) {
        const bufLen = this._bufferLength;
        const buf8 = this._buffer8;
        const buf32 = this._buffer32;
        const i = (bufLen >> 2) + 1;
        this._dataLength += bufLen;
        const dataBitsLen = this._dataLength * 8;
        buf8[bufLen] = 0x80;
        buf8[bufLen + 1] = buf8[bufLen + 2] = buf8[bufLen + 3] = 0;
        buf32.set(Md5.buffer32Identity.subarray(i), i);
        if (bufLen > 55) {
            Md5._md5cycle(this._state, buf32);
            buf32.set(Md5.buffer32Identity);
        }
        // Do the final computation based on the tail and length
        // Beware that the final length may not fit in 32 bits so we take care of that
        if (dataBitsLen <= 0xFFFFFFFF) {
            buf32[14] = dataBitsLen;
        }
        else {
            const matches = dataBitsLen.toString(16).match(/(.*?)(.{0,8})$/);
            if (matches === null) {
                return;
            }
            const lo = parseInt(matches[2], 16);
            const hi = parseInt(matches[1], 16) || 0;
            buf32[14] = lo;
            buf32[15] = hi;
        }
        Md5._md5cycle(this._state, buf32);
        return raw ? this._state : Md5._hex(this._state);
    }
}
// Private Static Variables
Md5.stateIdentity = new Int32Array([1732584193, -271733879, -1732584194, 271733878]);
Md5.buffer32Identity = new Int32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
Md5.hexChars = '0123456789abcdef';
Md5.hexOut = [];
// Permanent instance is to use for one-call hashing
Md5.onePassHasher = new Md5();
if (Md5.hashStr('hello') !== '5d41402abc4b2a76b9719d911017c592') {
    throw new Error('Md5 self test failed.');
}

function uuid() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const txt = 'uuid';
    ctx === null || ctx === void 0 ? void 0 : ctx.fillText(txt, 10, 10);
    return Md5.hashStr(canvas.toDataURL());
}

// 兼容性判断
const compatibility = {
    canUseSendBeacon: !!navigator.sendBeacon,
};
function defaultReport(params, url) {
    url = !!url ? url : config.requestUrl;
    if (!url)
        console.log('请设置上传 url 地址');
    if (Array.isArray(params)) {
        params.push({ appid: config.appid, uuid: config.uuid, sdkversion: config.sdkVersion, reportTime: new Date().getTime() });
    }
    else {
        params = Object.assign(params, { appid: config.appid, uuid: config.uuid, sdkversion: config.sdkVersion }, { reportTime: new Date().getTime() });
    }
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
            pageURL: location.href,
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
function performance$1() {
    fpFcpPaint();
    lcpPaint();
    pageLoad();
    newXhrSendOpen();
    newFetch();
    observeEntries();
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

module.exports = Tracker;
