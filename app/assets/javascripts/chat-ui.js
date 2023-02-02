
export function safeHandler(f) {
    return function () {
        try {
            f.apply(null, arguments)
        } catch (e) {
            console.error(`!!!! handler for ${f.name}: got exception `, e);
        }
    }
};

export const chatListener = {
    onAnyEvent: function(evt) {
        console.log("Chat any event:", evt);
        window.chatId = evt.chatID;
        window.agentId = evt.agentID;
    },
    onC2CStateChanged: function (evt) {
        console.log("C2C state changed...")
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



