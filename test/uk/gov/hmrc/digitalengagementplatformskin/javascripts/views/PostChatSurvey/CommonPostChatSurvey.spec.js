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
        document.body.insertAdjacentHTML('beforeend',html);

        commonPostChatSurvey.attachTo(container);
        var event = new KeyboardEvent('click', {});
        document.querySelector("#q5-").dispatchEvent(event);
        
        expect(document.getElementById("q6-").value).toBe("");
	});


    test('Click on print prints post chat survey', () => {
        jest.spyOn(commonPostChatSurvey, 'onPrintPostChatSurvey').mockImplementation();
    
        commonPostChatSurvey.attachTo(container);
        var event = new KeyboardEvent('click', {});
        if(commonPostChatSurvey.wrapper.querySelector("#printPostChat")) {
            commonPostChatSurvey.wrapper.querySelector("#printPostChat").dispatchEvent(event);
            expect(commonPostChatSurvey.onPrintPostChatSurvey).toHaveBeenCalled();
        }
	});

    test('afterprint event shows post chat survey without the transcript', () => {
        jest.spyOn(commonPostChatSurvey, 'showTranscriptAndSurvey').mockImplementation();
        
        document.body.insertAdjacentHTML('beforeend',"<div id='ciapiSkinChatTranscript'> </div>");
        document.body.insertAdjacentHTML('beforeend',"<div id='postChatSurveyWrapper'> </div>");

        commonPostChatSurvey.attachTo(container);
        var event = new KeyboardEvent('afterprint', {});
        window.dispatchEvent(event);
        
        let transcript = document.getElementById("ciapiSkinChatTranscript");
        let postChatSurvey = document.getElementById("postChatSurveyWrapper");

        expect(commonPostChatSurvey.showTranscriptAndSurvey).toHaveBeenCalled();
        expect(transcript.style.display).toBe("none");
        expect(postChatSurvey.style.display).toBe("");
	});

    test('onPrintPostChatSurvey shows transcript without the post chat survey', () => {
        let showTranscriptAndSurveySpy = jest.spyOn(commonPostChatSurvey, 'showTranscriptAndSurvey');
        
        const mockPrint = jest.fn();
        window.print = mockPrint

        document.body.insertAdjacentHTML('beforeend',"<div id='ciapiSkinChatTranscript'> </div>");
        document.body.insertAdjacentHTML('beforeend',"<div id='postChatSurveyWrapper'> </div>");
        document.body.insertAdjacentHTML('beforeend',"<div id='print-date'> </div>");

        const evt = { preventDefault: jest.fn() };

        const elementList = [
            "app-related-items",
            "govuk-back-link",
            "govuk-phase-banner",
            "hmrc-report-technical-issue",
            "govuk-footer",
            "govuk-heading-xl",
            "hmrc-user-research-banner",
            "cbanner-govuk-cookie-banner",
            "postChatSurveyWrapper"
        ];

        commonPostChatSurvey.onPrintPostChatSurvey(evt);

        let transcript = document.getElementById("ciapiSkinChatTranscript");
        let postChatSurvey = document.getElementById("postChatSurveyWrapper");

        expect(showTranscriptAndSurveySpy).toHaveBeenCalled();
        expect(transcript.style.display).toBe("");
        expect(postChatSurvey.style.display).toBe("none");
        expect(PrintUtils.removeElementsForPrint).toHaveBeenCalledWith(elementList);
        expect(mockPrint).toBeCalledTimes(1);
	});

})
