const Canvas=require('canvas')
const Promise=require('bluebird')
const Class=require('./lang/Class')
const Util=require('./util/Util')
const logger=require('./logger')
/**
 *
 */
class Frame extends Class{
    /**
     *
     * @param opts
     */
    constructor(opts){
        super();
        //
        let options={
            width:1400,
            height:900,
            background:{
                color:'rgba(255,255,255,255)'
            },
            frameBackground:{
                color:'rgba(200,200,200,255)'
            },
            //left top right bottom
            frameMargin:[20,20,20,20],
            //left top right bottom
            frameSize:[30,80,30,40],
            //
            outerBorder:{
                color:'rgba(0,0,0,255)',
                width:4
            },
            //
            innerBorder:{
                color:'rgba(0,0,0,200)',
                width:2
            }
        }
        this.options=Util.extend(options,opts);
        //
        this.maps=[];
        this.controls=[];
    }

    /**
     *
     * @param map
     * @param opts {}
     * @param opts.width
     * @param opts.height
     * @param opts.origin  Array top left coordinate of map [left ,top]
     */
    addMap(map,opts){
        opts=opts||{};
        opts.width=opts.width||map.options.width;
        opts.height=opts.height||map.options.height;
        let innerBox=this.getInnerBox();
        opts.origin=opts.origin||
            [innerBox[0],innerBox[1]];
        this.maps.push({
            map:map,
            options:opts
        });
    }

    /**
     *
     * @param control
     */
    addControl(control){
        this.controls.push(control);
    }

    /**
     *
     * @param opts
     */
    render(opts){
        return new Promise(async function(resolve,reject){
            let canvas=new Canvas(this.options.width, this.options.height),
                canvas_ctx=canvas.getContext('2d');
            canvas_ctx.imageSmoothingEnabled=true;
            //background
            this._renderBackground(canvas_ctx);
            //render map
            await this._renderMap(canvas_ctx);
            //border title etc
            this._renderFrame(canvas_ctx);
            //render controls
            await this._renderControls(canvas_ctx);
            //finished
            resolve(canvas);
        }.bind(this));
    }

    /**
     *
     * @private
     */
    _renderBackground(context){
        let width=this.options.width,
            height=this.options.height,
            background=this.options.background,
            frameBackground=this.options.frameBackground;
        context.imageSmoothingEnabled=true;
        //full background
        context.fillStyle=background.color;
        context.fillRect(0,0,width,height);
        //frame background
        context.fillStyle=frameBackground.color;
        //
        let outerBox=this.getOuterBox();
        let frameRect=[
            outerBox[0],
            outerBox[1],
            outerBox[2]-outerBox[0],
            outerBox[3]-outerBox[1]
        ];
        context.fillRect(frameRect[0],frameRect[1],frameRect[2],frameRect[3]);
    }
    /**
     *
     * @param context
     * @private
     */
    _renderMap(context){
        return new Promise(async function(resolve,reject){
            for(let i=0,mlen=this.maps.length;i<mlen;i++){
                let mapObj=this.maps[i],
                    map=mapObj.map,
                    mapOpts=mapObj.options;
                let mapCanvas=await map.render();
                let image=new Canvas.Image();
                try{
                    image.src=mapCanvas.toDataURL('image/png');
                }catch(e){
                    logger.error(e)
                }
                context.drawImage(image,mapOpts.origin[0],mapOpts.origin[1],mapOpts.width,mapOpts.height);
            }
            resolve();
        }.bind(this))
    }

    /**
     * border / title
     * @param context
     * @private
     */
    _renderFrame(context){
        let outerBox=this.getOuterBox(),
            outerBorder=this.options.outerBorder,
            innerBorder=this.options.innerBorder;
        let frameRect=[
            outerBox[0],
            outerBox[1],
            outerBox[2]-outerBox[0],
            outerBox[3]-outerBox[1]
        ];
        //outer border
        context.strokeStyle=outerBorder.color;
        context.lineWidth=outerBorder.width;
        context.strokeRect(frameRect[0]+Math.ceil(outerBorder.width/2),frameRect[1]+Math.ceil(outerBorder.width/2),
            frameRect[2]-Math.floor(outerBorder.width),frameRect[3]-Math.floor(outerBorder.width));
        //inner border
        let innerBox=this.getInnerBox();
        context.strokeStyle=innerBorder.color;
        context.lineWidth=innerBorder.width;
        context.strokeRect(
            innerBox[0]+Math.ceil(innerBorder.width/2),
            innerBox[1]+Math.ceil(innerBorder.width/2),
            innerBox[2]-innerBox[0]-Math.floor(innerBorder.width),
            innerBox[3]-innerBox[1]-Math.floor(innerBorder.width));
    }

    /**
     *
     * @param context
     * @private
     */
    _renderControls(context){
        return new Promise(async function (resolve,reject) {
            if(this.controls.length==0){
                resolve({});
                return;
            }
            let outerBox=this.getOuterBox(),
                width=outerBox[2]-outerBox[0],
                height=outerBox[3]-outerBox[1];
            let ctrlCanvas=new Canvas(width, height),
                canvas_ctx=ctrlCanvas.getContext('2d');
            canvas_ctx.imageSmoothingEnabled=true;
            let renderOpts={};
            renderOpts.context=canvas_ctx;
            renderOpts.contextSize=[width,height];
            for(let i=0,clen=this.controls.length;i<clen;i++){
                let control=this.controls[i];
                await control.render(renderOpts);
            }
            //render ctrl canvas
            let image=new Canvas.Image();
            try{
                image.src=ctrlCanvas.toDataURL('image/png');
            }catch(e){
                logger.error(e)
            }
            context.drawImage(image,outerBox[0],outerBox[1],width,height);
            resolve({});
        }.bind(this));
    }
    /**
     *
     * @returns {[leftTopX,leftTopY,bottomRightX,bottomRightY]}
     */
    getOuterBox(){
        let width=this.options.width,
            height=this.options.height,
            frameMargin=this.options.frameMargin;
        let box=[
            frameMargin[0],
            frameMargin[1],
            width-frameMargin[2],
            height-frameMargin[3]
        ];
        return box;
    }
    /**
     * @returns {[leftTopX,leftTopY,bottomRightX,bottomRightY]}
     */
    getInnerBox(){
        let width=this.options.width,
            height=this.options.height,
            frameMargin=this.options.frameMargin,
            frameSize=this.options.frameSize;
        let box=[
            frameMargin[0]+frameSize[0],
            frameMargin[1]+frameSize[1],
            width-frameMargin[2]-frameSize[2],
            height-frameMargin[3]-frameSize[3]
        ];
        return box;
    }
}

module.exports=Frame;