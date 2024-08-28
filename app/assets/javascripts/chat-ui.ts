import CommonChatController from './controllers/CommonChatController';
import ProactiveChatController from './controllers/ProactiveChatController';
import ReactiveChatController from './controllers/ReactiveChatController';
import * as logger from './utils/logger';

let event: { c2c: any; };

export function safeHandler(f: (c2cObj: any) => void) {
    return function (): void {
        try {
            // @ts-ignore
            f.apply(null, arguments)
        } catch (e) {
            logger.error(`!!!! handler for ${f.name}: got exception `, e)
        }
    }
};

// @ts-ignore
export const chatListener = {
    onAnyEvent: function (evt: { c2c: any; chatID: number }) {
        if (evt.c2c) {
            event = evt
        }
        logger.debug("Chat any event:", evt);
        window.chatId = evt.chatID;
    },
    onAgentAssigned: function (evt: { agentID: any; }) {
        logger.debug("### Agent Assigned");
        if (!!evt.agentID) {
            sessionStorage.agentId = evt.agentID;
        }
    },
    // @ts-ignore
    onC2CStateChanged: function (evt: any) {
        logger.info("C2C state changed...")
    }
};

export function hookWindow(w: any, commonChatController: CommonChatController, reactiveChatController: ReactiveChatController, proactiveChatController: ProactiveChatController) {

    w.InqRegistry = {
        listeners: [chatListener]
    };

    w.nuanceFrameworkLoaded = safeHandler(function nuanceFrameworkLoaded() {
        commonChatController.nuanceFrameworkLoaded(w);
    });

    w.nuanceReactive_HMRC_CIAPI_Fixed_1 = safeHandler(
        function nuanceReactive_HMRC_CIAPI_Fixed_1(c2cObj: any) : void {
            reactiveChatController.addC2CButton(c2cObj, "HMRC_CIAPI_Fixed_1", "fixed");
        }
    );

    w.nuanceReactive_HMRC_CIAPI_Anchored_1 = safeHandler(function nuanceReactive_HMRC_CIAPI_Anchored_1(c2cObj: any): void {
        c2cObj.c2c = event.c2c
        if (document.getElementById("tc-nuance-chat-container")) {
            reactiveChatController.addC2CButton(c2cObj, "tc-nuance-chat-container", "anchored");
        } else {
            reactiveChatController.addC2CButton(c2cObj, "HMRC_CIAPI_Anchored_1", "anchored");
        }
    });

    w.nuanceProactive = safeHandler(function nuanceProactive(obj: any): void {
        logger.debug("### PROACTIVE", obj)
        proactiveChatController.launchProactiveChat(obj);
    });
}
