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
});
