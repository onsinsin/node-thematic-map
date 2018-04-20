const Layers=require('./index')
const Class=require('../lang/Class')

class LayerFactory extends Class{
    constructor(){
        super();
    }

    /**
     *
     * @param type
     * @param opts
     */
    create(type,opts){
        var clazz=null;
        for(let layer in Layers){
            if(Layers[layer].type===type){
                clazz=Layers[layer];
            }
        }
        if(clazz==null){
            throw(new Error('illegal type!'))
        }
        return new clazz(opts);
    }
}
//
var instance=null;
/**
 *
 * @returns {*}
 */
LayerFactory.getInstance=function(){
    if(instance==null){
        instance=new LayerFactory();
    }
    return instance;
}

module.exports=LayerFactory;