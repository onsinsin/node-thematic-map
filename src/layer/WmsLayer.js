const ImageLayer =require('./ImageLayer')
const Util=require('../util/Util')
/**
 *
 */
class WmsLayer extends ImageLayer{
    constructor(opts){
        let options={
            name:'WmsLayer-'+new Date().getTime(),
            service:'WMS',
            request:'GetMap',
            layers:'',
            styles:'',
            format:'image/png',
            transparent:true,
            version:'1.1.1',
        }
        Util.extend(options,opts||{},true);
        super(options);
        //

    }

    /**
     * @override
     * @param coords
     * @param coords.x
     * @param coords.y
     * @param coords.z
     */
    _getTileUrl(coords){
        const keys={
            service:true,
            request:true,
            layers:true,
            styles:true,
            format:true,
            transparent:true,
            version:true,
            srs:true,
            bbox:true,
            width:true,
            height:true
        }
        //caculate bbox
        let bbox=this._xyzToExtent(
            coords.x,coords.y,coords.z);
        //
        let suffix='';
        let opts=Util.extend({},this.options);
        opts.width=opts.tileSize;
        opts.height=opts.tileSize;
        opts.srs=opts.srs||this.map.getCRS().code;
        for(var k in opts){
            if(keys.hasOwnProperty(k)){
                suffix+=k+'='+opts[k];
                suffix+='&';
            }
        }
        let temp=JSON.stringify(bbox).substr(1);
        temp=temp.substr(0,temp.length-1)
        suffix+='bbox='+temp;
        let url=this.options.url;
        if(url.indexOf('?')<0)
            url+='?';
        else{
            url+='&';
        }
        return url+suffix;
    }
}


/**
 *
 * @type {number}
 */
WmsLayer.type=11;

module.exports=WmsLayer;