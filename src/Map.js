const async=require('async')
const Canvas=require('canvas')
var Promise=require('bluebird')
const Class=require('./lang/Class')
const Layer=require('./layer/Layer')
const Util=require('./util/Util')
const CRS=require('./crs/index')
const Geometry=require('./geometry/index')
const logger=require('./logger')
const MapnikUtil=require('./util/MapnikUtil')
const mapnik = require('mapnik')
/**
 * Map
 */
class Map extends Class{
    /**
     *
     * @param opts
     */
    constructor(opts){
        super();
        //
        let options={
            zoom:5,
            minZoom:0,
            maxZoom:20,
            center:[0,0],
            crs:CRS.CRS3857,
            extent:null,
            extentPadding:[10,10],//padding horizontal padding vertical
            width:256,
            height:256
        }
        this.options=Util.extend(options,opts);
        //
        this.layers=[];
        //
        let extent=this.getExtent();
        if(Util.isArray(extent)
            &&extent.length===4){
            this._updateCenterZoomFromExtent(extent);
        }else{
            this._updateExtentFromCenterZoom();
        }
    }

    /**
     *
     * @private
     */
    _updateExtentFromCenterZoom(){
        let crs=this.getCRS(),
            center=this.getCenter(),
            zoom=this.getZoom();
        let pixelCenter=crs.toPixelPoint(new Geometry.Point(center[0],center[1]),zoom),
            pixelNw=new Geometry.Point(pixelCenter.x-this.options.width/2,pixelCenter.y-this.options.height/2),
            pixelSe=new Geometry.Point(pixelCenter.x+this.options.width/2,pixelCenter.y+this.options.height/2);
        let mapNw=crs.toMapPoint(pixelNw,zoom),
            mapSe=crs.toMapPoint(pixelSe,zoom);
        this.options.extent= [mapNw.x,mapSe.y,mapSe.x,mapNw.y];
    }

    /**
     *
     * @private
     */
    _updateCenterZoomFromExtent(extent){
        let center=[(extent[0]+extent[2])/2,(extent[1]+extent[3])/2];
        this.options.center=center;
        //
        let crs=this.getCRS(),
            zoom=this.getZoom(),
            extentPadding=this.options.extentPadding;
        let pixelNw=crs.toPixelPoint(new Geometry.Point(extent[0],extent[3]),zoom),
            pixelSe=crs.toPixelPoint(new Geometry.Point(extent[1],extent[2]),zoom);
        let targetWidth=Math.abs(pixelNw.x-pixelSe.x),
            targetHeight=Math.abs(pixelSe.y-pixelNw.y),
            curWidth=this.options.width+extentPadding[0]*2,
            curHeight=this.options.height+extentPadding[1]*2;
        let scaleX=curWidth/targetHeight,
            scaleY=curHeight/targetHeight,
            scale=Math.max(scaleX,scaleY);
        var targetZoom = crs.zoom(scale * crs.scale(zoom));
        this.options.zoom=Math.round(targetZoom);
    }
    /**
     *
     * @returns {Array|*}
     */
    getCenter(){
        return this.options.center;
    }

    /**
     *
     * @returns {number|*}
     */
    getZoom(){
        return this.options.zoom;
    }

    /**
     *
     * @returns {*}
     */
    getCRS(){
        return this.options.crs;
    }

    getExtent(){
        return this.options.extent;
    }
    /**
     *
     * @param layer
     */
    addLayer(layer){
        if(layer instanceof Layer){
            this.layers.push(layer);
            layer.addTo(this);
        }else{
            throw(new Error('type error !'))
        }
    }

    /**
     *
     * @param layer
     */
    removeLayer(layer){
        if(layer instanceof Layer){
            this.layers.push(layer);
            layer.remove(this);
            //
            for(var i=this.layers.length-1;i>=0;i--){
                if(this.layers[i]===layer){
                    this.layers.splice(i,1);
                    break;
                }
            }
        }else{
            throw(new Error('type error !'))
        }
    }

    /**
     *
     * @returns [pixelMin,pixelMax]
     */
    getPixelBound(zoom){
        let center=this.getCenter(),
            centerPt=new Geometry.Point(center[0],center[1]),
            centerPixel=this.getCRS().toPixelPoint(centerPt,zoom),
            pixelNw=new Geometry.Point(centerPixel.x-this.options.width/2,centerPixel.y-this.options.height/2),
            pixelSe=new Geometry.Point(centerPixel.x+this.options.width/2,centerPixel.y+this.options.height/2);
        return [pixelNw,pixelSe];
    }
    /**
     *
     * @param opts {Object}
     */
    render(opts){
        return new Promise(function(resolve,reject){
            let scope={};
            scope.id=this.id;
            scope.start=new Date().getTime();
            scope.size=[this.options.width,this.options.height];
            //loop each layer
            var tasks=[],
                mapnikRenderLayers=[];
            scope.mapnikRenderLayers=mapnikRenderLayers;
            scope.map=this;
            for(let i=0;i<this.layers.length;i++){
                let layer=this.layers[i];
                if(layer.getRenderer()==='mapnik'){
                    mapnikRenderLayers.push(layer);
                    continue;
                }
                let task=function(cb){
                    let canvas=new Canvas(scope.size[0], scope.size[1]);
                    layer.render(canvas).then(function(result){
                        cb(null,result);
                    });
                };
                tasks.push(task);
            }
            //mapnik tasks
            if(mapnikRenderLayers.length>0){
                let task=function(cb){
                    let width=scope.map.options.width,
                        height=scope.map.options.height,
                        crs=scope.map.getCRS();
                    let mapnik_map=new mapnik.Map(width,height);
                    let xml='<Map srs="' + crs.proj4 + '">';
                    for(let k=0;k<scope.mapnikRenderLayers.length;k++){
                        let layer=scope.mapnikRenderLayers[k];
                        mapnik_map.add_layer(layer.getMapnikLayer());
                        xml+=layer.getMapnikStyleXml();
                    }
                    xml+='</Map>';
                    mapnik_map.fromStringSync(xml);
                    mapnik_map.extent=scope.map.getExtent();
                    var image = new mapnik.Image(width, height);
                    mapnik_map.render(image, function(err, im) {
                        if(err){
                            cb(err);
                        }else{
                            let buffer=im.encodeSync('png');
                            cb(null,{
                                type:'buffer',
                                data:buffer,
                                opacity:1
                            });
                        }
                    });
                }.bind(this);
                tasks.push(task);
            }
            //
            async.parallelLimit(tasks,1,function(cb,results){
                var canvas=new Canvas(scope.size[0], scope.size[1]),
                    canvas_ctx=canvas.getContext('2d');
                canvas_ctx.imageSmoothingEnabled=true;
                for(var i=0;i<results.length;i++){
                    var result=results[i];
                    canvas_ctx.beginPath();
                    canvas_ctx.globalAlpha=result.opacity;
                    var image=new Canvas.Image();
                    if(result.type==='canvas'){
                        try{
                            image.src=result.data.toDataURL('image/png');
                        }catch(e){
                            logger.error(e)
                        }
                    }else if(result.type==='buffer'){
                        try{
                            image.src=result.data;
                        }catch(e){
                            logger.error(e)
                        }
                    }
                    canvas_ctx.drawImage(image,0,0,scope.size[0],scope.size[1]);
                }
                logger.info(scope.id+' > all layers rendered in '+(new Date().getTime()-scope.start)+' ms');
                resolve(canvas);

            });
        }.bind(this));
    }
}

module.exports=Map;