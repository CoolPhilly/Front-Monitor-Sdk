import config from "../core/config";

// 兼容性判断
const compatibility = {
    canUseSendBeacon: !!navigator.sendBeacon,
};

export default function defaultReport<T>(params: any, url: string | undefined ) {

    url = !!url ? url : config.requestUrl;
    if(!url) console.log('请设置上传 url 地址');
    

    params = Object.assign(params, { uuid: config.uuid, sdkversion: config.sdkVersion }, { reportTime: new Date().getTime() });

    console.log(params);

    if (compatibility.canUseSendBeacon && params) {
        let headers = {
            type: "application/x-www-form-urlencoded",
        };
        //封装blob
        let blob = new Blob([JSON.stringify(params)], headers);
        navigator.sendBeacon(url as string, blob);
    } else {
        // 使用img标签上报
        const img = new Image();
        img.src = `${url}?data=${encodeURIComponent(JSON.stringify(params))}`;
    }
}
