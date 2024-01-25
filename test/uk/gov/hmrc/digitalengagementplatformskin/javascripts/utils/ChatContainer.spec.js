import ChatContainer from '../../../../../../../app/assets/javascripts/utils/ChatContainer';
import Transcript from '../../../../../../../app/assets/javascripts/services/Transcript';
import * as JsonUtils from '../../../../../../../app/assets/javascripts/utils/JsonUtils';

import { ContainerHtml } from '../../../../../../../app/assets/javascripts/views/embedded/EmbeddedContainerHtml';

jest.mock('../../../../../../../app/assets/javascripts/views/EndChatPopup');
jest.mock('../../../../../../../app/assets/javascripts/services/Transcript');

let nullEventHandler;
let chatContainer;
let mockSDK;
let sanitiseAndParseJsonData = jest.spyOn(JsonUtils, 'sanitiseAndParseJsonData');

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

const originalGetElementById = document.getElementById;
const originalQuerySelectorAll = document.querySelectorAll;

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

    chatContainer = new ChatContainer(null, document.createElement("div"), null);
    mockSDK = {
        sendRichContentMessage : jest.fn().mockImplementation(),
        sendMessage: jest.fn().mockImplementation(),
        sendDataPass: jest.fn().mockImplementation(),
        sendVALinkMessage: jest.fn().mockImplementation()
    };

    sanitiseAndParseJsonData.mockRestore(); // reset JsonUtils sanitiseAndParseJsonData counter before each test
});

afterEach(() => {
    document.getElementById = originalGetElementById;
    document.querySelectorAll = originalQuerySelectorAll;
    jest.resetAllMocks();
});

describe("ChatContainer", () => {

    it("the onStopTying event handler method is called on stopTyping call", () => {
        chatContainer.eventHandler.onStopTyping = jest.fn();
        chatContainer.stopTyping(chatContainer.eventHandler);

        expect(chatContainer.eventHandler.onStopTyping).toHaveBeenCalledTimes(1);
        expect(chatContainer.isCustomerTyping).toBe(false);
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


    it("Calls SDK.sendVALinkMessage and _focusOnNextAutomatonMessage methods, given an event with specific properties", () => {
        chatContainer = new ChatContainer(null, null, mockSDK);

        const focusOnNextAutomatonMessageSpy = jest.spyOn(chatContainer, '_focusOnNextAutomatonMessage')

        const responsiveLinkEvent = {
            target : {
                tagName: "a",
                dataset: {
                    vtzJump: {}
                },
                getAttribute : jest.fn().mockReturnValue("#"),
            },
            preventDefault: jest.fn()
        }

        chatContainer.processTranscriptEvent(responsiveLinkEvent);

        expect(mockSDK.sendVALinkMessage).toBeCalledWith(responsiveLinkEvent, null, null, null);
        expect(focusOnNextAutomatonMessageSpy).toHaveBeenCalledTimes(1);
    });

    it("Calls SDK.sendVALinkMessage method and sets the class's closeMethod to 'Link', given an event with specific properties", () => {
        chatContainer = new ChatContainer(null, null, mockSDK);

        const responsiveLinkEvent = {
            target : {
                tagName: "a",
                dataset: {
                    vtzJump: {}
                },
                getAttribute : jest.fn().mockReturnValue("#"),
                className: "dialog"
            },
            preventDefault: jest.fn()
        }

        chatContainer.processTranscriptEvent(responsiveLinkEvent);

        expect(mockSDK.sendVALinkMessage).toBeCalledWith(responsiveLinkEvent, null, null, null);
        expect(chatContainer.closeMethod).toBe("Link");
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

    it("Mix: process external links, with error returned from JsonUtils bacause of malformed datapass test", () => {
        chatContainer = new ChatContainer(null, null, mockSDK);

        const invalidJson = "{'testDataPass': worked'}"//missing ' before worked
        const externalLinkEventWithInvalidJson = {
            target : {
                dataset: {
                    "nuanceMessageText": "Where do you live?",
                    "nuanceDatapass": invalidJson,
                    "target": "_blank"
                },
                getAttribute : jest.fn().mockReturnValue("https://www.gov.uk/government/organisations/hm-revenue-customs")
            },
            preventDefault: jest.fn()
        }

        sanitiseAndParseJsonData = jest.spyOn(JsonUtils, 'sanitiseAndParseJsonData');

        chatContainer.processTranscriptEvent(externalLinkEventWithInvalidJson);

        expect(sanitiseAndParseJsonData).toBeCalledTimes(1);
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


    it("Returns the current customer input text", () => {
        let customerInputHtml = document.createElement("textarea");
        customerInputHtml.setAttribute("id", "custMsg");
        customerInputHtml.value = "How many times did the batmobile catch a flat?";

        chatContainer.custInput = customerInputHtml;

        expect(chatContainer.currentInputText()).toBe("How many times did the batmobile catch a flat?");
    });

    it("Clears the current customer input text", () => {
        let customerInputHtml = document.createElement("textarea")
        customerInputHtml.setAttribute("id", "custMsg");
        customerInputHtml.value = "How many times did the batmobile catch a flat?"

        chatContainer.custInput = customerInputHtml

        chatContainer.clearCurrentInputText();
        expect(chatContainer.currentInputText()).toBe("")
    });

    it("Returns null given a call to processExternalAndResponsiveLinks where there is no href link attribute", () => {

        const responsiveLinkEvent = {
            target : {
                getAttribute : jest.fn(() => { return null; } )
            }
        }

        expect(chatContainer.processExternalAndResponsiveLinks(responsiveLinkEvent)).toBe(null);
    });

    it("Calls the endchatPopup's show method and brings it to focus", () => {
        let eventContainer = document.createElement("div");
        eventContainer.setAttribute("id", "endChatPopup");
        document.body.appendChild(eventContainer);

        const focus = jest.fn();
        const removeAttribute = jest.fn();

        document.getElementById = jest.fn()
                                  .mockReturnValueOnce({removeAttribute})
                                  .mockReturnValueOnce({focus});

        chatContainer = new ChatContainer(null, eventContainer, mockSDK);

        chatContainer.confirmEndChat();

        expect(chatContainer.endChatPopup.show).toBeCalled();
        expect(document.getElementById).toBeCalledWith("endChatPopup");
        expect(focus).toBeCalledTimes(1);
    });

    function setupDocumentforCancelEndChatTests() {
        const testElementWithDialogClass = "<div class='dialog'>test dialog</div>"

        const documentHtml = "<div id='ciapiSkin'>" + ContainerHtml + testElementWithDialogClass + "</div>";
        document.body.innerHTML = documentHtml;

        // set the various html elements tab index to zero in order to assert these are removed after the call
        let skinContainer = document.querySelector("#ciapiSkin");
        skinContainer.querySelectorAll('input, textarea, button').forEach((element) => {
            element.setAttribute("tabindex", 0)
        })

        return documentHtml;
    }

    it("onCancelEndChat behaves as expected given the chatContainer's closeMethod is set to Button", () => {
        const focus = jest.fn();
        const setAttribute = jest.fn();

        document.getElementById = 
            jest.fn()
                .mockReturnValueOnce({setAttribute})
                .mockReturnValueOnce({setAttribute})
                .mockReturnValueOnce({focus});
            
        const documentHtml = setupDocumentforCancelEndChatTests();

        chatContainer = new ChatContainer(null, documentHtml, null);
        chatContainer.closeMethod = "Button";

        chatContainer.onCancelEndChat();

        expect(setAttribute).toBeCalledWith("tabindex", 0);
        expect(setAttribute).toBeCalledTimes(2);
        expect(chatContainer.endChatPopup.hide).toBeCalledTimes(1);
        expect(focus).toBeCalledTimes(1);

        document
            .querySelector("#ciapiSkin")
            .querySelectorAll('input, textarea').forEach((element) => {
                expect(element.getAttribute("tabindex")).toBe(null)
            });
    });

//    it("onCancelEndChat behaves as expected given the chatContainer's closeMethod is set to Link", () => {
//        const focus = jest.fn();
//        document.querySelectorAll = jest.fn().mockReturnValueOnce([{focus}]);
//
//        const documentHtml = setupDocumentforCancelEndChatTests();
//
//        chatContainer = new ChatContainer(null, documentHtml, null);
//        chatContainer.closeMethod = "Link";
//
//        chatContainer.onCancelEndChat();
//
//        expect(focus).toBeCalledTimes(1);
//    });

    it("removeSkinHeadingElements removes heading elements and sets transcript style properties", () => {
        document.body.innerHTML = ContainerHtml;
        chatContainer = new ChatContainer(null, ContainerHtml, null);

        expect(document.contains(document.getElementById("print"))).toBe(true);
        expect(document.contains(document.getElementById("sound"))).toBe(true);

        chatContainer._removeSkinHeadingElements();

        let transcriptHeading = document.getElementById("ciapiSkinHeader");

        expect(transcriptHeading.style.height).toBe("auto");
        expect(transcriptHeading.style.width).toBe("auto");

        expect(document.contains(document.getElementById("print"))).toBe(false);
        expect(document.contains(document.getElementById("sound"))).toBe(false);
    });

    it("focusOnNextAutomatonMessage calls setTimeout with the expected callback", () => {
        const focus = jest.fn()

        document.querySelectorAll = jest.fn()
            .mockReturnValueOnce([{focus}])
            .mockReturnValueOnce([{focus}])

        chatContainer._focusOnNextAutomatonMessage()

        jest.advanceTimersByTime(1001);

        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(focus).toBeCalledTimes(1); // TODO this is called twice when run individually, not sure why
    });

    it("onConfirmEndChat calls the expected methods, and focuses the legend_give_feedback element", () => {
        const focus = jest.fn();
        const setAttribute = jest.fn();
        let focusDiv = document.createElement("h2");
        focusDiv.id = 'legend_give_feedback'

        document.getElementById = jest.fn()
                                    .mockReturnValueOnce({setAttribute})
                                    .mockReturnValueOnce({setAttribute})
                                    .mockReturnValueOnce({focus})
                                    .mockReturnValueOnce({focus});

        chatContainer._removeSkinHeadingElements = jest.fn();
        chatContainer.onConfirmEndChat();

        expect(chatContainer.endChatPopup.hide).toBeCalledTimes(1);
        expect(focus).toBeCalledTimes(1);
        expect(chatContainer._removeSkinHeadingElements).toBeCalledTimes(1);
    });

    it("showPage attaches the ciapiChatComponents to the page, and sets the transcript and footer style displays to none", () => {
        const attachTo = jest.fn();
        const page = { attachTo };

        let containerHtmlElement = document.createElement("div");
        containerHtmlElement.innerHTML = ContainerHtml;

        containerHtmlElement.querySelector("#ciapiSkinChatTranscript").style.display = "none";
        containerHtmlElement.querySelector("#ciapiSkinFooter").style.display = "none";

        chatContainer.container.insertAdjacentHTML("beforeend", ContainerHtml);

        chatContainer.showPage(page);

        expect(chatContainer.container.querySelector("#ciapiSkinChatTranscript").style.display).toBe("none");
        expect(chatContainer.container.querySelector("#ciapiSkinFooter").style.display).toBe("none");
        expect(attachTo).toBeCalledWith(containerHtmlElement.querySelector("#ciapiChatComponents"));
    });

    it("disablePreviousWidgets disables elements with the quick-reply-widget class", () => {
        const disable = jest.fn();
        const widget = { disable };

        const responsiveLinkEvent = {
            target : {
                getAttribute : jest.fn().mockReturnValue("#"),
            }
        }

        document.querySelectorAll = jest.fn().mockReturnValueOnce([widget]);
        chatContainer.disablePreviousWidgets(responsiveLinkEvent);

        expect(disable).toBeCalledTimes(1);
    })
})
