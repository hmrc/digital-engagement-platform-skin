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
        this.type = '';
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
        logger.debug("printing this.sdk.chatDisplayed",this.sdk.chatDisplayed)
        return this.sdk
    }

    _launchChat(obj) {
        if (this.container) {
            return;
        }
        try{
            this.type = obj.type
            this._showChat();
            if (obj.state === 'missed') {
                let msg = messages.unavilable
                this.container.getTranscript().addSystemMsg({msg: msg}, Date.now());
                document.getElementById('ciapiSkinFooter').style.display = 'none'
            } else {
                    this._displayOpenerScripts();
        
                    this.sdk.chatDisplayed({
                        "customerName": "You",
                        "previousMessagesCb": (resp) => this._moveToChatEngagedState(resp.messages),
                        "disconnectCb": () => logger.info("%%%%%% disconnected %%%%%%"),
                        "reConnectCb": () => logger.info("%%%%%% reconnected %%%%%%"),
                        "failedCb": () => logger.info("%%%%%% failed %%%%%%"),
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
            }
        } catch (e) {
            logger.error("!!!! launchChat got exception: ", e);
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
        const popupDiv = this._getPopupDiv();
        const webchatOnly = this._isWebchatOnly();

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
        } catch (e) {
            logger.error("!!!! _showChat got exception: ", e);
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
        return baseDiv
    }

    _getPopupDiv() {
        let baseDiv = document.getElementById("tc-nuance-chat-container");
        return baseDiv
    }

    _isWebchatOnly() {
        let webchatOnlyElement = document.getElementsByClassName("webchat-only");

        return webchatOnlyElement.length > 0
    }

    _moveToChatShownState() {
        this._moveToState(new ChatStates.ShownState(
            (text) => this._engageChat(text),
            () => this.closeChat()));
        this.minimised = false;
    }

    _engageChat(text) {
        this.sdk.engageChat(text, (resp) => {
            logger.debug("++++ ENGAGED ++++ ->", resp);
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
            if(this.sdk && this.type != 'proactive'){
                window.Inq.reinitChat();
            }
        } else {
            this.ended = 'true'
            this.showEndChatPage(false);
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
        if(this.sdk) {
            if (this.sdk.isChatInProgress()) {
                this.sdk.closeChat();
            }
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
        logger.info("### framework loaded");
        this.sdk = w.Inq.SDK;
        if (this.sdk.isChatInProgress()) {
            document.getElementById("error-message").setAttribute("class", "chat-in-progress");
            logger.info("************************************")
            logger.info("******* chat is in progress ********")
            logger.info("************************************")
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
        const popupChatContainer = document.getElementsByClassName("ci-api-popup");
        this.state.onClickedClose();
        if (popupChatContainer.length > 0) {
            this.onShowHamburger();
        }
    }

    onHideChat() {
        if (!this.minimised) {
            this.container.minimise();
            if(this.sdk) {
                this.sdk.sendActivityMessage("minimize");
            }
            this.minimised = true;
        }
    }

    onRestoreChat() {
        if (this.minimised) {
            this.container.restore();
            if(this.sdk) {
                this.sdk.sendActivityMessage("restore");
            }
            this.minimised = false;
            try{
                document.getElementById("ciapiSkinHideButton").focus();
            } catch {
                console.log('DEBUG: ' + 'Element not found' )
            }
        }
    }

    onShowHamburger() {
        let x = document.getElementById("hamburgerMenu").getAttribute("aria-expanded");
        if (x == "true") {
            x = "false"
        } else {
            x = "true"
        }
        document.getElementById("hamburgerMenu").setAttribute("aria-expanded", x);
        document.getElementById("hamburgerList").classList.toggle("show");
    }

    onAccessibilityStatement() {
        let url = new URL(window.location.href).pathname.replaceAll("/", "%2F");
        window.open("https://www.tax.service.gov.uk/accessibility-statement/digital-engagement-platform-frontend?referrerUrl=" + url + "-skin-hmrc", "_blank");
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
        }

    }

    onPostChatSurveyWebchatSubmitted(surveyPage) {
        let surveySkipped = sessionStorage.getItem("surveySkipped");

        if(surveySkipped != "true") {
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

        if(answers.answers[0].text != "" && answers.answers[1].text != "" && answers.answers[2].text != "" && answers.answers[4].text != "") {
            document.cookie = "surveyed=true";
            if(document.getElementById('errorSummary')) {
                document.getElementById('errorSummary').style.display = 'none'
            }
            var surveyWithAnswers = Object.assign(answers, webchatSurvey);
            this._sendPostChatSurveyWebchat(this.sdk).submitPostChatSurvey(surveyWithAnswers, automatonWebchat, timestamp);
            this.showEndChatPage(true);
            surveyPage.detach();
        } else {
            const errors = this.errorList(answers)

            errors.then((resolve) => {
              if(resolve.Q1 == false) {
                  document.getElementById("errorQ1a").focus();
              } else if(resolve.Q1 == true && resolve.Q2 == false) {
                  document.getElementById("errorQ2a").focus();
              } else if(resolve.Q1 == true && resolve.Q2 == true && resolve.Q3 == false) {
                  document.getElementById("errorQ3a").focus();
              } else if(resolve.Q1 == true && resolve.Q2 == true && resolve.Q3 == true && resolve.Q5 == false ) {
                  document.getElementById("errorQ5a").focus();
              }
            }).catch((err) => {
              logger.error("!!!! Survey Error list got exception: ", err);
            });
        }
        
    } else {
        sessionStorage.removeItem("surveySkipped");
        document.cookie = "surveyed=true";
        this._sendPostChatSurveyDigitalAssistant(this.sdk).closePostChatSurvey(automatonWebchat, timestamp);
        this.showEndChatPage(false);
        surveyPage.detach();

    }
    }

    onPostChatSurveyDigitalAssistantSubmitted(surveyPage) {

        let surveySkipped = sessionStorage.getItem("surveySkipped");
        if(surveySkipped != "true") {
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

            if(answers.answers[0].text != "" && answers.answers[1].text != "" && answers.answers[2].text != "" && answers.answers[4].text != "") {
                document.cookie = "surveyed=true";
                if(document.getElementById('errorSummary')) {
                    document.getElementById('errorSummary').style.display = 'none'
                }
                var surveyWithAnswers = Object.assign(answers, digitalAssistantSurvey);
                this._sendPostChatSurveyDigitalAssistant(this.sdk).submitPostChatSurvey(surveyWithAnswers, automatonDA, timestamp);
                this.showEndChatPage(true);
                surveyPage.detach();
            } else {

                const errors = this.errorList(answers)

                  errors.then((resolve) => {
                    if(resolve.Q1 == false) {
                        document.getElementById("errorQ1a").focus();
                    } else if(resolve.Q1 == true && resolve.Q2 == false) {
                        document.getElementById("errorQ2a").focus();
                    } else if(resolve.Q1 == true && resolve.Q2 == true && resolve.Q3 == false) {
                        document.getElementById("errorQ3a").focus();
                    } else if(resolve.Q1 == true && resolve.Q2 == true && resolve.Q3 == true && resolve.Q5 == false ) {
                        document.getElementById("errorQ5a").focus();
                    }
                  }).catch((err) => {
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

    errorList(answers) {
        return new Promise((resolve) => {
            let questionCompleted = {
                "Q1": false,
                "Q2": false,
                "Q3": false,
                "Q5": false
            }

            if(answers.answers[0].text == ""){
                document.getElementById('errorSummary').style.display = 'block'
                document.getElementById('errorQ1').style.display = 'block'
                document.getElementById('needed-error').style.display = 'block'
                document.getElementById('q1FormGroup').classList.add('govuk-form-group--error')
            } else {
                questionCompleted.Q1 = true
                document.getElementById('errorQ1').style.display = 'none'
                document.getElementById('needed-error').style.display = 'none'
                document.getElementById('q1FormGroup').classList.remove('govuk-form-group--error')
            }

            if(answers.answers[1].text == ""){
                document.getElementById('errorSummary').style.display = 'block'
                document.getElementById('errorQ2').style.display = 'block'
                document.getElementById('easy-error').style.display = 'block'
                document.getElementById('q2FormGroup').classList.add('govuk-form-group--error')
            } else {
                questionCompleted.Q2 = true
                document.getElementById('errorQ2').style.display = 'none'
                document.getElementById('easy-error').style.display = 'none'
                document.getElementById('q2FormGroup').classList.remove('govuk-form-group--error')
            }

            if(answers.answers[2].text == ""){
                document.getElementById('errorSummary').style.display = 'block'
                document.getElementById('errorQ3').style.display = 'block'
                document.getElementById('service-error').style.display = 'block'
                document.getElementById('q3FormGroup').classList.add('govuk-form-group--error')
            } else {
                questionCompleted.Q3 = true
                document.getElementById('errorQ3').style.display = 'none'
                document.getElementById('service-error').style.display = 'none'
                document.getElementById('q3FormGroup').classList.remove('govuk-form-group--error')
            }

            if((answers.answers[4].text == "") || (answers.answers[4].text == "Other" && answers.answers[5].text == "")){
                document.getElementById('errorSummary').style.display = 'block'
                document.getElementById('errorQ5').style.display = 'block'
                document.getElementById('contact-error').style.display = 'block'
                document.getElementById('q5FormGroup').classList.add('govuk-form-group--error')
            } else {
                questionCompleted.Q5 = true
                document.getElementById('errorQ5').style.display = 'none'
                document.getElementById('contact-error').style.display = 'none'
                document.getElementById('q5FormGroup').classList.remove('govuk-form-group--error')
            }
            resolve(questionCompleted);
        })
    }

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

        sessionStorage.setItem("isActive", !isActive);

    }

    onSizeToggle(e) {
        let container = document.getElementById("ciapiSkinContainer");
        let isStandard = container.classList.contains("ciapiSkinContainerStandardSize");
        let sizeButton = document.getElementById('toggleSizeButton')

        if (isStandard) {
            container.classList.remove("ciapiSkinContainerStandardSize");
            container.classList.add("ciapiSkinContainerLargerSize");

            sizeButton.innerHTML = "Decrease chat size";
        } else {
            container.classList.remove("ciapiSkinContainerLargerSize");
            container.classList.add("ciapiSkinContainerStandardSize");

            sizeButton.innerHTML = "Increase chat size";
        }

        sessionStorage.setItem("isStandard", !isStandard);

    }
};
