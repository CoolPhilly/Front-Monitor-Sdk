import reportTracker from "../../utils/reportTracker";
export default function fpFcpPaint() {
    const entryHandler = (list: any) => {
        for (const entry of list.getEntries()) {
            if (entry.name === "first-paint") {
                observer.disconnect();
                const json = entry.toJSON()
                delete json.duration

                const reportData = {
                    ...json,
                    subType: 'FP',
                    type: 'performance',
                    pageURL: location.href,
                }
                reportTracker(reportData);
            }

            if (entry.name === "first-contentful-paint") {
                observer.disconnect();
                const json = entry.toJSON()
                delete json.duration

                const reportData = {
                    ...json,
                    subType: 'FCP',
                    type: 'performance',
                    pageURL: location.href,
                }
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
