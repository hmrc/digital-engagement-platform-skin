import PostChatSurveyWebchatService from '../../../../../../../app/assets/javascripts/services/PostChatSurveyWebchatService'

const chatParams = {
    agId: "AgId",
    agentID: "AgentId",
    agentAttributes: "AgentAttributes",
    browserType: "BrowserType",
    browserVersion: "BrowserVersion",
    brID: 123456,
    businessUnitID: "BusinessUnitID",
    chatTitle: "ChatTitle",
    countryCode: "CountryCode",
    deviceType: "DeviceType",
    chatID: "ChatID",
    getVisitorAttributes: () => { return "VisitorAttributes"; },
    launchPageId: 123458,
    operatingSystemType: "OperatingSystemType",
    regionCode: "RegionCode",
    ruleAttributes: "RuleAttributes",
    sessionID: "SessionID",
    siteID: 123459,
    thisCustomerID: "ThisCustomerID",
};

const survey = {
    id: 123456,
    questions: [
        { id: "q1", text: "Were you able to do what you needed to do today?", freeform: false },
        { id: "q2", text: "How easy was it to do what you needed to do today?", freeform: false },
        { id: "q3", text: "Overall, how did you feel about the service you accessed today?", freeform: false },
        { id: "q4", text: "Why did you give these scores?", freeform: true },
        { id: "q5", text: "If you had not used webchat today, how else would you have contacted us?", freeform: false }
    ],
    answers: [
        { id: "a1", text: "Yes", freeform: false },
        { id: "a2", text: "OK", freeform: false },
        { id: "a3", text: "Good", freeform: false },
        { id: "a4", text: "text area text", freeform: true },
        { id: "a5", text: "Phone", freeform: false }
    ]
};

const automaton = {
    id: "AutomatonID",
    name: "AutomatonName"
};

describe("PostChatSurveyWebchatService", () => {
    it("sends event for beginning a post chat survey", () => {
        const sdk = {
            getChatParams: () => { return chatParams; },
            isConnected: () => { return true; },
            logEventToDW: jest.fn()
        };

        const service = new PostChatSurveyWebchatService(sdk);

        const timestamp = Date.now();

        const expectedStartedEvent = {
            _domain: "automaton",
            evt: "started",
            automatonType: "satisfactionSurvey",
            automatonStartedBy: "survey,survey",
            startedIn: "chat",
            type: "satisfactionSurvey",
            clientTimestamp: timestamp,
            chatID: "ChatID",
            customerID: "ThisCustomerID",
            agentID: "AgentId",
            custID: "ThisCustomerID",
            incAssignmentID: "SessionID",
            sessionID: "SessionID",
            visitorAttributes: "VisitorAttributes",
            automatonAttributes: "",
            siteID: 123459,
            clientID: 123459,
            pageID: 123458,
            businessUnitID: "BusinessUnitID",
            businessRuleID: 123456,
            busUnitID: "BusinessUnitID",
            BRName: "ChatTitle",
            agentGroupID: "AgId",
            availableAgentAttributes: "AgentAttributes",
            brAttributes: "RuleAttributes",
            countryCode: "CountryCode",
            regionCode: "RegionCode",
            deviceType: "DeviceType",
            operatingSystemType: "OperatingSystemType",
            browserType: "BrowserType",
            browserVersion: "BrowserVersion",
            preAssigned: false,
            surveyId: 123456,
            automatonID: "AutomatonID",
            automatonName: "AutomatonName",
            automatonOrigin: "richMedia"
        };

        const expectedContentSentToCustomerEvent = {
            _domain: "automaton",
            evt: "contentSentToCustomer",
            unique_node_id: "node_1",
            "custom.decisiontree.nodeID": "HMRC_PostChat_Guidance%20-%20Initial",
            "custom.decisiontree.questions":
                "Were%2520you%2520able%2520to%2520do%2520what%2520you%2520needed%2520to%2520do%2520today%253F%2C" +
                "How%2520easy%2520was%2520it%2520to%2520do%2520what%2520you%2520needed%2520to%2520do%2520today%253F%2C" +
                "Overall%252C%2520how%2520did%2520you%2520feel%2520about%2520the%2520service%2520you%2520accessed%2520today%253F%2C" +
                "Why%2520did%2520you%2520give%2520these%2520scores%253F%2C" +
                "If%2520you%2520had%2520not%2520used%2520webchat%2520today%252C%2520how%2520else%2520would%2520you%2520have%2520contacted%2520us%253F" ,
            "custom.decisiontree.questionIDs": "q1%2Cq2%2Cq3%2Cq4%2Cq5",
            clientTimestamp: timestamp,
            automatonType: "satisfactionSurvey",
            chatID: "ChatID",
            customerID: "ThisCustomerID",
            agentID: "AgentId",
            custID: "ThisCustomerID",
            incAssignmentID: "SessionID",
            sessionID: "SessionID",
            visitorAttributes: "VisitorAttributes",
            automatonAttributes: "",
            siteID: 123459,
            clientID: 123459,
            pageID: 123458,
            businessUnitID: "BusinessUnitID",
            businessRuleID: 123456,
            busUnitID: "BusinessUnitID",
            BRName: "ChatTitle",
            agentGroupID: "AgId",
            availableAgentAttributes: "AgentAttributes",
            brAttributes: "RuleAttributes",
            countryCode: "CountryCode",
            regionCode: "RegionCode",
            deviceType: "DeviceType",
            operatingSystemType: "OperatingSystemType",
            browserType: "BrowserType",
            browserVersion: "BrowserVersion",
            preAssigned: false,
            surveyId: 123456,
            automatonID: "AutomatonID",
            automatonName: "AutomatonName",
            automatonOrigin: "richMedia"
        };


        service.beginPostChatSurvey(survey, automaton, timestamp);

        expect(sdk.logEventToDW).toHaveBeenCalledWith({
            eventList: [
                expectedStartedEvent,
                expectedContentSentToCustomerEvent
            ]
        });
    });

    it("sends event for submitting a post chat survey", () => {
        const sdk = {
            getChatParams: () => { return chatParams; },
            isConnected: () => { return true; },
            logEventToDW: jest.fn()
        };

        const service = new PostChatSurveyWebchatService(sdk);
        const timestamp = Date.now();

        const expectedCustomerRespondedEvent = {
            _domain: "automaton",
            evt: "customerResponded",
            unique_node_id: "node_1",
            "custom.decisiontree.nodeID": "HMRC_PostChat_Guidance%20-%20Initial",
            "custom.decisiontree.questionIDs": "q1%2Cq2%2Cq3%2Cq4%2Cq5",
            "custom.decisiontree.questions":
                "Were%2520you%2520able%2520to%2520do%2520what%2520you%2520needed%2520to%2520do%2520today%253F%2C" +
                "How%2520easy%2520was%2520it%2520to%2520do%2520what%2520you%2520needed%2520to%2520do%2520today%253F%2C" +
                "Overall%252C%2520how%2520did%2520you%2520feel%2520about%2520the%2520service%2520you%2520accessed%2520today%253F%2C" +
                "Why%2520did%2520you%2520give%2520these%2520scores%253F%2C" +
                "If%2520you%2520had%2520not%2520used%2520webchat%2520today%252C%2520how%2520else%2520would%2520you%2520have%2520contacted%2520us%253F" ,
            "custom.decisiontree.answers": "Yes%2COK%2CGood%2Ctext%2520area%2520text%2CPhone",
            "custom.decisiontree.answerIDs": "Yes%2COK%2CGood%2Ctext%2520area%2520text%2CPhone",
            "custom.decisiontree.answerTypes": "0,0,0,1,0",
            clientTimestamp: timestamp,
            automatonType: "satisfactionSurvey",
            automatonID: "AutomatonID",
            automatonName: "AutomatonName",
            automatonOrigin: "richMedia",
            chatID: "ChatID",
            customerID: "ThisCustomerID",
            agentID: "AgentId",
            custID: "ThisCustomerID",
            incAssignmentID: "SessionID",
            sessionID: "SessionID",
            visitorAttributes: "VisitorAttributes",
            automatonAttributes: "",
            siteID: 123459,
            clientID: 123459,
            pageID: 123458,
            businessUnitID: "BusinessUnitID",
            businessRuleID: 123456,
            busUnitID: "BusinessUnitID",
            BRName: "ChatTitle",
            agentGroupID: "AgId",
            availableAgentAttributes: "AgentAttributes",
            brAttributes: "RuleAttributes",
            countryCode: "CountryCode",
            regionCode: "RegionCode",
            deviceType: "DeviceType",
            operatingSystemType: "OperatingSystemType",
            browserType: "BrowserType",
            browserVersion: "BrowserVersion",
            preAssigned: false,
            surveyId: 123456
        };

        const expectedEndedEvent = {
            _domain: "automaton",
            evt: "ended",
            automatonType: "satisfactionSurvey",
            "automaton.outcomeType": "Completed",
            clientTimestamp: timestamp,
            "automaton.outcome": "User has submitted postchat feedback.",
            automatonID: "AutomatonID",
            automatonName: "AutomatonName",
            automatonOrigin: "richMedia",
            chatID: "ChatID",
            customerID: "ThisCustomerID",
            agentID: "AgentId",
            custID: "ThisCustomerID",
            incAssignmentID: "SessionID",
            sessionID: "SessionID",
            visitorAttributes: "VisitorAttributes",
            automatonAttributes: "",
            siteID: 123459,
            clientID: 123459,
            pageID: 123458,
            businessUnitID: "BusinessUnitID",
            businessRuleID: 123456,
            busUnitID: "BusinessUnitID",
            BRName: "ChatTitle",
            agentGroupID: "AgId",
            availableAgentAttributes: "AgentAttributes",
            brAttributes: "RuleAttributes",
            countryCode: "CountryCode",
            regionCode: "RegionCode",
            deviceType: "DeviceType",
            operatingSystemType: "OperatingSystemType",
            browserType: "BrowserType",
            browserVersion: "BrowserVersion",
            preAssigned: false,
            surveyId: 123456
        };

        service.submitPostChatSurvey(survey, automaton, timestamp);

        expect(sdk.logEventToDW).toHaveBeenCalledWith({
            eventList: [
                expectedCustomerRespondedEvent,
                expectedEndedEvent
            ]
        });
    });

    it("sends event for closing webchat and not submitting post chat survey", () => {
        const sdk = {
            getChatParams: () => { return chatParams; },
            isConnected: () => { return true; },
            logEventToDW: jest.fn()
        };

        const service = new PostChatSurveyWebchatService(sdk);
        const timestamp = Date.now();

        const expectedEndedEvent = {
            _domain: "automaton",
            evt: "ended",
            automatonType: "satisfactionSurvey",
            siteID: 123459,
            customerID: "ThisCustomerID",
            incAssignmentID: "SessionID",
            pageID: 123458,
            sessionID: "SessionID",
            chatID: "ChatID",
            preAssigned: false,
            automatonID: "AutomatonID",
            "automaton.outcomeType": "Refused",
            clientTimestamp: timestamp,
            automatonOrigin: "richMedia"
        };

        service.closePostChatSurvey(automaton, timestamp);

        expect(sdk.logEventToDW).toHaveBeenCalledWith({
            eventList: [
                expectedEndedEvent
            ]
        });

    });
});