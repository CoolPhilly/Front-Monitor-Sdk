/**
 * @requestUrl 上报地址
 * @isImmediate 是否及时上报
 * @sdkVersion sdk版本
 * @userbehavior 用户行为上报
 * @domTracker DOM元素上报 携带 Tracker-key 点击事件上报
 * @jsError js 和 promise 报错异常上报
 * @requestTracker 网络请求异常上报
 * @screenTracker 白屏上报
 * @resourceError 静态资源加载异常上报
 * @performanceIndex 页面性能指标上报
 * @extra 用户自定义字段(对象)
 */
interface DefaultOptons {
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
