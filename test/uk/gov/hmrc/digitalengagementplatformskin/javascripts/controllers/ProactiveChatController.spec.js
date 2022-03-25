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

        expect(sdk.getOpenerScripts).toHaveBeenCalledTimes(1);
        expect(sdk.chatDisplayed).toHaveBeenCalledTimes(1);
    });

    let loadingAnimation = document.getElementById("cui-loading-animation");
    let cuiContainer = document.getElementById("cui-messaging-container");
    if (loadingAnimation && cuiContainer) {
        loadingAnimation.style.display = 'none';
        cuiContainer.style.opacity = '1';
    }

    it("remove animation after nuance iframe loads", () => {
        const commonChatController = new CommonChatController();
        
        let chatContainerOne = document.createElement("div");
        chatContainerOne.setAttribute("id", "cui-loading-animation");
        document.body.appendChild(chatContainerOne);

        let chatContainerTwo = document.createElement("div");
        chatContainerTwo.setAttribute("id", "cui-messaging-container");
        document.body.appendChild(chatContainerTwo);

        commonChatController._removeAnimation();
               
        expect(document.body.innerHTML).toContain('display: none');
        expect(document.body.innerHTML).toContain('opacity: 1');
        //TODO can we get this to work
        //expect(_removeAnimation.mock.calls.length).toBe(1);
    });
    

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

    it("appends fixed popup chat transcript div to page when an fixed popup div id is found on page", () => {
        const commonChatController = new CommonChatController();
        let chatContainer = document.createElement("div");
        chatContainer.setAttribute("id", "HMRC_CIAPI_Fixed_1");
        document.body.appendChild(chatContainer);

        commonChatController._showChat();

        expect(document.getElementById("ciapiSkinChatTranscript").innerHTML).not.toBe(null);
    });

    it("appends anchored popup chat transcript div to page when an anchored popup div id is found on page", () => {
        const commonChatController = new CommonChatController();
        let chatContainer = document.createElement("div");
        chatContainer.setAttribute("id", "HMRC_CIAPI_Anchored_1");
        document.body.appendChild(chatContainer);

        commonChatController._showChat();

        expect(document.getElementById("ciapiSkinChatTranscript").innerHTML).not.toBe(null);
    });
});
