import { CdkDrag, CdkDropList, CdkDropListGroup } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { ActivatedRoute } from "@angular/router";
import { Meta, StoryObj, applicationConfig, moduleMetadata } from "@storybook/angular";
import { of } from "rxjs";
import { ActivityComponent, ActivityHistoryComponent, ActivityService } from "../../../../app/modules/action-history";
import { APP_DATE_CONFIG, CustomDatePickerValidatorService, DATE_CONFIG, DateFormaterService, DateValidator, PriorityConvertorService, RedirectorService, StandartDateFormaterService } from "../../../../app/modules/shared";
import { BoardComponent, BoardService, TaskComponent, TaskInfoComponent, TaskListComponent, TaskListManagerComponent, TaskListService, TaskManagerComponent, TaskService } from "../../../../app/modules/task-board";
import { MockActivityService, MockBoardService, MockRedirectorService, MockTaskListService, MockTaskService, mockBoard } from "../../../index";

const meta: Meta<BoardComponent> = {
    title: 'Task/BoardComponent',
    component: BoardComponent,
    subcomponents: { TaskListComponent, ActivityHistoryComponent },
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
                CdkDropListGroup
            ],
            providers: [
                MatDialog,
                PriorityConvertorService,
                { provide: RedirectorService, useClass: MockRedirectorService },
                { provide: BoardService, useClass: MockBoardService },
                { provide: DateValidator, useClass: CustomDatePickerValidatorService },
            ],
            declarations: [
                TaskListComponent,
                TaskComponent,
                ActivityHistoryComponent,
                TaskListManagerComponent,
                TaskInfoComponent,
                TaskManagerComponent,
                ActivityComponent
            ]
        }),
        applicationConfig({
            providers: [
                provideAnimationsAsync(),
                { provide: DateValidator, useClass: CustomDatePickerValidatorService },
                { provide: TaskListService, useClass: MockTaskListService },
                { provide: TaskService, useClass: MockTaskService },
                { provide: ActivityService, useClass: MockActivityService },
                { provide: DateFormaterService, useClass: StandartDateFormaterService },
                { provide: DATE_CONFIG, useValue: APP_DATE_CONFIG },
            ]
        }),
    ],
};

export default meta;

const activeRouterParamDecorator = (id: string) => moduleMetadata({
    providers: [
        { provide: ActivatedRoute, useValue: { params: of({ 'boardId': id }) } }
    ]
});

type Story = StoryObj<BoardComponent>;

export const Default: Story =
{
    decorators: [
        activeRouterParamDecorator(mockBoard.id)
    ]
}