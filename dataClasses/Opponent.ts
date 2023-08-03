import Building from "./Building";

/**Stores data which is known to specific {@link Player} about his opponent. */
export default class Opponent {


    buildings: Building[] = [];

    constructor(readonly userId: number) { }

    /**
     * Creates object which enables to identify actual object.
     * @returns New object with indentification data.
     */
    getIndentifier() {
        return {
            userId: this.userId
        };
    };

    /**
     * Creates object with data of referenced objects, but these have identifiers.
     * (The returned object's descendants are generated with
     * {@link getWithIdentifiers} method.)
     * @returns Copy of the object without circular depencies.
     */
    getSimplified() {
        let tmp: any = { ...this };
        tmp.buildings = this.buildings.map((building) => { return building.getWithIdentifiers(); });
        return tmp;
    };
}