/**
 * Created by Admin on 2017/6/5.
 * 日志
 */
var log4js = require('log4js');
var globalConfig=require('../config/config')
var logConfig=require('../config/log');
//开发模式输出到控制台
if(globalConfig.runMode=='dev'){
    var consoleKey='console';
    logConfig.appenders[consoleKey]={
        type:'console'
    };
    logConfig.categories[Object.keys(logConfig.categories)[0]].appenders.push(consoleKey);
}
log4js.configure(logConfig);
var logger=log4js.getLogger();
//
logger.info('logger initialized……');
//
module.exports=logger;

