import MapField from "../dataClasses/MapField";
import Point2d from "./Point2d";

export default class Path {

    /**Map Fields crossed between {@link points}. */
    mapFields: MapField[];
    /**
     * Includes all points of path, all crossings between crossed map fields,
     * but without beginning of the path (current unit position).
     */
    points: Point2d[];

    constructor(
        /**Map Fields crossed between {@link points}. */
        mapFields: MapField[],
        /**
         * Includes all points of path, all crossings between crossed map fields,
         * but without beginning of the path (current unit position).
         */
        points: Point2d[]
    );
    constructor();

    constructor(
        mapFields?: MapField[],
        points?: Point2d[]
    ) {
        if (points != undefined && mapFields != undefined) {
            // if the first constructor is used
            if (points.length != mapFields.length) {
                throw new Error("Path points number needs to be equal to map fields number.");
            }
            this.mapFields = mapFields;
            this.points = points;
        } else {
            // if the second constructor is used
            this.mapFields = [];
            this.points = [];
        }
    }
}