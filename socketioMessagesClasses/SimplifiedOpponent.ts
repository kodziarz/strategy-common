import BuildingWithIdentifiers from "./BuildingWithIdentifiers";
import UnitWithIdentifiers from "./UnitWithIdentifiers";

export default interface SimplifiedOpponent {
    userId: number;
    buildings: BuildingWithIdentifiers[];
    units: UnitWithIdentifiers[];
}