import BuildingWithIdentifiers from "./BuildingWithIdentifiers";
import MapFieldWithIdentifiers from "./MapFieldWithIdentifiers";
import SimplifiedOpponent from "./SimplifiedOpponent";
import UnitWithIdentifiers from "./UnitWithIdentifiers";

export default interface SimplifiedPlayer {
    userId: number;
    observedMapFields: MapFieldWithIdentifiers[];
    visitedMapFields: MapFieldWithIdentifiers[];
    buildings: BuildingWithIdentifiers[];
    // commodities: Commodity[];
    units: UnitWithIdentifiers[];
    opponents: SimplifiedOpponent[];
    columns: number;
    rows: number;
}