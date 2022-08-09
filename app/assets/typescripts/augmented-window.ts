export interface AugmentedWindow extends Window {
    chatId: string;
    agentId: string;
    nuanceFrameworkLoaded: () => void;
    InqRegistry: any;
    nuanceReactive_HMRC_CIAPI_Fixed_1: () => any;
    nuanceReactive_HMRC_CIAPI_Anchored_1: () => any;
    nuanceProactive: () => any;
}

