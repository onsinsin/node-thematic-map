const fs=require('fs')
const Canvas=require('canvas')
const Control=require('./Control')
const Util=require('../util/Util')
class ImageCtrl extends Control{
    constructor(opts){
        let options={
            type:'file',
            path:'',
            size:{
                width:'30px',
                height:'30px'
            }
        };
        Util.extend(options,opts||{});
        super(options);
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
                leftTop=this.caculatePosition(contextSize);
            let buffer=fs.readFileSync(this.options.path);
            let img = new Canvas.Image();
            img.src = buffer;
            context.drawImage(img, leftTop[0],leftTop[1], this.options.size.width,this.options.size.height);
            resolve();
        }.bind(this));
    }
}
module.exports=ImageCtrl;