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

export type StateType = 'show' | 'missed' | 'disabled'

// ClickToChatButtons:
export interface ClickToChatObjectInterface {
    c2cIdx: any,
    displayState: displayState,
    isAsyncEngagement?: boolean
    launchable: boolean
    c2c?: any
    roleID?: number
}



export interface PCSBase {
    _domain: "automaton",
    automatonType: "satisfactionSurvey",
    clientTimestamp: number
    chatID: string
    customerID: string
    agentID: string
    custID: string
    incAssignmentID: string
    sessionID: string
    visitorAttributes: string
    automatonAttributes: ""
    siteID: number
    clientID: number
    pageID: number
    businessUnitID: string
    businessRuleID: number
    busUnitID: string
    BRName: string
    agentGroupID: string
    availableAgentAttributes: string
    brAttributes: string
    countryCode: string
    regionCode: string
    deviceType: string
    operatingSystemType: string
    browserType: string
    browserVersion: string
    preAssigned: boolean
    surveyId: number
    automatonID: string
    automatonName: string
    automatonOrigin: "richMedia"
}

export interface StartedEvent extends PCSBase {
    evt: "started"
    automatonStartedBy: "survey,survey"
    startedIn: "chat"
    type: "satisfactionSurvey"
}

export interface ContentSentToCustomerEvent extends PCSBase {
    evt: "contentSentToCustomer"
    unique_node_id: "node_1"
    "custom.decisiontree.nodeID": string
    "custom.decisiontree.questions": string
    "custom.decisiontree.questionIDs": string
}

export interface CustomerRespondedEvent extends PCSBase {
    evt: "customerResponded"
    unique_node_id: "node_1"
    "custom.decisiontree.nodeID": string
    "custom.decisiontree.questionIDs": string
    "custom.decisiontree.questions": string
    "custom.decisiontree.answerIDs": string
    "custom.decisiontree.answers": string
    "custom.decisiontree.answerTypes": string
}

export interface EndedEvent extends PCSBase {
    evt: "ended"
    "automaton.outcomeType": string
    "automaton.outcome": string
}