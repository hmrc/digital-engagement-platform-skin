const html = `
    <div id="endChatPopup" role="dialog" aria-modal="true">
      <h1 class="govuk-heading-xl" id="heading_end_chat_popup" tabindex="-1">End chat?</h1>

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
        this.wrapper.insertAdjacentHTML("beforeend", html);
        container.appendChild(this.wrapper);

        this.wrapper.querySelector("#cancelEndChat").addEventListener(
            "click",
            (e) => this.eventHandler.onCancelEndChat()
        );

        this.wrapper.querySelector("#confirmEndChat").addEventListener(
            "click",
            (e) => this.eventHandler.onConfirmEndChat()
        );
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
