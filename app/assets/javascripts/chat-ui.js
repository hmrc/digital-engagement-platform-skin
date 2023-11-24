import * as logger from './utils/logger';
 
export function safeHandler(f) {
    return function () {
        try {
            f.apply(null, arguments)
        } catch (e) {
            logger.error(`!!!! handler for ${f.name}: got exception `, e)
        }
    }
};

export const chatListener = {
    onAnyEvent: function(evt) {
        logger.debug("Chat any event:", evt);
        window.chatId = evt.chatID;
        window.agentId = evt.agentID;
    },
    onC2CStateChanged: function (evt) {
        logger.info("C2C state changed...")
    }
};

export function hookWindow(w, commonChatController, reactiveChatController, proactiveChatController) {

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
            if (document.getElementById("tc-nuance-chat-container")) {
                reactiveChatController.addC2CButton(c2cObj, "tc-nuance-chat-container", "anchored");
            } else {
                reactiveChatController.addC2CButton(c2cObj, "HMRC_CIAPI_Anchored_1", "anchored");
            }
        }
    );

    w.nuanceProactive = safeHandler(
        function nuanceProactive(obj) {
            logger.debug("### PROACTIVE", obj)
            proactiveChatController.launchProactiveChat(obj);
        }
    );
}
