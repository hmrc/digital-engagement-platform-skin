import PostChatSurveyWebchat from '../views/postChatSurvey/PostChatSurveyWebchat'
import PostChatSurveyDigitalAssistant from '../views/postChatSurvey/PostChatSurveyDigitalAssistant'
import ChatContainer from '../utils/ChatContainer'
import * as MessageClasses from '../DefaultClasses'
import * as EmbeddedContainerHtml from '../views/embedded/EmbeddedContainerHtml'
import * as PopupContainerHtml from '../views/popup/PopupContainerHtml'
import * as ChatStates from '../services/ChatStates'
import PostChatSurveyWebchatService from '../services/PostChatSurveyWebchatService'
import PostChatSurveyDigitalAssistantService from '../services/PostChatSurveyDigitalAssistantService'
import PostPCSPage from '../views/postChatSurvey/PostPCSPage'
import PrintUtils from '../utils/PrintUtils'

const automatonDA = {
    id: "survey-13000304",
    name: "HMRC_PostChat_Guidance-CUI"
};

const automatonWebchat = {
    id: "survey-13000303",
    name: "HMRC_PostChat_Transactional-CUI"
};

const timestamp = Date.now();

const webchatSurvey = {
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

const digitalAssistantSurvey = {
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
    constructor() {
        this.sdk = null;
        this.state = new ChatStates.NullState();
        this.minimised = false;
        this.ended = false;
        this.escalated = false;
    }

    getFeatureSwitch(switchName) {
      //Feature switches are held by the frontend, so call to the frontend to retrieve the state of each switch. Url is set by the frontend on page load.
      const http = new XMLHttpRequest();
      http.open("GET", window.featureSwitchUrl + "/" + switchName, false);
      http.send();

      return http.status === 204;
    }

    getTextAreaValue(textArea) {
        return document.getElementById(textArea).value;
    }

    getRadioId(radioGroup) {
        var elements = document.getElementsByName(radioGroup);

        for (var i = 0, l = elements.length; i < l; i++) {

            // @ts-ignore
            if (elements[i].checked) {
                return elements[i].id;
            }
        }
    }

    updateDav3DeskproRefererUrls() {
        let reportTechnicalIssueElement = document.getElementsByClassName('hmrc-report-technical-issue');

        if (reportTechnicalIssueElement.length) {
            if (reportTechnicalIssueElement[0].href) {
                let reportTechnicalIssueElementHref = reportTechnicalIssueElement[0].href;
                reportTechnicalIssueElement[0].href = reportTechnicalIssueElementHref.concat("-dav3");
            }
        }

        let feedbackLinkElement = document.getElementsByClassName('govuk-phase-banner__text');

        if (feedbackLinkElement.length) {
            let feedbackLinkHref = feedbackLinkElement[0].getElementsByTagName('a')[0].href;
            feedbackLinkElement[0].getElementsByTagName('a')[0].href = feedbackLinkHref.concat("-dav3");
        }

        let accessibilityLinkElement = document.getElementsByClassName('govuk-footer__link');

        if (accessibilityLinkElement.length) {
            let accessibilityLinkHref = accessibilityLinkElement[1].href;
            accessibilityLinkElement[1].href = accessibilityLinkHref.concat("-dav3");
        }
    }

    getRadioValue(radioGroup) {
        var elements = document.getElementsByName(radioGroup);
        var returnedValue = null;

        for (var i = 0, l = elements.length; i < l; i++) {
            if (elements[i].checked) {
                returnedValue = elements[i].value;
            }
        }

        if (!returnedValue) {
            returnedValue = "";
        }

        return returnedValue;
    }

    getSdk() {
        console.log("printing this.sdk.chatDisplayed",this.sdk.chatDisplayed)
        return this.sdk
    }

    _launchChat() {
        if (this.container) {
            return;
        }

        try {
            this._showChat();

            this._displayOpenerScripts();

            console.log("===== chatDisplayed =====");

            this.sdk.chatDisplayed({
                "customerName": "You",
                "previousMessagesCb": (resp) => this._moveToChatEngagedState(resp.messages),
                "disconnectCb": () => console.log("%%%%%% disconnected %%%%%%"),
                "reConnectCb": () => console.log("%%%%%% reconnected %%%%%%"),
                "failedCb": () => console.log("%%%%%% failed %%%%%%"),
                "openerScripts": null,
                "defaultAgentAlias": "HMRC"
            });

            this._removeAnimation();

            let dav3Skin = document.getElementById("ciapiSkin");

            if (dav3Skin) {
                this.updateDav3DeskproRefererUrls();
            }

            const existingErrorMessage = document.getElementById("error-message")

            if (existingErrorMessage) {
                existingErrorMessage.remove()
            }

        } catch (e) {
            console.error("!!!! launchChat got exception: ", e);
        }
    }

    _removeAnimation() {
        let loadingAnimation = document.getElementById("cui-loading-animation");
        let cuiContainer = document.getElementById("cui-messaging-container");

        if (loadingAnimation && cuiContainer) {
            loadingAnimation.style.display = 'none';
            cuiContainer.style.opacity = '1';
        }
    }

    _showChat() {
        const embeddedDiv = this._getEmbeddedDiv();
        const fixedPopupDiv = this._getFixedPopupDiv();
        const anchoredPopupDiv = this._getAnchoredPopupDiv();
        const webchatOnly = this._isWebchatOnly();
        try {
            if (fixedPopupDiv) {
                this.container = new ChatContainer(MessageClasses, PopupContainerHtml.ContainerHtml(webchatOnly), window.Inq.SDK);
                fixedPopupDiv.appendChild(this.container.element());
            } else if (anchoredPopupDiv && !fixedPopupDiv) {
              //This statement seems impossible (the two conditions are always either both true or both false), needs looking into
                this.container = new ChatContainer(MessageClasses, PopupContainerHtml.ContainerHtml(webchatOnly), window.Inq.SDK);
                anchoredPopupDiv.appendChild(this.container.element());
            } else if (embeddedDiv) {
                this.container = new ChatContainer(MessageClasses, EmbeddedContainerHtml.ContainerHtml(webchatOnly), window.Inq.SDK);
                embeddedDiv.appendChild(this.container.element());
            } else {
                this.container = new ChatContainer(MessageClasses, PopupContainerHtml.ContainerHtml(webchatOnly), window.Inq.SDK);
                document.getElementsByTagName("body")[0].appendChild(this.container.element());
            }

            this.container.setEventHandler(this);

            this._moveToChatShownState();
        } catch (e) {
            console.error("!!!! _showChat got exception: ", e);
        }
    }

    _displayOpenerScripts() {
        this.sdk = window.Inq.SDK;

        this.sdk.getOpenerScripts((openerScripts) => {
            if (openerScripts == null)
                return;

            for (var openerScript of openerScripts) {
                this.container.getTranscript().addOpenerScript(openerScript);
            }
        });
    }

    _moveToChatEngagedState(previousMessages = []) {
        this._moveToState(new ChatStates.EngagedState(
            this.sdk,
            this.container,
            previousMessages,
            () => this.container.confirmEndChat()));
    }

    _moveToState(state) {
        this.state = state;
    }

    _getEmbeddedDiv() {
        let baseDiv = document.getElementById("nuanMessagingFrame");
        let webchatOnlyDiv = document.getElementById("nuanMessagingFrame-webchat");
        if (baseDiv) {
            return baseDiv
        } else {
            return webchatOnlyDiv
        }
    }

    _getFixedPopupDiv() {
        let baseDiv = document.getElementById("tc-nuance-chat-container");
        let webchatOnlyDiv = document.getElementById("tc-nuance-chat-container-webchat");
        if (baseDiv) {
            return baseDiv
        } else {
            return webchatOnlyDiv
        }
    }

    _getAnchoredPopupDiv() {
        let baseDiv = document.getElementById("tc-nuance-chat-container");
        let webchatOnlyDiv = document.getElementById("tc-nuance-chat-container-webchat");
        if (baseDiv) {
            return baseDiv
        } else {
            return webchatOnlyDiv
        }
    }

    _isWebchatOnly() {
        let embeddedWebchat = document.getElementById("nuanMessagingFrame-webchat");
        let popupWebchat = document.getElementById("tc-nuance-chat-container-webchat");

        return !!(embeddedWebchat || popupWebchat);
    }

    _moveToChatShownState() {
        this._moveToState(new ChatStates.ShownState(
            (text) => this._engageChat(text),
            () => this.closeChat()));
        this.minimised = false;
    }

    _engageChat(text) {
        this.sdk.engageChat(text, (resp) => {
            console.log("++++ ENGAGED ++++ ->", resp);
            if (resp.httpStatus == 200) {
                this._moveToChatEngagedState();
            }
        });
    }

    closeChat() {
        if (document.body.contains(document.getElementById("postChatSurveyWrapper"))) {
            if (this.state.escalated) {
                this._sendPostChatSurveyWebchat(this.sdk).closePostChatSurvey(automatonWebchat, timestamp);
            } else {
                this._sendPostChatSurveyDigitalAssistant(this.sdk).closePostChatSurvey(automatonDA, timestamp);
            }
        }

        if(this.ended){
            this.container.destroy();
            this.container = null;
            this._moveToChatNullState();
        } else {
            this.showEndChatPage(false);
            this.ended = 'true'
        }
    }

    onPrint(e) {
        e.preventDefault;
        document.getElementById("print-date").innerHTML = PrintUtils.getPrintDate();

        const elementList = [
            "app-related-items",
            "govuk-back-link",
            "govuk-phase-banner",
            "hmrc-report-technical-issue",
            "govuk-footer",
            "govuk-heading-xl",
            "hmrc-user-research-banner",
            "cbanner-govuk-cookie-banner"
        ];

        const printList = [
        "govuk-grid-row",
        "govuk-grid-column-two-thirds",
        "govuk-main-wrapper"
        ];

        PrintUtils.removeElementsForPrint(elementList);

        if (document.getElementById("nuanMessagingFrame").classList.contains("ci-api-popup")) {
            document.body.querySelectorAll('*').forEach(function(node) {
                printList.forEach(function(item) {
                    if (node.classList.contains(item)) {
                        node.classList.add("govuk-!-display-none-print");
                    }
                });
            });
        }

        window.print();

        return false;
    }

    _sendPostChatSurveyWebchat(sdk) {
        return new PostChatSurveyWebchatService(sdk);
    }

    _sendPostChatSurveyDigitalAssistant(sdk) {
        return new PostChatSurveyDigitalAssistantService(sdk);
    }

    onSkipToTopLink(e) {
        e.preventDefault();
        document.getElementById("skipToTopLink").focus();
    }

    closeNuanceChat() {
        if (this.sdk.isChatInProgress()) {
            this.sdk.closeChat();
        }
    }

    showEndChatPage(showThanks) {
        this.container._removeSkinHeadingElements();
        this.container.showPage(new PostPCSPage(showThanks));
        document.getElementById("heading_chat_ended").focus();
        this.closeNuanceChat();
    }

    _moveToChatNullState() {
        this._moveToState(new ChatStates.NullState());
    }

    nuanceFrameworkLoaded(w) {
        console.log("### framework loaded");
        this.sdk = w.Inq.SDK;
        if (this.sdk.isChatInProgress()) {
            console.log("************************************")
            console.log("******* chat is in progress ********")
            console.log("************************************")
        }
    }

    _moveToClosingState() {
        this._moveToState(new ChatStates.ClosingState(() => this.closeChat()))
    }

    onSend() {
        const text = this.container.currentInputText().trim();
        this.container.clearCurrentInputText();
        if (text !== "")
            this.state.onSend(text);
    }

    onCloseChat() {
        this.state.onClickedClose();
    }

    onHideChat() {
        if (!this.minimised) {
            this.container.minimise();
            this.sdk.sendActivityMessage("minimize");
            this.minimised = true;
        }
    }

    onRestoreChat() {
        if (this.minimised) {
            this.container.restore();
            this.sdk.sendActivityMessage("restore");
            this.minimised = false;
        }
    }

    onStartTyping() {
        this.sdk.sendActivityMessage("startTyping");
    }

    onStopTyping() {
        this.sdk.sendActivityMessage("stopTyping");
    }

    hasBeenSurveyed() {
        return document.cookie.includes("surveyed=true")
    }

    onConfirmEndChat() {
        this.closeNuanceChat();
        this.state.escalated = this.state.isEscalated();

        this._moveToClosingState();

        this.ended = 'true'

        if (this.hasBeenSurveyed()) {
            this.showEndChatPage(false);
        } else {
            if (this.state.escalated) {
                this._sendPostChatSurveyWebchat(this.sdk).beginPostChatSurvey(webchatSurvey, automatonWebchat, timestamp);
                this.container.showPage(new PostChatSurveyWebchat((page) => this.onPostChatSurveyWebchatSubmitted(page)));
            } else {
                this._sendPostChatSurveyDigitalAssistant(this.sdk).beginPostChatSurvey(digitalAssistantSurvey, automatonDA, timestamp);
                this.container.showPage(new PostChatSurveyDigitalAssistant((page) => this.onPostChatSurveyDigitalAssistantSubmitted(page)));
            }
            window.GOVUKFrontend.initAll();
        }

    }

    onPostChatSurveyWebchatSubmitted(surveyPage) {
        const answers = {
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

    onPostChatSurveyDigitalAssistantSubmitted(surveyPage) {
        const answers = {
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

    onSoundToggle(e) {
        let soundElement = document.getElementById("toggleSound");
        let isActive = soundElement.classList.contains("active");

        if (isActive) {
            soundElement.classList.remove("active");
            soundElement.classList.add("inactive");

            soundElement.innerHTML = "Turn notification sound on";
        } else {
            soundElement.classList.remove("inactive");
            soundElement.classList.add("active");

            soundElement.innerHTML = "Turn notification sound off";
        }
    }
};
