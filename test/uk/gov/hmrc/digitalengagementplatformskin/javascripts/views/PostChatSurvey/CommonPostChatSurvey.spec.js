import CommonPostChatSurvey from '../../../../../../../../app/assets/javascripts/views/postChatSurvey/CommonPostChatSurvey'

describe("CommonPostChatSurvey", () => {

    let commonPostChatSurvey;
    let container;
    let wrapper;
    let events = {};

    beforeEach(() => {
        let onSubmitted = jest.fn(); 

        commonPostChatSurvey = new CommonPostChatSurvey("", onSubmitted);

        container = document.createElement("div");
        wrapper = document.createElement("div");

        events = {};

        wrapper.addEventListener = jest.fn((event, callback) => {
            events[event] = callback;
        });

    })

    test('Click on submit submits post chat survey', () => {
        jest.spyOn(commonPostChatSurvey, 'onSubmitted').mockImplementation();

        var event = new KeyboardEvent('click', {});
        wrapper.querySelector("#submitPostChatSurvey").dispatchEvent(event);

        expect(commonPostChatSurvey.onSubmitted).toHaveBeenCalled();
	});

})
