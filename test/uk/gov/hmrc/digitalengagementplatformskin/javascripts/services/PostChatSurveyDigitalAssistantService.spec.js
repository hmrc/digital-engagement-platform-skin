import PostChatSurveyDigitalAssistantService from '../../../../../../../app/assets/javascripts/services/PostChatSurveyDigitalAssistantService'

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

const agentId = "nina"

const survey = {
    id: 123456,
    questions: [
        { id: "q1", text: "Were you able to do what you needed to do today?", freeform: false },
        { id: "q2", text: "How easy was it to do what you needed to do today?", freeform: false },
        { id: "q3", text: "Overall, how did you feel about the service you received today?", freeform: false },
        { id: "q4", text: "Why did you give these scores?", freeform: true },
        { id: "q5", text: "How would you prefer to get in touch with HMRC?", freeform: false },
        { id: "q6", text: "Provide other contact option?", freeform: true }
    ],
    answers: [
        { id: "a1", text: "Yes", freeform: false },
        { id: "a2", text: "OK", freeform: false },
        { id: "a3", text: "Good", freeform: false },
        { id: "a4", text: "text area text", freeform: true },
        { id: "a5", text: "other", freeform: false },
        { id: "a6", text: "by letter", freeform: true }
    ]
};

const surveyWithoutOption = {
    id: 123456,
    questions: [
        { id: "q1", text: "Were you able to do what you needed to do today?", freeform: false },
        { id: "q2", text: "How easy was it to do what you needed to do today?", freeform: false },
        { id: "q3", text: "Overall, how did you feel about the service you received today?", freeform: false },
        { id: "q4", text: "Why did you give these scores?", freeform: true },
        { id: "q5", text: "How would you prefer to get in touch with HMRC?", freeform: false },
        { id: "q6", text: "Provide other contact option?", freeform: true }
    ],
    answers: [
        { id: "a1", text: "Yes", freeform: false },
        { id: "a2", text: "OK", freeform: false },
        { id: "a3", text: "Good", freeform: false },
        { id: "a4", text: "text area text", freeform: true },
        { id: "a5", text: "other", freeform: false },
        { id: "a6", text: "", freeform: true }
    ]
};

const automaton = {
    id: "AutomatonID",
    name: "AutomatonName"
};

describe("PostChatSurveyDigitalAssistantService", () => {
    it("sends event for beginning a post chat survey", () => {
        const sdk = {
            getChatParams: () => { return chatParams; },
            isConnected: () => { return true; },
            logEventToDW: jest.fn()
        };

        const service = new PostChatSurveyDigitalAssistantService(sdk);

        const timestamp = Date.now();

        window.agentId = "nina";

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
            agentID: "nina",
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
                "Were%2520you%2520able%2520to%2520do%2520what%2520you%2520needed%2520to%2520do%2520today" + 
                "%253F%2CHow%2520easy%2520was%2520it%2520to%2520do%2520what%2520you%2520needed%2520to%2520" + 
                "do%2520today%253F%2COverall%252C%2520how%2520did%2520you%2520feel%2520about%2520the%2520service" +
                "%2520you%2520received%2520today%253F%2CWhy%2520did%2520you%2520give%2520these%2520scores%253F%2CHow" +
                "%2520would%2520you%2520prefer%2520to%2520get%2520in%2520touch%2520with%2520HMRC%253F%2CProvide%2520other%2520contact%2520option%253F",
            "custom.decisiontree.questionIDs": "q1%2Cq2%2Cq3%2Cq4%2Cq5%2Cq6",
            clientTimestamp: timestamp,
            automatonType: "satisfactionSurvey",
            chatID: "ChatID",
            customerID: "ThisCustomerID",
            agentID: "nina",
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

    it("sends event for submitting a post chat survey with other option populated", () => {
        const sdk = {
            getChatParams: () => { return chatParams; },
            isConnected: () => { return true; },
            logEventToDW: jest.fn()
        };

        window.agentId = "nina";

        const service = new PostChatSurveyDigitalAssistantService(sdk);
        const timestamp = Date.now();

        const expectedCustomerRespondedEvent = {
            _domain: "automaton",
            evt: "customerResponded",
            unique_node_id: "node_1",
            "custom.decisiontree.nodeID": "HMRC_PostChat_Guidance%20-%20Initial",
            "custom.decisiontree.questionIDs": "q1%2Cq2%2Cq3%2Cq4%2Cq5%2Cq6",
            "custom.decisiontree.questions":
                "Were%2520you%2520able%2520to%2520do%2520what%2520you%2520needed%2520to%2520do%2520today" + 
                "%253F%2CHow%2520easy%2520was%2520it%2520to%2520do%2520what%2520you%2520needed%2520to%2520" + 
                "do%2520today%253F%2COverall%252C%2520how%2520did%2520you%2520feel%2520about%2520the%2520service" +
                "%2520you%2520received%2520today%253F%2CWhy%2520did%2520you%2520give%2520these%2520scores%253F%2CHow" +
                "%2520would%2520you%2520prefer%2520to%2520get%2520in%2520touch%2520with%2520HMRC%253F%2CProvide%2520other%2520contact%2520option%253F",
            "custom.decisiontree.answers": "Yes%2COK%2CGood%2Ctext%2520area%2520text%2Cother%2Cby%2520letter",
            "custom.decisiontree.answerIDs": "Yes%2COK%2CGood%2Ctext%2520area%2520text%2Cother%2Cby%2520letter",
            "custom.decisiontree.answerTypes": "0,0,0,1,0,1",
            clientTimestamp: timestamp,
            automatonType: "satisfactionSurvey",
            automatonID: "AutomatonID",
            automatonName: "AutomatonName",
            automatonOrigin: "richMedia",
            chatID: "ChatID",
            customerID: "ThisCustomerID",
            agentID: "nina",
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
            agentID: "nina",
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

    it("sends event for submitting a post chat survey without other option populated", () => {
            const sdk = {
                getChatParams: () => { return chatParams; },
                isConnected: () => { return true; },
                logEventToDW: jest.fn()
            };

            window.agentId = "nina";

            const service = new PostChatSurveyDigitalAssistantService(sdk);
            const timestamp = Date.now();

            const expectedCustomerRespondedEvent = {
                _domain: "automaton",
                evt: "customerResponded",
                unique_node_id: "node_1",
                "custom.decisiontree.nodeID": "HMRC_PostChat_Guidance%20-%20Initial",
                "custom.decisiontree.questionIDs": "q1%2Cq2%2Cq3%2Cq4%2Cq5%2Cq6",
                "custom.decisiontree.questions":
                    "Were%2520you%2520able%2520to%2520do%2520what%2520you%2520needed%2520to%2520do%2520today" + 
                    "%253F%2CHow%2520easy%2520was%2520it%2520to%2520do%2520what%2520you%2520needed%2520to%2520" + 
                    "do%2520today%253F%2COverall%252C%2520how%2520did%2520you%2520feel%2520about%2520the%2520service" +
                    "%2520you%2520received%2520today%253F%2CWhy%2520did%2520you%2520give%2520these%2520scores%253F%2CHow" +
                    "%2520would%2520you%2520prefer%2520to%2520get%2520in%2520touch%2520with%2520HMRC%253F%2CProvide%2520other%2520contact%2520option%253F",
                "custom.decisiontree.answers": "Yes%2COK%2CGood%2Ctext%2520area%2520text%2Cother",
                "custom.decisiontree.answerIDs": "Yes%2COK%2CGood%2Ctext%2520area%2520text%2Cother",
                "custom.decisiontree.answerTypes": "0,0,0,1,0,1",
                clientTimestamp: timestamp,
                automatonType: "satisfactionSurvey",
                automatonID: "AutomatonID",
                automatonName: "AutomatonName",
                automatonOrigin: "richMedia",
                chatID: "ChatID",
                customerID: "ThisCustomerID",
                agentID: "nina",
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
                agentID: "nina",
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

            service.submitPostChatSurvey(surveyWithoutOption, automaton, timestamp);

            expect(sdk.logEventToDW).toHaveBeenCalledWith({
                eventList: [
                    expectedCustomerRespondedEvent,
                    expectedEndedEvent
                ]
            });
        });

    it("sends event for closing digital assistant and not submitting post chat survey", () => {
        const sdk = {
            getChatParams: () => { return chatParams; },
            isConnected: () => { return true; },
            logEventToDW: jest.fn()
        };

        const service = new PostChatSurveyDigitalAssistantService(sdk);
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
