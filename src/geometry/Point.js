const Geometry=require('./Geometry')
/**
 *
 */
class Point extends Geometry{
    /**
     *
     * @param x
     * @param y
     */
    constructor(x,y){
        super();
        //
        this.x = x;
        this.y = y;
    }

    /**
     *
     * @param point
     * @returns {number}
     */
    distanceTo(point) {
        var x = point.x - this.x,
            y = point.y - this.y;
        return Math.sqrt(x * x + y * y);
    }
    /**
     *
     * @param point
     * @returns {Point}
     */
    add(point){
        var clone=this.clone();
        clone.x += point.x;
        clone.y += point.y;
        return clone;
    }

    /**
     *
     * @param point
     * @returns {Point}
     */
    subtract(point){
        var clone=this.clone();
        clone.x -= point.x;
        clone.y -= point.y;
        return clone;
    }

    /**
     *
     * @param num
     * @returns {Point}
     */
    divideBy(num){
        var clone=this.clone();
        clone.x /= num;
        clone.y /= num;
        return clone;
    }

    /**
     *
     * @param num
     * @returns {Point}
     */
    multiplyBy(num){
        var clone=this.clone();
        clone.x *= num;
        clone.y *= num;
        return clone;
    }


    /**
     *
     * @param point
     * @returns {Point}
     */
    scaleBy(point){
        var clone=this.clone();
        clone.x *= point.x;
        clone.y *= point.y;
        return clone;
    }

    /**
     *
     * @param point
     * @returns {Point}
     */
    unscaleBy(point){
        var clone=this.clone();
        clone.x /= point.x;
        clone.y /= point.y;
        return clone;
    }

    /**
     *
     * @returns {Point}
     */
    round(){
        var clone=this.clone();
        clone.x = Math.round(clone.x);
        clone.y = Math.round(clone.y);
        return clone;
    }

    /**
     *
     * @returns {Point}
     */
    floor(){
        var clone=this.clone();
        clone.x = Math.floor(clone.x);
        clone.y = Math.floor(clone.y);
        return clone;
    }

    /**
     *
     * @returns {Point}
     */
    ceil(){
        var clone=this.clone();
        clone.x = Math.ceil(clone.x);
        clone.y = Math.ceil(clone.y);
        return clone;
    }

    /**
     *
     */
    toString(){
        return 'Point(' +this.x+ ', ' +this.y+ ')';
    }

    /**
     *
     * @returns {{type: string, coordinates: [*,*]}}
     */
    toJSON(){
        return {
            type:'Point',
            coordinates:[this.x,this.y]
        }
    }
    /**
     *
     * @param point
     * @returns {boolean}
     */
    equals (point) {
        point = toPoint(point);
        return point.x === this.x &&point.y === this.y;
    }
    /**
     *
     * @returns {Point}
     */
    clone () {
        return new Point(this.x, this.y);
    }
}

module.exports=Point;