import CommonChatController from './controllers/CommonChatController';
import ProactiveChatController from './controllers/ProactiveChatController';
import ReactiveChatController from './controllers/ReactiveChatController';
import { messages } from '../javascripts/utils/Messages';
import { ClickToChatObjectInterface, StateType } from './types';
import * as logger from './utils/logger';

let event: { c2c?: any; rule?: {name: string}; evtType?: string };
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
    onAnyEvent: function (evt: { c2c?: any; chatID: string; rule?: {name: string}; evtType?: string }) {
        if (evt.c2c) {
            event = evt
        }
        logger.debug("Chat any event:", evt);
        if (evt.rule) {
            let systemMessageBanner: HTMLElement | null = document.getElementById('systemMessageBanner')
            if (systemMessageBanner && evt.rule["name"]) {
                if (evt.rule["name"].includes("-LC-")) {
                    if((evt.rule["name"] !== "HMRC-C-LC-CIAPI-GOVGCN-O-P-Embedded-T0")){ //
                        sessionStorage.setItem("isAutoEngage", "true")
                    }else {
                        sessionStorage.setItem("isAutoEngage", "false")                  //For the exception of trade tariff, no auto engage and hide the banner, ask if we want banner back after connecting
                        systemMessageBanner.style.display = 'none' 
                    }                                                                    //
                } else if (!systemMessageBanner.textContent?.includes("adviser")) {
                    sessionStorage.setItem("isAutoEngage", "false")
                    systemMessageBanner.textContent = messages.computer
                }
            }
        }

        if (evt.evtType === "CLOSED"){
            if (sessionStorage.getItem("ignoreChatClosedEvent") !== "true"){
                // close chat window
                sessionStorage.setItem("ignoreChatClosedEvent", "true")
                logger.info(">>>> some close chat window method")
                window.Inq.SDK.closeChat()
            }
        }

        window.chatId = evt.chatID;
    },
    onAgentAssigned: function (evt: { agentID: any, agentAlias: string }) {
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
                    logger.debug("### nuanceReactive_HMRC_CIAPI_Anchored_1 method called ...")
                    reactiveChatController.addC2CButton(c2cObj, "tc-nuance-chat-container", "anchored");
                } else {
                    reactiveChatController.addC2CButton(c2cObj, "HMRC_CIAPI_Anchored_1", "anchored");
                }
            }
        }
    );

    w.nuanceProactive = safeHandler(
        function nuanceProactive(obj: { state: StateType }): void {
            logger.debug("### PROACTIVE", obj)
            proactiveChatController.launchProactiveChat(obj);
        }
    );

    w.nuanceRestoreReactive = safeHandler(
        function nuanceRestoreReactive(): void {
            logger.debug("### nuanceRestoreReactive")
            logger.debug("### event before restore reactive ###", event)
            if(event.rule && (event.rule["name"] === "HMRC-VA-CIAPI-PersonalTaxAccount-R-DTS-Anchored-C2C") && event.evtType === "SHOWN" && window.location.href.includes("/personal-account")){ 
                logger.debug("### restore conditions met ###")
                // "HMRC-C-LC-CIAPI-TES-O-R-DTS-Anchored-C2C"
                window.Inq.SDK.closeChat();
            } else {
                commonChatController._launchChat({ type: 'reactive' })
            }
        }
    );
}
