/**
 * @requestUrl 上报地址
 * @isImmediate 是否及时上报
 * @sdkVersion sdk版本
 * @userbehavior 用户行为上报
 * @baseError 错误监控
 * @performance 性能监控
 * @extra 用户自定义字段(对象)
 */
interface DefaultOptons {
    appid: string;
    uuid: string | undefined;
    requestUrl: string | undefined;
    isImmediate: boolean;
    sdkVersion: string | number;
    userbehavior: boolean;
    baseError: boolean;
    performance: boolean;
    extra: Record<string, any> | undefined;
}
interface Options extends Partial<DefaultOptons> {
    appid: string;
    requestUrl: string;
}

declare class Tracker {
    options: Options;
    constructor(options: Options);
    private initDef;
    setUserId<T extends DefaultOptons["uuid"]>(uuid: T): void;
    sendReport<T>(data: T, url: string | undefined): void;
    private installTracker;
}

export { Tracker as default };
