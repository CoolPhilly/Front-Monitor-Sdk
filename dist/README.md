# Front-Monitor-Sdk

这是一个前端监控的埋点SDK

使用方法如下

```javascript
import Tracker from 'front-monitor-sdk'

new Tracker({

  appid: '', // 监控app的id
  userbehavior: true, //用户行为上报
  isImmediate:true, // 及时上报
  baseError: true, // 资源加载失败错误、js 错误、promise 错误、Vue报错
  performance: true, // 性能上报 如 FP、FTP、HTTP请求
  requestUrl: "http://127.0.0.1:3000/api/tracker", //上报地址
  extra: {
    vue: app,
   }  // 透传字段 监控Vue报错需要

 })
```

