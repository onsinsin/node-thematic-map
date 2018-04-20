const CRS=require('./CRS')
const Transformation=require('./Transformation')
/**
 *
 */
class CRS4326 extends CRS{
    /**
     *
     */
    constructor(){
        super();
        //
        this.code= 'EPSG:4326';
        this.proj4='+proj=longlat +datum=WGS84 +no_defs';
        var scale = 0.5 / (Math.PI *6378137);
        this.transformation=new Transformation(1 / 180, 1, -1 / 180, 0.5);
    }
}

module.exports=CRS4326;