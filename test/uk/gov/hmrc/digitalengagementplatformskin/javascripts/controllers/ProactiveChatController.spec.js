import CommonChatController from '../../../../../../../app/assets/javascripts/controllers/CommonChatController'
import ProactiveChatController from '../../../../../../../app/assets/javascripts/controllers/ProactiveChatController'

describe("ProactiveChatController", () => {
    
    afterEach(() => {
        document.getElementsByTagName('html')[0].innerHTML = ''; 
      });
    
    it("launches a proactive chat", () => {
        const commonChatController = new CommonChatController();
        const proactiveChatController = new ProactiveChatController();

        const sdk = {
            isChatInProgress: jest.fn().mockReturnValue(false),
            getOpenerScripts: jest.fn().mockReturnValue(null),
            chatDisplayed: jest.fn()
        };

        window.Inq = {
            SDK: sdk
        };

        commonChatController.nuanceFrameworkLoaded(window);
        proactiveChatController.launchProactiveChat();

        expect(sdk.getOpenerScripts).toHaveBeenCalled();
        expect(sdk.chatDisplayed).toHaveBeenCalled();
    })

    it("appends chat transcript div to page when no div id is found on page", () => {
        const commonChatController = new CommonChatController();

        commonChatController._showChat();

        expect(document.getElementById("ciapiSkinChatTranscript").innerHTML).not.toBe(null);

    });

    it("appends embedded chat transcript div to page when an embedded div id is found on page", () => {
        const commonChatController = new CommonChatController();
        let chatContainer = document.createElement("div");
        chatContainer.setAttribute("id", "nuanMessagingFrame");
        document.body.appendChild(chatContainer);

        commonChatController._showChat();

        expect(document.getElementById("ciapiSkinMinimised")).toBe(null);

    });
});
