import SETTINGS from "./SETTINGS";
import MapField from "./dataClasses/MapField";
import Unit from "./dataClasses/Unit";
import Point2d from "./geometryClasses/Point2d";
import Movement from "./geometryClasses/Movement";
import Vector2d from "./geometryClasses/Vector2d";
import Building from "./dataClasses/Building";
/**
 * Gets {@link MapField}, on which the position is located.
 * @param x X coordinate of position.
 * @param y Y coordinate of position.
 * @param fieldsMap Two-dimenional array of {@link MapField}s.
 * @returns Field, to which the position belongs.
 */
export const getMapFieldOfPoint = <T>(x: number, y: number, fieldsMap: T[][]): T => {
    const { column, row } = getMapPositionOfPoint(x, y);
    return fieldsMap[column][row];
};

/**
 * Gets map position of point i.e. column and row of {@link MapField} the
 * point is located on.
 * @param x X coordinate of point.
 * @param y Y coordinate of point.
 * @returns Map position of point.
 */
export const getMapPositionOfPoint = (x: number, y: number): MapPosition => {
    return {
        column: Math.floor(x / SETTINGS.mapFieldSide),
        row: Math.floor(y / SETTINGS.mapFieldSide)
    };
};

export const getMapFieldsOfBuilding = <T>(building: Building, fieldsMap: T[][]): T[] => {
    const widthHalf = building.width / 2;
    const lengthHalf = building.length / 2;

    let result: T[] = [];
    result.push(getMapFieldOfPoint(building.x - widthHalf, building.y + lengthHalf, fieldsMap));

    let field = getMapFieldOfPoint(building.x - widthHalf, building.y - lengthHalf, fieldsMap);
    if (!result.includes(field)) result.push(field);

    field = getMapFieldOfPoint(building.x + widthHalf, building.y - lengthHalf, fieldsMap);
    if (!result.includes(field)) result.push(field);

    field = getMapFieldOfPoint(building.x + widthHalf, building.y + lengthHalf, fieldsMap);
    if (!result.includes(field)) result.push(field);

    return result;
};

export const getMapFieldsOfUnit = <T>(unit: Unit, fieldsMap: T[][]): T[] => {
    const widthHalf = unit.width / 2;
    const lengthHalf = unit.length / 2;

    let result: T[] = [];
    result.push(getMapFieldOfPoint(unit.x - widthHalf, unit.y + lengthHalf, fieldsMap));

    let field = getMapFieldOfPoint(unit.x - widthHalf, unit.y - lengthHalf, fieldsMap);
    if (!result.includes(field)) result.push(field);

    field = getMapFieldOfPoint(unit.x + widthHalf, unit.y - lengthHalf, fieldsMap);
    if (!result.includes(field)) result.push(field);

    field = getMapFieldOfPoint(unit.x + widthHalf, unit.y + lengthHalf, fieldsMap);
    if (!result.includes(field)) result.push(field);

    return result;
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
    endPoint: Point2d
): { mapPositions: MapPosition[]; crossings: Point2d[]; } => {

    if (startPoint.x == endPoint.x) {
        // if line is perfectly vertical
        let horizontalCrossings = getCrossingsWithHorizontalMapBorders(
            startPoint,
            endPoint
        );
        let isAscending = (endPoint.y - startPoint.y) > 0;
        let firstMapField = getMapPositionOfPoint(startPoint.x, startPoint.y);

        let mapPositions = getCrossedMapFieldsForLineByY(
            horizontalCrossings,
            isAscending,
            firstMapField
        );

        return {
            mapPositions,
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

        let firstMapPosition = getMapPositionOfPoint(startPoint.x, startPoint.y);

        return getCrossedMapFieldsForLineByX(
            verticalCrossings,
            horizontalCrossings,
            isAscending,
            firstMapPosition
        );
    }
};

/**
 * Changes unit's position according to time elapsed.
 * @param unit Moved unit.
 * @param deltaTime Time elapsed from last movement of unit.
 * @param movement Movement data.
 * @returns The time [s] elapsed from reaching the end, otherwise 0.
 */
export const moveUnitByDeltaTime = (movement: Movement, deltaTime: number): number => {
    // current timestamp maybe should be given...
    let lastPoint = new Point2d(movement.unit.x, movement.unit.y);
    let nextPoint = movement.path.points[movement.nextPointIndex];
    let remainingTime = deltaTime;
    movement.lastTimestamp = Date.now();

    while (remainingTime > 0) {
        console.log("path: ", movement.path);

        console.log("lastPoint: ", lastPoint);
        console.log("nextPoint: ", nextPoint);

        let v = new Vector2d(
            nextPoint.x - lastPoint.x,
            nextPoint.y - lastPoint.y
        );

        let sToReachNext = v.getLength();
        let vOnMapField = movement.unit.getVelocityOnMapField(movement.path.mapFields[movement.nextPointIndex]);
        let tToReachNext = sToReachNext / vOnMapField;

        remainingTime -= tToReachNext;

        if (remainingTime <= 0) {
            console.log("<=0");
            let lackingDistance = -remainingTime * vOnMapField; //remainingTime is negative
            let distanceFromLastIntersection = sToReachNext - lackingDistance;

            let unitPosition = lastPoint.copy().moveAlongVectorByLength(v, distanceFromLastIntersection);
            movement.unit.x = unitPosition.x;
            movement.unit.y = unitPosition.y;
            // movement.unit.occupiedFields.length = 0;
            // movement.unit.occupiedFields.push(...getMapFieldsOfUnit(movement.unit, fieldsMap));
            console.log("unit: (", movement.unit.x, ", ", movement.unit.y, ")");
            if (remainingTime == 0) {
                movement.nextPointIndex++;
                if (movement.nextPointIndex == movement.path.points.length) {
                    return 0;
                }
            }
            return 0;
        } else if (movement.nextPointIndex == movement.path.points.length - 1) {
            //if remainingTime > 0
            console.log("> 0 path finished");

            let endPoint = movement.path.points[movement.path.points.length - 1];
            movement.unit.x = endPoint.x;
            movement.unit.y = endPoint.y;
            // movement.unit.occupiedFields.length = 0;
            // movement.unit.occupiedFields.push(...getMapFieldsOfUnit(movement.unit, fieldsMap));
            return remainingTime;
        } else {
            // continue executing loop
            console.log(">0 continuing");
            movement.nextPointIndex++;
            lastPoint = nextPoint;
            nextPoint = movement.path.points[movement.nextPointIndex + 1];
        }
    }
    throw new Error("This place should never be reached. The method 'moveUnitByDeltaTime' contains mistatkes.");
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
 * @param firstMapPostion {@link MapField} of start point of the line.
 * @param fieldsMap Two-dimentionsl array of {@link MapField}s.
 * @returns Object containing list of {@link MapField}s and merged array of
 * crossings of line between the {@link MapField}s in order of crossing them.
 */
const getCrossedMapFieldsForLineByX = (
    verticalCrossings: Point2d[],
    horizontalCrossings: Point2d[],
    isAscending: boolean,
    firstMapPostion: MapPosition
): {
    mapPositions: MapPosition[],
    crossings: Point2d[];
} => {
    //DEV current solution of empty intersections table problem is probably nonoptimal
    //OPT
    let verticalIndex = verticalCrossings.length == 0 ? -1 : 0;
    let horizontalIndex = horizontalCrossings.length == 0 ? -1 : 0;
    let mapPositionsToReturn: MapPosition[] = [firstMapPostion];
    let crossingsToReturn: Point2d[] = [];

    let lastMapPosition = firstMapPostion;
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
            let nextMapPosition = {
                column: lastMapPosition.column + shift,
                row: lastMapPosition.row
            };
            mapPositionsToReturn.push(nextMapPosition);
            crossingsToReturn.push(vertPoint);
            lastMapPosition = nextMapPosition;
        } else if (vertPoint.x > horizPoint.x) {
            horizontalIndex++;
            let nextMapPosition = {
                column: lastMapPosition.column,
                row: lastMapPosition.row + shift
            };
            mapPositionsToReturn.push(nextMapPosition);
            lastMapPosition = nextMapPosition;
            crossingsToReturn.push(horizPoint);
        }
        //cannot be equal
    }
    return {
        mapPositions: mapPositionsToReturn,
        crossings: crossingsToReturn
    };
};

/**
 * Gets array of {@link MapPosition}s which are crossed, by the first
 * {@link MapField} and intersections between MapFields. Can be used only for
 * lines, which cross {@link MapField}s in vertical direction.
 * @param horizontalCrossings Crossings between {@link MapField}s (but only
 * in vertical direction).
 * @param isAscending Information, if the line leads in upper direction (y
 * coordinate of consecutive points rises), otherwise should be false.
 * @param firstMapPosition {@link MapField} of the start of the line.
 * @param fieldsMap Two-dimentionsl array of {@link MapField}s.
 * @returns List of {@link MapPosition}s in order of crossing them.
 */
const getCrossedMapFieldsForLineByY = (
    horizontalCrossings: Point2d[],
    isAscending: boolean,
    firstMapPosition: MapPosition
) => {
    let mapPositionsToReturn: MapPosition[] = [firstMapPosition];

    let lastMapPosition = firstMapPosition;
    let shift: number;
    if (isAscending)
        shift = +1;
    else shift = -1;

    for (let i = 0; i < horizontalCrossings.length; i++) {
        let nextMapPosition = {
            column: lastMapPosition.column,
            row: lastMapPosition.row + shift
        };
        mapPositionsToReturn.push(nextMapPosition);
        lastMapPosition = nextMapPosition;
    }
    return mapPositionsToReturn;
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

/**
 * Map position of point i.e. column and row of {@link MapField} the
 * point is located on.
 */
export type MapPosition = {
    column: number;
    row: number;
};

/**Helper function in e.g. {@link getIntersectionsWithVerticalMapBorders} */
const isSmaller = (a: number, b: number) => {
    return a < b;
};

/**Helper function in e.g. {@link getIntersectionsWithVerticalMapBorders} */
const isBigger = (a: number, b: number) => {
    return a > b;
};