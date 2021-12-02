export default class ClickToChatButton {
    constructor(parentElement, buttonClass) {
        this.parentElement = parentElement;
        this.buttonClass = buttonClass;
    }

    replaceChild(innerHTML) {
        const buttonDiv = this.parentElement.ownerDocument.createElement("div");
        buttonDiv.setAttribute("class", "c2cButton");
        buttonDiv.innerHTML = innerHTML;

        this.parentElement.innerHTML = "";
        this.parentElement.appendChild(buttonDiv);

        return buttonDiv;
    }
}
