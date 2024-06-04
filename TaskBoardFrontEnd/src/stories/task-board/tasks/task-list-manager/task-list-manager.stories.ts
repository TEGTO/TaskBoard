import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";
import { TaskListManagerComponent, TaskListsPopupData } from "../../../../app/modules/task-board";
import { MockMatDialogRef, mockTaskList, mockTaskListWithLongText } from "../mockServices";

const meta: Meta<TaskListManagerComponent> = {
    title: 'Task/TaskListManagerComponent',
    component: TaskListManagerComponent,
    decorators: [
        moduleMetadata({
            imports: [MatDialogModule, ReactiveFormsModule],
            providers: [
                FormBuilder,
                { provide: MatDialogRef, useClass: MockMatDialogRef },
            ],
        }),
    ]
};

export default meta;

const createDialogDataDecorator = (data: TaskListsPopupData) => moduleMetadata({
    providers: [
        { provide: MAT_DIALOG_DATA, useValue: data }
    ]
});

type Story = StoryObj<TaskListManagerComponent>;

export const Edit: Story = {
    decorators: [
        createDialogDataDecorator({
            taskList: mockTaskList,
            boardId: "1",
        })
    ]
};
export const EditWithLongText: Story = {
    decorators: [
        createDialogDataDecorator({
            taskList: mockTaskListWithLongText,
            boardId: "1",
        })
    ]
};
export const Create: Story = {
    decorators: [
        createDialogDataDecorator({
            taskList: undefined,
            boardId: "1",
        })
    ]
}