import PostChatSurveyWebchat from '../views/postChatSurvey/PostChatSurveyWebchat'
import PostChatSurveyDigitalAssistant from '../views/postChatSurvey/PostChatSurveyDigitalAssistant'
import ChatContainer from '../utils/ChatContainer'
import * as MessageClasses from '../DefaultClasses'
import * as EmbeddedContainerHtml from '../views/embedded/EmbeddedContainerHtml'
import * as PopupContainerHtml from '../views/popup/PopupContainerHtml'
import * as ChatStates from '../services/ChatStates'
import * as logger from '../utils/logger';
import PostChatSurveyWebchatService from '../services/PostChatSurveyWebchatService'
import PostChatSurveyDigitalAssistantService from '../services/PostChatSurveyDigitalAssistantService'
import PostPCSPage from '../views/postChatSurvey/PostPCSPage'
import PrintUtils from '../utils/PrintUtils'
import { messages } from "../utils/Messages";
import { AutomatonType, Survey, Answers, StateType } from '../types'

type ChatStatesType = ChatStates.NullState | ChatStates.EngagedState | ChatStates.ClosingState | ChatStates.ShownState
interface QuestionCompleted {
    Q1: boolean;
    Q2: boolean;
    Q3: boolean;
    Q4: boolean;
    Q5: boolean;
}

const automatonDA: AutomatonType = {
    id: "survey-13000304",
    name: "HMRC_PostChat_Guidance-CUI"
};

const automatonWebchat: AutomatonType = {
    id: "survey-13000303",
    name: "HMRC_PostChat_Transactional-CUI"
};

const timestamp: number = Date.now();

const webchatSurvey: Survey = {
    id: "13000303",
    questions: [
        { id: ["question1"], text: "Were you able to do what you needed to do today?", freeform: false },
        { id: ["question2"], text: "How easy was it for you to do what you needed to do today?", freeform: false },
        { id: ["question3"], text: "Why did you give this answer?", freeform: true },
        { id: ["question4"], text: "Overall, how did you feel about the service you received today?", freeform: false },
        { id: ["question5"], text: "If you had not used Webchat today, how else would you have contacted us?", freeform: false },
        { id: ["question6"], text: "Select how you prefer to contact HMRC", freeform: true }
    ]
};

const digitalAssistantSurvey: Survey = {
    id: "13000304",
    questions: [
        { id: ["question1"], text: "Were you able to do what you needed to do today?", freeform: false },
        { id: ["question2"], text: "How easy was it for you to do what you needed to do today?", freeform: false },
        { id: ["question3"], text: "Why did you give this answer?", freeform: true },
        { id: ["question4"], text: "Overall, how did you feel about the service you received today?", freeform: false },
        { id: ["question5"], text: "If you had not used Webchat today, how else would you have contacted us?", freeform: false },
        { id: ["question6"], text: "Select how you prefer to contact HMRC", freeform: true }
    ]
}

export default class CommonChatController {
    sdk: any
    state: ChatStatesType
    minimised: boolean
    ended: boolean | string
    escalated: boolean
    type: string
    container: any
    constructor() {
        this.sdk = null;
        this.state = new ChatStates.NullState();
        this.minimised = false;
        this.ended = false;
        this.escalated = false;
        this.type = '';
    }

    getFeatureSwitch(switchName: string): boolean {
        //Feature switches are held by the frontend, so call to the frontend to retrieve the state of each switch. Url is set by the frontend on page load.
        const http: XMLHttpRequest = new XMLHttpRequest();
        http.open("GET", window.featureSwitchUrl + "/" + switchName, false);
        http.send();

        return http.status === 204;
    }

    getTextAreaValue(textArea: string): string {
        return (document.getElementById(textArea) as HTMLTextAreaElement).value
    }

    getRadioId(radioGroup: string): string | undefined {
        var elements: NodeListOf<HTMLElement> = document.getElementsByName(radioGroup);

        for (var i: number = 0, l: number = elements.length; i < l; i++) {
            if ((elements[i] as HTMLInputElement).checked) {
                return elements[i].id;
            }
        }
    }

    updateDav3DeskproRefererUrls(): void {
        let reportTechnicalIssueElement: HTMLCollectionOf<Element> = document.getElementsByClassName('hmrc-report-technical-issue');
        let reportTechnicalIssueElementZero = reportTechnicalIssueElement[0] as HTMLAnchorElement

        if (reportTechnicalIssueElement.length) {
            if ((reportTechnicalIssueElementZero).href) {
                let reportTechnicalIssueElementHref: string = (reportTechnicalIssueElementZero).href;
                (reportTechnicalIssueElementZero).href = reportTechnicalIssueElementHref.concat("-dav3");
            }
        }

        let feedbackLinkElement: HTMLCollectionOf<Element> = document.getElementsByClassName('govuk-phase-banner__text');

        if (feedbackLinkElement.length) {
            let feedbackLinkHref: string = feedbackLinkElement[0].getElementsByTagName('a')[0].href;
            feedbackLinkElement[0].getElementsByTagName('a')[0].href = feedbackLinkHref.concat("-dav3");
        }

        let accessibilityLinkElement: HTMLCollectionOf<Element> = document.getElementsByClassName('govuk-footer__link')

        if (accessibilityLinkElement.length) {
            let accessibilityLinkHref: string = (accessibilityLinkElement[1] as HTMLAnchorElement).href;
            (accessibilityLinkElement[1] as HTMLAnchorElement).href = accessibilityLinkHref.concat("-dav3");
        }
    }

    getRadioValue(radioGroup: string): string {
        var elements: NodeListOf<HTMLElement> = document.getElementsByName(radioGroup);
        var returnedValue: string | null = null;

        for (var i: number = 0, l: number = elements.length; i < l; i++) {
            if ((elements[i] as HTMLInputElement).checked) {
                returnedValue = (elements[i] as HTMLInputElement).value;
            }
        }

        if (!returnedValue) {
            returnedValue = "";
        }
        return returnedValue;
    }

    getSdk(): any {
        logger.debug("printing this.sdk.chatDisplayed", this.sdk.chatDisplayed)
        return this.sdk
    }

    isIVRWebchatOnly(): boolean {
        const ivrWebchatElement: HTMLCollectionOf<Element> = document.getElementsByClassName("dav4IVRWebchat");
        return ivrWebchatElement.length > 0
    }

    _launchChat(obj: { type: string; state?: StateType }): void {
        if (this.container) {
            return;
        }
        try {
            if (obj.state === 'disabled') {
                logger.debug("state is disabled - chat is already active")
                return
            }

            this.type = obj.type
            if (obj.state === 'missed') {
                if (this.isIVRWebchatOnly()) {
                    return
                } else {
                    this._showChat();
                    let msg: string = messages.unavilable
                    this.container.getTranscript().addSystemMsg({ msg: msg }, Date.now());
                    let ciapiSkinFooter: HTMLElement | null = document.getElementById('ciapiSkinFooter')
                    if (ciapiSkinFooter) {
                        ciapiSkinFooter.style.display = 'none'
                    }
                }

            } else {
                this._showChat();
                this._displayOpenerScripts();

                this.sdk.chatDisplayed({
                    "customerName": "You",
                    "previousMessagesCb": (resp: any) => this._moveToChatEngagedState(resp.messages),
                    "disconnectCb": () => logger.info("%%%%%% disconnected %%%%%%"),
                    "reConnectCb": () => logger.info("%%%%%% reconnected %%%%%%"),
                    "failedCb": () => logger.info("%%%%%% failed %%%%%%"),
                    "openerScripts": null,
                    "defaultAgentAlias": "HMRC"
                });

                let urlPermittedforAutoEngage = false
                const url = window.location.href

                if (url.includes('ask-hmrc/chat/payment-problems?payment-plan-chat') ||
                    url.includes('ask-hmrc/webchat/national-clearance-hub') ||
                    url.includes('ask-hmrc/webchat/personal-transport-unit-enquiries') ||
                    url.includes('ask-hmrc/webchat/help-for-users-with-additional-needs') ||
                    url.includes('ask-hmrc/webchat/paye-and-self-assessment-resolutions') ||
                    this.isIVRWebchatOnly()
                ) {
                    urlPermittedforAutoEngage = true
                }

                if (urlPermittedforAutoEngage) {
                    this.sdk.autoEngage('chat started', null, (resp: { httpStatus: number }) => {
                        logger.debug("++++ ENGAGED ++++ ->", resp);
                        if (resp.httpStatus == 200) {
                            this._moveToChatEngagedState();
                        } else {
                            let msg: string = messages.unavilable
                            this.container.getTranscript().addSystemMsg({ msg: msg }, Date.now());
                            let ciapiSkinFooter: HTMLElement | null = document.getElementById('ciapiSkinFooter')
                            if (ciapiSkinFooter) {
                                ciapiSkinFooter.style.display = 'none'
                            }
                        }
                    })
                }

                this._removeAnimation();

                let dav3Skin: HTMLElement | null = document.getElementById("ciapiSkin");

                if (dav3Skin) {
                    this.updateDav3DeskproRefererUrls();
                }

                const existingErrorMessage: HTMLElement | null = document.getElementById("error-message")

                if (existingErrorMessage) {
                    existingErrorMessage.remove()
                }
            }
            document.getElementById("custMsg")?.focus();
        } catch (e: unknown) {
            logger.error("!!!! launchChat got exception: ", e);
        }

    }

    _removeAnimation(): void {
        let loadingAnimation: HTMLElement | null = document.getElementById("cui-loading-animation");
        let cuiContainer: HTMLElement | null = document.getElementById("cui-messaging-container");

        if (loadingAnimation && cuiContainer) {
            loadingAnimation.style.display = 'none';
            cuiContainer.style.opacity = '1';
        }
    }

    _showChat(): void {
        const embeddedDiv: HTMLElement | null = this._getEmbeddedDiv();
        const popupDiv: HTMLElement | null = this._getPopupDiv();
        const webchatOnly: boolean = this._isWebchatOnly();

        try {
            if (popupDiv) {
                this.container = new ChatContainer(MessageClasses, PopupContainerHtml.ContainerHtml(webchatOnly), window.Inq.SDK);
                popupDiv.appendChild(this.container.element());
            } else if (embeddedDiv) {
                this.container = new ChatContainer(MessageClasses, EmbeddedContainerHtml.ContainerHtml(webchatOnly), window.Inq.SDK);
                embeddedDiv.appendChild(this.container.element());
            } else {
                this.container = new ChatContainer(MessageClasses, PopupContainerHtml.ContainerHtml(webchatOnly), window.Inq.SDK);
                document.getElementsByTagName("body")[0].appendChild(this.container.element());
            }

            this.container.setEventHandler(this);

            this._moveToChatShownState();
        } catch (e: unknown) {
            logger.error("!!!! _showChat got exception: ", e);
        }
    }

    _displayOpenerScripts(): void {
        this.sdk = window.Inq.SDK;
        this.sdk.getOpenerScripts((openerScripts: string[]) => {
            if (openerScripts == null)
                return;
            for (var openerScript of openerScripts) {
                this.container.getTranscript().addOpenerScript(openerScript);
            }
        });

    }

    _moveToChatEngagedState(previousMessages: any = []): void {
        this._moveToState(new ChatStates.EngagedState(
            this.sdk,
            this.container,
            previousMessages,
            () => this.container.confirmEndChat()));
    }

    _moveToState(state: ChatStatesType): void {
        this.state = state;
    }

    _getEmbeddedDiv(): HTMLElement | null {
        let baseDiv: HTMLElement | null = document.getElementById("nuanMessagingFrame");
        return baseDiv
    }

    _getPopupDiv(): HTMLElement | null {
        let baseDiv: HTMLElement | null = document.getElementById("tc-nuance-chat-container");
        return baseDiv
    }

    _isWebchatOnly(): boolean {
        let webchatOnlyElement: HTMLCollectionOf<Element> = document.getElementsByClassName("webchat-only");

        return webchatOnlyElement.length > 0
    }

    _moveToChatShownState(): void {
        this._moveToState(new ChatStates.ShownState(
            (text: string) => this._engageChat(text),
            () => this.closeChat()));
        this.minimised = false;
    }

    _engageChat(text: string): void {
        this.sdk.engageChat(text, (resp: { httpStatus: number }) => {
            logger.debug("++++ ENGAGED ++++ ->", resp);
            if (resp.httpStatus == 200) {
                this._moveToChatEngagedState();
            }
        });
    }

    closeChat(): void {
        this.closeMenu()
        if (document.body.contains(document.getElementById("postChatSurveyWrapper"))) {
            if (this.state instanceof ChatStates.EngagedState && this.state.escalated) {
                this._sendPostChatSurveyWebchat(this.sdk).closePostChatSurvey(automatonWebchat, timestamp);
            } else {
                this._sendPostChatSurveyDigitalAssistant(this.sdk).closePostChatSurvey(automatonDA, timestamp);
            }
        }

        if (this.ended) {
            this.container.destroy();
            this.container = null;
            this._moveToChatNullState();
            if (this.sdk && this.type != 'proactive') {
                window.Inq.reinitChat();
            }
        } else {
            this.ended = 'true'
            this.showEndChatPage(false);
        }
    }

    onPrint(e: Event): boolean {
        this.closeMenu()
        document.getElementById("custMsg")?.focus();

        e.preventDefault;
        const printDate: HTMLElement | null = document.getElementById("print-date")
        if (printDate) {
            printDate.innerHTML = PrintUtils.getPrintDate();
        }

        let existingPrintIframe = document.getElementById("printIframe") as HTMLIFrameElement | null
        if (existingPrintIframe) {
            document.body.removeChild(existingPrintIframe);
        }

        let printingIframe = document.createElement("iframe") as HTMLIFrameElement
        printingIframe.id = "printIframe";
        printingIframe.style.position = "absolute";
        printingIframe.style.width = "0";
        printingIframe.style.height = "0";
        printingIframe.style.border = "none";
        printingIframe.style.visibility = "hidden"
        document.body.appendChild(printingIframe);
        let selectedElements: NodeListOf<Element>

        let printingIframeDoc: Document | undefined = printingIframe.contentDocument || printingIframe.contentWindow?.document;
        let transcriptElementClone = document.getElementById('ciapiSkinChatTranscript')?.cloneNode(true) as HTMLElement

        selectedElements = transcriptElementClone?.querySelectorAll('.timestamp-outer')

        const selectedHTML = Array.from(selectedElements).map(e => `<div>${e.outerHTML}</div>`).join('')
        printingIframeDoc?.open();
        printingIframeDoc?.write(`
        <html>
            <head>
                <link rel="stylesheet" type="text/css" href="../../assets/stylesheets/chat-ui-popup.css">
            </head>
            <body>
                <header class="govuk-header print-gov-header" data-module="govuk-header">
                    <div class="govuk-header__container govuk-width-container">
                        <div class="govuk-header__logo">
                            <a href="#" class="govuk-header__link govuk-header__link--homepage">
                                <svg
                                focusable="false"
                                role="img"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 296 60"
                                height="30"
                                width="148"
                                fill="currentcolor" class="govuk-header__logotype" aria-label="GOV.UK">
                                <title>GOV.UK</title>
                                <g>
                                    <circle cx="20" cy="17.6" r="3.7" />
                                    <circle cx="10.2" cy="23.5" r="3.7" />
                                    <circle cx="3.7" cy="33.2" r="3.7" />
                                    <circle cx="31.7" cy="30.6" r="3.7" />
                                    <circle cx="43.3" cy="17.6" r="3.7" />
                                    <circle cx="53.2" cy="23.5" r="3.7" />
                                    <circle cx="59.7" cy="33.2" r="3.7" />
                                    <circle cx="31.7" cy="30.6" r="3.7" />
                                    <path d="M33.1,9.8c.2-.1.3-.3.5-.5l4.6,2.4v-6.8l-4.6,1.5c-.1-.2-.3-.3-.5-.5l1.9-5.9h-6.7l1.9,5.9c-.2.1-.3.3-.5.5l-4.6-1.5v6.8l4.6-2.4c.1.2.3.3.5.5l-2.6,8c-.9,2.8,1.2,5.7,4.1,5.7h0c3,0,5.1-2.9,4.1-5.7l-2.6-8ZM37,37.9s-3.4,3.8-4.1,6.1c2.2,0,4.2-.5,6.4-2.8l-.7,8.5c-2-2.8-4.4-4.1-5.7-3.8.1,3.1.5,6.7,5.8,7.2,3.7.3,6.7-1.5,7-3.8.4-2.6-2-4.3-3.7-1.6-1.4-4.5,2.4-6.1,4.9-3.2-1.9-4.5-1.8-7.7,2.4-10.9,3,4,2.6,7.3-1.2,11.1,2.4-1.3,6.2,0,4,4.6-1.2-2.8-3.7-2.2-4.2.2-.3,1.7.7,3.7,3,4.2,1.9.3,4.7-.9,7-5.9-1.3,0-2.4.7-3.9,1.7l2.4-8c.6,2.3,1.4,3.7,2.2,4.5.6-1.6.5-2.8,0-5.3l5,1.8c-2.6,3.6-5.2,8.7-7.3,17.5-7.4-1.1-15.7-1.7-24.5-1.7h0c-8.8,0-17.1.6-24.5,1.7-2.1-8.9-4.7-13.9-7.3-17.5l5-1.8c-.5,2.5-.6,3.7,0,5.3.8-.8,1.6-2.3,2.2-4.5l2.4,8c-1.5-1-2.6-1.7-3.9-1.7,2.3,5,5.2,6.2,7,5.9,2.3-.4,3.3-2.4,3-4.2-.5-2.4-3-3.1-4.2-.2-2.2-4.6,1.6-6,4-4.6-3.7-3.7-4.2-7.1-1.2-11.1,4.2,3.2,4.3,6.4,2.4,10.9,2.5-2.8,6.3-1.3,4.9,3.2-1.8-2.7-4.1-1-3.7,1.6.3,2.3,3.3,4.1,7,3.8,5.4-.5,5.7-4.2,5.8-7.2-1.3-.2-3.7,1-5.7,3.8l-.7-8.5c2.2,2.3,4.2,2.7,6.4,2.8-.7-2.3-4.1-6.1-4.1-6.1h10.6,0Z" />
                                </g>
                                <path d="M88.6,33.2c0,1.8.2,3.4.6,5s1.2,3,2,4.4c1,1.2,2,2.2,3.4,3s3,1.2,5,1.2,3.4-.2,4.6-.8,2.2-1.4,3-2.2,1.2-1.8,1.6-3c.2-1,.4-2,.4-3v-.4h-10.6v-6.4h18.8v23h-7.4v-5c-.6.8-1.2,1.6-2,2.2-.8.6-1.6,1.2-2.6,1.8-1,.4-2,.8-3.2,1.2s-2.4.4-3.6.4c-3,0-5.8-.6-8-1.6-2.4-1.2-4.4-2.6-6-4.6s-2.8-4.2-3.6-6.8c-.6-2.8-1-5.6-1-8.6s.4-5.8,1.4-8.4,2.2-4.8,4-6.8,3.8-3.4,6.2-4.6c2.4-1.2,5.2-1.6,8.2-1.6s3.8.2,5.6.6c1.8.4,3.4,1.2,4.8,2s2.8,1.8,3.8,3c1.2,1.2,2,2.6,2.8,4l-7.4,4.2c-.4-.8-1-1.8-1.6-2.4-.6-.8-1.2-1.4-2-2s-1.6-1-2.6-1.4-2.2-.4-3.4-.4c-2,0-3.6.4-5,1.2-1.4.8-2.6,1.8-3.4,3-1,1.2-1.6,2.8-2,4.4-.6,1.6-.8,3.8-.8,5.4ZM161.4,24.6c-.8-2.6-2.2-4.8-4-6.8s-3.8-3.4-6.2-4.6c-2.4-1.2-5.2-1.6-8.4-1.6s-5.8.6-8.4,1.6c-2.2,1.2-4.4,2.8-6,4.6-1.8,2-3,4.2-4,6.8-.8,2.6-1.4,5.4-1.4,8.4s.4,5.8,1.4,8.4c.8,2.6,2.2,4.8,4,6.8s3.8,3.4,6.2,4.6c2.4,1.2,5.2,1.6,8.4,1.6s5.8-.6,8.4-1.6c2.4-1.2,4.6-2.6,6.2-4.6,1.8-2,3-4.2,4-6.8.8-2.6,1.4-5.4,1.4-8.4-.2-3-.6-5.8-1.6-8.4h0ZM154,33.2c0,2-.2,3.8-.8,5.4-.4,1.6-1.2,3.2-2.2,4.4s-2.2,2.2-3.4,2.8c-1.4.6-3,1-4.8,1s-3.4-.4-4.8-1-2.6-1.6-3.4-2.8c-1-1.2-1.6-2.6-2.2-4.4-.4-1.6-.8-3.4-.8-5.4v-.2c0-2,.2-3.8.8-5.4.4-1.6,1.2-3.2,2.2-4.4,1-1.2,2.2-2.2,3.4-2.8,1.4-.6,3-1,4.8-1s3.4.4,4.8,1,2.6,1.6,3.4,2.8c1,1.2,1.6,2.6,2.2,4.4.4,1.6.8,3.4.8,5.4v.2ZM177.8,54l-11.8-42h9.4l8,31.4h.2l8-31.4h9.4l-11.8,42h-11.4,0ZM235.4,46.7c1.2,0,2.4-.2,3.4-.6,1-.4,2-.8,2.8-1.6s1.4-1.6,1.8-2.8c.4-1.2.6-2.4.6-4V11.8h8.2v27.2c0,2.4-.4,4.4-1.2,6.2s-2,3.4-3.6,4.8c-1.4,1.4-3.2,2.4-5.4,3-2,.8-4.4,1-6.8,1s-4.8-.4-6.8-1c-2-.8-3.8-1.8-5.4-3-1.6-1.4-2.6-3-3.6-4.8-.8-1.8-1.2-4-1.2-6.2V11.7h8.4v26c0,1.6.2,2.8.6,4,.4,1.2,1,2,1.8,2.8s1.6,1.2,2.8,1.6c1.2.4,2.2.6,3.6.6h0ZM261.4,11.9h8.4v18.2l14.8-18.2h10.4l-14.4,16.8,15.4,25.2h-9.8l-11-18.8-5.4,6v12.8h-8.4V11.9h0ZM206.2,44.2c-3,0-5.4,2.4-5.4,5.4s2.4,5.4,5.4,5.4,5.4-2.4,5.4-5.4-2.4-5.4-5.4-5.4Z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </header>
                <p class='govuk-body'>Chat ID: </p>
                <p class='govuk-body'>${printDate?.innerHTML}</p>
                ${selectedHTML}
            </body>
        </html>`);

        printingIframeDoc?.close();

        printingIframe.onload = () => {
            const printWindow = printingIframe.contentWindow
            if (!printWindow) return
            const styles = document.querySelectorAll('style, link[rel="stylesheet"]')
            styles.forEach(style => {
                const clone = style.cloneNode(true)
                printingIframeDoc?.head.appendChild(clone)
            })

            setTimeout(() => {
                printWindow.focus()
                printWindow.print()
            }, 200)
        }









        // const elementList: string[] = [
        //     "app-related-items",
        //     "govuk-back-link",
        //     "govuk-phase-banner",
        //     "hmrc-report-technical-issue",
        //     "govuk-footer",
        //     "govuk-heading-xl",
        //     "hmrc-user-research-banner",
        //     "cbanner-govuk-cookie-banner",
        // ];

        // const printList: string[] = [
        //     "govuk-grid-row",
        //     "govuk-grid-column-two-thirds",
        //     "govuk-main-wrapper"
        // ];

        // PrintUtils.removeElementsForPrint(elementList);

        // if (document.getElementById("nuanMessagingFrame")?.classList.contains("ci-api-popup")) {
        //     document.body.querySelectorAll('*').forEach(function (node: Element): void {
        //         printList.forEach(function (item: string): void {
        //             if (node.classList.contains(item)) {
        //                 node.classList.add("govuk-!-display-none-print");
        //             }
        //         });
        //     });
        // }

        // window.print();

        return false;
    }

    _sendPostChatSurveyWebchat(sdk: any): PostChatSurveyWebchatService {
        return new PostChatSurveyWebchatService(sdk);
    }

    _sendPostChatSurveyDigitalAssistant(sdk: any): PostChatSurveyDigitalAssistantService {
        return new PostChatSurveyDigitalAssistantService(sdk);
    }

    onSkipToTopLink(e: Event): void {
        e.preventDefault();
        document.getElementById("skipToTopLink")?.focus();
    }

    closeNuanceChat(): void {
        if (this.sdk) {
            if (this.sdk.isChatInProgress()) {
                this.sdk.closeChat();
            }
        }
    }

    showEndChatPage(showThanks: boolean): void {
        this.container._removeSkinHeadingElements();
        this.container.showPage(new PostPCSPage(showThanks));
        document.getElementById("heading_chat_ended")?.focus();
        this.closeNuanceChat();
    }

    _moveToChatNullState(): void {
        this._moveToState(new ChatStates.NullState());
    }

    nuanceFrameworkLoaded(w: Window & typeof globalThis): void {
        logger.info("### framework loaded");
        this.sdk = w.Inq.SDK;
        if (this.sdk.isChatInProgress()) {
            document.getElementById("error-message")?.setAttribute("class", "chat-in-progress");
            logger.info("************************************")
            logger.info("******* chat is in progress ********")
            logger.info("************************************")
        }
    }

    _moveToClosingState(): void {
        this._moveToState(new ChatStates.ClosingState(() => this.closeChat()))
    }

    onSend(): void {
        let text: string = this.container.currentInputText();
        const alphaNumericSpecial: RegExp = /\S/

        if (alphaNumericSpecial.test(text) == true) {
            text = text.trim()
            this.state.onSend(text);
            this.onScreenReaderMessageSentNotification()
            this.container.clearCurrentInputText();
        }
    }

    onCloseChat(): void {
        this.state.onClickedClose();
        document.getElementById("systemMessageBanner")!.style.display = 'none'
    }

    onHideChat(): void {
        if (!this.minimised) {
            this.container.minimise();
            if (this.sdk) {
                this.sdk.sendActivityMessage("minimize");
            }
            this.minimised = true;
            document.getElementById("ciapiSkinRestoreButton")?.focus();
        }
    }

    onRestoreChat(): void {
        if (this.minimised) {
            this.container.restore();
            if (this.sdk) {
                this.sdk.sendActivityMessage("restore");
            }
            this.minimised = false;
            try {
                document.getElementById("ciapiSkinHideButton")?.focus();
            } catch {
                console.log('DEBUG: ' + 'Element not found')
            }
        }
    }

    onMenuClick(): void {
        let x: string | null | undefined = document.getElementById("menuButton")?.getAttribute("aria-expanded");
        if (x == "true") {
            x = "false"
        } else {
            x = "true"
        }
        document.getElementById("menuButton")?.setAttribute("aria-expanded", x);
        document.getElementById("menuList")?.classList.toggle("show");
    }

    onAccessibilityStatement(): void {
        document.getElementById("custMsg")?.focus();
        this.closeMenu()
        let url: string = new URL(window.location.href).pathname.replaceAll("/", "%2F");
        let env: string = this.envChecker();
        window.open("https://www." + env + "tax.service.gov.uk/accessibility-statement/digital-engagement-platform-frontend-hmrc-chatskin?referrerUrl=" + url + "-skin-hmrc", "_blank");
    }

    envChecker(): string {
        let env: string;
        let url: string = window.location.href;

        if (url.includes('qa') || (url.includes('localhost'))) {
            env = 'qa.'
        } else if (url.includes('staging')) {
            env = 'staging.'
        } else {
            env = ''
        }
        return env;
    }

    onMsgClick(): void {
        this.closeMenu()
    }

    onStartTyping(): void {
        this.sdk.sendActivityMessage("startTyping");
    }

    onStopTyping(): void {
        this.sdk.sendActivityMessage("stopTyping");
    }

    hasBeenSurveyed(): boolean {
        return document.cookie.includes("surveyed=true")
    }

    closeMenu(): void {
        document.getElementById("menuButton")?.setAttribute("aria-expanded", "false");
        document.getElementById("menuList")?.classList.remove("show");
    }

    onConfirmEndChat(): void {
        this.closeNuanceChat();
        this.closeMenu()
        if (this.state instanceof ChatStates.EngagedState) {
            this.state.escalated = this.state.isEscalated();
        }

        this.ended = 'true'

        if (this.hasBeenSurveyed()) {
            this._moveToClosingState();
            this.showEndChatPage(false);
        } else {
            if (this.state instanceof ChatStates.EngagedState && this.state.escalated) {
                this._sendPostChatSurveyWebchat(this.sdk).beginPostChatSurvey(webchatSurvey, automatonWebchat, timestamp);
                this.container.showPage(new PostChatSurveyWebchat((page) => this.onPostChatSurveyWebchatSubmitted(page)));
                this._moveToClosingState();
            } else {
                this._sendPostChatSurveyDigitalAssistant(this.sdk).beginPostChatSurvey(digitalAssistantSurvey, automatonDA, timestamp);
                this.container.showPage(new PostChatSurveyDigitalAssistant((page) => this.onPostChatSurveyDigitalAssistantSubmitted(page)));
                this._moveToClosingState();
            }
        }

    }

    onPostChatSurveyWebchatSubmitted(surveyPage: any): void {
        let surveySkipped: string | null = sessionStorage.getItem("surveySkipped");
        if (surveySkipped != "true") {
            const answers: Answers = {
                answers: [
                    { id: this.getRadioId("q1-"), text: this.getRadioValue("q1-"), freeform: false },
                    { id: this.getRadioId("q2-"), text: this.getRadioValue("q2-"), freeform: false },
                    { id: "q3-", text: this.getTextAreaValue("q3-"), freeform: true },
                    { id: this.getRadioId("q4-"), text: this.getRadioValue("q4-"), freeform: false },
                    { id: this.getRadioId("q5-"), text: this.getRadioValue("q5-"), freeform: false },
                    { id: "q6-", text: this.getTextAreaValue("q6-"), freeform: true }
                ]
            };
            if (answers.answers[0].text != "" && answers.answers[1].text != "" && answers.answers[2].text != "" && answers.answers[3].text != "" && answers.answers[4].text != "") {
                document.cookie = "surveyed=true";
                if (document.getElementById('errorSummary')) {
                    document.getElementById('errorSummary')!.style.display = 'none'
                }
                var surveyWithAnswers: Answers & Survey = Object.assign(answers, webchatSurvey);
                this._sendPostChatSurveyWebchat(this.sdk).submitPostChatSurvey(surveyWithAnswers, automatonWebchat, timestamp);
                this.showEndChatPage(true);
                surveyPage.detach();
            } else {
                const errors: Promise<QuestionCompleted> = this.errorList(answers)
                errors.then((resolve) => {
                    if (resolve.Q1 == false) {
                        document.getElementById("errorQ1a")?.focus();
                    } else if (resolve.Q1 == true && resolve.Q2 == false) {
                        document.getElementById("errorQ2a")?.focus();
                    } else if (resolve.Q1 == true && resolve.Q2 == true && resolve.Q3 == false) {
                        document.getElementById("errorQ3a")?.focus();
                    } else if (resolve.Q1 == true && resolve.Q2 == true && resolve.Q3 == true && resolve.Q4 == false) {
                        document.getElementById("errorQ4a")?.focus();
                    } else if (resolve.Q1 == true && resolve.Q2 == true && resolve.Q3 == true && resolve.Q4 == true && resolve.Q5 == false) {
                        document.getElementById("errorQ5a")?.focus();
                    }
                }).catch((err: unknown): void => {
                    logger.error("!!!! Survey Error list got exception: ", err);
                });
            }
        } else {
            sessionStorage.removeItem("surveySkipped");
            document.cookie = "surveyed=true";
            this._sendPostChatSurveyWebchat(this.sdk).closePostChatSurvey(automatonWebchat, timestamp);
            this.showEndChatPage(false);
            surveyPage.detach();
        }
    }

    onPostChatSurveyDigitalAssistantSubmitted(surveyPage: any) {
        let surveySkipped: string | null = sessionStorage.getItem("surveySkipped");
        if (surveySkipped != "true") {
            const answers: Answers = {
                answers: [
                    { id: this.getRadioId("q1-"), text: this.getRadioValue("q1-"), freeform: false },
                    { id: this.getRadioId("q2-"), text: this.getRadioValue("q2-"), freeform: false },
                    { id: "q3-", text: this.getTextAreaValue("q3-"), freeform: true },
                    { id: this.getRadioId("q4-"), text: this.getRadioValue("q4-"), freeform: false },
                    { id: this.getRadioId("q5-"), text: this.getRadioValue("q5-"), freeform: false },
                    { id: "q6-", text: this.getTextAreaValue("q6-"), freeform: true }
                ]
            };
            if (answers.answers[0].text != "" && answers.answers[1].text != "" && answers.answers[2].text != "" && answers.answers[3].text != "" && answers.answers[4].text != "") {
                document.cookie = "surveyed=true";
                if (document.getElementById('errorSummary')) {
                    document.getElementById('errorSummary')!.style.display = 'none'
                }
                var surveyWithAnswers: Answers & Survey = Object.assign(answers, digitalAssistantSurvey);
                this._sendPostChatSurveyDigitalAssistant(this.sdk).submitPostChatSurvey(surveyWithAnswers, automatonDA, timestamp);
                this.showEndChatPage(true);
                surveyPage.detach();
            } else {
                const errors: Promise<QuestionCompleted> = this.errorList(answers)
                errors.then((resolve) => {
                    if (resolve.Q1 == false) {
                        document.getElementById("errorQ1a")?.focus();
                    } else if (resolve.Q1 == true && resolve.Q2 == false) {
                        document.getElementById("errorQ2a")?.focus();
                    } else if (resolve.Q1 == true && resolve.Q2 == true && resolve.Q3 == false) {
                        document.getElementById("errorQ3a")?.focus();
                    } else if (resolve.Q1 == true && resolve.Q2 == true && resolve.Q3 == true && resolve.Q4 == false) {
                        document.getElementById("errorQ4a")?.focus();
                    } else if (resolve.Q1 == true && resolve.Q2 == true && resolve.Q3 == true && resolve.Q4 == true && resolve.Q5 == false) {
                        document.getElementById("errorQ5a")?.focus();
                    }
                }).catch((err: unknown): void => {
                    logger.error("!!!! Survey Error list got exception: ", err);
                });
            }
        } else {
            document.cookie = "surveyed=true";
            sessionStorage.removeItem("surveySkipped");
            this._sendPostChatSurveyDigitalAssistant(this.sdk).closePostChatSurvey(automatonDA, timestamp);
            this.showEndChatPage(false);
            surveyPage.detach();
        }
    };

    errorList(answers: Answers): Promise<QuestionCompleted> {
        return new Promise((resolve) => {
            let questionCompleted: QuestionCompleted = {
                "Q1": false,
                "Q2": false,
                "Q3": false,
                "Q4": false,
                "Q5": false
            }
            if (answers.answers[0].text == "") {
                document.getElementById('errorSummary')!.style.display = 'block'
                document.getElementById('errorQ1')!.style.display = 'block'
                document.getElementById('needed-error')!.style.display = 'block'
                document.getElementById('q1FormGroup')!.classList.add('govuk-form-group--error')
            } else {
                questionCompleted.Q1 = true
                document.getElementById('errorQ1')!.style.display = 'none'
                document.getElementById('needed-error')!.style.display = 'none'
                document.getElementById('q1FormGroup')!.classList.remove('govuk-form-group--error')
            }
            if (answers.answers[1].text == "") {
                document.getElementById('errorSummary')!.style.display = 'block'
                document.getElementById('errorQ2')!.style.display = 'block'
                document.getElementById('easy-error')!.style.display = 'block'
                document.getElementById('q2FormGroup')!.classList.add('govuk-form-group--error')
            } else {
                questionCompleted.Q2 = true
                document.getElementById('errorQ2')!.style.display = 'none'
                document.getElementById('easy-error')!.style.display = 'none'
                document.getElementById('q2FormGroup')!.classList.remove('govuk-form-group--error')
            }
            if (answers.answers[2].text == "") {
                document.getElementById('errorSummary')!.style.display = 'block'
                document.getElementById('errorQ3')!.style.display = 'block'
                document.getElementById('service-error')!.style.display = 'block'
                document.getElementById('q3FormGroup')!.classList.add('govuk-form-group--error')
            } else {
                questionCompleted.Q3 = true
                document.getElementById('errorQ3')!.style.display = 'none'
                document.getElementById('service-error')!.style.display = 'none'
                document.getElementById('q3FormGroup')!.classList.remove('govuk-form-group--error')
            }
            if (answers.answers[3].text == "") {
                document.getElementById('errorSummary')!.style.display = 'block'
                document.getElementById('errorQ4')!.style.display = 'block'
                document.getElementById('score-error')!.style.display = 'block'
                document.getElementById('q4FormGroup')!.classList.add('govuk-form-group--error')
            } else {
                questionCompleted.Q4 = true
                document.getElementById('errorQ4')!.style.display = 'none'
                document.getElementById('score-error')!.style.display = 'none'
                document.getElementById('q4FormGroup')!.classList.remove('govuk-form-group--error')
            }
            if ((answers.answers[4].text == "") || (answers.answers[4].text == "Other" && answers.answers[5].text == "")) {
                document.getElementById('errorSummary')!.style.display = 'block'
                document.getElementById('errorQ5')!.style.display = 'block'
                document.getElementById('contact-error')!.style.display = 'block'
                document.getElementById('q5FormGroup')!.classList.add('govuk-form-group--error')
            } else {
                questionCompleted.Q5 = true
                document.getElementById('errorQ5')!.style.display = 'none'
                document.getElementById('contact-error')!.style.display = 'none'
                document.getElementById('q5FormGroup')!.classList.remove('govuk-form-group--error')
            }
            resolve(questionCompleted);
        })
    }

    onSoundToggle(): void {
        let soundElement: HTMLElement | null = document.getElementById("toggleSound");
        let isActive: boolean | undefined = soundElement?.classList.contains("active");

        if (isActive && soundElement) {
            soundElement.classList.remove("active");
            soundElement.classList.add("inactive");
            soundElement.innerHTML = "Turn notification sound on";

        } else if (!isActive && soundElement) {
            soundElement.classList.remove("inactive");
            soundElement.classList.add("active");
            soundElement.innerHTML = "Turn notification sound off";
        }
        sessionStorage.setItem("isActive", `${!isActive}`);
        this.closeMenu()
        document.getElementById("custMsg")?.focus();
    }

    onSizeToggle(): void {
        let container: HTMLElement | null = document.getElementById("ciapiSkinContainer");
        let isStandard: boolean | undefined = container?.classList.contains("ciapiSkinContainerStandardSize");
        let sizeButton: HTMLElement | null = document.getElementById('toggleSizeButton')

        if (isStandard && container && sizeButton) {
            container.classList.remove("ciapiSkinContainerStandardSize");
            container.classList.add("ciapiSkinContainerLargerSize");
            sizeButton.innerHTML = "Decrease chat size";

        } else if (!isStandard && container && sizeButton) {
            container.classList.remove("ciapiSkinContainerLargerSize");
            container.classList.add("ciapiSkinContainerStandardSize");
            sizeButton.innerHTML = "Increase chat size";
        }
        sessionStorage.setItem("isStandard", `${!isStandard} `);
        this.closeMenu()
        document.getElementById("custMsg")?.focus();
    }

    onScreenReaderMessageSentNotification(): void {
        const message: string = messages.messageSent
        document.getElementById("custMsg")?.focus();
        let sentMessageNotification: HTMLElement | null = document.getElementById('sentMessageNotification')
        if (sentMessageNotification) {
            sentMessageNotification.textContent = message
            setTimeout(() => {
                sentMessageNotification!.textContent = ''
            }, 100)
        }
    }
};