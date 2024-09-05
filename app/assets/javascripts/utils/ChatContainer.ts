import Transcript from '../services/Transcript';
import EndChatPopup from '../views/EndChatPopup';
import { sanitiseAndParseJsonData } from './JsonUtils';

interface nullEventHandlerInterface {
    onSend: () => void,
    onShowHamburger: () => void,
    onMsgClick: () => void,
    onAccessibilityStatement: () => void,
    onCloseChat: () => void,
    onHideChat: () => void,
    onRestoreChat: () => void,
    onConfirmEndChat: () => void,
    onMessageSentNotification: () => void,
    onSizeToggle: () => void,
    onSoundToggle: () => void,
    onStartTyping: () => void,
    onStopTyping: () => void,
    onSkipToTopLink: (e: Event) => void,
    onPrint: (e: Event) => void,
}

export const nullEventHandler: nullEventHandlerInterface = {
    onSend: function (): void { },
    onShowHamburger: function (): void { },
    onMsgClick: function (): void { },
    onAccessibilityStatement: function (): void { },
    onCloseChat: function (): void { },
    onHideChat: function (): void { },
    onRestoreChat: function (): void { },
    onConfirmEndChat: function (): void { },
    onMessageSentNotification: function (): void { },
    onSizeToggle: function (): void { },
    onSoundToggle: function (): void { },
    onStartTyping: function (): void { },
    onStopTyping: function (): void { },
    onSkipToTopLink: function (): void { },
    onPrint: function (): void { }
};

export default class ChatContainer {
    container: HTMLElement
    closeMethod: string | null
    stopTypingTimeoutId: number | NodeJS.Timeout | undefined
    isCustomerTyping: boolean;
    typingEventThresholdMillis: number;
    SDK: any;
    content: HTMLElement | null
    custInput: HTMLTextAreaElement | null
    soundButton: Element | null
    transcript: Transcript;
    endChatPopup: EndChatPopup;
    inputBoxFocus: boolean;
    endChatFeedback: boolean;
    eventHandler: nullEventHandlerInterface

    constructor(messageClasses: typeof import("../DefaultClasses"), containerHtml: string, SDK: any) {
        this.container = document.createElement("div");
        this.container.id = "ciapiSkin";
        this.eventHandler = nullEventHandler;
        this.closeMethod = null;

        this.stopTypingTimeoutId = undefined;
        this.isCustomerTyping = false;
        this.typingEventThresholdMillis = 3000;

        this.SDK = SDK;

        this.container.insertAdjacentHTML("beforeend", containerHtml);
        this.content = this.container.querySelector<HTMLElement>("#ciapiSkinChatTranscript");
        this.custInput = this.container.querySelector<HTMLTextAreaElement>("#custMsg");
        this.soundButton = this.container.querySelector<Element>(".sound-button")
        this._registerEventListeners();
        this.transcript = new Transcript(this.content, messageClasses);
        this.endChatPopup = new EndChatPopup(this.container.querySelector("#ciapiSkinContainer"), this);

        this.inputBoxFocus = false;
        this.endChatFeedback = false;
    }

    _resetStopTypingTimeout(): void {
        if (this.stopTypingTimeoutId != undefined) {
            clearTimeout(this.stopTypingTimeoutId);
        }

        this.stopTypingTimeoutId =
            setTimeout(this.stopTyping.bind(this), this.typingEventThresholdMillis, this.eventHandler);
    }

    stopTyping(eventHandler: nullEventHandlerInterface): void {
        this.isCustomerTyping = false;
        eventHandler.onStopTyping();
    }

    startTyping(eventHandler: nullEventHandlerInterface): void {
        this.isCustomerTyping = true;
        eventHandler.onStartTyping();
    }

    element(): HTMLElement {
        return this.container;
    }

    contentElement(): HTMLElement | null {
        return this.content;
    }

    currentInputText(): string | undefined {
        if (this.custInput) {
            return this.custInput.value;
        }
    }

    clearCurrentInputText(): void {
        if (this.custInput) {
            this.custInput.value = "";
        }
    }

    getTranscript(): Transcript {
        return this.transcript;
    }

    destroy(): void {
        if (this.container.parentElement) {
            this.container.parentElement.removeChild(this.container);
        }
    }

    minimise(): void {
        this.container.classList.add("minimised");
        try {
            document.getElementById("ciapiSkinRestoreButton")?.setAttribute("tabindex", '0');
        } catch {
            console.log('DEBUG: ' + 'Elements not found')
        }
    }

    restore(): void {
        this.container.classList.remove("minimised");
    }

    processExternalAndResponsiveLinks(e: any): null | void {
        const linkEl: any = e.target
        const linkHref: string | null | undefined = linkEl?.getAttribute("href");

        if (!linkHref) return null; // stop clicks on the container from triggering the following code

        const nuanceMessageData = linkEl.dataset.nuanceMessageData;
        const nuanceMessageText = linkEl.dataset.nuanceMessageText;
        const nuanceDatapass = linkEl.dataset.nuanceDatapass;

        // Prevent defaults
        if (linkHref == "#" || linkHref == "") e.preventDefault();

        // Handle Responsive Links
        if (!!nuanceMessageData) {
            const messageText = nuanceMessageText ? nuanceMessageText : linkEl.text;
            const messageData: {} | null = sanitiseAndParseJsonData(nuanceMessageData);
            if (messageData) {
                this.SDK.sendRichContentMessage(messageText, messageData);
            }
        } else if (!!nuanceMessageText) {
            this.SDK.sendMessage(nuanceMessageText);
        }

        // Handle External Links
        if (linkHref != "#" && linkHref != "") {
            var ndepVaEventData: string = JSON.stringify({
                data: {
                    address: linkHref,
                },
                event: "linkClicked",
            });
            this.SDK.sendDataPass({ ndepVaEvent: ndepVaEventData });
        }

        // Handle Datapass
        if (!!nuanceDatapass) {
            const datapass: {} | null = sanitiseAndParseJsonData(e.target.dataset.nuanceDatapass);
            if (datapass) {
                this.SDK.sendDataPass(datapass);
            }
        }

        this.disablePreviousWidgets(e);
    }

    processTranscriptEvent(e: any): void {
        this.processExternalAndResponsiveLinks(e);
        if (e.target) {
            const nuanceMessageText: string = JSON.stringify(e.target?.dataset.nuanceMessageText);
            if (
                e.target && e.target.tagName && e.target.tagName.toLowerCase() === "a" &&
                !!e.target.dataset
            ) {
                this.SDK.sendVALinkMessage(e, null, null, null);
                if (nuanceMessageText) {
                    if (nuanceMessageText === '"end this chat and give feedback"') {
                        this.endChatFeedback = true;
                        this.closeMethod = "Link";
                    } else if (nuanceMessageText === '"end this chat"') {
                        this.endChatFeedback = false;
                        this.closeMethod = "Link";
                    }
                } else if (e.target.className != "govuk-skip-link") {
                    this._focusOnNextAutomatonMessage();
                }
            }
        }
    }

    processKeypressEvent(e: KeyboardEvent): void {

        const custMsg = this.container.querySelector<HTMLTextAreaElement>('#custMsg');
        const sendButton = this.container.querySelector<HTMLButtonElement>('#ciapiSkinSendButton');
        const alphaNumericSpecial: RegExp = /\S/
        const enterKey: number = 13;

        if (alphaNumericSpecial.test(custMsg!.value) == true) {
            sendButton!.disabled = false;
            sendButton!.ariaDisabled = "false";
            if (e.which == enterKey) {
                this.eventHandler.onSend();
                e.preventDefault();
                this.inputBoxFocus = true;
            }
        } else {
            sendButton!.disabled = true;
            sendButton!.ariaDisabled = "true";
            if (e.which == enterKey) {
                e.preventDefault();
                this.inputBoxFocus = true;
            }
        }

        this._resetStopTypingTimeout();

        if (!this.isCustomerTyping) {
            this.startTyping(this.eventHandler);
        }

    }

    disablePreviousWidgets(e: any): void {
        // Disable quick-reply widgets
        try {
            if ((e.target).getAttribute('href') == "#") {
                let qrWidgets = document.querySelectorAll<any>(".quick-reply-widget");
                !!qrWidgets && qrWidgets.forEach(widget => widget.disable());
            }
        } catch {
            console.log('DEBUG: ' + 'Elements not found')
        }
    }

    setEventHandler(eventHandler: nullEventHandlerInterface): void {
        this.eventHandler = eventHandler;
    }

    _processCloseButtonEvent(_: Event): void {
        this.closeMethod = "Button";

        this.eventHandler.onCloseChat();
    }

    _registerKeypressEventListener(selector: string, handler: (e: KeyboardEvent) => void): void {
        const element = this.container.querySelector<HTMLTextAreaElement>(selector);
        if (element) {
            element.addEventListener("keyup", handler);
            element.addEventListener("keypress", handler);
        }
    }

    _registerEventListener(selector: string, handler: (e: Event) => void): void {
        const element = this.container.querySelector<HTMLElement>(selector);
        if (element) {
            element.addEventListener("click", handler);
        }
    }

    _registerEventListeners(): void {

        this._registerKeypressEventListener("#custMsg", (e: KeyboardEvent): void => {
            this.processKeypressEvent(e)
        });

        this._registerEventListener("#ciapiSkinSendButton", (_: Event): void => {
            this.eventHandler.onSend();
            this.eventHandler.onMessageSentNotification()
            this.inputBoxFocus = false;
        });

        this._registerEventListener("#hamburgerMenu", (_: Event): void => {
            this.eventHandler.onShowHamburger();
        });

        this._registerEventListener("#custMsg", (_: Event): void => {
            this.eventHandler.onMsgClick();
        });

        this._registerEventListener("#ciapiSkinCloseButton", (e: Event): void => {
            this._processCloseButtonEvent(e)
        });

        this._registerEventListener("#accessibility-statement-link", (_: Event): void => {
            this.eventHandler.onAccessibilityStatement()
        });

        this._registerEventListener("#ciapiSkinHideButton", (_: Event): void => {
            this.eventHandler.onHideChat();
        });

        this._registerEventListener("#skipToBottomLink", (e: Event): void => {
            this.eventHandler.onSkipToTopLink(e);
        });

        this._registerEventListener("#ciapiSkinRestoreButton", (_: Event): void => {
            this.eventHandler.onRestoreChat();
        });

        this._registerEventListener("#ciapiSkinChatTranscript", (e: Event): void => {
            this.processTranscriptEvent(e);
        });

        this._registerEventListener("#printButton", (e: Event): void => {
            this.eventHandler.onPrint(e);
            e.preventDefault();
        });

        this._registerEventListener("#toggleSound", (e: Event): void => {
            this.eventHandler.onSoundToggle();
            e.preventDefault();
        });
        this._registerEventListener("#toggleSizeButton", (e: Event): void => {
            this.eventHandler.onSizeToggle();
            e.preventDefault();
        });
    }

    confirmEndChat(): void {
        if (this.closeMethod === null) {
            this.closeMethod = "Message"
        }

        let endChatNonFocusableContainer: NodeListOf<HTMLElement> = this.container.querySelectorAll<HTMLElement>('input, textarea, button:not([id="cancelEndChat"]):not([id="confirmEndChat"]):not([id="hamburgerMenu"]):not([id=ciapiSkinHideButton]), #ciapiSkinChatTranscript');

        endChatNonFocusableContainer.forEach(function (element: HTMLElement): void {
            element.tabIndex = -1;
        });

        const styleList: string[] = [
            "ciapiSkinCloseButton",
            "printButton",
            "toggleSound"
        ];

        styleList.forEach(function (item: string): void {
            document.getElementById(item)?.setAttribute("style", "display: none;");
        });

        let endChatNonFocusable: NodeListOf<HTMLElement> = document.querySelectorAll<HTMLElement>('a[href]:not([id="printLink"]), iframe, button:not([id="cancelEndChat"]):not([id="confirmEndChat"])');

        endChatNonFocusable.forEach(function (element: HTMLElement): void {
            element.tabIndex = -1;
        });

        this.endChatPopup.show();

        document.getElementById("endChatPopup")?.removeAttribute("style");
        document.getElementById("endChatPopup")?.focus();
    }

    onCancelEndChat(e: Event, toPrint: boolean | undefined): void {
        const ciapiSkinContainer = document.querySelector<HTMLElement>("#ciapiSkinContainer");
        const endChatNonFocusableContainer: NodeListOf<HTMLElement> | undefined = ciapiSkinContainer?.querySelectorAll<HTMLElement>('input, textarea');
        endChatNonFocusableContainer?.forEach(function (element: HTMLElement): void {
            element.removeAttribute("tabindex");
        });

        const endChatNonFocusable: NodeListOf<HTMLElement> = document.querySelectorAll<HTMLElement>('a[href], iframe, button');
        endChatNonFocusable.forEach(function (element: HTMLElement): void {
            element.removeAttribute("tabindex");
        });

        const styleList: string[] = [
            "ciapiSkinCloseButton",
            "printButton",
            "toggleSound"
        ];

        styleList.forEach(function (item: string): void {
            document.getElementById(item)?.setAttribute("style", "display: '';");
        });

        document.getElementById("endChatPopup")?.setAttribute("style", "display: none;");

        document.getElementById("ciapiSkinChatTranscript")?.setAttribute("tabindex", '0');
        this.endChatPopup.hide();

        const endChatGiveFeedback = Array.from(
            document.querySelectorAll<HTMLElement>('.dialog')
        ).pop();

        if (this.closeMethod === "Button") {
            const popupChatContainer: HTMLCollectionOf<Element> = document.getElementsByClassName("ci-api-popup");
            if (popupChatContainer.length > 0) {
                this.eventHandler.onShowHamburger();
            }
            document.getElementById("ciapiSkinCloseButton")?.focus();
        } else if (this.closeMethod === "Link") {
            const lastFeedbackMessage = Array.from(
                document.querySelectorAll<HTMLElement>('a[data-nuance-message-text = "end this chat and give feedback"]')
            ).pop();

            const lastEndChatMessage = Array.from(
                document.querySelectorAll<HTMLElement>('a[data-nuance-message-text = "end this chat"]')
            ).pop();

            if (this.endChatFeedback) {
                lastFeedbackMessage?.focus();
            } else {
                lastEndChatMessage?.focus();
            }
        } else if (this.closeMethod === "Message") {
            if (this.inputBoxFocus) {
                document.getElementById("custMsg")?.focus();
            } else {
                document.getElementById("ciapiSkinSendButton")?.focus();
            }
        } else {
            endChatGiveFeedback?.focus();
        }
        if (toPrint) {
            this.eventHandler.onPrint(e);
        }
        this.closeMethod = null
    }

    _removeSkinHeadingElements(): void {
        if (document.contains(document.getElementById("print")) && document.contains(document.getElementById("sound"))) {
            document.getElementById("print")?.remove();
            document.getElementById("sound")?.remove();

            try {
                document.getElementById("ciapiSkinHideButton")?.setAttribute("tabindex", '0');
                document.getElementById("ciapiSkinCloseButton")?.setAttribute("tabindex", '0');
                document.getElementById("accessibility-statement-link")?.setAttribute("tabindex", '0');
            } catch {
                console.log('DEBUG: ' + 'Elements not found')
            }

            let transcriptHeading: HTMLElement | null = document.getElementById("ciapiSkinHeader");

            if (transcriptHeading) {
                transcriptHeading.style.height = "auto";
                transcriptHeading.style.width = "auto";
            }
        }
    }

    _focusOnNextAutomatonMessage(): void {
        setTimeout(function (): void {
            var lastAgentMessage = Array.from(
                document.querySelectorAll<HTMLElement>('.ciapi-agent-message')
            ).pop();
            lastAgentMessage?.focus();
        }, 1000);
    }

    onConfirmEndChat(): void {
        this.endChatPopup.hide();
        this.eventHandler.onConfirmEndChat();
        this._removeSkinHeadingElements();

        const endChatNonFocusable: NodeListOf<HTMLElement> = document.querySelectorAll<HTMLElement>('a[href], iframe, button');
        endChatNonFocusable.forEach(function (element: HTMLElement): void {
            element.removeAttribute("tabindex");
        });

        document.getElementById("endChatPopup")?.setAttribute("style", "display: none;");

        if ((document.getElementById("legend_give_feedback") != null || document.getElementById("legend_give_feedback") != undefined)) {
            document.getElementById("legend_give_feedback")?.focus();
        }
    }

    showPage(page: any) {
        const ciapiSkinChatTranscript = this.container.querySelector<HTMLElement>("#ciapiSkinChatTranscript")
        if (ciapiSkinChatTranscript) {
            ciapiSkinChatTranscript.style.display = "none";
        }
        const ciapiSkinFooter = this.container.querySelector<HTMLElement>("#ciapiSkinFooter")
        if (ciapiSkinFooter) {
            ciapiSkinFooter.style.display = "none";
        }
        page.attachTo(this.container.querySelector<HTMLElement>("#ciapiChatComponents"));
    }
}