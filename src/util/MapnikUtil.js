const mapnik = require('mapnik')
const path=require('path')
mapnik.register_default_fonts();
mapnik.register_system_fonts();
// register postgis plugin
mapnik.register_datasource(
    path.join(mapnik.settings.paths.input_plugins,'geojson.input'));
const Util={};
/**
 *
 * @param key
 */
Util.consoleFonts=function(key){
    let fonts=mapnik.fonts();
    for(var k in fonts){
        if(fonts[k].indexOf(key)>=0){
            console.log(fonts[k])
        }
    }
}
module.exports=Util;