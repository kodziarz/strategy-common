export default interface ReportUnitMoveMessage {
    movementId: string;
    position: { x: number; y: number; };
    timestamp: number;
    nextPointIndex: number;
}