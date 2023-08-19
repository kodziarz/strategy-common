import UnitIdentifier from "./UnitIdentifier";
import Point2d from "./../geometryClasses/Point2d";

export default interface MoveUnitMessage {
    unit: UnitIdentifier;
    pathPoints: Point2d[];
}