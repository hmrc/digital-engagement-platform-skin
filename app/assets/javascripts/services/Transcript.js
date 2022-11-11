import * as MessageState from '../NuanceMessageState';

export default class Transcript {
    constructor(content, classes, msgPrefix) {
        this.content = content;
        this.classes = classes;
        this.agentMsgPrefix = "<h3>Adviser said : </h3>";
        this.customerMsgPrefix = "<h2>You said : </h2>";
        this.systemMsgPrefix = "<h3>System message : </h3>";
        this.automatedMsgPrefix = "<h3>Automated message : </h3>";
    }

    addAgentMsg(msg, msgTimestamp, agent) {
        this._appendMessage(msg, msgTimestamp, this.classes.Agent, this.agentMsgPrefix, false, false);
    }

    addCustomerMsg(msg, msgTimestamp, agent) {
        this._appendMessage(msg, msgTimestamp, this.classes.Customer, this.customerMsgPrefix, true, false);
    }

    addSystemMsg(msgObject) {
        if (msgObject.msg === undefined) msgObject.msg = "";
        if (msgObject.state === undefined) msgObject.state = "";
        if (msgObject.joinTransfer === undefined) msgObject.joinTransfer = "";

        this._appendMessage(msgObject.msg, "", this.classes.System, this.systemMsgPrefix, false, true, msgObject.state, msgObject.joinTransfer);
    }

    addOpenerScript(msg) {

        let openerScriptTimestamp = new Date().getTime();

        if (sessionStorage.getItem("openerScriptTimestamp") == null) {
            sessionStorage.setItem("openerScriptTimestamp", openerScriptTimestamp);
        }

        openerScriptTimestamp = sessionStorage.getItem("openerScriptTimestamp");

        this._appendMessage(msg, openerScriptTimestamp, this.classes.Opener, this.automatedMsgPrefix, false, false);
    }

    addSkipToBottomLink() {
        const chatContainer = document.getElementById("ciapiSkinChatTranscript");

        if (chatContainer.scrollHeight > chatContainer.clientHeight) {
            this.createSkipLink("skipToTopWithScroll");
        } else {
            this.createSkipLink("skipToTopWithOutScroll");
        }
    }

    createSkipLink(className) {

        const chatContainer = document.getElementById("ciapiSkinChatTranscript");

        chatContainer.insertAdjacentHTML("beforeend", '<div id="skipToTop" class="' + className + ' govuk-!-padding-top-2"><a id="skipToTopLink" href="#" class="govuk-skip-link">Skip to top of conversation</a></div>');
        document.getElementById("skipToTopLink").addEventListener("click",
        function(e) {
            e.preventDefault();
            document.getElementById("skipToBottomLink").focus();
        });
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

    appendMessageInLiveRegion(msg, id, msg_type, isVirtualAssistance, that, msg_class, isSystemMsg, isCustomerMsg) {
        if (document.getElementById(id)) {
            if (that) {
                var msg = that.decodeHTMLEntities(msg);
            }

            document.getElementById(id).innerHTML = "<div class=govuk-visually-hidden>" + msg_type + "</div> " + msg;
            document.getElementById(id).classList.remove("msg-opacity");
        }
        if (that) {
            that._showLatestContent(msg_class);
        }

        if(isCustomerMsg){
            if (that) {
                that._addPaddingToCustomerMsg(id);
            }
        }
    }

    _addPaddingToCustomerMsg(id) {
        var lastCustomerMessageHeight = document.getElementById(id).offsetHeight;

        var customerContainer = document.getElementsByClassName("ciapi-customer-container");

        var i;
        for (i = 0; i < customerContainer.length; i++) {
            if (i == (customerContainer.length - 1)) {
                customerContainer[i].style.paddingBottom = (lastCustomerMessageHeight + 25) + 'px';
            }
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

    _getTimestampPrefix(msgTimestamp) {
        let timestampPrefix = document.createElement("span");

        timestampPrefix.className = "govuk-visually-hidden";
        timestampPrefix.innerHTML = this.getPrintTimeStamp(msgTimestamp);

        return timestampPrefix.outerHTML;
    }

    addAutomatonMsg(automatonData, msgTimestamp) {
        var id = "liveAutomatedMsgId" + (Math.random() * 100);
        const msgDiv = `<div class= "msg-opacity govuk-body ${this.classes.Agent.Inner}" tabindex=-1 id=${id}></div>`;

        const skipToTop = document.getElementById("skipToTop");
        const chatContainer = document.getElementById("ciapiSkinChatTranscript")

        var agentDiv = document.createElement("div")
        agentDiv.classList.add(this.classes.Agent.Outer);
        agentDiv.insertAdjacentHTML("beforeend", msgDiv);
        agentDiv.setAttribute('aria-live', 'polite');

        var printMessageSuffix = document.createElement("h2");
        printMessageSuffix.className = "print-only print-float-left govuk-!-font-weight-bold govuk-body";
		if (window.Agent_Name != null) {
			printMessageSuffix.innerHTML = window.Agent_Name + " said: ";
		} else {
			printMessageSuffix.innerHTML = "HMRC said: ";
		}

        var printOuterTimeStamp = document.createElement("div");

        var printTimeStamp = document.createElement("p");
        printTimeStamp.className = "print-only govuk-body print-float-left";
        printTimeStamp.innerHTML = this.getPrintTimeStamp(msgTimestamp);

        printOuterTimeStamp.className = "timestamp-outer";
        printOuterTimeStamp.innerHTML =  this._getTimestampPrefix(msgTimestamp) + printMessageSuffix.outerHTML + agentDiv.outerHTML + printTimeStamp.outerHTML;

        this.content.appendChild(printOuterTimeStamp);

        setTimeout(this.appendMessageInLiveRegion, 300, automatonData, id, this.automatedMsgPrefix, true, this, this.classes.Agent, false, false);

        if (chatContainer) {

            if (skipToTop != null) {
                chatContainer.removeChild(skipToTop);
            }

            this.addSkipToBottomLink();
        }
    }

    _appendMessage(msg, msgTimestamp, msg_class, msg_type, isCustomerMsg, isSystemMsg, state, joinTransfer) {

        var id = "liveMsgId" + (Math.random() * 100);

        var printOuterTimeStamp = document.createElement("div");
        var printTimeStamp = document.createElement("p");

        if (isCustomerMsg == true) {
            var msgDiv = `<div class=${msg_class.Outer}><div class= "msg-opacity govuk-body ${msg_class.Inner}" id=${id}></div></div>`;
            var printMessageSuffix = document.createElement("h2");
            printMessageSuffix.className = "print-only print-float-right govuk-!-font-weight-bold govuk-body";
            printMessageSuffix.innerHTML = "You said: ";

            printTimeStamp.className = "print-only govuk-body print-float-right print-timestamp-right";
            printTimeStamp.setAttribute('aria-hidden', 'true');

        } else {
            if (isSystemMsg) {
                if(state == MessageState.Agent_IsTyping) {
                    printOuterTimeStamp.classList.add("agent-typing");
                    var msgDiv = `<div class= govuk-!-display-none-print ${msg_class.Outer}><div class= "msg-opacity govuk-body ${msg_class.Inner}" id=${id} aria-live=polite></div></div>`;
                } else {
                    if (joinTransfer == "true") {
                        printOuterTimeStamp.classList.add("agent-joins-conference");
                    }
                    var msgDiv = `<div class= govuk-!-display-none-print ${msg_class.Outer}><div class= "msg-opacity govuk-body ${msg_class.Inner}" id=${id} aria-live=polite></div></div>`;
                }
            } else {
                var msgDiv = `<div class=${msg_class.Outer}><div class= "msg-opacity govuk-body ${msg_class.Inner}" tabindex=-1 id=${id} aria-live=polite></div></div>`;

                var printMessageSuffix = document.createElement("h3");
                printMessageSuffix.className = "print-only print-float-left govuk-!-font-weight-bold govuk-body";
                if (window.Agent_Name != null) {
                    printMessageSuffix.innerHTML = window.Agent_Name + " said: ";
                } else {
                    printMessageSuffix.innerHTML = "HMRC said: ";
                }

                printTimeStamp.className = "print-only govuk-body print-float-left";
                printTimeStamp.setAttribute('aria-hidden', 'true');
            }
        }

        const skipToTop = document.getElementById("skipToTop");
        const chatContainer = document.getElementById("ciapiSkinChatTranscript");

        printOuterTimeStamp.classList.add("timestamp-outer");

        if (!isSystemMsg) {
            printTimeStamp.innerHTML = this.getPrintTimeStamp(msgTimestamp);
            printOuterTimeStamp.innerHTML = this._getTimestampPrefix(msgTimestamp) + printMessageSuffix.outerHTML + msgDiv + printTimeStamp.outerHTML;
        } else {
            printOuterTimeStamp.innerHTML = this._getTimestampPrefix(msgTimestamp) + msgDiv + printTimeStamp.outerHTML;
        }

        if (window.chatId) {
            document.getElementById("chat-id").innerHTML = window.chatId;
        }

        this.content.appendChild(printOuterTimeStamp);

        setTimeout(this.appendMessageInLiveRegion, 300, msg, id, msg_type, false, this, msg_class, isSystemMsg, isCustomerMsg);

        if (chatContainer) {

            if (skipToTop != null) {
                chatContainer.removeChild(skipToTop);
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
                    chatContainer.scrollTo({ top: chatContainer.scrollHeight, left: 0, behavior: "smooth" });
                }
            } else {
                chatContainer.scrollTo({ top: chatContainer.scrollHeight, left: 0, behavior: "smooth" });
            }
        } else {
            chatContainer.scrollTo({ top: chatContainer.scrollHeight, left: 0, behavior: "smooth" });
        }
    }
}
