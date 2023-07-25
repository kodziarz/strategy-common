import CommoditiesTypes from "./commodities/CommoditiesTypes";
import { v4 as uuid } from "uuid";

/**Class to extend to create specific commodities. */
export default abstract class Commodity {
    type: CommoditiesTypes;
    id: string;

    constructor() {
        this.id = uuid();
    }
}