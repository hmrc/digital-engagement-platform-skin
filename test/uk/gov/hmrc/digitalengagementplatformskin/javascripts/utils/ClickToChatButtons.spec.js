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
        c2cIdx: 'c2cId',
        displayState: displayState,
        launchable: launchable
    };
}

describe("ClickToChatButtons", () => {
    it("adds a button with active state", () => {
        const [, buttons, button] = setup();

        buttons.addButton(c2cObj(DisplayState.ChatActive), button);

        expect(button.replaceChild).toHaveBeenCalledWith('<div class="button-class chatactive">ChatActiveText</div>');
    });

    it("adds a button with out-of-hours state", () => {
        const [, buttons, button] = setup();

        buttons.addButton(c2cObj(DisplayState.OutOfHours), button);

        expect(button.replaceChild).toHaveBeenCalledWith('<div class="button-class outofhours">OutOfHoursText</div>');
    });

    it("adds a button with ready state", () => {
        const [, buttons, button] = setup();

        buttons.addButton(c2cObj(DisplayState.Ready), button);

        expect(button.replaceChild).toHaveBeenCalledWith('<div class="button-class ready">ReadyText</div>');
    });

    it("adds a button with busy state", () => {
        const [, buttons, button] = setup();

        buttons.addButton(c2cObj(DisplayState.Busy), button);

        expect(button.replaceChild).toHaveBeenCalledWith('<div class="button-class busy">BusyText</div>');
    });

    it("updates all buttons to ChatActive state", () => {
        const [, buttons, button] = setup();

        buttons.addButton(c2cObj(DisplayState.OutOfHours), button);
        buttons.addButton(c2cObj(DisplayState.Ready), button);
        buttons.addButton(c2cObj(DisplayState.Busy), button);
      
        buttons.updateC2CButtonsToInProgress();
      
        expect(button.replaceChild).toHaveBeenNthCalledWith(1, '<div class="button-class chatactive">ChatActiveText</div>');
        expect(button.replaceChild).toHaveBeenNthCalledWith(2, '<div class="button-class chatactive">ChatActiveText</div>');
        expect(button.replaceChild).toHaveBeenNthCalledWith(3, '<div class="button-class chatactive">ChatActiveText</div>');
      });

    it("returns message for unknown state", () => {
        const [, buttons, ] = setup();

        const unknownState = "UnknownState";
    
        const result = buttons._getDisplayStateText(unknownState);
    
        expect(result).toContain("Unknown display state");
    });
});
