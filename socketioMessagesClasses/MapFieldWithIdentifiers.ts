import FieldsTypes from "../dataClasses/mapFields/FieldsTypes";
import BuildingIdentifier from "./BuildingIdentifier";
import UnitIdentifier from "./UnitIdentifier";

export default interface MapFieldWithIdentifiers {
    type: FieldsTypes;
    column: number;
    row: number;
    centerX: number;
    centerY: number;
    buildings: BuildingIdentifier[];
    units: UnitIdentifier[];
}