import '@testing-library/jest-dom';
import CommonChatController from '../../../../../../../app/assets/javascripts/controllers/CommonChatController';

describe("CommonChatController", () => {
    
    afterEach(() => {
        document.getElementsByTagName('html')[0].innerHTML = ''; 
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
