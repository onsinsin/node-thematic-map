/**
 * 公共的配置
 *
 **/
var config = {
    "serverPort": 3000,
    "runMode": "dev",//run=运行时;dev=开发
    "public":"../public",//static dir
    "db":{
        "url":"mongodb://192.168.91.44:27017/mapEditor",
        "options":{
            "auth":{
                "user":"test",
                "password":"123456"
            },
            "poolSize":20
        }
    }
}
module.exports = config;