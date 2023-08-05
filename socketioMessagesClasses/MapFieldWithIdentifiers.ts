import FieldsTypes from "../dataClasses/mapFields/FieldsTypes";
import BuildingIdentifier from "./BuildingIdentifier";

export default interface MapFieldWithIdentifiers {
    type: FieldsTypes;
    column: number;
    row: number;
    centerX: number;
    centerY: number;
    buildings: BuildingIdentifier[];
}