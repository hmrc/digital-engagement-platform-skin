import * as MessageType from '../NuanceMessageType';
import * as logger from '../utils/logger';
import * as MessageState from '../NuanceMessageState';
import { host } from '../utils/HostUtils';
import { messages } from '../utils/Messages';
import ChatContainer from '../utils/ChatContainer';
import Transcript from './Transcript';

interface MessageInterface { 
    "aeapi.join_transfer"?: any
    chatFinalText?: string
    "client.display.text"?: string;
    "display.text"?: string;
    "external.app"?: string
    isAgentMsg?: boolean
    messageData?: string | null
    messageText?: string; 
    messageTimestamp?: string;
    state?: string;
    "tc.mode"?: string
}
// James - I have added an interface here for the msg parameter. It is an object and I have marked all of the properties as optional because not all of them are used in every method and sometimes they are not present until the DA / Web chat responds with certain answers. Are you happy with this approach? it made the code a lot DRYer and probably safer but previously I had tried to state when parameters were optional or not.

// State at start, before anything happens.
export class NullState {
    onSend() {
        logger.error("State Error: Trying to send text with no state.");
    }

    onClickedClose() {
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
    // James - Do you mind double checking the two above please? I typed these through searching for ShownState and looking in the CommonChatController file. I used the console to type text: string.

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
    constructor(sdk: any, container: ChatContainer, previousMessages: any[], closeChat: () => void) {
        this.sdk = sdk;
        this.container = container;
        // James - Please can you check whether container is ever null or undefined? My findings are that it probably is not based on the ChatContainer.ts where container is a div and has the ID #ciapiSkin which I can see in the console when logging container. There is also the _launchChat method in the CommonChatController which seems to return if container is truthy. This is important because I have not put it as undefined | null and if it is the code below will need some complex tweaks.

        this.closeChat = closeChat;
        this.escalated = false;

        this._displayPreviousMessages(previousMessages);
        this._getMessages();
    }
    // PreviousMessages array is quite a complex array of objects from Nunace. Quite tricky to type specifically.

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

    _displayPreviousMessages(messages: any[]) {
        for (const message of messages) {
            this._displayMessage(message);
        }
    }

    _isSoundActive(): boolean {
        let soundElement: HTMLElement | null = document.getElementById("toggleSound");
        let isActive: boolean | null = null;

        if (soundElement != null) {
            isActive = soundElement.classList.contains("active");
        } else {
            isActive = false;
        }

        return isActive;
    }

    _getMessages(): void {
        this.sdk.getMessages((msg_in: any) => this._displayMessage(msg_in));
    }

    _playMessageRecievedSound(): void {
        let messageReceivedSound: HTMLAudioElement = new Audio( host + '/engagement-platform-skin/assets/media/message-received-sound.mp3');
        messageReceivedSound.autoplay = true;
        messageReceivedSound.play();
    }

    _removeAgentIsTyping(): void {
        document.querySelectorAll('.agent-typing').forEach(e => e.remove());
    }

    _removeAgentJoinsConference(): void {
        document.querySelectorAll('.agent-joins-conference').forEach(e => e.remove());
    }

    _processMessageYouTubeVideoData(msg: MessageInterface, messageTimeStamp?: string) {
        if(!msg.messageData){
            return
        }
        const jsonMessageData: { videoId: string, widgetType: string} = JSON.parse(msg.messageData);
        const youtubeURL: string = "https://www.youtube.com/watch?v=" + jsonMessageData.videoId
        if (jsonMessageData.widgetType === "youtube-video") {
            const embeddedVideoUrl: string = "https://www.youtube.com/embed/" + jsonMessageData.videoId
            const iframeVideo: string =  `<p>${msg.messageText}</p><span class="govuk-visually-hidden">embedded youtube video below with url</span><div class="iframe-wrap"><iframe title="Embedded YouTube Video" class="video-message" frameborder="0" allowFullScreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" src="${embeddedVideoUrl}"></iframe></div>`;
            const transcript: Transcript | undefined = this.container.getTranscript();
            this._playSoundIfActive();
            transcript.addAutomatonMsg(iframeVideo, messageTimeStamp);
        }
    }

    // How do you want youtubeURL handled, apparently it is not being used?

    _mixAgentCommunicationMessage(msg: MessageInterface, transcript: Transcript ) {
        this._playSoundIfActive();

        this._removeAgentIsTyping();
            transcript.addAgentMsg(msg.messageText, msg.messageTimestamp);
    }
    // James - I have used the inference to set the above types and the console to check them. msg is correct based on the console but I cannot guarantee they will always be that type but I think it is likely. In terms of addAgentMsg, would I expect to see this in the console when logging transcript. I could not see this on the object but VSCode inference thinks it is correct. FYI, I have tweaked the argument names as VSCode called them arg0 and arg1 but we can see what they are in the method. Do you have any ideas please?

    _isMixAutomatonMessage(msg: MessageInterface): string | false | undefined {
        return msg.isAgentMsg && msg["external.app"]
    }

    _extractQuickReplyData(msg: MessageInterface): null | {} {

        if(!msg.messageData) return null

        const messageDataAsObject: {widgetType: string} = JSON.parse(msg.messageData);

        if(messageDataAsObject &&
            messageDataAsObject.widgetType &&
            messageDataAsObject.widgetType == "quickreply") {
            return messageDataAsObject;
        }

        return null;
    }

    _extractCloseChatEventData(msg: MessageInterface): {} | null {
        
        if(!msg.messageData) return null

        const messageDataAsObject: { command?: {event: {CloseChat: boolean}} } = JSON.parse(msg.messageData);

        if(messageDataAsObject &&
            messageDataAsObject.command &&
            messageDataAsObject.command.event.CloseChat) {
                return messageDataAsObject;
        }

        return null;
    }
    // James - I think this is typed correctly with the exception of const messageDataAsObject: { command?: {event: {CloseChat: boolean}} }. I could not find command on the object which makes me think it must be a optional parameter depending on what has been received from Nuance. I have typed it as boolean based solely on the name so it would be nice to confirm this. Do you have any ideas so that I can confirm what we are receiving?

    _extractYouTubeVideoData(msg: MessageInterface): {} | null {
        if(!msg.messageData) return null

        const messageDataAsObject: {widgetType: string} = JSON.parse(msg.messageData);

        if(messageDataAsObject &&
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
        console.log('TRANSCRIPT', transcript)
        const quickReplyData: {} | null = this._extractQuickReplyData(msg);
        const closeChatEventData: {} | null = this._extractCloseChatEventData(msg);
        const youTubeVideo: {} | null = this._extractYouTubeVideoData(msg);

        if (quickReplyData) {
            this._playSoundIfActive();
            transcript.addQuickReply(quickReplyData, msg.messageText, msg.messageTimestamp);
        } else if (closeChatEventData) {
            this.closeChat();
        } else if (youTubeVideo) {
                this._processMessageYouTubeVideoData(msg, msg.messageTimestamp);
        } else if (this._isMixAutomatonMessage(msg)){
            this._mixAgentCommunicationMessage(msg, transcript);
        } else if (msg.isAgentMsg) {
            this._mixAgentCommunicationMessage(msg, transcript); // Agent
        } else if (msg.chatFinalText != "end this chat and give feedback") { // customer message
            transcript.addCustomerMsg(msg.messageText, msg.messageTimestamp);
        }
    }

    _chatRoomMemberConnected(msg: MessageInterface, transcript: Transcript) {
        this.escalated = true;
        transcript.addSystemMsg(
            {
                msg: msg["client.display.text"] || msg["display.text"],
                joinTransfer: msg["aeapi.join_transfer"]
            },
            msg.messageTimestamp
        );
    }
    // "aeapi.join_transfer" not on the object in the console.log so have left as any.

    _chatActivityAndAgentTyping(msg: MessageInterface, transcript: Transcript) {
        if(msg.state === MessageState.Agent_IsTyping) {
            if (msg["display.text"] == "Agent is typing...") {
                transcript.addSystemMsg({msg: msg["display.text"], state: MessageState.Agent_IsTyping}, msg.messageTimestamp);
            } else {
                this._removeAgentIsTyping();
            }
        }
    }

    _chatRoomMemberLost(msg: MessageInterface, transcript: Transcript) {
        if (msg["tc.mode"] === "transfer" && (msg["display.text"] === "Agent 'HMRC' loses connection" || msg["display.text"] === "Agent 'hmrcda' loses connection")) {
            logger.info("Message Suppressed")
        } else {
            transcript.addSystemMsg({msg: msg["display.text"]}, msg.messageTimestamp);
        }
    }

    _displayMessage(msg_in: { data: { "agent.alias"?: string; messageType?: string; "display.text"?: string; messageTimestamp?: string; messageText?: string; "thank_you_image_label"?: any; "client.display.text"?: string; state?: string }; }) {
        const msg = msg_in.data;
        logger.debug("---- Received message:", msg)

        // the agent.alias property will only exist on an agent message, and not on a customer message
        if (msg && msg["agent.alias"]) {
            window.Agent_Name = msg["agent.alias"];
        }

        const transcript: Transcript = this.container.getTranscript();
        // James - Is transcript ever undefined? I do not think it is based on the transcript being set on line 70 of the chat container?
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
                transcript.addSystemMsg({msg: (msg["display.text"] || messages.adviserExitedChat)}, msg.messageTimestamp);
                break;
            case MessageType.Chat_CommunicationQueue:
                transcript.addSystemMsg({msg: msg.messageText}, msg.messageTimestamp);
                break;
            case MessageType.Chat_NeedWait:
                transcript.addSystemMsg({msg: msg.messageText}, msg.messageTimestamp);
                break;
            case MessageType.Chat_Denied:
                transcript.addSystemMsg({msg: msg["thank_you_image_label"]}, msg.messageTimestamp);
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
                    transcript.addSystemMsg({msg: msg["client.display.text"]}, msg.messageTimestamp)
                    break;
                }
            default:
                if(msg.state === MessageState.Closed) {
                    transcript.addSystemMsg({msg: messages.agentLeftChat}, msg.messageTimestamp);
                } else {
                    logger.debug("==== Unknown message:", msg);
                }
        }
    }
}
