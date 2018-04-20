
const Util={}

/**
 *
 * @param dest
 * @param src
 * @param deep
 */
Util.extend=function(dest,src,deep){
    if(Object.prototype.toString.call(dest)==='[object Object]'
        &&Object.prototype.toString.call(src)==='[object Object]'){
        for(var k in src){
            if(Util.isObject(src[k])
                &&Util.isObject(dest[k])&&deep===true){
                Util.extend(dest[k],src[k],true);
            }else{
                dest[k]=src[k];
            }
        }
    }
    return dest;
}

/**
 *
 * @param dest
 * @param src
 * @param deep
 */
Util.extendCopy=function(dest,src,deep){
    var temp=Util.extend({},dest,deep);
    return Util.extend(temp,src,deep);
}

/**
 *
 * @param str
 * @param data
 * @returns {*|string|XML|void}
 */
Util.template= function(str, data) {
    const templateRe = /\{ *([\w_-]+) *\}/g;
    return str.replace(templateRe, function (str, key) {
        var value = data[key];
        if (value === undefined) {
            throw new Error('No value provided for variable ' + str);

        } else if (typeof value === 'function') {
            value = value(data);
        }
        return value;
    });
}


Util.isObject=function(obj){
    return Object.prototype.toString.call(obj)==='[object Object]';
}

Util.isArray=function(obj){
    return Object.prototype.toString.call(obj)==='[object Array]';
}

Util.isFunction=function(obj){
    return Object.prototype.toString.call(obj)==='[object Function]';
}

module.exports=Util;