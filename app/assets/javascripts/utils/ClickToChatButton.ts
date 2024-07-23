export default class ClickToChatButton {
    parentElement: HTMLElement | null
    buttonClass: string
    constructor(parentElement: HTMLElement | null, buttonClass: string) {
        this.parentElement = parentElement;
        this.buttonClass = buttonClass;
    }

    replaceChild(innerHTML: string, hmrcSkin: boolean | HTMLElement | null): HTMLElement | undefined {
        const buttonDiv: HTMLElement | undefined = this.parentElement?.ownerDocument.createElement("div");
        if (hmrcSkin) {
            buttonDiv?.setAttribute("class", "minimised");
            buttonDiv?.setAttribute("id", "ciapiSkin");
        } else {
            buttonDiv?.setAttribute("class", "c2cButton");
        }

        if(buttonDiv){
            buttonDiv.innerHTML = innerHTML;
        }

        if(this.parentElement && buttonDiv){
            this.parentElement.innerHTML = "";
            this.parentElement.appendChild(buttonDiv);
        }

        return buttonDiv;
    }
}
