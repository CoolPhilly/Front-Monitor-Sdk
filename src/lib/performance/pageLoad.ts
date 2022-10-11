import reportTracker from "../../utils/reportTracker";

// 当纯 HTML 被完全加载以及解析时，DOMContentLoaded 事件会被触发，不用等待 css、img、iframe 加载完。

// 当整个页面及所有依赖资源如样式表和图片都已完成加载时，将触发 load 事件。
export default function pageLoad() {
    ['load', 'DOMContentLoaded'].forEach(type => onEvent(type))
}





function onEvent(type:string) {
    function callback() {
        reportTracker({
            type: 'performance',
            subType: type,
            startTime: performance.now(),
        })
    }

    window.addEventListener(type, callback, true)
}