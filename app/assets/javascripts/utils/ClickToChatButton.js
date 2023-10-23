export default class ClickToChatButton {
    constructor(parentElement, buttonClass) {
        this.parentElement = parentElement;
        this.buttonClass = buttonClass;
    }

    replaceChild(innerHTML, hmrcSkin) {
        const buttonDiv = this.parentElement.ownerDocument.createElement("div");
        if (hmrcSkin) {
            buttonDiv.setAttribute("class", "minimised");
            buttonDiv.setAttribute("id", "ciapiSkin");
        } else {
            buttonDiv.setAttribute("class", "c2cButton");
        }

        buttonDiv.innerHTML = innerHTML;

        this.parentElement.innerHTML = "";
        this.parentElement.appendChild(buttonDiv);

        return buttonDiv;
    }
}
