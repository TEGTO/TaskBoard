import { CdkDrag, CdkDropList } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { Meta, StoryObj, applicationConfig, moduleMetadata } from "@storybook/angular";
import { ActivityService } from "../../../../app/modules/action-history";
import { APP_DATE_CONFIG, CustomDatePickerValidatorService, DATE_CONFIG, DateFormaterService, DateValidator, PriorityConvertorService, StandartDateFormaterService } from "../../../../app/modules/shared";
import { TaskComponent, TaskInfoComponent, TaskListComponent, TaskListManagerComponent, TaskListService, TaskManagerComponent, TaskService } from "../../../../app/modules/task-board";
import { MockActivityService, MockTaskListService, MockTaskService, mockTaskList } from "../../../index";

const meta: Meta<TaskListComponent> = {
    title: 'Task/TaskListComponent',
    component: TaskListComponent,
    subcomponents: { TaskComponent, TaskListManagerComponent, TaskInfoComponent, TaskManagerComponent },
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule,
                MatDialogModule,
                FormsModule,
                MatMenuModule,
                MatSelectModule,
                MatNativeDateModule,
                MatDatepickerModule,
                ReactiveFormsModule,
                CdkDropList,
                CdkDrag,
            ],
            providers: [
                MatDialog,
                PriorityConvertorService,
                { provide: DateValidator, useClass: CustomDatePickerValidatorService },
                { provide: ActivityService, useClass: MockActivityService },
                { provide: DateFormaterService, useClass: StandartDateFormaterService },
                { provide: DATE_CONFIG, useValue: APP_DATE_CONFIG },
            ],
            declarations: [TaskComponent, TaskListManagerComponent, TaskInfoComponent, TaskManagerComponent]
        }),
        applicationConfig({
            providers: [
                provideAnimationsAsync(),
                { provide: DateValidator, useClass: CustomDatePickerValidatorService },
                { provide: TaskListService, useClass: MockTaskListService },
                { provide: TaskService, useClass: MockTaskService },
            ]
        }),
    ],
    argTypes: {
        taskList: {
            control: 'object',
            description: 'Board task list data',
        },
        boardId: {
            control: 'text',
            description: 'Board ID',
        },
    },
};

export default meta;
type Story = StoryObj<TaskListComponent>;

export const Edit: Story =
{
    args: {
        taskList: mockTaskList,
        boardId: '1',
    }
}

export const Create: Story =
{
    args: {
        taskList: undefined,
        boardId: '1',
    }
}