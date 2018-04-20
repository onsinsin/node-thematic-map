const uuid=require('uuid')
const Class =require('../lang/Class')
const Util=require('../util/Util')
/**
 *
 */
class Layer extends Class{
    constructor(opts){
        super();
        //
        let options={
            name:'Layer-'+new Date().getTime(),
            opacity:1,
            crs:null
        }
        this.options=Util.extend(options,opts||{},true);
        this.id=this.options.id||uuid.v4();
    }

    /**
     *
     * @param map
     */
    addTo(map){
        this.map=map;
    }

    /**
     *
     * @param map
     */
    remove(map){
        this.map=null;
    }

    /**
     * @param renderer
     * @param opts
     */
    render(renderer,opts){}

    /**
     * 渲染方式
     * @returns {string}
     */
    getRenderer(){
        return 'canvas';
    }
}

module.exports=Layer;