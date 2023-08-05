import BuildingWithIdentifiers from "./BuildingWithIdentifiers";
import MapFieldWithIdentifiers from "./MapFieldWithIdentifiers";
import SimplifiedOpponent from "./SimplifiedOpponent";

export default interface SimplifiedPlayer {
    userId: number;
    observedMapFields: MapFieldWithIdentifiers[];
    visitedMapFields: MapFieldWithIdentifiers[];
    buildings: BuildingWithIdentifiers[];
    // commodities: Commodity[];
    opponents: SimplifiedOpponent[];
    columns: number;
    rows: number;
}