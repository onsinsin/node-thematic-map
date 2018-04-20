const Promise=require('bluebird')
const Control=require('./Control')
const Util=require('../util/Util')
/**
 *
 */
class TextCtrl extends Control{
    constructor(opts){
        let options={
            text:'text',
            fontSize:16,//in pixel
            fontWeight:'normal',
            fontFamily:'Arial',
            fontColor:'rgba(0,0,0,255)',
            size:null,
            position:{
                textAlign:'left',
                textBaseline:'top'
            }
        };
        Util.extend(options,opts||{},true);
        super(options);
        //
    }

    /**
     * @override
     * @param opts
     * @param opts.context
     * @param opts.contextSize {Array} [width,height]
     * @returns {}
     */
    render(opts){
        return new Promise(async function(resolve,reject){
            let context=opts.context,
                contextSize=opts.contextSize,
                position=this.options.position;
            context.beginPath();
            context.font=this.options.fontWeight+' '+this.options.fontSize+'px '+this.options.fontFamily;
            context.fillStyle=this.options.fontColor;
            context.textAlign=position.textAlign;
            context.textBaseline=position.textBaseline;
            //set size
            let measureText=context.measureText(this.options.text);
            this.options.size=[measureText.width,measureText.emHeightAscent];
            //get position to render
            let leftTop=this.caculatePosition(contextSize);
            context.fillText(this.options.text,leftTop[0],leftTop[1]);
            resolve();
        }.bind(this));
    }
}

module.exports=TextCtrl;