import { hookWindow, chatListener, safeHandler } from '../../../../../../app/assets/javascripts/chat-ui.js'

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

      hookWindow(window);

      window.nuanceFrameworkLoaded();
      window.nuanceReactive_HMRC_CIAPI_Fixed_1();
      window.nuanceReactive_HMRC_CIAPI_Anchored_1();
      window.nuanceProactive();

      const chatListener = window.InqRegistry.listeners[0];

      const evt = {
        preventDefault: jest.fn(),
        chatID: 1,
        agentID: "Terry"
      }

      chatListener.onAnyEvent(evt);
      chatListener.onC2CStateChanged(evt);

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
