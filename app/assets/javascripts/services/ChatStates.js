import * as MessageType from '../NuanceMessageType';
import * as MessageState from '../NuanceMessageState';
import { sanitiseAndParseJsonData } from '../utils/JsonUtils';

// State at start, before anything happens.
export class NullState {
    onSend(text) {
        console.error("State Error: Trying to send text with no state.");
    }

    onClickedClose() {
        console.error("State Error: Trying to close chat with no state.");
    }
}

// Chat skin shown, but not engaged yet.
// First input from customer should engage chat.
export class ShownState {
    constructor(engageRequest, closeChat) {
        this.engageRequest = engageRequest;
        this.closeChat = closeChat;
    }

    onSend(text) {
        console.log(">>> not connected: engage request");
        this.engageRequest(text);
    }

    onClickedClose() {
        this.closeChat();
    }
}

// In the process of closing (post-chat survey, etc.)
export class ClosingState {
    constructor(closeChat) {
        this.closeChat = closeChat;
    }

    onSend(text) {
        console.error("State Error: Trying to send text when closing.");
    }

    onClickedClose() {
        this.closeChat();
    }
}

// Customer is engaged in a chat.
export class EngagedState {
    constructor(sdk, container, previousMessages, closeChat) {
        this.sdk = sdk;
        this.container = container;
        this.closeChat = closeChat;
        this.escalated = false;

        this._displayPreviousMessages(previousMessages);
        this._getMessages();
    }

    isEscalated() {
        return this.escalated;
    }

    onSend(text) {
        console.log(">>> connected: send message");
        this.sdk.sendMessage(text);
    }

    onClickedClose() {
        this.closeChat();
    }

    _displayPreviousMessages(messages) {
        for (const message of messages) {
            this._displayMessage(message);
        }
    }

    _isSoundActive() {
        let soundElement = document.getElementById("toggleSound");
        let isActive = null;

        if (soundElement != null) {
            isActive = soundElement.classList.contains("active");
        } else {
            isActive = false;
        }

        return isActive;
    }

    _getMessages() {
        this.sdk.getMessages((msg_in) => this._displayMessage(msg_in));
    }

    _playMessageRecievedSound() {
        let messageReceivedSound = new Audio('../assets/media/message-received-sound.mp3');
        messageReceivedSound.autoplay = true;
        messageReceivedSound.play();
    }

    _removeAgentIsTyping() {
        document.querySelectorAll('.agent-typing').forEach(e => e.remove());
    }

    _removeAgentJoinsConference() {
        document.querySelectorAll('.agent-joins-conference').forEach(e => e.remove());
    }

    _processMessageData(messageData, messageTimeStamp) {
        const jsonMessageData = JSON.parse(messageData);
        if (jsonMessageData.widgetType === "youtube-video") {
            const embeddedVideoUrl = "https://www.youtube.com/embed/" + jsonMessageData.videoId
            const iframeVideo =  `<iframe class="video-message" src="${embeddedVideoUrl}"</iframe>`;
            const transcript = this.container.getTranscript();
            transcript.addAutomatonMsg(iframeVideo, messageTimeStamp);
        }
    }

    _mixAgentCommunicationMessage(msg, transcript) {
        if (this._isSoundActive()) {
            this._playMessageRecievedSound();
        }

        this._removeAgentIsTyping();
        transcript.addAgentMsg(msg.messageText, msg.messageTimestamp);
    }

    _isMixAutomatonMessage(msg) { return msg.isAgentMsg && msg["external.app"]}

    _extractQuickReplyData(msg) {

        if(!msg.messageData) return null

        const messageDataAsObject = sanitiseAndParseJsonData(msg.messageData);

        if(messageDataAsObject &&
            messageDataAsObject.widgetType &&
            messageDataAsObject.widgetType == "quickreply") {
            return messageDataAsObject;
        }

        return null;
    }

    _extractCloseChatEventData(msg) {
        if(!msg.messageData) return null

        const messageDataAsObject = sanitiseAndParseJsonData(msg.messageData);

        if(messageDataAsObject &&
            messageDataAsObject.command &&
            messageDataAsObject.command.event.CloseChat) {
                return messageDataAsObject;
        }

        return null;
    }

    _chatCommunicationMessage(msg, transcript) {
        const quickReplyData = this._extractQuickReplyData(msg);
        const closeChatEventData = this._extractCloseChatEventData(msg);

        if (quickReplyData) {
            transcript.addQuickReply(quickReplyData, msg.messageText, msg.messageTimestamp);
        } else if (closeChatEventData) {
        	this.container.confirmEndChat()
        } else if (this._isMixAutomatonMessage(msg)){
            this._mixAgentCommunicationMessage(msg, transcript);
        } else if (msg.isAgentMsg) {
            this._mixAgentCommunicationMessage(msg, transcript); // Nina
        } else if (msg.chatFinalText != "end this chat and give feedback") { // customer message
            transcript.addCustomerMsg(msg.messageText, msg.messageTimestamp);
        }
    }

    _chatAutomationRequest(msg, transcript) {
        if (this._isSoundActive()) {
            if(!!msg.vaDataPass === false) {
                this._playMessageRecievedSound();
            }
        }

        if(!!msg.vaDataPass) {
            let vaDP = JSON.parse(msg.vaDataPass);
            if (!!vaDP.endVAEngagement) {
                this.closeChat();
            }
        } else {
            transcript.addAutomatonMsg(msg["automaton.data"], msg.messageTimestamp);
            if (msg.messageData) {
                this._processMessageData(msg.messageData, msg.messageTimestamp);
            }
        }
    }

    _chatRoomMemberConnected(msg, transcript) {
        this.escalated = true;
        transcript.addSystemMsg(
            {
                msg: msg["client.display.text"] || msg["display.text"],
                joinTransfer: msg["aeapi.join_transfer"]
            }
        );
    }

    _chatActivityAndAgentTyping(msg, transcript) {
        if(msg.state === MessageState.Agent_IsTyping) {
            if (msg["display.text"] == "Agent is typing...") {
                transcript.addSystemMsg({msg: msg["display.text"], state: MessageState.Agent_IsTyping});
            } else {
                this._removeAgentIsTyping();
            }
        }
    }

    _displayMessage(msg_in) {
        const msg = msg_in.data;

        console.log("---- Received message:", msg);

        // the agent.alias property will only exist on an agent message, and not on a customer message
        if (msg && msg["agent.alias"]) {
            window.Agent_Name = msg["agent.alias"];
        }

        const transcript = this.container.getTranscript();

        switch (msg.messageType) {
            case MessageType.Chat_Communication:
                this._chatCommunicationMessage(msg, transcript);
                break;
            case MessageType.Chat_AutomationRequest:
                this._chatAutomationRequest(msg, transcript);
                break;
            case MessageType.ChatRoom_MemberConnected:
                this._chatRoomMemberConnected(msg, transcript);
                break;
            case MessageType.Chat_Activity:
                this._chatActivityAndAgentTyping(msg, transcript);
                break;
            case MessageType.Chat_Exit:
                transcript.addSystemMsg({msg: (msg["display.text"] || "Adviser exited chat")});
                break;
            case MessageType.Chat_CommunicationQueue:
                transcript.addSystemMsg({msg: msg.messageText});
                break;
            case MessageType.Chat_NeedWait:
                transcript.addSystemMsg({msg: msg.messageText});
                break;
            case MessageType.Chat_Denied:
                transcript.addSystemMsg({msg: msg["thank_you_image_label"]});
                break;
            case MessageType.ChatRoom_MemberLost:
                transcript.addSystemMsg({msg: msg["display.text"]});
                break;
            case MessageType.Owner_TransferResponse:
                this._removeAgentJoinsConference();
                break;
            case MessageType.Chat_System: case MessageType.Chat_TransferResponse:
                transcript.addSystemMsg({msg: msg["client.display.text"]});
                break;
            default:
                if(msg.state === MessageState.Closed) {
                    transcript.addSystemMsg({msg: "Agent Left Chat."});
                } else {
                    console.log("==== Unknown message:", msg);
                }
        }
    }
}
