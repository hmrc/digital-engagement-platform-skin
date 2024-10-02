import * as DisplayState from '../NuanceDisplayState'
import * as logger from '../utils/logger';
import ClickToChatButton from './ClickToChatButton';
import { ClickToChatObjectInterface } from '../types';

export type displayState = "chatactive" | "outofhours" | "ready" | "busy"

export default class ClickToChatButtons {
    buttons: any
    onClicked: (c2cIdx: any) => void;
    displayStateMessages: { outofhours: string; ready: string; busy: string; chatactive: string; }

    constructor(onClicked: (c2cIdx: any) => void, displayStateMessages: { outofhours: string; ready: string; busy: string; chatactive: string; }) {
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

    _getDisplayStateText(displayState: displayState): string {
        return (this.displayStateMessages)[displayState] || ("Unknown display state: " + displayState);
    }

    _updateButton(c2cObj: ClickToChatObjectInterface, button: ClickToChatButton, hmrcSkin: boolean | HTMLElement | null): void {
        let buttonText: string = this._getDisplayStateText(c2cObj.displayState);
        let innerHTML: string = ``

        if (hmrcSkin) {
            // Original code below
            //innerHTML = `<div id="ciapiSkinMinimised"><button id="ciapiSkinRestoreButton" type="button" draggable="false" role="button" tabindex="0"><h2 class="govuk-heading-s govuk-!-font-size-19">Ask HMRC a Question</h2></button></div>`

            // Andy's amendment:

            innerHTML = `<div class="${button.buttonClass} ${c2cObj.displayState}">${buttonText}</div>`;
            console.log('HMRC SKIN true innerHTML', innerHTML)
        } else {
            innerHTML = `<div class="${c2cObj.displayState}">${buttonText}</div>`;
            console.log('HMRC SKIN false innerHTML', innerHTML)
        }

        const div: HTMLElement | undefined = button.replaceChild(innerHTML, hmrcSkin);

        if (c2cObj.launchable) {
            if (div) {
                div.onclick = function (this: any): void {
                    logger.debug('c2cObj', this);
                    this.onClicked(c2cObj.c2cIdx);
                }.bind(this);
            }
        }
    }
}