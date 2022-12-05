import * as ChatStates from '../../../../../../../../app/assets/javascripts/services/ChatStates'
import * as MessageType from '../../../../../../../../app/assets/javascripts/NuanceMessageType'
import createEngagedStateDependencies from './SharedDependencies'

describe("Mix: Chat States", () => {
    describe("Mix: EngagedState", () => {
        it("Mix: plays sound on incoming agent message when user has sound turned on", () => {
            const [sdk, container] = createEngagedStateDependencies();
            const state = new ChatStates.EngagedState(sdk, container, [], jest.fn());

            let chatContainer = document.createElement("button");
            chatContainer.setAttribute("id", "toggleSound");
            chatContainer.setAttribute("class", "active");
            document.body.appendChild(chatContainer);

            const isSoundActive = jest.spyOn(state, '_isSoundActive');
            const playMessageRecievedSound = jest.spyOn(state, '_playMessageRecievedSound');
            const isMixAutomatonMessage = jest.spyOn(state, '_isMixAutomatonMessage');

            const handleMessage = sdk.getMessages.mock.calls[0][0];
            const message = {
                data: {
                    messageType: MessageType.Chat_Communication,
                    messageText: "Hello world",
                    agentID: "007",
                    isAgentMsg: true,
                    "external.app": true,
                    messageTimestamp: "test"
                }
            };

            handleMessage(message);

            expect(isSoundActive).toBeCalledTimes(1);
            expect(playMessageRecievedSound).toBeCalledTimes(1);
            expect(isMixAutomatonMessage).toBeCalledTimes(1);
        });
    });

	describe("Mix: Close Chat Event", () => {
		it("User is shown the end chat popup via automated event", () => {
			const [sdk, container] = createEngagedStateDependencies();
			const state = new ChatStates.EngagedState(sdk, container, [], jest.fn());

			const isCommunicationEventMessage = jest.spyOn(state, '_chatCommunicationMessage');
			const closeChat = jest.spyOn(state, 'closeChat');

			const handleMessage = sdk.getMessages.mock.calls[0][0];
			const message = {
				data: {
					"agentID": "42413094",
					"sessionId": "-2232268617980682976",
					"aeapi.mode": "true",
					"agent.alias": "HMRC",
					"messageData": "{\"command\":{\"event\":{\"CloseChat\":\"{\\n}\"}}}",
					"messageText": "Goodbye.",
					"messageType": "chat.communication",
					"engagementID": "388263431779822569",
					"external.app": "true",
					"external_user.ip": "52.142.149.60",
					"messageTimestamp": "1669902359000",
					"config.session_id": "-2232268617980682976",
					"msg.originalrequest.id": "-2232268601571209075",
					"senderName": "HMRC",
					"isAgentMsg": true,
					"chatFinalText": "Goodbye."
				}
			};

			handleMessage(message);

			expect(isCommunicationEventMessage).toBeCalledTimes(1);
			expect(closeChat).toBeCalledTimes(1);
		})
	});
});

