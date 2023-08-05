import Unit from "../Unit";
import UnitTypes from "./UnitTypes";

/**
 * @example
 */
export default class Builder extends Unit {
    type = UnitTypes.BUILDER;

    constructor(ownerId: number) {
        super(ownerId);
    }
}