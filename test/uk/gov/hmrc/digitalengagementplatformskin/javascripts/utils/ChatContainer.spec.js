import ChatContainer from '../../../../../../../app/assets/javascripts/utils/ChatContainer';
import Popup from '../../../../../../../app/assets/javascripts/views/EndChatPopup';
import Transcript from '../../../../../../../app/assets/javascripts/services/Transcript';
import * as JsonUtils from '../../../../../../../app/assets/javascripts/utils/JsonUtils';

jest.mock('../../../../../../../app/assets/javascripts/views/EndChatPopup');
jest.mock('../../../../../../../app/assets/javascripts/services/Transcript');

let nullEventHandler;
let chatContainer;
let mockSDK;
let sanitiseAndParseJsonData = jest.spyOn(JsonUtils, 'sanitiseAndParseJsonData');

beforeEach(() => {

    nullEventHandler = {
        onSend: jest.fn(),
        onCloseChat: jest.fn(),
        onHideChat: jest.fn(),
        onRestoreChat: jest.fn(),
        onConfirmEndChat: jest.fn(),
        onSoundToggle: jest.fn(),
        onStartTyping: jest.fn(),
        onStopTyping: jest.fn()
    };

    chatContainer = new ChatContainer();
    mockSDK = {
        sendRichContentMessage : jest.fn().mockImplementation(),
        sendMessage: jest.fn().mockImplementation(),
        sendDataPass: jest.fn().mockImplementation()
    };

    sanitiseAndParseJsonData.mockRestore(); // reset JsonUtils sanitiseAndParseJsonData counter before each test
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

        let processTranscriptEvent = jest.spyOn(chatContainer, 'processTranscriptEvent');
        sanitiseAndParseJsonData = jest.spyOn(JsonUtils, 'sanitiseAndParseJsonData');

        chatContainer.processTranscriptEvent(responsiveLinkEvent);

        expect(processTranscriptEvent).toBeCalledTimes(1);
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

        let processTranscriptEvent = jest.spyOn(chatContainer, 'processTranscriptEvent');
        sanitiseAndParseJsonData = jest.spyOn(JsonUtils, 'sanitiseAndParseJsonData');

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

        let processTranscriptEvent = jest.spyOn(chatContainer, 'processTranscriptEvent');
        sanitiseAndParseJsonData = jest.spyOn(JsonUtils, 'sanitiseAndParseJsonData');

        chatContainer.processTranscriptEvent(externalLinkEvent);

        expect(processTranscriptEvent).toBeCalledTimes(1);
        expect(sanitiseAndParseJsonData).toBeCalledTimes(1);

        expect(mockSDK.sendDataPass).toBeCalledTimes(2);
        const firstCallToSendDataPass = mockSDK.sendDataPass.mock.calls[0][0];
        const secondCallToSendDataPass = mockSDK.sendDataPass.mock.calls[1][0];

        expect(firstCallToSendDataPass).toMatchObject({"ndepVaEvent": "{\"data\":{\"address\":\"https://www.gov.uk/government/organisations/hm-revenue-customs\"},\"event\":\"linkClicked\"}"});
        expect(secondCallToSendDataPass).toMatchObject({ testDataPass: 'worked' });
    });

    it("Mix: process keypress", () => {
        jest.useFakeTimers();
        jest.spyOn(global, 'setTimeout');
        jest.spyOn(global, 'clearTimeout');

        chatContainer = new ChatContainer(null, null, mockSDK);
        chatContainer.eventHandler = nullEventHandler;

        let resetStopTypingTimeoutSpy = jest.spyOn(chatContainer, '_resetStopTypingTimeout');
        let startTypingSpy = jest.spyOn(chatContainer, 'startTyping');

        const enterKey = 13;
        const keypressEvent = {
            which: enterKey,
            preventDefault: jest.fn()
        }

        chatContainer.processKeypressEvent(keypressEvent);

        expect(resetStopTypingTimeoutSpy).toBeCalledTimes(1);
        expect(startTypingSpy).toBeCalledTimes(1);
        expect(chatContainer.eventHandler.onStartTyping).toBeCalledTimes(1);
        expect(chatContainer.eventHandler.onSend).toBeCalledTimes(1);
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 3000, nullEventHandler);

        chatContainer.processKeypressEvent(keypressEvent); // send second keypress to call clearTimeout for previous setTimeout call
        expect(clearTimeout).toBeCalled();

    });

    it("clicking the send button fires the expected handler function", () => {

        chatContainer.container.innerHTML = 
            `<button id="ciapiSkinSendButton" class="govuk-button" data-module="govuk-button">Send Message</button>`

        const registerEventListenerSpy = jest.spyOn(chatContainer, '_registerEventListener');
        chatContainer._registerEventListeners();

        jest.spyOn(chatContainer.eventHandler, 'onSend');
        chatContainer.container.querySelector('#ciapiSkinSendButton').click()

        expect(registerEventListenerSpy.mock.calls[0][0]).toBe('#ciapiSkinSendButton');
        expect(registerEventListenerSpy.mock.calls[0][1]).toEqual(expect.any(Function));
        expect(chatContainer.eventHandler.onSend).toBeCalledTimes(1);
    });

})
