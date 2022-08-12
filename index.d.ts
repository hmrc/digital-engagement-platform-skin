export {};

declare global {
    interface Window {
        chatId: string;
        agentId: string;
        nuanceFrameworkLoaded: (x: object) => void;
        InqRegistry: any;
        nuanceReactive_HMRC_CIAPI_Fixed_1: (x: object) => void;
        nuanceReactive_HMRC_CIAPI_Anchored_1: (x: object) => void;
        nuanceProactive: (x: object) => void;
    }
}

