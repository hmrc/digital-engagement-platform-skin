export const popupHtml = `
<div id="endChatPopup" role="dialog" aria-modal="true" tabindex="-1" aria-labelledby="heading_end_chat_popup">
      <h1 class="govuk-heading-xl" id="heading_end_chat_popup">End chat?</h1>

      <button id="confirmEndChat" class="govuk-button">
              End chat
            </button>

      <button id="cancelEndChat" class="govuk-button govuk-!-margin-right-1 govuk-button--secondary">
        Return to chat
      </button>

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
    }

    onCancelEndChat(e) {
        this.eventHandler.onCancelEndChat();
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
