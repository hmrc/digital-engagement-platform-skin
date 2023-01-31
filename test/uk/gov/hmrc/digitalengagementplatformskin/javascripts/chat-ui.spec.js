import { hookWindow, chatListener, safeHandler } from '../../../../../../app/assets/javascripts/chat-ui.js'
import CommonChatController from '../../../../../../app/assets/javascripts/controllers/CommonChatController'

// import ClickToChatButtons from  '../../../../../../app/assets/javascripts/utils/ClickToChatButtons'

jest.mock('../../../../../../app/assets/javascripts/utils/ClickToChatButtons');

// jest.mock('../../../../../../app/assets/javascripts/chat-ui.js', () => ({
//   ...(jest.requireActual('../../../../../../app/assets/javascripts/chat-ui.js')),
//   hookWindow: jest.fn(),
//   safeHandler: jest.fn()
// }))

let windowSpy;

beforeEach(() => {
  windowSpy = jest.spyOn(window, "window", "get");
});

afterEach(() => {
  windowSpy.mockRestore();
});


describe("chat-ui", () => {
  // it("hookWindow returns value", () => {
  //   hookWindow.mockReturnValue('foo')
  //   expect(hookWindow()).toBe('foo')
  // })

it("hookWindow", () => {

    window.Inq = {}; 
    window.Inq.SDK = jest.fn()
    window.Inq.SDK.getOpenerScripts = jest.fn()
    window.Inq.SDK.isChatInProgress = jest.fn()
    window.Inq.SDK.chatDisplayed = jest.fn()


    // let spy = jest.spyOn(hookWindow, 'w');

    hookWindow(window);

    window.nuanceFrameworkLoaded();
    window.nuanceReactive_HMRC_CIAPI_Fixed_1();
    window.nuanceReactive_HMRC_CIAPI_Anchored_1();
    window.nuanceProactive();


    expect(window.InqRegistry).toMatchObject( {
      "listeners" : [{"onAnyEvent": expect.anything(), "onC2CStateChanged": expect.anything()}]
    })

})

})
