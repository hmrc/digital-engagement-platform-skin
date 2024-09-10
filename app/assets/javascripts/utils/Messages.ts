interface messageTypes {
    computer: string,
    outofhours: string
    ready: string
    busy: string
    active: string
    unavilable: string
    messageSent: string
    agentMsgPrefix: string
    customerMsgPrefix: string
    systemMsgPrefix: string
    automatedMsgPrefix: string
    adviserExitedChat: string
    agentLeftChat: string
}

const contactLink: string = "<a href='https://www.gov.uk/contact'>Contact us</a> "

export const messages: messageTypes = {
    //PopupContainerHtml.js / EmbeddedContainerHtml
    computer: "You are currently chatting with a computer",
    //ReactiveChatController.js
    outofhours: "Out of hours",
    ready: "Ask HMRC a question",
    busy: "All advisers are busy",
    active: "In progress",
    //CommonChatController.js
    unavilable: `Sorry, our virtual assistant is unavailable. Try again later. ${contactLink} if you need to speak to someone.`,
    messageSent: 'The message has been sent',
    //Transcript.js
    agentMsgPrefix: " Adviser said :",
    customerMsgPrefix: " You said : ",
    systemMsgPrefix: " System message : ",
    automatedMsgPrefix: " Automated message : ",
    //ChatStates
    adviserExitedChat: "Adviser exited chat",
    agentLeftChat: "Agent Left Chat.",
};