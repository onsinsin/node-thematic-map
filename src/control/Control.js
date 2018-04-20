const Class=require('../lang/Class')
const Util=require('../util/Util')
/**
 *
 */
class Control extends Class{
    /**
     *
     */
    constructor(opts){
        super();
        //
        let options={
            //position default left top ,unit '10%' in percentage or '10px' in pixel
            position:{
                top:null,
                left:null,
                right:null,
                bottom:null
            },
            size:[80,40],//[width,height]
        }
        this.options=Util.extend(options,opts||{},true);
    }

    /**
     *
     * @param opts
     * @param opts.context
     * @param opts.contextSize {Array} [width,height]
     * @returns {}
     */
    render(opts){}

    /**
     * caculate left top
     * @param contextSize {Array} [width,height]
     * @returns [left,top]
     */
    caculatePosition(contextSize){
        let size=this.options.size,
            position=this.options.position,
            leftTop=[0,0];
        let hStr=position.left||position.right||'0px';
        let hVal=parseFloat(hStr);
        if(hStr.indexOf('%')>0){
            leftTop[0]=contextSize[0]*hVal/100;
        }else{
            leftTop[0]=hVal;
        }
        if(position.right&&!position.left){
            leftTop[0]=contextSize[0]-leftTop[0];
        }
        let vStr=position.top||position.bottom||'0px';
        let vVal=parseFloat(vStr);
        if(vStr.indexOf('%')>0){
            leftTop[1]=contextSize[1]*vVal/100;
        }else{
            leftTop[1]=vVal;
        }
        if(position.bottom&&!position.top){
            leftTop[1]=contextSize[1]-vVal;
        }
        // console.log('left top>>',leftTop)
        return leftTop;
    }
}
module.exports=Control;