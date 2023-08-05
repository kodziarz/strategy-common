import Building from "../dataClasses/Building";
import MapField from "./../dataClasses/MapField";

export default interface MapChangesMessage {
    changedFields?: MapField[];
    changedBuildings?: Building[];
}