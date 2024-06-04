import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { Meta, StoryObj, applicationConfig, moduleMetadata } from "@storybook/angular";
import { ActivityService } from "../../../../app/modules/action-history";
import { APP_DATE_CONFIG, CustomDatePickerValidatorService, DATE_CONFIG, DateFormaterService, DateValidator, StandartDateFormaterService } from "../../../../app/modules/shared";
import { TaskInfoComponent, TaskListService, TaskManagerComponent, TaskPopupData, TaskService } from "../../../../app/modules/task-board";
import { MockActivityService, MockMatDialogRef, MockTaskListService, MockTaskService, mockTask, mockTaskLotOfText } from "../mockServices";

const meta: Meta<TaskInfoComponent> = {
    title: 'Task/TaskInfoComponent',
    component: TaskInfoComponent,
    decorators: [
        moduleMetadata({
            imports: [MatDialogModule, FormsModule, MatMenuModule, MatSelectModule, MatNativeDateModule, MatDatepickerModule, ReactiveFormsModule],
            providers: [
                MatDialog,
                { provide: ActivityService, useClass: MockActivityService },
                { provide: DateFormaterService, useClass: StandartDateFormaterService },
                { provide: DATE_CONFIG, useValue: APP_DATE_CONFIG },
            ],
            declarations: [TaskManagerComponent]
        }),
        applicationConfig({
            providers: [
                provideAnimationsAsync(),
                { provide: DateValidator, useClass: CustomDatePickerValidatorService },
                { provide: TaskListService, useClass: MockTaskListService },
                { provide: TaskService, useClass: MockTaskService },
                { provide: MatDialogRef, useClass: MockMatDialogRef },
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

type Story = StoryObj<TaskInfoComponent>;

export const Default: Story = {
    decorators: [
        createDialogDataDecorator({
            task: mockTask,
            taskListId: "1",
            boardId: "1",
        })
    ]
};

export const LotOfText: Story = {
    decorators: [
        createDialogDataDecorator({
            task: mockTaskLotOfText,
            taskListId: "1",
            boardId: "1",
        })
    ]
};
