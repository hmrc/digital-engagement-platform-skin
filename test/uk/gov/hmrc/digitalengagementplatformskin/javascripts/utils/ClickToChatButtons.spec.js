import ClickToChatButtons from '../../../../../../../app/assets/javascripts/utils/ClickToChatButtons'
import * as DisplayState from '../../../../../../../app/assets/javascripts/NuanceDisplayState'

const displayStateMessages = {
    [DisplayState.OutOfHours]: "OutOfHoursText",
    [DisplayState.Ready]: "ReadyText",
    [DisplayState.Busy]: "BusyText",
    [DisplayState.ChatActive]: "ChatActiveText"
};

function setup() {
    const onClicked = jest.fn();
    return [
        // onClicked
        onClicked,
        // buttons
        new ClickToChatButtons(onClicked, displayStateMessages),
        // button
        {
            buttonClass: 'button-class',
            replaceChild: jest.fn()
        }
    ];
}

function c2cObj(displayState, launchable = false) {
    return {
        c2cIdx: 'c2c-id',
        displayState: displayState,
        launchable: launchable
    };
}

describe("ClickToChatButtons", () => {
    it("adds a button with active state", () => {
        console.error = jest.fn();
        const [, buttons, button] = setup();

        buttons.addButton(c2cObj(DisplayState.ChatActive), button);

        expect(button.replaceChild).toHaveBeenCalledWith('<div class="button-class chatactive">ChatActiveText</div>');
    });

    it("adds a button with out-of-hours state", () => {
        console.error = jest.fn();
        const [, buttons, button] = setup();

        buttons.addButton(c2cObj(DisplayState.OutOfHours), button);

        expect(button.replaceChild).toHaveBeenCalledWith('<div class="button-class outofhours">OutOfHoursText</div>');
    });

    it("adds a button with ready state", () => {
        console.error = jest.fn();
        const [, buttons, button] = setup();

        buttons.addButton(c2cObj(DisplayState.Ready), button);

        expect(button.replaceChild).toHaveBeenCalledWith('<div class="button-class ready">ReadyText</div>');
    });

    it("adds a button with busy state", () => {
        console.error = jest.fn();
        const [, buttons, button] = setup();

        buttons.addButton(c2cObj(DisplayState.Busy), button);

        expect(button.replaceChild).toHaveBeenCalledWith('<div class="button-class busy">BusyText</div>');
    });
});
