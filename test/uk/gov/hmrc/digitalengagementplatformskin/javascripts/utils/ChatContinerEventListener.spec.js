import ChatContainer from '../../../../../../../app/assets/javascripts/utils/ChatContainer';

import { ContainerHtml as EmbeddedContainerHtml } from '../../../../../../../app/assets/javascripts/views/embedded/EmbeddedContainerHtml';
import { ContainerHtml as PopupContainerHtml } from '../../../../../../../app/assets/javascripts/views/popup/PopupContainerHtml';

describe("ChatContainer Event Listeners", () => {

    it("clicking the send button fires the expected handler function", () => {
        const chatContainer = new ChatContainer(null, EmbeddedContainerHtml, null);

        jest.spyOn(chatContainer.eventHandler, 'onSend');
        chatContainer.container.querySelector('#ciapiSkinSendButton').click()

        expect(chatContainer.eventHandler.onSend).toBeCalledTimes(1);
    });

    it("clicking the close button fires the expected handler function", () => {
        const chatContainer = new ChatContainer(null, EmbeddedContainerHtml, null);

        jest.spyOn(chatContainer.eventHandler, 'onCloseChat');
        chatContainer.container.querySelector('#ciapiSkinCloseButton').click()

        expect(chatContainer.eventHandler.onCloseChat).toBeCalledTimes(1);
    });
    
    it("clicking the hide button fires the expected handler function", () => {
        const chatContainer = new ChatContainer(null, PopupContainerHtml, null);

        jest.spyOn(chatContainer.eventHandler, 'onHideChat');
        chatContainer.container.querySelector('#ciapiSkinHideButton').click()

        expect(chatContainer.eventHandler.onHideChat).toBeCalledTimes(1);
    });

    it("clicking the skip to bottom link fires the expected handler function", () => {
        const chatContainer = new ChatContainer(null, EmbeddedContainerHtml, null);

        jest.spyOn(chatContainer.eventHandler, 'onSkipToTopLink');
        chatContainer.container.querySelector('#skipToBottomLink').click()

        expect(chatContainer.eventHandler.onSkipToTopLink).toBeCalledTimes(1);
    });

    it("clicking the restore button fires the expected handler function", () => {
        const chatContainer = new ChatContainer(null, PopupContainerHtml, null);

        jest.spyOn(chatContainer.eventHandler, 'onRestoreChat');
        chatContainer.container.querySelector('#ciapiSkinRestoreButton').click()

        expect(chatContainer.eventHandler.onRestoreChat).toBeCalledTimes(1);
    });

    it("a keypress fires the expected handler function", () => {
        const chatContainer = new ChatContainer(null, EmbeddedContainerHtml, null);

        jest.spyOn(chatContainer, 'processKeypressEvent');

        const fKey = 70;

        chatContainer
            .container
            .querySelector('#custMsg')
            .dispatchEvent(new KeyboardEvent('keypress', {'key': fKey}));

        expect(chatContainer.processKeypressEvent).toBeCalledTimes(1);
    });

    it("clicking the print button fires the expected handler function", () => {
        const chatContainer = new ChatContainer(null, EmbeddedContainerHtml, null);

        jest.spyOn(chatContainer.eventHandler, 'onPrint');
        chatContainer.container.querySelector('#printButton').click()

        expect(chatContainer.eventHandler.onPrint).toBeCalledTimes(1);
    });

    it("clicking the sound toggle fires the expected handler function", () => {
        const chatContainer = new ChatContainer(null, EmbeddedContainerHtml, null);

        jest.spyOn(chatContainer.eventHandler, 'onSoundToggle');
        chatContainer.container.querySelector('#toggleSound').click()

        expect(chatContainer.eventHandler.onSoundToggle).toBeCalledTimes(1);
    });
})
