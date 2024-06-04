import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { Meta, StoryObj, applicationConfig, moduleMetadata } from "@storybook/angular";
import { ActivityService } from "../../../../app/modules/action-history";
import { APP_DATE_CONFIG, CustomDatePickerValidatorService, DATE_CONFIG, DateFormaterService, DateValidator, StandartDateFormaterService } from "../../../../app/modules/shared";
import { TaskListService, TaskManagerComponent, TaskPopupData, TaskService } from "../../../../app/modules/task-board";
import { MockActivityService, MockMatDialogRef, MockTaskListService, MockTaskService, mockTask, mockTaskLongText } from "../mockServices";

const meta: Meta<TaskManagerComponent> = {
    title: 'Task/TaskManagerComponent',
    component: TaskManagerComponent,
    decorators: [
        moduleMetadata({
            imports: [MatDialogModule, MatSelectModule, MatNativeDateModule, MatDatepickerModule, MatMenuModule, ReactiveFormsModule],
            providers: [
                FormBuilder,
                { provide: MatDialogRef, useClass: MockMatDialogRef },
                { provide: DateValidator, useClass: CustomDatePickerValidatorService },
                { provide: TaskService, useClass: MockTaskService },
                { provide: TaskListService, useClass: MockTaskListService },
                { provide: ActivityService, useClass: MockActivityService },
                { provide: DateFormaterService, useClass: StandartDateFormaterService },
                { provide: DATE_CONFIG, useValue: APP_DATE_CONFIG },
            ],
        }),
        applicationConfig({
            providers: [
                provideAnimationsAsync(),
            ]
        }),
    ]
};

export default meta;

const createDialogDataDecorator = (data: TaskPopupData) => moduleMetadata({
    providers: [
        { provide: MAT_DIALOG_DATA, useValue: data }
    ]
});

type Story = StoryObj<TaskManagerComponent>;

export const Edit: Story = {
    decorators: [
        createDialogDataDecorator({
            task: mockTask,
            taskListId: "1",
            boardId: "1",
        })
    ]
};
export const EditWithLongText: Story = {
    decorators: [
        createDialogDataDecorator({
            task: mockTaskLongText,
            taskListId: "1",
            boardId: "1",
        })
    ]
};
export const Create: Story = {
    decorators: [
        createDialogDataDecorator({
            task: undefined,
            taskListId: "1",
            boardId: "1",
        })
    ]
};