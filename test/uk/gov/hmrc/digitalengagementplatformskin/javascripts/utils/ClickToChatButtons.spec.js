import ClickToChatButtons from '../../../../../../../app/assets/javascripts/utils/ClickToChatButtons'
import * as DisplayState from '../../../../../../../app/assets/javascripts/NuanceDisplayState'
import { messages } from '../../../../../../../app/assets/javascripts/utils/Messages';
import { timerUtils } from '../../../../../../../app/assets/javascripts/utils/TimerUtils';

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
    afterEach(() => {
        jest.clearAllMocks()
    });
    
    it("adds a button with active state", () => {
        const [, buttons, button] = setup();
        const stopTogglingPageTitleSpy = jest.spyOn(timerUtils, 'stopTogglingPageTitle').mockImplementation(() => {});

        buttons.addButton(c2cObj(DisplayState.ChatActive), button);

        expect(button.replaceChild).toHaveBeenCalledWith('<div class="chatactive">ChatActiveText</div>', false);
        expect(stopTogglingPageTitleSpy).toHaveBeenCalledTimes(1);
    });

    it("adds a button with out-of-hours state", () => {
        const [, buttons, button] = setup();
        const updateAndTogglePageTitleSpy = jest.spyOn(timerUtils, 'updateAndTogglePageTitle').mockImplementation(() => {});

        buttons.addButton(c2cObj(DisplayState.OutOfHours), button);

        expect(button.replaceChild).toHaveBeenCalledWith('<h2 class="govuk-heading-m outofhours">OutOfHoursText</h2>', false);
        expect(updateAndTogglePageTitleSpy).toHaveBeenCalledTimes(1);
        expect(updateAndTogglePageTitleSpy).toHaveBeenCalledWith("OutOfHoursText");
    });

    it("adds a button with ready state", () => {
        const [, buttons, button] = setup();
        const updateAndTogglePageTitleSpy = jest.spyOn(timerUtils, 'updateAndTogglePageTitle').mockImplementation(() => {});

        buttons.addButton(c2cObj(DisplayState.Ready), button);

        expect(button.replaceChild).toHaveBeenCalledWith(`<h2 class="govuk-heading-m">${messages.readyHeading}</h2><div class="ready">ReadyText</div><button id="startChatButton" aria-disabled="false" class="button-class ready govuk-button" data-module="govuk-button">${messages.c2cButton}</button>`, false);
        expect(updateAndTogglePageTitleSpy).toHaveBeenCalledTimes(1);
        expect(updateAndTogglePageTitleSpy).toHaveBeenCalledWith(messages.readyHeading);
    });

    it("adds a button with busy state", () => {
        const [, buttons, button] = setup();
        const updateAndTogglePageTitleSpy = jest.spyOn(timerUtils, 'updateAndTogglePageTitle').mockImplementation(() => {});

        buttons.addButton(c2cObj(DisplayState.Busy), button);

        expect(button.replaceChild).toHaveBeenCalledWith(`<h2 class="govuk-heading-m">${messages.busyHeading}</h2><div class="busy">BusyText</div><button disabled aria-disabled="true" class="button-class busy govuk-button" data-module="govuk-button">${messages.c2cButton}</button>`, false);
        expect(updateAndTogglePageTitleSpy).toHaveBeenCalledTimes(1);
        expect(updateAndTogglePageTitleSpy).toHaveBeenCalledWith(messages.busyHeading);
    });

    it("updates button to ChatActive state", () => {
        const [, buttons, button] = setup();

        buttons.addButton(c2cObj(DisplayState.OutOfHours), button);

        buttons.updateC2CButtonsToInProgress();

        expect(button.replaceChild).toHaveBeenNthCalledWith(1, '<h2 class="govuk-heading-m outofhours">OutOfHoursText</h2>', false);
        expect(button.replaceChild).toHaveBeenNthCalledWith(2, '<div class="chatactive">ChatActiveText</div>', false);
    });

    it("returns message for unknown state", () => {
        const [, buttons,] = setup();

        const unknownState = "UnknownState";

        const result = buttons._getDisplayStateText(unknownState);

        expect(result).toContain("Unknown display state");
    });

    it("sets an onclick function for the anchored C2C given the click to chat object is launchable", () => {
        const [onClicked, buttons, button] = setup();
        const launchable = true;
        button.buttonClass = 'anchored'

        buttons.addButton(c2cObj(DisplayState.ChatActive, launchable), button);

        testButton.click();

        expect(onClicked).toHaveBeenCalledTimes(1);
        expect(onClicked).toHaveBeenCalledWith("c2cId");
    });
});
