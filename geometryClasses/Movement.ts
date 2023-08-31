import Unit from "./../dataClasses/Unit";
import Path from "./Path";

export default class Movement {
    id: string;
    unit: Unit;
    path: Path;
    /** Unix time date of start.*/
    start: number;
    nextPointIndex: number;
    lastTimestamp: number;
}