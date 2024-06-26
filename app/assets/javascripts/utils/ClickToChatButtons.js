import * as DisplayState from '../NuanceDisplayState'
import * as logger from '../utils/logger';
import { host } from "../utils/HostUtils";

export default class ClickToChatButtons {
    constructor(onClicked, displayStateMessages) {
        this.buttons = {};
        this.onClicked = onClicked;
        this.displayStateMessages = displayStateMessages;
    }

    addButton(c2cObj, button, divID) {
        if (!document.getElementById("ciapiSkinContainer")) {
            this.buttons[c2cObj.c2cIdx] = button;
            this._updateButton(c2cObj, button, divID === "tc-nuance-chat-container");
        }
    }

    updateC2CButtonsToInProgress() {
        for (const c2cId of Object.keys(this.buttons)) {
            const c2cObj = {
                c2cIdx: c2cId,
                displayState: DisplayState.ChatActive,
                launchable: false
            };
            this._updateButton(c2cObj, this.buttons[c2cId], document.getElementById("tc-nuance-chat-container"));
        }
    }

    _getDisplayStateText(displayState) {
        return this.displayStateMessages[displayState] || ("Unknown display state: " + displayState);
    }

    _updateButton(c2cObj, button, hmrcSkin) {
        const buttonText = this._getDisplayStateText(c2cObj.displayState);
        let innerHTML = ``

        if (hmrcSkin) {
            innerHTML = `<div id="ciapiSkinMinimised"><button id="ciapiSkinRestoreButton" type="button" draggable="false" role="button" tabindex="0"><h2 class="govuk-heading-s govuk-!-font-size-19">Ask HMRC a Question</h2></button></div>`
        } else {
            innerHTML = `<div class="${button.buttonClass} ${c2cObj.displayState}">${buttonText}</div>`;
        }

        const div = button.replaceChild(innerHTML, hmrcSkin);

        if (c2cObj.launchable) {
            div.onclick = function() {
                logger.debug('c2cObj', this);
                this.onClicked(c2cObj.c2cIdx);
            }.bind(this);
        }
    }
}
