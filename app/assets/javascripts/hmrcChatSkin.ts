import * as chatUi from './chat-ui'
import CommonChatController from './controllers/CommonChatController'
import ReactiveChatController from './controllers/ReactiveChatController'
import ProactiveChatController from './controllers/ProactiveChatController';
import * as niceChatUi from './Nice-chat-ui'
import NiceCommonChatController from './controllers/NiceCommonChatController'
import NiceReactiveChatController from './controllers/NiceReactiveChatController'
import NiceProactiveChatController from './controllers/NiceProactiveChatController';
import  initializeSDK from './controllers/NavSDKInit'


if(window.useNuanceSDK ==="true") {
    chatUi.hookWindow(
        window,
        new CommonChatController,
        new ReactiveChatController,
        new ProactiveChatController
    );
}else {

    await initializeSDK();

    niceChatUi.hookWindow(
        window,
        new NiceCommonChatController,
        new NiceReactiveChatController,
        new NiceProactiveChatController
    );
}



