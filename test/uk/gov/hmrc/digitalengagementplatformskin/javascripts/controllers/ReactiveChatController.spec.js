import ReactiveChatController from '../../../../../../../app/assets/javascripts/controllers/ReactiveChatController' 
import ClickToChatButtons from '../../../../../../../app/assets/javascripts/utils/ClickToChatButtons'
import {_onC2CButtonClicked} from '../../../../../../../app/assets/javascripts/controllers/ReactiveChatController'

jest.mock('../../../../../../../app/assets/javascripts/utils/ClickToChatButtons');

describe("ReactiveChatController", () => {

    afterEach(() => {
        document.getElementsByTagName('html')[0].innerHTML = ''; 
    });

    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        ClickToChatButtons.mockClear();
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

        reactiveChatController._onC2CButtonClicked();

        expect(sdk.onC2CClicked).toHaveBeenCalledTimes(1);

    });

});
