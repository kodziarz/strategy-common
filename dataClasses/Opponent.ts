import Building from "./Building";

/**Stroes data which is known to specific {@link Player} about his opponent. */
export default class Opponent {


    buildings: Building[] = [];

    constructor(readonly userId: number) { }

    /**
     * Creates object which enables to identify which object should be on the
     * place, but without other information.
     * @returns New object with indentification data.
     */
    getIndentifier = () => {
        return {
            userId: this.userId
        };
    };

    /**
     * Creates object, which does contain such elements as buildings, but without
     * further circular dependencies.
     * @returns Copy of the object without circular depencies.
     */
    getSimplified = () => {
        let tmp: any = { ...this };
        tmp.buildings = this.buildings.map((building) => { return building.getSimplified(); });
        return tmp;
    };
}