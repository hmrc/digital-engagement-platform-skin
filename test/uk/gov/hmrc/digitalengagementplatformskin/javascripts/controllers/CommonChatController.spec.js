import CommonChatController from '../../../../../../../app/assets/javascripts/controllers/CommonChatController';
import PostChatSurveyWebchatService from '../../../../../../../app/assets/javascripts/services/PostChatSurveyWebchatService'
import PostChatSurveyDigitalAssistantService from '../../../../../../../app/assets/javascripts/services/PostChatSurveyDigitalAssistantService'
import * as ChatStates from '../../../../../../../app/assets/javascripts/services/ChatStates'
import PrintUtils from '../../../../../../../app/assets/javascripts/utils/PrintUtils';


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

const chatParams = {
  agId: "AgId",
  agentID: "AgentId",
  agentAttributes: "AgentAttributes",
  browserType: "BrowserType",
  browserVersion: "BrowserVersion",
  brID: 123456,
  businessUnitID: "BusinessUnitID",
  chatTitle: "ChatTitle",
  countryCode: "CountryCode",
  deviceType: "DeviceType",
  chatID: "ChatID",
  getVisitorAttributes: () => { return "VisitorAttributes"; },
  launchPageId: 123458,
  operatingSystemType: "OperatingSystemType",
  regionCode: "RegionCode",
  ruleAttributes: "RuleAttributes",
  sessionID: "SessionID",
  siteID: 123459,
  thisCustomerID: "ThisCustomerID",
};




describe("CommonChatController", () => {

  let commonChatController

  const event = { preventDefault: () => { } };

  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  beforeEach(() => {
    jest.restoreAllMocks();
    commonChatController = new CommonChatController();
    window.print = jest.fn();
  });

  beforeAll(() => {
    jest.spyOn(event, 'preventDefault');
    jest.spyOn(console, 'log').mockImplementation(jest.fn());
  });

  it("gets the correct sdk", () => {
    const sdk = {
      getOpenerScripts: jest.fn().mockReturnValue(null),
      chatDisplayed: jest.fn()
    }
    commonChatController.sdk = sdk

    expect(commonChatController.getSdk()).toBe(sdk)
  })

  it("launches a reactive chat", () => {


    let spy = jest.spyOn(commonChatController, 'updateDav3DeskproRefererUrls').mockImplementation(() => { });
    const sdk = {
      getOpenerScripts: jest.fn().mockReturnValue(null),
      chatDisplayed: jest.fn()
    }

    window.Inq = {
      SDK: sdk
    };

    commonChatController._launchChat({ state: 'show' });

    expect(sdk.getOpenerScripts).toHaveBeenCalledTimes(1);
    expect(sdk.chatDisplayed).toHaveBeenCalledTimes(1);
  });

  it("launch chat returns undefined given a defined container", () => {


    let spy = jest.spyOn(commonChatController, 'updateDav3DeskproRefererUrls').mockImplementation(() => { });
    const sdk = {
      getOpenerScripts: jest.fn().mockReturnValue(null),
      chatDisplayed: jest.fn()
    }

    window.Inq = {
      SDK: sdk
    };

    commonChatController._showChat();

    expect(commonChatController._launchChat({ state: 'show' })).toBe(undefined)

  });

  it("calls the chatDisplayed function with the expected object & callbacks", () => {

    let moveToChatEngagedStateMock = jest.spyOn(commonChatController, "_moveToChatEngagedState").mockImplementation();

    console.log = jest.fn();

    const sdk = {
      getOpenerScripts: jest.fn().mockReturnValue(null),
      chatDisplayed: jest.fn()
    }

    window.Inq = {
      SDK: sdk
    }

    commonChatController._displayOpenerScripts();
    commonChatController._launchChat({ state: 'show' });

    let firstCallObject = sdk.chatDisplayed.mock.calls[0][0]

    firstCallObject.failedCb();
    firstCallObject.reConnectCb();
    firstCallObject.disconnectCb();
    firstCallObject.previousMessagesCb({ messages: ["fake message"] });

    expect(moveToChatEngagedStateMock).toHaveBeenCalledWith(["fake message"]);
    expect(console.log).toHaveBeenCalledWith("INFO: %%%%%% disconnected %%%%%%");
    expect(console.log).toHaveBeenCalledWith("INFO: %%%%%% reconnected %%%%%%");
    expect(console.log).toHaveBeenCalledWith("INFO: %%%%%% failed %%%%%%");

    expect(firstCallObject.customerName).toBe("You");
    expect(firstCallObject.defaultAgentAlias).toBe("HMRC");
    expect(firstCallObject.openerScripts).toBe(null);
  });

  it("removes existingErrorMessage", () => {


    document.body.innerHTML += '<div id="error-message"> </div>'

    commonChatController._launchChat({ state: 'show' });

    const existingErrorMessage = document.getElementById("error-message")

    expect(existingErrorMessage).toBe(null)
  });

  it("catches an exception in the launchChat function", () => {
    console.error = jest.fn();

    let showChatMock = commonChatController._showChat = jest.fn(() => { throw new Error("test") });

    commonChatController._launchChat({ state: 'show' });

    expect(console.error).toHaveBeenCalledWith("ERROR: !!!! launchChat got exception: ", new Error("test"))
  });

  it("catches an exception in the showChat function", () => {
    console.error = jest.fn();

    let chatShownStateMock = commonChatController._moveToChatShownState = jest.fn(() => { throw new Error("test") });

    commonChatController._showChat();

    expect(console.error).toHaveBeenCalledWith("ERROR: !!!! _showChat got exception: ", new Error("test"))
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


    let spy = jest.spyOn(commonChatController, 'updateDav3DeskproRefererUrls');
    document.body.innerHTML = html;

    commonChatController.updateDav3DeskproRefererUrls();

    expect(commonChatController.updateDav3DeskproRefererUrls).toHaveBeenCalledTimes(1);
  });

  it("remove animation after nuance iframe loads", () => {


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


    commonChatController._showChat();

    expect(document.getElementById("ciapiSkinChatTranscript").innerHTML).toBeDefined;
  });

  it("appends embedded chat transcript div to page when an embedded div id is found on page", () => {


    let chatContainer = document.createElement("div");
    chatContainer.setAttribute("id", "nuanMessagingFrame");
    document.body.appendChild(chatContainer);

    commonChatController._showChat();

    expect(document.getElementById("ciapiSkinMinimised")).toBe(null);
  });

  it("appends popup chat transcript div to page when the popup div id is found on page", () => {

    let chatContainer = document.createElement("div");
    chatContainer.setAttribute("id", "tc-nuance-chat-container");
    document.body.appendChild(chatContainer);

    commonChatController._showChat();

    expect(document.getElementById("ciapiSkinChatTranscript").innerHTML).not.toBe(null);
  });

  it("moves chat to engaged state on method call", () => {


    let confirmEndChatSpy = jest.fn()
    commonChatController.container = {
      confirmEndChat: confirmEndChatSpy
    }

    let chatStatesSpy = jest.spyOn(ChatStates, 'EngagedState').mockImplementation();

    window.Inq = {
      SDK: {
        getMessages: jest.fn().mockReturnValue("messages"),
      }
    };

    commonChatController._moveToChatEngagedState();

    let engagedChatStateCloseChatFunctionArgumentIndex = 3
    chatStatesSpy.mock.calls[0][engagedChatStateCloseChatFunctionArgumentIndex]()

    expect(confirmEndChatSpy).toHaveBeenCalled();

  })

  it("closeChat is called when the post survey chat wrapper is open with escalation and no embedded div", () => {
    var html = `
		<div id="postChatSurveyWrapper">
			<p>Fake post chat survey</p>
		</div>
	  `;

    const sdk = {
      getMessages: jest.fn()
    };
    const container = {
      destroy: jest.fn()
    };
    const state = new ChatStates.EngagedState(sdk, jest.fn(), [], jest.fn());
    const fakeSurvey = new PostChatSurveyWebchatService(sdk);

    state.escalated = true;
    commonChatController.state = state
    commonChatController.container = container
    document.body.innerHTML = html;
    var surveySpy = jest.spyOn(commonChatController, "_sendPostChatSurveyWebchat").mockImplementation(() => fakeSurvey)
    var closeSpy = jest.spyOn(fakeSurvey, "closePostChatSurvey").mockImplementation()
    var nullSpy = jest.spyOn(commonChatController, "_moveToChatNullState").mockImplementation()
    var destroySpy = jest.spyOn(container, "destroy")
    var showEndChatSpy = jest.spyOn(commonChatController, "showEndChatPage").mockImplementation()
    commonChatController.closeChat()

    expect(surveySpy).toHaveBeenCalledTimes(1);
    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(nullSpy).toHaveBeenCalledTimes(0);
    expect(destroySpy).toHaveBeenCalledTimes(0);
    expect(showEndChatSpy).toHaveBeenCalledTimes(1);
    expect(commonChatController.container).not.toBe(null);
  })

  it("closeChat is called when the post survey chat wrapper is open without escalation or an embedded div", () => {
    var html = `
		<div id="postChatSurveyWrapper">
			<p>Fake post chat survey</p>
		</div>
	  `;

    const sdk = {
      getMessages: jest.fn()
    };
    const container = {
      destroy: jest.fn()
    };
    const state = new ChatStates.EngagedState(sdk, jest.fn(), [], jest.fn());
    const fakeSurvey = new PostChatSurveyDigitalAssistantService(sdk);

    commonChatController.state = state
    commonChatController.container = container
    document.body.innerHTML = html;
    var surveySpy = jest.spyOn(commonChatController, "_sendPostChatSurveyDigitalAssistant").mockImplementation(() => fakeSurvey)
    var closeSpy = jest.spyOn(fakeSurvey, "closePostChatSurvey").mockImplementation()
    var nullSpy = jest.spyOn(commonChatController, "_moveToChatNullState").mockImplementation()
    var destroySpy = jest.spyOn(container, "destroy")
    var showEndChatSpy = jest.spyOn(commonChatController, "showEndChatPage").mockImplementation()
    commonChatController.closeChat()

    expect(surveySpy).toHaveBeenCalledTimes(1);
    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(nullSpy).toHaveBeenCalledTimes(0);
    expect(destroySpy).toHaveBeenCalledTimes(0);
    expect(showEndChatSpy).toHaveBeenCalledTimes(1);
    expect(commonChatController.container).not.toBe(null);
  })

  it("closeChat is called when the post survey chat wrapper is not open but with an embedded nuance div", () => {
    var html = `
		<div id="nuanMessagingFrame">
			<p>Fake nuance message frame</p>
		</div>
	  `;

    const sdk = {
      getMessages: jest.fn()
    };
    const container = {
      destroy: jest.fn()
    };
    const state = new ChatStates.EngagedState(sdk, jest.fn(), [], jest.fn());
    const fakeSurvey = new PostChatSurveyDigitalAssistantService(sdk);

    commonChatController.state = state
    commonChatController.container = container
    document.body.innerHTML = html;
    var surveyDigitalSpy = jest.spyOn(commonChatController, "_sendPostChatSurveyDigitalAssistant")
    var surveyWebchatSpy = jest.spyOn(commonChatController, "_sendPostChatSurveyWebchat")
    var nullSpy = jest.spyOn(commonChatController, "_moveToChatNullState").mockImplementation()
    var destroySpy = jest.spyOn(container, "destroy")
    var endPageSpy = jest.spyOn(commonChatController, "showEndChatPage").mockImplementation()
    commonChatController.closeChat()

    expect(surveyDigitalSpy).toHaveBeenCalledTimes(0);
    expect(surveyWebchatSpy).toHaveBeenCalledTimes(0);
    expect(nullSpy).toHaveBeenCalledTimes(0);
    expect(endPageSpy).toHaveBeenCalledTimes(1);
    expect(destroySpy).toHaveBeenCalledTimes(0);
  })

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


    let spy = jest.spyOn(commonChatController, 'getRadioId');
    document.body.innerHTML = html;

    expect(commonChatController.getRadioId("q1-")).toBe("q1--2")
  });

  it("getTextAreaValue returns an Element object", () => {


    var html = `<textarea id="test" name="test" rows="4" cols="50">testing</textarea>`;
    document.body.innerHTML = html;
    let spy = jest.spyOn(commonChatController, 'getTextAreaValue');

    expect(commonChatController.getTextAreaValue("test")).toBe("testing");
  });

  it("_sendPostChatSurveyWebchat returns a new instance of PostChatSurveyWebchatService", () => {

    const sdk = {
      getOpenerScripts: "hello"
    }

    let spy = jest.spyOn(commonChatController, '_sendPostChatSurveyWebchat');

    expect(commonChatController._sendPostChatSurveyWebchat(sdk)).toStrictEqual(new PostChatSurveyWebchatService(sdk))

  });

  it("_sendPostChatSurveyDigitalAssistant returns a new instance of PostChatSurveyDigitalAssistantService", () => {

    const sdk = {
      getOpenerScripts: jest.fn().mockReturnValue(null)
    }

    let spy = jest.spyOn(commonChatController, '_sendPostChatSurveyDigitalAssistant');

    expect(commonChatController._sendPostChatSurveyDigitalAssistant(sdk)).toStrictEqual(new PostChatSurveyDigitalAssistantService(sdk))

  });

  it("closeNuanceChat sends closeChat to nuance if chat is in progress ", () => {
    const html = `<div id="error-message" class="chat-in-progress"></div>`;
    document.body.innerHTML = html;

    const sdk = {
      isChatInProgress: jest.fn().mockReturnValue(true),
      closeChat: jest.fn()
    };

    window.Inq = {
      SDK: sdk
    };

    commonChatController.nuanceFrameworkLoaded(window);
    commonChatController.closeNuanceChat();

    expect(sdk.closeChat).toHaveBeenCalledTimes(1);
  });

  it("onSkipToTopLink should focus on the skipToTopLink", () => {

    const html = `<div id="skipToTop"><a id="skipToTopLink" href="#skipToTopLink">Skip to top of conversation</a></div>`;
    document.body.innerHTML = html;
    const evt = { preventDefault: jest.fn() }
    const mockSkipToTopLink = document.getElementById('skipToTopLink');

    commonChatController.onSkipToTopLink(evt);

    expect(evt.preventDefault).toHaveBeenCalled();
    expect(mockSkipToTopLink === document.activeElement).toBeTruthy;
  });

  it("showEndChatPage removes the skin header buttons and calls post chat survey", () => {

    const html = `<h1 id="heading_chat_ended">Chat ended</h1>`;
    document.body.innerHTML = html;
    const mockChatEnded = document.getElementById('heading_chat_ended');
    const mockContainer = {
      _removeSkinHeadingElements: jest.fn(),
      showPage: jest.fn()
    }

    commonChatController.container = mockContainer;
    commonChatController.closeNuanceChat = jest.fn();



    let removeSkinHeadingElementsSpy = jest.spyOn(commonChatController.container, '_removeSkinHeadingElements');
    let showPageSpy = jest.spyOn(commonChatController.container, 'showPage');
    let closeNuanceChatSpy = jest.spyOn(commonChatController, 'closeNuanceChat');

    commonChatController.showEndChatPage(true);

    const sdk = {
      _removeSkinHeadingElements: jest.fn(),
      showPage: jest.fn()
    };

    window.Inq = {
      SDK: sdk
    };

    expect(removeSkinHeadingElementsSpy).toHaveBeenCalledTimes(1);
    expect(showPageSpy).toHaveBeenCalledTimes(1);
    expect(closeNuanceChatSpy).toHaveBeenCalledTimes(1);
    expect(mockChatEnded === document.activeElement).toBeTruthy;
  });

  it("onStartTyping sends an activity message to Nuance", () => {


    const sdk = {
      sendActivityMessage: jest.fn(),
      isChatInProgress: jest.fn()
    };

    window.Inq = {
      SDK: sdk
    };

    commonChatController.nuanceFrameworkLoaded(window);
    commonChatController.onStartTyping();

    expect(sdk.sendActivityMessage).toHaveBeenCalledTimes(1);

  });

  it("onStopTyping sends an activity message to Nuance", () => {


    const sdk = {
      sendActivityMessage: jest.fn(),
      isChatInProgress: jest.fn()
    };

    window.Inq = {
      SDK: sdk
    };

    commonChatController.nuanceFrameworkLoaded(window);
    commonChatController.onStopTyping();

    expect(sdk.sendActivityMessage).toHaveBeenCalledTimes(1);

  })

  it("hasBeenSurveyed returns true if there is a survey cookie", () => {

    document.cookie = "surveyed=true";
    expect(commonChatController.hasBeenSurveyed()).toBe(true);
  })

  it("hasBeenSurveyed returns false if there is a false survey cookie", () => {

    document.cookie = "surveyed=false";
    expect(commonChatController.hasBeenSurveyed()).toBe(false);
  })

  it("hasBeenSurveyed returns false if there is no survey value", () => {

    document.cookie = "mockCookie=true";
    expect(commonChatController.hasBeenSurveyed()).toBe(false);
  })

  it("hasBeenSurveyed returns false if there is no cookie", () => {

    expect(commonChatController.hasBeenSurveyed()).toBe(false);
  })

  it("onConfirmEndChat when has been surveyed should show end chat page", () => {

    var closeNuanceSpy = jest.spyOn(commonChatController, "closeNuanceChat").mockImplementation();
    var closingStateSpy = jest.spyOn(commonChatController, "_moveToClosingState").mockImplementation();
    var showEndChatPageSpy = jest.spyOn(commonChatController, "showEndChatPage").mockImplementation();

    const sdk = { getMessages: jest.fn() };
    const state = new ChatStates.EngagedState(sdk, jest.fn(), [], jest.fn());

    commonChatController.state = state;

    document.cookie = "surveyed=true";

    commonChatController.onConfirmEndChat();

    expect(closeNuanceSpy).toHaveBeenCalledTimes(1);
    expect(closingStateSpy).toHaveBeenCalledTimes(1);
    expect(showEndChatPageSpy).toHaveBeenCalledTimes(1);

    expect(showEndChatPageSpy).toHaveBeenCalledWith(false);
  })

  it("onConfirmEndChat when has not been surveyed and has been escalated should show webchat survey", () => {

    var closeNuanceSpy = jest.spyOn(commonChatController, "closeNuanceChat").mockImplementation();
    var closingStateSpy = jest.spyOn(commonChatController, "_moveToClosingState").mockImplementation();
    var showEndChatPageSpy = jest.spyOn(commonChatController, "showEndChatPage").mockImplementation();
    var showPageMock = jest.fn();

    const sdk = { getMessages: jest.fn() };
    const state = new ChatStates.EngagedState(sdk, jest.fn(), [], jest.fn());
    const fakeSurvey = new PostChatSurveyWebchatService(sdk);
    const container = { showPage: showPageMock };

    var sendWebchatSurveySpy = jest.spyOn(commonChatController, "_sendPostChatSurveyWebchat").mockImplementation(() => fakeSurvey);
    var beginWebchatSurveySpy = jest.spyOn(fakeSurvey, "beginPostChatSurvey").mockImplementation();

    state.escalated = true;

    commonChatController.container = container;
    commonChatController.state = state;

    document.cookie = "surveyed=false";

    commonChatController.onConfirmEndChat();

    expect(closeNuanceSpy).toHaveBeenCalledTimes(1);
    expect(closingStateSpy).toHaveBeenCalledTimes(1);
    expect(showEndChatPageSpy).toHaveBeenCalledTimes(0);
    expect(sendWebchatSurveySpy).toHaveBeenCalledTimes(1);
    expect(beginWebchatSurveySpy).toHaveBeenCalledTimes(1);
    expect(showPageMock).toHaveBeenCalledTimes(1);
  })

  it("onConfirmEndChat when has not been surveyed and has not been escalated should show assistant survey", () => {

    var closeNuanceSpy = jest.spyOn(commonChatController, "closeNuanceChat").mockImplementation();
    var closingStateSpy = jest.spyOn(commonChatController, "_moveToClosingState").mockImplementation();
    var showEndChatPageSpy = jest.spyOn(commonChatController, "showEndChatPage").mockImplementation();
    var showPageMock = jest.fn();

    const sdk = { getMessages: jest.fn() };
    const state = new ChatStates.EngagedState(sdk, jest.fn(), [], jest.fn());
    const fakeSurvey = new PostChatSurveyDigitalAssistantService(sdk);
    const container = { showPage: showPageMock };

    var sendAssistantSurveySpy = jest.spyOn(commonChatController, "_sendPostChatSurveyDigitalAssistant").mockImplementation(() => fakeSurvey);
    var beginAssistantSurveySpy = jest.spyOn(fakeSurvey, "beginPostChatSurvey").mockImplementation();

    state.escalated = false;

    commonChatController.container = container;
    commonChatController.state = state;

    document.cookie = "surveyed=false";

    commonChatController.onConfirmEndChat();

    expect(closeNuanceSpy).toHaveBeenCalledTimes(1);
    expect(closingStateSpy).toHaveBeenCalledTimes(1);
    expect(showEndChatPageSpy).toHaveBeenCalledTimes(0);
    expect(sendAssistantSurveySpy).toHaveBeenCalledTimes(1);
    expect(beginAssistantSurveySpy).toHaveBeenCalledTimes(1);
    expect(showPageMock).toHaveBeenCalledTimes(1);
  })


  it("onPostChatSurveyWebchatSubmitted should submit answers and show end chat page", () => {

    var showEndChatPageSpy = jest.spyOn(commonChatController, "showEndChatPage").mockImplementation();
    var detachMock = jest.fn();

    commonChatController.getRadioId = jest.fn(() => "radioId");
    commonChatController.getRadioValue = jest.fn(() => "radioValue");
    commonChatController.getTextAreaValue = jest.fn(() => "textAreaValue");

    const sdk = { getMessages: jest.fn() };
    const fakeSurvey = new PostChatSurveyWebchatService(sdk);
    const mockSurveyPage = { detach: detachMock };

    var sendWebchatSurveySpy = jest.spyOn(commonChatController, "_sendPostChatSurveyWebchat").mockImplementation(() => fakeSurvey);
    var submitDigitalAssistantSurveySpy = jest.spyOn(fakeSurvey, "submitPostChatSurvey").mockImplementation();

    commonChatController.onPostChatSurveyWebchatSubmitted(mockSurveyPage);

    expect(sendWebchatSurveySpy).toHaveBeenCalledTimes(1);
    expect(submitDigitalAssistantSurveySpy).toHaveBeenCalledTimes(1);
    expect(showEndChatPageSpy).toHaveBeenCalledTimes(1);
    expect(detachMock).toHaveBeenCalledTimes(1);
    expect(document.cookie).toContain("surveyed=true");

    //need to figure out way to test answers but not obvious if we can
  });

  it("onPostChatSurveyDigitalAssistantSubmitted should submit answers and show end chat page", () => {

    var showEndChatPageSpy = jest.spyOn(commonChatController, "showEndChatPage").mockImplementation();
    var detachMock = jest.fn();

    commonChatController.getRadioId = jest.fn(() => "radioId");
    commonChatController.getRadioValue = jest.fn(() => "radioValue");
    commonChatController.getTextAreaValue = jest.fn(() => "textAreaValue");

    const sdk = { getMessages: jest.fn() };
    const fakeSurvey = new PostChatSurveyWebchatService(sdk);
    const mockSurveyPage = { detach: detachMock };

    var sendDigitalAssistantSurveySpy = jest.spyOn(commonChatController, "_sendPostChatSurveyDigitalAssistant").mockImplementation(() => fakeSurvey);
    var submitWebchatSurveySpy = jest.spyOn(fakeSurvey, "submitPostChatSurvey").mockImplementation();

    commonChatController.onPostChatSurveyDigitalAssistantSubmitted(mockSurveyPage);

    expect(sendDigitalAssistantSurveySpy).toHaveBeenCalledTimes(1);
    expect(submitWebchatSurveySpy).toHaveBeenCalledTimes(1);
    expect(showEndChatPageSpy).toHaveBeenCalledTimes(1);
    expect(detachMock).toHaveBeenCalledTimes(1);
    expect(document.cookie).toContain("surveyed=true");

    //need to figure out way to test answers but not obvious if we can
  });

  it("onRestoreChat restores the chat container and sends an activity message to Nunace", () => {

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

    expect(sdk.sendActivityMessage).toHaveBeenCalledTimes(1);
    expect(restore).toHaveBeenCalledTimes(1);
  });

  it("onHideChat minimises the chat container and sends an activity message to Nunace", () => {


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

    expect(sdk.sendActivityMessage).toHaveBeenCalledTimes(1);
    expect(minimiseSpy).toHaveBeenCalledTimes(1);
  });

  it("onSoundToggle adds the active class to the soundtoggle element if it is inactive", () => {

    const html = `<button id="toggleSound" class="inactive">Turn notification sound on</button>`;
    document.body.innerHTML = html;

    commonChatController.onSoundToggle();

    expect(document.getElementById("toggleSound").classList.contains("active")).toBe(true);
  });

  it("onSoundToggle adds the inactive class to the soundtoggle element if it is active", () => {

    const html = `<button id="toggleSound" class="active">Turn notification sound on</button>`;
    document.body.innerHTML = html;

    commonChatController.onSoundToggle();

    expect(document.getElementById("toggleSound").classList.contains("inactive")).toBe(true);
  });

  it("_moveToClosingState creates new closing state", () => {

    var spy = jest.spyOn(commonChatController, '_moveToState');

    commonChatController._moveToClosingState();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("onCloseChat calls onClickedClose", () => {
    const sdk = {
      getMessages: jest.fn()
    };

    document.body.innerHTML = `<div id="systemMessageBanner"></div>`

    const state = new ChatStates.EngagedState(sdk, jest.fn(), [], jest.fn());
    commonChatController.state = state;
    const spy = jest.spyOn(state, 'onClickedClose');

    commonChatController.onCloseChat();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("_displayOpenerScripts retrieves the opener scripts and adds them to the transcript", () => {
    const [sdk, container] = createDisplayOpenerScriptsDependencies();


    window.Inq = {
      SDK: sdk
    };

    commonChatController.container = container;
    commonChatController._displayOpenerScripts(window);
    const handleMessage = sdk.getOpenerScripts.mock.calls[0][0];
    handleMessage(["this is an opener script"]);

    expect(sdk.getOpenerScripts).toHaveBeenCalledTimes(1);
    expect(commonChatController.container.transcript.addOpenerScript).toHaveBeenCalledTimes(1);
  });

  it("_displayOpenerScripts retrieves the opener scripts does not add anything to transcript if there are no opener scripts returned", () => {
    const [sdk, container] = createDisplayOpenerScriptsDependencies();


    window.Inq = {
      SDK: sdk
    };

    commonChatController.container = container;
    commonChatController._displayOpenerScripts(window);
    const handleMessage = sdk.getOpenerScripts.mock.calls[0][0];
    handleMessage(null);

    expect(sdk.getOpenerScripts).toHaveBeenCalledTimes(1);
    expect(commonChatController.container.transcript.addOpenerScript).toHaveBeenCalledTimes(0);
  });

  it("_moveToChatShownState move to show state", () => {

    var spy = jest.spyOn(commonChatController, '_moveToState');
    var engageSpy = jest.spyOn(commonChatController, '_engageChat').mockImplementation();
    var closeSpy = jest.spyOn(commonChatController, 'closeChat').mockImplementation();

    commonChatController._moveToChatShownState();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(commonChatController.state).toBeInstanceOf(ChatStates.ShownState);
    commonChatController.state.onSend("test");
    commonChatController.state.onClickedClose();
    expect(engageSpy).toHaveBeenCalledTimes(1);
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it("_engageChat engages the chat correctly", () => {
    var engageChatMock = jest.fn();
    const sdk = {
      getOpenerScripts: jest.fn().mockReturnValue(null),
      chatDisplayed: jest.fn(),
      engageChat: engageChatMock
    }
    commonChatController.sdk = sdk;

    commonChatController._engageChat("text");
    expect(engageChatMock).toHaveBeenCalledTimes(1);
  })


  it("include elements for printing using onPrint", () => {

    document.head.innerHTML = `
    <style id="style1">.print-only { display: none; }</style>
    <style id="style2">.timestamp-outer { clear: both; }</style>
    `
    document.body.innerHTML = `
    <div class="contact">
        <p>Telephone:<br><strong>0300 200 3600</strong></p>
        <p>Outside UK:<br><strong>+44 161 930 8445</strong></p>
    </div>

    <p>Opening times:</p>
    <p>Our phone line opening hours are:</p>
    <p>Monday to Friday: 8am to 6pm</p>
    <p>Closed weekends and bank holidays.</p>

    <div id="ciapiSkinContainer" class="ciapiSkinContainerStandardSize">
    <div id="titleBar" class="govuk-!-display-none-print">

    <div class="dropdown">
        <button id="menuButton" class="dropbtn" draggable="false" role="button" type="button" aria-expanded="false" aria-controls="menuList" aria-label="Menu">
            <div id="menuText" class="govuk-heading-s govuk-!-font-size-19">Menu</div>
        </button>
    
    <div id="menuList" class="dropdown-content">
        <button id="ciapiSkinCloseButton" role="button" tabindex="0"> End chat </button>
        <button id="printButton" role="button" tabindex="0"> Print or save chat </button>
        <button id="toggleSizeButton" role="button">Increase chat size</button>
        <button id="toggleSound" class="active"> Turn notification sound off </button>
        <button id="accessibility-statement-link" role="button">Accessibility statement (opens in a new tab)</button>
    </div>
    </div>
  
    <div id="ciapiSkinTitleBar">
        <h2 class="govuk-heading-s govuk-!-font-size-19">Ask HMRC</h2>
    </div>

    <span id="chat-id">4055229913802606</span>
    <p id="print-date" class="govuk-body print-only"></p>
   
    <div id="ciapiChatComponents">
      <div id="systemMessageBanner">You're speaking with a computer</div>
          <div id="ciapiSkinChatTranscript" class="ciapiSkinChatTranscript print-overflow-visible" role="region" tabindex="0" aria-label="chat transcript">
              <div id="skipToBottom"><a id="skipToBottomLink" href="#" class="govuk-skip-link">Skip to bottom of conversation</a></div>
          <div class="timestamp-outer"><span class="govuk-visually-hidden">1:40 PM</span><h3 class="print-only print-float-left govuk-!-font-weight-bold govuk-body">HMRC said: </h3><div class="ciapi-agent-container"><div class="govuk-body ciapi-agent-message" tabindex="-1" id="liveMsgId9.654247787119152" aria-live="polite"><div class="govuk-visually-hidden"><h3>1:40 PM Automated message : </h3></div> Hello, I’m HMRC’s digital assistant. <div class="govuk-!-margin-top-static-5"> Tell me in a few words what you’d like help with, without giving me any personal information. </div></div></div><p class="print-only govuk-body popup-print-float-left" aria-hidden="true">1:40 PM</p></div>
          <div class="timestamp-outer"><span class="govuk-visually-hidden">1:55 PM</span><h2 class="print-only popup-print-float-right govuk-!-font-weight-bold govuk-body">You said: </h2><div class="ciapi-customer-container" style="padding-bottom: 68px;"><div class="govuk-body ciapi-customer-message" id="liveMsgId61.54920466263988"><div class="govuk-visually-hidden"><h2>1:55 PM You said : </h2></div> Hi</div></div><p class="print-only govuk-body popup-print-float-right print-timestamp-right" aria-hidden="true">1:55 PM</p></div>
          <div class="timestamp-outer"><span class="govuk-visually-hidden">1:55 PM</span><h3 class="print-only print-float-left govuk-!-font-weight-bold govuk-body">hmrcda said: </h3><div class="ciapi-agent-container"><div class="govuk-body ciapi-agent-message" tabindex="-1" id="liveMsgId88.72243571679525" aria-live="polite"><div class="govuk-visually-hidden"><h3>1:55 PM Adviser said :</h3></div> Hello</div></div><p class="print-only govuk-body popup-print-float-left" aria-hidden="true">1:55 PM</p></div>
          <div class="timestamp-outer"><span class="govuk-visually-hidden">1:55 PM</span><h2 class="print-only popup-print-float-right govuk-!-font-weight-bold govuk-body">You said: </h2><div class="ciapi-customer-container" style="padding-bottom: 68px;"><div class="govuk-body ciapi-customer-message" id="liveMsgId41.3914917731497"><div class="govuk-visually-hidden"><h2>1:55 PM You said : </h2></div> tell me about self assessment</div></div><p class="print-only govuk-body popup-print-float-right print-timestamp-right" aria-hidden="true">1:55 PM</p></div>
          <div class="timestamp-outer"><span class="govuk-visually-hidden">1:55 PM</span><h3 class="print-only print-float-left govuk-!-font-weight-bold govuk-body">hmrcda said: </h3><div class="ciapi-agent-container"><div class="govuk-body ciapi-agent-message" tabindex="-1" id="liveMsgId19.826521566796284" aria-live="polite"><div class="govuk-visually-hidden"><h3>1:55 PM Adviser said :</h3></div> Self Assessment is a system we use to collect Income Tax. <br><br>Tax is usually paid through wages and pensions, but people and businesses with other income must report it in a tax return.<br><br>Find out more about <a href="https://www.gov.uk/self-assessment-tax-returns" rel="noopener noreferrer" target="_blank">Self Assessment tax returns (opens in a new tab)</a>. </div></div><p class="print-only govuk-body popup-print-float-left" aria-hidden="true">1:55 PM</p></div>
          <div class="timestamp-outer"><span class="govuk-visually-hidden">1:55 PM</span><h2 class="print-only popup-print-float-right govuk-!-font-weight-bold govuk-body">You said: </h2><div class="ciapi-customer-container" style="padding-bottom: 68px;"><div class="govuk-body ciapi-customer-message" id="liveMsgId22.14072214444012"><div class="govuk-visually-hidden"><h2>1:55 PM You said : </h2></div> where is my</div></div><p class="print-only govuk-body popup-print-float-right print-timestamp-right" aria-hidden="true">1:55 PM</p></div>
          <div class="timestamp-outer"><span class="govuk-visually-hidden">1:55 PM</span><h2 class="print-only popup-print-float-left govuk-!-font-weight-bold govuk-body">hmrcda said: </h2><div class="ciapi-agent-container" aria-live="polite"><div class="govuk-body ciapi-agent-message" tabindex="-1" id="liveAutomatedMsgId31.49975961060609"><div>What is your question about?<ul class="quick-reply-widget"><li>Child Benefit</li><li>PAYE</li><li>Self Assessment</li><li>Something else</li></ul></div></div></div><p class="print-only govuk-body popup-print-float-left">1:55 PM</p></div>
          <div class="timestamp-outer"><span class="govuk-visually-hidden">1:55 PM</span><h2 class="print-only popup-print-float-right govuk-!-font-weight-bold govuk-body">You said: </h2><div class="ciapi-customer-container" style="padding-bottom: 68px;"><div class="govuk-body ciapi-customer-message" id="liveMsgId28.173483911535957"><div class="govuk-visually-hidden"><h2>1:55 PM You said : </h2></div> Child Benefit</div></div><p class="print-only govuk-body popup-print-float-right print-timestamp-right" aria-hidden="true">1:55 PM</p></div>
          <div class="timestamp-outer"><span class="govuk-visually-hidden">1:55 PM</span><h3 class="print-only print-float-left govuk-!-font-weight-bold govuk-body">hmrcda said: </h3><div class="ciapi-agent-container"><div class="govuk-body ciapi-agent-message" tabindex="-1" id="liveMsgId53.26504190009273" aria-live="polite"><div class="govuk-visually-hidden"><h3>1:55 PM Adviser said :</h3></div> You can <a href="https://www.gov.uk/guidance/check-when-you-can-expect-a-reply-from-hmrc" target="blank">check when can you expect a reply from HMRC (opens in a new tab)</a>.</div></div><p class="print-only govuk-body popup-print-float-left" aria-hidden="true">1:55 PM</p></div><div id="skipToTop" class="skipToTopWithScroll govuk-!-padding-top-2"><a id="skipToTopLink" href="#" class="govuk-skip-link">Skip to top of conversation</a></div>
      </div>
    </div>
        
    <div id="ciapiSkinFooter" class="govuk-!-display-none-print">
      <label class="govuk-label" for="custMsg">Enter a message</label>
      <div id="ciapiInput">
        <textarea id="custMsg" class="govuk-textarea" role="textbox" aria-label="Enter a message " placeholder="" rows="5" cols="50" name="comments"></textarea>
      </div>
      <div id="ciapiSend">
        <button id="ciapiSkinSendButton" aria-disabled="true" class="govuk-button" data-module="govuk-button" disabled="">Send message</button>
        <div id="sentMessageNotification" aria-live="polite" class="govuk-visually-hidden"></div>
      </div>
      </div>
    </div>
    </div>`


    const evt = { preventDefault: jest.fn() }
    commonChatController.onPrint(evt)
    const printingIframe = document.getElementById('printIframe')
    expect(printingIframe).not.toBeNull()

    const parser = new DOMParser();
    const virtualIframe = parser.parseFromString(printingIframe.srcdoc, 'text/html')
    const htmlElements = virtualIframe.querySelectorAll(".timestamp-outer")
    const styleElements = virtualIframe.querySelectorAll('style, link[rel="stylesheet"]')
    const chatID = virtualIframe.getElementById('chat-id')
    const printDate = virtualIframe.getElementById('print-date')
    const contactInfo = virtualIframe.querySelector('.contact')
    const footerDA = virtualIframe.getElementById('ciapiSkinFooter')
    expect(chatID.outerHTML).toBe(`<span id="chat-id">4055229913802606</span>`)
    expect(printDate.outerHTML).toBe(`<p id="print-date" class="govuk-body print-only">${PrintUtils.getPrintDate()}</p>`)
    expect(htmlElements.length).toBe(9)
    expect(htmlElements[0].outerHTML).toBe(`<div class="timestamp-outer"><span class="govuk-visually-hidden">1:40 PM</span><h3 class="print-only print-float-left govuk-!-font-weight-bold govuk-body">HMRC said: </h3><div class="ciapi-agent-container"><div class="govuk-body ciapi-agent-message" tabindex="-1" id="liveMsgId9.654247787119152" aria-live="polite"><div class="govuk-visually-hidden"><h3>1:40 PM Automated message : </h3></div> Hello, I’m HMRC’s digital assistant. <div class="govuk-!-margin-top-static-5"> Tell me in a few words what you’d like help with, without giving me any personal information. </div></div></div><p class="print-only govuk-body popup-print-float-left" aria-hidden="true">1:40 PM</p></div>`)
    expect(htmlElements[3].outerHTML).toBe(`<div class="timestamp-outer"><span class="govuk-visually-hidden">1:55 PM</span><h2 class="print-only popup-print-float-right govuk-!-font-weight-bold govuk-body">You said: </h2><div class="ciapi-customer-container" style="padding-bottom: 68px;"><div class="govuk-body ciapi-customer-message" id="liveMsgId41.3914917731497"><div class="govuk-visually-hidden"><h2>1:55 PM You said : </h2></div> tell me about self assessment</div></div><p class="print-only govuk-body popup-print-float-right print-timestamp-right" aria-hidden="true">1:55 PM</p></div>`)
    expect(htmlElements[4].outerHTML).toBe(`<div class="timestamp-outer"><span class="govuk-visually-hidden">1:55 PM</span><h3 class="print-only print-float-left govuk-!-font-weight-bold govuk-body">hmrcda said: </h3><div class="ciapi-agent-container"><div class="govuk-body ciapi-agent-message" tabindex="-1" id="liveMsgId19.826521566796284" aria-live="polite"><div class="govuk-visually-hidden"><h3>1:55 PM Adviser said :</h3></div> Self Assessment is a system we use to collect Income Tax. <br><br>Tax is usually paid through wages and pensions, but people and businesses with other income must report it in a tax return.<br><br>Find out more about <a href="https://www.gov.uk/self-assessment-tax-returns" rel="noopener noreferrer" target="_blank">Self Assessment tax returns (opens in a new tab)</a>. </div></div><p class="print-only govuk-body popup-print-float-left" aria-hidden="true">1:55 PM</p></div>`)
    expect(styleElements.length).toBe(2)
    expect(styleElements[0].outerHTML).toBe(`<style id="style1">.print-only { display: none; }</style>`)
    expect(styleElements[1].outerHTML).toBe(`<style id="style2">.timestamp-outer { clear: both; }</style>`)
    expect(contactInfo).toBeNull()
    expect(footerDA).toBeNull()
  })

  it("_moveToChatNullState should move to a Null state", () => {


    let _moveToChatNullStateSpy = jest.spyOn(commonChatController, '_moveToChatNullState');
    let _moveToStateSpy = jest.spyOn(commonChatController, '_moveToState');
    commonChatController._moveToChatNullState();

    expect(_moveToChatNullStateSpy).toHaveBeenCalledTimes(1);
    expect(_moveToStateSpy).toHaveBeenCalledTimes(1);
  });

  it("onSend cleans and sends customer input text", () => {

    const html = `<textarea id="custMsg" aria-label="Enter a message" placeholder="" class="govuk-textarea" cols="50" name="comments">Testing 123</textarea>`;
    document.body.innerHTML = html;

    const sdk = {
      sendMessage: jest.fn(),
      getMessages: jest.fn()
    }

    const container = {
      currentInputText: jest.fn().mockReturnValue("Testing 123"),
      clearCurrentInputText: jest.fn()
    };
    commonChatController.container = container;

    const state = new ChatStates.EngagedState(sdk, jest.fn(), [], jest.fn());
    commonChatController.state = state;

    let currentInputTextSpy = jest.spyOn(commonChatController.container, 'currentInputText');
    let clearCurrentInputTextSpy = jest.spyOn(commonChatController.container, 'clearCurrentInputText');
    commonChatController.onSend();

    expect(currentInputTextSpy).toHaveBeenCalledTimes(1);
    expect(clearCurrentInputTextSpy).toHaveBeenCalledTimes(1);

    expect(document.getElementById("custMsg")).not.toBe("Testing 123");
    expect(sdk.sendMessage).toHaveBeenCalledTimes(1);
  });

  it("Tests functionality of isIVRWebchatOnly when class of dav4IVRWebchat exists", () => {
    document.body.innerHTML = `
    <div class="dav4IVRWebchat"></div>
    `
    expect(commonChatController.isIVRWebchatOnly()).toBe(true)
  });

  it("Tests functionality of isIVRWebchatOnly when class of dav4IVRWebchat does not exist", () => {
    document.body.innerHTML = `
    <div></div>
    `
    expect(commonChatController.isIVRWebchatOnly()).toBe(false)
  });

  it("Tests functionality of _launchChat when state is missed but it is not an IVR webchat", () => {
    const sdk = {
      getOpenerScripts: jest.fn().mockReturnValue(null),
      chatDisplayed: jest.fn()
    }

    window.Inq = {
      SDK: sdk
    };

    document.body.innerHTML = `
    <div id="ciapiSkinFooter" class="govuk-!-display-none-print">
      <label class="govuk-label" for="custMsg">Enter a message</label>
      <div id="ciapiInput">
        <textarea
          id="custMsg"
          class="govuk-textarea"
          role="textbox"
          aria-label="Enter a message "
          placeholder=""
          rows="5"
          cols="50"
          name="comments">
        </textarea>
      </div>
      <div id="ciapiSend">
        <button id="ciapiSkinSendButton" disabled aria-disabled="true" class="govuk-button" data-module="govuk-button">Send message</button>
        <div id="sentMessageNotification" aria-live="polite" class="govuk-visually-hidden"></div>
      </div>
    </div>`

    const isIVRWebchatOnlySpy = jest.spyOn(commonChatController, 'isIVRWebchatOnly')
    const showChatSpy = jest.spyOn(commonChatController, '_showChat');
    commonChatController._launchChat({ state: 'missed' });
    const ciapiSkinFooter = document.getElementById('ciapiSkinFooter')

    expect(isIVRWebchatOnlySpy).toHaveBeenCalledTimes(1)
    expect(isIVRWebchatOnlySpy).toHaveReturnedWith(false)
    expect(showChatSpy).toHaveBeenCalledTimes(1);
    expect(ciapiSkinFooter.style.display).toBe('none')
  });

  it("Tests functionality of _launchChat when state is missed and it is an IVR webchat", () => {
    const sdk = {
      getOpenerScripts: jest.fn().mockReturnValue(null),
      chatDisplayed: jest.fn(),
    }

    window.Inq = {
      SDK: sdk
    };

    document.body.innerHTML = `<div class="dav4IVRWebchat"></div>`

    const isIVRWebchatOnlySpy = jest.spyOn(commonChatController, 'isIVRWebchatOnly')
    const showChatSpy = jest.spyOn(commonChatController, '_showChat');
    const showDisplayOpenerScripts = jest.spyOn(commonChatController, '_displayOpenerScripts')
    commonChatController._launchChat({ state: 'missed' });

    expect(isIVRWebchatOnlySpy).toHaveBeenCalledTimes(1)
    expect(isIVRWebchatOnlySpy).toHaveReturnedWith(true)
    expect(showChatSpy).toHaveBeenCalledTimes(0);
    expect(showDisplayOpenerScripts).toHaveBeenCalledTimes(0)
  });

  it("Tests functionality of _launchChat when state is show and it is an IVR webchat", () => {
    const sdk = {
      getOpenerScripts: jest.fn().mockReturnValue(null),
      chatDisplayed: jest.fn(),
      autoEngage: jest.fn()
    }

    window.Inq = {
      SDK: sdk
    };
    sessionStorage.isAutoEngage = true

    document.body.innerHTML = `<div class="dav4IVRWebchat"></div>`

    const showChatSpy = jest.spyOn(commonChatController, '_showChat');
    const showDisplayOpenerScripts = jest.spyOn(commonChatController, '_displayOpenerScripts')
    commonChatController._launchChat({ state: 'show' });

    expect(showChatSpy).toHaveBeenCalledTimes(1);
    expect(showDisplayOpenerScripts).toHaveBeenCalledTimes(1)
    expect(sdk.chatDisplayed).toHaveBeenCalledTimes(1)
    expect(sdk.autoEngage).toHaveBeenCalledTimes(1)
  });

  it("Tests functionality of _launchChat when hideContainerOnStart is true and chat is popup", () => {
    
    console.log = jest.fn();
    
    const sdk = {
      getOpenerScripts: jest.fn().mockReturnValue(null),
      chatDisplayed: jest.fn(),
      autoEngage: jest.fn(),
      getMessages: jest.fn()
    }

    window.Inq = {
      SDK: sdk
    };

    const state = new ChatStates.EngagedState(sdk, jest.fn(), [], jest.fn());
    commonChatController.state = state;

    const showChatSpy = jest.spyOn(commonChatController, '_showChat');
    const showDisplayOpenerScripts = jest.spyOn(commonChatController, '_displayOpenerScripts')
    commonChatController._launchChat({ state: 'show' }, true);

    const chatDisplayedArgs = sdk.chatDisplayed.mock.calls[0][0];

    const mockElement = { style: { visibility: "hidden" } };
    commonChatController.container.element = () => mockElement;

    chatDisplayedArgs.previousMessagesCb({ messages: [] });

    expect(showChatSpy).toHaveBeenCalledTimes(1);
    expect(showDisplayOpenerScripts).toHaveBeenCalledTimes(1)
    expect(sdk.chatDisplayed).toHaveBeenCalledTimes(1)

    expect(console.log).toHaveBeenCalledWith("DEBUG: ### making chat container visible", undefined);
    expect(mockElement.style.visibility).toBe('visible')
  });


  it("Tests functionality of authenticatedServiceCheck when the URL includes business-account", () => {
    delete global.window.location
    global.window.location = {
      href: 'https://www.tax.service.gov.uk/business-account'
    }
    const keepSessionAliveSpy = jest.spyOn(commonChatController, 'keepSessionAlive').mockImplementation(() => { })
    commonChatController.authenticatedServiceCheck()
    expect(keepSessionAliveSpy).toHaveBeenCalledWith('business-account')
    expect(keepSessionAliveSpy).toHaveBeenCalledTimes(1)
  });

  it("Tests functionality of authenticatedServiceCheck when the URL includes business-account", () => {
    delete global.window.location
    global.window.location = {
      href: 'https://www.tax.service.gov.uk/personal-account'
    }
    const keepSessionAliveSpy = jest.spyOn(commonChatController, 'keepSessionAlive').mockImplementation(() => { })
    commonChatController.authenticatedServiceCheck()
    expect(keepSessionAliveSpy).toHaveBeenCalledWith('personal-account')
    expect(keepSessionAliveSpy).toHaveBeenCalledTimes(1)
  });

  it("Tests functionality of authenticatedServiceCheck when the URL includes epaye", () => {
    delete global.window.location
    global.window.location = {
      href: 'https://www.tax.service.gov.uk/business-account/epaye/statements/2020-21'
    }
    const keepSessionAliveSpy = jest.spyOn(commonChatController, 'keepSessionAlive').mockImplementation(() => { })
    commonChatController.authenticatedServiceCheck()
    expect(keepSessionAliveSpy).toHaveBeenCalledWith('epaye')
    expect(keepSessionAliveSpy).toHaveBeenCalledTimes(1)
  });

  it("Tests functionality of authenticatedServiceCheck when the URL includes check-income-tax", () => {
    delete global.window.location
    global.window.location = {
      href: 'https://www.tax.service.gov.uk/check-income-tax'
    }
    const keepSessionAliveSpy = jest.spyOn(commonChatController, 'keepSessionAlive').mockImplementation(() => { })
    commonChatController.authenticatedServiceCheck()
    expect(keepSessionAliveSpy).toHaveBeenCalledWith('check-income-tax')
    expect(keepSessionAliveSpy).toHaveBeenCalledTimes(1)
  });

  it("Tests functionality of authenticatedServiceCheck when the URL does not include an authenticated service", () => {
    delete global.window.location
    global.window.location = {
      href: 'https://www.tax.service.gov.uk/test-endpoint'
    }
    const keepSessionAliveSpy = jest.spyOn(commonChatController, 'keepSessionAlive').mockImplementation(() => { })
    commonChatController.authenticatedServiceCheck()
    expect(keepSessionAliveSpy).toHaveBeenCalledTimes(0)
  });

  it("Tests functionality of keepSessionAlive when business-account is an argument", () => {
    const ajaxGetSpy = jest.spyOn(commonChatController, 'ajaxGet').mockImplementation(() => { })
    const broadcastSessionActivitySpy = jest.spyOn(commonChatController, 'broadcastSessionActivity').mockImplementation(() => { })
    commonChatController.keepSessionAlive('business-account')
    expect(ajaxGetSpy).toHaveBeenCalledWith('/business-account/keep-alive', expect.any(Function))
    expect(ajaxGetSpy).toHaveBeenCalledTimes(1)
    expect(broadcastSessionActivitySpy).toHaveBeenCalledTimes(1)
  });

  it("Tests functionality of keepSessionAlive when personal-account is an argument", () => {
    const ajaxGetSpy = jest.spyOn(commonChatController, 'ajaxGet').mockImplementation(() => { })
    const broadcastSessionActivitySpy = jest.spyOn(commonChatController, 'broadcastSessionActivity').mockImplementation(() => { })
    commonChatController.keepSessionAlive('personal-account')
    expect(ajaxGetSpy).toHaveBeenCalledWith('/personal-account/keep-alive', expect.any(Function))
    expect(ajaxGetSpy).toHaveBeenCalledTimes(1)
    expect(broadcastSessionActivitySpy).toHaveBeenCalledTimes(1)
  });

  it("Tests functionality of keepSessionAlive when epaye is an argument", () => {
    const ajaxGetSpy = jest.spyOn(commonChatController, 'ajaxGet').mockImplementation(() => { })
    const broadcastSessionActivitySpy = jest.spyOn(commonChatController, 'broadcastSessionActivity').mockImplementation(() => { })
    commonChatController.keepSessionAlive('epaye')
    expect(ajaxGetSpy).toHaveBeenCalledWith('/business-account/epaye/keep-alive', expect.any(Function))
    expect(ajaxGetSpy).toHaveBeenCalledTimes(1)
    expect(broadcastSessionActivitySpy).toHaveBeenCalledTimes(1)
  });

  it("Tests functionality of keepSessionAlive when check-income-tax is an argument", () => {
    const ajaxGetSpy = jest.spyOn(commonChatController, 'ajaxGet').mockImplementation(() => { })
    const broadcastSessionActivitySpy = jest.spyOn(commonChatController, 'broadcastSessionActivity').mockImplementation(() => { })
    commonChatController.keepSessionAlive('check-income-tax')
    expect(ajaxGetSpy).toHaveBeenCalledWith('/check-income-tax/keep-alive', expect.any(Function))
    expect(ajaxGetSpy).toHaveBeenCalledTimes(1)
    expect(broadcastSessionActivitySpy).toHaveBeenCalledTimes(1)
  });

  it("Tests functionality of ajaxGet when status is 200 and readyState is greater than 3", () => {
    const successCallback = jest.fn();
    const xhrMockObj = {
      open: jest.fn(),
      send: jest.fn(),
      setRequestHeader: jest.fn(),
      readyState: 4,
      status: 200,
      responseText: 'response',
    };

    window.XMLHttpRequest = jest.fn().mockImplementation(() => xhrMockObj)
    commonChatController.ajaxGet('/business-account/keep-alive', successCallback);
    xhrMockObj.onreadystatechange()
    expect(xhrMockObj.open).toHaveBeenCalledWith('GET', '/business-account/keep-alive');
    expect(xhrMockObj.open).toHaveBeenCalledTimes(1)
    expect(xhrMockObj.setRequestHeader).toHaveBeenCalledWith('X-Requested-With', 'XMLHttpRequest');
    expect(xhrMockObj.setRequestHeader).toHaveBeenCalledTimes(1)
    expect(xhrMockObj.send).toHaveBeenCalledTimes(1)
    expect(successCallback).toHaveBeenCalledWith(xhrMockObj.responseText)
    expect(successCallback).toHaveBeenCalledTimes(1)
  });

  it("Tests functionality of ajaxGet when status is 404 and readyState is less than 4", () => {
    const successCallback = jest.fn();
    const xhrMockObj = {
      open: jest.fn(),
      send: jest.fn(),
      setRequestHeader: jest.fn(),
      readyState: 1,
      status: 404,
      responseText: 'response',
    };

    window.XMLHttpRequest = jest.fn().mockImplementation(() => xhrMockObj)
    commonChatController.ajaxGet('/business-account/keep-alive', successCallback);
    xhrMockObj.onreadystatechange()
    expect(xhrMockObj.open).toHaveBeenCalledWith('GET', '/business-account/keep-alive');
    expect(xhrMockObj.open).toHaveBeenCalledTimes(1)
    expect(xhrMockObj.setRequestHeader).toHaveBeenCalledWith('X-Requested-With', 'XMLHttpRequest');
    expect(xhrMockObj.setRequestHeader).toHaveBeenCalledTimes(1)
    expect(xhrMockObj.send).toHaveBeenCalledTimes(1)
    expect(successCallback).toHaveBeenCalledTimes(0)
  });
});
