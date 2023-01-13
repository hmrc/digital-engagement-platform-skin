import * as MessageType from '../../../../../../app/assets/javascripts/NuanceMessageType'

describe("MessageType", () => {
    it("has correct values matching Nuance docs", () => {
        expect(MessageType.Chat_Communication).toEqual('chat.communication')
        expect(MessageType.Chat_CommunicationQueue).toEqual('chat.communication.queue')
        expect(MessageType.Chat_NeedWait).toEqual('chat.need_wait')
        expect(MessageType.Chat_Denied).toEqual('chat.denied')
    });
});
