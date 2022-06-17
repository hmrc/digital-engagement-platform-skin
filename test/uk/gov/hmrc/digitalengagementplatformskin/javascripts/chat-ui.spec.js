import { hookWindow } from '../../../../../../app/assets/javascripts/chat-ui.js'
import CommonChatController from '../../../../../../app/assets/javascripts/controllers/CommonChatController'

jest.mock('../../../../../../app/assets/javascripts/chat-ui.js', () => ({
  ...(jest.requireActual('../../../../../../app/assets/javascripts/chat-ui.js')),
  hookWindow: jest.fn(),
  safeHandler: jest.fn()
}))

describe("chat-ui", () => {
  it("hookWindow returns value", () => {
    hookWindow.mockReturnValue('foo')
    expect(hookWindow()).toBe('foo')
  })
})