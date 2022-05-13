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
  const event = { preventDefault: () => {} };
  
  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = ''; 
  });

  beforeEach(() => {
    window.print = jest.fn();
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

  // it("launch chat recieves an error on launch the container", () => {
  //   const commonChatController = new CommonChatController();
  //   console.error = jest.fn()      

  //   const mockContainer = jest.fn().mockReturnValue(null);

  //   commonChatController.container = mockContainer;
  //   commonChatController._launchChat();

  //   expect(console.error).toHaveBeenLastCalledWith("This should never happen. If it doesn't, then remove this 'if'");
  // });

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

  it("_moveToChatShownState move to show state", () => {
    const commonChatController = new CommonChatController();
    const onEngage =  jest.fn();
    const onCloseChat = jest.fn();
    const state = new ChatStates.ShownState(onEngage, onCloseChat);
    commonChatController.state = state;
    var spy = jest.spyOn(commonChatController, '_moveToState');
    
    commonChatController._moveToChatShownState();
    
    expect(spy).toBeCalledTimes(1);
  });
   
  //TODO to fix
  // it("_engageChat should move to engage chat", () => {
  //   const commonChatController = new CommonChatController();

  //   const sdk = {
  //     engageChat: jest.fn()
  //   };

  //   commonChatController.sdk = sdk;

  //   commonChatController._engageChat("somke text");

  //   expect(sdk.engageChat).toBeCalledTimes(1);
  // });

  //TODO to fix
  // it("closeChat if esculated go to adviser PCS and move chat state to null", () => { 
  //   const commonChatController = new CommonChatController();
    
  //   const mockSdk = {
  //     getMessages: jest.fn(),
  //     isChatInProgress: jest.fn(),
  //     getChatParams: () => { return chatParams; },
  //     isConnected: () => { return true; }
  //   };

  //   window.Inq = {
  //     SDK: mockSdk
  //   };

  //   const mockContainer = {
  //     destroy: function () {
  //         return this.destroy;
  //     },
  //   };
    
  //   const mockState = new ChatStates.EngagedState(mockSdk, mockContainer, [], jest.fn());
  //   const esculated  = {
  //     esculated: function () {
  //       return this.isEscalated;
  //     },
  //   };

  //   //commonChatController.container.esculated = true;

  //   commonChatController.state = mockState;
  //   commonChatController.container = mockContainer;
    
  //   let html = 
  //     `<div id="postChatSurveyWrapper">
  //       <div id="postChatSurvey">
  //         <h2 id="legend_give_feedback" tabindex="-1">Give feedback</h2>
  //         <p>We use your feedback to improve our services. The survey takes about one minute to complete. There are 3 questions and they are all optional.</p>
  //       </div>
  //     </div>
  //   `;
  //   document.body.innerHTML = html;
        
  //   commonChatController.nuanceFrameworkLoaded(window);
  //   commonChatController.closeChat();
    
    
  //   //expect(isEscalated).toBeCalledTimes(1);
  //   expect(commonChatController.closeChat()).toBeCalledTimes(1);
  //   //expect(sendPostChatSurveyWebchatSpy).toBeCalledTimes(1);
  // }); 

  //TODO to fix
  // it("onConfirmEndChat will show the esculated PCS page", () => {
  //   const commonChatController = new CommonChatController();

  //   const mockSdk = {
  //     getMessages: jest.fn(),
  //     isChatInProgress: jest.fn()
  //   //   getChatParams: () => { return chatParams; },
  //   //   isConnected: () => { return true; }
  //   };

  //   window.Inq = {
  //     SDK: mockSdk
  //   };

  //   const mockContainer = {
  //     //showPage:jest.fn()
  //   };

  //   // const service = new PostChatSurveyDigitalAssistantService(mockSdk);
  //   // const automaton = {
  //   //   id: "AutomatonID",
  //   //   name: "AutomatonName"
  //   // };
  //   // const timestamp = Date.now();
  //   // service.closePostChatSurvey(automaton, timestamp);

  //   const mockState = new ChatStates.EngagedState(mockSdk, mockContainer, [], jest.fn());
  //   commonChatController.state = mockState;

  //   commonChatController.nuanceFrameworkLoaded(window);
  //   commonChatController.onConfirmEndChat();

  //   // let showPageSpy = jest.spyOn(commonChatController.container, 'showPage');

  //   //expect(commonChatController.onConfirmEndChat).toBeCalledTimes(1);
  // });

  it("getPrintDate sould return the date", () => {
    const commonChatController = new CommonChatController();
    var getPrintDateSpy = jest.spyOn(commonChatController, 'getPrintDate');

    commonChatController.getPrintDate();

    expect(getPrintDateSpy).toBeCalledTimes(1);
  });

  it("removeElementsForPrint should remove elemnets", () => {
    const commonChatController = new CommonChatController();
    var html = `
      <a id="back-link" class="govuk-back-link">Back</a>
      <a id="hmrc-report-technical-issue" hreflang="en" class="govuk-link hmrc-report-technical-issue ">Is this page not working properly? (opens in new tab)</a> 
      <footer id="govuk-footer" class="govuk-footer " role="contentinfo">
        <div class="govuk-width-container banner__text">
          <div class="govuk-footer__meta">
            <div class="govuk-footer__meta-item govuk-footer__meta-item--grow">
              <h2 class="govuk-visually-hidden">Support links</h2>
              <ul class="govuk-footer__inline-list">
                <li class="govuk-footer__inline-list-item"><a class="govuk-footer__link" href="/help/cookies">Cookies</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
      <h1 id="govuk-heading-xl" class="heading-margin-top govuk-heading-xl">Ask HMRC online</h1>
      <div id="hmrc-user-research-banner" class="hmrc-user-research-banner" data-module="hmrc-user-research-banner">
      <div class="hmrc-user-research-banner__container govuk-width-container">
        <div class="hmrc-user-research-banner__text">
          <div class="hmrc-user-research-banner__title govuk-!-font-weight-bold">Help improve our digital assistant</div>
            <a class="govuk-link hmrc-user-research-banner__link">Please take part in our short survey (opens in new window or tab)</a>
          </div>
          <button class="govuk-link hmrc-user-research-banner__close">No thanks</button>
        </div>
      </div>
    `;
    document.body.innerHTML = html;

    const elementList = [
      "govuk-back-link",
      "hmrc-report-technical-issue",
      "govuk-footer",
      "govuk-heading-xl",
      "hmrc-user-research-banner",
    ];

    commonChatController.removeElementsForPrint(elementList);

    expect(document.getElementById("back-link").classList.contains("govuk-!-display-none-print")).toBe(true);
    expect(document.getElementById("hmrc-report-technical-issue").classList.contains("govuk-!-display-none-print")).toBe(true);
    expect(document.getElementById("govuk-footer").classList.contains("govuk-!-display-none-print")).toBe(true);
    expect(document.getElementById("govuk-heading-xl").classList.contains("govuk-!-display-none-print")).toBe(true);
    expect(document.getElementById("hmrc-user-research-banner").classList.contains("govuk-!-display-none-print")).toBe(true);
  });

  it("onPrint returns a print window", () => {
    const commonChatController = new CommonChatController();
    const html = `
      <p id="print-date" class="govuk-body print-only"></p>
      <a id="back-link" class="govuk-back-link">Back</a>
      <a id="hmrc-report-technical-issue" hreflang="en" class="govuk-link hmrc-report-technical-issue ">Is this page not working properly? (opens in new tab)</a> 
      <footer id="govuk-footer" class="govuk-footer " role="contentinfo">
        <div class="govuk-width-container ">
          <div class="govuk-footer__meta">
            <div class="govuk-footer__meta-item govuk-footer__meta-item--grow">
              <h2 class="govuk-visually-hidden">Support links</h2>
              <ul class="govuk-footer__inline-list">
                <li class="govuk-footer__inline-list-item"><a class="govuk-footer__link" href="/help/cookies">Cookies</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
      <h1 id="govuk-heading-xl" class="heading-margin-top govuk-heading-xl">Ask HMRC online</h1>
      <div id="hmrc-user-research-banner" class="hmrc-user-research-banner" data-module="hmrc-user-research-banner">
      <div class="hmrc-user-research-banner__container govuk-width-container">
        <div class="hmrc-user-research-banner__text">
          <div class="hmrc-user-research-banner__title govuk-!-font-weight-bold">Help improve our digital assistant</div>
            <a class="govuk-link hmrc-user-research-banner__link">Please take part in our short survey (opens in new window or tab)</a>
          </div>
          <button class="govuk-link hmrc-user-research-banner__close">No thanks</button>
        </div>
      </div>
      <div id="nuanMessagingFrame"><iframe id="inqChatStage" title="Chat Window" name="10006719" src="https://www.qa.tax.service.gov.uk/engagement-platform/nuance/hmrc-uk-nuance.html?IFRAME&amp;nuance-frame-ac=0" style="z-index:9999999; display: none;overflow: hidden; position: absolute; height: 1px; width: 1px; left: 0px; top: 0px; border-style: none; border-width: 0px;"></iframe><div id="ciapiSkin">
      <p class="govuk-body print-only">Chat ID: <span id="chat-id">388262275535576909</span></p>
      <p id="print-date" class="govuk-body print-only"></p>
      </div>
      <div id="ciapiSkinContainer">
          <div id="ciapiSkinHeader" class="govuk-!-display-none-print">
            <div id="print">
              <button id="printButton" class="govuk-button govuk-button--secondary" data-module="govuk-button">
                Print or save
              </button>
            </div>
            <div id="sound">
              <button id="toggleSound" class="govuk-button govuk-button--secondary active" data-module="govuk-button">
                Turn notification sound off
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.innerHTML = html;
    const evt = { preventDefault: jest.fn() }

    commonChatController.onPrint(evt);

    expect(document.getElementById("govuk-back-link")).toBe(null);
    expect(document.getElementById("nuanMessagingFrame")).not.toBe(null);
  });

 // TODO to fix
  // it("onPostChatSurveyDigitalAssistantSubmitted call the showEndChatPage", () => {
  //   const surveyPage = `
  //     <div id="postChatSurveyWrapper">
  //       <div id="postChatSurvey">
  //         <h2 id="legend_give_feedback" tabindex="-1">Give feedback</h2>

  //         <p>We use your feedback to improve our services. The survey takes about one minute to complete. There are 3 questions and they are all optional.</p>

  //         <div class="govuk-grid-row">
  //           <div class="govuk-grid-column-two-thirds">

  //             <form method="POST">
  //             var onPostChatSurveyDigitalAssistantSubmittedSpy = jest.spyOn(commonChatController, 'onPostChatSurveyDigitalAssistantSubmitted');

  //               <div class="govuk-form-group">

  //                 <fieldset class="govuk-fieldset" id="question1">
  //                   <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
  //                     Was the digital assistant useful?
  //                   </legend>
  //                   <div class="govuk-radios govuk-radios--inline">
  //                     <div class="govuk-radios__item">
  //                       <input class="govuk-radios__input" id="q1-" name="q1-" type="radio" value="Yes">
  //                       <label class="govuk-label govuk-radios__label" for="q1-">Yes</label>
  //                     </div>
  //                     <div class="govuk-radios__item">
  //                       <input class="govuk-radios__input" id="q1--2" name="q1-" type="radio" value="No">
  //                       <label class="govuk-label govuk-radios__label" for="q1--2">No</label>
  //                     </div>
  //                   </div>
  //                 </fieldset>

  //                 <label class="govuk-label govuk-label--m" for="q2-">
  //                   How could we improve it?
  //                 </label>
  //                 <textarea class="govuk-textarea" id="q2-" name="q2-" rows="5"></textarea>

  //                 <fieldset class="govuk-fieldset" id="question3">
  //                   <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
  //                     If you had not used the digital assistant, how else would you have contacted us?
  //                   </legend>
  //                   <div class="govuk-radios" data-module="govuk-radios">
  //                     <div class="govuk-radios__item">
  //                       <input class="govuk-radios__input" id="q3-" name="q3-" type="radio" value="Phone">
  //                       <label class="govuk-label govuk-radios__label" for="q3-">Phone</label>
  //                     </div>
  //                     <div class="govuk-radios__item">
  //                       <input class="govuk-radios__input" id="q3--2" name="q3-" type="radio" value="Webchat with an HMRC adviser">
  //                       <label class="govuk-label govuk-radios__label" for="q3--2">Webchat with an HMRC adviser</label>
  //                     </div>
  //                     <div class="govuk-radios__item">
  //                       <input class="govuk-radios__input" id="q3--3" name="q3-" type="radio" value="Social media">
  //                       <label class="govuk-label govuk-radios__label" for="q3--3">Social media</label>
  //                     </div>
  //                     <div class="govuk-radios__item">
  //                       <input class="govuk-radios__input" id="q3--4" name="q3-" type="radio" value="I would not have used another contact method">
  //                       <label class="govuk-label govuk-radios__label" for="q3--4">I would not have used another contact method</label>
  //                     </div>
  //                     <div class="govuk-radios__item">
  //                       <input class="govuk-radios__input" id="q3--5" name="q3-" type="radio" value="Other" aria-controls="other-contact-details" aria-expanded="false">
  //                       <label class="govuk-label govuk-radios__label" for="q3--5">Other</label>
  //                     </div>
  //                     <div class="govuk-radios__conditional govuk-radios__conditional--hidden" id="other-contact-details">
  //                       <div class="govuk-form-group">
  //                         <label class="govuk-label" for="q4-">Provide other contact options</label>
  //                         <textarea class="govuk-textarea" id="q4-" name="q4-" rows="5"></textarea>
  //                       </div>
  //                     </div>
  //                   </div>
  //                 </fieldset>
  //                 <button id="submitPostChatSurvey" class="govuk-button">Submit</button> 
  //               </div>
  //             </form>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   `;
  //   document.body.innerHTML = surveyPage;

  //   const commonChatController = new CommonChatController();

  //   const sdk = {
  //     sendActivityMessage: jest.fn(),
  //     isChatInProgress: jest.fn()
  //   };

  //   window.Inq = {
  //     SDK: sdk
  //   };

  //   commonChatController.onPostChatSurveyDigitalAssistantSubmitted(surveyPage);

  //   //commonChatController.getPrintDate();

  //   //expect(getPrintDateSpy).toBeCalledTimes(1);

  //   // //test _sendPostChatSurveyDigitalAssistant being called
  //   // //test submitPostChatSurvey being called

  // });

  it("_moveToChatNullState should movr to a Null state", () => {
    const commonChatController = new CommonChatController();

    let _moveToChatNullStateSpy = jest.spyOn(commonChatController, '_moveToChatNullState');
    let _moveToStateSpy = jest.spyOn(commonChatController, '_moveToState');
    commonChatController._moveToChatNullState();

    expect(_moveToChatNullStateSpy).toBeCalledTimes(1);
    expect(_moveToStateSpy).toBeCalledTimes(1);
  });

  it("onSend cleans and sends customer imput text", () => {
    const commonChatController = new CommonChatController();
    const html = `
      <div id="ciapiSkinChatTranscript" class="ciapiSkinChatTranscript print-overflow-visible" tabindex="0" aria-label="chat transcript">
      <div id="skipToBottom"><a id="skipToBottomLink" href="#" class="govuk-skip-link">Skip to bottom of conversation</a></div>
      <p id="info" class="info govuk-!-display-none-print"><img role="img" src="/ask-hmrc/assets/media/intro-warn.svg" alt="Note">You are currently chatting with a computer.</p>
      <div class="timestamp-outer">
        <span class="print-only print-float-left govuk-!-font-weight-bold govuk-body">HMRC: </span>
        <div class="ciapi-agent-container">
          <div class="govuk-body ciapi-agent-message" tabindex="-1" id="liveMsgId77.67248247728101" aria-live="polite">
            <
            <div class="govuk-visually-hidden">
                <h3>Automated message : </h3>
            </div>
            Hello, I’m HMRC’s digital assistant.<br><br>
            Tell me in a few words what you’d like help with.<br><br>
            Do not give me any personal information.
          </div>
        </div>
        <p class="print-only govuk-body print-float-left">9:50 AM</p>
      </div>
      <div class="timestamp-outer">
        <span class="print-only print-float-right govuk-!-font-weight-bold govuk-body">You: </span>
        <div class="ciapi-customer-container" style="padding-bottom: 94px;">
          <div class="govuk-body ciapi-customer-message" id="liveMsgId81.62846145434919">
            <div class="govuk-visually-hidden">
                <h2>You said : </h2>
            </div>
            help
          </div>
        </div>
        <p class="print-only govuk-body print-float-right print-timestamp-right">1:26 PM</p>
      </div>
      <div class="timestamp-outer">
        <span class="print-only print-float-left govuk-!-font-weight-bold govuk-body">HMRC: </span>
        <div class="ciapi-agent-container" aria-live="polite">
          <div class="govuk-body ciapi-agent-message" tabindex="-1" id="liveAutomatedMsgId50.024492584533256">
            <div class="govuk-visually-hidden">
                <h3>Automated message : </h3>
            </div>
            <div id="automaton_vaLink_1652358383000">
                I can help you by answering questions related to HMRC, helping you find information on our website, and giving you more options to contact us.<br><br>
                Tell me in a few words what you'd like help with.
            </div>
          </div>
        </div>
        <p class="print-only govuk-body print-float-left">1:26 PM</p>
      </div>
      <div class="timestamp-outer">
        <span class="print-only print-float-right govuk-!-font-weight-bold govuk-body">You: </span>
        <div class="ciapi-customer-container" style="padding-bottom: 94px;">
          <div class="govuk-body ciapi-customer-message" id="liveMsgId35.87495140948258">
            <div class="govuk-visually-hidden">
                <h2>You said : </h2>
            </div>
            why can you not hepl me?
          </div>
        </div>
        <p class="print-only govuk-body print-float-right print-timestamp-right">1:45 PM</p>
      </div>
      <div class="timestamp-outer">
        <span class="print-only print-float-left govuk-!-font-weight-bold govuk-body">HMRC: </span>
        <div class="ciapi-agent-container" aria-live="polite">
          <div class="govuk-body ciapi-agent-message" tabindex="-1" id="liveAutomatedMsgId81.74800921715561">
            <div class="govuk-visually-hidden">
                <h3>Automated message : </h3>
            </div>
            <div id="automaton_vaLink_1652359519000">
              You might have been overpaid tax credits if:
              <ul>
                <li>
                    there was a change in your circumstances - even if you reported the change on time
                </li>
                <li>
                    you or the Tax Credit Office made a mistake
                </li>
                <li>
                    you did not renew your    const state = new ChatStates.NullState();
                    commonChatController.state = state; tax credits on time
                </li>
              </ul>
              When did your overpayment happen? 
              <ul>
                <li><a href="#" data-vtz-link-type="Dialog" data-vtz-jump="83eec1e2-0f20-436d-84cd-3a15df45f51b">The previous tax year</a></li>
                <li><a href="#" data-vtz-link-type="Dialog" data-vtz-jump="cbeffc2b-d5f8-4ba9-b42c-7b6b434148aa">This tax year</a></li>
              </ul>
            </div>
          </div>
        </div>
        <p class="print-only govuk-body print-float-left">1:45 PM</p>
      </div>
      <div id="skipToTop" class="skipToTopWithScroll govuk-!-padding-top-2"><a id="skipToTopLink" href="#" class="govuk-skip-link">Skip to top of conversation</a></div>
    </div>
    `;
    document.body.innerHTML = html;

    console.error = jest.fn();
    const container = {
      currentInputText: jest.fn().mockReturnValue(html),
      clearCurrentInputText: jest.fn()
    };
    commonChatController.container = container;

    const state = new ChatStates.NullState();
    commonChatController.state = state;

    let currentInputTextSpy = jest.spyOn(commonChatController.container, 'currentInputText');
    let clearCurrentInputTextSpy = jest.spyOn(commonChatController.container, 'clearCurrentInputText');
    commonChatController.onSend("Some text that will be ignored");

    expect(currentInputTextSpy).toBeCalledTimes(1);
    expect(clearCurrentInputTextSpy).toBeCalledTimes(1);
  });

  //TODO to fix
  //onPostChatSurveyWebchatSubmitted

  // it("_moveToChatEngagedState should call on confirmEndChat", () => {
  //   const commonChatController = new CommonChatController();
        
  //   const mockSdk = {
  //     //sendMessage: jest.fn(),
  //     getMessages: jest.fn()
  // };

  // const mockContainer = {
  //     transcript: {
  //         // addAgentMsg: jest.fn(),
  //         // addCustomerMsg: jest.fn(),
  //         // addAutomatonMsg: jest.fn(),
  //         // addSystemMsg: jest.fn(),
  //     },
  //     getTranscript: function () {
  //         return this.transcript;
  //     }
  // };

  //   window.Inq = {
  //     SDK: mockSdk
  //   };

  //   const mockState = new ChatStates.EngagedState(mockSdk, mockContainer, [], jest.fn());
    
  //   commonChatController.state = mockState;
  //   commonChatController.container = mockContainer;

  //   commonChatController._moveToChatEngagedState();
// });
});
