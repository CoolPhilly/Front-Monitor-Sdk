import reportTracker from "../../utils/reportTracker";

// 判断文档是否加载
let hasAlreadyCollected = false     
function observeEvent(entryType: string) {
    function entryHandler(list:any) {
        const data = list.getEntries ? list.getEntries() : list
        for (const entry of data) {
            // console.log(entry);
            if (entryType === 'navigation') {
                if (hasAlreadyCollected) return

                if (observer) {
                    observer.disconnect()
                }

                hasAlreadyCollected = true
            }
            // nextHopProtocol 属性为空，说明资源解析错误或者跨域
            // beacon 用于上报数据，所以不统计。xhr fetch 单独统计
            if (filter(entry.initiatorType)) {
                return
            }

            reportTracker({
                name: entry.name, // 资源名称
                subType: entryType,
                type: 'performance',
                sourceType: entry.initiatorType, // 资源类型
                duration: entry.duration, // 资源加载耗时
                dns: entry.domainLookupEnd - entry.domainLookupStart, // DNS 耗时
                tcp: entry.connectEnd - entry.connectStart, // 建立 tcp 连接耗时
                redirect: entry.redirectEnd - entry.redirectStart, // 重定向耗时
                ttfb: entry.responseStart, // 首字节时间
                protocol: entry.nextHopProtocol, // 请求协议
                responseBodySize: entry.encodedBodySize, // 响应内容大小
                responseHeaderSize: entry.transferSize - entry.encodedBodySize, // 响应头部大小
                resourceSize: entry.decodedBodySize, // 资源解压后的大小
                startTime: performance.now(),
            })
        }
    }

    let observer: PerformanceObserver
    if (!!window.PerformanceObserver) {
        observer = new PerformanceObserver(entryHandler)
        observer.observe({ type: entryType, buffered: true })
    } else {
        const data = window.performance.getEntriesByType(entryType)
        entryHandler(data)
    }

}

export default function observeEntries() {
    if (document.readyState === "complete") {
        console.log("complete");
        observeEvent('resource')
        observeEvent('navigation')
    } else {
        window.addEventListener("load", () => {
            console.log("load");
            observeEvent('resource')
            observeEvent('navigation')
        });
    }
}

// 不统计以下类型的资源
const preventType = ['fetch', 'xmlhttprequest', 'beacon']
function filter(type: string) {
    return preventType.includes(type)
}
