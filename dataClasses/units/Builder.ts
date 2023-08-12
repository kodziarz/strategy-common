import MapField from "../MapField";
import Unit from "../Unit";
import FieldsTypes from "../mapFields/FieldsTypes";
import UnitTypes from "./UnitTypes";

/**
 * @example
 */
export default class Builder extends Unit {

    static BASE_VELOCITY = 5;

    type = UnitTypes.BUILDER;

    constructor(ownerId: number) {
        super(ownerId);
    }

    getVelocityOnMapField(mapField: MapField): number {
        switch (mapField.type) {
            case FieldsTypes.GRASSLAND: {
                return Builder.BASE_VELOCITY;
            }; break;
            default:
                throw new Error("Unit cannot return its speed on map field, since it's type: " + mapField.type + " is not known.");
        }
    }
}