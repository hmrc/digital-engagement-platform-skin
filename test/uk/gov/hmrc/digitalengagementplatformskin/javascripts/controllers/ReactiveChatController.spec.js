import CommonChatController from '../../../../../../../app/assets/javascripts/controllers/CommonChatController'
import ReactiveChatController from '../../../../../../../app/assets/javascripts/controllers/ReactiveChatController' 
import ClickToChatButtons from '../../../../../../../app/assets/javascripts/utils/ClickToChatButtons'
jest.mock('../../../../../../../app/assets/javascripts/utils/ClickToChatButtons');


describe("ReactiveChatController", () => {

    afterEach(() => {
        document.getElementsByTagName('html')[0].innerHTML = ''; 
    });

    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        ClickToChatButtons.mockClear();
      });

    it("launches a reactive chat", () => {
        const commonChatController = new CommonChatController();

        const sdk = {
            getOpenerScripts: jest.fn().mockReturnValue(null),
            chatDisplayed: jest.fn()
        }

        window.Inq = {
            SDK: sdk
        };

        
        commonChatController._launchChat();

        expect(sdk.getOpenerScripts).toHaveBeenCalledTimes(1);
        expect(sdk.chatDisplayed).toHaveBeenCalledTimes(1);

    });

    it("create an instance of click to chat buttons", () => {
        const reactiveChatController = new ReactiveChatController();

        expect(ClickToChatButtons).toHaveBeenCalledTimes(1);
    });

    it("sends C2C clicked event to Nuance", () => {

        const mockFn = jest.fn().mockName('_onC2CButtonClicked');
        const reactiveChatController = new ReactiveChatController();

       

        expect(mockFn).toHaveBeenCalled();

    })
});
