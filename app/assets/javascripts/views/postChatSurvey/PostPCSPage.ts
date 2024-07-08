import ProactiveChatController from "../../controllers/ProactiveChatController";
import PrintUtils from "../../utils/PrintUtils"

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
        
        <li id='printOption'><a href='#' id='printButton'>print your chat</a></li>
            <li><a id='returnToGovUk' href="http://www.gov.uk">return to GOV.UK</a></li>
            <li>close this window</li>
        </ul>
    </div>

    <p id="endpage-thanks" class="govuk-body">Thank you for your feedback.</p>

</div>
`

const nullEventHandler = {
    onPrint: function () {}
};

export default class PostPCSPage {
    html: string | undefined
    container: HTMLElement | undefined
    wrapper: HTMLElement | undefined
    onSubmitted: ((a: object) => void) | undefined
    showThanks: boolean
    eventHandler: any
    content: HTMLElement | null
    
    
    constructor(showThanks: boolean) {
        this.showThanks = showThanks;
        this.container = document.createElement("div");
        this.container.id = "ciapiSkin";
        this.eventHandler = nullEventHandler;
        this.content = this.container.querySelector("#endPage");
    }

    attachTo(container: HTMLElement | undefined) {
        this.container = container;
        this.wrapper = document.createElement("div")
        this.wrapper.id = "postPCSPageWrapper";
        this.wrapper.insertAdjacentHTML("beforeend", html);

        const ciapiSkinHeader = document.getElementById("ciapiSkinHeader")
        if(ciapiSkinHeader){
            try {
                ciapiSkinHeader.style.display = "none"
            } catch {
                console.log('DEBUG: ' + 'Elements not found' )
            }
        }

        const endpageThanks = this.wrapper.querySelector('#endpage-thanks')
        if (!this.showThanks && endpageThanks instanceof HTMLElement) {
            endpageThanks.style.display = 'none';
        }
        
        container?.appendChild(this.wrapper);

        let isAndroidAndChrome
        if ((/Android/i.test(navigator.userAgent)) && (navigator.userAgent.match(/chrome|chromium|crios/i))) {
            isAndroidAndChrome = true
        } else {
            isAndroidAndChrome = false
        }

        let printContainer = document.getElementById("printOption")
        if(printContainer) {
            printContainer.style.display = isAndroidAndChrome ? "none" : "";
        }
        
        const element = this.wrapper.querySelector('#printButton');
        if (element) {
            element.addEventListener("click", (e) => {
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

                const endPageWrapper = this.container?.querySelector('#endPage')
                const skinChatTranscript = this.container?.querySelector("#ciapiSkinChatTranscript");

                if(endPageWrapper && endPageWrapper instanceof HTMLElement){
                    endPageWrapper.style.display = 'none'
                }
                if(skinChatTranscript && skinChatTranscript instanceof HTMLElement){
                    skinChatTranscript.style.display = ''
                }

                let printDate = document.getElementById("print-date")
                if(printDate){
                    printDate.innerHTML = PrintUtils.getPrintDate();
                }

                document.getElementById("postPCSPageWrapper")?.classList.add("govuk-!-display-none-print")

                window.print();
                    this.eventHandler.onPrint(e);      
                    e.preventDefault();
                })

                    window.addEventListener("afterprint", (e) => {});
                    onafterprint = (e) => {
                        e.preventDefault();
                        const endPageWrapper = this.container?.querySelector('#endPage')
                        const skinChatTranscript = this.container?.querySelector("#ciapiSkinChatTranscript");

                        if(endPageWrapper && endPageWrapper instanceof HTMLElement){
                            endPageWrapper.style.display = ''
                        }

                        if(skinChatTranscript && skinChatTranscript instanceof HTMLElement){
                            skinChatTranscript.style.display = 'none'
                        }
                    };
        }
    }

    detach(): void {
        if(this.wrapper){
            this.container?.removeChild(this.wrapper)
        }
    }
}
