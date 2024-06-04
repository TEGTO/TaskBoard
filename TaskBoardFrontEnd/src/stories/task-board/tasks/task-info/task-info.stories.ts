import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from "@angular/material/dialog";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { Meta, StoryObj, applicationConfig, moduleMetadata } from "@storybook/angular";
import { ActivityService } from "../../../../app/modules/action-history";
import { APP_DATE_CONFIG, DATE_CONFIG, DateFormaterService, StandartDateFormaterService } from "../../../../app/modules/shared";
import { TaskInfoComponent, TaskListService, TaskPopupData } from "../../../../app/modules/task-board";
import { MockActivityService, MockTaskListService, mockTask, mockTaskMuchText } from "../mockServices";

const meta: Meta<TaskInfoComponent> = {
    title: 'Task/TaskInfoComponent',
    component: TaskInfoComponent,
    decorators: [
        moduleMetadata({
            imports: [MatDialogModule],
            providers: [
                MatDialog,
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
            task: mockTaskMuchText,
            taskListId: "1",
            boardId: "1",
        })
    ]
};
