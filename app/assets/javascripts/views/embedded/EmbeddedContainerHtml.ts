'use strict';

import { host } from "../../utils/HostUtils";
import { messages } from "../../utils/Messages";

export function ContainerHtml(isEscalated: boolean): string {
    let automatedMessage: string = "";
    if (!isEscalated) { automatedMessage = `<p id="info" class="info govuk-!-display-none-print"><img src="` + host + `/engagement-platform-skin/assets/media/digital-assistant.svg" alt="">${messages.computer}</p>` }
    let soundButton: string = `<button id="toggleSound" class="govuk-button govuk-button--secondary active" data-module="govuk-button"> Turn notification sound off </button>`;
    if (sessionStorage.getItem("isActive") == "false") { soundButton = `<button id="toggleSound" class="govuk-button govuk-button--secondary inactive" data-module="govuk-button"> Turn notification sound on </button>` }
    return `
<div id="printDetails" class="print-only govuk-!-padding-top-8 govuk-!-padding-bottom-8">
<p class="govuk-body print-only">Chat ID: <span id="chat-id"></span></p>
<p id="print-date" class="govuk-body print-only"></p>
</div>
<div id="ciapiSkinContainer">
    <div id="ciapiSkinHeader" class="govuk-!-display-none-print">
        <div id="print">
            <button id="printButton" class="govuk-button govuk-button--secondary" data-module="govuk-button">
                Print or save chat
            </button>
        </div>
        <div id="sound">
                ` + soundButton + `
        </div>
    </div>
    <div id="ciapiChatComponents">
        <div id="ciapiSkinChatTranscript" class="ciapiSkinChatTranscript print-overflow-visible" role="region" tabindex="0" aria-label="chat transcript">
            <div id="skipToBottom"><a id="skipToBottomLink" href="#" class="govuk-skip-link">Skip to bottom of conversation</a></div>` + automatedMessage + `
        </div>
        <div id="ciapiSkinFooter" class="govuk-!-display-none-print">
            <div>
                <label class="govuk-label" for="custMsg">Enter a message</label>
                <div id="ciapiInput">
                <textarea
                    id="custMsg"
                    role="textbox"
                    aria-label="Enter a message"
                    placeholder=""
                    class="govuk-textarea"
                    cols="50"
                    name="comments"></textarea>
                </div>
                <div id="ciapiSend">
                    <button id="ciapiSkinSendButton" disabled aria-disabled="true" class="govuk-button" data-module="govuk-button">Send Message</button>
                    <div id="sentMessageNotification" aria-live="polite" class="govuk-visually-hidden"></div>
                </div>
            </div>
            <div id="ciapiClose">
                <button id="ciapiSkinCloseButton" class="govuk-button govuk-button--secondary" data-module="govuk-button">End chat</button>
            </div>
        </div>
    </div>
</div>
`}
