import * as MessageType from '../NuanceMessageType';
import * as MessageState from '../NuanceMessageState';

// State at start, before anything happens.
export class NullState {
    onSend(text) {
        console.error("State Error: Trying to send text with no state. ");
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

    _displayMessage(msg_in) {
        const msg = msg_in.data
        console.log("---- Received message:", msg);
        if (msg && msg.senderName) {
            window.Agent_Name = msg.senderName;
        }
        const transcript = this.container.getTranscript();
        if (msg.messageType === MessageType.Chat_Communication) {
            if (msg.agentID) {
                if (this._isSoundActive()) {
                    this._playMessageRecievedSound();
                }
                this._removeAgentIsTyping();
                transcript.addAgentMsg(msg.messageText, msg.messageTimestamp);
            } else {
                if(msg.chatFinalText != "end this chat and give feedback") {
                    transcript.addCustomerMsg(msg.messageText, msg.messageTimestamp);
                }
            }
        } else if (msg.messageType === MessageType.Chat_AutomationRequest) {
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
            }
        } else if (msg.messageType === MessageType.Chat_Exit) {
            transcript.addSystemMsg({msg: (msg["display.text"] || "Adviser exited chat")});
        } else if (msg.state === MessageState.Closed) {
            transcript.addSystemMsg({msg: "Agent Left Chat."});
        } else if (msg.messageType === MessageType.Chat_CommunicationQueue) {
            transcript.addSystemMsg({msg: msg.messageText});
        } else if (msg.messageType === MessageType.ChatRoom_MemberConnected) {
            this.escalated = true;
            transcript.addSystemMsg(
                {
                    msg: msg["client.display.text"] || msg["display.text"],
                    joinTransfer: msg["aeapi.join_transfer"]
                }
            );
        } else if (msg.messageType === MessageType.Chat_Denied) {
            transcript.addSystemMsg({msg: "No agents are available."});
        } else if (msg.messageType === MessageType.ChatRoom_MemberLost) {
            transcript.addSystemMsg({msg: msg["display.text"]});
        } else if (msg.messageType === MessageType.Owner_TransferResponse) {
            this._removeAgentJoinsConference();
        } else if (msg.messageType === MessageType.Chat_Activity && msg.state === MessageState.Agent_IsTyping) {
            if (msg["display.text"] == "Agent is typing...") {
                transcript.addSystemMsg({msg: msg["display.text"], state: MessageState.Agent_IsTyping});
            } else {
                this._removeAgentIsTyping();
            }
        } else if ([
                MessageType.Chat_System,
                MessageType.Chat_TransferResponse,
            ].includes(msg.messageType)) {
            transcript.addSystemMsg({msg: msg["client.display.text"]});
        } else {
            console.log("==== Unknown message:", msg);
        }
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
