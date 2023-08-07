import { v4 as uuid } from "uuid";
import UnitTypes from "./units/UnitTypes";
import MapField from "./MapField";
import UnitIdentifier from "../socketioMessagesClasses/UnitIdentifier";
import UnitWithIdentifiers from "../socketioMessagesClasses/UnitWithIdentifiers";
import MapFieldIdentifier from "../socketioMessagesClasses/MapFieldIdentifier";
export default abstract class Unit {

    type: UnitTypes;
    /**UserId of owner {@link Player}.*/
    ownerId: number;
    /**UUID of unit. */
    readonly id: string = uuid();
    /**X coordinate of {@link Unit}'s position */
    x: number;
    /**Y coordinate of {@link Unit}'s position */
    y: number;
    /**Width of {@link Unit}. */
    width: number = 1;
    /**Length of {@link Unit} */
    length: number = 1;
    /**List of occupied {@link MapField}s. */
    readonly occupiedFields: MapField[] = [];

    constructor(ownerId: number) {
        this.ownerId = ownerId;
    }

    /**
     * Creates object which enables to identify which object should be on the
     * place, but without further information.
     * @returns New object with indentification data.
     */
    getIdentifier() {
        return {
            id: this.id
        } as UnitIdentifier;
    };

    /**
     * Creates object with identifiers as references to other objects.
     * @returns Copy of the object without circular depencies.
     */
    getWithIdentifiers() {
        let tmp: UnitWithIdentifiers = { ...this };
        tmp.occupiedFields = this.occupiedFields.map((mapField) => { return mapField.getIndentifier(); }) as MapFieldIdentifier[];
        return tmp;
    };

}