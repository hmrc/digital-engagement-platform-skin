import * as DisplayState from '../NuanceDisplayState'
import * as logger from '../utils/logger';
import ClickToChatButton from './ClickToChatButton';
import { ClickToChatObjectInterface } from '../types';
import { messages } from './Messages';

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
            this._updateButton(c2cObj, button, button.buttonClass === "anchored");
        }
    }

    updateC2CButtonsToInProgress(): void {
        for (const c2cId of Object.keys(this.buttons)) {
            const c2cObj: ClickToChatObjectInterface = {
                c2cIdx: c2cId,
                displayState: DisplayState.ChatActive,
                launchable: false
            };
            const button: ClickToChatButton = this.buttons[c2cId]
            this._updateButton(c2cObj, button, button.buttonClass === "anchored");
        }
    }

    _getDisplayStateText(displayState: displayState): string {
        return (this.displayStateMessages)[displayState] || ("Unknown display state: " + displayState);
    }

    _updateButton(c2cObj: ClickToChatObjectInterface, button: ClickToChatButton, isAnchored: boolean): void {
        const displayStateText: string = this._getDisplayStateText(c2cObj.displayState);
        let innerHTML: string = ''

        if (isAnchored) {
            innerHTML = `<div id="ciapiSkinMinimised"><button id="ciapiSkinRestoreButton" type="button" draggable="false" role="button" tabindex="0"><h2 class="govuk-heading-s govuk-!-font-size-19">Ask HMRC a Question</h2></button></div>`
        } else {
            if (c2cObj.displayState === 'busy') {
                innerHTML = `<h2 class="govuk-heading-m">${messages.busyHeading}</h2><div class="${c2cObj.displayState}">${displayStateText}</div><button disabled aria-disabled="true" class="${button.buttonClass} ${c2cObj.displayState} govuk-button" data-module="govuk-button">${messages.c2cButton}</button>`
            } else if (c2cObj.displayState === 'ready') {
                innerHTML = `<h2 class="govuk-heading-m">${messages.readyHeading}</h2><div class="${c2cObj.displayState}">${displayStateText}</div><button id="startChatButton" aria-disabled="false" class="${button.buttonClass} ${c2cObj.displayState} govuk-button" data-module="govuk-button">${messages.c2cButton}</button>`
            } else if (c2cObj.displayState === 'outofhours') {
                innerHTML = `<h2 class="govuk-heading-m ${c2cObj.displayState}">${displayStateText}</h2>`
            } else {
                innerHTML = `<div class="${c2cObj.displayState}">${displayStateText}</div>`
            }
        }

        const div: HTMLElement | undefined = button.replaceChild(innerHTML, isAnchored);

        if (c2cObj.launchable) {
            if (isAnchored) {
                if (div) {
                    div.onclick = function (this: any): void {
                        logger.debug('c2cObj', this);
                        this.onClicked(c2cObj.c2cIdx);
                    }.bind(this);
                }
            } else {
                const startChatButton: HTMLButtonElement | null | undefined = div?.querySelector('#startChatButton')
                if (startChatButton) {
                    startChatButton.onclick = function (this: any): void {
                        logger.debug('c2cObj', this);
                        this.onClicked(c2cObj.c2cIdx);
                    }.bind(this);
                }
            }
        }
    }
}