export const popupHtml = `
<div id="endChatPopup" role="alertdialog" aria-modal="true" tabindex="0" aria-labelledby="heading_end_chat_popup" style="display: none;">
      <h2 class="govuk-heading-l" id="heading_end_chat_popup">Do you want to end the chat?</h2>

      <button id="confirmEndChat" class="govuk-button">
              Yes, end chat
            </button>

      <button id="cancelEndChat" class="govuk-button govuk-!-margin-right-1 govuk-button--secondary">
        Return to chat
      </button>

      <div id="surveyPrintContainer">
    <p><a class="govuk-link" href="#" id="printLink">Print chat</a></p>
  </div>

    </div>
    <div id="popupOverlay" class="backdrop"></div>
`

export default class Popup {
    constructor(container, eventHandler) {
        this.container = container;
        this.eventHandler = eventHandler;

        this.wrapper = document.createElement("div")
        this.wrapper.id = "endChatPopupWrapper";
        this.hide();
        this.wrapper.insertAdjacentHTML("beforeend", popupHtml);
        container.appendChild(this.wrapper);

        this.wrapper.querySelector("#cancelEndChat").addEventListener("click", (e) => {
            this.onCancelEndChat(e)
        });

        this.wrapper.addEventListener("keydown",(e) => {
            if (e.key === "Escape") {
                this.onCancelEndChat(e)
            }
        });

        this.wrapper.querySelector("#confirmEndChat").addEventListener("click", (e) => {
            this.onConfirmEndChat(e)
        });

        this.wrapper.querySelector("#surveyPrintContainer").addEventListener("click", (e) => {
            this.endChatPrint(e)
        });


    }

    endChatPrint(e) {
        this.eventHandler.onCancelEndChat(e, true);
        e.preventDefault();
    }

    onCancelEndChat(e, toPrint) {
        this.eventHandler.onCancelEndChat(e, toPrint);
        e.preventDefault();
    }

    onConfirmEndChat(e) {
        this.eventHandler.onConfirmEndChat();
        e.preventDefault();
    }

    show() {
        this._setDisplay("block");
    }

    hide() {
        this._setDisplay("none");
    }

    _setDisplay(state) {
        this.wrapper.style.display = state;
    }
}
