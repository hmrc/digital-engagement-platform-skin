import ReactiveChatController from '../../../../../../../app/assets/javascripts/controllers/ReactiveChatController' 
import CommonChatController from '../../../../../../../app/assets/javascripts/controllers/CommonChatController'
import ClickToChatButtons from '../../../../../../../app/assets/javascripts/utils/ClickToChatButtons'
import {_onC2CButtonClicked} from '../../../../../../../app/assets/javascripts/controllers/ReactiveChatController'

jest.mock('../../../../../../../app/assets/javascripts/utils/ClickToChatButtons')
jest.mock('../../../../../../../app/assets/javascripts/controllers/CommonChatController')

describe("ReactiveChatController", () => {

    afterEach(() => {
        document.getElementsByTagName('html')[0].innerHTML = ''; 
    });

    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        ClickToChatButtons.mockClear();
        CommonChatController.mockClear();
        console.error = jest.fn();
    });

    it("create an instance of click to chat buttons", () => {
        new ReactiveChatController();

        expect(ClickToChatButtons).toHaveBeenCalledTimes(1);
    });

    it("sends C2C clicked event to Nuance", () => {
        const reactiveChatController = new ReactiveChatController();

        const sdk = {
            onC2CClicked: jest.fn(),
        };

        window.Inq = {
            SDK: sdk
        };
        let _onC2CButtonClickedSpy = jest.spyOn(reactiveChatController, '_onC2CButtonClicked');
        reactiveChatController._onC2CButtonClicked();

        expect(sdk.onC2CClicked).toHaveBeenCalledTimes(1);
        expect(_onC2CButtonClickedSpy).toBeCalledTimes(1);
    });

    it("addC2CButton creates a new ClickToChatButton", () => {
        const reactiveChatController = new ReactiveChatController();
        const c2cObj = 'ChatActiveText';
        const divId = "div-id";
        const buttonClass = "button-class";


        let addC2CButtonSpy = jest.spyOn(reactiveChatController, 'addC2CButton');
        reactiveChatController.addC2CButton(c2cObj, divId, buttonClass);

        expect(addC2CButtonSpy).toHaveBeenCalledTimes(1);
    });

    it("attaches a callback function to the SDK onC2CClicked method", () => {

        const reactiveChatController = new ReactiveChatController();
        const commonChatController = new CommonChatController();

        reactiveChatController.commonChatController = commonChatController;

        const onC2CClickedFunction = jest.fn();

        window.Inq = {
            SDK: { onC2CClicked: onC2CClickedFunction }
        };

        const c2cIdx = 123;
        reactiveChatController._onC2CButtonClicked(c2cIdx);

        // call the second argument (the callback) of onC2CClicked
        onC2CClickedFunction.mock.calls[0][1]();

        expect(onC2CClickedFunction).toBeCalledWith(c2cIdx, expect.any(Function));

        expect(commonChatController._launchChat).toBeCalled();
    });


    it("creates a ClickToChatButtons class with the expected constructor parameters", () => {
        const reactiveChatController = new ReactiveChatController();

        let clickToChatCallbackSpy = jest.spyOn(reactiveChatController, '_clickToChatCallback');
        let onC2CButtonClickedSpy = jest.spyOn(reactiveChatController, '_onC2CButtonClicked');

        const onC2CClickedFunction = jest.fn();

        window.Inq = {
            SDK: { onC2CClicked: onC2CClickedFunction }
        };

        let clickToChatCallback = reactiveChatController._clickToChatCallback();
        clickToChatCallback();

        let c2cDisplayStateMessages = {
            "busy": "All advisers are busy",
            "chatactive": "In progress",
            "outofhours": "Out of hours",
            "ready": "Ask HMRC a question"
        };

        expect(clickToChatCallbackSpy).toBeCalledTimes(1);
        expect(onC2CButtonClickedSpy).toBeCalledTimes(1);

        expect(ClickToChatButtons).toBeCalledWith(expect.any(Function), c2cDisplayStateMessages);
    });

});
