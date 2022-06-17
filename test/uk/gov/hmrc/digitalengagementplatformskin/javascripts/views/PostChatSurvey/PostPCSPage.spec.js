import PostPCSPage from '../../../../../../../../app/assets/javascripts/views/postChatSurvey/PostPCSPage'

describe("PostPCSPage", () => {

    let postPCSPage;
    let container;
    let wrapper;

    beforeEach(() => {
        postPCSPage = new PostPCSPage();
        container = document.createElement("div");
        wrapper = document.createElement("div");
    })

    it("attachTo method appends a post chat survey wrapper to the container", () => {
        let spy = jest.spyOn(container, 'appendChild').mockImplementation();
        postPCSPage.attachTo(container);
        expect(spy).toBeCalledTimes(1);
    })

    it("detach method removes a wrapper from the container", () => {
        postPCSPage.attachTo(container);
        let spy = jest.spyOn(container, 'removeChild').mockImplementation();
        postPCSPage.detach();
        expect(spy).toBeCalledTimes(1);
    })
})
