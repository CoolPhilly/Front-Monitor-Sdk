import type { DefaultOptons, Options } from "../type/index";
import { setConfig } from "./config";
import { TrackerConfig } from "../type/index";
import userBehavior from "../lib/userBehavior/index";
import baseError from "../lib/error/index"
import performance from "../lib/performance/index";

import reportTracker from "../utils/reportTracker";

export default class Tracker {
    public options: Options;

    constructor(options: Options) {
        this.options = Object.assign(this.initDef(), options);
        setConfig(this.options)
        this.installTracker();
    }
    // 初始化函数
    private initDef(): DefaultOptons {
        return <DefaultOptons>{
            sdkVersion: TrackerConfig.version,
        };
    }

    //设置用户id
    public setUserId<T extends DefaultOptons["uuid"]>(uuid: T) {
        this.options.uuid = uuid;
    }
    //手动上报
    public sendReport<T>(data: T, url: string | undefined) {
        reportTracker(data, url);
    } 

    private installTracker() {
        // 行为监控
        if (this.options.userbehavior) {
            userBehavior()
        }
        // 报错监控
        if (this.options.baseError) {
            baseError()
        }
        // 性能监控
        if (this.options.performance) {
            performance()
        }
    }
}
