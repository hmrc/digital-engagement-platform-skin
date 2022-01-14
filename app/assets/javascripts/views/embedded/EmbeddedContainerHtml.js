'use strict';
export const ContainerHtml = `
<div id="ciapiSkinContainer">
    <div id="ciapiSkinHeader">
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
        <div id="ciapiSkinChatTranscript" tabindex="0" aria-label="chat region">
            <div id="skipToBottom"><a id="skipToBottomLink" href="#" class="govuk-skip-link">Skip to bottom of conversation</a></div>
            <p class="info"><img src="/ask-hmrc/assets/media/intro-warn.svg" alt="Introduction warning">You are currently chatting with a computer.</p>
        </div>
        <div id="ciapiSkinFooter">
            <div>
                <div id="ciapiInput"><textarea
                    id="custMsg"
                    aria-label="Type your message here"
                    placeholder="Type your message here"
                    class="govuk-textarea"
                    cols="50"
                    name="comments"></textarea>
                </div>
                <div id="ciapiSend">
                    <button id="ciapiSkinSendButton" class="govuk-button">Send</button>
                </div>
            </div>
            <div id="ciapiClose">
                <button id="ciapiSkinCloseButton" class="govuk-button govuk-button--secondary" data-module="govuk-button">End chat</button>
            </div>
        </div>
    </div>
</div>
`
