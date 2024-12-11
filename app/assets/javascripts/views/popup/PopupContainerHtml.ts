'use strict';

import { host } from "../../utils/HostUtils";
import { messages } from "../../utils/Messages";

export function ContainerHtml(isEscalated: boolean): string {
    let url: string = new URL(window.location.href).pathname.replaceAll("/", "%2F");
    let sizeButton: string = `<button id='toggleSizeButton' role="button">Increase chat size</button>`
    let container: string = `<div id="ciapiSkinContainer" class='ciapiSkinContainerStandardSize'>`
    if (sessionStorage.getItem("isStandard") == "false") {
        container = `<div id="ciapiSkinContainer" class='ciapiSkinContainerLargerSize'>`;
        sizeButton = `<button id='toggleSizeButton' role="button">Decrease chat size</button>`
    }

    let automatedMessage: string = "";
    if (!isEscalated) {
        automatedMessage = `<p id="info" class="info govuk-!-display-none-print"><img src="` + host + `/engagement-platform-skin/assets/media/digital-assistant.svg" alt="">${messages.computer}</p>`
    }
    let soundButton: string = `<button id="toggleSound" class="active"> Turn notification sound off </button>`;
    if (sessionStorage.getItem("isActive") == "false") { soundButton = `<button id="toggleSound" class="inactive"> Turn notification sound on </button>` }

    return `
<div id="printDetails" class="print-only govuk-!-padding-top-8 govuk-!-padding-bottom-8">
<p class="govuk-body print-only">Chat ID: <span id="chat-id"></span></p>
<p id="print-date" class="govuk-body print-only"></p>
</div>
` + container + `
    <div id="titleBar" class="govuk-!-display-none-print">

    <div class="dropdown">
        <button id="menuButton" class="dropbtn" draggable="false" role="button" type="button" aria-expanded="false" aria-controls="menuList" aria-label="Menu">
            <div id="menuText" class="govuk-heading-s govuk-!-font-size-19">Menu</div>
        </button>
        <div id="menuList" class="dropdown-content">
            <button id="ciapiSkinCloseButton" role="button" tabindex="0" > End chat </button>
            <button id="printButton" role="button" tabindex="0" > Print or save chat </button>
            ` + sizeButton + `
            ` + soundButton + `
            <button id='accessibility-statement-link' role="button" >Accessibility statement (opens in a new tab)</button>
        </div>
    </div>
        <div id="ciapiSkinTitleBar">
            <h2 class="govuk-heading-s govuk-!-font-size-19">Ask HMRC</h2>
        </div>
        <div id="hideCloseContainer" class="govuk-!-display-none-print">

        


            <button id="ciapiSkinHideButton" role="button" tabindex="0"><i class="arrow down" draggable="false" role="button" type="button" aria-label="Minimise chat window"></i></button>
         </div>
    </div>
    <div id="ciapiChatComponents">
        <div id="ciapiSkinChatTranscript" class="ciapiSkinChatTranscript print-overflow-visible" role="region" tabindex="0" aria-label="chat transcript">
            <div id="skipToBottom"><a id="skipToBottomLink" href="#" class="govuk-skip-link">Skip to bottom of conversation</a></div>` + automatedMessage + `
        </div>
        <div id="ciapiSkinFooter" class="govuk-!-display-none-print">
            <label class="govuk-label" for="custMsg">Enter a message</label>
            <div id="ciapiInput">
            <textarea
                id="custMsg"
                class="govuk-textarea"
                role="textbox"
                aria-label="Enter a message "
                placeholder=""
                rows="5"
                cols="50"
                name="comments"></textarea></div>
            <div id="ciapiSend">
                <button id="ciapiSkinSendButton" disabled aria-disabled="true" class="govuk-button" data-module="govuk-button">Send message</button>
                <div id="sentMessageNotification" aria-live="polite" class="govuk-visually-hidden"></div>
            </div>
        </div>
        <!-- at the moment, the below URL is hardcoded. in the future this should be a properly encoded URL and have the correct chat passed in as a parameter -->
        <!-- <div id="accessibility-statement"><a id='accessibility-statement-link' class="govuk-link govuk-!-display-none-print" href="https://www.tax.service.gov.uk/accessibility-statement/digital-engagement-platform-frontend?referrerUrl=` + url + `-skin-hmrc" target="_blank">Accessibility statement (opens in a new tab)</a></div> -->
    </div>
</div>
<div id="ciapiSkinMinimised">
    <button id="ciapiSkinRestoreButton" type="button" draggable="false" role="button">
        <h2 class="govuk-heading-s govuk-!-font-size-19">Ask HMRC a Question</h2>
        <div id="ciapiSkinExpandButton" role="button"><i class="arrow up" draggable="false" role="button" type="button" aria-label="Expand chat window"></i></div>
    </button>
</div>
`}
