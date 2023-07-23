import Building from "./dataClasses/Building";
import MapField from "./dataClasses/MapField";
import BuildingsTypes from "./dataClasses/buildings/BuildingsTypes";
import MainBuilding from "./dataClasses/buildings/MainBuilding";
import FieldsTypes from "./dataClasses/mapFields/FieldsTypes";
import Grassland from "./dataClasses/mapFields/Grassland";

/**
     * Converts raw {@link Building | Building's} data to instance of specific
     * {@link Building}.
     * @param building Converted {@link Building | Building's} data.
     * @returns Specific subclass of {@link Building}.
     */
export const instantiateBuilding = (building: Building): Building => {
    switch (building.type) {
        case BuildingsTypes.MAIN:
            return Object.assign(new MainBuilding(-1, -1), building);
            break;
        // Rest of types of Building to write here
        /*
        case BuildingsTypes.MINE:
            return Object.assign(new Mine(-1, -1), building);
            break;
        */
        default: throw new Error("Such Building type as " + building.type + " does not exist.");
    }
};

/**
     * Converts raw {@link MapField | MapField's} data to instance of specific
     * {@link MapField}.
     * @param mapFieldData Converted {@link MapField | MapField's} data.
     * @returns Specific subclass of {@link MapField}.
     */
export const instantiateMapField = (mapFieldData: MapField): MapField => {
    switch (mapFieldData.type) {
        case FieldsTypes.GRASSLAND:
            return Object.assign(new Grassland(-1, -1), mapFieldData);
            break;
        default: throw new Error("Such MapField type as " + mapFieldData.type + " does not exist.");
    }
};