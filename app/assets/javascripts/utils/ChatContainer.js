import Transcript from '../services/Transcript'
import EndChatPopup from '../views/EndChatPopup'

const nullEventHandler = {
    onSend: function () { },
    onCloseChat: function () { },
    onHideChat: function () { },
    onRestoreChat: function () { },
    onClickedVALink: function (e) { },
    onConfirmEndChat: function () { },
};

export default class ChatContainer {
    constructor(messageClasses, containerHtml) {
        this.container = document.createElement("div")
        this.container.id = "ciapiSkin";
        this.eventHandler = nullEventHandler;

        this.container.insertAdjacentHTML("beforeend", containerHtml);
        this.content = this.container.querySelector("#ciapiSkinChatTranscript");
        this.custInput = this.container.querySelector("#custMsg");
        this.transcript = new Transcript(this.content, (e) => this.eventHandler.onClickedVALink(e), messageClasses);
        this._registerEventListeners();
        this.endChatPopup = new EndChatPopup(this.container.querySelector("#ciapiSkinContainer"), this);
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

    setEventHandler(eventHandler) {
        this.eventHandler = eventHandler;
    }

    _registerEventListener(selector, handler) {
        const element = this.container.querySelector(selector);
        if (element) {
            element.addEventListener("click", handler);
        }
    }

    _registerEventListeners() {

        this._registerEventListener("#ciapiSkinSendButton", (e) => {
            this.eventHandler.onSend();
        });

        this._registerEventListener("#ciapiSkinCloseButton", (e) => {
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

        this.custInput.addEventListener('keypress', (e) => {
            if (e.which == 13) {
                this.eventHandler.onSend();
                e.preventDefault()
            }
        });

       this._registerEventListener("#ciapiSkinChatTranscript", (e) => {
            if ((e.target.tagName.toLowerCase() === 'a') && !!e.target.dataset && !!e.target.dataset.vtzJump) {
                Inq.SDK.sendVALinkMessage(e, null, null, null);
            }
        });

        this._registerEventListener("#printButton", (e) => {
                    this.eventHandler.onPrint();
                     e.preventDefault()
                });
                window.addEventListener('beforeprint', (e) => {
                      this.eventHandler.beforePrintCall();
                       e.preventDefault()

                    });
                    window.addEventListener('afterprint', (e) => {
                           this.eventHandler.afterPrintCall();

                        });
    }

    confirmEndChat() {
        this.endChatPopup.show();
        document.getElementById("heading_end_chat_popup").focus();

    }

    onCancelEndChat() {

        var ciapiSkinContainer = document.querySelector("#ciapiSkin");
        var endChatNonFocusable = ciapiSkinContainer.querySelectorAll('a[href], input, textarea, button');
        endChatNonFocusable.forEach(function (element) {
            element.removeAttribute("tabindex");
        });

        document.getElementById("ciapiSkinChatTranscript").setAttribute("tabindex", 0);
        this.endChatPopup.hide();

        document.getElementById("ciapiSkinCloseButton").focus();
    }

    onConfirmEndChat() {
        this.endChatPopup.hide();
        this.eventHandler.onConfirmEndChat();
        document.getElementById("legend_give_feedback").focus();
    }

    showPage(page) {
        this.container.querySelector("#ciapiSkinChatTranscript").style.display = "none";
        this.container.querySelector("#ciapiSkinFooter").style.display = "none";
        page.attachTo(this.container.querySelector("#ciapiChatComponents"))
    }
}
