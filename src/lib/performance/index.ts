// import observeEntries from './observeEntries'
import fpFcpPaint from './fpFcp'
import lcpPaint from './lcp'
import pageLoad from './pageLoad'
import newXhrSendOpen from './xhr'
import newFetch from './fetch'
import observeEntries from './observeEntries'
// import observeLCP from './observeLCP'
// import observeCLS from './observeCLS'
// import observeFID from './observeFID'
// import observerLoad from './observerLoad'
// import observeFirstScreenPaint from './observeFirstScreenPaint'
// import xhr from './xhr'
// import fetch from './fetch'
// import fps from './fps'
// import onVueRouter from './onVueRouter'
// import config from '../config'

export default function performance() {
    fpFcpPaint()
    lcpPaint()
    pageLoad()
    newXhrSendOpen()
    newFetch()
    observeEntries()
    // observeLCP()
    // observeCLS()
    // observeFID()
    // xhr()
    // fetch()
    // fps()
    // observerLoad()
    // observeFirstScreenPaint()

    // if (config.vue?.Vue && config.vue?.router) {
    //     onVueRouter(config.vue.Vue, config.vue.router)
    // }
}