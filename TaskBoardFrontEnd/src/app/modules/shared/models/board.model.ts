export interface Board {
    id: string;
    userId: string;
    creationTime: Date;
    name?: string;
}
export function getDefaultBoard() {
    const board: Board = {
        id: "",
        userId: "",
        creationTime: new Date(),
        name: "",
    };
    return board;
}
export function copyBoardValues(dest: Board, copied: Board) {
    if (dest && copied) {
        dest.id = copied?.id;
        dest.userId = copied?.userId;
        dest.creationTime = copied?.creationTime;
        dest.name = copied?.name;
    }
}