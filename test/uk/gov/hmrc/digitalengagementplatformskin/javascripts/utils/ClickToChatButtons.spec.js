import ClickToChatButtons from '../../../../../../../app/assets/javascripts/utils/ClickToChatButtons'
import * as DisplayState from '../../../../../../../app/assets/javascripts/NuanceDisplayState'

const displayStateMessages = {
    [DisplayState.OutOfHours]: "OutOfHoursText",
    [DisplayState.Ready]: "ReadyText",
    [DisplayState.Busy]: "BusyText",
    [DisplayState.ChatActive]: "ChatActiveText"
};

const testButton = document.createElement("div");

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
            replaceChild: jest.fn(_ => { return testButton; })
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

    it("updates button to ChatActive state", () => {
        const [, buttons, button] = setup();

        buttons.addButton(c2cObj(DisplayState.OutOfHours), button);
      
        buttons.updateC2CButtonsToInProgress();
      

        expect(button.replaceChild).toHaveBeenNthCalledWith(1, '<div class="button-class outofhours">OutOfHoursText</div>');
        expect(button.replaceChild).toHaveBeenNthCalledWith(2, '<div class="button-class chatactive">ChatActiveText</div>');
    });

    it("returns message for unknown state", () => {
        const [, buttons, ] = setup();

        const unknownState = "UnknownState";
    
        const result = buttons._getDisplayStateText(unknownState);
    
        expect(result).toContain("Unknown display state");
    });

    it("sets an onclick function given the click to chat object is launchable", () => {
        const [onClicked, buttons, button] = setup();
        const launchable = true;

        buttons.addButton(c2cObj(DisplayState.ChatActive, launchable), button);

        testButton.click();

        expect(onClicked).toBeCalledTimes(1);
        expect(onClicked).toBeCalledWith("c2cId");
    });
});
