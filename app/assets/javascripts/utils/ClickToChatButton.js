export default class ClickToChatButton {
    constructor(parentElement, buttonClass) {
        this.parentElement = parentElement;
        this.buttonClass = buttonClass;
    }

    replaceChild(innerHTML, hmrcSkin) {
        const buttonDiv = this.parentElement.ownerDocument.createElement("div");
        console.log("BUTTON CREATION SKIN BOOLEAN CHECK: " + hmrcSkin)
        if (hmrcSkin) {
            buttonDiv.setAttribute("class", "ciapiSkinMinimised");
        } else {
            buttonDiv.setAttribute("class", "c2cButton");
        }

        buttonDiv.innerHTML = innerHTML;

        this.parentElement.innerHTML = "";
        this.parentElement.appendChild(buttonDiv);

        console.log("BUTTON DIV PRINT: " + buttonDiv)
        return buttonDiv;
    }
}
