const Promise=require('bluebird')
const Layer =require('./Layer')
const mapnik =require('mapnik')
const Geometry=require('../geometry/index')
const logger=require('../logger')
const Util=require('../util/Util')
const TileUtil=require('../util/TileUtil')
/**
 *
 */
class DataLayer extends Layer{
    constructor(opts){
        let options={
            name:'DataLayer-'+new Date().getTime(),
            styleXml:'',
            styles:[]
        }
        Util.extend(options,opts||{});
        super(options);
        //
        this.list=[];
    }

    /**
     *
     * @param list {Array | Object} Feature||FeatureList
     */
    addFeatures(list){
        let dataList=list;
        if(Util.isObject(list)){
            dataList=[list];
        }
        this.list=this.list.concat(dataList);
    }

    /**
     * @override
     * @param opts
     */
    render(canvas){
        return new Promise(function(resolve,reject){
            resolve();
        }.bind(this));
    }

    /**
     *
     * @returns {string|*|string}
     */
    getMapnikStyleXml(){
        return this.options.styleXml;
    }
    /**
     *
     */
    getMapnikLayer(){
        let layer = new mapnik.Layer(this.options.name,this.options.crs.proj4 );
        layer.datasource=this.getDataSrouce();
        layer.styles=this.options.styles;
        return layer;
    }
    /**
     *
     * @returns {*}
     * @private
     */
    getDataSrouce(){
        let featureCol={
            type:'FeatureCollection',
            features:this.list
        }
        let dsObj={
            type:'geojson',
            inline: JSON.stringify(featureCol)
        }
        let ds=new mapnik.Datasource(dsObj);
        return ds;
    }

    /**
     * 渲染方式
     * @returns {string}
     */
    getRenderer(){
        return 'mapnik';
    }
}
/**
 *
 * @type {number}
 */
DataLayer.type=2;

module.exports=DataLayer;