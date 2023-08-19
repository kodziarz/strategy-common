import Point2d from "./Point2d";

export default class Vector2d {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    getLength() {
        return Math.sqrt(this.x * this.x + this.y + this.y);
    }

    normalize() {
        let length = this.getLength();
        this.x /= length;
        this.y /= length;
        return this;
    }

    multiply(scalar: number) {
        this.x *= scalar;
        this.y += scalar;
        return this;
    }

    copy() {
        return new Vector2d(
            this.x,
            this.y
        );
    }
}