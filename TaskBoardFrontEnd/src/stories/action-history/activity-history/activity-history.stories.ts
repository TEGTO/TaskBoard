import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { Meta, StoryObj, applicationConfig, moduleMetadata } from "@storybook/angular";
import { ActivityComponent, ActivityHistoryComponent, ActivityPopupData, ActivityService } from "../../../app/modules/action-history";
import { APP_DATE_CONFIG, DATE_CONFIG, DateFormaterService, StandartDateFormaterService } from "../../../app/modules/shared";
import { MockActivityService, MockMatDialogRef, mockBoard, mockBoardWithLongText, mockBoardWithManyActvities } from "../../index";

const meta: Meta<ActivityHistoryComponent> = {
    title: 'Task/ActivityHistoryComponent',
    component: ActivityHistoryComponent,
    subcomponents: { ActivityComponent },
    decorators: [
        moduleMetadata({
            imports: [MatDialogModule],
            providers: [
                { provide: ActivityService, useClass: MockActivityService },
                { provide: DateFormaterService, useClass: StandartDateFormaterService },
                { provide: DATE_CONFIG, useValue: APP_DATE_CONFIG },

            ],
            declarations: [ActivityComponent]
        }),
        applicationConfig({
            providers: [
                provideAnimationsAsync(),
                { provide: MatDialogRef, useClass: MockMatDialogRef },
            ]
        }),
    ],
    argTypes: {
        page: {
            control: 'number',
            description: 'What page is last loaded',
        },
        amountOnPage: {
            control: 'number',
            description: 'Amount actvities on a page',
        },

    },
};

export default meta;
const createDialogDataDecorator = (data: ActivityPopupData) => moduleMetadata({
    providers: [
        { provide: MAT_DIALOG_DATA, useValue: data }
    ]
});

type Story = StoryObj<ActivityHistoryComponent>;

export const Default: Story =
{
    decorators: [
        createDialogDataDecorator({
            board: mockBoard,
        })
    ]
}
export const WithLongText: Story =
{
    decorators: [
        createDialogDataDecorator({
            board: mockBoardWithLongText,
        })
    ]
}
export const ManyActivities: Story =
{
    decorators: [
        createDialogDataDecorator({
            board: mockBoardWithManyActvities,
        })
    ]
}
