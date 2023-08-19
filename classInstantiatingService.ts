import Building from "./dataClasses/Building";
import MapField from "./dataClasses/MapField";
import Opponent from "./dataClasses/Opponent";
import BuildingsTypes from "./dataClasses/buildings/BuildingsTypes";
import MainBuilding from "./dataClasses/buildings/MainBuilding";
import FieldsTypes from "./dataClasses/mapFields/FieldsTypes";
import Grassland from "./dataClasses/mapFields/Grassland";
import BuildingWithIdentifiers from "./socketioMessagesClasses/BuildingWithIdentifiers";
import MapFieldWithIdentifiers from "./socketioMessagesClasses/MapFieldWithIdentifiers";
import Unit from "./dataClasses/Unit";
import UnitTypes from "./dataClasses/units/UnitTypes";
import Builder from "./dataClasses/units/Builder";
import UnitWithIdentifiers from "./socketioMessagesClasses/UnitWithIdentifiers";
import UnitIdentifier from "./socketioMessagesClasses/UnitIdentifier";
import Point2d from "./geometryClasses/Point2d";

/**
     * Converts raw {@link Building | Building's} data to instance of specific
     * {@link Building}.
     * @param buildingData Converted {@link Building | Building's} data.
     * @param fieldsMap Two-dimentional map of fields.
     * @returns Specific subclass of {@link Building}.
     */
export const instantiateBuilding = (buildingData: BuildingWithIdentifiers): Building => {
    switch (buildingData.type) {
        case BuildingsTypes.MAIN:
            return Object.assign(new MainBuilding(-1, -1, buildingData.ownerId), buildingData);
            break;
        // Rest of types of Building to write here
        /*
        case BuildingsTypes.MINE:
            return Object.assign(new Mine(-1, -1), building);
            break;
        */
        default: throw new Error("Such Building type as " + buildingData.type + " does not exist.");
    }
};

// this function cannot be used on client, because there can be a building, which
// has not observed fields. Then the MapFieldPlaceholder needs to be inserted on 
// its place. Thus this is not a common function and needs to have separate
// implementations on server and client.
// /**
//  * Fills inner data structure with specific objects (like {@link MapField}s).
//  * @param buildingData Filled Building.
//  * @param fieldsMap Two-dimentional map of fields, which are insterted into data structure.
//  */
// export const fillBuilding = (buildingData: Building, fieldsMap: MapField[][]) => {
//     buildingData.occupiedFields.forEach((field, i, array) => {
//         array[i] = fieldsMap[field.column][field.row];
//     });
// };

/**
     * Converts raw {@link MapField}'s data to instance of specific
     * {@link MapField}, but does not fill it with object data
     * (like {@link Building}s) - leaves there raw JSON data.
     * @param mapFieldData Converted {@link MapField | MapField's} data.
     * @returns Specific subclass of {@link MapField}.
     */
export const instantiateMapField = (mapFieldData: MapFieldWithIdentifiers): MapField => {
    switch (mapFieldData.type) {
        case FieldsTypes.GRASSLAND:
            return Object.assign(new Grassland(-1, -1), mapFieldData);
            break;
        default: throw new Error("Such MapField type as " + mapFieldData.type + " does not exist.");
    }
};

/**
 * Fills inner data structure with specific objects (like {@link Building}s).
 * @param mapFieldData Filled field.
 * @param allBuildings Array of all buildings, to fill data sructure.
 */
export const fillMapField = (mapFieldData: MapField, allBuildings: Building[], allUnits: Unit[]) => {
    mapFieldData.buildings.forEach((buildingData, i, array) => {
        let foundBuilding = allBuildings.find((checkedBuilding) => { return checkedBuilding.id == buildingData.id; });
        if (!foundBuilding)
            throw new Error("Such a building with id " + buildingData.id + " does not exist.");
        else array[i] = foundBuilding;
    });
    mapFieldData.units.forEach((unitData, i, array) => {
        let foundUnit = allUnits.find((checkedUnit) => { return checkedUnit.id == unitData.id; });
        if (!foundUnit)
            throw new Error("Such a unit with id " + unitData.id + " does not exist.");
        else array[i] = foundUnit;
    });
};

export const instantiateUnit = (unitData: UnitWithIdentifiers): Unit => {
    switch (unitData.type) {
        case UnitTypes.BUILDER:
            return Object.assign(new Builder(-1), unitData);
            break;
        default: throw new Error("Such MapField type as " + unitData.type + " does not exist.");
    }
};

/**
 * Instantiates and binds raw JSON opponent data.
 * @param opponentData Instantiated opponent data.
 * @param allBuildings Array of all buildings, to fill data sructure.
 * @returns Instantiated opponent.
 */
export const instantiateOpponent = (opponentData: Opponent, allBuildings: Building[]): Opponent => {
    opponentData.buildings = opponentData.buildings.map((buildingIdentifier) => {
        let actualBuilding = allBuildings.find((checkedBuilding) => {
            return checkedBuilding.id == buildingIdentifier.id;
        });
        if (actualBuilding)
            return actualBuilding;
        else throw new Error("The building (id: " + buildingIdentifier.id + ") the server send does not exist on client.");
    });
    return Object.assign(new Opponent(opponentData.userId), opponentData);
};

/**
 * Finds actual user object by its identifier.
 * @param identifier Unit identifier.
 * @param unitsList List with all units to find actual unit by identifier.
 * @returns Actual unit or undefined if not found.
 */
export const findUnit = (identifier: UnitIdentifier, unitsList: Unit[]) => {
    return unitsList.find((checkedUnit) => { return checkedUnit.id == identifier.id; });
};

/**
 * Instantiates raw {@link Point2d} json data.
 * @param pointData Raw json data of {@link Point2d}.
 * @returns Instantiated point with given data.
 */
export const instantiatePoint = (pointData: Point2d): Point2d => {
    return Object.assign(new Point2d(0, 0), pointData);
};