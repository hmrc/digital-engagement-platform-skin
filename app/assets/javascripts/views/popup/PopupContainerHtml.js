'use strict';
export const ContainerHtml = `
<div id="printDetails" style="display:none" class="govuk-!-padding-top-8 govuk-!-padding-bottom-8">
<p class="govuk-body">Chat id: <span id="chat-id"></span></p>
<p id="print-date" class="govuk-body"></p>
</div>
<div id="ciapiSkinContainer">
    <div id="titleBar" >
        <div id="ciapiSkinTitleBar">
            <div id="ciapiTitleBarLogo"></div>
            <h2 class="govuk-heading-s govuk-!-font-size-19">Ask HMRC</h2>
        </div>
        <div id="hideCloseContainer">
            <button id="ciapiSkinHideButton"  draggable="false" role="button" type="button" aria-label="Minimise chat window"></button>
            <button id="ciapiSkinCloseButton" draggable="false" role="button" type="button" aria-label="Close chat window"></button>
        </div>
    </div>
    <div id="ciapiSkinHeader" class="govuk-!-display-none-print">
        <div id="print">
            <button id="printButton" class="govuk-button govuk-button--secondary" data-module="govuk-button">
                Print or save
            </button>
        </div>
        <div id="sound">
            <button class="govuk-button govuk-button--secondary" data-module="govuk-button">
               Turn sound on
            </button>
        </div>
    </div>
    <div id="ciapiChatComponents">
        <div id="ciapiSkinChatTranscript" class="ciapiSkinChatTranscript" tabindex="0" aria-label="chat transcript">
            <div id="skipToBottom"><a id="skipToBottomLink" href="#skipToTopLink" class="govuk-skip-link">Skip to bottom of conversation</a></div>
            <p id="info" class="info govuk-!-display-none-print"><img role="img" src="/ask-hmrc/assets/media/intro-warn.svg" alt="">Note: You are currently chatting with a computer.</p>
        </div>
        <div id="ciapiSkinFooter" class="govuk-!-display-none-print">
            <div id="ciapiInput"><textarea
                id="custMsg"
                class="govuk-textarea"
                aria-label="Type your message here"
                placeholder="Type your message here"
                rows="5"
                cols="50"
                name="comments"></textarea></div>
            <div id="ciapiSend">
                <button id="ciapiSkinSendButton" class="govuk-button" data-module="govuk-button">Send Message</button>
            </div>
        </div>
    </div>
</div>
<div id="ciapiSkinMinimised">
    <button id="ciapiSkinRestoreButton" type="button" draggable="false" role="button">
        <div id="logo-white"></div>
        <h2 class="govuk-heading-s govuk-!-font-size-19">Ask HMRC a Question</h2>
    </button>
</div>
`