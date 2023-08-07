import BuildingWithIdentifiers from "./BuildingWithIdentifiers";
import MapFieldWithIdentifiers from "./MapFieldWithIdentifiers";
import UnitWithIdentifiers from "./UnitWithIdentifiers";

export default interface MapChangesMessage {
    changedFields?: MapFieldWithIdentifiers[];
    changedBuildings?: BuildingWithIdentifiers[];
    changedUnits?: UnitWithIdentifiers[];
}