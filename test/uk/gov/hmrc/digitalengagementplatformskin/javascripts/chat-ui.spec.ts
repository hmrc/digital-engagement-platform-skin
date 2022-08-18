import { hookWindow } from '../../../../../../app/assets/typescripts/chat-ui.ts';
import CommonChatController from '../../../../../../app/assets/javascripts/controllers/CommonChatController';

jest.mock('../../../../../../app/assets/typescripts/chat-ui.ts', () => ({
    ...jest.requireActual(
        '../../../../../../app/assets/typescripts/chat-ui.ts'
    ),
    hookWindow: jest.fn(),
    safeHandler: jest.fn(),
}));

describe('chat-ui', () => {
    it('hookWindow returns value', () => {
        hookWindow.mockReturnValue('foo');
        expect(hookWindow()).toBe('foo');
    });
});


