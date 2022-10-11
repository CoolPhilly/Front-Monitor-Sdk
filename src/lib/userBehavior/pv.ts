import reportTracker from "../../utils/reportTracker";


export default function pv() {
    reportTracker({
        type: 'behavior',
        subType: 'pv',
        startTime: performance.now(),
        pageURL: location.href,
        referrer: document.referrer,
    })
}