import ReactiveChatController from '../../../../../../../app/assets/javascripts/controllers/ReactiveChatController' 
import CommonChatController from '../../../../../../../app/assets/javascripts/controllers/CommonChatController' 
import ClickToChatButtons from '../../../../../../../app/assets/javascripts/utils/ClickToChatButtons'
import {_onC2CButtonClicked} from '../../../../../../../app/assets/javascripts/controllers/ReactiveChatController'
import * as ChatStates from '../../../../../../../app/assets/javascripts/services/ChatStates'

jest.mock('../../../../../../../app/assets/javascripts/utils/ClickToChatButtons');

describe("ReactiveChatController", () => {

    afterEach(() => {
        document.getElementsByTagName('html')[0].innerHTML = ''; 
    });

    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        ClickToChatButtons.mockClear();
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
        }

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
        const buttonClass = "button-class"
        
        
        let addC2CButtonSpy = jest.spyOn(reactiveChatController, 'addC2CButton');
        reactiveChatController.addC2CButton(c2cObj, divId, buttonClass);

        expect(addC2CButtonSpy).toHaveBeenCalledTimes(1);
    });


    it("_onC2CButtonClicked to launch a chat", () => {
        const reactiveChatController = new ReactiveChatController();
        const commonChatController = new CommonChatController();
        const c2cObj = 'ChatActiveText';
        
        const sdk = {
            onC2CClicked: jest.fn().mockReturnValue(true),
            isChatInProgress: jest.fn(),
            getMessages: jest.fn()
        }

        window.Inq = {
            SDK: sdk
        };
        
        const state = new ChatStates.EngagedState(sdk, jest.fn(), [], jest.fn());
        commonChatController.state = state;
    
        commonChatController.nuanceFrameworkLoaded(window);
        let _onC2CButtonClickedSpy = jest.spyOn(reactiveChatController, '_onC2CButtonClicked');
        reactiveChatController._onC2CButtonClicked(c2cObj);

        expect(_onC2CButtonClickedSpy).toHaveBeenCalledTimes(1);
    });
});
