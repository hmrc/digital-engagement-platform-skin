import '@testing-library/jest-dom';
import CommonChatController from '../../../../../../../app/assets/javascripts/controllers/CommonChatController';
import MessageClasses from '../../../../../../../app/assets/javascripts/DefaultClasses'
import PopupContainerHtml from '../../../../../../../app/assets/javascripts/views/popup/PopupContainerHtml'
import ChatContainer from '../../../../../../../app/assets/javascripts/utils/ChatContainer'

//jest.mock("../../../../../../../app/assets/javascripts/DefaultClasses");
//jest.mock("../../../../../../../app/assets/javascripts/views/popup/PopupContainerHtml").ContainerHtml;

describe("CommonChatController", () => {
    
    afterEach(() => {
        document.getElementsByTagName('html')[0].innerHTML = ''; 
      });

      it("launches a reactive chat", () => {
        const commonChatController = new CommonChatController();

        const sdk = {
            getOpenerScripts: jest.fn().mockReturnValue(null),
            chatDisplayed: jest.fn()
        }

        window.Inq = {
            SDK: sdk
        };

        
        commonChatController._launchChat();

        expect(sdk.getOpenerScripts).toHaveBeenCalledTimes(1);
        expect(sdk.chatDisplayed).toHaveBeenCalledTimes(1);

    });

    it("Does not launch chat if already launched", () => {
        const commonChatController = new CommonChatController();
        console.error = jest.fn();

        //const container = document.createElement("div");

        //const chatContainer = new ChatContainer(MessageClasses, PopupContainerHtml.ContainerHtml);

        commonChatController._launchChat();

        expect(console.error).toHaveBeenCalledWith("This should never happen. If it doesn't, then remove this 'if'");

    });

    it("remove animation after nuance iframe loads", () => {
        const commonChatController = new CommonChatController();
        
        let chatContainerOne = document.createElement("div");
        chatContainerOne.setAttribute("id", "cui-loading-animation");
        document.body.appendChild(chatContainerOne);

        let chatContainerTwo = document.createElement("div");
        chatContainerTwo.setAttribute("id", "cui-messaging-container");
        document.body.appendChild(chatContainerTwo);


        commonChatController._removeAnimation();     
        

        expect(chatContainerOne).not.toBeVisible();
        expect(chatContainerTwo).toBeVisible();
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
