import SETTINGS from "./SETTINGS";
import MapField from "./dataClasses/MapField";
import Point2d from "./geometryClasses/Point2d";

/**
 * Gets {@link MapField}, on which the position is located.
 * @param x X coordinate of position.
 * @param y Y coordinate of position.
 * @param fieldsMap Two-dimenional array of {@link MapField}s.
 * @returns Field, to which the position belongs.
 */
export const getMapFieldOfPosition = (x: number, y: number, fieldsMap: MapField[][]): MapField => {
    const column = Math.floor(x / SETTINGS.mapFieldSide);
    const row = Math.floor(y / SETTINGS.mapFieldSide);
    return fieldsMap[column][row];
};

/**
 * Gets path data for line. For 2 given points finds all crossings between 
 * {@link MapField}s and {@link MapField}s themselves, which are located on
 * the way between points.
 * @param startPoint Start point of the line.
 * @param endPoint End point of the line.
 * @param fieldsMap Two-dimentional array of {@link MapField}s.
 * @returns Object containing list of {@link MapField}s and crossings of line
 * between the {@link MapField}s.
 */
export const getCrossedMapFieldsForLine = (
    startPoint: Point2d,
    endPoint: Point2d,
    fieldsMap: MapField[][]
): { mapFields: MapField[]; crossings: Point2d[]; } => {

    if (startPoint.x == endPoint.x) {
        // if line is perfectly vertical
        let horizontalCrossings = getCrossingsWithHorizontalMapBorders(
            startPoint,
            endPoint
        );
        let isAscending = (endPoint.y - startPoint.y) > 0;
        let firstMapField = getMapFieldOfPosition(startPoint.x, startPoint.y, fieldsMap);

        let mapFields = getCrossedMapFieldsForLineByY(
            horizontalCrossings,
            isAscending,
            firstMapField,
            fieldsMap
        );

        return {
            mapFields,
            crossings: horizontalCrossings
        };
    } else {
        // if line is at least partially inclined
        let verticalCrossings = getIntersectionsWithVerticalMapBorders(
            startPoint,
            endPoint
        );
        let horizontalCrossings = getCrossingsWithHorizontalMapBorders(
            startPoint,
            endPoint
        );

        let isAscending = (endPoint.x - startPoint.x) > 0;
        let firstMapField = getMapFieldOfPosition(
            startPoint.x,
            startPoint.y,
            fieldsMap
        );

        return getCrossedMapFieldsForLineByX(
            verticalCrossings,
            horizontalCrossings,
            isAscending,
            firstMapField,
            fieldsMap
        );
    }
};

/**
 * Gets array of {@link MapField}s which are crossed, by the first
 * {@link MapField} and intersections between MapFields. To preserve order,
 * the x coordinate of crossings is used, so the line of movement cannot be
 * perfectly vertical.
 * @param verticalCrossings Array of crossings between {@link MapField}s
 * when crossing in horizontal direction (to the field on the left or on the
 * right).
 * @param horizontalCrossings Array of crossings between {@link MapField}s
 * when crossing in vertical direction (to the field above or underneath).
 * @param isAscending Information, if the line leads in right direction (x
 * coordinate of consecutive points rises), otherwise should be false.
 * @param firstMapField {@link MapField} of start point of the line.
 * @param fieldsMap Two-dimentionsl array of {@link MapField}s.
 * @returns Object containing list of {@link MapField}s and merged array of
 * crossings of line between the {@link MapField}s in order of crossing them.
 */
const getCrossedMapFieldsForLineByX = (
    verticalCrossings: Point2d[],
    horizontalCrossings: Point2d[],
    isAscending: boolean,
    firstMapField: MapField,
    fieldsMap: MapField[][]
): {
    mapFields: MapField[],
    crossings: Point2d[];
} => {
    //DEV current solution of empty intersections table problem is probably nonoptimal
    //OPT
    let verticalIndex = verticalCrossings.length == 0 ? -1 : 0;
    let horizontalIndex = horizontalCrossings.length == 0 ? -1 : 0;
    let mapFieldsToReturn: MapField[] = [firstMapField];
    let crossingsToReturn: Point2d[] = [];

    let lastField = firstMapField;
    let lengthsSum = verticalCrossings.length + horizontalCrossings.length;
    let shift: number;
    if (isAscending)
        shift = +1;
    else shift = -1;

    for (let i = 0; i < lengthsSum; i++) {
        //the trick with infity guarantees that point from enpty array will never be chosen
        const vertPoint = verticalIndex < 0 ? new Point2d(Infinity, 0) : verticalCrossings[verticalIndex];
        const horizPoint = horizontalIndex < 0 ? new Point2d(Infinity, 0) : horizontalCrossings[horizontalIndex];
        if (vertPoint.x < horizPoint.x) {
            verticalIndex++;
            let nextField = fieldsMap[lastField.column + shift][lastField.row];
            mapFieldsToReturn.push(nextField);
            crossingsToReturn.push(vertPoint);
            lastField = nextField;
        } else if (vertPoint.x > horizPoint.x) {
            horizontalIndex++;
            let nextField = fieldsMap[lastField.column][lastField.row + shift];
            mapFieldsToReturn.push(nextField);
            lastField = nextField;
            crossingsToReturn.push(horizPoint);
        }
    }
    return {
        mapFields: mapFieldsToReturn,
        crossings: crossingsToReturn
    };
};

/**
 * Gets array of {@link MapField}s which are crossed, by the first
 * {@link MapField} and intersections between MapFields. Can be used only for
 * lines, which cross {@link MapField}s in vertical direction.
 * @param horizontalCrossings Crossings between {@link MapField}s (but only
 * in vertical direction).
 * @param isAscending Information, if the line leads in upper direction (y
 * coordinate of consecutive points rises), otherwise should be false.
 * @param firstMapField {@link MapField} of the start of the line.
 * @param fieldsMap Two-dimentionsl array of {@link MapField}s.
 * @returns List of {@link MapField}s in order of crossing them.
 */
const getCrossedMapFieldsForLineByY = (
    horizontalCrossings: Point2d[],
    isAscending: boolean,
    firstMapField: MapField,
    fieldsMap: MapField[][]
) => {
    let mapFieldsToReturn: MapField[] = [firstMapField];

    let lastField = firstMapField;
    let shift: number;
    if (isAscending)
        shift = +1;
    else shift = -1;

    for (let i = 0; i < horizontalCrossings.length; i++) {
        let nextField = fieldsMap[lastField.column][lastField.row + shift];
        mapFieldsToReturn.push(nextField);
        lastField = nextField;
    }
    return mapFieldsToReturn;
};

/**
 * Intersects straight line with vertical borders between {@link MapField}s.
 * @param startPoint Start point of intersected line.
 * @param endPoint End point of intersected line.
 * @returns Points of intersection with vertical borders ordered from
 * {@link startPoint} to {@link endPoint}.
 */
const getIntersectionsWithVerticalMapBorders = (startPoint: Point2d, endPoint: Point2d): Point2d[] => {
    let directionVector = endPoint.subtract(startPoint);

    let beginningX: number;
    let endX: number;
    let iterator: number;
    let compare: (a: number, b: number) => boolean;

    if (startPoint.x < endPoint.x) {
        beginningX = Math.ceil(startPoint.x / SETTINGS.mapFieldSide) * SETTINGS.mapFieldSide;
        endX = endPoint.x;
        iterator = + SETTINGS.mapFieldSide;
        compare = isSmaller;
    } else if (startPoint.x > endPoint.x) {
        beginningX = Math.floor(startPoint.x / SETTINGS.mapFieldSide) * SETTINGS.mapFieldSide;
        endX = endPoint.x;
        iterator = - SETTINGS.mapFieldSide;
        compare = isBigger;
    } else {
        // startPoint.x == endPoint.x
        return [];
    }

    let intersectionPoints: Point2d[] = [];
    for (let x = beginningX; compare(x, endX); x += iterator) {
        let deltaX = x - beginningX;
        intersectionPoints.push(
            startPoint.copy()
                .moveAlongVectorByX(directionVector, deltaX)
        );
    }
    return intersectionPoints;
};

/**
 * Intersects straight line with horizontal borders between {@link MapField}s.
 * @param startPoint Start point of intersected line.
 * @param endPoint End point of intersected line.
 * @returns Points of intersection with horizontal borders ordered from
 * {@link startPoint} to {@link endPoint}.
 */
const getCrossingsWithHorizontalMapBorders = (startPoint: Point2d, endPoint: Point2d): Point2d[] => {
    let directionVector = endPoint.subtract(startPoint);

    let beginningY: number;
    let endY: number;
    let iterator: number;
    let compare: (a: number, b: number) => boolean;

    if (startPoint.y < endPoint.y) {
        beginningY = Math.ceil(startPoint.y / SETTINGS.mapFieldSide) * SETTINGS.mapFieldSide;
        endY = endPoint.y;
        iterator = + SETTINGS.mapFieldSide;
        compare = isSmaller;
    } else if (startPoint.x > endPoint.x) {
        beginningY = Math.floor(startPoint.y / SETTINGS.mapFieldSide) * SETTINGS.mapFieldSide;
        endY = endPoint.y;
        iterator = - SETTINGS.mapFieldSide;
        compare = isBigger;
    } else {
        // startPoint.y == endPoint.y
        return [];
    }

    let intersectionPoints: Point2d[] = [];
    for (let y = beginningY; compare(y, endY); y += iterator) {
        let deltaY = y - beginningY;
        intersectionPoints.push(
            startPoint.copy()
                .moveAlongVectorByY(directionVector, deltaY)
        );
    }
    return intersectionPoints;
};

/**Helper function in e.g. {@link getIntersectionsWithVerticalMapBorders} */
const isSmaller = (a: number, b: number) => {
    return a < b;
};

/**Helper function in e.g. {@link getIntersectionsWithVerticalMapBorders} */
const isBigger = (a: number, b: number) => {
    return a > b;
};