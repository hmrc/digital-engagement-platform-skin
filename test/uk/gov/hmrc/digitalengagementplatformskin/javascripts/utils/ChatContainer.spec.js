import ChatContainer from '../../../../../../../app/assets/javascripts/utils/ChatContainer'
import Popup from '../../../../../../../app/assets/javascripts/views/EndChatPopup'
import Transcript from '../../../../../../../app/assets/javascripts/services/Transcript'

jest.mock('../../../../../../../app/assets/javascripts/views/EndChatPopup');
jest.mock('../../../../../../../app/assets/javascripts/services/Transcript');

const nullEventHandler = {
    onSend: jest.fn(),
    onCloseChat: jest.fn(),
    onHideChat: jest.fn(),
    onRestoreChat: jest.fn(),
    onConfirmEndChat: jest.fn(),
    onSoundToggle: jest.fn(),
    onStartTyping: jest.fn(),
    onStopTyping: jest.fn()
};

let chatContainer;

beforeEach(() => {
    chatContainer = new ChatContainer();
});

describe("ChatContainer", () => {

    it("the onStopTying event handler method is called on stopTyping call", () => {
        chatContainer.eventHandler = nullEventHandler;
        chatContainer.stopTyping(chatContainer.eventHandler);
        expect(chatContainer.eventHandler.onStopTyping).toHaveBeenCalled();
    });

    it("the onStartTyping event handler method is called on startTyping call", () => {
        chatContainer.eventHandler = nullEventHandler;
        chatContainer.startTyping(chatContainer.eventHandler);
        expect(chatContainer.eventHandler.onStartTyping).toHaveBeenCalled();
    });

    it("the content element is returned when contentElement is called", () => {
        chatContainer.content = "content"
        expect(chatContainer.contentElement()).toBe("content");
    });

    it("getTranscript returns a new instance of a Transcript", () => {
        let transcript = new Transcript();
        chatContainer.transcript = transcript;
        chatContainer.getTranscript();
        chatContainer.container = document.createElement("div");
        chatContainer.container.id = "ciapiSkin";

        expect(chatContainer.transcript).toBe(transcript);
    });

    it("destroy removes the container container", () => {
        let div1 = document.createElement("div");
        chatContainer.container = document.createElement("div");
        div1.appendChild(chatContainer.container);

        let spy = jest.spyOn(chatContainer.container.parentElement, 'removeChild').mockImplementation();
        chatContainer.destroy();
        expect(spy).toBeCalledWith(chatContainer.container);
    });

    it("minimise adds a minimize class to the container", () => {
        chatContainer.container = document.createElement("div")
        let spy = jest.spyOn(chatContainer.container.classList, 'add').mockImplementation();
        chatContainer.minimise();
        expect(spy).toBeCalledWith('minimised');
    });

    it("restore removes a minimize class from the container", () => {
        chatContainer.container = document.createElement("div")
        let spy = jest.spyOn(chatContainer.container.classList, 'remove').mockImplementation();
        chatContainer.restore();
        expect(spy).toBeCalledWith('minimised');
    });

    it("Mix: process responsive links", () => {

        const SDK = {
            sendRichContentMessage : jest.fn(),
            sendMessage: jest.fn()
        }

        chatContainer = new ChatContainer(null, null, SDK);

        let isMixResponsiveLink = jest.spyOn(chatContainer, 'isMixResponsiveLink')
        let transcriptEvent = jest.spyOn(chatContainer, 'transcriptEvent');

        const event = {
            target : {
                dataset: {
                    "nuanceMessageText": "Northern Ireland",
                    "nuanceMessageData": "{'nvaaType':'formattedLink','selectedItemId':'LOCATION','selectedItemValue':'northern_ireland'}"
                },
                getAttribute : jest.fn().mockReturnValueOnce("#")
            },
            preventDefault: jest.fn()
        }

        chatContainer.transcriptEvent(event);

        expect(transcriptEvent).toBeCalledTimes(1);
        expect(isMixResponsiveLink).toBeCalledTimes(1);
    });

})
