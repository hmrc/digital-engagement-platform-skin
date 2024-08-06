import * as logger from '../utils/logger';
import { Survey, Answers, AutomatonType } from '../controllers/CommonChatController';
export default class PostChatSurveyDigitalAssistantService {
    sdk: any;
    constructor(sdk: any) {
        this.sdk = sdk;
    }

    beginPostChatSurvey(survey: any, automaton: AutomatonType, timestamp: number): void {
        // James - I have typed survey as any for the time being. However, it is almost certainly of type Survey which has an interface in the CommonChatController.ts and has been imported into this file. The same information is typed as Survey in the CommonChatController so this method should be receiving it. The issue is that we are getting errors below on lines 65 to 69 because encodeURIComponent cannot accept string[] and only string, number or boolean. A fix is putting [0] after id to say that it is the first element of the array. I am not sure why digitalAssistantSurvey has been set up like this id: ["question1"]. I am obviously reluctant to fiddle with the code for this reason. Do you have any thoughts? If we leave this as any it may be disjointed with CommonChatController.
        const chatParams: any = this.sdk.getChatParams();

        // James - for the below objects, we can create interfaces but I do not think it is necessarily sensibe. What do you think?
        const startedEvent: {} = {
            _domain: "automaton",
            evt: "started",
            automatonType: "satisfactionSurvey",
            automatonStartedBy: "survey,survey",
            startedIn: "chat",
            type: "satisfactionSurvey",
            clientTimestamp: timestamp,
            chatID: chatParams.chatID,
            customerID: chatParams.thisCustomerID,
            agentID: window.agentId,
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

        const contentSentToCustomerEvent: {} = {
            _domain: "automaton",
            evt: "contentSentToCustomer",
            unique_node_id: "node_1",
           "custom.decisiontree.nodeID": encodeURIComponent("HMRC_PostChat_Guidance - Initial"),
            "custom.decisiontree.questions": escape(encodeURIComponent(survey.questions[0].text)) + encodeURIComponent(",") +
                escape(encodeURIComponent(survey.questions[1].text)) + encodeURIComponent(",") +
                escape(encodeURIComponent(survey.questions[2].text)) + encodeURIComponent(",") +
                escape(encodeURIComponent(survey.questions[3].text)) + encodeURIComponent(",") +
                escape(encodeURIComponent(survey.questions[4].text)) + encodeURIComponent(",") +
                escape(encodeURIComponent(survey.questions[5].text)),
            "custom.decisiontree.questionIDs": escape(encodeURIComponent(survey.questions[0].id)) + encodeURIComponent(",") +
                escape(encodeURIComponent(survey.questions[1].id)) + encodeURIComponent(",") +
                escape(encodeURIComponent(survey.questions[2].id)) + encodeURIComponent(",") +
                escape(encodeURIComponent(survey.questions[3].id)) + encodeURIComponent(",") +
                escape(encodeURIComponent(survey.questions[4].id)) + encodeURIComponent(",") +
                escape(encodeURIComponent(survey.questions[5].id)),
            clientTimestamp: timestamp,
            automatonType: "satisfactionSurvey",
            chatID: chatParams.chatID,
            customerID: chatParams.thisCustomerID,
            agentID: window.agentId,
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
            preAssigned: this.sdk.isConnected() && !window.agentId,
            surveyId: Number(survey.id),
            automatonID: automaton.id,
            automatonName: automaton.name,
            automatonOrigin: "richMedia"
        };
        logger.info("== beginPostChatSurvey ==");

        try {
            this.sdk.logEventToDW({ eventList: [startedEvent, contentSentToCustomerEvent] });
        } catch (e: unknown) {
            logger.error("!!!! logEventToDW got exception: ", e);
        }
    }

    submitPostChatSurvey(survey: any, automaton: AutomatonType, timestamp: number): void {
        const chatParams = this.sdk.getChatParams();
// James - survey is almost certainly Answers & Survey as typed in CommonChatController when the method's name is searched. You will see this is the type we are passing through. However, we are getting the same error as above due to encodeURIComponent expecting a string | number | boolean and receiving string[]. How would you like me to proceed? As stated above we can add [0] but I do not fully understand everything that may happen with this code.
            const customerRespondedEvent: {} = {
                _domain: "automaton",
                evt: "customerResponded",
                automatonType: "satisfactionSurvey",
                siteID: Number(chatParams.siteID),
                customerID: chatParams.thisCustomerID,
                incAssignmentID: chatParams.sessionID,
                pageID: Number(chatParams.launchPageId),
                sessionID: chatParams.sessionID,
                chatID: chatParams.chatID,
                agentID: window.agentId,
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
                    escape(encodeURIComponent(survey.questions[3].id)) + encodeURIComponent(",") +
                    escape(encodeURIComponent(survey.questions[4].id)) + encodeURIComponent(",") +
                    escape(encodeURIComponent(survey.questions[5].id)),
                "custom.decisiontree.questions": escape(encodeURIComponent(survey.questions[0].text)) + encodeURIComponent(",") +
                    escape(encodeURIComponent(survey.questions[1].text)) + encodeURIComponent(",") +
                    escape(encodeURIComponent(survey.questions[2].text)) + encodeURIComponent(",") +
                    escape(encodeURIComponent(survey.questions[3].text)) + encodeURIComponent(",") +
                    escape(encodeURIComponent(survey.questions[4].text)) + encodeURIComponent(",") +
                    escape(encodeURIComponent(survey.questions[5].text)),
                "custom.decisiontree.answerIDs": (survey.answers[5].text.length > 0 ?
                    escape(encodeURIComponent(survey.answers[0].text)) + encodeURIComponent(",") +
                    escape(encodeURIComponent(survey.answers[1].text)) + encodeURIComponent(",") +
                    escape(encodeURIComponent(survey.answers[2].text)) + encodeURIComponent(",") +
                    escape(encodeURIComponent(survey.answers[3].text)) + encodeURIComponent(",") +
                    escape(encodeURIComponent(survey.answers[4].text)) + encodeURIComponent(",") +
                    escape(encodeURIComponent(survey.answers[5].text)) :
                    escape(encodeURIComponent(survey.answers[0].text)) + encodeURIComponent(",") +
                    escape(encodeURIComponent(survey.answers[1].text)) + encodeURIComponent(",") +
                    escape(encodeURIComponent(survey.answers[2].text)) + encodeURIComponent(",") +
                    escape(encodeURIComponent(survey.answers[3].text)) + encodeURIComponent(",") +
                    escape(encodeURIComponent(survey.answers[4].text))
                ),
                "custom.decisiontree.answers": (survey.answers[5].text.length > 0 ?
                    escape(encodeURIComponent(survey.answers[0].text)) + encodeURIComponent(",") +
                    escape(encodeURIComponent(survey.answers[1].text)) + encodeURIComponent(",") +
                    escape(encodeURIComponent(survey.answers[2].text)) + encodeURIComponent(",") +
                    escape(encodeURIComponent(survey.answers[3].text)) + encodeURIComponent(",") +
                    escape(encodeURIComponent(survey.answers[4].text)) + encodeURIComponent(",") +
                    escape(encodeURIComponent(survey.answers[5].text)) :
                    escape(encodeURIComponent(survey.answers[0].text)) + encodeURIComponent(",") +
                    escape(encodeURIComponent(survey.answers[1].text)) + encodeURIComponent(",") +
                    escape(encodeURIComponent(survey.answers[2].text)) + encodeURIComponent(",") +
                    escape(encodeURIComponent(survey.answers[3].text)) + encodeURIComponent(",") +
                    escape(encodeURIComponent(survey.answers[4].text))
                ),
                "custom.decisiontree.answerTypes": escape(encodeURIComponent("0")) + "," +
                    escape(encodeURIComponent("0")) + "," +
                    escape(encodeURIComponent("0")) + "," +
                    escape(encodeURIComponent("1")) + "," +
                    escape(encodeURIComponent("0")) + "," +
                    escape(encodeURIComponent("1")),
                clientTimestamp: timestamp,
                automatonOrigin: "richMedia"
            };

            const endedEvent: {} = {
                _domain: "automaton",
                evt: "ended",
                automatonType: "satisfactionSurvey",
                siteID: Number(chatParams.siteID),
                customerID: chatParams.thisCustomerID,
                incAssignmentID: chatParams.sessionID,
                pageID: Number(chatParams.launchPageId),
                sessionID: chatParams.sessionID,
                chatID: chatParams.chatID,
                agentID: window.agentId,
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
            logger.info("== submitPostChatSurvey ==");

            try {
                this.sdk.logEventToDW({ eventList: [customerRespondedEvent, endedEvent] });
            } catch (e: unknown) {
                logger.error("!!!! logEventToDW got exception: ", e);
            }
        }

    closePostChatSurvey(automaton: AutomatonType, timestamp: number): void {
        const chatParams: any = this.sdk.getChatParams();

        const endedEvent: {} = {
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
        logger.info("===== closePostChatSurvey =====");

        try {
            this.sdk.logEventToDW({ eventList: [endedEvent] });
        } catch (e: unknown) {
            logger.error("!!!! logEventToDW got exception: ", e);
        }
    }
}