import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";
import { Board } from "../../../../app/modules/shared";
import { BoardManagerComponent } from "../../../../app/modules/task-board";
import { MockMatDialogRef, mockBoard, mockBoardLotOfText } from "../../tasks/mockServices";

const meta: Meta<BoardManagerComponent> = {
    title: 'Task/BoardManagerComponent',
    component: BoardManagerComponent,
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

const createDialogDataDecorator = (data: Board | undefined) => moduleMetadata({
    providers: [
        { provide: MAT_DIALOG_DATA, useValue: data }
    ]
});

type Story = StoryObj<BoardManagerComponent>;

export const EditDefault: Story = {
    decorators: [
        createDialogDataDecorator(mockBoard)
    ]
};
export const EditLotOfText: Story = {
    decorators: [
        createDialogDataDecorator(mockBoardLotOfText)
    ]
};
export const CreateDefault: Story = {
    decorators: [
        createDialogDataDecorator(undefined)
    ]
}