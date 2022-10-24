import * as ChatStates from '../../../../../../app/assets/javascripts/services/ChatStates'
import * as MessageType from '../../../../../../app/assets/javascripts/NuanceMessageType'

function createEngagedStateDependencies() {
    const sdk = {
        sendMessage: jest.fn(),
        getMessages: jest.fn()
    };

    const container = {
        transcript: {
            addAgentMsg: jest.fn(),
            addCustomerMsg: jest.fn(),
            addAutomatonMsg: jest.fn(),
            addSystemMsg: jest.fn(),
        },
        getTranscript: function () {
            return this.transcript;
        }
    };
    return [sdk, container];
}

describe("Chat States", () => {
    describe("NullState", () => {
        it("logs error for onSend", () => {
            console.error = jest.fn();

            const state = new ChatStates.NullState();

            state.onSend("Some text that will be ignored");
            expect(console.error).toHaveBeenCalledWith("State Error: Trying to send text with no state.");
        });

        it("logs error for onClickedClose", () => {
            console.error = jest.fn();

            const state = new ChatStates.NullState();

            state.onClickedClose();
            expect(console.error).toHaveBeenCalledWith("State Error: Trying to close chat with no state.");
        });
    });

    describe("ShownState", () => {
        it("engages on user first message", () => {
            console.error = jest.fn();

            const onEngage = jest.fn();
            const onCloseChat = jest.fn();

            const state = new ChatStates.ShownState(onEngage, onCloseChat);

            state.onSend("Please help me.");
            expect(onEngage).toHaveBeenCalledWith("Please help me.");
        });

        it("closes the chat for onClickedClose", () => {
            console.error = jest.fn();

            const onEngage = jest.fn();
            const onCloseChat = jest.fn();

            const state = new ChatStates.ShownState(onEngage, onCloseChat);

            state.onClickedClose();
            expect(onCloseChat).toHaveBeenCalled();
        });
    });

    describe("EngagedState", () => {
        it("calls getMessages on creation", () => {
            const [sdk, container] = createEngagedStateDependencies();

            const state = new ChatStates.EngagedState(sdk, container, [], jest.fn());

            expect(sdk.getMessages).toHaveBeenCalledWith(expect.any(Function));
        });

        it("sends the message passed to onSend", () => {
            const [sdk, container] = createEngagedStateDependencies();

            const state = new ChatStates.EngagedState(sdk, container, [], jest.fn());

            state.onSend("Please help me.");
            expect(sdk.sendMessage).toHaveBeenCalledWith("Please help me.");
        });

        it("plays sound on incoming agent message when user has sound turned on", () => {
            const [sdk, container] = createEngagedStateDependencies();
            const state = new ChatStates.EngagedState(sdk, container, [], jest.fn());

            let chatContainer = document.createElement("button");
            chatContainer.setAttribute("id", "toggleSound");
            chatContainer.setAttribute("class", "active");
            document.body.appendChild(chatContainer);

            const isSoundActive = jest.spyOn(state, '_isSoundActive');
            const playMessageRecievedSound = jest.spyOn(state, '_playMessageRecievedSound');
            
            const handleMessage = sdk.getMessages.mock.calls[0][0];
            const message = {
                data: {
                    messageType: MessageType.Chat_Communication,
                    messageText: "Hello world",
                    agentID: "007",
                    messageTimestamp: "test"
                }
            };

            handleMessage(message);

            expect(isSoundActive).toBeCalledTimes(1);
            expect(playMessageRecievedSound).toBeCalledTimes(1);
        });

        it("sends agent messages to the transcript", () => {
            const [sdk, container] = createEngagedStateDependencies();
            
            const state = new ChatStates.EngagedState(sdk, container, [], jest.fn());

            const handleMessage = sdk.getMessages.mock.calls[0][0];
            const message = {
                data: {
                    messageType: MessageType.Chat_Communication,
                    messageText: "Hello world",
                    agentID: "007",
                    messageTimestamp: "test"
                }
            };

            handleMessage(message);
            expect(container.transcript.addAgentMsg).toHaveBeenCalledWith("Hello world", "test");
        });

        it("sends customer messages to the transcript", () => {
            const [sdk, container] = createEngagedStateDependencies();

            const state = new ChatStates.EngagedState(sdk, container, [], jest.fn());

            const handleMessage = sdk.getMessages.mock.calls[0][0];
            const message = {
                data: {
                    messageType: MessageType.Chat_Communication,
                    messageText: "Hello to you",
                    messageTimestamp: "test"
                }
            };

            handleMessage(message);
            expect(container.transcript.addCustomerMsg).toHaveBeenCalledWith("Hello to you", "test");
        });

        it("sends automaton messages to the transcript", () => {
            const [sdk, container] = createEngagedStateDependencies();

            const state = new ChatStates.EngagedState(sdk, container, [], jest.fn());

            const handleMessage = sdk.getMessages.mock.calls[0][0];
            const message = {
                data: {
                    messageType: MessageType.Chat_AutomationRequest,
                    messageTimestamp: "test",
                    "automaton.data": "Beep boop. I am a robot."
                }
            };

            handleMessage(message);
            expect(container.transcript.addAutomatonMsg).toHaveBeenCalledWith("Beep boop. I am a robot.", "test");
        })

        it("sends automaton messages with richmedia (embedded video) to the transcript", () => {
            const [sdk, container] = createEngagedStateDependencies();

            const state = new ChatStates.EngagedState(sdk, container, [], jest.fn());

            const handleMessage = sdk.getMessages.mock.calls[0][0];

            const message = {
                data: {
                    messageType: MessageType.Chat_AutomationRequest,
                    messageTimestamp: "1666355784000",
                    "automaton.data": "This is the text with the message of the embedded video.",
                    messageData: "{\"widgetType\":\"youtube-video\",\"customWidget\":true,\"videoId\":\"Jn46jDuKbn8\"}"
                }
            };

            handleMessage(message);
            expect(container.transcript.addAutomatonMsg).toHaveBeenCalledWith("This is the text with the message of the embedded video.", "1666355784000");
            expect(container.transcript.addAutomatonMsg).toHaveBeenCalledWith(`<iframe class="video-message" src="https://www.youtube.com/embed/Jn46jDuKbn8"</iframe>`, "1666355784000");
        })

        it("calls close chat popup when user clicks end chat and give feedback link", () => {
            const [sdk, container] = createEngagedStateDependencies();

            const onCloseChat = jest.fn();

            const state = new ChatStates.EngagedState(sdk, container, [], onCloseChat);

            const handleMessage = sdk.getMessages.mock.calls[0][0];
            const message = {
                data: {
                    messageType: MessageType.Chat_AutomationRequest,
                    vaDataPass: '{"endVAEngagement":"VA closed chat"}'
                }
            };

            handleMessage(message);
            expect(onCloseChat).toHaveBeenCalled();
        });

        it("sends customer messages to the transcript", () => {
            const [sdk, container] = createEngagedStateDependencies();

            const state = new ChatStates.EngagedState(sdk, container, [], jest.fn());

            const handleMessage = sdk.getMessages.mock.calls[0][0];
            const message = {
                data: {
                    messageType: MessageType.Chat_CommunicationQueue,
                    messageText: "Queue message"
                }
            };

            handleMessage(message);
            expect(container.transcript.addSystemMsg).toHaveBeenCalledWith({msg: "Queue message"});
        });

        it("reports Chat Denied to the transcript", () => {
            const [sdk, container] = createEngagedStateDependencies();

            const state = new ChatStates.EngagedState(sdk, container, [], jest.fn());

            const handleMessage = sdk.getMessages.mock.calls[0][0];
            const message = {
                data: {
                    messageType: MessageType.Chat_Denied,
                    thank_you_image_label: "chat denied message"

                }
            };

            handleMessage(message);
            expect(container.transcript.addSystemMsg).toHaveBeenCalledWith({msg: "chat denied message"});
        });

        it("reports Closed to the transcript", () => {
            const [sdk, container] = createEngagedStateDependencies();

            const state = new ChatStates.EngagedState(sdk, container, [], jest.fn());

            const handleMessage = sdk.getMessages.mock.calls[0][0];
            const message = {
                data: {
                    state: "closed"
                }
            };

            handleMessage(message);
            expect(container.transcript.addSystemMsg).toHaveBeenCalledWith({msg: "Agent Left Chat."});
        });

        it("send previous messages to the transcript", () => {
            const [sdk, container] = createEngagedStateDependencies();

            const messages = [{
                data: {
                    messageType: MessageType.Chat_AutomationRequest,
                    "automaton.data": "Beep boop. I am a robot.",
                    messageTimestamp: "test"
                }
            }, {
                data: {
                    messageType: MessageType.Chat_Communication,
                    messageText: "Hello to you",
                    messageTimestamp: "test"
                }
            }];

            const state = new ChatStates.EngagedState(sdk, container, messages, jest.fn());

            expect(container.transcript.addAutomatonMsg).toHaveBeenCalledWith("Beep boop. I am a robot.", "test");
            expect(container.transcript.addCustomerMsg).toHaveBeenCalledWith("Hello to you", "test");
        });

        it("sends TransferResponse to the transcript", () => {
            const [sdk, container] = createEngagedStateDependencies();

            const state = new ChatStates.EngagedState(sdk, container, [], jest.fn());

            const handleMessage = sdk.getMessages.mock.calls[0][0];
            const message = {
                data: {
                    "ltime": "1651712",
                    "state": "transfer",
                    "reason": "Transfer from Virtual Assistant [HMRC] to agent JoeBloggs",
                    "status": "accepted",
                    "messageType": "chat.transfer_response",
                    "engagementID": "388260662637696059",
                    "messageTimestamp": "1627648283000",
                    "client.display.text": "I'm connecting you to the next available webchat adviser.",
                    "msg.originalrequest.id": "385445912674772418"
                }
            };

            handleMessage(message);
            expect(container.transcript.addSystemMsg).toHaveBeenCalledWith({msg: "I'm connecting you to the next available webchat adviser."});
        });

        it("sends MemberConnected to the transcript", () => {
            const [sdk, container] = createEngagedStateDependencies();

            const state = new ChatStates.EngagedState(sdk, container, [], jest.fn());

            const handleMessage = sdk.getMessages.mock.calls[0][0];
            const message = {
                data: {
                    "owner": "true",
                    "tc.mode": "transfer",
                    "agent.alias": "Jay",
                    "messageType": "chatroom.member_connected",
                    "agentGroupID": "10006721",
                    "display.text": "Agent enters chat (as Jay)",
                    "engagementID": "388260662637696059",
                    "business_unit.id": "19001214",
                    "config.script_id": "12201319",
                    "messageTimestamp": "1627648283000",
                    "chatroom.member.id": "42391918",
                    "client.display.text": "You're now talking to Jay",
                    "chatroom.member.name": "JoeBloggs",
                    "chatroom.member.type": "agent"
                }
            };

            handleMessage(message);
            expect(container.transcript.addSystemMsg).toHaveBeenCalledWith({msg: "You're now talking to Jay"});
        });

        it("reports chat exit in transcript", () => {
            const [sdk, container] = createEngagedStateDependencies();

            const state = new ChatStates.EngagedState(sdk, container, [], jest.fn());

            const handleMessage = sdk.getMessages.mock.calls[0][0];
            const message = {
                data: {
                    "state": "closed",
                    "agentID": "42391918",
                    "sessionId": "2493130538282329498",
                    "user.type": "agent",
                    "aeapi.mode": "true",
                    "disp.notes": "",
                    "messageType": "chat.exit",
                    "display.text": "Agent 'Jay' exits chat",
                    "engagementID": "388260662810973280",
                    "disp.reason.0": "No answer given by customer or Not asked as chat terminated",
                    "disp.category.0": "Enquiry Handled - Customer Question",
                    "external_user.ip": "80.0.102.28",
                    "messageTimestamp": "1627651338000",
                    "config.session_id": "2493130538282329498",
                    "disposition.answer": "19005454:25243342",
                    "conversation_resolved": "false",
                    "msg.originalrequest.id": "2493130538484377173",
                    "auto_transfer_ignored_chatroom": "false"
                }
            };

            handleMessage(message);
            expect(container.transcript.addSystemMsg).toHaveBeenCalledWith({msg: "Agent 'Jay' exits chat"});
        });

        it("reports chat exit in transcript when from digital assistant", () => {
            const [sdk, container] = createEngagedStateDependencies();

            const state = new ChatStates.EngagedState(sdk, container, [], jest.fn());

            const handleMessage = sdk.getMessages.mock.calls[0][0];
            const message = {
                data: {
                    "state": "closed",
                    "messageType": "chat.exit",
                    "engagementID": "388260685642079244",
                    "messageTimestamp": "1628001005000"
                }
            };

            handleMessage(message);
            expect(container.transcript.addSystemMsg).toHaveBeenCalledWith({msg: "Adviser exited chat"});
        });

        it("reports agent has been lost", () => {
            const [sdk, container] = createEngagedStateDependencies();

            const state = new ChatStates.EngagedState(sdk, container, [], jest.fn());

            const handleMessage = sdk.getMessages.mock.calls[0][0];
            const message = {
                data: {
                    "ltime": "1656350",
                    "messageType": "chatroom.member_lost",
                    "display.text": "Agent 'JoeBloggs' loses connection",
                    "engagementID": "388260663047034009",
                    "messageTimestamp": "1627654612000",
                    "chatroom.member.id": "42391918",
                    "client.display.text": "Agent 'JoeBloggs' loses connection",
                    "chatroom.member.type": "agent"
                }
            };

            handleMessage(message);
            expect(container.transcript.addSystemMsg).toHaveBeenCalledWith({msg: "Agent 'JoeBloggs' loses connection"});
        });

        it("reports chat system messages", () => {
            const [sdk, container] = createEngagedStateDependencies();

            const state = new ChatStates.EngagedState(sdk, container, [], jest.fn());

            const handleMessage = sdk.getMessages.mock.calls[0][0];
            const message = {
                data: {
                    "messageType": "chat.system",
                    "engagementID": "388260663047034009",
                    "messageTimestamp": "1627654732000",
                    "client.display.text": "Sorry for the delay. An adviser should be with you soon."
                }
            };

            handleMessage(message);
            expect(container.transcript.addSystemMsg).toHaveBeenCalledWith({msg: "Sorry for the delay. An adviser should be with you soon."});
        });

        it("closes the chat when clicked", () => {
            const [sdk, container] = createEngagedStateDependencies();

            const onCloseChat = jest.fn();

            const state = new ChatStates.EngagedState(sdk, container, [], onCloseChat);

            state.onClickedClose();
            expect(onCloseChat).toHaveBeenCalled();
        });
    });
    describe("ClosingState", () => {
        it("logs error for onSend", () => {
            console.error = jest.fn();

            const state = new ChatStates.ClosingState(jest.fn());

            state.onSend("Some text that will be ignored");
            expect(console.error).toHaveBeenCalledWith("State Error: Trying to send text when closing.");
        });

        it("closes the window onClickedClose", () => {
            console.error = jest.fn();

            const onCloseChat = jest.fn();
            const state = new ChatStates.ClosingState(onCloseChat);

            state.onClickedClose();
            expect(onCloseChat).toHaveBeenCalled();
        });
    });
});
