import defaultReport from "../../utils/defaultReport";
import config from "../../core/config";

export default function pageAccessDuration() {
    window.addEventListener('beforeunload',() => {
        defaultReport({
            type: 'behavior',
            subType: 'page-access-duration',
            startTime: performance.now(),
            pageURL: location.href,
        },config.requestUrl)
    }, true)
}