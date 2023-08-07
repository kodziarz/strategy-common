import UnitTypes from "../dataClasses/units/UnitTypes";
import MapFieldIdentifier from "./MapFieldIdentifier";

export default interface UnitWithIdentifiers {
    type: UnitTypes;
    ownerId: number;
    id: string;
    x: number;
    y: number;
    occupiedFields: MapFieldIdentifier[];
}