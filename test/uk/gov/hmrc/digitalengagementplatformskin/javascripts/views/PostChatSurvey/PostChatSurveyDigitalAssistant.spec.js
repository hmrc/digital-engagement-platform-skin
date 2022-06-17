import PostChatSurveyDigitalAssistant from '../../../../../../../../app/assets/javascripts/views/postChatSurvey/PostChatSurveyDigitalAssistant'

describe("PostChatSurveyDigitalAssistant", () => {

    let PCSDigitalAssistant;
    let container;
    let wrapper;

    beforeEach(() => {
        PCSDigitalAssistant = new PostChatSurveyDigitalAssistant();
        container = document.createElement("div");
        wrapper = document.createElement("div");
    })

    it("attachTo method appends a post chat survey wrapper to the container", () => {
        let spy = jest.spyOn(container, 'appendChild').mockImplementation();
        PCSDigitalAssistant.attachTo(container);
        expect(spy).toBeCalledTimes(1);
    })

    it("detach method removes a wrapper from the container", () => {
        PCSDigitalAssistant.attachTo(container);
        let spy = jest.spyOn(container, 'removeChild').mockImplementation();
        PCSDigitalAssistant.detach();
        expect(spy).toBeCalledTimes(1);
    })
})
