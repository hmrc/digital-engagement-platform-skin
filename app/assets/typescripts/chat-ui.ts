import ReactiveChatController from '../javascripts/controllers/ReactiveChatController';
import ProactiveChatController from '../javascripts/controllers/ProactiveChatController';
import CommonChatController from '../javascripts/controllers/CommonChatController';

interface ChatEvent extends Event {
    chatID: string;
    agentID: string;
}

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
    onAnyEvent: function (evt: ChatEvent) {
        console.log('Chat any event:', evt);
        window.chatId = evt.chatID;
        window.agentId = evt.agentID;
    },
    onC2CStateChanged: function (_: ChatEvent) {
        console.log('C2C state changed...');
    },
};

export function hookWindow(w: Window) {
    const commonChatController = new CommonChatController();
    const reactiveChatController = new ReactiveChatController();
    const proactiveChatController = new ProactiveChatController();

    w.InqRegistry = {
        listeners: [chatListener],
    };

    w.nuanceFrameworkLoaded = safeHandler(function nuanceFrameworkLoaded() {
        commonChatController.nuanceFrameworkLoaded(w);
    });

    w.nuanceReactive_HMRC_CIAPI_Fixed_1 = safeHandler(
        function nuanceReactive_HMRC_CIAPI_Fixed_1(c2cObj: object) {
            reactiveChatController.addC2CButton(
                c2cObj,
                'HMRC_CIAPI_Fixed_1',
                'fixed'
            );
        }
    );

    w.nuanceReactive_HMRC_CIAPI_Anchored_1 = safeHandler(
        function nuanceReactive_HMRC_CIAPI_Anchored_1(c2cObj: object) {
            reactiveChatController.addC2CButton(
                c2cObj,
                'HMRC_CIAPI_Anchored_1',
                'anchored'
            );
        }
    );

    w.nuanceProactive = safeHandler(function nuanceProactive(obj: object) {
        console.log('### PROACTIVE', obj);
        proactiveChatController.launchProactiveChat();
    });
}

