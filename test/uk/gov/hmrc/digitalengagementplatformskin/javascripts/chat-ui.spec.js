import {hookWindow, chatListener, safeHandler} from '../../../../../../app/assets/javascripts/chat-ui'
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
      preventDefault: jest.fn(),
      chatID: 1,
      agentID: "Terry"
    }

    chatListenerFromWindow.onAnyEvent(evt);
    chatListenerFromWindow.onC2CStateChanged(evt);

    expect(onAnyEventSpy).toBeCalledTimes(1);
    expect(onC2CSpy).toBeCalledTimes(1);
    expect(window.agentId).toBe("Terry");
    expect(window.chatId).toBe(1);
  })

  it("should call the relevant controllers with expected arguments, given a call to hookWindow", () => {

      window.Inq = {
        SDK : {
          getOpenerScripts: jest.fn(),
          isChatInProgress: jest.fn(),
          chatDisplayed: jest.fn()
        }
      }; 

      console.log = jest.fn();

      let commonChatNuacneFrameworkLoaded = jest.spyOn(commonCC, 'nuanceFrameworkLoaded');
      let reactiveChatAddC2CButton = jest.spyOn(reactiveCC, 'addC2CButton');
      let proactiveChatLaunch = jest.spyOn(proactiveCC, 'launchProactiveChat');

      hookWindow(window, commonCC, reactiveCC, proactiveCC);

      window.nuanceFrameworkLoaded();
      window.nuanceReactive_HMRC_CIAPI_Fixed_1();
      window.nuanceReactive_HMRC_CIAPI_Anchored_1();
      window.nuanceProactive();

      expect(window.InqRegistry).toMatchObject( {
        "listeners" : [{"onAnyEvent": expect.anything(), "onC2CStateChanged": expect.anything()}]
      })

      expect(commonChatNuacneFrameworkLoaded).toBeCalledTimes(1);
      expect(reactiveChatAddC2CButton).toBeCalledTimes(2);

      expect(reactiveChatAddC2CButton).toBeCalledWith(undefined, "HMRC_CIAPI_Fixed_1", "fixed");
      expect(reactiveChatAddC2CButton).lastCalledWith(undefined, "HMRC_CIAPI_Anchored_1", "anchored");

      expect(proactiveChatLaunch).toBeCalled();
  });

  it("should call console.error, given a function that throws is passed to safeHandler", () => {
    let explodeyFunction = () => { throw 'kaboom'; }
    let safeFn = safeHandler(explodeyFunction, 'hello');
    console.error = jest.fn();

    safeFn();
    expect(console.error).toHaveBeenCalledTimes(1);
  });

});
