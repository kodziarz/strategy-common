import Building from "./Building";
import OpponentIdentifier from "./../socketioMessagesClasses/OpponentIdentifier";
import SimplifiedOpponent from "../socketioMessagesClasses/SimplifiedOpponent";
import BuildingWithIdentifiers from "../socketioMessagesClasses/BuildingWithIdentifiers";

/**Stores data which is known to specific {@link Player} about his opponent. */
export default class Opponent {

    readonly userId: number;
    buildings: Building[] = [];

    constructor(userId: number) {
        this.userId = userId;
    }

    /**
     * Creates object which enables to identify actual object.
     * @returns New object with indentification data.
     */
    getIndentifier() {
        return {
            userId: this.userId
        } as OpponentIdentifier;
    };

    /**
     * Creates object with data of referenced objects, but these have identifiers.
     * (The returned object's descendants are generated with
     * {@link getWithIdentifiers} method.)
     * @returns Copy of the object without circular depencies.
     */
    getSimplified() {
        let copy: SimplifiedOpponent = { ...this };
        copy.buildings = this.buildings.map((building) => { return building.getWithIdentifiers(); }) as BuildingWithIdentifiers[];
        return copy;
    };
}