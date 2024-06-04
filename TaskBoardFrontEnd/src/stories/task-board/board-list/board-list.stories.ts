import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatMenuModule } from "@angular/material/menu";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { Meta, StoryObj, applicationConfig, moduleMetadata } from "@storybook/angular";
import { APP_DATE_CONFIG, DATE_CONFIG, DateFormaterService, RedirectorService, StandartDateFormaterService } from "../../../app/modules/shared";
import { BoardItemComponent, BoardListComponent, BoardService } from "../../../app/modules/task-board";
import { MockBoardService, MockMatDialogRef, MockRedirectorService } from "../tasks/mockServices";

const meta: Meta<BoardListComponent> = {
    title: 'Task/BoardListComponent',
    component: BoardListComponent,
    subcomponents: { BoardItemComponent },
    decorators: [
        moduleMetadata({
            imports: [MatDialogModule, MatMenuModule, ReactiveFormsModule],
            providers: [
                MatDialog,
                FormBuilder,
                { provide: MatDialogRef, useClass: MockMatDialogRef },
                { provide: RedirectorService, useClass: MockRedirectorService },
                { provide: BoardService, useClass: MockBoardService },
                { provide: DateFormaterService, useClass: StandartDateFormaterService },
                { provide: DATE_CONFIG, useValue: APP_DATE_CONFIG },

            ],
            declarations: [BoardItemComponent]
        }),
        applicationConfig({
            providers: [
                provideAnimationsAsync()
            ]
        }),
    ],
};

export default meta;

type Story = StoryObj<BoardListComponent>;

export const Default: Story = {}