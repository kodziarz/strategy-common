import BuildingWithIdentifiers from "./BuildingWithIdentifiers";
import MapFieldWithIdentifiers from "./MapFieldWithIdentifiers";

export default interface MapChangesMessage {
    changedFields?: MapFieldWithIdentifiers[];
    changedBuildings?: BuildingWithIdentifiers[];
}