import { TaskListState } from "../../index";
import { selectAllTaskLists, selectTaskError, selectTaskListState } from "./tasks.selector";

describe('Task List Selectors', () => {
    const initialState: TaskListState = {
        taskLists: [
            { id: "1", boardId: "1", creationTime: new Date(), name: 'Task List 1', boardTasks: [] },
            { id: "2", boardId: "2", creationTime: new Date(), name: 'Task List 2', boardTasks: [] },
        ],
        error: null
    };
    const errorState: TaskListState = {
        taskLists: [],
        error: 'An error occurred'
    };

    it('should select the task list state', () => {
        const result = selectTaskListState.projector(initialState);
        expect(result).toEqual(initialState);
    });
    it('should select all task lists', () => {
        const result = selectAllTaskLists.projector(initialState);
        expect(result).toEqual(initialState.taskLists);
    });
    it('should select task error', () => {
        const result = selectTaskError.projector(errorState);
        expect(result).toEqual(errorState.error);
    });
});