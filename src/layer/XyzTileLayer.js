const ImageLayer =require('./ImageLayer')
const Util=require('../util/Util')
/**
 *
 */
class XyzTileLayer extends ImageLayer{
    constructor(opts){
        super(opts);
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
        var data = {
            x: coords.x,
            y: coords.y,
            s:this._getSubdomain(),
            z: this._getZoomForUrl()
        };
        return Util.template(this.options.url, Util.extend(data, this.options));
    }
}

XyzTileLayer.prototype.options={}
/**
 *
 * @type {number}
 */
XyzTileLayer.type=12;

module.exports=XyzTileLayer;