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
    },
    Timestamp: {
        Outer: 'timestamp-outer',
        Inner: 'timestamp-inner'
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

        const transcript = new Transcript(content, messageClasses);

        transcript.addSystemMsg({msg: "System Message"});

        expect(content.appendChild).toBeCalledTimes(1);
        expect(messageClasses.Timestamp.Outer).toContain("timestamp-outer");
        expect(content.appendChild).toHaveBeenCalledWith(expect.any(Element));
    });

    it("appends opener scripts", () => {
        const content = {
            insertAdjacentHTML: jest.fn(),
            appendChild: jest.fn(),
            scrollTo: jest.fn(),
            scrollHeight: 50
        };

        const transcript = new Transcript(content, messageClasses);

        transcript.addOpenerScript("An Opener Script");

        expect(content.appendChild).toBeCalledTimes(1);
        expect(messageClasses.Timestamp.Outer).toContain("timestamp-outer");
        expect(content.appendChild).toHaveBeenCalledWith(expect.any(Element));
    });

    it("appends agent messages", () => {
        const content = {
            insertAdjacentHTML: jest.fn(),
            appendChild: jest.fn(),
            scrollTo: jest.fn(),
            scrollHeight: 314
        };

        const transcript = new Transcript(content, messageClasses);

        transcript.addAgentMsg("Some agent message");

        expect(content.appendChild).toBeCalledTimes(1);
        expect(messageClasses.Timestamp.Outer).toContain("timestamp-outer");
        expect(content.appendChild).toHaveBeenCalledWith(expect.any(Element));
    });

    it("appends customer messages", () => {
        const content = {
            insertAdjacentHTML: jest.fn(),
            appendChild: jest.fn(),
            scrollTo: jest.fn(),
            scrollHeight: 666
        };

        const transcript = new Transcript(content, messageClasses);

        transcript.addCustomerMsg("Some customer message");

        expect(content.appendChild).toBeCalledTimes(1);
        expect(messageClasses.Timestamp.Outer).toContain("timestamp-outer");
        expect(content.appendChild).toHaveBeenCalledWith(expect.any(Element));
    });

    it("appends customer messages without live region", () => {
        const content = {
            insertAdjacentHTML: jest.fn(),
            appendChild: jest.fn(),
            scrollTo: jest.fn(),
            scrollHeight: 666
        };

        const transcript = new Transcript(content, messageClasses);

        transcript._appendMessage("test1", "time", messageClasses.Customer, "test3", true);

        expect(content.appendChild).toBeCalledTimes(1);
        expect(messageClasses.Timestamp.Outer).toContain("timestamp-outer");
        expect(content.appendChild).toHaveBeenCalledWith(expect.any(Element));
    });

    it("appends other messages(automated, agent etc) with live region", () => {
        const content = {
            insertAdjacentHTML: jest.fn(),
            appendChild: jest.fn(),
            scrollTo: jest.fn(),
            scrollHeight: 666
        };

        const transcript = new Transcript(content, messageClasses);

        transcript._appendMessage("test1", "time", messageClasses.Agent, "test3", false);

        expect(content.appendChild).toBeCalledTimes(1);
        expect(messageClasses.Timestamp.Outer).toContain("timestamp-outer");
        expect(content.appendChild).toHaveBeenCalledWith(expect.any(Element));
    });

    it("appends automaton messages", () => {
        const content = {
            appendChild: jest.fn(),
            scrollTo: jest.fn(),
            scrollHeight: 1024
        };

        const transcript = new Transcript(content, messageClasses);

        transcript.addAutomatonMsg("I'm not a real person");

        expect(content.appendChild).toBeCalledTimes(1);
        expect(messageClasses.Timestamp.Outer).toContain("timestamp-outer");
        expect(content.appendChild).toHaveBeenCalledWith(expect.any(Element));
    });


    it("appends skip link to bottom", () => {
        const content = {
            appendChild: jest.fn(),
            scrollTo: jest.fn(),
            scrollHeight: 4
        };

        let chatContainer = document.createElement("div");
        chatContainer.setAttribute("id", "ciapiSkinChatTranscript");
        chatContainer.setAttribute("scrollHeight", 4);
        chatContainer.setAttribute("clientHeight", 5);
        document.body.appendChild(chatContainer);

        const transcript = new Transcript(content, messageClasses);

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

        const transcript = new Transcript(content, messageClasses);

        let div = document.createElement("div");
        div.setAttribute("id", "test");
        document.body.appendChild(div);

        transcript.appendMessageInLiveRegion("Some agent message", "test", "testmsg", this);
        
        expect(document.getElementById("test").innerHTML).toBe("<div class=\"govuk-visually-hidden\">testmsg</div> Some agent message");
    });

    it("replaces encoded string", () => {
        const content = {
            insertAdjacentHTML: jest.fn(),
            scrollTo: jest.fn(),
            scrollHeight: 314
        };

        const transcript = new Transcript(content, messageClasses);

        var msg = transcript.decodeHTMLEntities("&lt;this is &apos; test&gt;");

        expect(msg).toBe("<this is ' test>");
    });

    it('Print time stamp with parameter', () => {
        const content = {
            insertAdjacentHTML: jest.fn(),
            scrollTo: jest.fn(),
            scrollHeight: 314
        }
        const transcript = new Transcript(content, messageClasses);

        let time = transcript.getPrintTimeStamp('1716282325416');

        expect(["10:05 AM", '9:05 AM']).toContain(time);
    })

    it('Print time stamp with empty string', () => {
        const content = {
            insertAdjacentHTML: jest.fn(),
            scrollTo: jest.fn(),
            scrollHeight: 314
        }
        const transcript = new Transcript(content, messageClasses);

        let time = transcript.getPrintTimeStamp('');

        expect(time).toBe("");
    })

    it('Get timestamp prefix', () => {
        const content = {
            insertAdjacentHTML: jest.fn(),
            scrollTo: jest.fn(),
            scrollHeight: 314
        }
        const transcript = new Transcript(content, messageClasses);

        let timestampPrefix = transcript._getTimestampPrefix('1716282325416')

        expect(['<span class=\"govuk-visually-hidden\">10:05 AM</span>', '<span class=\"govuk-visually-hidden\">9:05 AM</span>']).toContain(timestampPrefix);
    })

    it('Get Message time stamp prefix', () => {
        const content = {
            insertAdjacentHTML: jest.fn(),
            scrollTo: jest.fn(),
            scrollHeight: 314
        }
        const transcript = new Transcript(content, messageClasses);

        let messageTimestampPrefix = transcript._getMsgTimestampPrefix('1716282325416', ' Automated message : ', 'h3')

        expect(['<h3>10:05 AM Automated message : </h3>', '<h3>9:05 AM Automated message : </h3>']).toContain(messageTimestampPrefix)
    })
});
