'use strict';

import { host } from "../../utils/HostUtils";

export function ContainerHtml(isEscalated) {
    let url = new URL(window.location.href).pathname.replaceAll("/", "%2F");
    let automatedMessage = "";
    if (!isEscalated) { automatedMessage = `<p id="info" class="info govuk-!-display-none-print"><img src="` + host + `/engagement-platform-skin/assets/media/digital-assistant.svg" alt="">You are currently chatting with a computer.</p>`}
    let soundButton = `<button id="toggleSound" class="active"> Turn notification sound off </button>`;
    if (sessionStorage.getItem("isActive") == "false") { soundButton = `<button id="toggleSound" class="inactive"> Turn notification sound on </button>`}
    return `
<div id="printDetails" class="print-only govuk-!-padding-top-8 govuk-!-padding-bottom-8">
<p class="govuk-body print-only">Chat ID: <span id="chat-id"></span></p>
<p id="print-date" class="govuk-body print-only"></p>
</div>
<div id="ciapiSkinContainer">
    <div id="titleBar" class="govuk-!-display-none-print">

    <div class="dropdown">
        <button id="hamburgerMenu" class="dropbtn" draggable="false" role="button" type="button" aria-expanded="false" aria-controls="hamburgerList" aria-label="Hamburger Menu">
            <div class="bar1"></div>
            <div class="bar2"></div>
            <div class="bar3"></div>
        </button>
        <div id="hamburgerList" class="dropdown-content">
            <button id="ciapiSkinCloseButton" tabindex="0" > End chat </button>
            <button id="printButton" tabindex="0" > Print or save chat </button>
            ` + soundButton + `
            <button id='accessibility-statement-link' >Accessibility statement (opens in a new tab)</button>
        </div>
    </div>
        <div id="ciapiSkinTitleBar">
            <h2 class="govuk-heading-s govuk-!-font-size-19">Ask HMRC</h2>
        </div>
        <div id="hideCloseContainer" class="govuk-!-display-none-print">

        


            <button id="ciapiSkinHideButton" tabindex="0"><i class="arrow down" draggable="false" role="button" type="button" aria-label="Minimise chat window"></i></button>
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
        <!-- <div id="accessibility-statement"><a id='accessibility-statement-link' class="govuk-link govuk-!-display-none-print" href="https://www.tax.service.gov.uk/accessibility-statement/digital-engagement-platform-frontend?referrerUrl=` + url + `-skin-hmrc" target="_blank">Accessibility statement (opens in a new tab)</a></div> -->
    </div>
</div>
<div id="ciapiSkinMinimised">
    <button id="ciapiSkinRestoreButton" type="button" draggable="false" role="button">
        <div id="logo-white"><img src="` + host + `/engagement-platform-skin/assets/media/logo-white.png"></div>
        <h2 class="govuk-heading-s govuk-!-font-size-19">Ask HMRC a Question</h2>
    </button>
</div>
`}
