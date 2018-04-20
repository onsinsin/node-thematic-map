/**
 * Created by onsinsin on 2017/11/17.
 */
var log={
    "level": "INFO",
    "appenders": {
        'node-thematic-map':{
            "type": "file",
            "filename": "../logs/node-thematic-map.log",
            "maxLogSize": 10 * 1024 * 1024,
            "backups": 10
        }
    },
    "categories":{
        "default":{
            "appenders":["node-thematic-map"],
            "level":"info"
        }
    }
}
module.exports=log;