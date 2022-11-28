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
let mockSDK;

beforeEach(() => {
    chatContainer = new ChatContainer();
    mockSDK = {
        sendRichContentMessage : jest.fn().mockImplementation(),
        sendMessage: jest.fn().mockImplementation(),
        sendDataPass: jest.fn().mockImplementation()
    };

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

    it("Mix: process responsive links, send rich content message", () => {
        chatContainer = new ChatContainer(null, null, mockSDK);

        const responsiveLinkEvent = {
            target : {
                dataset: {
                    "nuanceMessageText": "Northern Ireland",
                    "nuanceMessageData":
                        "{'nvaaType':'formattedLink','selectedItemId':'LOCATION','selectedItemValue':'northern_ireland'}"
                },
                getAttribute : jest.fn().mockReturnValue("#")
            },
            preventDefault: jest.fn()
        }

        let isMixResponsiveLink = jest.spyOn(chatContainer, 'isMixResponsiveLink');
        let processTranscriptEvent = jest.spyOn(chatContainer, 'processTranscriptEvent');
        let sanitiseAndParseJsonData = jest.spyOn(chatContainer, 'sanitiseAndParseJsonData');

        chatContainer.processTranscriptEvent(responsiveLinkEvent);

        expect(processTranscriptEvent).toBeCalledTimes(1);
        expect(isMixResponsiveLink).toBeCalledTimes(1);
        expect(sanitiseAndParseJsonData).toBeCalledTimes(1);

        const firstArgToSendRichContentMessage = mockSDK.sendRichContentMessage.mock.calls[0][0];
        const secondArgToSendRichContentMessage = mockSDK.sendRichContentMessage.mock.calls[0][1];

        expect(mockSDK.sendMessage).toBeCalledTimes(0);
        expect(firstArgToSendRichContentMessage).toBe("Northern Ireland");

        expect(secondArgToSendRichContentMessage)
            .toMatchObject({
                nvaaType: 'formattedLink',
                selectedItemId: 'LOCATION',
                selectedItemValue: 'northern_ireland'
            })
    });

    it("Mix: process responsive links, send message", () => {
        chatContainer = new ChatContainer(null, null, mockSDK);

        let isMixResponsiveLink = jest.spyOn(chatContainer, 'isMixResponsiveLink');
        let processTranscriptEvent = jest.spyOn(chatContainer, 'processTranscriptEvent');
        let sanitiseAndParseJsonData = jest.spyOn(chatContainer, 'sanitiseAndParseJsonData');

        const responsiveLinkEvent = {
            target : {
                dataset: {
                    "nuanceMessageText": "Northern Ireland"
                },
                getAttribute : jest.fn().mockReturnValue("#")
            },
            preventDefault: jest.fn()
        }

        chatContainer.processTranscriptEvent(responsiveLinkEvent);

        expect(isMixResponsiveLink).toBeCalledTimes(1);
        expect(processTranscriptEvent).toBeCalledTimes(1);
        expect(mockSDK.sendMessage).toBeCalledTimes(1);

        expect(mockSDK.sendRichContentMessage).toBeCalledTimes(0);
        expect(sanitiseAndParseJsonData).toBeCalledTimes(0);

        const firstArgToSendMessage = mockSDK.sendMessage.mock.calls[0][0];
        expect(firstArgToSendMessage).toBe("Northern Ireland");
    })

 it("Mix: process external links, send datapass", () => {
        chatContainer = new ChatContainer(null, null, mockSDK);

        const externalLinkEvent = {
            target : {
                dataset: {
                    "nuanceMessageText": "Where do you live?",
                    "nuanceDatapass": "{'testDataPass': 'worked'}",
                    "target": "_blank"
                },
                getAttribute : jest.fn().mockReturnValue("https://www.gov.uk/government/organisations/hm-revenue-customs")
            },
            preventDefault: jest.fn()
        }

        let isMixExternalLink = jest.spyOn(chatContainer, 'isMixExternalLink');
        let processTranscriptEvent = jest.spyOn(chatContainer, 'processTranscriptEvent');
        let sanitiseAndParseJsonData = jest.spyOn(chatContainer, 'sanitiseAndParseJsonData');

        chatContainer.processTranscriptEvent(externalLinkEvent);

        expect(isMixExternalLink).toBeCalledTimes(1);
        expect(processTranscriptEvent).toBeCalledTimes(1);
        expect(sanitiseAndParseJsonData).toBeCalledTimes(1);

        expect(mockSDK.sendDataPass).toBeCalledTimes(2);
        const firstCallToSendDataPass = mockSDK.sendDataPass.mock.calls[0][0];
        const secondCallToSendDataPass = mockSDK.sendDataPass.mock.calls[1][0];

        expect(firstCallToSendDataPass).toMatchObject({"ndepVaEvent": "{\"data\":{\"address\":\"https://www.gov.uk/government/organisations/hm-revenue-customs\"},\"event\":\"linkClicked\"}"});
        expect(secondCallToSendDataPass).toMatchObject({ testDataPass: 'worked' });
    });
})
