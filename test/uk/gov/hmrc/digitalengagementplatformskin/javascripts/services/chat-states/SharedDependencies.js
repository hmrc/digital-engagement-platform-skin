export default function createEngagedStateDependencies() {
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