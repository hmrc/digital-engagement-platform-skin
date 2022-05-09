import CommonChatController from '../../../../../../../app/assets/javascripts/controllers/CommonChatController';
import PostChatSurveyWebchatService from '../../../../../../../app/assets/javascripts/services/PostChatSurveyWebchatService'
import PostChatSurveyDigitalAssistantService from '../../../../../../../app/assets/javascripts/services/PostChatSurveyDigitalAssistantService'
import * as ChatStates from '../../../../../../../app/assets/javascripts/services/ChatStates'

function createDisplayOpenerScriptsDependencies() {
  const sdk = {
    getOpenerScripts: jest.fn()
  };

  const container = {
    transcript: {
      addOpenerScript: jest.fn()
    },
    getTranscript: function () {
      return this.transcript;
    }
  };

  return [sdk, container]

};

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

    it("updateDav3DeskproRefererUrls will get the three deskpro URLs url,", () => {
     
      var html = 
      `<a class="hmrc-report-technical-issue"
        href="https://testURL;service=digital-engagement-platform-frontend&amp;referrerUrl=https%3A%2F%2FtestURL">
        Is this page not working properly? (opens in new tab)
      </a>
        
      <span class="govuk-phase-banner__text">
        This is a new service – your <a class="govuk-link" href="https://testURL?service=digital-engagement-platform-frontend">
        feedback</a> will help us to improve it.
      </span>
      <a class="govuk-link" href="https://testURL?service=digital-engagement-platform-frontend">feedback</a>

      <div class="govuk-footer__meta">
        <div class="govuk-footer__meta-item govuk-footer__meta-item--grow">
          <li class="govuk-footer__inline-list-item">
           <a class="govuk-footer__link" href="/help/cookies">
           Cookies
           </a>
          </li> 
          <li class="govuk-footer__inline-list-item">
           <a class="govuk-footer__link" href="/ask-hmrc/accessibility-statement?userAction=%2Fask-hmrc%2Fchat%2Fask-hmrc-online%3Fversion%3D3">
           Accessibility statement
           </a>
          </li>
        </ul>
      </div>      
      `;

      const commonChatController = new CommonChatController();
      let spy = jest.spyOn(commonChatController, 'updateDav3DeskproRefererUrls');
      document.body.innerHTML = html;

      commonChatController.updateDav3DeskproRefererUrls();

      expect(commonChatController.updateDav3DeskproRefererUrls).toHaveBeenCalledTimes(1);
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

    it("showEndChatPage removes the skin header buttons and calls post chat survey", () => {
      const commonChatController = new CommonChatController();

      const html = `<h1 id="heading_chat_ended">Chat ended</h1>`;
      document.body.innerHTML = html;

      const mockChatEnded = document.getElementById('heading_chat_ended');

      const mockContainer = {
        _removeSkinHeadingElements: jest.fn(),
        showPage:jest.fn()
      }

      commonChatController.container = mockContainer;
      commonChatController.closeNuanceChat = jest.fn();

      let removeSkinHeadingElementsSpy = jest.spyOn(commonChatController.container, '_removeSkinHeadingElements');
      let showPageSpy = jest.spyOn(commonChatController.container, 'showPage');
      let closeNuanceChatSpy = jest.spyOn(commonChatController, 'closeNuanceChat');

      commonChatController.showEndChatPage(true);

      expect(removeSkinHeadingElementsSpy).toHaveBeenCalledTimes(1);
      expect(showPageSpy).toHaveBeenCalledTimes(1);
      expect(closeNuanceChatSpy).toHaveBeenCalledTimes(1);
      expect(mockChatEnded === document.activeElement).toBeTruthy;

    });

    it("onRestoreChat restores the chat container and sends an activity message to Nunace", () => {
      const commonChatController = new CommonChatController();

      const mockContainer = {
        restore: jest.fn()
      };

      commonChatController.container = mockContainer;
      var restore = jest.spyOn(commonChatController.container, 'restore');

      commonChatController.minimised = true;

      const sdk = {
        sendActivityMessage: jest.fn(),
        isChatInProgress: jest.fn()
      };

      window.Inq = {
        SDK: sdk
      };

      commonChatController.nuanceFrameworkLoaded(window);
      commonChatController.onRestoreChat();

      expect(sdk.sendActivityMessage).toBeCalledTimes(1);
      expect(restore).toBeCalledTimes(1);

    });

    it("onHideChat minimises the chat container and sends an activity message to Nunace", () => {
      const commonChatController = new CommonChatController();

      const mockContainer = {
        minimise: jest.fn()
      };

      commonChatController.container = mockContainer;
      var minimiseSpy = jest.spyOn(commonChatController.container, 'minimise');

      commonChatController.minimised = false;

      const sdk = {
        sendActivityMessage: jest.fn(),
        isChatInProgress: jest.fn()
      };

      window.Inq = {
        SDK: sdk
      };

      commonChatController.nuanceFrameworkLoaded(window);
      commonChatController.onHideChat();

      expect(sdk.sendActivityMessage).toBeCalledTimes(1);
      expect(minimiseSpy).toBeCalledTimes(1);

    });

    it("onSoundToggle adds the active class to the soundtoggle element if it is inactive", () => {
      const commonChatController = new CommonChatController();

      const html = `<button id="toggleSound" class="inactive">Turn notification sound on</button>`;
      document.body.innerHTML = html;

      commonChatController.onSoundToggle();

      expect(document.getElementById("toggleSound").classList.contains("active")).toBe(true);

    });

    it("onSoundToggle adds the inactive class to the soundtoggle element if it is active", () => {
      const commonChatController = new CommonChatController();

      const html = `<button id="toggleSound" class="active">Turn notification sound on</button>`;
      document.body.innerHTML = html;

      commonChatController.onSoundToggle();

      expect(document.getElementById("toggleSound").classList.contains("inactive")).toBe(true);

    });

    it("_moveToClosingState creates new closing state", () => {
      const commonChatController = new CommonChatController();

      var spy = jest.spyOn(commonChatController, '_moveToState');

      commonChatController._moveToClosingState();

      expect(spy).toBeCalledTimes(1);
    });

    it("onCloseChat calls onClickedClose", () => {
      const commonChatController = new CommonChatController();
      const sdk = {
        getMessages: jest.fn()
      };
      const state = new ChatStates.EngagedState(sdk, jest.fn(), [], jest.fn());

      commonChatController.state = state;
      var spy = jest.spyOn(state, 'onClickedClose');

      commonChatController.onCloseChat();

      expect(spy).toBeCalledTimes(1);
    });

    it("_displayOpenerScripts retrieves the opener scripts and adds them to the transcript", () => {
      const [sdk, container] = createDisplayOpenerScriptsDependencies();
      const commonChatController = new CommonChatController();

      window.Inq = {
        SDK: sdk
      };

      commonChatController.container = container;

      commonChatController._displayOpenerScripts(window);

      const handleMessage = sdk.getOpenerScripts.mock.calls[0][0];

      handleMessage(["this is an opener script"]); 

      expect(sdk.getOpenerScripts).toHaveBeenCalledTimes(1);
      expect(commonChatController.container.transcript.addOpenerScript).toBeCalledTimes(1);

    });

    it("_displayOpenerScripts retrieves the opener scripts does not add anything to transcript if there are no opener scripts returned", () => {
      const [sdk, container] = createDisplayOpenerScriptsDependencies();
      const commonChatController = new CommonChatController();

      window.Inq = {
        SDK: sdk
      };

      commonChatController.container = container;

      commonChatController._displayOpenerScripts(window);

      const handleMessage = sdk.getOpenerScripts.mock.calls[0][0];

      handleMessage(null); 

      expect(sdk.getOpenerScripts).toHaveBeenCalledTimes(1);
      expect(commonChatController.container.transcript.addOpenerScript).toBeCalledTimes(0);

    });
});
