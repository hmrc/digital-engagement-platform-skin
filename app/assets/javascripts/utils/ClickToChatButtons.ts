import * as DisplayState from '../NuanceDisplayState'
import * as logger from '../utils/logger';
import { host } from "../utils/HostUtils";
import ClickToChatButton from './ClickToChatButton';

interface ClickToChatObjectInterface {
    c2cIdx: string, 
    displayState: "chatactive" | "outofhours" | "ready" | "busy", 
    launchable: boolean
}

export default class ClickToChatButtons {
    buttons: {}
    onClicked: (c2cIdx: string) => void;
    displayStateMessages: { outofhours: string; ready: string; busy: string; chatactive: string; }
    
    constructor(onClicked: (c2cIdx: string) => void, displayStateMessages: { outofhours: string; ready: string; busy: string; chatactive: string; }) {
        this.buttons = {};
        this.onClicked = onClicked;
        this.displayStateMessages = displayStateMessages;
    }
    
    addButton(c2cObj: ClickToChatObjectInterface, button: ClickToChatButton, divID: string): void {
        if (!document.getElementById("ciapiSkinContainer")) {
            this.buttons[c2cObj.c2cIdx] = button;
            this._updateButton(c2cObj, button, divID === "tc-nuance-chat-container");
        }
    }

    updateC2CButtonsToInProgress(): void {
        for (const c2cId of Object.keys(this.buttons)) {
            const c2cObj: ClickToChatObjectInterface = {
                c2cIdx: c2cId,
                displayState: DisplayState.ChatActive,
                launchable: false
            };
            this._updateButton(c2cObj, this.buttons[c2cId], document.getElementById("tc-nuance-chat-container"));
        }
    }
    
    _getDisplayStateText(displayState:keyof typeof this.displayStateMessages): string {
        return (this.displayStateMessages)[displayState] || ("Unknown display state: " + displayState);
    }

    _updateButton(c2cObj: ClickToChatObjectInterface, button: ClickToChatButton, hmrcSkin: boolean | HTMLElement | null): void {
        const buttonText: string = this._getDisplayStateText(c2cObj.displayState);
        let innerHTML: string = ``

        if (hmrcSkin) {
            innerHTML = `<div id="ciapiSkinMinimised"><button id="ciapiSkinRestoreButton" type="button" draggable="false" role="button" tabindex="0"><h2 class="govuk-heading-s govuk-!-font-size-19">Ask HMRC a Question</h2></button></div>`
        } else {
            innerHTML = `<div class="${button.buttonClass} ${c2cObj.displayState}">${buttonText}</div>`;
        }

        const div: HTMLElement | undefined = button.replaceChild(innerHTML, hmrcSkin);

        if (c2cObj.launchable) {
            if(div){
                div.onclick = function(this: any): void {
                    logger.debug('c2cObj', this);
                    this.onClicked(c2cObj.c2cIdx);
                }.bind(this);
            }
        }
    }
}