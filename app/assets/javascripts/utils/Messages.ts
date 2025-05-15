interface messageTypes {
    computer: string,
    adviser: string,
    chatLoading: string,
    queue: string
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
    agentBusy: string
    queue1: string
    queue2: string
    adviserUnavailable: string
}

const contactLink: string = "<a href='https://www.gov.uk/contact'>Contact us</a> "
const contactHMRCLink: string = "<a href='https://www.gov.uk/contact-hmrc' target=‘_blank’> other ways to contact HMRC</a>"

const adviserReadyAnchorElement = `<a href="#" class="govuk-link" click="event.preventDefault();">Speak to an adviser now</a>`

export const messages: messageTypes = {
    //PopupContainerHtml.js / EmbeddedContainerHtml
    computer: "You're speaking with a digital assistant",
    adviser: "You're speaking in a webchat with an adviser",
    queue: "You're currently in a queue to speak with an adviser",
    chatLoading: "Chat is connecting...",
    //ReactiveChatController.js
    outofhours: "Webchat is now closed.",
    ready: `Advisers are available to chat. ${adviserReadyAnchorElement}`,
    busy: "All of our advisers are busy. When an adviser is available, a ‘speak with an adviser’ link will appear. You do not need to refresh the page.",
    active: "You are in a webchat. If you cannot access it, you may have another chat window open.",
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