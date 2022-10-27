// import observeEntries from './observeEntries'
import fpFcpPaint from './fpFcp'
import lcpPaint from './lcp'
import pageLoad from './pageLoad'
import newXhrSendOpen from './xhr'
import newFetch from './fetch'
import observeEntries from './observeEntries'


export default function performance() {
    fpFcpPaint()
    lcpPaint()
    pageLoad()
    newXhrSendOpen()
    newFetch()
    observeEntries()
}