import PrintUtils from '../../../../../../../../app/assets/javascripts/utils/PrintUtils';
import CommonPostChatSurvey from '../../../../../../../../app/assets/javascripts/views/postChatSurvey/CommonPostChatSurvey'
import { html } from '../../../../../../../../app/assets/javascripts/views/postChatSurvey/PostChatSurveyDigitalAssistant';

jest.mock('../../../../../../../../app/assets/javascripts/utils/PrintUtils');

const originalPrintWindow = window.print;

describe("CommonPostChatSurvey", () => {

    let commonPostChatSurvey;
    let container;
    let onSubmitted = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        commonPostChatSurvey = new CommonPostChatSurvey(html, onSubmitted);

        container = document.createElement("div");

        window.print = originalPrintWindow
    })

    test('Click on submit submits post chat survey', () => {
        jest.spyOn(commonPostChatSurvey, 'onSubmitted').mockImplementation();

        commonPostChatSurvey.attachTo(container);
        var event = new KeyboardEvent('click', {});
        commonPostChatSurvey.wrapper.querySelector("#submitPostChatSurvey").dispatchEvent(event);

        expect(commonPostChatSurvey.onSubmitted).toHaveBeenCalled();
    });

    test('Click on Other for q5 opens text box', () => {
        document.body.insertAdjacentHTML('beforeend', html);

        commonPostChatSurvey.attachTo(container);
        var event = new KeyboardEvent('click', {});
        document.querySelector("#q5-").dispatchEvent(event);

        expect(document.getElementById("q6-").value).toBe("");
    });

    test('afterprint event shows post chat survey without the transcript', () => {
        jest.spyOn(commonPostChatSurvey, 'showTranscriptAndSurvey').mockImplementation();

        document.body.insertAdjacentHTML('beforeend', "<div id='ciapiSkinChatTranscript'> </div>");
        document.body.insertAdjacentHTML('beforeend', "<div id='postChatSurveyWrapper'> </div>");

        commonPostChatSurvey.attachTo(container);
        var event = new KeyboardEvent('afterprint', {});
        window.dispatchEvent(event);

        let transcript = document.getElementById("ciapiSkinChatTranscript");
        let postChatSurvey = document.getElementById("postChatSurveyWrapper");

        expect(commonPostChatSurvey.showTranscriptAndSurvey).toHaveBeenCalled();
        expect(transcript.style.display).toBe("none");
        expect(postChatSurvey.style.display).toBe("");
    });
})
