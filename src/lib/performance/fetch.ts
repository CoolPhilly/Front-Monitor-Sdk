import reportTracker from "../../utils/reportTracker";

const originalFetch = window.fetch
export default function newFetch() {
    window.fetch = function newFetch(url, config) {
        const startTime = Date.now()
        const reportData = {
            duration:0,
            startTime,
            endTime:0,
            url,
            method: (config?.method || 'GET').toUpperCase(),
            status:0,
            success:false,
            subType: 'fetch',
            type: 'performance',
        }

        return originalFetch(url, config)
        .then(res => {
            reportData.endTime = Date.now()
            reportData.duration = reportData.endTime - reportData.startTime

            const data = res.clone()
            reportData.status = data.status
            reportData.success = data.ok

            reportTracker(reportData)

            return res
        })
        .catch(err => {
            reportData.endTime = Date.now()
            reportData.duration = reportData.endTime - reportData.startTime
            reportData.status = 0
            reportData.success = false

            reportTracker(reportData)

            throw err
        })
    }
}
