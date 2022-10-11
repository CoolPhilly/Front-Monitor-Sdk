import pv from './pv'
import pageChange from './pageChange'
import pageAccessDuration from './pageAccessDuration'


export default function userBehavior() {
    pv()
    pageAccessDuration()
    pageChange(["pushState", "replaceState", "popstate","hashchange"])

}