import UnitIdentifier from "./UnitIdentifier";
export default interface UnitMoveResponse {
    /**Unix time of start. */
    start: number;
    /**Id of {@link Movement}. */
    id: string;
}