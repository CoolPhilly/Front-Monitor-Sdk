import reportTracker from "../../utils/reportTracker";
export default function lcpPaint() {

    const entryHandler = (list:any) => {

        if (observer) {
            observer.disconnect()
        }
        
        for (const entry of list.getEntries()) {
            const json = entry.toJSON()
            delete json.duration

            const reportData = {
                ...json,
                target: entry.element?.tagName,
                name: entry.entryType,
                subType: 'LCP',
                type: 'performance',
                pageURL: location.href,
            }
            
            reportTracker(reportData)
        }
    }

    const observer = new PerformanceObserver(entryHandler)
    observer.observe({ type: 'largest-contentful-paint', buffered: true })

}