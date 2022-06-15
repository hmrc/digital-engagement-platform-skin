import PostChatSurveyWebchat from '../../../../../../../../app/assets/javascripts/views/postChatSurvey/PostChatSurveyWebchat'

describe("PostChatSurveyWebchat", () => {

    let PCSWebchat;
    let container;
    let wrapper;

    beforeEach(() => {
        PCSWebchat = new PostChatSurveyWebchat();
        container = document.createElement("div");
        wrapper = document.createElement("div");
    })

    it("attachTo method appends a post chat survey wrapper to the container", () => {
        let spy = jest.spyOn(container, 'appendChild').mockImplementation();
        PCSWebchat.attachTo(container);
        expect(spy).toBeCalledTimes(1);
    })

    it("detach method removes a wrapper from the container", () => {
        PCSWebchat.attachTo(container);
        let spy = jest.spyOn(container, 'removeChild').mockImplementation();
        PCSWebchat.detach();
        expect(spy).toBeCalledTimes(1);
    })
})
