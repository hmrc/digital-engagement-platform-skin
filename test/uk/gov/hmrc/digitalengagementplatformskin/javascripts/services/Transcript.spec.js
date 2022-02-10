import Transcript from '.../../../app/assets/javascripts/services/Transcript'

const messageClasses = {
    Agent: {
        Outer: 'agent-outer',
        Inner: 'agent-inner'
    },
    Customer: {
        Outer: 'customer-outer',
        Inner: 'customer-inner'
    },
    System: {
        Outer: 'system-outer',
        Inner: 'system-inner'
    },
    Opener: {
        Outer: 'opener-outer',
        Inner: 'opener-inner'
    }
};

const mockMath = Object.create(global.Math);
        mockMath.random = () => 0.5;
        global.Math = mockMath;


describe("Transcript", () => {
    it("appends system messages", () => {
        const content = {
            insertAdjacentHTML: jest.fn(),
            appendChild: jest.fn(),
            scrollTo: jest.fn(),
            scrollHeight: 42
        };
        const vaLinkCallback = jest.fn();
        const transcript = new Transcript(content, vaLinkCallback, messageClasses);

        transcript.addSystemMsg("System Message");

        expect(content.insertAdjacentHTML).toHaveBeenCalledWith(
            "beforeend",
            "<div class= govuk-!-display-none-print system-outer><div class= \"msg-opacity system-inner\" id=liveMsgId50 aria-live=polite></div></div>"
        );
    });

    it("appends opener scripts", () => {
        const content = {
            insertAdjacentHTML: jest.fn(),
            appendChild: jest.fn(),
            scrollTo: jest.fn(),
            scrollHeight: 50
        };
        const vaLinkCallback = jest.fn();
        const transcript = new Transcript(content, vaLinkCallback, messageClasses);

        transcript.addOpenerScript("An Opener Script");

        expect(content.insertAdjacentHTML).toHaveBeenCalledWith(
            "beforeend",
            "<div class=opener-outer><div class= \"msg-opacity opener-inner\" tabindex=-1 id=liveMsgId50 aria-live=polite></div></div>"
        );
    });

    it("appends agent messages", () => {
        const content = {
            insertAdjacentHTML: jest.fn(),
            appendChild: jest.fn(),
            scrollTo: jest.fn(),
            scrollHeight: 314
        };
        const vaLinkCallback = jest.fn();
        const transcript = new Transcript(content, vaLinkCallback, messageClasses);

        transcript.addAgentMsg("Some agent message");

        expect(content.insertAdjacentHTML).toHaveBeenCalledWith(
            "beforeend",
            "<div class=agent-outer><div class= \"msg-opacity agent-inner\" tabindex=-1 id=liveMsgId50 aria-live=polite></div></div>"
        );
    });

    it("appends customer messages", () => {
        const content = {
            insertAdjacentHTML: jest.fn(),
            appendChild: jest.fn(),
            scrollTo: jest.fn(),
            scrollHeight: 666
        };
        const vaLinkCallback = jest.fn();
        const transcript = new Transcript(content, vaLinkCallback, messageClasses);

        transcript.addCustomerMsg("Some customer message");

        expect(content.insertAdjacentHTML).toHaveBeenCalledWith(
            "beforeend",
            "<div class=customer-outer><div class= \"msg-opacity customer-inner\" id=liveMsgId50></div></div>"
        );
    });

     it("appends customer messages without live region", () => {
            const content = {
                insertAdjacentHTML: jest.fn(),
                appendChild: jest.fn(),
                scrollTo: jest.fn(),
                scrollHeight: 666
            };
            const vaLinkCallback = jest.fn();
            const transcript = new Transcript(content, vaLinkCallback, messageClasses);

            transcript._appendMessage("test1","time", messageClasses.Customer, "test3", true);

            expect(content.insertAdjacentHTML).toHaveBeenCalledWith(
                "beforeend",
                "<div class=customer-outer><div class= \"msg-opacity customer-inner\" id=liveMsgId50></div></div>"
            );
        });

        it("appends other messages(automated, agent etc) with live region", () => {
                    const content = {
                        insertAdjacentHTML: jest.fn(),
                        appendChild: jest.fn(),
                        scrollTo: jest.fn(),
                        scrollHeight: 666
                    };
                    const vaLinkCallback = jest.fn();
                    const transcript = new Transcript(content, vaLinkCallback, messageClasses);

                    transcript._appendMessage("test1","time", messageClasses.Agent, "test3", false);

                    expect(content.insertAdjacentHTML).toHaveBeenCalledWith(
                        "beforeend",
                        "<div class=agent-outer><div class= \"msg-opacity agent-inner\" tabindex=-1 id=liveMsgId50 aria-live=polite></div></div>"
                    );
                });

    it("appends automaton messages", () => {
        const content = {
            appendChild: jest.fn(),
            scrollTo: jest.fn(),
            scrollHeight: 1024
        };
        const vaLinkCallback = jest.fn();
        const transcript = new Transcript(content, vaLinkCallback, messageClasses);

        transcript.addAutomatonMsg("I'm not a real person");

        expect(content.appendChild).toHaveBeenCalledWith(expect.any(Element));
    });


    it("appends skip link to bottom", () => {
        const content = {
            appendChild: jest.fn(),
            scrollTo: jest.fn(),
            scrollHeight: 4
        };
        const vaLinkCallback = jest.fn();

        let chatContainer = document.createElement("div");
        chatContainer.setAttribute("id", "ciapiSkinChatTranscript");
        chatContainer.setAttribute("scrollHeight", 4);
        chatContainer.setAttribute("clientHeight", 5);
        document.body.appendChild(chatContainer);

        const transcript = new Transcript(content, vaLinkCallback, messageClasses);

        transcript.addSkipToBottomLink();

        expect(document.getElementById("ciapiSkinChatTranscript").innerHTML).toBe(
            "<div id=\"skipToTop\" class=\"skipToTopWithOutScroll govuk-!-padding-top-2\"><a id=\"skipToTopLink\" href=\"#\" class=\"govuk-skip-link\">Skip to top of conversation</a></div>");
    });

    it("appends agent messages after 3000ms", () => {
            const content = {
                insertAdjacentHTML: jest.fn(),
                scrollTo: jest.fn(),
                scrollHeight: 314
            };

            const vaLinkCallback = jest.fn();
            const transcript = new Transcript(content, vaLinkCallback, messageClasses);

             let div = document.createElement("div");
             div.setAttribute("id", "test");
             document.body.appendChild(div);

            transcript.appendMessgeInLiveRegion("Some agent message", "test", "testmsg", this);

            expect(document.getElementById("test").innerHTML).toBe("<p class=\"govuk-visually-hidden\">testmsg</p> Some agent message");
        });

     it("replaces encoded string", () => {
            const content = {
                insertAdjacentHTML: jest.fn(),
                scrollTo: jest.fn(),
                scrollHeight: 314
            };
            const vaLinkCallback = jest.fn();
            const transcript = new Transcript(content, vaLinkCallback, messageClasses);

            var msg = transcript.decodeHTMLEntities("&lt;this is &apos; test&gt;");

            expect(msg).toBe("<this is ' test>");
            });

    //TODO create a test for each of the above scenarios where the incoming message is higher than the parent div
});
