import * as SUT from '../../../../../../app/assets/typescripts/chat-ui'

describe("CI API Implementation", () => {
    describe("hookWindow", () => {
        it("adds public members needed by Nuance business rules", () => {
            SUT.hookWindow(window);
            expect(window.InqRegistry).toBeDefined();
            expect(window.InqRegistry.listeners).toBeDefined();
            expect(window.InqRegistry.listeners.length).toBe(1);
            expect(window.nuanceFrameworkLoaded).toBeDefined();
            expect(window.nuanceReactive_HMRC_CIAPI_Fixed_1).toBeDefined();
            expect(window.nuanceReactive_HMRC_CIAPI_Anchored_1).toBeDefined();
            expect(window.nuanceProactive).toBeDefined();
        });
    });
});
