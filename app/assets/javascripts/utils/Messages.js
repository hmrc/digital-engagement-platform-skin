const contactLink = "<a href='https://www.gov.uk/contact'>Contact us</a> "
export const messages = {
    //PopupContainerHtml.js / EmbeddedContainerHtml
    computer: "You are currently chatting with a computer",
    //ReactiveChatController.js
    outofhours: "Out of hours",
    ready: "Ask HMRC a question",
    busy: "All advisers are busy",
    active: "In progress",
    //CommonChatController.js
    unavilable: `Sorry, our virtual assistant is unavailable. Try again later. ${contactLink} if you need to speak to someone.`,
    //Transcript.js
    agentMsgPrefix: " Adviser said :",
    customerMsgPrefix: " You said : ",
    systemMsgPrefix: " System message : ",
    automatedMsgPrefix: " Automated message : ",
    //ChatStates
    adviserExitedChat: "Adviser exited chat",
    agentLeftChat: "Agent Left Chat.",
};