import * as MessageState from '../NuanceMessageState';
import * as logger from '../utils/logger';
import { messages } from '../utils/Messages';

export default class Transcript {
    constructor(content, classes, msgPrefix) {
        this.content = content;
        this.classes = classes;
        this.agentMsgPrefix = messages.agentMsgPrefix;
        this.customerMsgPrefix = messages.customerMsgPrefix;
        this.systemMsgPrefix = messages.systemMsgPrefix;
        this.automatedMsgPrefix = messages.automatedMsgPrefix;
    }

    addAgentMsg(msg, msgTimestamp, agent) {
        this._appendMessage(msg, msgTimestamp, this.classes.Agent, this._getMsgTimestampPrefix(msgTimestamp, this.agentMsgPrefix, "h3"), false, false);
    }

    addCustomerMsg(msg, msgTimestamp, agent) {
        this._appendMessage(msg, msgTimestamp, this.classes.Customer, this._getMsgTimestampPrefix(msgTimestamp, this.customerMsgPrefix, "h2"), true, false);
    }

    _addPaddingToCustomerMsg(id) {
        const lastCustomerMessageHeight = document.getElementById(id).offsetHeight;

        let customerContainer = document.getElementsByClassName("ciapi-customer-container");

        for (let i = 0; i < customerContainer.length; i++) {
            if (i == (customerContainer.length - 1)) {
                customerContainer[i].style.paddingBottom = (lastCustomerMessageHeight + 25) + 'px';
            }
        }
    }

    addSystemMsg(msgObject, msgTimestamp) {
        if (msgObject.msg === undefined) msgObject.msg = "";
        if (msgObject.state === undefined) msgObject.state = "";
        if (msgObject.joinTransfer === undefined) msgObject.joinTransfer = "";

        this._appendMessage(msgObject.msg, "", this.classes.System, this._getMsgTimestampPrefix(msgTimestamp, this.systemMsgPrefix, "h3"), false, true, msgObject.state, msgObject.joinTransfer);
    }

    addOpenerScript(msg) {

        let openerScriptTimestamp = new Date().getTime();

        if (sessionStorage.getItem("openerScriptTimestamp") == null) {
            sessionStorage.setItem("openerScriptTimestamp", openerScriptTimestamp);
        }

        openerScriptTimestamp = sessionStorage.getItem("openerScriptTimestamp");

        this._appendMessage(msg, openerScriptTimestamp, this.classes.Opener, this._getMsgTimestampPrefix(openerScriptTimestamp, this.automatedMsgPrefix, "h3"), false, false);
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

        for (var i = 0, max = entities.length; i < max; ++i) {
            text = text.replace(new RegExp('&' + entities[i][0] + ';', 'g'), entities[i][1]);
        }

        return text;
    }

    appendMessageInLiveRegion(msg, id, msg_type, isVirtualAssistance, that, msg_class, isSystemMsg, isCustomerMsg, isQuickReply) {
        if (document.getElementById(id)) {
            if (isQuickReply) {
                document.getElementById(id).append(msg);
                document.getElementById(id).classList.remove("msg-opacity");
            } else {
                if (that) {
                    var msg = that.decodeHTMLEntities(msg);
                }

                document.getElementById(id).innerHTML = "<div class=govuk-visually-hidden>" + msg_type + "</div> " + msg;
                document.getElementById(id).classList.remove("msg-opacity");
            }
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

    addAutomatonMsg(automatonData, msgTimestamp, isQuickReply) {
        var id = "liveAutomatedMsgId" + (Math.random() * 100);
        const msgDiv = `<div class= "msg-opacity govuk-body ${this.classes.Agent.Inner}" tabindex=-1 id=${id}></div>`;

        const skipToTop = document.getElementById("skipToTop");
        const chatContainer = document.getElementById("ciapiSkinChatTranscript")
        const popupChatContainer = document.getElementsByClassName("ci-api-popup");

        var agentDiv = document.createElement("div")
        agentDiv.classList.add(this.classes.Agent.Outer);
        agentDiv.insertAdjacentHTML("beforeend", msgDiv);
        agentDiv.setAttribute('aria-live', 'polite');

        var printMessageSuffix = document.createElement("h2");

        if (popupChatContainer.length > 0) {
          printMessageSuffix.className = "print-only popup-print-float-left govuk-!-font-weight-bold govuk-body";
        } else {
          printMessageSuffix.className = "print-only print-float-left govuk-!-font-weight-bold govuk-body";
        }

		if (window.Agent_Name != null) {
			printMessageSuffix.innerHTML = window.Agent_Name + " said: ";
		} else {
			printMessageSuffix.innerHTML = "HMRC said: ";
		}

        var printOuterTimeStamp = document.createElement("div");

        var printTimeStamp = document.createElement("p");

        if (popupChatContainer.length > 0) {
          printTimeStamp.className = "print-only govuk-body popup-print-float-left";
        } else {
          printTimeStamp.className = "print-only govuk-body print-float-left";
        }

        printTimeStamp.innerHTML = this.getPrintTimeStamp(msgTimestamp);

        printOuterTimeStamp.className = "timestamp-outer";
        printOuterTimeStamp.innerHTML =  this._getTimestampPrefix(msgTimestamp) + printMessageSuffix.outerHTML + agentDiv.outerHTML + printTimeStamp.outerHTML;

        this.content.appendChild(printOuterTimeStamp);

        setTimeout(this.appendMessageInLiveRegion, 300, automatonData, id, this._getMsgTimestampPrefix(msgTimestamp, this.automatedMsgPrefix, "h3"), true, this, this.classes.Agent, false, false, isQuickReply);

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
        const popupChatContainer = document.getElementsByClassName("ci-api-popup");

        if (isCustomerMsg == true) {
            var msgDiv = `<div class=${msg_class.Outer}><div class= "msg-opacity govuk-body ${msg_class.Inner}" id=${id}></div></div>`;
            var printMessageSuffix = document.createElement("h2");

            if (popupChatContainer.length > 0) {
              printMessageSuffix.className = "print-only popup-print-float-right govuk-!-font-weight-bold govuk-body";
            } else {
              printMessageSuffix.className = "print-only print-float-right govuk-!-font-weight-bold govuk-body";
            }

            printMessageSuffix.innerHTML = "You said: ";

            if (popupChatContainer.length > 0) {
              printTimeStamp.className = "print-only govuk-body popup-print-float-right print-timestamp-right";
            } else {
              printTimeStamp.className = "print-only govuk-body print-float-right print-timestamp-right";
            }

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
                if (popupChatContainer.length > 0) {
                  printMessageSuffix.className = "print-only popup-print-float-left govuk-!-font-weight-bold govuk-body";
                } else {
                  printMessageSuffix.className = "print-only print-float-left govuk-!-font-weight-bold govuk-body";
                }
                printMessageSuffix.className = "print-only print-float-left govuk-!-font-weight-bold govuk-body";
                if (window.Agent_Name != null) {
                    printMessageSuffix.innerHTML = window.Agent_Name + " said: ";
                } else {
                    printMessageSuffix.innerHTML = "HMRC said: ";
                }

                if (popupChatContainer.length > 0) {
                  printTimeStamp.className = "print-only govuk-body popup-print-float-left";
                } else {
                  printTimeStamp.className = "print-only govuk-body print-float-left";
                }
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

    addQuickReply(quickReplyData, messageText, messageTimestamp) {
        try {
            if (!quickReplyData.nodes) return null;

            let divContainer = document.createElement("div");
            divContainer.innerHTML = messageText;

            let initialNode = quickReplyData.nodes[0];

            // Render first node
            let nodeContainer = document.createElement("div");
            nodeContainer.classList.add(initialNode.id);

            let renderedControl;
            let divContainerQrw;

            if(messageText.includes('<ul class="quick-reply-widget"')) {
                divContainerQrw = divContainer.getElementsByClassName("quick-reply-widget")[0]
                divContainerQrw.disable = function() {
                    let links = this.querySelectorAll('a[href="#"]');
                    links.forEach(link => link.parentElement.innerText = link.text);
                }
            }
            for(let i = 0; i < Object.keys(initialNode.controls).length; i++) {
                let control = initialNode.controls[i];

                switch (control.type) {
                    case "QuickReplyButton":
                        if(messageText.includes('<ul class="quick-reply-widget"')) {
                            divContainerQrw.append(...this.createQuickReplyButtonAsLinks(initialNode, control, messageText));
                        } else {
                            renderedControl = this.createQuickReplyButtonAsLinks(initialNode, control, messageText);
                        }
                    break;
                }
            }

            if(!messageText.includes('<ul class="quick-reply-widget"')) {
                divContainer.append(renderedControl);
            }

            if (!!quickReplyData.transitions) {
                let quickReplyWidget = divContainer.getElementsByClassName("quick-reply-widget")[0]
                quickReplyWidget.transitions = quickReplyData.transitions;
                quickReplyWidget.addEventListener('click', this.handleRichMediaClickEvent);
            }

            const isQuickReply = true;

            this.addAutomatonMsg(divContainer, messageTimestamp, isQuickReply);
        } catch(e) {
            logger.error('quickReplayError',e);
            return null;
        }
    }

    createQuickReplyButtonAsLinks(node, controlData, messageText) {
        let qrContainer = document.createElement("ul");
        qrContainer.classList.add('quick-reply-widget');

        qrContainer.disable = function() {
            let links = this.querySelectorAll('a[href="#"]');
            links.forEach(link => link.parentElement.innerText = link.text);
        }

        const buttonElements = controlData.text.map((text,idx) => {
            let listItemEl = document.createElement("li");
            let linkEl = document.createElement("a");
            linkEl.href = '#';

            let prefix = `#${node.id}.${controlData.id}`;

            linkEl.richMediaContext = {
                [`${prefix}.selectedIndex`]: idx,
                [`${prefix}.selectedText`]: text,
                [`${prefix}.selectedValue`]: controlData.values[idx],
                'event': controlData.event.name,
                'node': node.id,
            }
            linkEl.innerText = text;
            listItemEl.append(linkEl);
            return listItemEl;
        })

        if(messageText.includes('<ul class="quick-reply-widget"')) {
            return buttonElements;
        } else {
            qrContainer.append(...buttonElements);
            return qrContainer;
        }
    }

    handleRichMediaClickEvent(event) {
        event.preventDefault();

        let targetEl = event.target;
        let targetElContext = targetEl.richMediaContext;
        if(!targetElContext) return;

        let transition =
            this
            .transitions
            .find(transition => transition.from == targetElContext.node && transition.trigger == targetElContext.event);

        if (!!transition.to && !!transition.to.sendMessage) {
            let datapassDef = transition.to.sendMessage;

            let richContentMessageData = {};

            Object.entries(datapassDef).forEach(([key, value], index) => {
                richContentMessageData[key] = (value.substr(0,1) == '#') ? targetElContext[value] : value;
            });


            Inq.SDK.sendRichContentMessage(richContentMessageData.displayText, richContentMessageData);
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


    getPrintTimeStamp(msgTimestamp) {
        let strTime = "";

        if (msgTimestamp != "") {

            const date = new Date(parseInt(msgTimestamp));

            let hours = date.getHours();
            let minutes = date.getMinutes();
            let ampm = hours >= 12 ? 'PM' : 'AM';
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

    _getMsgTimestampPrefix(msgTimestamp, prefix, hTag) {
            let msgTimestampPrefix = document.createElement(hTag);

            msgTimestampPrefix.innerHTML = this.getPrintTimeStamp(msgTimestamp) + prefix;

            return msgTimestampPrefix.outerHTML;
    }
}
