import * as chatUi from './chat-ui'
import CommonChatController from './controllers/CommonChatController'
import ReactiveChatController from './controllers/ReactiveChatController'
import ProactiveChatController from './controllers/ProactiveChatController';

chatUi.hookWindow(
    window,
    new CommonChatController(),
    new ReactiveChatController(),
    new ProactiveChatController()
);
