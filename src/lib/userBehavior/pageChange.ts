import reportTracker from "../../utils/reportTracker";

//keyof 获取的是类型
const createHistoryEvent = <T extends keyof History>(type: T) => {
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

export default function pageChange(customEventList: string[]) {
    customEventList.forEach((item) => {
            let from = ''
            window.addEventListener(item, () => {
                const to = location.href
                reportTracker({
                    from,
                    to,
                    type: 'behavior',
                    subType: item,
                    startTime: performance.now(),
                })
                from = to
            }, true)
    });

}
