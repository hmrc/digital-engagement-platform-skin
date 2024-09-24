import { displayState } from "./utils/ClickToChatButtons";

export interface QuickReplyData { nodes: { controls: { id: string; type: string; text: string[]; values: string[]; event: { name: string } }[], id: string }[]; transitions: { name: string, from: string, trigger: string }[], widgetType: string }

export type AutomatonType = { id: string, name: string }

export interface Survey {
    id: string;
    questions: {
        id: string[];
        text: string;
        freeform: boolean;
    }[];
}

export interface Answers {
    answers: {
        id: string | undefined;
        text: string;
        freeform: boolean;
    }[];
}

// ClickToChatButtons:
export interface ClickToChatObjectInterface {
    c2cIdx: any,
    displayState: displayState,
    isAsyncEngagement?: boolean
    launchable: boolean
    c2c?: any
    roleID?: number
}