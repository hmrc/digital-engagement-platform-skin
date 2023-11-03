'use strict';

import { host } from "../../utils/HostUtils";

export function ContainerHtml(isEscalated) {
    let url = new URL(window.location.href).pathname.replaceAll("/", "%2F");
    let automatedMessage = "";
    if (!isEscalated) { automatedMessage = `<p id="info" class="info govuk-!-display-none-print"><img role="img" src="` + host + `/engagement-platform-skin/assets/media/digital-assistant.svg" alt="">You are currently chatting with a computer.</p>`}
    let soundButton = `<button id="toggleSound" class="govuk-button govuk-button--secondary active" data-module="govuk-button"> Turn notification sound off </button>`;
    if (sessionStorage.getItem("isActive") == "false") { soundButton = `<button id="toggleSound" class="govuk-button govuk-button--secondary inactive" data-module="govuk-button"> Turn notification sound on </button>`}
    return `
<div id="printDetails" class="print-only govuk-!-padding-top-8 govuk-!-padding-bottom-8">
<p class="govuk-body print-only">Chat ID: <span id="chat-id"></span></p>
<p id="print-date" class="govuk-body print-only"></p>
</div>
<div id="ciapiSkinContainer">
    <div id="titleBar" class="govuk-!-display-none-print">
        <div id="ciapiSkinTitleBar">
            <div id="ciapiTitleBarLogo"></div>
            <h2 class="govuk-heading-s govuk-!-font-size-19">Ask HMRC</h2>
        </div>
        <div id="hideCloseContainer" class="govuk-!-display-none-print">
            <button id="ciapiSkinHideButton"  draggable="false" role="button" type="button" aria-label="Minimise chat window"></button>
            <button id="ciapiSkinCloseButton" draggable="false" role="button" type="button" aria-label="Close chat window"></button>
        </div>
    </div>
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
                <button id="ciapiSkinSendButton" class="govuk-button" data-module="govuk-button">Send message</button>
            </div>
        </div>
        <!-- at the moment, the below URL is hardcoded. in the future this should be a properly encoded URL and have the correct chat passed in as a parameter -->
        <div id="accessibility-statement"><a id='accessibility-statement-link' class="govuk-link govuk-!-display-none-print" href="https://www.tax.service.gov.uk/accessibility-statement/digital-engagement-platform-frontend?referrerUrl=` + url + `-skin-hmrc" target="_blank">Accessibility statement (opens in a new tab)</a></div>
    </div>
</div>
<div id="ciapiSkinMinimised">
    <button id="ciapiSkinRestoreButton" type="button" draggable="false" role="button">
        <div id="logo-white"><img src="` + host + `/engagement-platform-skin/assets/media/logo-white.png"></div>
        <h2 class="govuk-heading-s govuk-!-font-size-19">Ask HMRC a Question</h2>
    </button>
</div>
`}
