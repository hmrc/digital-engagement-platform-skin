export default class PostChatSurveyDigitalAssistantService {
    constructor(sdk) {
        this.sdk = sdk;
    }

    beginPostChatSurvey(survey, automaton, timestamp) {
        const chatParams = this.sdk.getChatParams();

        const startedEvent = {
            _domain: "automaton",
            evt: "started",
            automatonType: "satisfactionSurvey",
            automatonStartedBy: "survey,survey",
            startedIn: "chat",
            type: "satisfactionSurvey",
            clientTimestamp: timestamp,
            chatID: chatParams.chatID,
            customerID: chatParams.thisCustomerID,
            agentID: chatParams.agentID,
            custID: chatParams.thisCustomerID,
            incAssignmentID: chatParams.sessionID,
            sessionID: chatParams.sessionID,
            visitorAttributes: chatParams.getVisitorAttributes(),
            automatonAttributes: "",
            siteID: Number(chatParams.siteID),
            clientID: Number(chatParams.siteID),
            pageID: Number(chatParams.launchPageId),
            businessUnitID: chatParams.businessUnitID,
            businessRuleID: Number(chatParams.brID),
            busUnitID: chatParams.businessUnitID,
            BRName: chatParams.chatTitle,
            agentGroupID: chatParams.agId,
            availableAgentAttributes: chatParams.agentAttributes,
            brAttributes: chatParams.ruleAttributes,
            countryCode: chatParams.countryCode,
            regionCode: chatParams.regionCode,
            deviceType: chatParams.deviceType,
            operatingSystemType: chatParams.operatingSystemType,
            browserType: chatParams.browserType,
            browserVersion: chatParams.browserVersion,
            preAssigned: this.sdk.isConnected() && !chatParams.agentID,
            surveyId: Number(survey.id),
            automatonID: automaton.id,
            automatonName: automaton.name,
            automatonOrigin: "richMedia"
        };

        const contentSentToCustomerEvent = {
            _domain: "automaton",
            evt: "contentSentToCustomer",
            unique_node_id: "node_1",
            "custom.decisiontree.nodeID": encodeURIComponent("HMRC_PostChat_Guidance - Initial"),
            "custom.decisiontree.questions": escape(encodeURIComponent(survey.questions[0].text)) + encodeURIComponent(",") +
                escape(encodeURIComponent(survey.questions[1].text)) + encodeURIComponent(",") +
                escape(encodeURIComponent(survey.questions[2].text)) + encodeURIComponent(",") +
                escape(encodeURIComponent(survey.questions[3].text)),
            "custom.decisiontree.questionIDs": escape(encodeURIComponent(survey.questions[0].id)) + encodeURIComponent(",") +
                escape(encodeURIComponent(survey.questions[1].id)) + encodeURIComponent(",") +
                escape(encodeURIComponent(survey.questions[2].id)) + encodeURIComponent(",") +
                escape(encodeURIComponent(survey.questions[3].id)),
            clientTimestamp: timestamp,
            automatonType: "satisfactionSurvey",
            chatID: chatParams.chatID,
            customerID: chatParams.thisCustomerID,
            agentID: chatParams.agentID,
            custID: chatParams.thisCustomerID,
            incAssignmentID: chatParams.sessionID,
            sessionID: chatParams.sessionID,
            visitorAttributes: chatParams.getVisitorAttributes(),
            automatonAttributes: "",
            siteID: Number(chatParams.siteID),
            clientID: Number(chatParams.siteID),
            pageID: Number(chatParams.launchPageId),
            businessUnitID: chatParams.businessUnitID,
            businessRuleID: Number(chatParams.brID),
            busUnitID: chatParams.businessUnitID,
            BRName: chatParams.chatTitle,
            agentGroupID: chatParams.agId,
            availableAgentAttributes: chatParams.agentAttributes,
            brAttributes: chatParams.ruleAttributes,
            countryCode: chatParams.countryCode,
            regionCode: chatParams.regionCode,
            deviceType: chatParams.deviceType,
            operatingSystemType: chatParams.operatingSystemType,
            browserType: chatParams.browserType,
            browserVersion: chatParams.browserVersion,
            preAssigned: this.sdk.isConnected() && !chatParams.agentID,
            surveyId: Number(survey.id),
            automatonID: automaton.id,
            automatonName: automaton.name,
            automatonOrigin: "richMedia"
        }
        console.log("== beginPostChatSurvey ==");

        try {
            this.sdk.logEventToDW({ eventList: [startedEvent, contentSentToCustomerEvent] });
        } catch (e) {
            console.error("!!!! logEventToDW got exception: ", e);
        }
    }

    submitPostChatSurvey(survey, automaton, timestamp) {
        const chatParams = this.sdk.getChatParams();

        const customerRespondedEvent = {
            _domain: "automaton",
            evt: "customerResponded",
            automatonType: "satisfactionSurvey",
            siteID: Number(chatParams.siteID),
            customerID: chatParams.thisCustomerID,
            incAssignmentID: chatParams.sessionID,
            pageID: Number(chatParams.launchPageId),
            sessionID: chatParams.sessionID,
            chatID: chatParams.chatID,
            agentID: chatParams.agentID,
            automatonName: automaton.name,
            custID: chatParams.thisCustomerID,
            preAssigned: this.sdk.isConnected() && !chatParams.agentID,
            automatonID: automaton.id,
            unique_node_id: "node_1",
            "custom.decisiontree.nodeID": encodeURIComponent("HMRC_PostChat_Guidance - Initial"),
            automatonAttributes: "",
            visitorAttributes: chatParams.getVisitorAttributes(),
            clientID: Number(chatParams.siteID),
            businessUnitID: chatParams.businessUnitID,
            businessRuleID: Number(chatParams.brID),
            busUnitID: chatParams.businessUnitID,
            BRName: chatParams.chatTitle,
            agentGroupID: chatParams.agId,
            availableAgentAttributes: chatParams.agentAttributes,
            brAttributes: chatParams.ruleAttributes,
            countryCode: chatParams.countryCode,
            regionCode: chatParams.regionCode,
            deviceType: chatParams.deviceType,
            operatingSystemType: chatParams.operatingSystemType,
            browserType: chatParams.browserType,
            browserVersion: chatParams.browserVersion,
            surveyId: Number(survey.id),
            "custom.decisiontree.questionIDs": escape(encodeURIComponent(survey.questions[0].id)) + encodeURIComponent(",") +
                escape(encodeURIComponent(survey.questions[1].id)) + encodeURIComponent(",") +
                escape(encodeURIComponent(survey.questions[2].id)) + encodeURIComponent(",") +
                escape(encodeURIComponent(survey.questions[3].id)),
            "custom.decisiontree.questions": escape(encodeURIComponent(survey.questions[0].text)) + encodeURIComponent(",") +
                escape(encodeURIComponent(survey.questions[1].text)) + encodeURIComponent(",") +
                escape(encodeURIComponent(survey.questions[2].text)) + encodeURIComponent(",") +
                escape(encodeURIComponent(survey.questions[3].text)),
            "custom.decisiontree.answerIDs": (survey.answers[3].text.length > 0 ?
                escape(encodeURIComponent(survey.answers[0].text)) + encodeURIComponent(",") +
                escape(encodeURIComponent(survey.answers[1].text)) + encodeURIComponent(",") +
                escape(encodeURIComponent(survey.answers[2].text)) + encodeURIComponent(",") +
                escape(encodeURIComponent(survey.answers[3].text)) :
                escape(encodeURIComponent(survey.answers[0].text)) + encodeURIComponent(",") +
                escape(encodeURIComponent(survey.answers[1].text)) + encodeURIComponent(",") +
                escape(encodeURIComponent(survey.answers[2].text))
            ),
            "custom.decisiontree.answers": (survey.answers[3].text.length > 0 ?
                escape(encodeURIComponent(survey.answers[0].text)) + encodeURIComponent(",") +
                escape(encodeURIComponent(survey.answers[1].text)) + encodeURIComponent(",") +
                escape(encodeURIComponent(survey.answers[2].text)) + encodeURIComponent(",") +
                escape(encodeURIComponent(survey.answers[3].text)) :
                escape(encodeURIComponent(survey.answers[0].text)) + encodeURIComponent(",") +
                escape(encodeURIComponent(survey.answers[1].text)) + encodeURIComponent(",") +
                escape(encodeURIComponent(survey.answers[2].text))
            ),
            "custom.decisiontree.answerTypes": escape(encodeURIComponent("0")) + "," +
                escape(encodeURIComponent("1")) + "," +
                escape(encodeURIComponent("0")) + "," +
                escape(encodeURIComponent("1")),
            clientTimestamp: timestamp,
            automatonOrigin: "richMedia"
        };

        const endedEvent = {
            _domain: "automaton",
            evt: "ended",
            automatonType: "satisfactionSurvey",
            siteID: Number(chatParams.siteID),
            customerID: chatParams.thisCustomerID,
            incAssignmentID: chatParams.sessionID,
            pageID: Number(chatParams.launchPageId),
            sessionID: chatParams.sessionID,
            chatID: chatParams.chatID,
            agentID: chatParams.agentID,
            automatonName: automaton.name,
            preAssigned: this.sdk.isConnected() && !chatParams.agentID,
            automatonID: automaton.id,
            custID: chatParams.thisCustomerID,
            visitorAttributes: chatParams.getVisitorAttributes(),
            automatonAttributes: "",
            clientID: Number(chatParams.siteID),
            businessUnitID: chatParams.businessUnitID,
            businessRuleID: Number(chatParams.brID),
            busUnitID: chatParams.businessUnitID,
            BRName: chatParams.chatTitle,
            agentGroupID: chatParams.agId,
            availableAgentAttributes: chatParams.agentAttributes,
            brAttributes: chatParams.ruleAttributes,
            countryCode: chatParams.countryCode,
            regionCode: chatParams.regionCode,
            deviceType: chatParams.deviceType,
            operatingSystemType: chatParams.operatingSystemType,
            browserType: chatParams.browserType,
            browserVersion: chatParams.browserVersion,
            surveyId: Number(survey.id),
            "automaton.outcomeType": "Completed",
            "automaton.outcome": "User has submitted postchat feedback.",
            clientTimestamp: timestamp,
            automatonOrigin: "richMedia"
        };
        console.log("== submitPostChatSurvey ==");

        try {
            this.sdk.logEventToDW({ eventList: [customerRespondedEvent, endedEvent] });
        } catch (e) {
            console.error("!!!! logEventToDW got exception: ", e);
        }
    }

    closePostChatSurvey(automaton, timestamp) {
        const chatParams = this.sdk.getChatParams();

        const endedEvent = {
            _domain: "automaton",
            evt: "ended",
            automatonType: "satisfactionSurvey",
            siteID: Number(chatParams.siteID),
            customerID: chatParams.thisCustomerID,
            incAssignmentID: chatParams.sessionID,
            pageID: Number(chatParams.launchPageId),
            sessionID: chatParams.sessionID,
            chatID: chatParams.chatID,
            preAssigned: this.sdk.isConnected() && !chatParams.agentID,
            automatonID: automaton.id,
            "automaton.outcomeType": "Refused",
            clientTimestamp: timestamp,
            automatonOrigin: "richMedia"
        };
        console.log("===== closePostChatSurvey =====");

        try {
            this.sdk.logEventToDW({ eventList: [endedEvent] });
        } catch (e) {
            console.error("!!!! logEventToDW got exception: ", e);
        }
    }
}
