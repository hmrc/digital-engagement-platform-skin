export default class ClickToChatButton {
    parentElement: HTMLElement | null
    buttonClass: string
    constructor(parentElement: HTMLElement | null, buttonClass: string) {
        this.parentElement = parentElement;
        this.buttonClass = buttonClass;
    }

    replaceChild(innerHTML: string, isAnchored: boolean): HTMLElement | undefined {
        const buttonDiv: HTMLElement | undefined = this.parentElement?.ownerDocument.createElement("div");
        if (isAnchored) {
            buttonDiv?.setAttribute("class", "minimised");
            buttonDiv?.setAttribute("id", "ciapiSkin");
        } 

        //null checks on buttonDiv and parentElement
        if (buttonDiv) {
            buttonDiv.innerHTML = innerHTML;
        }

        if (this.parentElement && buttonDiv) {
            this.parentElement.innerHTML = "";
            this.parentElement.appendChild(buttonDiv);
        }
        return buttonDiv;
    }
}
