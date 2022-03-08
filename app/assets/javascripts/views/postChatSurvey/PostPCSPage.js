const html = `
<div id="endPage">
    <div class="govuk-panel govuk-panel--confirmation" style="margin-right:0.8em;">
        <h1 class="govuk-panel__title" id="heading_chat_ended" tabindex="-1">
            Chat ended
        </h1>
    </div>

    <p id="endpage-thanks" class="govuk-body">Thank you for your feedback.</p>

</div>
`

export default class PostPCSPage {
    constructor(showThanks) {
        this.showThanks = showThanks;
    }
    attachTo(container) {
        this.container = container;

        this.wrapper = document.createElement("div")
        this.wrapper.id = "postPCSPageWrapper";
        this.wrapper.insertAdjacentHTML("beforeend", html);
        if (!this.showThanks) {
            this.wrapper.querySelector('#endpage-thanks').style.display = 'none';
        }
        container.appendChild(this.wrapper);
    }

    detach() {
        this.container.removeChild(this.wrapper)
    }
}
