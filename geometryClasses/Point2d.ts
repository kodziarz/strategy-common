import Vector2d from "./Vector2d";

export default class Point2d {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Creates vector by subtraction of two points.
     * @param vectorStartPoint Initial point of vector.
     * @returns New vector from given initial point to point, on which the method is invoked.
     */
    subtract(vectorStartPoint: Point2d) {
        return new Vector2d(
            this.x - vectorStartPoint.x,
            this.y - vectorStartPoint.y
        );
    }

    /**
     * Moves point along vector.
     * @param vector Vector to move point.
     * @returns Point on which the method is invoked.
     */
    add(vector: Vector2d) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    /**
     * Moves the point along given vector by distance to move along X axis.
     * @param vector Vector, along which the point needs to be moved.
     * @param deltaX Distance to move along the X axis.
     * @returns The point, on which the method is invoked.
     */
    moveAlongVectorByX(vector: Vector2d, deltaX: number) {
        if (vector.x == 0)
            throw new Error("Point cannot be moved along the X axis, because vector's x coordinate is equal to 0.");

        let scale = deltaX / vector.x;
        this.x += deltaX;
        this.y += vector.y * scale;
        return this;
    }

    /**
     * Moves the point along given vector by distance to move along Y axis.
     * @param vector Vector, along which the point needs to be moved.
     * @param deltaY Distance to move along the Y axis.
     * @returns The point, on which the method is invoked.
     */
    moveAlongVectorByY(vector: Vector2d, deltaY: number) {
        if (vector.y == 0)
            throw new Error("Point cannot be moved along the Y axis, because vector's y coordinate is equal to 0.");

        let scale = deltaY / vector.y;
        this.x += vector.x * scale;
        this.y += deltaY;
        return this;
    }

    /**
     * Moves point by given distance along given vector.
     * @param vector Vector, along which the point is moved
     * @param length Distance to move along vector.
     * @returns The point, on which the method is invoked.
     */
    moveAlongVectorByLength(vector: Vector2d, length: number) {
        let v = vector.copy();
        v.normalize().multiply(length);
        this.add(v);
        return this;
    }

    copy() {
        return new Point2d(
            this.x,
            this.y
        );
    }
}