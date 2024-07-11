import PrintUtils from "../../utils/PrintUtils"

export default class CommonPostChatSurvey {
    html: string
    container: HTMLElement | undefined
    wrapper: HTMLElement | undefined
    onSubmitted: (a:object) => void

    constructor(html: string, onSubmitted: (a: object) => void) {
        this.html = html;
        this.onSubmitted = onSubmitted;
    }

    attachTo(container: HTMLElement | undefined): void {
        this.container = container;
        this.wrapper = document.createElement("div");
        this.wrapper.id = "postChatSurveyWrapper";
        this.wrapper.insertAdjacentHTML("beforeend", this.html);
        container?.appendChild(this.wrapper);

        this.wrapper.querySelector<HTMLButtonElement>("#submitPostChatSurvey")?.addEventListener(
            "click",
            (_:Event): void => {
                this.onSubmitted(this);
            }
        );

        this.wrapper.querySelector<HTMLFieldSetElement>('#question5')?.addEventListener(
            "click",
            (_:Event): void => {
                if((document.getElementById('q5--4') as HTMLInputElement).checked){
                    document.getElementById("conditional-contact")?.classList.remove("govuk-radios__conditional--hidden")
                } else {
                    (document.getElementById("q6-") as HTMLTextAreaElement).value = "";
                    document.getElementById("conditional-contact")?.classList.add("govuk-radios__conditional--hidden");
                }
            }
        )

        this.wrapper.querySelector<HTMLAnchorElement>("#printPostChat")?.addEventListener(
            "click",
            (e: Event): void => {
                e.preventDefault;
                this.onPrintPostChatSurvey(this);
            }
        );

        window.addEventListener('afterprint', (_:Event): void => {
            this.showTranscriptAndSurvey(false, true)
        });

        let isAndroidAndChrome: boolean
        if ((/Android/i.test(navigator.userAgent)) && (navigator.userAgent.match(/chrome|chromium|crios/i))) {
            isAndroidAndChrome = true
        } else {
            isAndroidAndChrome = false
        }

        let printContainer: HTMLElement | null = document.getElementById("surveyPrintContainer")
        if(printContainer){
            printContainer.style.display = isAndroidAndChrome ? "none" : "";
        }
    }

    showTranscriptAndSurvey(showTranscript: boolean, showSurvey: boolean): void {
        let transcript: HTMLElement | null = document.getElementById("ciapiSkinChatTranscript");
        if(transcript){
            transcript.style.display = showTranscript ? "" : "none";
        }
        let postChatSurvey: HTMLElement | null = document.getElementById("postChatSurveyWrapper");
        if(postChatSurvey){
            postChatSurvey.style.display = showSurvey ? "" : "none";
        }
    }

    onPrintPostChatSurvey(e: any): boolean {
        e.preventDefault;
  
        this.showTranscriptAndSurvey(true, false);
    
        let printDate: HTMLElement | null = document.getElementById("print-date")
        if(printDate){
            printDate.innerHTML = PrintUtils.getPrintDate();
        }
  
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
            if (document.getElementById("nuanMessagingFrame")?.classList.contains("ci-api-popup")) {
                elementList.push("govuk-grid-column-two-thirds")
            }
        }
  
        PrintUtils.removeElementsForPrint(elementList);
  
        window.print();
  
        return false;
    }

    detach(): void {
        if(this.wrapper){
            this.container?.removeChild(this.wrapper)
        }
    }
}
