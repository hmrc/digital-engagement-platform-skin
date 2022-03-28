import CommonChatController from '../../../../../../../app/assets/javascripts/controllers/CommonChatController'
//import ReactiveChatController from '../../../../../../../app/assets/javascripts/controllers/ReactiveChatController' 
import ClickToChatButtons from '../../../../../../../app/assets/javascripts/utils/ClickToChatButtons'

describe("ReactiveChatController", () => {

    afterEach(() => {
        document.getElementsByTagName('html')[0].innerHTML = ''; 
    });

    it("launches a reactive chat", () => {
        const commonChatController = new CommonChatController();
        //const reactiveChatController = new ReactiveChatController();
        const clickToChatButtons = new ClickToChatButtons();

        const sdk = {
            getOpenerScripts: jest.fn().mockReturnValue(null),
            chatDisplayed: jest.fn()
        }

        window.Inq = {
            SDK: sdk
        };

        
        commonChatController._launchChat();
        clickToChatButtons.onClicked()

        expect(sdk.getOpenerScripts).toHaveBeenCalledTimes(1);
        expect(sdk.chatDisplayed).toHaveBeenCalledTimes(1);

    });
});
