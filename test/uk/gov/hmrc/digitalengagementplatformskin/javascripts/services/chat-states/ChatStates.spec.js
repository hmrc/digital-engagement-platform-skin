import * as ChatStates from '../../../../../../../../app/assets/javascripts/services/ChatStates'
import * as MessageType from '../../../../../../../../app/assets/javascripts/NuanceMessageType'
import createEngagedStateDependencies from './SharedDependencies'

describe("Chat States", () => {

  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

    describe("NullState", () => {
        it("logs error for onSend", () => {
            console.error = jest.fn();

            const state = new ChatStates.NullState();

            state.onSend("Some text that will be ignored");
            expect(console.error).toHaveBeenCalledWith("ERROR: State Error: Trying to send text with no state.");
        });

        it("logs error for onClickedClose", () => {
            console.error = jest.fn();

            const state = new ChatStates.NullState();

            state.onClickedClose();
            expect(console.error).toHaveBeenCalledWith("ERROR: State Error: Trying to close chat with no state.");
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

    describe("ClosingState", () => {
        it("logs error for onSend", () => {
            console.error = jest.fn();

            const state = new ChatStates.ClosingState(jest.fn());

            state.onSend("Some text that will be ignored");
            expect(console.error).toHaveBeenCalledWith("ERROR: State Error: Trying to send text when closing.");
        });

        it("closes the window onClickedClose", () => {
            console.error = jest.fn();

            const onCloseChat = jest.fn();
            const state = new ChatStates.ClosingState(onCloseChat);

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
                    isAgentMsg: true,
                    messageTimestamp: "test"
                }
            };

            handleMessage(message);

            expect(isSoundActive).toBeCalledTimes(1);
            expect(playMessageRecievedSound).toBeCalledTimes(1);
        });

        it("does not play sound on incoming agent message when user has sound turned off", () => {
            const [sdk, container] = createEngagedStateDependencies();
            const state = new ChatStates.EngagedState(sdk, container, [], jest.fn());

            let chatContainer = document.createElement("button");
            chatContainer.setAttribute("id", "toggleSound");
            chatContainer.setAttribute("class", "inactive");
            document.body.appendChild(chatContainer);

            const isSoundActive = jest.spyOn(state, '_isSoundActive');
            const playMessageRecievedSound = jest.spyOn(state, '_playMessageRecievedSound');

            const handleMessage = sdk.getMessages.mock.calls[0][0];
            const message = {
                data: {
                    messageType: MessageType.Chat_Communication,
                    messageText: "Hello world",
                    agentID: "007",
                    isAgentMsg: true,
                    messageTimestamp: "test"
                }
            };

            handleMessage(message);

            expect(isSoundActive).toBeCalledTimes(1);
            expect(playMessageRecievedSound).toBeCalledTimes(0);
        });

        it("does not play sound on incoming agent message if there is no sound element", () => {
            const [sdk, container] = createEngagedStateDependencies();
            const state = new ChatStates.EngagedState(sdk, container, [], jest.fn());

            const isSoundActive = jest.spyOn(state, '_isSoundActive');
            const playMessageRecievedSound = jest.spyOn(state, '_playMessageRecievedSound');

            const handleMessage = sdk.getMessages.mock.calls[0][0];
            const message = {
                data: {
                    messageType: MessageType.Chat_Communication,
                    messageText: "Hello world",
                    agentID: "007",
                    isAgentMsg: true,
                    messageTimestamp: "test"
                }
            };

            handleMessage(message);

            expect(isSoundActive).toBeCalledTimes(1);
            expect(playMessageRecievedSound).toBeCalledTimes(0);
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
                    isAgentMsg: true,
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

        it("calls close chat popup when user clicks end chat and give feedback link", () => {
            const [sdk, container] = createEngagedStateDependencies();

            const onCloseChat = jest.fn();

            const state = new ChatStates.EngagedState(sdk, container, [], onCloseChat);

            const handleMessage = sdk.getMessages.mock.calls[0][0];
            const message = {
                data: {
                    messageType: MessageType.Chat_Communication,
                    "messageData": "{\"command\":{\"event\":{\"CloseChat\":\"{\\n}\"}}}",
                }
            };

            handleMessage(message);
            expect(onCloseChat).toHaveBeenCalled();
        });

        it("sends system messages to the transcript chat.communication.queue", () => {
            const [sdk, container] = createEngagedStateDependencies();

            const state = new ChatStates.EngagedState(sdk, container, [], jest.fn());

            const handleMessage = sdk.getMessages.mock.calls[0][0];
            const message = {
                data: {
                    messageType: MessageType.Chat_CommunicationQueue,
                    messageText: "Queue message",
                    messageTimestamp: "test"
                }
            };

            handleMessage(message);
            expect(container.transcript.addSystemMsg).toHaveBeenCalledWith({msg: "Queue message"}, "test");
        });

        it("sends system messages to the transcript chat.need_wait", () => {
            const [sdk, container] = createEngagedStateDependencies();

            const state = new ChatStates.EngagedState(sdk, container, [], jest.fn());

            const handleMessage = sdk.getMessages.mock.calls[0][0];
            const message = {
                data: {
                    messageType: MessageType.Chat_NeedWait,
                    messageText: "Need to wait message",
                    messageTimestamp: "test"
                }
            };

            handleMessage(message);
            expect(container.transcript.addSystemMsg).toHaveBeenCalledWith({msg: "Need to wait message"}, "test");
        });

        it("reports Chat Denied to the transcript", () => {
            const [sdk, container] = createEngagedStateDependencies();

            const state = new ChatStates.EngagedState(sdk, container, [], jest.fn());

            const handleMessage = sdk.getMessages.mock.calls[0][0];
            const message = {
                data: {
                    messageType: MessageType.Chat_Denied,
                    thank_you_image_label: "chat denied message",
                    messageTimestamp: "test"
                }
            };

            handleMessage(message);
            expect(container.transcript.addSystemMsg).toHaveBeenCalledWith({msg: "chat denied message"}, "test");
        });

        it("reports Closed to the transcript", () => {
            const [sdk, container] = createEngagedStateDependencies();

            const state = new ChatStates.EngagedState(sdk, container, [], jest.fn());

            const handleMessage = sdk.getMessages.mock.calls[0][0];
            const message = {
                data: {
                    state: "closed",
                    messageTimestamp: "test"
                }
            };

            handleMessage(message);
            expect(container.transcript.addSystemMsg).toHaveBeenCalledWith({msg: "Agent Left Chat."}, "test");
        });

        it("reports unknown message to console log", () => {
            const [sdk, container] = createEngagedStateDependencies();

            console.log = jest.fn();

            const state = new ChatStates.EngagedState(sdk, container, [], jest.fn());
            
            const handleMessage = sdk.getMessages.mock.calls[0][0];
            const message = {data: {}};

            
            handleMessage(message);
            expect(console.log).toBeCalledWith("DEBUG: ==== Unknown message:", {});
        });

        it("send previous messages to the transcript", () => {
            const [sdk, container] = createEngagedStateDependencies();

            const messages = [{
                data: {
                    messageType: MessageType.Chat_Communication,
                    "isAgentMsg": false,
                    "external.app": true,
                    messageText: "Beep boop. I am a robot",
                    messageTimestamp: "test"
                }
            }, {
                data: {
                    messageType: MessageType.Chat_Communication,
                    "isAgentMsg": false,
                    "external.app": true,
                    messageText: "Hello to you",
                    messageTimestamp: "test"
                }
            }];

            const state = new ChatStates.EngagedState(sdk, container, messages, jest.fn());

            expect(container.transcript.addCustomerMsg).toHaveBeenCalledWith("Beep boop. I am a robot", "test");
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
                    "msg.originalrequest.id": "385445912674772418",
                }
            };

            handleMessage(message);
            expect(container.transcript.addSystemMsg).toHaveBeenCalledWith({msg: "I'm connecting you to the next available webchat adviser."}, "1627648283000");
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
            expect(container.transcript.addSystemMsg).toHaveBeenCalledWith({msg: "You're now talking to Jay"}, "1627648283000");
        });

        it("sends AgentTyping to the transcript", () => {
            const [sdk, container] = createEngagedStateDependencies();

            const state = new ChatStates.EngagedState(sdk, container, [], jest.fn());

            let agentIsTypingSpy = jest.spyOn(state, '_chatActivityAndAgentTyping');

            const handleMessage = sdk.getMessages.mock.calls[0][0];
            const message = {
                data: {
                    "type": "2",
                    "state": "agentIsTyping",
                    "agentID": "42409619",
                    "user.id":"42409619",
                    "sessionId": "2493130538282329498",
                    "aeapi.mode": "true",
                    "messageType":"chat.activity",
                    "display.text": "Agent is typing...",
                    "engagementID": "388260662637696059",
                    "external_user.ip": "80.0.102.28",
                    "config.session_id": "2493130538282329498",
                    "msg.originalrequest.id": "2493130538484377173",
                    "messageTimestamp": "1627651337000"
                }
            };

            handleMessage(message);
            expect(agentIsTypingSpy).toBeCalledTimes(1);
            expect(container.transcript.addSystemMsg).toHaveBeenCalledWith({msg: "Agent is typing...", state: "agentIsTyping"}, "1627651337000");
        });

        it("removes AgentTyping from the transcript", () => {
            const [sdk, container] = createEngagedStateDependencies();

            const state = new ChatStates.EngagedState(sdk, container, [], jest.fn());

            let agentTypingDiv = document.createElement("div");
            agentTypingDiv.innerHTML = "agent is typing"
            agentTypingDiv.classList.add("agent-typing");
            document.body.appendChild(agentTypingDiv);

            let agentStoppedTypingSpy = jest.spyOn(state, '_removeAgentIsTyping');

            const handleMessage = sdk.getMessages.mock.calls[0][0];
            const message = {
                data: {
                    "type": "16",
                    "state": "agentIsTyping",
                    "agentID": "42409619",
                    "user.id":"42409619",
                    "sessionId": "2493130538282329498",
                    "aeapi.mode": "true",
                    "messageType":"chat.activity",
                    "display.text": "Agent stopped typing",
                    "engagementID": "388260662637696059",
                    "external_user.ip": "80.0.102.28",
                    "config.session_id": "2493130538282329498",
                    "msg.originalrequest.id": "2493130538484377173"
                }
            };

            handleMessage(message);

            expect(document.body.innerHTML).toBe("");
            expect(agentStoppedTypingSpy).toBeCalledTimes(1);
        });

        it("reports chat exit in transcript", () => {
            const [sdk, container] = createEngagedStateDependencies();

            const state = new ChatStates.EngagedState(sdk, container, [], jest.fn());

            const handleMessage = sdk.getMessages.mock.calls[0][0];
            const message = {
                data: {
                    "state": "closed",
                    "agentID": "42391918",
                    "isAgentMsg": true,
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
            expect(container.transcript.addSystemMsg).toHaveBeenCalledWith({msg: "Agent 'Jay' exits chat"}, "1627651338000");
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
            expect(container.transcript.addSystemMsg).toHaveBeenCalledWith({msg: "Adviser exited chat"}, "1628001005000");
        });

        it("does not report HMRC loses connection ", () => {
            const [sdk, container] = createEngagedStateDependencies();

            const state = new ChatStates.EngagedState(sdk, container, [], jest.fn());

            let chatRoomMemberLostSpy = jest.spyOn(state, '_chatRoomMemberLost');

            const handleMessage = sdk.getMessages.mock.calls[0][0];
            const message = {
                data: {
                    "chatroom.member.id": "42413088",
                    "chatroom.member.type": "agent",
                    "display.text": "Agent 'HMRC' loses connection",
                    "engagementID": "388264134371804042",
                    "ltime": "353083",
                    "messageTimestamp": "1680622644000",
                    "messageType": "chatroom.member_lost",
                    "tc.mode": "transfer"
                }
            };

            handleMessage(message);
            expect(container.transcript.addSystemMsg).toBeCalledTimes(0);
            expect(chatRoomMemberLostSpy).toBeCalledTimes(1);
        });

        it("reports agent has been lost", () => {
            const [sdk, container] = createEngagedStateDependencies();

            const state = new ChatStates.EngagedState(sdk, container, [], jest.fn());

            let chatRoomMemberLostSpy = jest.spyOn(state, '_chatRoomMemberLost');

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
            expect(container.transcript.addSystemMsg).toHaveBeenCalledWith({msg: "Agent 'JoeBloggs' loses connection"}, "1627654612000");
            expect(container.transcript.addSystemMsg).toBeCalledTimes(1);
            expect(chatRoomMemberLostSpy).toBeCalledTimes(1);
        });

        it("removes agent joins conference", () => {
            const [sdk, container] = createEngagedStateDependencies();

            const state = new ChatStates.EngagedState(sdk, container, [], jest.fn());

            let agentJoinsDiv = document.createElement("div");
            agentJoinsDiv.innerHTML = "agent joins conference"
            agentJoinsDiv.classList.add("agent-joins-conference");
            document.body.appendChild(agentJoinsDiv)

            let transferResponseSpy = jest.spyOn(state, '_removeAgentJoinsConference');

            const handleMessage = sdk.getMessages.mock.calls[0][0];
            const message = {
                data: {
                    "ltime":"817018",
                    "state":"transfer",
                    "reason":"Transfer accepted and sent to Steve",
                    "status":"accepted",
                    "messageType":"owner.transfer_response",
                    "engagementID":"388260663047034009",
                    "messageTimestamp":"1627654612000",
                    "client.display.text":"Joe has left the chat\nPlease wait, you'll be connected to the next available adviser",
                    "msg.originalrequest.id":"3415245869783399775"
                }
            };

            handleMessage(message);

            expect(document.body.innerHTML).toBe("");
            expect(transferResponseSpy).toBeCalledTimes(1);
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
            expect(container.transcript.addSystemMsg).toHaveBeenCalledWith({msg: "Sorry for the delay. An adviser should be with you soon."}, "1627654732000");
        });

        it("closes the chat when clicked", () => {
            const [sdk, container] = createEngagedStateDependencies();

            const onCloseChat = jest.fn();

            const state = new ChatStates.EngagedState(sdk, container, [], onCloseChat);

            state.onClickedClose();
            expect(onCloseChat).toHaveBeenCalled();
        });


        it("calls the transcript addQuickReply method", () => {
            const [sdk, container] = createEngagedStateDependencies();

            const state = new ChatStates.EngagedState(sdk, container, [], jest.fn());

            let chatCommunicationMessageSpy = jest.spyOn(state, '_chatCommunicationMessage');
            let extractQuickReplyDataSpy = jest.spyOn(state, '_extractQuickReplyData');

            const handleMessage = sdk.getMessages.mock.calls[0][0];

            const message = {
                data : {
                    "agentID": "42413094",
                    "sessionId": "-2232268617980682976",
                    "aeapi.mode": "true",
                    "agent.alias": "HMRC",
                    "messageData": "{\"widgetType\":\"quickreply\",\"widgetView\":\"inline\",\"widgetAction\":\"optional\",\"showMessageText\":true,\"nodes\":[{\"id\":\"quickreply_template\",\"controls\":{\"0\":{\"type\":\"QuickReplyButton\",\"id\":\"qrb_1\",\"context\":\"info\",\"text\":[\"England, Scotland or Wales\",\"Northern Ireland\"],\"event\":{\"name\":\"eventquick\"},\"values\":[\"england\",\"northern_ireland\"]}}}],\"transitions\":[{\"name\":\"TransitionOne\",\"from\":\"quickreply_template\",\"to\":{\"sendMessage\":{\"selected\":\"#quickreply_template.qrb_1.selectedIndex\",\"selectedText\":\"#quickreply_template.qrb_1.selectedText\",\"selectedValue\":\"#quickreply_template.qrb_1.selectedValue\",\"displayText\":\"#quickreply_template.qrb_1.selectedText\",\"nvaaType\":\"QuickReplyButton\",\"nvaaId\":\"england;LOCATION;northern_ireland;LOCATION;\"}},\"trigger\":\"eventquick\"}]}",
                    "messageText": "Where do you live?",
                    "messageType": "chat.communication",
                    "engagementID": "388263420789170349",
                    "external.app": "true",
                    "external_user.ip": "52.142.149.60",
                    "messageTimestamp": "1669734234000",
                    "config.session_id": "-2232268617980682976",
                    "msg.originalrequest.id": "-2232268612589414572",
                    "senderName": "HMRC",
                    "isAgentMsg": true,
                    "chatFinalText": "Where do you live?"
                }
            };

            handleMessage(message);

            expect(chatCommunicationMessageSpy).toBeCalledTimes(1);
            expect(extractQuickReplyDataSpy).toBeCalledTimes(1)
            expect(container.transcript.addQuickReply).toBeCalledTimes(1);

            const firstArgToTranscriptAddQuickReply =
                container.transcript.addQuickReply.mock.calls[0][0];

            let expectedAddQuickReplyFirstArg = {
                widgetType: 'quickreply',
                widgetView: 'inline',
                widgetAction: 'optional',
                showMessageText: true,
                nodes: [{ id: 'quickreply_template', controls: {
                    '0': {
                        type: 'QuickReplyButton',
                        id: 'qrb_1',
                        context: 'info',
                        text: [ 'England, Scotland or Wales', 'Northern Ireland' ],
                        event: { name: 'eventquick' },
                        values: [ 'england', 'northern_ireland' ]
                        }
                    }
                }],
                transitions: [
                    {
                        name: 'TransitionOne',
                        from: 'quickreply_template',
                        to: {
                            sendMessage: {
                                selected: '#quickreply_template.qrb_1.selectedIndex',
                                selectedText: '#quickreply_template.qrb_1.selectedText',
                                selectedValue: '#quickreply_template.qrb_1.selectedValue',
                                displayText: '#quickreply_template.qrb_1.selectedText',
                                nvaaType: 'QuickReplyButton',
                                nvaaId: 'england;LOCATION;northern_ireland;LOCATION;'
                                }
                        },
                        trigger: 'eventquick'
                    }
                ]
            }

            const secondArgToTranscriptAddQuickReply =
                container.transcript.addQuickReply.mock.calls[0][1];

            const thirdArgToTranscriptAddQuickReply =
                container.transcript.addQuickReply.mock.calls[0][2];


            expect(firstArgToTranscriptAddQuickReply)
                .toMatchObject(expectedAddQuickReplyFirstArg);

            expect(secondArgToTranscriptAddQuickReply).toBe('Where do you live?');
            expect(thirdArgToTranscriptAddQuickReply).toBe('1669734234000');
        });

        it("calls the transcript QuickReply YouTube Video method", () => {
            const [sdk, container] = createEngagedStateDependencies();

            const state = new ChatStates.EngagedState(sdk, container, [], jest.fn());

            let chatCommunicationMessageSpy = jest.spyOn(state, '_chatCommunicationMessage');
            let extractQuickReplyYouTubeVideoDataSpy = jest.spyOn(state, '_extractYouTubeVideoData');
            let processYouTubeMessageDataSpy = jest.spyOn(state, '_processMessageYouTubeVideoData');
            let playSoundIfActiveSpy = jest.spyOn(state, '_playSoundIfActive');

            const handleMessage = sdk.getMessages.mock.calls[0][0];

            const message = {
                data : {
                    "agentID": "42413088",
                    "sessionId": "-2232268594100344748",
                    "aeapi.mode": "true",
                    "agent.alias": "HMRC",
                    "messageData": "{\"widgetType\": \"youtube-video\", \"customWidget\": true, \"videoId\": \"Jn46jDuKbn8\" }",
                    "messageText": "Video test message",
                    "messageType": "chat.communication",
                    "engagementID": "388263459296297338",
                    "external.app": "true",
                    "external_user.ip": "52.142.149.60",
                    "messageTimestamp": "1670321809000",
                    "config.session_id": "-2232268594100344748",
                    "msg.originalrequest.id": "-2232268574082125842",
                    "senderName": "HMRC",
                    "isAgentMsg": true,
                    "chatFinalText": "Video test message"
                }
            };

            handleMessage(message);

            expect(chatCommunicationMessageSpy).toBeCalledTimes(1);
            expect(extractQuickReplyYouTubeVideoDataSpy).toBeCalledTimes(1)
            expect(processYouTubeMessageDataSpy).toBeCalledTimes(1);
            expect(playSoundIfActiveSpy).toBeCalledTimes(1)

            const firstArgToTranscriptAddAutomatonMsg = container.transcript.addAutomatonMsg.mock.calls[0][0];

            expect(firstArgToTranscriptAddAutomatonMsg).toBe(`<p>Video test message</p><span class=\"govuk-visually-hidden\">embedded youtube video below with url</span><p><a href=\"https://www.youtube.com/watch?v=Jn46jDuKbn8\" rel="noreferrer noopener" target=\"_blank\"> https://www.youtube.com/watch?v=Jn46jDuKbn8 (opens in new tab)</a></p><div class="iframe-wrap"><iframe title=\"Embedded YouTube Video\" class="video-message" frameborder="0" allowFullScreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" src="https://www.youtube.com/embed/Jn46jDuKbn8"></iframe></div>`);
        });
    });

});
