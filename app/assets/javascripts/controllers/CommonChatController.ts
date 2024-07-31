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

interface Survey {
    id: string;
    questions: {
        id: string[];
        text: string;
        freeform: boolean;
    }[];
}

interface Answers {
    answers: {
        id: string | undefined;
        text: string;
        freeform: boolean;
    }[];
}

const automatonDA: {id: string, name: string} = {
    id: "survey-13000304",
    name: "HMRC_PostChat_Guidance-CUI"
};

const automatonWebchat: {id: string, name: string} = {
    id: "survey-13000303",
    name: "HMRC_PostChat_Transactional-CUI"
};

const timestamp: number = Date.now();

const webchatSurvey: Survey = {
    id: "13000303",
    questions: [
        { id: ["question1"], text: "Were you able to do what you needed to do today?", freeform: false },
        { id: ["question2"], text: "How easy was it to do what you needed to do today?", freeform: false },
        { id: ["question3"], text: "Overall, how did you feel about the service you received today?", freeform: false },
        { id: ["question4"], text: "Why did you give these scores?", freeform: true },
        { id: ["question5"], text: "How would you prefer to get in touch with HMRC??", freeform: false },
        { id: ["question6"], text: "Provide other contact option", freeform: true }
    ]
};

const digitalAssistantSurvey: Survey = {
    id: "13000304",
    questions: [
        { id: ["question1"], text: "Were you able to do what you needed to do today?", freeform: false },
        { id: ["question2"], text: "How easy was it to do what you needed to do today?", freeform: false },
        { id: ["question3"], text: "Overall, how did you feel about the service you received today?", freeform: false },
        { id: ["question4"], text: "Why did you give these scores?", freeform: true },
        { id: ["question5"], text: "How would you prefer to get in touch with HMRC?", freeform: false },
        { id: ["question6"], text: "Provide other contact option", freeform: true }
    ]
}

export default class CommonChatController {
    sdk: any
    state: ChatStates.NullState | ChatStates.EngagedState
    minimised: boolean
    ended: boolean | string
    escalated: boolean
    type: string
    container: any
     // I am unsure of the type of container. I have tried container?: ChatContainer | null and managed to get rid of all of the errors using '?' except one in launchChat because there is a return which returns if this.container is truthy so I do not think it runs the next method on this.container. The error I am getting is Property 'getTranscript' does not exist on type 'never'.ts(2339). Do you have any ideas?
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
    // I have had to cast the above function but I have checked the code and console and think it is correct. Is this ok? I try to avoid casting where possible.

    getRadioId(radioGroup: string): string | undefined {
        var elements: NodeListOf<HTMLElement> = document.getElementsByName(radioGroup);

        for (var i: number = 0, l: number = elements.length; i < l; i++) {
            if ((elements[i] as HTMLInputElement).checked) {
                return elements[i].id;
            }
        }
    }
       // I have had to cast the above function but I have checked the code and console and think it is correct.

    updateDav3DeskproRefererUrls(): void {
        let reportTechnicalIssueElement: HTMLCollectionOf<Element> = document.getElementsByClassName('hmrc-report-technical-issue');
        let reportTechnicalIssueElementZero = reportTechnicalIssueElement[0] as HTMLAnchorElement

        if (reportTechnicalIssueElement.length) {
            if ((reportTechnicalIssueElementZero).href) {
                let reportTechnicalIssueElementHref: string = (reportTechnicalIssueElementZero).href;
                (reportTechnicalIssueElementZero).href = reportTechnicalIssueElementHref.concat("-dav3");
            }
        }
          // I could not find this className in the code but the tests have it as an anchor tag and it is an anchor tag in the DOM using the inspect tool. Is this ok? As mentioned, casting is not that safe unless we are sure.

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
// This is selecting the accessibility statement link from the footer. I have had to cast it but it is an anchor tag. I have checked using the inspect tool. 

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
    // Had to cast but used the console to check it was still working and appears to be fine.

    getSdk(): any {
        logger.debug("printing this.sdk.chatDisplayed",this.sdk.chatDisplayed)
        return this.sdk
    }

    _launchChat(obj: { type: string; state?: string }): void {
        if (this.container) {
            return;
        }
        try{
            this.type = obj.type
            this._showChat();
            if (obj.state === 'missed') {
                let msg: string = messages.unavilable
                this.container.getTranscript().addSystemMsg({msg: msg}, Date.now());
                let ciapiSkinFooter: HTMLElement | null = document.getElementById('ciapiSkinFooter')
                if(ciapiSkinFooter){
                    ciapiSkinFooter.style.display = 'none'
                }
                // Had to use a nested if statement to show that the ciapiSkinFooter was not null it would not let me use the optional chaining symbol '?' with style. We could get rid of the nested if and use the '!' to say that it definitely will be present. The HTML is there so perhaps that is tidier than a nested if but probably not as safe according to TS. Although there is no if on the else to catch it if it is not truthy.
                
            } else {
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
        
                    this._removeAnimation();
        
                    let dav3Skin: HTMLElement | null = document.getElementById("ciapiSkin");
        
                    if (dav3Skin) {
                        this.updateDav3DeskproRefererUrls();
                    }
        
                    const existingErrorMessage: HTMLElement | null = document.getElementById("error-message")
                    // Cannot find error-message in the codebase or using the inspect but it is a HTMLElement in the tests for the CommonChatController. getElementById always returns an element anyway or subclass e.g. HTMLElement
        
                    if (existingErrorMessage) {
                        existingErrorMessage.remove()
                    }
            }
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
            // Had to extend the global window interface in index.d.ts to get the Inq to work. I have set it as any as when console logged it is returning a very complex object. It was not happy with only being typed {}. Do you have any ideas?

            this.container.setEventHandler(this);

            this._moveToChatShownState();
        } catch (e: unknown) {
            logger.error("!!!! _showChat got exception: ", e);
        }
    }

    _displayOpenerScripts(): void {
        this.sdk = window.Inq.SDK;

        this.sdk.getOpenerScripts((openerScripts: any) => {
            if (openerScripts == null)
                return;

            for (var openerScript of openerScripts) {
                this.container.getTranscript().addOpenerScript(openerScript);
            }
        });
    }

    _moveToChatEngagedState(previousMessages = []): void {
        this._moveToState(new ChatStates.EngagedState(
            this.sdk,
            this.container,
            previousMessages,
            () => this.container.confirmEndChat()));
    }
    // Previous messages is set to a default parameter. I console logged previousMessages and it gave me []. The inference wants to type it as never[]. However, I am not sure?

    _moveToState(state: ChatStates.NullState | ChatStates.EngagedState | ChatStates.ShownState | ChatStates.ClosingState): void {
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
    // There are 0 instances of this in the codebase. However, it is typed HTMLCollection... as this is what it will return if there were multiple elements with this className

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
        if (document.body.contains(document.getElementById("postChatSurveyWrapper"))) {
            if (this.state instanceof ChatStates.EngagedState && this.state.escalated) {
                this._sendPostChatSurveyWebchat(this.sdk).closePostChatSurvey(automatonWebchat, timestamp);
            } else {
                this._sendPostChatSurveyDigitalAssistant(this.sdk).closePostChatSurvey(automatonDA, timestamp);
            }
        }
        // I could not get this method to run but had to add type checking in the if statement because .escalated is only on the EngagedState method. Are you happy with this or have any ideas how we can double check it still runs the if case? In theory it should still run fine. 

        if(this.ended){
            this.container.destroy();
            this.container = null;
            this._moveToChatNullState();
            if(this.sdk && this.type != 'proactive'){
                window.Inq.reinitChat();
            }
        } else {
            this.ended = 'true'
            this.showEndChatPage(false);
        }
    }

    onPrint(e: Event): boolean {
        e.preventDefault;
        const printDate: HTMLElement | null = document.getElementById("print-date")
        if(printDate){
            printDate.innerHTML = PrintUtils.getPrintDate();
        }

        const elementList: string[] = [
            "app-related-items",
            "govuk-back-link",
            "govuk-phase-banner",
            "hmrc-report-technical-issue",
            "govuk-footer",
            "govuk-heading-xl",
            "hmrc-user-research-banner",
            "cbanner-govuk-cookie-banner",
        ];

        const printList: string[] = [
        "govuk-grid-row",
        "govuk-grid-column-two-thirds",
        "govuk-main-wrapper"
        ];

        PrintUtils.removeElementsForPrint(elementList);

        if (document.getElementById("nuanMessagingFrame")?.classList.contains("ci-api-popup")) {
            document.body.querySelectorAll('*').forEach(function(node: Element): void {
                printList.forEach(function(item: string): void {
                    if (node.classList.contains(item)) {
                        node.classList.add("govuk-!-display-none-print");
                    }
                });
            });
        }

        window.print();

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
        if(this.sdk) {
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
    // Console log did not return 'w' and inference has it as w: { Inq: { SDK: any } }. I have looked in tests and it appears we pass through Window to this method. Obviously the parameter is called w and the inferred type on the test is Window & typeof globalThis. Should we go with this? I really am struggling to piece together how window is used here though. 
    
    //I appreciate since I made this comment we said to leave anything SDK / Nunace related as any. Would you like it as any?

    _moveToClosingState(): void {
        this._moveToState(new ChatStates.ClosingState(() => this.closeChat()))
    }

    onSend(): void {
        const text: string = this.container.currentInputText().trim();
        this.container.clearCurrentInputText();
        if (text !== "")
            this.state.onSend(text);
    }

    onCloseChat(): void {
        const popupChatContainer: HTMLCollectionOf<Element> = document.getElementsByClassName("ci-api-popup");
        this.state.onClickedClose();
        if (popupChatContainer.length > 0) {
            this.onShowHamburger();
        }
    }

    onHideChat(): void {
        if (!this.minimised) {
            this.container.minimise();
            if(this.sdk) {
                this.sdk.sendActivityMessage("minimize");
            }
            this.minimised = true;
        }
    }

    onRestoreChat(): void {
        if (this.minimised) {
            this.container.restore();
            if(this.sdk) {
                this.sdk.sendActivityMessage("restore");
            }
            this.minimised = false;
            try{
                document.getElementById("ciapiSkinHideButton")?.focus();
            } catch {
                console.log('DEBUG: ' + 'Element not found' )
            }
        }
    }

    onShowHamburger(): void {
        let x: string | null | undefined = document.getElementById("hamburgerMenu")?.getAttribute("aria-expanded");
        if (x == "true") {
            x = "false"
        } else {
            x = "true"
        }
        document.getElementById("hamburgerMenu")?.setAttribute("aria-expanded", x);
        document.getElementById("hamburgerList")?.classList.toggle("show");
    }

    onAccessibilityStatement(): void {
        let url: string = new URL(window.location.href).pathname.replaceAll("/", "%2F");
        window.open("https://www.tax.service.gov.uk/accessibility-statement/digital-engagement-platform-frontend?referrerUrl=" + url + "-skin-hmrc", "_blank");
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

    onConfirmEndChat(): void {
        this.closeNuanceChat();
        if(this.state instanceof ChatStates.EngagedState){
            this.state.escalated = this.state.isEscalated();
        } 

        this._moveToClosingState();

        this.ended = 'true'

        if (this.hasBeenSurveyed()) {
            this.showEndChatPage(false);
        } else {
            if (this.state instanceof ChatStates.EngagedState && this.state.escalated) {
                this._sendPostChatSurveyWebchat(this.sdk).beginPostChatSurvey(webchatSurvey, automatonWebchat, timestamp);
                this.container.showPage(new PostChatSurveyWebchat((page) => this.onPostChatSurveyWebchatSubmitted(page)));
            } else {
                this._sendPostChatSurveyDigitalAssistant(this.sdk).beginPostChatSurvey(digitalAssistantSurvey, automatonDA, timestamp);
                this.container.showPage(new PostChatSurveyDigitalAssistant((page) => this.onPostChatSurveyDigitalAssistantSubmitted(page)));
            }
        }

    }

    onPostChatSurveyWebchatSubmitted(surveyPage: any): void {
        const answers: Answers = {
            answers: [
                {id: this.getRadioId("q1-"), text: this.getRadioValue("q1-"), freeform: false},
                {id: this.getRadioId("q2-"), text: this.getRadioValue("q2-"), freeform: false},
                {id: this.getRadioId("q3-"), text: this.getRadioValue("q3-"), freeform: false},
                {id: "q4-", text: this.getTextAreaValue("q4-"), freeform: true},
                {id: this.getRadioId("q5-"), text: this.getRadioValue("q5-"), freeform: false},
                {id: "q6-", text: this.getTextAreaValue("q6-"), freeform: true}
            ]
        };

        var surveyWithAnswers = Object.assign(answers, webchatSurvey);
        document.cookie = "surveyed=true";

        this._sendPostChatSurveyWebchat(this.sdk).submitPostChatSurvey(surveyWithAnswers, automatonWebchat, timestamp);
        surveyPage.detach();
        this.showEndChatPage(true);
    }

    // VSCode infers surveyPage type as Object. However, this throws an error on .detach() with the error message Property 'detach' does not exist on type 'object'.ts(2339). From what I can tell the .detach method is being used on either the CommonPostChatSurvey.ts or the PostPCSPage.ts. Do you have any ideas what it may be? I have typed as any for the time being to get rid of the error.

    onPostChatSurveyDigitalAssistantSubmitted(surveyPage: any): void {
        const answers: Answers = {
            answers: [
                {id: this.getRadioId("q1-"), text: this.getRadioValue("q1-"), freeform: false},
                {id: this.getRadioId("q2-"), text: this.getRadioValue("q2-"), freeform: false},
                {id: this.getRadioId("q3-"), text: this.getRadioValue("q3-"), freeform: false},
                {id: "q4-", text: this.getTextAreaValue("q4-"), freeform: true},
                {id: this.getRadioId("q5-"), text: this.getRadioValue("q5-"), freeform: false},
                {id: "q6-", text: this.getTextAreaValue("q6-"), freeform: true}
            ]
        };

        document.cookie = "surveyed=true";
        var surveyWithAnswers = Object.assign(answers, digitalAssistantSurvey);
        this._sendPostChatSurveyDigitalAssistant(this.sdk).submitPostChatSurvey(surveyWithAnswers, automatonDA, timestamp);
        surveyPage.detach();
        this.showEndChatPage(true);
    };

    // Same issue as the method above.

    onSoundToggle(): void {
        let soundElement: HTMLElement | null = document.getElementById("toggleSound");
        let isActive: boolean | undefined = soundElement?.classList.contains("active");

        if (isActive && soundElement) {
            soundElement.classList.remove("active");
            soundElement.classList.add("inactive");
            soundElement.innerHTML = "Turn notification sound on";

        } else if (!isActive && soundElement){
            soundElement.classList.remove("inactive");
            soundElement.classList.add("active");
            soundElement.innerHTML = "Turn notification sound off";
        }
        sessionStorage.setItem("isActive", `${!isActive}`);
    }

    onSizeToggle(): void {
        let container: HTMLElement | null = document.getElementById("ciapiSkinContainer");
        let isStandard: boolean | undefined = container?.classList.contains("ciapiSkinContainerStandardSize");
        let sizeButton: HTMLElement | null = document.getElementById('toggleSizeButton')

        if (isStandard && container && sizeButton) {
            container.classList.remove("ciapiSkinContainerStandardSize");
            container.classList.add("ciapiSkinContainerLargerSize");
            sizeButton.innerHTML = "Decrease chat size";

        } else if(!isStandard && container && sizeButton){
            container.classList.remove("ciapiSkinContainerLargerSize");
            container.classList.add("ciapiSkinContainerStandardSize");
            sizeButton.innerHTML = "Increase chat size";
        }
        sessionStorage.setItem("isStandard", `${!isStandard}`);
    }
};
