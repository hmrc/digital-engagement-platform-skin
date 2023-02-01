import { hookWindow, chatListener, safeHandler } from '../../../../../../app/assets/javascripts/chat-ui.js'
import ReactiveChatController from '../../../../../../app/assets/javascripts/controllers/ReactiveChatController.js';

jest.mock('../../../../../../app/assets/javascripts/utils/ClickToChatButtons');

let windowSpy;

beforeEach(() => {
  windowSpy = jest.spyOn(window, "window", "get");
});

afterEach(() => {
  windowSpy.mockRestore();
});

describe("chat-ui", () => {

  it("hookWindow", () => {

      window.Inq = {}; 
      window.Inq.SDK = jest.fn()
      window.Inq.SDK.getOpenerScripts = jest.fn()
      window.Inq.SDK.isChatInProgress = jest.fn()
      window.Inq.SDK.chatDisplayed = jest.fn()

      console.log = jest.fn();
      const mockC2CObj = {};
      const commonChatControllerMock = {
        nuanceFrameworkLoaded: jest.fn()
      };
      const reactiveChatControllerMock = {
        addC2CButton: jest.fn()
      };
      const proactiveChatControllerMock = {
        launchProactiveChat: jest.fn()
      };
      
      const safeHandlerSpy = jest.fn(cb => cb);

      window.Inq.nuanceFrameworkLoaded = safeHandlerSpy(
        function nuanceFrameworkLoaded() {
          commonChatControllerMock.nuanceFrameworkLoaded(window.Inq);
        }
      );
      window.Inq.nuanceReactive_HMRC_CIAPI_Fixed_1 = safeHandlerSpy(
        function nuanceReactive_HMRC_CIAPI_Fixed_1() {
          reactiveChatControllerMock.addC2CButton({}, "HMRC_CIAPI_Fixed_1", "fixed");
        }
      );
      window.Inq.nuanceReactive_HMRC_CIAPI_Anchored_1 = safeHandlerSpy(
        function nuanceReactive_HMRC_CIAPI_Anchored_1() {
          reactiveChatControllerMock.addC2CButton({}, "HMRC_CIAPI_Anchored_1", "anchored");
        }
      );
      window.Inq.nuanceProactive = safeHandlerSpy(
        function nuanceProactive() {
          console.log();
          proactiveChatControllerMock.launchProactiveChat();
        }
      );

      window.Inq.nuanceFrameworkLoaded();
      window.Inq.nuanceReactive_HMRC_CIAPI_Fixed_1();
      window.Inq.nuanceReactive_HMRC_CIAPI_Anchored_1();
      window.Inq.nuanceProactive();
      hookWindow(window);

      const chatListener = window.InqRegistry.listeners[0];

      const evt = {
        preventDefault: jest.fn(),
        chatID: 1,
        agentID: "Terry"
      }

      chatListener.onAnyEvent(evt);
      chatListener.onC2CStateChanged(evt);

      expect(safeHandlerSpy).toHaveBeenCalled();
      expect(commonChatControllerMock.nuanceFrameworkLoaded).toHaveBeenCalledWith(window.Inq);
      expect(reactiveChatControllerMock.addC2CButton).toHaveBeenCalledWith(mockC2CObj, "HMRC_CIAPI_Fixed_1", "fixed");
      expect(reactiveChatControllerMock.addC2CButton).toHaveBeenCalledWith(mockC2CObj, "HMRC_CIAPI_Anchored_1", "anchored");
      expect(proactiveChatControllerMock.launchProactiveChat).toHaveBeenCalled();
      expect(window.InqRegistry).toMatchObject( {
        "listeners" : [{"onAnyEvent": expect.anything(), "onC2CStateChanged": expect.anything()}]
      })
  })

  it("safeHandler", () => {
    let explodeyFunction = () => { throw 'kaboom'; }
    let safeFn = safeHandler(explodeyFunction, 'hello');
    console.error = jest.fn();

    safeFn();
    expect(console.error).toHaveBeenCalledTimes(1);
  })

})
