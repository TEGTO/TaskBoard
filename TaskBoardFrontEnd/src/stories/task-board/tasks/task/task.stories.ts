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
import { TaskComponent, TaskInfoComponent, TaskListService, TaskManagerComponent, TaskService } from "../../../../app/modules/task-board";
import { MockActivityService, MockTaskListService, MockTaskService, mockTask } from "../mockServices";

const meta: Meta<TaskComponent> = {
    title: 'Task/TaskComponent',
    component: TaskComponent,
    decorators: [
        moduleMetadata({
            imports: [MatDialogModule, FormsModule, MatMenuModule, MatSelectModule, MatNativeDateModule, MatDatepickerModule, ReactiveFormsModule],
            providers: [
                MatDialog,
                PriorityConvertorService,
                { provide: DateValidator, useClass: CustomDatePickerValidatorService },
                { provide: ActivityService, useClass: MockActivityService },
                { provide: DateFormaterService, useClass: StandartDateFormaterService },
                { provide: DATE_CONFIG, useValue: APP_DATE_CONFIG },
            ],
            declarations: [TaskInfoComponent, TaskManagerComponent]
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
        task: {
            control: 'object',
            description: 'Board task data',
        },
        boardId: {
            control: 'text',
            description: 'Board ID',
        },
    },
};

export default meta;
type Story = StoryObj<TaskComponent>;

export const Default: Story =
{
    args: {
        task: mockTask,
        boardId: '1',
    }
}
