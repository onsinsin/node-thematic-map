const Promise=require('bluebird')
const Layer =require('./Layer')
const Geometry=require('../geometry/index')
const logger=require('../logger')
const Util=require('../util/Util')
const TileUtil=require('../util/TileUtil')
/**
 *
 */
class ImageLayer extends Layer{
    constructor(opts){
        let options={
            name:'ImageLayer-'+new Date().getTime(),
            tileSize:256,
            url:'',
            subdomains: 'abc'.split(''),
            minZoom: 0,
            maxZoom: 18,
            zoomOffset: 0,
            zoomReverse: false
        }
        Util.extend(options,opts||{},true);
        super(options);
        //
    }

    /**
     * @override
     * @param opts
     */
    render(canvas){
        var loggerFn=function(err,msg){
            if(err){
                logger.error(this.id+'>>'+err.message);
            }else{
                logger.info(this.id+'>>'+msg);
            }
        }.bind(this);
        return new Promise(function(resolve,reject){
            var tileList=this._getTilesToLoad();
            if(tileList.length>0){
                TileUtil.requestAndDrawTile(tileList,canvas.getContext('2d'),30,loggerFn).then(function () {
                    resolve({
                        type:'canvas',
                        data:canvas,
                        opacity:this.options.opacity
                    })
                }.bind(this));
            }else{
                logger.warn('no tile to get ')
                resolve(null);
            }
        }.bind(this));
    }

    /**
     * 渲染方式
     * @returns {string}
     */
    getRenderer(){
        return 'canvas';
    }
    /**
     *
     * @param coords
     * @param coords.x
     * @param coords.y
     * @param coords.z
     */
    _getTileUrl(coords){}

    /**
     *
     * @param opts
     * @returns {Array}
     * @private
     */
    _getTilesToLoad(){
        var zoom=this.map.getZoom(),
            tileSize=this.options.tileSize;
        //support none 256 tilesize
        var zoomPlus=(Math.log(tileSize/256))/Math.log(2);
        var pixelBound=this.map.getPixelBound(zoom+zoomPlus);
        var tileRange=this._pixelBoundToTileRange(pixelBound),
            tileList=[],
            width=tileSize,
            height=tileSize;
        for (var j = tileRange[0].y; j <= tileRange[1].y; j++) {
            for (var i = tileRange[0].x; i <= tileRange[1].x; i++) {
                var coords = new Geometry.Point(i, j);
                coords.z = zoom;
                if (!this._isValidTile(coords)) { continue; }
                var tile={},
                    xGap=i-tileRange[0].x,
                    yGap=j-tileRange[1].y,
                    position=coords.scaleBy(new Geometry.Point(tileSize,tileSize))
                        .subtract(pixelBound[0]).round();
                tile.coords=coords;
                tile.url=this._getTileUrl(tile.coords);
                tile.width=width;
                tile.height=height;
                tile.position=[position.x,position.y];
                tileList.push(tile);
            }
        }
        return tileList;
    }

    /**
     *
     * @param pixelBound
     * @returns {Array} [min,max]
     * @private
     */
    _pixelBoundToTileRange(pixelBound){
        var tempPoint={
            x:this.options.tileSize,
            y:this.options.tileSize
        }
        return [pixelBound[0].unscaleBy(tempPoint).floor(),
            pixelBound[1].unscaleBy(tempPoint).ceil().subtract(new Geometry.Point(1,1))];
    }

    /**
     *
     * @param coords
     * @returns {boolean}
     * @private
     */
    _isValidTile(coords){
        //todo
        return true;
    }
    /**
     *
     * @returns {*}
     * @private
     */
    _getZoomForUrl() {
        let zoom = this.map.getZoom(),
            maxZoom = this.options.maxZoom,
            zoomReverse = this.options.zoomReverse,
            zoomOffset = this.options.zoomOffset;
        if (zoomReverse) {
            zoom = maxZoom - zoom;
        }
        return zoom + zoomOffset;
    }

    /**
     *
     * @returns {*}
     * @private
     */
    _getSubdomain(){
        var random=parseInt(Math.random()*1000);
        var index=random%this.options.subdomains.length;
        return this.options.subdomains[index];
    }

    /**
     *
     * @param x
     * @param y
     * @param z
     * @param tileSize
     * @returns {[*,*,*,*]}
     * @private
     */
    _xyzToExtent(x,y,z){
        var tileSize=this.options.tileSize;
        var min=this.map.getCRS().toMapPoint({
            x:x * tileSize,
            y:(y + 1) * tileSize
        },z);
        var max=this.map.getCRS().toMapPoint({
            x:(x + 1) * tileSize,
            y:y * tileSize
        },z);
        var bbox = [min.x,min.y,max.x,max.y];
        return bbox;
    }
}
/**
 *
 * @type {number}
 */
ImageLayer.type=1;

module.exports=ImageLayer;