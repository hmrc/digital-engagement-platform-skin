'use strict';
export const ContainerHtml = `
<div id="ciapiSkinContainer">
    <div id="ciapiSkinHeader">
        <div id="ciapiTitleBarLogo"></div>
        <div id="ciapiSkinTitleBar"><h2 class="govuk-heading-s govuk-!-font-size-19">Ask HMRC</h2></div>
        <div id="hideCloseContainer">
            <button id="ciapiSkinHideButton"  draggable="false" role="button" type="button" aria-label="Minimise chat window"></button>
            <button id="ciapiSkinCloseButton" draggable="false" role="button" type="button" aria-label="Close chat window"></button>
        </div>
    </div>
    <div id="tools">
        <div id="print">
            <button class="govuk-button govuk-button--secondary" data-module="govuk-button">
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
        <div id="ciapiSkinChatTranscript" role="log" tabindex="0">
            <div id="skipToBottom"><a id="skipToBottomLink" href="#skipToTopLink" class="govuk-skip-link">Skip to bottom of conversation</a></div>
            <p class="info"><img src="/ask-hmrc/assets/media/intro-warn.svg" alt="Introduction warning">You are currently chatting with a computer.</p>
        </div>
        <div id="ciapiSkinFooter">
            <div id="ciapiInput"><textarea
                id="custMsg"
                class="govuk-textarea"
                aria-label="Type your message here"
                placeholder="Type your message here"
                rows="5"
                cols="50"
                name="comments"></textarea></div>
            <div id="ciapiSend"><button
                id="ciapiSkinSendButton"
                class="govuk-button">Send</button></div>
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