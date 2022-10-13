/**
 * @requestUrl 上报地址
 * @isImmediate 是否及时上报
 * @sdkVersion sdk版本
 * @userbehavior 用户行为上报 
 * @baseError 错误监控
 * @performance 性能监控
 * @extra 用户自定义字段(对象)
 */
 export interface DefaultOptons {
    appid:string;
    uuid: string | undefined;
    requestUrl: string | undefined;
    isImmediate: boolean;
    sdkVersion: string | number;
    userbehavior: boolean;
    baseError: boolean;
    performance: boolean;
    extra: Record<string, any> | undefined;
}

// Partial代表将属性变为可选属性
export interface Options extends Partial<DefaultOptons> {
    appid: string;
    requestUrl: string; // 使该属性变为必选属性
}

export enum TrackerConfig {
    version = "1.0.0",
}

