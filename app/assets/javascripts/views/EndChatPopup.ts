import nullEventHandler from '../../javascripts/utils/ChatContainer'

export const popupHtml: string = `
<div id="endChatPopup" role="alertdialog" aria-modal="true" tabindex="0" aria-labelledby="heading_end_chat_popup" style="display: none;">
      <h2 class="govuk-heading-l" id="heading_end_chat_popup">Do you want to end the chat?</h2>

      <button id="confirmEndChat" class="govuk-button">
              Yes, end chat
            </button>

      <button id="cancelEndChat" class="govuk-button govuk-!-margin-right-1 govuk-button--secondary">
        Return to chat
      </button>

      <div id="surveyPrintOrSaveContainer">
    <p><a class="govuk-link" href="#" id="printOrSaveLink">Print or save chat</a></p>
  </div>

    </div>
    <div id="popupOverlay" class="backdrop"></div>
`

export default class Popup {
    container: HTMLElement | null
    wrapper: HTMLElement | undefined
    eventHandler: nullEventHandler
    constructor(container: HTMLElement | null, eventHandler: nullEventHandler) {
        this.container = container;
        this.eventHandler = eventHandler;

        this.wrapper = document.createElement("div")
        this.wrapper.id = "endChatPopupWrapper";
        this.hide();
        this.wrapper.insertAdjacentHTML("beforeend", popupHtml);
        container?.appendChild(this.wrapper);

        this.wrapper.querySelector<HTMLElement>("#cancelEndChat")?.addEventListener("click", (e: Event): void => {
            this.onCancelEndChat(e)
        });

        this.wrapper.addEventListener("keydown", (e: KeyboardEvent): void => {
            if (e.key === "Escape") {
                this.onCancelEndChat(e)
            }
        });

        this.wrapper.querySelector<HTMLElement>("#confirmEndChat")?.addEventListener("click", (e: Event): void => {
            this.onConfirmEndChat(e)
        });

        this.wrapper.querySelector<HTMLElement>("#surveyPrintOrSaveContainer")?.addEventListener("click", (e: Event): void => {
            this.endChatPrint(e)
        });


    }

    endChatPrint(e: Event): void {
        this.eventHandler.onCancelEndChat(e, true);
        e.preventDefault();
    }

    onCancelEndChat(e: Event, toPrint?: boolean): void {
        this.eventHandler.onCancelEndChat(e, toPrint);
        e.preventDefault();
    }

    onConfirmEndChat(e: Event): void {
        this.eventHandler.onConfirmEndChat();
        e.preventDefault();
    }

    show(): void {
        this._setDisplay("block");
    }

    hide(): void {
        this._setDisplay("none");
    }

    _setDisplay(state: string): void {
        if (this.wrapper) {
            this.wrapper.style.display = state;
        }
    }
}
