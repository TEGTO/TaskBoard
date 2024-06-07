import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";
import { ActivityComponent } from "../../../app/modules/action-history";
import { APP_DATE_CONFIG, DATE_CONFIG, DateFormaterService, StandartDateFormaterService } from "../../../app/modules/shared";
import { mockActivity, mockActivityWithLongText } from "../../index";

const meta: Meta<ActivityComponent> = {
    title: 'Task/ActivityComponent',
    component: ActivityComponent,
    decorators: [
        moduleMetadata({
            providers: [
                { provide: DateFormaterService, useClass: StandartDateFormaterService },
                { provide: DATE_CONFIG, useValue: APP_DATE_CONFIG },

            ],
        })
    ],
    argTypes: {
        activity: {
            control: 'object',
            description: 'Activity data',
        },

    },
};

export default meta;

type Story = StoryObj<ActivityComponent>;

export const Default: Story =
{
    args: {
        activity: mockActivity
    }
}
export const WithLongText: Story =
{
    args: {
        activity: mockActivityWithLongText
    }
}