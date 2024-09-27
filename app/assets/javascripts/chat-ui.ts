import CommonChatController from './controllers/CommonChatController';
import ProactiveChatController from './controllers/ProactiveChatController';
import ReactiveChatController from './controllers/ReactiveChatController';
import { ClickToChatObjectInterface } from './types';
import * as logger from './utils/logger';

let event: { c2c?: any; };
export function safeHandler(f: any) {
    return function () {
        try {
            f.apply(null, arguments)
        } catch (e: unknown) {
            logger.error(`!!!! handler for ${f.name}: got exception `, e)
        }
    }
};

export const chatListener = {
    onAnyEvent: function (evt: { c2c?: any; chatID: string }) {
        if (evt.c2c) {
            event = evt
        }
        logger.debug("Chat any event:", evt);
        window.chatId = evt.chatID;
    },
    onAgentAssigned: function (evt: { agentID: any }) {
        logger.debug("### Agent Assigned");
        if (!!evt.agentID) {
            sessionStorage.agentId = evt.agentID;
        }
    },
    onC2CStateChanged: function (evt: undefined) {
        logger.info("C2C state changed...")
    }
};

export function hookWindow(w: any, commonChatController: CommonChatController, reactiveChatController: ReactiveChatController, proactiveChatController: ProactiveChatController) {

    w.InqRegistry = {
        listeners: [chatListener]
    };

    w.nuanceFrameworkLoaded = safeHandler(
        function nuanceFrameworkLoaded(): void {
            commonChatController.nuanceFrameworkLoaded(w);
        }
    );

    w.nuanceReactive_HMRC_CIAPI_Fixed_1 = safeHandler(
        function nuanceReactive_HMRC_CIAPI_Fixed_1(c2cObj: ClickToChatObjectInterface): void {
            reactiveChatController.addC2CButton(c2cObj, "HMRC_CIAPI_Fixed_1", "fixed");
        }
    );

    w.nuanceReactive_HMRC_CIAPI_Anchored_1 = safeHandler(
        function nuanceReactive_HMRC_CIAPI_Anchored_1(c2cObj: ClickToChatObjectInterface): void {
            c2cObj.c2c = event.c2c
            if (c2cObj.displayState == "ready") {
                if (document.getElementById("tc-nuance-chat-container")) {
                    reactiveChatController.addC2CButton(c2cObj, "tc-nuance-chat-container", "anchored");
                } else {
                    reactiveChatController.addC2CButton(c2cObj, "HMRC_CIAPI_Anchored_1", "anchored");
                }
            }
        }
    );

    w.nuanceProactive = safeHandler(
        function nuanceProactive(obj: { state: string }): void {
            logger.debug("### PROACTIVE", obj)
            proactiveChatController.launchProactiveChat(obj);
        }
    );
}
