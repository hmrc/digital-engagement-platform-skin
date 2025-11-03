import { hookWindow, chatListener, safeHandler } from '../../../../../../app/assets/javascripts/chat-ui'
import ProactiveChatController from '../../../../../../app/assets/javascripts/controllers/ProactiveChatController';
import ReactiveChatController from '../../../../../../app/assets/javascripts/controllers/ReactiveChatController';
import CommonChatController from '../../../../../../app/assets/javascripts/controllers/CommonChatController';

jest.mock('../../../../../../app/assets/javascripts/utils/ClickToChatButtons');

let windowSpy;
let commonCC, reactiveCC, proactiveCC;

beforeEach(() => {
  windowSpy = jest.spyOn(window, "window", "get");

  commonCC = new CommonChatController();
  reactiveCC = new ReactiveChatController();
  proactiveCC = new ProactiveChatController();
});

afterEach(() => {
  windowSpy.mockRestore();
});

describe("chat-ui", () => {

  it("should call the expected chatListener functions, given a call to the hookWindow function", () => {
    const onAnyEventSpy = jest.spyOn(chatListener, 'onAnyEvent');
    const onC2CSpy = jest.spyOn(chatListener, 'onC2CStateChanged');

    hookWindow(window, commonCC, reactiveCC, proactiveCC);
    const chatListenerFromWindow = window.InqRegistry.listeners[0];

    const evt = {
      chatID: 1
    }

    chatListenerFromWindow.onAnyEvent(evt);
    chatListenerFromWindow.onC2CStateChanged(evt);

    expect(onAnyEventSpy).toBeCalledTimes(1);
    expect(onC2CSpy).toBeCalledTimes(1);
    expect(window.chatId).toBe(1);
  })

  it("should call the relevant controllers with expected arguments, given a call to hookWindow and displayState set to ready", () => {
    window.Inq = {
      SDK: {
        getOpenerScripts: jest.fn(),
        isChatInProgress: jest.fn(),
        chatDisplayed: jest.fn()
      }
    };

    let commonChatNuanceFrameworkLoaded = jest.spyOn(commonCC, 'nuanceFrameworkLoaded');
    let reactiveChatAddC2CButton = jest.spyOn(reactiveCC, 'addC2CButton');
    let proactiveChatLaunch = jest.spyOn(proactiveCC, 'launchProactiveChat');

    hookWindow(window, commonCC, reactiveCC, proactiveCC);
    const chatListenerFromWindow = window.InqRegistry.listeners[0];

    const evt = {
      c2c: { displayState: "ready" }
    }

    chatListenerFromWindow.onAnyEvent(evt);
    chatListenerFromWindow.onC2CStateChanged(evt);

    window.nuanceFrameworkLoaded();
    window.nuanceReactive_HMRC_CIAPI_Fixed_1({});
    window.nuanceReactive_HMRC_CIAPI_Anchored_1(evt.c2c);
    window.nuanceProactive();

    expect(window.InqRegistry).toMatchObject({
      "listeners": [{ "onAnyEvent": expect.any(Function), "onC2CStateChanged": expect.any(Function) }]
    })

    expect(commonChatNuanceFrameworkLoaded).toBeCalledTimes(1);
    expect(reactiveChatAddC2CButton).toBeCalledTimes(2);

    expect(reactiveChatAddC2CButton).toBeCalledWith({}, "HMRC_CIAPI_Fixed_1", "fixed");
    expect(reactiveChatAddC2CButton).lastCalledWith(evt.c2c, "HMRC_CIAPI_Anchored_1", "anchored");

    expect(proactiveChatLaunch).toBeCalled();
  });

  it("should call the relevant controllers with expected arguments, given a call to hookWindow and displayState set to busy", () => {
    window.Inq = {
      SDK: {
        getOpenerScripts: jest.fn(),
        isChatInProgress: jest.fn(),
        chatDisplayed: jest.fn()
      }
    };

    let commonChatNuanceFrameworkLoaded = jest.spyOn(commonCC, 'nuanceFrameworkLoaded');
    let reactiveChatAddC2CButton = jest.spyOn(reactiveCC, 'addC2CButton');
    let proactiveChatLaunch = jest.spyOn(proactiveCC, 'launchProactiveChat');

    hookWindow(window, commonCC, reactiveCC, proactiveCC);
    const chatListenerFromWindow = window.InqRegistry.listeners[0];

    const evt = {
      c2c: { displayState: "busy" }
    }

    chatListenerFromWindow.onAnyEvent(evt);
    chatListenerFromWindow.onC2CStateChanged(evt);

    window.nuanceFrameworkLoaded();
    window.nuanceReactive_HMRC_CIAPI_Fixed_1({});
    window.nuanceReactive_HMRC_CIAPI_Anchored_1(evt.c2c);
    window.nuanceProactive();

    expect(window.InqRegistry).toMatchObject({
      "listeners": [{ "onAnyEvent": expect.any(Function), "onC2CStateChanged": expect.any(Function) }]
    })

    expect(commonChatNuanceFrameworkLoaded).toBeCalledTimes(1);
    expect(reactiveChatAddC2CButton).toBeCalledTimes(1);

    expect(reactiveChatAddC2CButton).toBeCalledWith({}, "HMRC_CIAPI_Fixed_1", "fixed");

    expect(proactiveChatLaunch).toBeCalled();
  });

  it("should call sdk closeChat and close the chat window if a CLOSED event is received", () => {
    const sdk = {
      closeChat: jest.fn()
  };
    window.Inq = {
      SDK: sdk
    };
    sessionStorage.ignoreChatClosedEvent = "false"
    let chatWindowParent = document.createElement("div")
    chatWindowParent.setAttribute("id", "tc-nuance-chat-container")
    let chatWindow = document.createElement("div")
    chatWindow.setAttribute("id", "ciapiSkin")
    chatWindowParent.appendChild(chatWindow)
    document.body.appendChild(chatWindowParent)
    let spy = jest.spyOn(chatWindow.parentElement, 'removeChild').mockImplementation();


    hookWindow(window, commonCC, reactiveCC, proactiveCC);
    const chatListenerFromWindow = window.InqRegistry.listeners[0];

    const evt = {
      evtType: "CLOSED"
    }
    chatListenerFromWindow.onAnyEvent(evt);
    expect(window.InqRegistry).toMatchObject({
      "listeners": [{ "onAnyEvent": expect.any(Function), "onC2CStateChanged": expect.any(Function) }]
    })
    expect(sdk.closeChat).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(chatWindow);

  })

  it("should call console.error, given a function that throws is passed to safeHandler", () => {
    let explodeyFunction = () => { throw 'kaboom'; }
    let safeFn = safeHandler(explodeyFunction);
    console.error = jest.fn();

    safeFn();
    expect(console.error).toHaveBeenCalledTimes(1);
  });

});
