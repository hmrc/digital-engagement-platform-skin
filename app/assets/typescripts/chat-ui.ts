import ReactiveChatController from '../javascripts/controllers/ReactiveChatController';
import ProactiveChatController from '../javascripts/controllers/ProactiveChatController';
import CommonChatController from '../javascripts/controllers/CommonChatController';

import { AugmentedWindow } from './augmented-window';

function safeHandler(f) {
    return function () {
        try {
            f.apply(null, arguments);
        } catch (e) {
            console.error(`!!!! handler for ${f.name}: got exception `, e);
        }
    };
}

const chatListener = {
    onAnyEvent: function (evt) {
        console.log('Chat any event:', evt);
        window.chatId = evt.chatID;

        // this is being set on every event, and is sometimes undefined
        // is this expected?
        console.log('event agent id: ', evt.agentID);

        window.agentId = evt.agentID;
    },
    onC2CStateChanged: function (evt) {
        console.log('C2C state changed...');
    },
};

export function hookWindow(w) {
    var commonChatController = new CommonChatController();
    var reactiveChatController = new ReactiveChatController();
    var proactiveChatController = new ProactiveChatController();

    w.InqRegistry = {
        listeners: [chatListener],
    };

    w.nuanceFrameworkLoaded = safeHandler(function nuanceFrameworkLoaded() {
        commonChatController.nuanceFrameworkLoaded(w);
    });

    w.nuanceReactive_HMRC_CIAPI_Fixed_1 = safeHandler(
        function nuanceReactive_HMRC_CIAPI_Fixed_1(c2cObj) {
            reactiveChatController.addC2CButton(
                c2cObj,
                'HMRC_CIAPI_Fixed_1',
                'fixed'
            );
        }
    );

    w.nuanceReactive_HMRC_CIAPI_Anchored_1 = safeHandler(
        function nuanceReactive_HMRC_CIAPI_Anchored_1(c2cObj) {
            reactiveChatController.addC2CButton(
                c2cObj,
                'HMRC_CIAPI_Anchored_1',
                'anchored'
            );
        }
    );

    w.nuanceProactive = safeHandler(function nuanceProactive(obj) {
        console.log('### PROACTIVE', obj);
        proactiveChatController.launchProactiveChat();
    });
}

