import MapField from "./MapField";
import BuildingsTypes from "./buildings/BuildingsTypes";
import { v4 as uuid } from "uuid";

/**Class to extend to create specific buildings */
export default abstract class Building {
    /**Enables front-end to differentiate Buildings. */
    type: BuildingsTypes;
    x: number;
    y: number;
    readonly width: number = 10;
    readonly length: number = 10;
    readonly id: string;
    readonly ownerId: number;
    readonly occupiedFields: MapField[] = [];

    constructor(ownerId: number) {
        this.id = uuid();
        this.ownerId = ownerId;
    }

    /**
     * Creates object which enables to identify which object should be on the
     * place, but without other information.
     * @returns New object with indentification data.
     */
    getIdentifier() {
        return {
            id: this.id
        };
    };

    /**
     * Creates object with identifiers as references to other objects.
     * @returns Copy of the object without circular depencies.
     */
    getWithIdentifiers() {
        let tmp: any = { ...this };
        tmp.occupiedFields = this.occupiedFields.map((mapField) => { return mapField.getIndentifier(); });
        return tmp;
    };
}