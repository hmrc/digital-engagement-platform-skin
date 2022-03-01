export default class Transcript {
    constructor(content, vaLinkCallback, classes, msgPrefix) {
        this.content = content;
        this.vaLinkCallback = vaLinkCallback;
        this.classes = classes;
        this.agentMsgPrefix = "Adviser said : ";
        this.customerMsgPrefix = "You said : ";
        this.systemMsgPrefix = "System message : ";
        this.automatedMsgPrefix = "Automated message : ";
    }

    addAgentMsg(msg, msgTimestamp, agent) {
        this._appendMessage(msg, msgTimestamp, this.classes.Agent, this.agentMsgPrefix, false, false);
    }

    addCustomerMsg(msg, msgTimestamp, agent) {
        this._appendMessage(msg, msgTimestamp, this.classes.Customer, this.customerMsgPrefix, true, false);
    }

    addSystemMsg(msg) {
        this._appendMessage(msg, "", this.classes.System, this.systemMsgPrefix, false, true);
    }

    addOpenerScript(msg) {
        let msgTimestamp = new Date().getTime();
        this._appendMessage(msg, msgTimestamp, this.classes.Opener, this.automatedMsgPrefix, false, false);
    }

    addSkipToBottomLink() {
        const chatContainer = document.getElementById("ciapiSkinChatTranscript")

        if (chatContainer.scrollHeight > chatContainer.clientHeight) {
            this.createSkipLink("skipToTopWithScroll");
        } else {
            this.createSkipLink("skipToTopWithOutScroll");
        }

    }

    createSkipLink(className) {

        const chatContainer = document.getElementById("ciapiSkinChatTranscript")

        chatContainer.insertAdjacentHTML("beforeend", '<div id="skipToTop" class="' + className + ' govuk-!-padding-top-2"><a id="skipToTopLink" href="#" class="govuk-skip-link">Skip to top of conversation</a></div>');
        document.getElementById("skipToTopLink").addEventListener("click",
            function(e) {
                e.preventDefault();
                document.getElementById("skipToBottomLink").focus();
            })

    }

    decodeHTMLEntities(text) {
        var entities = [
            ['amp', '&'],
            ['apos', '\''],
            ['#x27', '\''],
            ['#x2F', '/'],
            ['#39', '\''],
            ['#47', '/'],
            ['lt', '<'],
            ['gt', '>'],
            ['nbsp', ' '],
            ['quot', '"']
        ];

        for (var i = 0, max = entities.length; i < max; ++i)
            text = text.replace(new RegExp('&' + entities[i][0] + ';', 'g'), entities[i][1]);

        return text;
    }


    appendMessgeInLiveRegion(msg, id, msg_type, isVirtualAssistance, that, msg_class, isSystemMsg) {
        if (document.getElementById(id)) {
            if (that) {
                var msg = that.decodeHTMLEntities(msg);
            }

            document.getElementById(id).innerHTML = "<p class=govuk-visually-hidden>" + msg_type + "</p> " + msg;
            document.getElementById(id).classList.remove("msg-opacity");
        }
        if (isVirtualAssistance == true && !isSystemMsg) {
            document.getElementById(id).focus();
        }
        if (that) {
            that._showLatestContent(msg_class);
        }
    }

    getPrintTimeStamp(msgTimestamp) {

        var strTime = "";

        if (msgTimestamp != "") {

            var date = new Date(parseInt(msgTimestamp));

            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            strTime = hours + ':' + minutes + ' ' + ampm;

        }
        return strTime;
    }

    addAutomatonMsg(msg, msgTimestamp) {

        var id = "liveAutomatedMsgId" + (Math.random() * 100);
        const msgDiv = `<div class= "msg-opacity govuk-body ${this.classes.Agent.Inner}" tabindex=-1 id=${id}></div>`;

        const skipToTop = document.getElementById("skipToTop");
        const chatContainer = document.getElementById("ciapiSkinChatTranscript")

        var agentDiv = document.createElement("div")
        agentDiv.classList.add(this.classes.Agent.Outer);
        agentDiv.insertAdjacentHTML("beforeend", msgDiv);
        agentDiv.setAttribute('aria-live', 'polite');

        var printMessageSuffix = document.createElement("span");
        printMessageSuffix.className = "print-only print-float-left govuk-!-font-weight-bold govuk-body";
        printMessageSuffix.innerHTML = "HMRC: ";

        var printOuterTimeStamp = document.createElement("div");

        var printTimeStamp = document.createElement("p");
        printTimeStamp.className = "print-only govuk-body print-float-left";
        printTimeStamp.innerHTML = this.getPrintTimeStamp(msgTimestamp);

        this._fixUpVALinks(agentDiv);

        printOuterTimeStamp.className = "timestamp-outer";
        printOuterTimeStamp.innerHTML = printMessageSuffix.outerHTML + agentDiv.outerHTML + printTimeStamp.outerHTML;

        this.content.appendChild(printOuterTimeStamp);


        setTimeout(this.appendMessgeInLiveRegion, 300, msg, id, this.automatedMsgPrefix, true, this, this.classes.Agent, false);


        if (chatContainer) {

            if (skipToTop != null) {
                chatContainer.removeChild(skipToTop)
            }

            this.addSkipToBottomLink();

        }
    }

    _fixUpVALinks(div) {
        const links = div.getElementsByTagName('a');

        for (const link of links) {
            for (const attribute of link.attributes) {
                if (attribute.name === "data-vtz-link-type" && attribute.value === "Dialog") {
                    link.onclick = this.vaLinkCallback;
                }
            }
        }
    }

    _appendMessage(msg, msgTimestamp, msg_class, msg_type, isCustomerMsg, isSystemMsg) {

        var id = "liveMsgId" + (Math.random() * 100);

        var printOuterTimeStamp = document.createElement("div");
        var printTimeStamp = document.createElement("p");

        if (isCustomerMsg == true) {
            var msgDiv = `<div class=${msg_class.Outer}><div class= "msg-opacity govuk-body ${msg_class.Inner}" id=${id}></div></div>`;
            var printMessageSuffix = document.createElement("span");
            printMessageSuffix.className = "print-only print-float-right govuk-!-font-weight-bold govuk-body";
            printMessageSuffix.innerHTML = "You: ";

            printTimeStamp.className = "print-only govuk-body print-float-right print-timestamp-right";
        } else {
            if (isSystemMsg) {
                var msgDiv = `<div class= govuk-!-display-none-print ${msg_class.Outer}><div class= "msg-opacity govuk-body ${msg_class.Inner}" id=${id} aria-live=polite></div></div>`;
            } else {
                var msgDiv = `<div class=${msg_class.Outer}><div class= "msg-opacity govuk-body ${msg_class.Inner}" tabindex=-1 id=${id} aria-live=polite></div></div>`;
                var printMessageSuffix = document.createElement("span");
                printMessageSuffix.className = "print-only print-float-left govuk-!-font-weight-bold govuk-body";
                if (window.Agent_Name != null) {
                    printMessageSuffix.innerHTML = window.Agent_Name + ": ";
                } else {
                    printMessageSuffix.innerHTML = "HMRC: ";
                }

                printTimeStamp.className = "print-only govuk-body print-float-left";
            }
        }

        const skipToTop = document.getElementById("skipToTop");
        const chatContainer = document.getElementById("ciapiSkinChatTranscript");

        printOuterTimeStamp.className = "timestamp-outer"

        if (!isSystemMsg) {
            printTimeStamp.innerHTML = this.getPrintTimeStamp(msgTimestamp);
            printOuterTimeStamp.innerHTML = printMessageSuffix.outerHTML + msgDiv + printTimeStamp.outerHTML;
        } else {
            printOuterTimeStamp.innerHTML = msgDiv + printTimeStamp.outerHTML;
        }

        if (window.chatId) {
            document.getElementById("chat-id").innerHTML = window.chatId;
        }

        this.content.appendChild(printOuterTimeStamp);

        setTimeout(this.appendMessgeInLiveRegion, 300, msg, id, msg_type, false, this, msg_class, isSystemMsg);

        if (chatContainer) {

            if (skipToTop != null) {
                chatContainer.removeChild(skipToTop)
            }

            this.addSkipToBottomLink();
        }

    }

    _showLatestContent(msg_class) {
        const chatContainer = document.getElementById("ciapiSkinChatTranscript")
        const agentInner = msg_class.Inner;
        const innerClassArray = document.getElementsByClassName(agentInner);
        const outerAgent = msg_class.Outer;
        const outerClassArray = document.getElementsByClassName(outerAgent);

        if (innerClassArray.length > 0 && outerClassArray.length > 0) {
            const lengthOfAgentInnerArray = innerClassArray.length - 1;
            const heightOfLastMessage = innerClassArray[lengthOfAgentInnerArray].clientHeight;
            const outerAgentParentId = outerClassArray[0].parentElement;
            const heightOfSkinChat = outerAgentParentId.clientHeight;

            if (typeof heightOfLastMessage !== 'undefined' && typeof heightOfSkinChat !== 'undefined') {
                if (heightOfLastMessage > heightOfSkinChat) {
                    innerClassArray[lengthOfAgentInnerArray].scrollIntoView({ block: 'nearest' });
                } else {
                    chatContainer.scrollTo(0, chatContainer.scrollHeight, "smooth");
                }
            } else {
                chatContainer.scrollTo(0, chatContainer.scrollHeight, "smooth");
            }
        } else {
            chatContainer.scrollTo(0, chatContainer.scrollHeight, "smooth");
        }
    }
}