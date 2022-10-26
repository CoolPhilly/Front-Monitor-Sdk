const express = require('express')
const db = require('./db/index')
const app = express()
const port = 3001



app.use(express.urlencoded({ extended: false }))
app.get('/', (req, res) => res.send('Hello World!'))
app.post('/tracker', (req, res) => {

  //  第一次见那么长的键  打印在控制台 md我还以为一个字符串对象 浪费时间！！！！！！！！
  
  //  处理上报数据
  let bodyStr = ''
  Object.keys(req.body).forEach( (element) => {
    bodyStr = bodyStr+ element + req.body[element]
  })

  let reportData = JSON.parse(bodyStr)
  // console.log(reportData);


  // 延迟上报处理
  if (Array.isArray(reportData)) {

    let errorArr = []
    let behaviorArr = []
    let performanceResource = []
    let performanceRender = []
    let performanceNetwork = []
    
    for (let index = 0; index < reportData.length - 1; index++) {
      const element = reportData[index];
      if (element.type === 'error') {
        let errorinfo = element.error || element.html || element.reason
        errorArr.push([
          // uuid
          reportData[reportData.length - 1].uuid,
          // appid
          reportData[reportData.length - 1].appid,
          // type
          element.subType,
          // pageURL
          element.pageURL,
          // errorinfo
          errorinfo,
          // time
          timestampToTime(reportData[reportData.length - 1].reportTime)
        ])
      } 
      else if (element.type === 'behavior'){
        behaviorArr.push([
          // uuid
          reportData[reportData.length - 1].uuid,
          // appid
          reportData[reportData.length - 1].appid,
          // type
          element.subType,
          // form
          element.from || element.referrer,
          // to
          element.to || element.pageURL,
          // start
          element.startTime,

          // time
          timestampToTime(reportData[reportData.length - 1].reportTime)
        ])
      }
      else if (element.type === 'performance'){
        if (element.subType === 'resource' || element.subType === 'navigation') {
          performanceResource.push([
            // uuid
            reportData[reportData.length - 1].uuid,
            // appid
            reportData[reportData.length - 1].appid,
            // subType
            element.subType,
            // sourceType
            element.sourceType,
            // url
            element.name,
            // protocol
            element.protocol,
            // dns
            element.dns,
            //duration
            element.duration,
            // redirect
            element.redirect,
            // tcp
            element.tcp,
            // ttfb
            element.ttfb,
            // time
            timestampToTime(reportData[reportData.length - 1].reportTime)
          ])
          } 
        else if (element.subType === 'xhr' || element.subType === 'fetch') {
          performanceNetwork.push([
            // uuid
            reportData[reportData.length - 1].uuid,
            // appid
            reportData[reportData.length - 1].appid,
            // type
            element.subType,

            // url
            element.url,
            // status
            element.status,
            //duration
            element.duration,
            // method
            element.method,
            // time
            timestampToTime(element.startTime)
          ])
        }
        else {
          performanceRender.push([
            // uuid
            reportData[reportData.length - 1].uuid,
            // appid
            reportData[reportData.length - 1].appid,
            // type
            element.subType,

            // pageURL
            element.pageURL,
            //duration
            element.startTime,
            // time
            timestampToTime(reportData[reportData.length - 1].reportTime)
          ])
        }
      }
    }
    // 判断数据是否储存完毕,好了告诉浏览器关闭请求
    let alllength = errorArr.length + behaviorArr.length + performanceResource.length + performanceRender.length + performanceNetwork.length 
    
    if (errorArr.length) {
      const sql = 'INSERT INTO fm_app_error(uuid, appid, type, pageURL,errorinfo,time)VALUES ?'
      // console.log(errorArr);
      db.query(sql, [errorArr], (err, results) => {
        if (err) return res.write(err.message)
        // 判断影响行数是否为正确
        if (results.affectedRows !== errorArr.length) return res.write('errorArr fail!')
        res.write('errorArr success!')
        alllength = alllength - errorArr.length
        if (alllength === 0) res.end('AllSUCESS') 
      })

    }

    if (behaviorArr.length) {
      const sqlstr = 'INSERT INTO fm_app_user(uuid, appid, type, `from`, `to`, start ,time)   VALUES ?'
      // console.log(behaviorArr);
      db.query(sqlstr, [behaviorArr], (err, results) => {
        if (err) return res.write(err.message)
        // 判断影响行数是否为正确
        if (results.affectedRows !== behaviorArr.length) return res.write('behaviorArr fail!')
        res.write('behaviorArr success!')
        alllength = alllength - behaviorArr.length
        if (alllength === 0) res.end('AllSUCESS') 
      })

    }


    if (performanceResource.length) {
      const sqlstr = 'INSERT INTO fm_app_performance_resource(uuid, appid, subType, sourceType, url, protocol,dns,duration,redirect,tcp,ttfb ,time)  VALUES ?'
   
      db.query(sqlstr, [performanceResource], (err, results) => {
        if (err) return res.write(err.message)
        // 判断影响行数是否为正确
        if (results.affectedRows !== performanceResource.length) return res.write('performanceResource fail!')
        res.write('performanceResource success!')
        alllength = alllength - performanceResource.length
        if (alllength === 0) res.end('AllSUCESS') 
      })

    }
    // console.log(performanceRender);
    if (performanceRender.length) {
      const sqlstr = 'INSERT INTO fm_app_performance_render(uuid, appid, type, pageURL, duration,time)  VALUES ?'

      db.query(sqlstr, [performanceRender], (err, results) => {
        if (err) return res.write(err.message)
        // 判断影响行数是否为正确
        if (results.affectedRows !== performanceRender.length) return res.write('performanceRender fail!')

        res.write('performanceRender success!')
        alllength = alllength - performanceRender.length
        if (alllength === 0) res.end('AllSUCESS') 
      })

    }
    if (performanceNetwork.length) {
      const sqlstr = 'INSERT INTO fm_app_performance_network(uuid, appid, type, url, status, duration,method ,time)   VALUES ?'
      // console.log(behaviorArr);
      db.query(sqlstr, [performanceNetwork], (err, results) => {
        if (err) return res.write(err.message)
        // 判断影响行数是否为正确
        if (results.affectedRows !== performanceNetwork.length) return res.write('performanceNetwork fail!')
        
        res.write('performanceNetwork success!')
        alllength = alllength - performanceNetwork.length
        if (alllength === 0) res.end('AllSUCESS') 
      })

    }
    

  } 
  // 及时上报处理
  else {
    if (reportData.type === 'error') {
      let errorinfo = reportData.error || reportData.html || reportData.reason
      // console.log(reportData.subType);
      const sql = 'INSERT INTO fm_app_error set ?'


      db.query(sql, { uuid: reportData.uuid, appid: reportData.appid, type: reportData.subType, pageURL: reportData.pageURL, errorinfo: errorinfo, time: timestampToTime(reportData.reportTime) }, (err, results) => {

        if (err) return res.send(err)
        // 判断影响行数是否为正确
        if (results.affectedRows !== 1) return res.send('发送失败!')
        return res.send('发送成功!')

      })
    }

    else if (reportData.type === 'behavior'){

      const sql = 'INSERT INTO fm_app_user set ?'
      // console.log(reportData);

      db.query(sql, { uuid: reportData.uuid, appid: reportData.appid, type: reportData.subType, from: reportData.referrer || reportData.from, to: reportData.to || reportData.pageURL, start:reportData.startTime, time: timestampToTime(reportData.reportTime) }, (err, results) => {

        if (err) return res.send(err)
        // 判断影响行数是否为正确
        if (results.affectedRows !== 1) return res.send('发送失败!')
        return res.send('发送成功!')

      })

    }

    else if (reportData.type === 'performance') {
      if (reportData.subType === 'resource' || reportData.subType === 'navigation') {
        let parms = {
          // uuid
          uuid: reportData.uuid,
          // appid
          appid: reportData.appid,
          // subType
          subType: reportData.subType,
          // sourceType
          sourceType:reportData.sourceType,
          // url
          url:reportData.name,
          // protocol
          protocol:reportData.protocol,
          // dns
          dns:reportData.dns,
          //duration
          duration:reportData.duration,
          // redirect
          redirect:reportData.redirect,
          // tcp
          tcp:reportData.tcp,
          // ttfb
          ttfb:reportData.ttfb,
          // time
          time:timestampToTime(reportData.reportTime)
        }
          
     

        const sql = 'INSERT INTO fm_app_performance_resource set ?'
        // console.log(reportData);

        db.query(sql, parms, (err, results) => {

          if (err) return res.send(err)
          // 判断影响行数是否为正确
          if (results.affectedRows !== 1) return res.send('发送失败!')
          return res.send('发送成功!')

        })


      }
      else if (reportData.subType === 'xhr' || reportData.subType === 'fetch') {
        let parms = {
          // uuid
          uuid:reportData.uuid,
          // appid
          appid:reportData.appid,
          // type
          type:reportData.subType,

          // url
          url:reportData.url,
          // status
          status:reportData.status,
          //duration
          duration:reportData.duration,
          // method
          method: reportData.method,
          // time
          time:timestampToTime(reportData.startTime)
        }
        const sql = 'INSERT INTO fm_app_performance_network set ?'
        // console.log(reportData);

        db.query(sql, parms, (err, results) => {

          if (err) return res.send(err)
          // 判断影响行数是否为正确
          if (results.affectedRows !== 1) return res.send('发送失败!')
          return res.send('发送成功!')

        })

      }
      else {
        let parms = {
          // uuid
          uuid: reportData.uuid,
          // appid
          appid:reportData.appid,
          // type
          type:reportData.subType,

          // pageURL
          pageURL:reportData.pageURL,
          //duration
          duration: reportData.startTime,
          // time
          time:timestampToTime(reportData.reportTime)
        }

        const sql = 'INSERT INTO fm_app_performance_render set ?'
        // console.log(reportData);

        db.query(sql, parms, (err, results) => {

          if (err) return res.send(err)
          // 判断影响行数是否为正确
          if (results.affectedRows !== 1) return res.send('发送失败!')
          return res.send('发送成功!')

        })


      }
      

    }

  }
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// 时间转换
function timestampToTime(timestamp) {
  var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() + ' ';
  var h = date.getHours() + ':';
  var m = date.getMinutes() + ':';
  var s = date.getSeconds();
  return Y + M + D + h + m + s;
}