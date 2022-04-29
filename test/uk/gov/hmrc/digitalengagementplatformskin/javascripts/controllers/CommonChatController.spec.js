import CommonChatController from '../../../../../../../app/assets/javascripts/controllers/CommonChatController';
import PostChatSurveyWebchatService from '../../../../../../../app/assets/javascripts/services/PostChatSurveyWebchatService'
import PostChatSurveyDigitalAssistantService from '../../../../../../../app/assets/javascripts/services/PostChatSurveyDigitalAssistantService'

describe("CommonChatController", () => {
    const event = { preventDefault: () => {} };
    
    
    afterEach(() => {
      document.getElementsByTagName('html')[0].innerHTML = ''; 
    });

    beforeAll(() => {
      jest.spyOn(event, 'preventDefault');
    });

    it("launches a reactive chat", () => {
      const commonChatController = new CommonChatController();
      let spy = jest.spyOn(commonChatController, 'updateDav3DeskproRefererUrls').mockImplementation(() => {});
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

    it("remove animation after nuance iframe loads", () => {
      const commonChatController = new CommonChatController();
      
      let chatContainerOne = document.createElement("div");
      chatContainerOne.setAttribute("id", "cui-loading-animation");
      document.body.appendChild(chatContainerOne);

      let chatContainerTwo = document.createElement("div");
      chatContainerTwo.setAttribute("id", "cui-messaging-container");
      document.body.appendChild(chatContainerTwo);

      commonChatController._removeAnimation();     
      
      expect(chatContainerOne).not.toBeVisible;
      expect(chatContainerTwo).toBeVisible;
    });

    it("appends chat transcript div to page when no div id is found on page", () => {
      const commonChatController = new CommonChatController();

      commonChatController._showChat();

      expect(document.getElementById("ciapiSkinChatTranscript").innerHTML).toBeDefined;
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

    it("getRadioValue returns an empty string if given radiogroup is not found", () => {

      var html = `
        <fieldset class="govuk-fieldset" id="question1">
          <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
            Were you able to do what you needed to do today?
          </legend>
          <div class="govuk-radios govuk-radios--inline">
            <div class="govuk-radios__item">
              <input class="govuk-radios__input" id="q1-" name="q1-" type="radio" value="Yes">
              <label class="govuk-label govuk-radios__label" for="q1-">Yes</label>
            </div>
            <div class="govuk-radios__item">
              <input class="govuk-radios__input" id="q1--2" name="q1-" type="radio" value="No">
              <label class="govuk-label govuk-radios__label" for="q1--2">No</label>
            </div>
          </div>
        </fieldset>
      `;

      const commonChatController = new CommonChatController();
      let spy = jest.spyOn(commonChatController, 'getRadioValue');
      document.body.innerHTML = html;

      expect(commonChatController.getRadioValue("hello")).toBe("")
    });

    it("getRadioValue returns a value associated with a given radiogroup", () => {

      var html = `
        <fieldset class="govuk-fieldset" id="question1">
          <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
            Were you able to do what you needed to do today?
          </legend>
          <div class="govuk-radios govuk-radios--inline">
            <div class="govuk-radios__item">
              <input class="govuk-radios__input" id="q1-" name="q1-" type="radio" value="Yes" checked="checked">
              <label class="govuk-label govuk-radios__label" for="q1-">Yes</label>
            </div>
            <div class="govuk-radios__item">
              <input class="govuk-radios__input" id="q1--2" name="q1-" type="radio" value="No">
              <label class="govuk-label govuk-radios__label" for="q1--2">No</label>
            </div>
          </div>
        </fieldset>
      `;

      const commonChatController = new CommonChatController();
      let spy = jest.spyOn(commonChatController, 'getRadioValue');
      document.body.innerHTML = html;

      expect(commonChatController.getRadioValue("q1-")).toBe("Yes")
    });

    it("getRadioId returns an id associated with a given radiogroup", () => {

      var html = `
        <fieldset class="govuk-fieldset" id="question1">
          <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
            Were you able to do what you needed to do today?
          </legend>
          <div class="govuk-radios govuk-radios--inline">
            <div class="govuk-radios__item">
              <input class="govuk-radios__input" id="q1-" name="q1-" type="radio" value="Yes">
              <label class="govuk-label govuk-radios__label" for="q1-">Yes</label>
            </div>
            <div class="govuk-radios__item">
              <input class="govuk-radios__input" id="q1--2" name="q1-" type="radio" value="No" checked="checked">
              <label class="govuk-label govuk-radios__label" for="q1--2">No</label>
            </div>
          </div>
        </fieldset>
      `;

      const commonChatController = new CommonChatController();
      let spy = jest.spyOn(commonChatController, 'getRadioId');
      document.body.innerHTML = html;

      expect(commonChatController.getRadioId("q1-")).toBe("q1--2")
    });

    it("getTextAreaValue returns an Element object", () => {
      const commonChatController = new CommonChatController();

      var html = `<textarea id="test" name="test" rows="4" cols="50">testing</textarea>`;
      document.body.innerHTML = html;

      let spy = jest.spyOn(commonChatController, 'getTextAreaValue');

      expect(commonChatController.getTextAreaValue("test")).toBe("testing");
        
    });

    it("_sendPostChatSurveyWebchat returns a new instance of PostChatSurveyWebchatService", () => {
      const commonChatController = new CommonChatController();
      
      const sdk = {
        getOpenerScripts: "hello"
      }

      let spy = jest.spyOn(commonChatController, '_sendPostChatSurveyWebchat');

      expect(commonChatController._sendPostChatSurveyWebchat(sdk)).toStrictEqual(new PostChatSurveyWebchatService(sdk))

    });

    it("_sendPostChatSurveyDigitalAssistant returns a new instance of PostChatSurveyDigitalAssistantService", () => {
      const commonChatController = new CommonChatController();
      
      const sdk = {
        getOpenerScripts: jest.fn().mockReturnValue(null)
      }

      let spy = jest.spyOn(commonChatController, '_sendPostChatSurveyDigitalAssistant');

      expect(commonChatController._sendPostChatSurveyDigitalAssistant(sdk)).toStrictEqual(new PostChatSurveyDigitalAssistantService(sdk))

    });

    it("closeNuanceChat sends closeChat to nuance if chat is in progress ", () => {
      const commonChatController = new CommonChatController();

      const sdk = {
        isChatInProgress: jest.fn().mockReturnValue(true),
        closeChat: jest.fn()
      };

      window.Inq = {
        SDK: sdk
      };

      commonChatController.nuanceFrameworkLoaded(window);
      commonChatController.closeNuanceChat();

      expect(sdk.closeChat).toBeCalledTimes(1);
    });

    it("onSkipToTopLink should focus on the skipToTopLink", () => {
      const commonChatController = new CommonChatController();
      const html = `<div id="skipToTop"><a id="skipToTopLink" href="#skipToTopLink">Skip to top of conversation</a></div>`;
      document.body.innerHTML = html;
      const evt = { preventDefault: jest.fn() }
      const mockSkipToTopLink = document.getElementById('skipToTopLink');

      commonChatController.onSkipToTopLink(evt);

      expect(evt.preventDefault).toBeCalled();
      expect(mockSkipToTopLink === document.activeElement).toBeTruthy;
    });
});
