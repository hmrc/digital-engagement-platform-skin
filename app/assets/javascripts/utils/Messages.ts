interface messageTypes {
    computer: string,
    adviser: string,
    chatLoading: string,
    queue: string
    outofhours: string
    ready: string
    readyHeading: string
    busy: string
    busyHeading: string
    active: string
    c2cButton: string
    unavilable: string
    messageSent: string
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
    computer: "You're speaking with a digital assistant",
    adviser: "You're chatting with an adviser",
    queue: "You're in a queue to chat with an adviser",
    chatLoading: "Chat is connecting...",
    //ReactiveChatController.js
    outofhours: "Webchat is closed.",
    ready: `You may join a queue before you’re connected to an adviser.`,
    readyHeading: "Advisers are available",
    busy: "When an adviser is available, you’ll be able to select the ‘Speak to an adviser’ button.",
    busyHeading: "Advisers are busy",
    c2cButton: "Speak to an adviser",
    active: "You're connected to webchat. If the chat does not pop up, it might be open on another page.",
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
    agentBusy: "All of our agents are currently busy. Please wait and an agent will be with you shortly",
    queue1: "Thank you for your patience, the next available adviser will be with you shortly. You are ",
    queue2: " in the queue",
    adviserUnavailable: `I'm sorry, there are no advisers available right now. You can see ${contactHMRCLink}`
};