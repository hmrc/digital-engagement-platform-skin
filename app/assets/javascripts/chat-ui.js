import ReactiveChatController from './controllers/ReactiveChatController'
import ProactiveChatController from './controllers/ProactiveChatController'
import CommonChatController from './controllers/CommonChatController'

function safeHandler(f, helpful_name) {
    return function () {
        try {
            f.apply(null, arguments)
        } catch (e) {
            console.error(`!!!! handler for ${f.name}: got exception `, e);
        }
    }
}

const chatListener = {
        onAnyEvent: function(evt) {
            console.log("Chat any event:", evt);
            window.chatId = evt.chatID;
            window.Agent_Name = "Neha kannaujia";
        },
    onC2CStateChanged: function (evt) {
        console.log("C2C state changed...")
        //        chatController.updateC2CButtonsToInProgress();
    }
};

export function hookWindow(w) {
    var commonChatController = new CommonChatController;
    var reactiveChatController = new ReactiveChatController;
    var proactiveChatController = new ProactiveChatController;

    w.InqRegistry = {
        listeners: [chatListener]
    };

    w.nuanceFrameworkLoaded = safeHandler(
        function nuanceFrameworkLoaded() {
            commonChatController.nuanceFrameworkLoaded(w);
        }
    );

    w.nuanceReactive_HMRC_CIAPI_Fixed_1 = safeHandler(
        function nuanceReactive_HMRC_CIAPI_Fixed_1(c2cObj) {
            reactiveChatController.addC2CButton(c2cObj, "HMRC_CIAPI_Fixed_1", "fixed");
        }
    );

    w.nuanceReactive_HMRC_CIAPI_Anchored_1 = safeHandler(
        function nuanceReactive_HMRC_CIAPI_Anchored_1(c2cObj) {
            reactiveChatController.addC2CButton(c2cObj, "HMRC_CIAPI_Anchored_1", "anchored");
        }
    );

    w.nuanceProactive = safeHandler(
        function nuanceProactive(obj) {
            console.log("### PROACTIVE", obj);
            proactiveChatController.launchProactiveChat();
        }
    );
}
