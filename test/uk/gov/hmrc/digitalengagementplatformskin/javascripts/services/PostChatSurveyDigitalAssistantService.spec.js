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

const survey = {
    id: 123456,
    questions: [
        { id: "q1", text: "Was the digital assistant useful?", freeform: false },
        { id: "q2", text: "How could we improve it?", freeform: false },
        { id: "q3", text: "If you had not used the chatbot today, how else would you have contacted us?", freeform: false },
        { id: "q4", text: "Provide other contact options", freeform: false }
    ],
    answers: [
        { id: "a1", text: "Yes", freeform: false },
        { id: "a2", text: "text area text", freeform: true },
        { id: "a3", text: "Other", freeform: false },
        { id: "a4", text: "text area text", freeform: true }
    ]
};

const surveyWithoutOption = {
    id: 123456,
    questions: [
        { id: "q1", text: "Was the digital assistant useful?", freeform: false },
        { id: "q2", text: "How could we improve it?", freeform: false },
        { id: "q3", text: "If you had not used the chatbot today, how else would you have contacted us?", freeform: false },
        { id: "q4", text: "Provide other contact options", freeform: false }
    ],
    answers: [
        { id: "a1", text: "Yes", freeform: false },
        { id: "a2", text: "text area text", freeform: true },
        { id: "a3", text: "Phone", freeform: false },
        { id: "a4", text: "", freeform: true }
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
                "Was%2520the%2520digital%2520assistant%2520useful%253F%2C" +
                "How%2520could%2520we%2520improve%2520it%253F%2C" +
                "If%2520you%2520had%2520not%2520used%2520the%2520chatbot%2520today%252C%2520how%2520else%2520would%2520you%2520have%2520contacted%2520us%253F%2C" +
                "Provide%2520other%2520contact%2520options",
            "custom.decisiontree.questionIDs": "q1%2Cq2%2Cq3%2Cq4",
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

    it("sends event for submitting a post chat survey with other option populated", () => {
        const sdk = {
            getChatParams: () => { return chatParams; },
            isConnected: () => { return true; },
            logEventToDW: jest.fn()
        };

        const service = new PostChatSurveyDigitalAssistantService(sdk);
        const timestamp = Date.now();

        const expectedCustomerRespondedEvent = {
            _domain: "automaton",
            evt: "customerResponded",
            unique_node_id: "node_1",
            "custom.decisiontree.nodeID": "HMRC_PostChat_Guidance%20-%20Initial",
            "custom.decisiontree.questionIDs": "q1%2Cq2%2Cq3%2Cq4",
            "custom.decisiontree.questions":
                "Was%2520the%2520digital%2520assistant%2520useful%253F%2C" +
                "How%2520could%2520we%2520improve%2520it%253F%2C" +
                "If%2520you%2520had%2520not%2520used%2520the%2520chatbot%2520today%252C%2520how%2520else%2520would%2520you%2520have%2520contacted%2520us%253F%2C" +
                "Provide%2520other%2520contact%2520options",
            "custom.decisiontree.answers": "Yes%2Ctext%2520area%2520text%2COther%2Ctext%2520area%2520text",
            "custom.decisiontree.answerIDs": "Yes%2Ctext%2520area%2520text%2COther%2Ctext%2520area%2520text",
            "custom.decisiontree.answerTypes": "0,1,0,1",
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

    it("sends event for submitting a post chat survey without other option populated", () => {   
        const sdk = {
                getChatParams: () => { return chatParams; },
                isConnected: () => { return true; },
                logEventToDW: jest.fn()
            };

            const service = new PostChatSurveyDigitalAssistantService(sdk);
            const timestamp = Date.now();

            const expectedCustomerRespondedEvent = {
                _domain: "automaton",
                evt: "customerResponded",
                unique_node_id: "node_1",
                "custom.decisiontree.nodeID": "HMRC_PostChat_Guidance%20-%20Initial",
                "custom.decisiontree.questionIDs": "q1%2Cq2%2Cq3%2Cq4",
                "custom.decisiontree.questions":
                    "Was%2520the%2520digital%2520assistant%2520useful%253F%2C" +
                    "How%2520could%2520we%2520improve%2520it%253F%2C" +
                    "If%2520you%2520had%2520not%2520used%2520the%2520chatbot%2520today%252C%2520how%2520else%2520would%2520you%2520have%2520contacted%2520us%253F%2C" +
                    "Provide%2520other%2520contact%2520options",
                "custom.decisiontree.answers": "Yes%2Ctext%2520area%2520text%2CPhone",
                "custom.decisiontree.answerIDs": "Yes%2Ctext%2520area%2520text%2CPhone",
                "custom.decisiontree.answerTypes": "0,1,0,1",
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
