import PostChatSurvey from '../views/postChatSurvey/PostChatSurvey'
import ChatContainer from '../utils/ChatContainer'
import * as MessageClasses from '../DefaultClasses'
import * as EmbeddedContainerHtml from '../views/embedded/EmbeddedContainerHtml'
import * as PopupContainerHtml from '../views/popup/PopupContainerHtml'
import * as ChatStates from '../services/ChatStates'
import PostChatSurveyService from '../services/PostChatSurveyService'
import PostPCSPage from '../views/postChatSurvey/PostPCSPage'

const automaton = {
    id: "survey-13000303",
    name: "HMRC_PostChat_Transactional-CUI"
};

const timestamp = Date.now();

const survey = {
    id: "13000303",
    questions: [
        { id: ["question1"], text: "Was the chatbot useful?", freeform: false },
        { id: ["question2"], text: "Was the chatbot your first contact choice?", freeform: false },
        { id: ["question3"], text: "If you had not used chatbot today, how else would you have contacted us?", freeform: false }
    ]
};

function getRadioValue(radioGroup) {
    var elements = document.getElementsByName(radioGroup);

    for (var i = 0, l = elements.length; i < l; i++) {
        if (elements[i].checked) {
            return elements[i].value;
        }
    }
}

function getRadioId(radioGroup) {
    var elements = document.getElementsByName(radioGroup);

    for (var i = 0, l = elements.length; i < l; i++) {
        // @ts-ignore
        if (elements[i].checked) {
            return elements[i].id;
        }
    }
}

export default class CommonChatController {
    constructor() {
        this.sdk = null;
        this.state = new ChatStates.NullState();
        this.minimised = false;
    }

    _launchChat() {
        // TODO: Do we need this any more, now that the above timeout is gone?
        if (this.container) {
            console.error("This should never happen. If it doesn't, then remove this 'if'")
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
        } catch (e) {
            console.error("!!!! launchChat got exception: ", e);
        }
    }

    _showChat() {
        const embeddedDiv = this._getEmbeddedDiv();
        const fixedPopupDiv = this._getFixedPopupDiv();
        const anchoredPopupDiv = this._getAnchoredPopupDiv();
        try {
            if (embeddedDiv) {
                this.container = new ChatContainer(MessageClasses, EmbeddedContainerHtml.ContainerHtml);
                embeddedDiv.appendChild(this.container.element());
            }
            else if (fixedPopupDiv) {
                this.container = new ChatContainer(MessageClasses, PopupContainerHtml.ContainerHtml);
                fixedPopupDiv.appendChild(this.container.element());
            }
            else if (anchoredPopupDiv && !fixedPopupDiv) {
                this.container = new ChatContainer(MessageClasses, PopupContainerHtml.ContainerHtml);
                anchoredPopupDiv.appendChild(this.container.element());
            }
            else {
                this.container = new ChatContainer(MessageClasses, PopupContainerHtml.ContainerHtml);
                document.getElementsByTagName("body")[0].appendChild(this.container.element());
            }

            this.container.setEventHandler(this);

            this._moveToChatShownState();
        }
        catch (e) {
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
        return document.getElementById("nuanMessagingFrame")
    }

    _getFixedPopupDiv() {
        return document.getElementById("HMRC_CIAPI_Fixed_1")
    }

    _getAnchoredPopupDiv() {
        return document.getElementById("HMRC_CIAPI_Anchored_1")
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
            this._sendPostChatSurvey(this.sdk).closePostChatSurvey(automaton, timestamp);
        }

        this.closeNuanceChat();

        if (this._getEmbeddedDiv()) {
            // Embedded view never dies.
            this.showEndChatPage(false);
        } else {
            this.container.destroy();
            this.container = null;
        }

        this._moveToChatNullState();
    }

    // End event handler method
    _sendPostChatSurvey(sdk) {
        return new PostChatSurveyService(sdk);
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
        const text = this.container.currentInputText().trim()
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

    onClickedVALink(e) {
        this.state.onClickedVALink(e);
    }

    onConfirmEndChat() {
        this._moveToClosingState();
        this._sendPostChatSurvey(this.sdk).beginPostChatSurvey(survey, automaton, timestamp);
        this.container.showPage(new PostChatSurvey((page) => this.onPostChatSurveySubmitted(page)));
    }

    onPostChatSurveySubmitted(surveyPage) {
        const answers = {
            answers: [
                { id: getRadioId("q1-"), text: getRadioValue("q1-"), freeform: false },
                { id: getRadioId("q2-"), text: getRadioValue("q2-"), freeform: false },
                { id: getRadioId("q3-"), text: getRadioValue("q3-"), freeform: false }
            ]
        };

        var surveyWithAnswers = Object.assign(answers, survey);

        this._sendPostChatSurvey(this.sdk).submitPostChatSurvey(surveyWithAnswers, automaton, timestamp);
        surveyPage.detach();
        this.showEndChatPage(true);
    }

};