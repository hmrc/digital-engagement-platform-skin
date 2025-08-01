import * as MessageType from '../NuanceMessageType';
import * as logger from '../utils/logger';
import * as MessageState from '../NuanceMessageState';
import { host } from '../utils/HostUtils';
import { messages } from '../utils/Messages';
import ChatContainer from '../utils/ChatContainer';
import Transcript from './Transcript';
import { QuickReplyData } from '../types';

interface MessageInterface {
    "aeapi.join_transfer"?: any
    "agent.alias"?: string;
    chatFinalText?: string;
    "client.display.text"?: string;
    "display.text"?: string;
    "external.app"?: string;
    isAgentMsg?: boolean;
    messageData?: string | null;
    messageText?: string;
    messageTimestamp?: string;
    messageType?: string;
    state?: string;
    "tc.mode"?: string;
    "thank_you_image_label"?: any;
    "queueDepth": string
}

// State at start, before anything happens.
export class NullState {
    onSend(): void {
        logger.error("State Error: Trying to send text with no state.");
    }

    onClickedClose(): void {
        logger.error("State Error: Trying to close chat with no state.");
    }
}

// Chat skin shown, but not engaged yet.
// First input from customer should engage chat.
export class ShownState {
    engageRequest: (text: string) => void
    closeChat: () => void
    constructor(engageRequest: (text: string) => void, closeChat: () => void) {
        this.engageRequest = engageRequest;
        this.closeChat = closeChat;
    }

    onSend(text: string): void {
        logger.info(">>> not connected: engage request");
        this.engageRequest(text);
    }

    onClickedClose(): void {
        this.closeChat();
    }
}

// In the process of closing (post-chat survey, etc.)
export class ClosingState {
    closeChat: () => void;
    constructor(closeChat: () => void) {
        this.closeChat = closeChat;
    }

    onSend(): void {
        logger.error("State Error: Trying to send text when closing.");
    }

    onClickedClose(): void {
        this.closeChat();
    }
}

// Customer is engaged in a chat.
export class EngagedState {
    sdk: any;
    container: ChatContainer
    closeChat: () => void;
    escalated: boolean;
    constructor(sdk: any, container: ChatContainer, previousMessages: [], closeChat: () => void) {
        this.sdk = sdk;
        this.container = container;

        this.closeChat = closeChat;
        this.escalated = false;

        this._displayPreviousMessages(previousMessages);
        this._getMessages();
    }

    isEscalated(): boolean {
        return this.escalated;
    }

    onSend(text: string): void {
        logger.info(">>> connected: send message");
        this.sdk.sendMessage(text);
    }

    onClickedClose(): void {
        this.closeChat();
    }

    _displayPreviousMessages(messages: []): void {
        sessionStorage.setItem("suppressNotificationSound", "true")
        for (const message of messages) {
            this._displayMessage(message);
        }
    }

    _isSoundActive(): boolean {
        if ((sessionStorage.getItem("isActive") == "true") && (sessionStorage.getItem("suppressNotificationSound") == "false")){
            return true
        } else {
            return false
        }
    }

    _getMessages(): void {
        if (sessionStorage.getItem("suppressNotificationSound") == "true"){
            sessionStorage.setItem("suppressNotificationSound", "false")
        }
        this.sdk.getMessages((msg_in: { data: MessageInterface; }) => this._displayMessage(msg_in));
    }

    _playMessageRecievedSound(): void {
        let messageReceivedSound: HTMLAudioElement = new Audio(host + '/engagement-platform-skin/assets/media/message-received-sound.mp3');
        messageReceivedSound.autoplay = true;
        messageReceivedSound.play();
    }

    _removeAgentIsTyping(): void {
        document.querySelectorAll('.agent-typing').forEach(e => e.remove());
    }

    _removeAgentJoinsConference(): void {
        document.querySelectorAll('.agent-joins-conference').forEach(e => e.remove());
    }

    _processMessageYouTubeVideoData(msg: MessageInterface, messageTimeStamp: string): void {
        if (!msg.messageData) {
            return
        }
        const jsonMessageData: { videoId: string, widgetType: string } = JSON.parse(msg.messageData);
        // const youtubeURL: string = "https://www.youtube.com/watch?v=" + jsonMessageData.videoId ** Embedded youtube videos have been removed but keeping the code in case we need it.
        if (jsonMessageData.widgetType === "youtube-video") {
            const embeddedVideoUrl: string = "https://www.youtube.com/embed/" + jsonMessageData.videoId
            const iframeVideo: string = `<p>${msg.messageText}</p><span class="govuk-visually-hidden">embedded youtube video below with url</span><div class="iframe-wrap"><iframe title="Embedded YouTube Video" class="video-message" frameborder="0" allowFullScreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" src="${embeddedVideoUrl}"></iframe></div>`;
            const transcript: Transcript | undefined = this.container.getTranscript();
            this._playSoundIfActive();
            transcript.addAutomatonMsg(iframeVideo, messageTimeStamp!);
        }
    }

    _mixAgentCommunicationMessage(msg: MessageInterface, transcript: Transcript): void {
        this._playSoundIfActive();

        this._removeAgentIsTyping();
        transcript.addAgentMsg(msg.messageText!, msg.messageTimestamp!);
    }

    _isMixAutomatonMessage(msg: MessageInterface): string | false | undefined {
        return msg.isAgentMsg && msg["external.app"]
    }

    _extractQuickReplyData(msg: MessageInterface): null | QuickReplyData {

        if (!msg.messageData) return null

        const messageDataAsObject: QuickReplyData = JSON.parse(msg.messageData);

        if (messageDataAsObject &&
            messageDataAsObject.widgetType &&
            messageDataAsObject.widgetType == "quickreply") {
            return messageDataAsObject;
        }

        return null;
    }

    _extractCloseChatEventData(msg: MessageInterface): {} | null {

        if (!msg.messageData) return null

        const messageDataAsObject: { command?: { event: { CloseChat: any } } } = JSON.parse(msg.messageData);

        if (messageDataAsObject &&
            messageDataAsObject.command &&
            messageDataAsObject.command.event.CloseChat) {
            return messageDataAsObject;
        }

        return null;
    }

    _extractYouTubeVideoData(msg: MessageInterface): QuickReplyData | null {
        if (!msg.messageData) return null

        const messageDataAsObject: QuickReplyData = JSON.parse(msg.messageData);

        if (messageDataAsObject &&
            messageDataAsObject.widgetType &&
            messageDataAsObject.widgetType == "youtube-video") {
            return messageDataAsObject;
        }

        return null;
    }

    _playSoundIfActive(): void {
        if (this._isSoundActive()) {
            this._playMessageRecievedSound();
        }
    }

    _chatCommunicationMessage(msg: MessageInterface, transcript: Transcript): void {
        const quickReplyData: QuickReplyData | null = this._extractQuickReplyData(msg);
        const closeChatEventData: {} | null = this._extractCloseChatEventData(msg);
        const youTubeVideo: {} | null = this._extractYouTubeVideoData(msg);

        if (quickReplyData) {
            this._playSoundIfActive();
            transcript.addQuickReply(quickReplyData, msg.messageText!, msg.messageTimestamp!);
        } else if (closeChatEventData) {
            this.closeChat();
        } else if (youTubeVideo) {
            if (msg.messageData) {
                this._processMessageYouTubeVideoData(msg, msg.messageTimestamp!);
            }
        } else if (this._isMixAutomatonMessage(msg)) {
            this._mixAgentCommunicationMessage(msg, transcript);
        } else if (msg.isAgentMsg) {
            this._mixAgentCommunicationMessage(msg, transcript); // Agent
        } else if (msg.chatFinalText != "end this chat and give feedback") { // customer message
            transcript.addCustomerMsg(msg.messageText!, msg.messageTimestamp!);
        }
    }

    _chatRoomMemberConnected(msg: MessageInterface, transcript: Transcript): void {
        this.escalated = true;
        transcript.addSystemMsg(
            {
                msg: msg["client.display.text"] || msg["display.text"],
                joinTransfer: msg["aeapi.join_transfer"]
            },
            msg.messageTimestamp
        );
    }

    _chatActivityAndAgentTyping(msg: MessageInterface, transcript: Transcript): void {
        this.escalated = true
        if (msg.state === MessageState.Agent_IsTyping) {
            if (msg["display.text"] == "Agent is typing...") {
                transcript.addSystemMsg({ msg: msg["display.text"], state: MessageState.Agent_IsTyping }, msg.messageTimestamp);
            } else {
                this._removeAgentIsTyping();
            }
        }
    }

    _chatRoomMemberLost(msg: MessageInterface, transcript: Transcript): void {
        if (msg["tc.mode"] === "transfer" && (msg["display.text"] === "Agent 'HMRC' loses connection" || msg["display.text"] === "Agent 'hmrcda' loses connection")) {
            logger.info("Message Suppressed")
        } else {
            transcript.addSystemMsg({ msg: msg["display.text"] }, msg.messageTimestamp);
        }
    }

    _displayMessage(msg_in: { data: MessageInterface; }): void {
        const msg: MessageInterface = msg_in.data;
        console.log(">>>>>>>_displayMessage")
        logger.debug("---- Received message:", msg)

        // the agent.alias property will only exist on an agent message, and not on a customer message
        let systemMessageBanner: HTMLElement | null = document.getElementById('systemMessageBanner')
        if (msg && msg["agent.alias"]) {
            window.Agent_Name = msg["agent.alias"];
            if (systemMessageBanner) {
                if (msg["agent.alias"] !== "hmrcda") {
                    systemMessageBanner.textContent = messages.adviser
                } else {
                    systemMessageBanner.textContent = messages.computer
                }
            }
        } else if (msg["queueDepth"]){
            if (systemMessageBanner) {
                systemMessageBanner.textContent = messages.queue
            }
        }

        const transcript: Transcript = this.container.getTranscript();
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
                transcript.addSystemMsg({ msg: (msg["display.text"] || messages.adviserExitedChat) }, msg.messageTimestamp!);
                break;
            case MessageType.Chat_CommunicationQueue:
                transcript.addSystemMsg({ msg: (msg.messageText || messages.agentBusy) }, msg.messageTimestamp);
                break;
            case MessageType.Chat_NeedWait:
                transcript.addSystemMsg({ msg: (msg.messageText || messages.queue1 + msg["queueDepth"] + messages.queue2) }, msg.messageTimestamp);
                break;
            case MessageType.Chat_Denied:
                transcript.addSystemMsg({ msg: (msg["thank_you_image_label"] || messages.adviserUnavailable) }, msg.messageTimestamp);
                break;
            case MessageType.ChatRoom_MemberLost:
                this._chatRoomMemberLost(msg, transcript);
                break;
            case MessageType.Owner_TransferResponse:
                this._removeAgentJoinsConference();
                break;
            case MessageType.Chat_System: case MessageType.Chat_TransferResponse:
                if (msg["client.display.text"] == '') {
                    break;
                } else {
                    transcript.addSystemMsg({ msg: msg["client.display.text"] }, msg.messageTimestamp!)
                    break;
                }
            default:
                if (msg.state === MessageState.Closed) {
                    transcript.addSystemMsg({ msg: messages.agentLeftChat }, msg.messageTimestamp!);
                } else {
                    logger.debug("==== Unknown message:", msg);
                }
        }
    }
}