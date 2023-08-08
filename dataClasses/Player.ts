import Building from "./Building";
import MapField from "./MapField";
import Opponent from "./Opponent";
import Commodity from "./Commodity";
import Unit from "./Unit";
import SimplifiedPlayer from "../socketioMessagesClasses/SimplifiedPlayer";

/**
 * Stores player's game-connected data.
 * @see {@link User} - class which stores user-specific cross-game data.
 */
export default class Player {

    readonly userId: number;
    /**
     * List of {@link MapField}s on which changes are instantly
     * sent to client.
     */
    readonly observedMapFields: MapField[] = [];
    /**
     * List of {@link MapField}s which were only visited and their state is not
     * instantly sent to client.
     * Stored {@link MapField}s are copies of fields from
     * {@link Map} created at the last moment the {@link MapField} was
     * observed.
     * List is sent after the {@link Player} joined game in case it is a
     * reconnection and that data is lost by client.
     */
    readonly visitedMapFields: MapField[] = [];

    /**List of {@link Building}s owned by player. */
    readonly buildings: Building[] = [];

    /**List of {@link Commodity}s owned by player. */
    readonly commodities: Commodity[] = [];

    /**List of {@link Unit}s owned by the player.  */
    readonly units: Unit[] = [];

    /**Data known to player about his opponents. */
    readonly opponents: Opponent[] = [];

    /**Game map width (in {@link MapField}s). */
    readonly columns: number;

    /**Game map height (in {@link MapField}s). */
    readonly rows: number;

    constructor(
        userId: number,
        columns: number,
        rows: number
    ) {
        this.userId = userId;
        this.columns = columns;
        this.rows = rows;
    }

    getOpponentById(userId: number): Opponent | null {
        for (const opponent of this.opponents) {
            if (opponent.userId == userId)
                return opponent;
        }
        return null;
    }

    toJSON() {
        let copy: SimplifiedPlayer = { ...this };
        copy.observedMapFields = this.observedMapFields.map((mapField) => { return mapField.getWithIdentifiers(); });
        // notice: there are stored deep copies in visitedMapFields
        copy.visitedMapFields = this.visitedMapFields.map((mapField) => { return mapField.getWithIdentifiers(); });
        copy.buildings = this.buildings.map((building) => { return building.getWithIdentifiers(); });
        copy.units = this.units.map((unit) => { return unit.getWithIdentifiers(); });
        copy.opponents = this.opponents.map((opponent) => { return opponent.getSimplified(); });
        return copy;
    };
}