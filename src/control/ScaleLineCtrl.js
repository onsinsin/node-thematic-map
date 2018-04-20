
const Control=require('./Control')
const Util=require('../util/Util')
class ScaleLineCtrl extends Control{
    constructor(opts){
        let options={
            title:'比例尺',
            titleMargin:20,
            titleFontSize:16,
            titleFontFamily:'Arial',
            titleFontWeight:'normal',
            labelFontSize:12,
            labelFontFamily:'Arial',
            fontColor:'rgba(0,0,0,1)',
            unit:30,//1cm对应的像素数
            unitCount:4,
            scale:10000,//1cm 与 真实比例
            lineHeight:10,
            lineBorderThickness:2
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
                position=this.options.position,
                leftTop=this.caculatePosition(contextSize),
                unit=this.options.unit,
                scale=this.options.scale/100000,
                unitCount=this.options.unitCount,
                lineHeight=this.options.lineHeight,
                lineBorderThickness=this.options.lineBorderThickness;
            let curX=leftTop[0],
                curY=leftTop[1],
                titleFont=this.options.titleFontWeight+' '+this.options.titleFontSize+'px '+this.options.titleFontFamily,
                labelFont=this.options.labelFontSize+'px '+this.options.labelFontFamily,
                fontColor=this.options.fontColor;
            //draw title
            context.font=titleFont;
            context.textAlign='left';
            context.textBaseline='top';
            let titleMeasure=context.measureText(this.options.title);
            context.fillText(this.options.title,curX,curY);
            curX+=titleMeasure.width+this.options.titleMargin;
            //
            for(let i=0;i<unitCount;i++){
                context.beginPath();
                context.strokeStyle='rgba(0,0,0,1)';
                context.fillStyle=i%2===0?'rgba(0,0,0,1)':'rgba(255,255,255,1)';
                context.lineWidth=lineBorderThickness;
                context.fillRect(curX,curY,unit,lineHeight);
                context.strokeRect(curX,curY,unit,lineHeight);
                //draw text
                if(i%2===0){
                    context.fillStyle=fontColor;
                    context.textAlign='center';
                    context.textBaseline='top';
                    context.font=labelFont;
                    let label=scale*i+'km';
                    context.fillText(label,curX,curY+lineHeight);
                }else if(i==unitCount-1){
                    context.fillStyle=fontColor;
                    context.textAlign='center';
                    context.textBaseline='top';
                    context.font=labelFont;
                    let label=scale*(i+1)+'km';
                    context.fillText(label,curX+unit,curY+lineHeight);
                }
                curX+=unit;
            }
            resolve();
        }.bind(this));
    }
}
module.exports=ScaleLineCtrl;