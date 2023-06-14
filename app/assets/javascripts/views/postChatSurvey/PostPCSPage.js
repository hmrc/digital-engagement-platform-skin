const html = `
<div id="endPage">
    <div class="govuk-panel govuk-panel--confirmation" style="margin-right:0.8em;">
        <h2 class="govuk-panel__title" id="heading_chat_ended" tabindex="-1">
            Chat ended
        </h2>
    </div>
    <div id ='futherLinks'>
        <p>You can:</p>
        <ul>
            <li><a href='#' id='printButton'>print or save your chat</a></li>    
            <li><a href="http://www.gov.uk">return to GOV.UK</a></li>
            <li>close this window</li>
        </ul>
    </div>

    <p id="endpage-thanks" class="govuk-body">Thank you for your feedback.</p>

</div>
`

const nullEventHandler = {
    onPrint: function () {}
};

export default class PostPCSPage {
    
    constructor(showThanks) {
        this.showThanks = showThanks;
        this.eventHandler = nullEventHandler;
        this._registerEventListeners();
        this.printPreview();
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

    _registerEventListener(selector, handler) {
        const element = this.wrapper.querySelector(selector);
        if (element) {
            element.addEventListener("click", handler);
        }
    }

    _registerEventListeners() {
        this._registerEventListener("#printButton", (e) => {
            this.eventHandler.onPrint(e);
            console.log('************************************hi')
            e.preventDefault();
        });
    }

    detach() {
        this.container.removeChild(this.wrapper)
    }
}
