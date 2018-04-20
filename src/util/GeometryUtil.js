const Util=require('./Util')
const GeometryUtil={
    /**
     *
     * @param bbox {Array} [xmin,ymin,xmax,ymax]
     * @returns {string}
     */
    bbox2WktStr:function(bbox){
        if(!Util.isArray(bbox)||bbox.length!=4){
            throw(new Error('must be array of 4'))
        }
        var wkt='POLYGON((';
        wkt+=bbox[0]+' '+bbox[1]+',';
        wkt+=bbox[2]+' '+bbox[1]+',';
        wkt+=bbox[2]+' '+bbox[3]+',';
        wkt+=bbox[1]+' '+bbox[3]+',';
        wkt+=bbox[0]+' '+bbox[1];
        wkt+='))';
        return wkt;
    },
    /**
     *
     * @param bbox {Array} [xmin,ymin,xmax,ymax]
     * @returns {GeoJSON}
     */
    bbox2GeoJSON:function(bbox){
        if(!Util.isArray(bbox)||bbox.length!=4){
            throw(new Error('must be array of 4'))
        }
        var ring=[];
        ring.push([bbox[0],bbox[1]]);
        ring.push([bbox[2],bbox[1]]);
        ring.push([bbox[2],bbox[3]]);
        ring.push([bbox[0],bbox[3]]);
        ring.push([bbox[0],bbox[1]]);
        return {
            type:'Polygon',
            coordinates:[ring]
        }
    }
}

module.exports=GeometryUtil;