const Class=require('../lang/Class')
/**
 *
 */
class CRS extends Class{
    /**
     *
     */
    constructor(){
        super();
        //
        this.transformation=null;
        this.code=null;
        this.proj4=null;
    }

    /**
     *
     * @param point
     * @param zoom
     */
    toPixelPoint(point,zoom){
        var scale = this.scale(zoom);
        return this.transformation.transform(point, scale);
    }

    /**
     *
     * @param point
     * @param zoom
     */
    toMapPoint(point,zoom){
        var scale = this.scale(zoom);
        return this.transformation.untransform(point, scale);
    }

    /**
     *
     * @param zoom
     * @returns {number}
     */
    scale(zoom){
        return 256 * Math.pow(2, zoom);
    }

    /**
     *
     * @param scale
     * @returns {number}
     */
    zoom(scale){
        return Math.log(scale / 256) / Math.LN2;
    }
}
module.exports=CRS;