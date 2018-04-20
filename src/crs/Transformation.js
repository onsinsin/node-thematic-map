const Class=require('../lang/Class')
const Point=require('../geometry/Point')

class Transformation extends Class{
    constructor(a,b,c,d){
        super();
        //
        if (Object.prototype.toString.call(a)==='[object Array]') {
            this._a = a[0];
            this._b = a[1];
            this._c = a[2];
            this._d = a[3];
        }else{
            this._a = a;
            this._b = b;
            this._c = c;
            this._d = d;
        }
    }

    /**
     *
     * @param point
     * @param scale
     */
    transform(point, scale){
        scale = scale || 1;
        point.x = scale * (this._a * point.x + this._b);
        point.y = scale * (this._c * point.y + this._d);
        return point;
    }

    /**
     *
     * @param point
     * @param scale
     */
    untransform(point, scale){
        scale = scale || 1;
        return new Point(
            (point.x / scale - this._b) / this._a,
            (point.y / scale - this._d) / this._c);
    }
}

module.exports=Transformation;