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

        this.wrapper.querySelector('#question5').addEventListener(
            "click",
            (e) => {
                if(document.getElementById('q5--4').checked){
                    document.getElementById("conditional-contact").classList.remove("govuk-radios__conditional--hidden");
                } else {
                    document.getElementById("q6-").value = "";
                    document.getElementById("conditional-contact").classList.add("govuk-radios__conditional--hidden");
                }
            }
        )

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

        let isAndroidAndChrome
        if ((/Android/i.test(navigator.userAgent)) && (navigator.userAgent.match(/chrome|chromium|crios/i))) {
            isAndroidAndChrome = true
        } else {
            isAndroidAndChrome = false
        }

        let printContainer = document.getElementById("surveyPrintContainer")
        if(printContainer){
            printContainer.style.display = isAndroidAndChrome ? "none" : "";
        }
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
  
        let elementList = [
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

        if (document.getElementById("nuanMessagingFrame")) {
            if (document.getElementById("nuanMessagingFrame").classList.contains("ci-api-popup")) {
                elementList.push("govuk-grid-column-two-thirds")
            }
        }
  
        PrintUtils.removeElementsForPrint(elementList);
  
        window.print();
  
        return false;
    }

    detach() {
        this.container.removeChild(this.wrapper)
    }
}
