import CommonChatController from '../../../../../../../app/assets/javascripts/controllers/CommonChatController'
import ProactiveChatController from '../../../../../../../app/assets/javascripts/controllers/ProactiveChatController'

describe("ProactiveChatController", () => {

    afterEach(() => {
        document.getElementsByTagName('html')[0].innerHTML = ''; 
    });

    it("launches a proactive chat", () => {
        const commonChatController = new CommonChatController();
        const proactiveChatController = new ProactiveChatController();

        const sdk = {
            isChatInProgress: jest.fn().mockReturnValue(false),
            getOpenerScripts: jest.fn().mockReturnValue(null),
            chatDisplayed: jest.fn()
        };

        window.Inq = {
            SDK: sdk
        };

        commonChatController.nuanceFrameworkLoaded(window);
        proactiveChatController.launchProactiveChat();

        expect(sdk.getOpenerScripts).toHaveBeenCalledTimes(1);
        expect(sdk.chatDisplayed).toHaveBeenCalledTimes(1);
    });
});