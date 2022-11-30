import Transcript from '../services/Transcript';
import EndChatPopup from '../views/EndChatPopup';
import sanitiseAndParseJsonData from './JsonUtils';

const nullEventHandler = {
    onSend: function () {},
    onCloseChat: function () {},
    onHideChat: function () {},
    onRestoreChat: function () {},
    onConfirmEndChat: function () {},
    onSoundToggle: function () {},
    onStartTyping: function () {},
    onStopTyping: function () {}
};

export default class ChatContainer {
    constructor(messageClasses, containerHtml, SDK) {
        this.container = document.createElement("div");
        this.container.id = "ciapiSkin";
        this.eventHandler = nullEventHandler;
        this.closeMethod = null;
        this.searchTimeout = null;
        this.SDK = SDK;

        this.container.insertAdjacentHTML("beforeend", containerHtml);
        this.content = this.container.querySelector("#ciapiSkinChatTranscript");
        this.custInput = this.container.querySelector("#custMsg");
        this.soundButton = this.container.querySelector(".sound-button");
        this._registerEventListeners();
        this.transcript = new Transcript(this.content, messageClasses);
        this.endChatPopup = new EndChatPopup(this.container.querySelector("#ciapiSkinContainer"), this);
    }

    stopTyping(eventHandler) {
        eventHandler.onStopTyping();
    }

    startTyping(eventHandler) {
        eventHandler.onStartTyping();
    }

    element() {
        return this.container;
    }

    contentElement() {
        return this.content;
    }

    currentInputText() {
        return this.custInput.value;
    }

    clearCurrentInputText() {
        this.custInput.value = "";
    }

    getTranscript() {
        return this.transcript;
    }

    destroy() {
        this.container.parentElement.removeChild(this.container);
    }

    minimise() {
        this.container.classList.add("minimised");
    }

    restore() {
        this.container.classList.remove("minimised");
    }

    isMixResponsiveLink(eventTarget) {
        return !!eventTarget.dataset.nuanceMessageData ||
            !!eventTarget.dataset.nuanceMessageText;
    }

    isMixExternalLink(eventTarget) {
        return eventTarget.dataset && eventTarget.dataset.nuanceDatapass;
    }

    processMixExternalLink(e) {
        const linkEl = e.target;
        const linkHref = linkEl.getAttribute("href");
        const nuanceDatapass = linkEl.dataset.nuanceDatapass;

        // Handle External Links
        if (linkHref != "#" && linkHref != "") {
            var ndepVaEventData = JSON.stringify({
                data: {
                    address: linkHref,
                },
                event: "linkClicked",
            });
            this.SDK.sendDataPass({ ndepVaEvent: ndepVaEventData });
        }

        // Handle Datapass
        if (!!nuanceDatapass) {
            const datapass = sanitiseAndParseJsonData(e.target.dataset.nuanceDatapass);
            this.SDK.sendDataPass(datapass);
        }
    }

    processMixResponsiveLink(e) {
        const linkEl = e.target;
        const linkHref = linkEl.getAttribute("href");
        const nuanceMessageData = linkEl.dataset.nuanceMessageData;
        const nuanceMessageText = linkEl.dataset.nuanceMessageText;

        // Prevent defaults
        if (linkHref == "#" || linkHref == "") e.preventDefault();

        // Handle Responsive Links
        if (!!nuanceMessageData) {
            const messageText = nuanceMessageText ? nuanceMessageText : linkEl.text;
            const messageData = sanitiseAndParseJsonData(nuanceMessageData);
            this.SDK.sendRichContentMessage(messageText, messageData);
        } else if (!!nuanceMessageText) {
            this.SDK.sendMessage(nuanceMessageText);
        }
    }

    processTranscriptEvent(e) {
        if(this.isMixExternalLink(e.target)) {
            this.processMixExternalLink(e);
        } else if (this.isMixResponsiveLink(e.target)) {
            console.log('in isMixResponsiveLink');
            this.processMixResponsiveLink(e);
        } else if (
            e.target.tagName.toLowerCase() === "a" &&
            !!e.target.dataset &&
            !!e.target.dataset.vtzJump
        ) {
            this.SDK.sendVALinkMessage(e, null, null, null);
            if (e.target.className != "dialog") {
                this._focusOnNextAutomatonMessage();
            } else {
                this.closeMethod = "Link";
            }
        }
    }

    setEventHandler(eventHandler) {
        this.eventHandler = eventHandler;
    }

    _registerEventListener(selector, handler) {
        const element = this.container.querySelector(selector);
        if (element) {
            element.addEventListener("click", handler);
        }
    }

    _registerKeypressEventListener(selector, handler) {
        const element = this.container.querySelector(selector);
        if (element) {
            element.addEventListener("keypress", handler);
        }
    }

    _registerKeyupEventListener(selector, handler) {
        const element = this.container.querySelector(selector);
        if (element) {
            element.addEventListener("keyup", handler);
        }
    }

    _registerEventListeners() {
        this._registerEventListener("#ciapiSkinSendButton", (e) => {
            this.eventHandler.onSend();
        });

        this._registerEventListener("#ciapiSkinCloseButton", (e) => {
            this.closeMethod = "Button";
            var ciapiSkinContainer = document.querySelector("#ciapiSkin");
            var endChatNonFocusable = ciapiSkinContainer.querySelectorAll('a[href], input, textarea, button:not([id="cancelEndChat"]):not([id="confirmEndChat"]');
            endChatNonFocusable.forEach(function (element) {
                element.tabIndex = -1;
            });

            document.getElementById("ciapiSkinChatTranscript").setAttribute("tabindex", -1);
            this.eventHandler.onCloseChat();
        });

        this._registerEventListener("#ciapiSkinHideButton", (e) => {
            this.eventHandler.onHideChat();
        });

        this._registerEventListener("#skipToBottomLink", (e) => {
            this.eventHandler.onSkipToTopLink(e);
        });

        this._registerEventListener("#ciapiSkinRestoreButton", (e) => {
            this.eventHandler.onRestoreChat();
        });

        this._registerKeypressEventListener("#custMsg", (e) => {
            if (e.which == 13) {
                this.eventHandler.onSend();
                e.preventDefault();
            } else {
                this.startTyping(this.eventHandler);
            }
        });

        this._registerKeyupEventListener("#custMsg", (e) => {
            if (this.searchTimeout != undefined) {
                clearTimeout(this.searchTimeout);
            }
            this.searchTimeout = setTimeout(this.stopTyping, 3000, this.eventHandler);
        });

        this._registerEventListener("#ciapiSkinChatTranscript", (e) => {
            this.processTranscriptEvent(e);
        });

        this._registerEventListener("#printButton", (e) => {
            this.eventHandler.onPrint(e);
            e.preventDefault();
        });

        this._registerEventListener("#toggleSound", (e) => {
            this.eventHandler.onSoundToggle();
            e.preventDefault();
        });
    }

    confirmEndChat() {
        this.endChatPopup.show();
        document.getElementById("endChatPopup").focus();
    }

    onCancelEndChat() {
        var ciapiSkinContainer = document.querySelector("#ciapiSkin");
        var endChatNonFocusable = ciapiSkinContainer.querySelectorAll('a[href], input, textarea, button');
        endChatNonFocusable.forEach(function (element) {
            element.removeAttribute("tabindex");
        });

        document.getElementById("ciapiSkinChatTranscript").setAttribute("tabindex", 0);
        this.endChatPopup.hide();

        var endChatGiveFeedback = Array.from(
            document.querySelectorAll('.dialog')
          ).pop();

        if(this.closeMethod === "Button") {
            document.getElementById("ciapiSkinCloseButton").focus();
        } else {
            endChatGiveFeedback.focus();
        }
    }

    _removeSkinHeadingElements() {
        if (document.contains(document.getElementById("print")) && document.contains(document.getElementById("sound"))) {
            document.getElementById("print").remove();
            document.getElementById("sound").remove();

            let transcriptHeading = document.getElementById("ciapiSkinHeader");

            transcriptHeading.style.height = "auto";
            transcriptHeading.style.width = "auto";
        }
    }

    _focusOnNextAutomatonMessage() {
        setTimeout(function(e) {
            var lastAgentMessage = Array.from(
                document.querySelectorAll('.ciapi-agent-message')
              ).pop();
    
            lastAgentMessage.focus();
        }, 1000);
    }

    onConfirmEndChat() {
        this.endChatPopup.hide();
        this.eventHandler.onConfirmEndChat();
        document.getElementById("legend_give_feedback").focus();
        this._removeSkinHeadingElements();
    }

    showPage(page) {
        this.container.querySelector("#ciapiSkinChatTranscript").style.display = "none";
        this.container.querySelector("#ciapiSkinFooter").style.display = "none";
        page.attachTo(this.container.querySelector("#ciapiChatComponents"));
    }
}

