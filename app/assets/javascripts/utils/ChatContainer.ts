import Transcript from '../services/Transcript';
import EndChatPopup from '../views/EndChatPopup';
import { sanitiseAndParseJsonData } from './JsonUtils';

interface nullEventHandlerInterface {
    onSend: () => void,
    onShowHamburger: () => void,
    onAccessibilityStatement: () => void,
    onCloseChat: () => void,
    onHideChat: () => void,
    onRestoreChat: () => void,
    // should the below be included in the interface? It is present in EndChatPopup and without it being in here, it throws an error
    // onCancelEndChat: (e: Event, toPrint: boolean | undefined) => void,
    onConfirmEndChat: () => void,
    onSizeToggle: () => void,
    onSoundToggle: () => void,
    onStartTyping: () => void,
    onStopTyping: () => void,
    onSkipToTopLink: (e: Event) => void,
    onPrint: (e: Event) => void,
}

export const nullEventHandler: nullEventHandlerInterface = {
    onSend: function (): void {},
    onShowHamburger: function (): void {},
    onAccessibilityStatement: function (): void {},
    onCloseChat: function (): void {},
    onHideChat: function (): void {},
    onRestoreChat: function (): void {},
    // should this be added to the nullEventHandler?
    // onCancelEndChat: function (e: Event, toPrint: boolean | undefined): void {},
    onConfirmEndChat: function (): void {},
    onSizeToggle: function (): void {},
    onSoundToggle: function (): void {},
    onStartTyping: function (): void {},
    onStopTyping: function (): void {},
    onSkipToTopLink: function (): void {},
    onPrint: function (): void {}
};

export default class ChatContainer {
    container: HTMLElement
    closeMethod: string | null
    stopTypingTimeoutId: number | NodeJS.Timeout | undefined
    // I think we only need NodeJS.Timeout if it runs in a node environment which I think this is just browser so we can remove it?
    isCustomerTyping: boolean;
    typingEventThresholdMillis: number;
    SDK: any;
    // Should I leave this as any? I am unsure how to type the SDK.
    content: HTMLElement | null
    custInput: HTMLTextAreaElement | null
    soundButton: any;
    // soundButton comment below on soundButton will determine the answer to this one.
    transcript: Transcript;
    endChatPopup: EndChatPopup;
    inputBoxFocus: boolean;
    endChatFeedback: boolean;
    eventHandler: nullEventHandlerInterface

    constructor(messageClasses: typeof import("../DefaultClasses"), containerHtml: string, SDK: any) {
// the typeof import was inferred, are you in agreement that this is correct?
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
        this.soundButton = this.container.querySelector(".sound-button")
        // soundButton is probably going to be a HTMLElement but I cannot find it being used in the code base under 'sound-button'. However, we do use the variable soundButton. Should I leave it for the moment?
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
        if(this.custInput){
            return this.custInput.value;
        }
    }

    clearCurrentInputText(): void {
        if(this.custInput){
            this.custInput.value = "";
        }
    }

    getTranscript(): Transcript {
        return this.transcript;
    }

    destroy(): void {
        if(this.container.parentElement){
            this.container.parentElement.removeChild(this.container);
        }
    }

    minimise(): void {
        this.container.classList.add("minimised");
        try {
            document.getElementById("ciapiSkinRestoreButton")?.setAttribute("tabindex", '0');
        } catch {
            console.log('DEBUG: ' + 'Elements not found' )
        }
    }

    restore(): void {
        this.container.classList.remove("minimised");
    }

    processExternalAndResponsiveLinks(e: any): null | void {
        const linkEl: any = e.target
        const linkHref: string | null | undefined = linkEl?.getAttribute("href");

        if(!linkHref) return null; // stop clicks on the container from triggering the following code

        const nuanceMessageData = linkEl.dataset.nuanceMessageData;
        const nuanceMessageText = linkEl.dataset.nuanceMessageText;
        const nuanceDatapass = linkEl.dataset.nuanceDatapass;
        // Tricky to type these until we know the above typing.

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
        // This one is difficult, I am not sure of the typing and I cannot get it error free. Do you have any ideas on what the typing may be? I tried e:Event, casting linkEl as HTMLAnchorElement and linkHref as string | null | undefined but I get an error. I console logged linkEl and it gave an anchor tag so HTMLAnchorElement type.  In transcript, linkEl is an anchor tag.

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
            if (datapass){
                this.SDK.sendDataPass(datapass);
            }    
        }

        this.disablePreviousWidgets(e);
    }

    processTranscriptEvent(e: any): void {
        this.processExternalAndResponsiveLinks(e);
        // https://stackoverflow.com/questions/28900077/why-is-event-target-not-element-in-typescript
        //  I did have e: Event and then tried to use instanceof in the if statement but it failed the unit tests so I have swapped it back to e: any. Do you have any ideas on what this could be?
        if(e.target){
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
        this._resetStopTypingTimeout();

        if(!this.isCustomerTyping) {
            this.startTyping(this.eventHandler); 
        }

        const enterKey: number = 13;
        if (e.which == enterKey) {
            this.eventHandler.onSend();
            e.preventDefault();
            this.inputBoxFocus = true;
        } else {
            this.inputBoxFocus = false;
        }
    }

    disablePreviousWidgets(e: any): void {
        // Disable quick-reply widgets
        try {
            if((e.target).getAttribute('href') == "#") {
                let qrWidgets = document.querySelectorAll<any>(".quick-reply-widget");
                !!qrWidgets && qrWidgets.forEach(widget => widget.disable());
            }
        } catch {
          console.log('DEBUG: ' + 'Elements not found' )
        }
      }
      // 1) I have currently set the parameter to any. I was considering Event and then casting e.target as an Element but I was not sure it is an element. If it is a DOMEvent it is likely that it will be an Element. However, when I search the codebase for disablePreviousWidgets, it only shows in tests and the file I am currently working on.
      
      // 2) I have also set querySelectorAll() to Any.

    setEventHandler(eventHandler: nullEventHandlerInterface): void {
        this.eventHandler = eventHandler;
    }

    _processCloseButtonEvent(_:Event): void {
        this.closeMethod = "Button";

        this.eventHandler.onCloseChat();
    }

    _registerKeypressEventListener(selector: string, handler: (e: KeyboardEvent) => void): void {
        const element = this.container.querySelector<HTMLTextAreaElement>(selector);
        if (element) {
            element.addEventListener("keypress", handler);
        }
    }

    _registerEventListener(selector:string, handler: (e: Event) => void): void {
        const element = this.container.querySelector<HTMLElement>(selector);
        if (element) {
            element.addEventListener("click", handler);
        }
    }
    // What do you think of the typings of the above two methods. I am not getting errors and it seems to link up with the processKeypressEvent above and the below registerKeypressEventListener / registerEventListener(). When I console.log handler it was passing functions. The inference of VSCode wanted to pass an object containing all of the event listeners with this as HTMLElement and ev: MouseEvent

    _registerEventListeners(): void {

        this._registerKeypressEventListener("#custMsg", (e: KeyboardEvent): void => {
            this.processKeypressEvent(e)
        });

        this._registerEventListener("#ciapiSkinSendButton", (_: Event): void => {
            this.eventHandler.onSend();
            this.inputBoxFocus = false;
        });

        this._registerEventListener("#hamburgerMenu", (_: Event): void => {
            this.eventHandler.onShowHamburger();
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

       styleList.forEach(function(item: string): void {
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

        styleList.forEach(function(item: string): void {
            document.getElementById(item)?.setAttribute("style", "display: '';");
        });

        document.getElementById("endChatPopup")?.setAttribute("style", "display: none;");

        document.getElementById("ciapiSkinChatTranscript")?.setAttribute("tabindex", '0');
        this.endChatPopup.hide();

        const endChatGiveFeedback = Array.from(
            document.querySelectorAll<HTMLElement>('.dialog')
        ).pop();
        // I could not find dialog in the codebase other than in the tests. However, the tests suggest it will be a HTMLElement. We also use .focus on endChatGiveFeedback which does not exist on Element and that is the default returned by querySelectorAll. .focus is available on HTMLElement. What do you think?

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
        if(toPrint){
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
                console.log('DEBUG: ' + 'Elements not found' )
            }

            let transcriptHeading: HTMLElement | null = document.getElementById("ciapiSkinHeader");

            if(transcriptHeading){
                transcriptHeading.style.height = "auto";
                transcriptHeading.style.width = "auto";
            }
        }
    }

    _focusOnNextAutomatonMessage(): void {
        setTimeout(function(_: any): void {
            //If I do not delete the parameter, it needs typed. However, it is not being read. What should I do?
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

              if((document.getElementById("legend_give_feedback") != null || document.getElementById("legend_give_feedback") != undefined)) {
                  document.getElementById("legend_give_feedback")?.focus();
              }
    }

    showPage(page: any) {
        const ciapiSkinChatTranscript = this.container.querySelector<HTMLElement>("#ciapiSkinChatTranscript")
        if(ciapiSkinChatTranscript){
            ciapiSkinChatTranscript.style.display = "none";
        }
        const ciapiSkinFooter = this.container.querySelector<HTMLElement>("#ciapiSkinFooter")
        if(ciapiSkinFooter){
            ciapiSkinFooter.style.display = "none";
        }
        page.attachTo(this.container.querySelector<HTMLElement>("#ciapiChatComponents"));
    }
}
// I have console logged page and typeof page and it is apparently an object but when I set page: {}. It gives me an error on attachTo which is Property 'attachTo' does not exist on type '{}'.ts(2339). I could not find info about attachTo on the MDN. Do you have any ideas?