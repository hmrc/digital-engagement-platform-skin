import CommonChatController from '../../../../../../../app/assets/javascripts/controllers/CommonChatController'
import PostChatSurveyWebchatService from '../../../../../../../app/assets/javascripts/services/PostChatSurveyWebchatService'

jest.mock('PostChatSurveyWebchatService');


describe("CommonChatController", () => {
    it("a webchat post chat survey is displayed when webchat chat is closed", () => {
        const commonChatController = new CommonChatController();
        const postChatSurveyWebchatService = new PostChatSurveyWebchatService();

        commonChatController._moveToClosingState = jest.fn();
        postChatSurveyWebchatService.beginPostChatSurvey = jest.fn();

        const sdk = {
            isChatInProgress: jest.fn().mockReturnValue(true),
            //getChatParams: () => { return chatParams; }
            //closeChat: jest.fn(),
            isConnected: jest.fn()
        };

        window.Inq = {
            SDK: sdk
        };



        commonChatController.nuanceFrameworkLoaded(window);
        commonChatController.onConfirmEndChat();

        expect(postChatSurveyWebchatService.beginPostChatSurvey).toHaveBeenCalled();
    })

})