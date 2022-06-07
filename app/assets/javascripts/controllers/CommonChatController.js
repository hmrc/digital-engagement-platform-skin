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
        { id: ["question3"], text: "Overall, how did you feel about the service you accessed today?", freeform: false },
        { id: ["question4"], text: "Why did you give these scores?", freeform: true },
        { id: ["question5"], text: "If you had not used webchat today, how else would you have contacted us?", freeform: false },
        { id: ["question6"], text: "Provide other contact option", freeform: true }
    ]
};

const digitalAssistantSurvey = {
    id: "13000304",
    questions: [
        { id: ["question1"], text: "Was the digital assistant useful?", freeform: false },
        { id: ["question2"], text: "How could we improve it?", freeform: false },
        { id: ["question3"], text: "If you had not used the digital assistant, how else would you have contacted us?", freeform: false },
        { id: ["question4"], text: "Provide other contact options", freeform: false }
    ]
}

export default class CommonChatController {
    constructor() {
        this.sdk = null;
        this.state = new ChatStates.NullState();
        this.minimised = false;
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
        if(reportTechnicalIssueElement) {
            if(reportTechnicalIssueElement[0].href) {
                let reportTechnicalIssueElementHref = reportTechnicalIssueElement[0].href;
                reportTechnicalIssueElement[0].href = reportTechnicalIssueElementHref.concat("-dav3");
            }
        }
    
        let feedbackLinkElement = document.getElementsByClassName('govuk-phase-banner__text');
        if(feedbackLinkElement) {
            let feedbackLinkHref = feedbackLinkElement[0].getElementsByTagName('a')[0].href;
            feedbackLinkElement[0].getElementsByTagName('a')[0].href = feedbackLinkHref.concat("-dav3");
        }

        let accessibilityLinkElement = document.getElementsByClassName('govuk-footer__link');
        if(accessibilityLinkElement) {
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

    _launchChat() {
        // TODO: Do we need this any more, now that the above timeout is gone?
        if (this.container) {
            console.log("This should never happen. If it doesn't, then remove this 'if'");
            return
        }
        try {
            //            console.log("in launchChat: ", this);
            this._showChat();

            this._displayOpenerScripts(window);

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

            if(dav3Skin) {
                this.updateDav3DeskproRefererUrls();
            }

            document.getElementById("error-message").remove();
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
        try {
            if (fixedPopupDiv) {
                this.container = new ChatContainer(MessageClasses, PopupContainerHtml.ContainerHtml);
                fixedPopupDiv.appendChild(this.container.element());
            } else if (anchoredPopupDiv && !fixedPopupDiv) {
                this.container = new ChatContainer(MessageClasses, PopupContainerHtml.ContainerHtml);
                anchoredPopupDiv.appendChild(this.container.element());
            } else if (embeddedDiv) {
                this.container = new ChatContainer(MessageClasses, EmbeddedContainerHtml.ContainerHtml);
                embeddedDiv.appendChild(this.container.element());
            } else {
                this.container = new ChatContainer(MessageClasses, PopupContainerHtml.ContainerHtml);
                document.getElementsByTagName("body")[0].appendChild(this.container.element());
            }

            this.container.setEventHandler(this);

            this._moveToChatShownState();
        } catch (e) {
            console.error("!!!! _showChat got exception: ", e);
        }
    }

    _displayOpenerScripts(w) {
        this.sdk = w.Inq.SDK;

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
        // Clean up previous state?
        this.state = state;
    }

    _getEmbeddedDiv() {
        return document.getElementById("nuanMessagingFrame");
    }

    _getFixedPopupDiv() {
        return document.getElementById("tc-nuance-chat-container");
    }

    _getAnchoredPopupDiv() {
        return document.getElementById("tc-nuance-chat-container");
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
            let escalated = this.state.isEscalated();

            if (escalated) {
                this._sendPostChatSurveyWebchat(this.sdk).closePostChatSurvey(automatonWebchat, timestamp);
            } else {
                this._sendPostChatSurveyDigitalAssistant(this.sdk).closePostChatSurvey(automatonDA, timestamp);
            }
        }

        if (this._getEmbeddedDiv()) {
            // Embedded view never dies.
            this.showEndChatPage(false);
        } else {
            this.container.destroy();
            this.container = null;
        }

        this._moveToChatNullState();
    }

    getPrintDate() {

        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const d = new Date();
        return d.getDate() + " " + monthNames[d.getMonth()] + " " + d.getUTCFullYear();

    }

    removeElementsForPrint(listOfElements) {
        listOfElements.forEach(function(item) {
            if (document.getElementsByClassName(item)[0]) {
                document.getElementsByClassName(item)[0].classList.add("govuk-!-display-none-print")
            }
        });
    }

    onPrint(e) {
        e.preventDefault;
        document.getElementById("print-date").innerHTML = this.getPrintDate();

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

        this.removeElementsForPrint(elementList);


        window.print();

        return false;
    }

    // End event handler method
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
                //            setTimeout(() => this._launchChat(), 2000);
        }
    }

    _moveToClosingState() {
        this._moveToState(new ChatStates.ClosingState(() => this.closeChat()))
    }

    // Begin event handler methods
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

    onConfirmEndChat() {
        this.closeNuanceChat();
        let escalated = this.state.isEscalated();

        this._moveToClosingState();

        if (escalated) {
            this._sendPostChatSurveyWebchat(this.sdk).beginPostChatSurvey(webchatSurvey, automatonWebchat, timestamp);
            this.container.showPage(new PostChatSurveyWebchat((page) => this.onPostChatSurveyWebchatSubmitted(page)));
        } else {
            this._sendPostChatSurveyDigitalAssistant(this.sdk).beginPostChatSurvey(digitalAssistantSurvey, automatonDA, timestamp);
            this.container.showPage(new PostChatSurveyDigitalAssistant((page) => this.onPostChatSurveyDigitalAssistantSubmitted(page)));
        }

        window.GOVUKFrontend.initAll();
    }

    onPostChatSurveyWebchatSubmitted(surveyPage) {
        const answers = {
            answers: [
                { id: this.getRadioId("q1-"), text: this.getRadioValue("q1-"), freeform: false },
                { id: this.getRadioId("q2-"), text: this.getRadioValue("q2-"), freeform: false },
                { id: this.getRadioId("q3-"), text: this.getRadioValue("q3-"), freeform: false },
                { id: "q4-", text: this.getTextAreaValue("q4-"), freeform: true },
                { id: this.getRadioId("q5-"), text: this.getRadioValue("q5-"), freeform: false },
                { id: "q6-", text: this.getTextAreaValue("q6-"), freeform: true }
            ]
        };

        var surveyWithAnswers = Object.assign(answers, webchatSurvey);

        this._sendPostChatSurveyWebchat(this.sdk).submitPostChatSurvey(surveyWithAnswers, automatonWebchat, timestamp);
        surveyPage.detach();
        this.showEndChatPage(true);
    }

    onPostChatSurveyDigitalAssistantSubmitted(surveyPage) {
        const answers = {
            answers: [
                { id: this.getRadioId("q1-"), text: this.getRadioValue("q1-"), freeform: false },
                { id: "q2-", text: this.getTextAreaValue("q2-"), freeform: true },
                { id: this.getRadioId("q3-"), text: this.getRadioValue("q3-"), freeform: false },
                { id: "q4-", text: this.getTextAreaValue("q4-"), freeform: true }
            ]
        };

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
