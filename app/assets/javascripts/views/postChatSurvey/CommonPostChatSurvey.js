import PrintUtils from "../../utils/PrintUtils"

export default class CommonPostChatSurvey {
    constructor(html, onSubmitted) {
        this.html = html;
        this.onSubmitted = onSubmitted;
    }

    attachTo(container) {
        this.container = container;

        this.wrapper = document.createElement("div");
        this.wrapper.id = "postChatSurveyWrapper";
        this.wrapper.insertAdjacentHTML("beforeend", this.html);
        container.appendChild(this.wrapper);

        this.wrapper.querySelector("#submitPostChatSurvey").addEventListener(
            "click",
            (e) => {
                this.onSubmitted(this);
            }
        );

        $('input[name="q5-"]').on('click', function() {
            if ($(this).val() != 'Other') {
                document.getElementById("q6-").value = "";
            }
        });

        this.wrapper.querySelector("#printPostChat").addEventListener(
            "click",
            (e) => {
                e.preventDefault;
                this.onPrintPostChatSurvey(this);
            }
        );

        window.addEventListener('afterprint', (event) => {
            this.showTranscriptAndSurvey(false, true)
        });

    }

    showTranscriptAndSurvey(showTranscript, showSurvey) {
        let transcript = document.getElementById("ciapiSkinChatTranscript");
        transcript.style.display = showTranscript ? "" : "none";
  
        let postChatSurvey = document.getElementById("postChatSurveyWrapper");
        postChatSurvey.style.display = showSurvey ? "" : "none";
    }

    onPrintPostChatSurvey(e) {
        e.preventDefault;
  
        this.showTranscriptAndSurvey(true, false);
  
        document.getElementById("print-date").innerHTML = PrintUtils.getPrintDate();
  
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
  
        PrintUtils.removeElementsForPrint(elementList);
  
        window.print();
  
        return false;
    }

    detach() {
        this.container.removeChild(this.wrapper)
    }
}
