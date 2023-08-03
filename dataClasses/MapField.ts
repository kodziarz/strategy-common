import SETTINGS from "../SETTINGS";
import Building from "./Building";
import FieldsTypes from "./mapFields/FieldsTypes";

/**Class to extend to create MapFields containing something etc. */
export default abstract class MapField {
    /**Enables front-end to differentiate MapFields. */
    type: FieldsTypes;

    /**Integer indicating which in a row is this {@link MapField} horizonally */
    readonly column: number;
    /**Integer indicating which in a row is this {@link MapField} vertically */
    readonly row: number;
    /**Accurate X coordinate of {@link MapField | MapField's} center.*/
    readonly centerX: number;
    /**Accurate Y coordinate of {@link MapField | MapField's} center.*/
    readonly centerY: number;
    /**Buildings placed on {@link MapField}. */
    readonly buildings: Building[] = [];

    constructor(
        column: number,
        row: number
    ) {
        this.column = column;
        this.row = row;

        this.centerX = (this.column + 0.5) * SETTINGS.mapFieldSide;
        this.centerY = (this.row + 0.5) * SETTINGS.mapFieldSide;
    }

    /**
     * Creates object which enables to identify which object should be on the
     * place, but without other information.
     * @returns New object with indentification data.
     */
    getIndentifier() {
        return {
            column: this.column,
            row: this.row
        };
    };

    /**
     * Creates object with identifiers as references to other objects.
     * @returns Copy of the object without circular depencies.
     */
    getWithIdentifiers() {
        let tmp: any = { ...this };
        tmp.buildings = this.buildings.map((building) => { return building.getIdentifier(); });
        return tmp;
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
    }
}