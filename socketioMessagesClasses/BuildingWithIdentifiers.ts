import BuildingsTypes from "../dataClasses/buildings/BuildingsTypes";
import MapFieldIdentifier from "./MapFieldIdentifier";

export default interface BuildingWithIdentifiers {
    type: BuildingsTypes;
    x: number;
    y: number;
    width: number;
    length: number;
    id: string;
    ownerId: number;
    occupiedFields: MapFieldIdentifier[];
}