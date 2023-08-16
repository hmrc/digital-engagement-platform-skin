import * as MessageType from '../NuanceMessageType';
import * as logger from '../utils/logger';
import * as MessageState from '../NuanceMessageState';
import { host } from '../utils/HostUtils';

// State at start, before anything happens.
export class NullState {
    onSend(text) {
        logger.error("State Error: Trying to send text with no state.");
    }

    onClickedClose() {
        logger.error("State Error: Trying to close chat with no state.");
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
        logger.info(">>> not connected: engage request");
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
        logger.error("State Error: Trying to send text when closing.");
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
        logger.info(">>> connected: send message");
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
        let messageReceivedSound = new Audio( host + '/engagement-platform-skin/assets/media/message-received-sound.mp3');
        messageReceivedSound.autoplay = true;
        messageReceivedSound.play();
    }

    _removeAgentIsTyping() {
        document.querySelectorAll('.agent-typing').forEach(e => e.remove());
    }

    _removeAgentJoinsConference() {
        document.querySelectorAll('.agent-joins-conference').forEach(e => e.remove());
    }

    _processMessageYouTubeVideoData(msg, messageTimeStamp) {
        const jsonMessageData = JSON.parse(msg.messageData);
        const youtubeURL = "https://www.youtube.com/watch?v=" + jsonMessageData.videoId
        if (jsonMessageData.widgetType === "youtube-video") {
            const embeddedVideoUrl = "https://www.youtube.com/embed/" + jsonMessageData.videoId
            const iframeVideo =  `<p>${msg.messageText}</p><p><a href="${youtubeURL}" target="_blank"> ${youtubeURL}</a> (opens in new tab)</p><div class="iframe-wrap"><iframe class="video-message" frameborder="0" allowFullScreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" src="${embeddedVideoUrl}"></iframe></div>`;
            const transcript = this.container.getTranscript();
            this._playSoundIfActive();
            transcript.addAutomatonMsg(iframeVideo, messageTimeStamp);
        }
    }

    _mixAgentCommunicationMessage(msg, transcript) {
        this._playSoundIfActive();

        this._removeAgentIsTyping();
        transcript.addAgentMsg(msg.messageText, msg.messageTimestamp);
    }

    _isMixAutomatonMessage(msg) { return msg.isAgentMsg && msg["external.app"]}

    _extractQuickReplyData(msg) {

        if(!msg.messageData) return null

        const messageDataAsObject = JSON.parse(msg.messageData);

        if(messageDataAsObject &&
            messageDataAsObject.widgetType &&
            messageDataAsObject.widgetType == "quickreply") {
            return messageDataAsObject;
        }

        return null;
    }

    _extractCloseChatEventData(msg) {
        if(!msg.messageData) return null

        const messageDataAsObject = JSON.parse(msg.messageData);

        if(messageDataAsObject &&
            messageDataAsObject.command &&
            messageDataAsObject.command.event.CloseChat) {
                return messageDataAsObject;
        }

        return null;
    }

    _extractYouTubeVideoData(msg) {
        if(!msg.messageData) return null

        const messageDataAsObject = JSON.parse(msg.messageData);

        if(messageDataAsObject &&
            messageDataAsObject.widgetType &&
            messageDataAsObject.widgetType == "youtube-video") {
            return messageDataAsObject;
        }

        return null;
    }

    _playSoundIfActive() {
        if (this._isSoundActive()) {
            this._playMessageRecievedSound();
        }
    }

    _chatCommunicationMessage(msg, transcript) {
        const quickReplyData = this._extractQuickReplyData(msg);
        const closeChatEventData = this._extractCloseChatEventData(msg);
        const youTubeVideo = this._extractYouTubeVideoData(msg);

        if (quickReplyData) {
            this._playSoundIfActive();
            transcript.addQuickReply(quickReplyData, msg.messageText, msg.messageTimestamp);
        } else if (closeChatEventData) {
            this.closeChat();
        } else if (youTubeVideo) {
            if (msg.messageData) {
                this._processMessageYouTubeVideoData(msg, msg.messageTimestamp);
            }
        } else if (this._isMixAutomatonMessage(msg)){
            this._mixAgentCommunicationMessage(msg, transcript);
        } else if (msg.isAgentMsg) {
            this._mixAgentCommunicationMessage(msg, transcript); // Agent
        } else if (msg.chatFinalText != "end this chat and give feedback") { // customer message
            transcript.addCustomerMsg(msg.messageText, msg.messageTimestamp);
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

    _chatRoomMemberLost(msg, transcript) {
        if (msg["tc.mode"] === "transfer" && msg["display.text"] === "Agent 'HMRC' loses connection") {
            logger.info("Message Suppressed")
        } else {
            transcript.addSystemMsg({msg: msg["display.text"]});
        }
    }

    _displayMessage(msg_in) {
        const msg = msg_in.data;
        logger.debug("---- Received message:", msg)

        // the agent.alias property will only exist on an agent message, and not on a customer message
        if (msg && msg["agent.alias"]) {
            window.Agent_Name = msg["agent.alias"];
        }

        const transcript = this.container.getTranscript();

        switch (msg.messageType) {
            case MessageType.Chat_Communication:
                this._chatCommunicationMessage(msg, transcript);
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
                this._chatRoomMemberLost(msg, transcript);
                break;
            case MessageType.Owner_TransferResponse:
                this._removeAgentJoinsConference();
                break;
            case MessageType.Chat_System: case MessageType.Chat_TransferResponse:
                if(msg["client.display.text"] == '') {
                    break;
                } else {
                    transcript.addSystemMsg({msg: msg["client.display.text"]})
                    break;
                }
            default:
                if(msg.state === MessageState.Closed) {
                    transcript.addSystemMsg({msg: "Agent Left Chat."});
                } else {
                    logger.debug("==== Unknown message:", msg);
                }
        }
    }
}
