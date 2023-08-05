import { v4 as uuid } from "uuid";
import UnitTypes from "./units/UnitTypes";
export default abstract class Unit {

    type: UnitTypes;
    /**UserId of owner {@link Player}.*/
    ownerId: number;
    /**UUID of unit. */
    id: string = uuid();
    /**X coordinate of Unit's position */
    x: number;
    /**Y coordinate of Unit's position */
    y: number;

    constructor(ownerId: number) {
        this.ownerId = ownerId;
    }

}