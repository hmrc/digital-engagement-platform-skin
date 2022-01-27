import CommonChatController from '../../../../../../../app/assets/javascripts/controllers/CommonChatController'
import PostChatSurveyWebchatService from '../../../../../../../app/assets/javascripts/services/PostChatSurveyWebchatService'
import ChatContainer from '../../../../../../../app/assets/javascripts/utils/ChatContainer'

jest.enableAutomock();

const mockBeginPostChatSurvey = jest.fn();
const mockShowPage = jest.fn();

const service = jest.genMockFromModule('../../../../../../../app/assets/javascripts/services/PostChatSurveyWebchatService');



jest.mock( '../../../../../../../app/assets/javascripts/utils/ChatContainer', () => {
	return jest.fn().mockImplementation(() => {
		return {
			showPage: mockShowPage
		};
	});
});



describe("CommonChatController", () => {
    it("appends chat transcript div to page when some div id is found on page", () => {
            const postChatSurveyWebchatService = new PostChatSurveyWebchatService();
            const commonChatController = new CommonChatController();
            //const chatContainer = new ChatContainer();

            //const test = service.beginPostChatSurvey;

            //chatContainer.showPage = jest.fn();

            //commonChatController._launchChat();
            //commonChatController.onConfirmEndChat();

            //expect(postChatSurveyWebchatService.beginPostChatSurvey).toHaveBeenCalledTimes(1);
            //expect(beginPostChatSurvey).toHaveBeenCalledTimes(1);
            //expect(chatContainer.showPage).toHaveBeenCalledTimes(1);

        });
})