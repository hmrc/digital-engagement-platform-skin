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

        transcript.addSystemMsg({ msg: "System Message" });

        expect(content.appendChild).toBeCalledTimes(1);
        expect(messageClasses.Timestamp.Outer).toContain("timestamp-outer");
        expect(content.appendChild).toHaveBeenCalledWith(expect.any(Element));
    });


    it("appends correct system message when passed Agent 'hmrcda' exits chat", () => {
        const content = {
            insertAdjacentHTML: jest.fn(),
            appendChild: jest.fn(),
            scrollTo: jest.fn(),
            scrollHeight: 42,
        };

        const transcript = new Transcript(content, messageClasses);
        const spyOnappendMessage = jest.spyOn(transcript, "_appendMessage")
        transcript.addSystemMsg({ msg: "Agent 'hmrcda' exits chat" });

        expect(spyOnappendMessage.mock.calls[0][0] === 'Your chat has ended.').toBe(true)
        expect(spyOnappendMessage.mock.calls[0][0] !== "Agent 'hmrcda' exits chat").toBe(true)
    });

    it("appends correct system message when not passed 'hmrcda' exits the chat", () => {
        const content = {
            insertAdjacentHTML: jest.fn(),
            appendChild: jest.fn(),
            scrollTo: jest.fn(),
            scrollHeight: 42,
        };

        const transcript = new Transcript(content, messageClasses);
        const spyOnappendMessage = jest.spyOn(transcript, "_appendMessage")
        transcript.addSystemMsg({ msg: "Agent 'Andrew' exits chat" });

        expect(spyOnappendMessage.mock.calls[0][0] === "Agent 'Andrew' exits chat").toBe(true)
        expect(spyOnappendMessage.mock.calls[0][0] !== 'Your chat has ended.').toBe(true)
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

    const dateString = "2024-01-01T00:00:00";
    const timeStamp = Date.parse(dateString);

    it('Print time stamp with parameter', () => {
        const content = {
            insertAdjacentHTML: jest.fn(),
            scrollTo: jest.fn(),
            scrollHeight: 314
        }
        const transcript = new Transcript(content, messageClasses);

        const time = transcript.getPrintTimeStamp(timeStamp);

        expect(time).toBe('12:00 AM')
    })

    it('Print time stamp with empty string', () => {
        const content = {
            insertAdjacentHTML: jest.fn(),
            scrollTo: jest.fn(),
            scrollHeight: 314
        }
        const transcript = new Transcript(content, messageClasses);

        const time = transcript.getPrintTimeStamp('');

        expect(time).toBe("");
    })

    it('Get timestamp prefix', () => {
        const content = {
            insertAdjacentHTML: jest.fn(),
            scrollTo: jest.fn(),
            scrollHeight: 314
        }
        const transcript = new Transcript(content, messageClasses);

        const timestampPrefix = transcript._getTimestampPrefix(timeStamp)

        expect(timestampPrefix).toBe('<span class=\"govuk-visually-hidden\">12:00 AM</span>')
    })

    it('Get Message time stamp prefix', () => {
        const content = {
            insertAdjacentHTML: jest.fn(),
            scrollTo: jest.fn(),
            scrollHeight: 314
        }
        const transcript = new Transcript(content, messageClasses);

        const messageTimestampPrefix = transcript._getMsgTimestampPrefix(timeStamp, ' Automated message : ', 'h3')

        expect(messageTimestampPrefix).toBe('<h3>12:00 AM Automated message : </h3>')
    })
});
