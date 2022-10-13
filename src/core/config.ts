
const config:any = {
    sdkVersion:'',
    appid:'',
    uuid: '',
    requestUrl: '',
    isImmediate: false,
    extra: null,
}

export default config

export function setConfig(options:any) {
    for (const key in config) {
        if (options[key]) {
            config[key] = options[key]
        }
    }
}