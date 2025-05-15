import PrintUtils from "../../utils/PrintUtils"
import CommonChatController from "../../controllers/CommonChatController";

const html: string = `
<div id="endPage">
    <div class="govuk-panel govuk-panel--confirmation" style="margin-right:0.8em;">
        <h2 class="govuk-panel__title" id="heading_chat_ended" tabindex="-1">
            Chat ended
        </h2>
    </div>
    <div id ='futherLinks'>
        <p>You can:</p>
        <ul>
        
        <li id='printOption'><a class="govuk-link" href='#' id='printPostChat'>print or save chat</a></li>
            <li><a class="govuk-link" id='returnToGovUk' href="http://www.gov.uk">return to GOV.UK</a></li>
            <li>close this window</li>
        </ul>
    </div>

    <p id="endpage-thanks" class="govuk-body">Thank you for your feedback.</p>

</div>
`

const nullEventHandler = {
    onPrint: function (_: Event) { }
};

export default class PostPCSPage {
    html: string | undefined
    container: HTMLElement | undefined
    wrapper: HTMLElement | undefined
    onSubmitted: ((a: object) => void) | undefined
    showThanks: boolean
    eventHandler: typeof nullEventHandler
    content: HTMLElement | null
    commonchatcontroller: CommonChatController


    constructor(showThanks: boolean) {
        this.showThanks = showThanks;
        this.container = document.createElement("div");
        this.container.id = "ciapiSkin";
        this.eventHandler = nullEventHandler;
        this.content = this.container.querySelector("#endPage");
        this.commonchatcontroller = new CommonChatController()
    }

    attachTo(container: HTMLElement): void {
        this.container = container;
        this.wrapper = document.createElement("div")
        this.wrapper.id = "postPCSPageWrapper";
        this.wrapper.insertAdjacentHTML("beforeend", html);

        const ciapiSkinHeader: HTMLElement | null = document.getElementById("ciapiSkinHeader")
        if (ciapiSkinHeader) {
            try {
                ciapiSkinHeader.style.display = "none"
            } catch {
                console.log('DEBUG: ' + 'Elements not found')
            }
        }

        const endpageThanks = this.wrapper.querySelector<HTMLElement>('#endpage-thanks')
        if (!this.showThanks && endpageThanks) {
            endpageThanks.style.display = 'none';
        }

        container?.appendChild(this.wrapper);

        let isAndroidAndChrome: boolean
        if ((/Android/i.test(navigator.userAgent)) && (navigator.userAgent.match(/chrome|chromium|crios/i))) {
            isAndroidAndChrome = true
        } else {
            isAndroidAndChrome = false
        }

        let printContainer: HTMLElement | null = document.getElementById("printOption")
        if (printContainer) {
            printContainer.style.display = isAndroidAndChrome ? "none" : "";
        }

        const element = this.wrapper.querySelector<HTMLElement>('#printPostChat');
        if (element) {
            element.addEventListener("click", (e: MouseEvent): void => {
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

                if (document.getElementById("nuanMessagingFrame")?.classList.contains("ci-api-popup")) {
                    elementList.push("govuk-grid-column-two-thirds")
                }

                PrintUtils.removeElementsForPrint(elementList);

                const endPageWrapper = this.container?.querySelector<HTMLElement>('#endPage')
                const skinChatTranscript = this.container?.querySelector<HTMLElement>("#ciapiSkinChatTranscript");

                if (endPageWrapper) {
                    endPageWrapper.style.display = ''
                }
                if (skinChatTranscript) {
                    skinChatTranscript.style.display = 'none'
                }

                let printDate = document.getElementById("print-date")
                if (printDate) {
                    printDate.innerHTML = PrintUtils.getPrintDate();
                }

                document.getElementById("postPCSPageWrapper")?.classList.add("govuk-!-display-none-print")

                this.commonchatcontroller.onPrint(e)
                e.preventDefault();
            })

            window.addEventListener("afterprint", (_) => { });
            onafterprint = (e: Event): void => {
                e.preventDefault();
                const endPageWrapper = this.container?.querySelector<HTMLElement>('#endPage')
                const skinChatTranscript = this.container?.querySelector<HTMLElement>("#ciapiSkinChatTranscript");

                if (endPageWrapper) {
                    endPageWrapper.style.display = ''
                }

                if (skinChatTranscript) {
                    skinChatTranscript.style.display = 'none'
                }
            };
        }
    }

    detach(): void {
        if (this.wrapper) {
            this.container?.removeChild(this.wrapper)
        }
    }
}
