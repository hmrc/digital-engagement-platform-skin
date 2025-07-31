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
import { host } from '../utils/HostUtils';
import SessionActivityService from '../utils/Session-Activity-Service'

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

const authenticatedServices = ['epaye', 'business-account', 'personal-account', 'check-income-tax'] as const;
type AuthenticatedServices = typeof authenticatedServices[number];

const authenticatedServiceEndpointsMap: Record<AuthenticatedServices, string> = {
    'epaye': '/business-account/epaye/keep-alive',
    'business-account': '/business-account/keep-alive',
    'personal-account': '/personal-account/keep-alive',
    'check-income-tax': '/check-income-tax/keep-alive'
}

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
    sessionActivityService: SessionActivityService
    constructor() {
        this.sdk = null;
        this.state = new ChatStates.NullState();
        this.minimised = false;
        this.ended = false;
        this.escalated = false;
        this.type = '';
        this.sessionActivityService = new SessionActivityService(window.BroadcastChannel);
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

                let urlPermittedforAutoEngage: string | null = sessionStorage.getItem("isAutoEngage")

                if (urlPermittedforAutoEngage == "true") {
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

    onPrint(e: Event): void {
        this.closeMenu()
        document.getElementById("custMsg")?.focus();
        e.preventDefault;

        let existingPrintIframe: HTMLElement | null = document.getElementById("printIframe")
        if (existingPrintIframe) {
            document.body.removeChild(existingPrintIframe);
        }

        let printDate: HTMLElement | null = document.getElementById("print-date")
        if (printDate) {
            printDate.innerHTML = PrintUtils.getPrintDate();
        }

        let printingIframe: HTMLIFrameElement = document.createElement("iframe")
        printingIframe.id = "printIframe";
        printingIframe.style.position = "absolute";
        printingIframe.style.width = "0";
        printingIframe.style.height = "0";
        printingIframe.style.border = "none";
        printingIframe.style.visibility = "hidden"
        document.body.appendChild(printingIframe);

        const chatID: HTMLElement | null = document.getElementById('chat-id')
        const htmlElements: NodeListOf<HTMLDivElement> = document.querySelectorAll('.timestamp-outer')
        const styleElements: NodeListOf<HTMLElement> = document.querySelectorAll('style, link[rel="stylesheet"]')
        const htmlString: string = Array.from(htmlElements).map(el => el.outerHTML).join('')
        const styleString: string = Array.from(styleElements).map(el => el.outerHTML).join('')

        const printingIframeHTML = `
        <html>
            <head>
                ${styleString}
            </head>
            <body>
                <header class="govuk-header print-gov-header" data-module="govuk-header">
                    <div class="govuk-header__container govuk-width-container">
                        <div class="govuk-header__logo">
                            <a href="#" class="govuk-header__link govuk-header__link--homepage">
                                <img src="` + host + `/engagement-platform-skin/assets/media/crown.svg" alt='crown logo'>
                            </a>
                        </div>
                    </div>
                </header>
                <p class='govuk-body'>Chat ID: ${chatID?.outerHTML}</p>
                <p class='govuk-body'>${printDate?.outerHTML}</p>
                ${htmlString}
            </body>
        </html>`

        printingIframe.srcdoc = printingIframeHTML
        printingIframe.onload = () => {
            const printWindow: Window | null = printingIframe.contentWindow
            if (!printWindow) {
                return
            }
            requestAnimationFrame(() => printWindow.print())
        }
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
        this.authenticatedServiceCheck()
    }

    authenticatedServiceCheck(): void {
        const url: string = window.location.href
        const authenticatedService = authenticatedServices.find(service => url.includes(`/${service}`))
        if (authenticatedService) {
            this.keepSessionAlive(authenticatedService);
        }
    }

    keepSessionAlive(authenticatedService: AuthenticatedServices): void {
        const keepAliveEndpoint: string = authenticatedServiceEndpointsMap[authenticatedService]
        this.ajaxGet(keepAliveEndpoint, (_) => { });
        this.broadcastSessionActivity();
    };

    ajaxGet(url: string, success: (responseText: string) => void): XMLHttpRequest {
        const xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onreadystatechange = () => {
            if (xhr.readyState > 3 && xhr.status === 200) success(xhr.responseText);
        };
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send();
        console.log('AJAXSEND', xhr.send())
        return xhr;
    }

    broadcastSessionActivity(): void {
        this.sessionActivityService.logActivity();
        console.log('BCA')
    };

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