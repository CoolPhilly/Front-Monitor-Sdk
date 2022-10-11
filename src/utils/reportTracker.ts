import defaultReport from "./defaultReport";
import timedReport from "./timedReport";
import config from "../core/config";

function reportTracker(params: any, url?: string ) {
    url = !!url ? url : config.requestUrl;

    if (config.isImmediate) {
        defaultReport(params, url)
    } else {
         // 定时上报
        timedReport(params, url);
    }
}

export default reportTracker;
