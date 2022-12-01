export default function createEngagedStateDependencies() {
    const sdk = {
        sendMessage: jest.fn(),
        getMessages: jest.fn()
    };

    const container = {
        confirmEndChat: jest.fn().mockImplementation(),
        transcript: {
            addAgentMsg: jest.fn(),
            addCustomerMsg: jest.fn(),
            addAutomatonMsg: jest.fn(),
            addSystemMsg: jest.fn(),
            addQuickReply: jest.fn().mockImplementation()
        },
        getTranscript: function () {
            return this.transcript;
        }
    };

    return [sdk, container];
}
