import CommonChatController from '../../../../../../../app/assets/javascripts/controllers/CommonChatController'
import ReactiveChatController from '../../../../../../../app/assets/javascripts/controllers/ReactiveChatController'
import ClickToChatButtons from '../../../../../../../app/assets/javascripts/utils/ClickToChatButtons'
import ClickToChatButton from '../../../../../../../app/assets/javascripts/utils/ClickToChatButton'

describe("ReactiveChatController", () => {
    it("launches a reactive chat", () => {

        const commonChatController = new CommonChatController();
        const reactiveChatController = new ReactiveChatController();
        // const addC2CButton = new ClickToChatButton();
        const clickToChatButtons = new ClickToChatButtons();
        // const clickToChatButton = new ClickToChatButton();
        //const getDisplayStateText = jest.fn("chatactive");

        // const displayState = {
        //     name: "chatactive"
        // };

        let c2cObj = {
            c2cIdx: "c2cId",
            displayState: "chatactive",
            launchable: true
        };
        // const buttonText = getDisplayStateText;
        const button = "buttonClass";
        // const innerHTML = `<div class="${button.buttonClass} ${c2cObj.displayState}">${buttonText}</div>`;
        // const buttonClass = {
        //     button: addC2CButton
        // };
        // const div = button.replaceChild(innerHTML);
        // const divID = {
        //     divID: "HMRC_CIAPI_Anchored_1"
        // };
        // const displayStateMessages = {
        //     displayStateMessages: jest.fn()
        // };

        const sdk = {
            isChatInProgress: jest.fn().mockReturnValue(false),
            //     getOpenerScripts: jest.fn().mockReturnValue(null),
            //     button: jest.fn().mockReturnValue(null),
            //displayStateMessages: jest.fn("chatactive"),
            chatDisplayed: jest.fn()
        };

        window.Inq = {
            SDK: sdk
        };

        // const displayStateMessages = {
        //     displayStateMessages: jest.fn("chatactive")
        // };

        // window.DisplayState = {
        //     displayStateMessages: displayStateMessages
        // };

        commonChatController.nuanceFrameworkLoaded(window);
        clickToChatButtons.updateC2CButtonsToInProgress();
        //clickToChatButtons.displayStateMessages(displayStateMessages);
        //clickToChatButtons.onClicked;
        clickToChatButtons.addButton(c2cObj, button);
        //clickToChatButtons.displayStateMessages;
        // clickToChatButton.replaceChild(div);
        // reactiveChatController.addC2CButton(c2cObj, divID, buttonClass);
        reactiveChatController.addC2CButton();

        // expect(sdk.getOpenerScripts).toHaveBeenCalled();
        expect(sdk.chatDisplayed).toHaveBeenCalled();
        // expect(displayStateMessages.displayStateMessages).toHaveBeenCalled();
    });
});