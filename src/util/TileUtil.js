var Promise=require('bluebird')
var async=require('async')
var Canvas = require('canvas')
var Request=require('request')
var Stream=require('stream')
const Util={};
/**
 *
 * @param url
 */
Util.requestImageAsBuffer=function(url){
    return new Promise(function(resolve,reject){
        var outStream = Stream.Writable();
        var temp={};
        temp.start =new Date().getTime();
        const supportedHeader={
            'image/png':true,
            'image/jpeg':true
        }
        outStream.write = function(data) {
            if(temp.hasOwnProperty('buffer')){
                var totalLen=temp.length+data.length;
                temp.buffer=Buffer.concat([temp.buffer,data],totalLen)
            }else{
                temp.buffer=data;
            }
            temp.length=temp.buffer.length;
        };
        outStream.end=function(){
            if(supportedHeader.hasOwnProperty(outStream._content_type)){
                // console.log('请求图片:'+url+'耗时='+(new Date().getTime()-temp.start)+'ms');
                resolve(temp.buffer)
            }else{
                reject(new Error(new String(temp.buffer,'utf-8')));
            }
        }
        var req=Request.get({
            url:url,
            timeout:30*1000,
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36'
            }
        });
        req.on('error', function(err) {
            reject(err);
        });
        req.on('response', function(response) {
            outStream._content_type=response.headers['content-type'];
        });
        req.pipe(outStream);
    });
}

/**
 *
 * @param tileList {Array} tileList
 * @param canvas_ctx {Object} canvas context
 * @param gentleInterval {Number} gentle interval between requests ,default 30
 * @param loggerFn {Function}
 */
Util.requestAndDrawTile=function(tileList,canvas_ctx,gentleInterval,loggerFn){
    return new Promise(function(resolve,reject){
        var tasks=[],
            tileListLen=tileList.length,
            temp={};
        temp.total=tileListLen;
        temp.count=0;
        canvas_ctx.imageSmoothingEnabled = true;
        for(var i=tileListLen-1;i>=0;i--){
            var tile=tileList[i];
            var task=function(cb){
                var tile=arguments.callee.tile;
                var downloadCallback=function(data){
                    temp.count++;
                    loggerFn(null,' > progress :'+temp.count+'/'+temp.total+'=>'+JSON.stringify(tile));
                    var image=new Canvas.Image();
                    try{
                        image.src=data;
                    }catch(e){
                        loggerFn(e)
                    }
                    canvas_ctx.drawImage(image,
                        tile.position[0],
                        tile.position[1],
                        tile.width,
                        tile.height);
                    setTimeout(function(){
                        cb(null);
                    },gentleInterval||30)
                }
                var downloadErrorCallback=function(err){
                    loggerFn(err)
                    var maxAttamptCount=5;
                    if(tile.attamptCount<maxAttamptCount){//试不过三
                        tile.attamptCount+=1;
                        loggerFn(null,' > retrying :'+tile.url+'  count='+tile.attamptCount)
                        Util.requestImageAsBuffer(tile.url).then(downloadCallback).catch(downloadErrorCallback);
                    }else{
                        loggerFn(null,' > fail to download  :'+tile.url + 'after '+maxAttamptCount+' attampts !')
                        cb(null);
                    }
                }
                Util.requestImageAsBuffer(tile.url).then(downloadCallback).catch(downloadErrorCallback);
                tile.attamptCount=1;
            }
            task.tile=tile;
            tasks.push(task);
        }
        async.parallelLimit(tasks,5,function(err,result){
            if(err){
                reject(err);
            }else{
                loggerFn(null, '> tile count:'+tileList.length)
                resolve({});
            }
        });
    });
}

module.exports=Util;