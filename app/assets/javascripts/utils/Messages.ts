interface messageTypes {
    computer: string,
    outofhours: string
    ready: string
    busy: string
    active: string
    unavilable: string
    agentMsgPrefix: string
    customerMsgPrefix: string
    systemMsgPrefix: string
    automatedMsgPrefix: string
    adviserExitedChat: string
    agentLeftChat: string
    agentBusy: string
    queue1: string
    queue2: string
    adviserUnavailable: string
}

const contactLink: string = "<a href='https://www.gov.uk/contact'>Contact us</a> "
const contactHMRCLink: string = "<a href='https://www.gov.uk/contact-hmrc' target=‘_blank’> other ways to contact HMRC</a>"

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
    //Transcript.js
    agentMsgPrefix: " Adviser said :",
    customerMsgPrefix: " You said : ",
    systemMsgPrefix: " System message : ",
    automatedMsgPrefix: " Automated message : ",
    //ChatStates
    adviserExitedChat: "Adviser exited chat",
    agentLeftChat: "Agent Left Chat.",
    agentBusy: "All of our agents are currently busy. Please wait and an agent will be with you shortly",
    queue1: "Thank you for your patience, the next available adviser will be with you shortly. You are ",
    queue2: " in the queue",
    adviserUnavailable: `I'm sorry, there are no advisers available right now. You can see ${contactHMRCLink}`

};