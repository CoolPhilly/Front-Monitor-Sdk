import reportTracker from "../../utils/reportTracker"

export default function newXhrSendOpen() {
    // open方法
    let oldOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method: string, url: any, async: boolean = true, username?: string, password?: string) {
        this.method = method
        this.url = url
        oldOpen.apply(this, [method, url, async, username, password])
    }
    // 记录send方法
    let oldSend = XMLHttpRequest.prototype.send

    XMLHttpRequest.prototype.send = function (...args) {
        this.startTime = Date.now()
        const handler = (eventType: string) => () => {
            this.endTime = Date.now()
            this.duration = this.endTime - this.startTime
            const { status, duration, startTime, endTime, url, method } = this
            const reportData = {
                status,// 状态码
                startTime,
                endTime,
                duration,
                eventType: eventType, // 事件类型
                url,
                method: (method || 'GET').toUpperCase(),
                subType: 'xhr',
                type: 'performance',
                response: this.response ? JSON.stringify(this.response) : "",
                param: args[0] || "",
            };
            reportTracker(reportData)
        };

        // 监听load、error、abort事件
        this.addEventListener("load", handler("load"), false); // load 事件表示服务器传来的数据接收完毕
        this.addEventListener("error", handler("error"), false); // error 事件表示请求出错
        this.addEventListener("abort", handler("abort"), false); // abort 事件表示请求被中断（比如用户取消请求）


        return oldSend.apply(this, args);
    };
}
