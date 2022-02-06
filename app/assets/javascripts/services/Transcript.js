export default class Transcript {
    constructor(content, vaLinkCallback, classes, msgPrefix) {
        this.content = content;
        this.vaLinkCallback = vaLinkCallback;
        this.classes = classes;
        this.agentMsgPrefix  = "Adviser said : ";
        this.customerMsgPrefix = "You said : ";
        this.systemMsgPrefix = "System message : ";
        this.automatedMsgPrefix = "Automated message : ";
    }

    addAgentMsg(msg, agent) {
        this._appendMessage(msg, this.classes.Agent, this.agentMsgPrefix, false);
    }

    addCustomerMsg(msg, agent) {
        this._appendMessage(msg, this.classes.Customer, this.customerMsgPrefix, true);
    }

    addSystemMsg(msg) {
        this._appendMessage(msg, this.classes.System, this.systemMsgPrefix, false);
    }

    addOpenerScript(msg) {
        this._appendMessage(msg, this.classes.Opener, this.automatedMsgPrefix, false);
    }

    addSkipToBottomLink() {
        const chatContainer = document.getElementById("ciapiSkinChatTranscript")

        if (chatContainer.scrollHeight > chatContainer.clientHeight) {
            this.createSkipLink("skipToTopWithScroll");
        }
        else {
            this.createSkipLink("skipToTopWithOutScroll");
        }

    }

    createSkipLink(className) {

        const chatContainer = document.getElementById("ciapiSkinChatTranscript")

        chatContainer.insertAdjacentHTML("beforeend", '<div id="skipToTop" class="' + className + ' govuk-!-padding-top-2"><a id="skipToTopLink" href="#" class="govuk-skip-link">Skip to top of conversation</a></div>');
        document.getElementById("skipToTopLink").addEventListener("click",
            function (e) {
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
            text = text.replace(new RegExp('&'+entities[i][0]+';', 'g'), entities[i][1]);

        return text;
    }


    appendMessgeInLiveRegion(msg, id, msg_type, isVirtualAssistance, that, msg_class){
        if(document.getElementById(id)){
              if(that){
                  var msg = that.decodeHTMLEntities(msg);
              }

              document.getElementById(id).innerHTML = "<p class=govuk-visually-hidden>" + msg_type + "</p> " + msg;
              document.getElementById(id).classList.remove("msg-opacity");
        }
        if(isVirtualAssistance == true){
              document.getElementById(id).focus();
        }
        if(that){
              that._showLatestContent(msg_class);
        }
    }

    addAutomatonMsg(msg) {

        var id = "liveAutomatedMsgId" + ( Math.random() * 100);
        const msgDiv = `<div class= "msg-opacity ${this.classes.Agent.Inner}" tabindex=-1 id=${id} aria-live=polite></div>`;

        const skipToTop = document.getElementById("skipToTop");
        const chatContainer = document.getElementById("ciapiSkinChatTranscript")

        let agentDiv = document.createElement("div")
        agentDiv.classList.add(this.classes.Agent.Outer);
        agentDiv.insertAdjacentHTML("beforeend", msgDiv);


        let printMessageSuffix = document.createElement("span");
        printMessageSuffix.className = "float-left";
        printMessageSuffix.innerHTML = "HMRC: "

        this._fixUpVALinks(agentDiv);

        this.content.appendChild(printMessageSuffix);

        this.content.appendChild(agentDiv);

        setTimeout(this.appendMessgeInLiveRegion, 300, msg, id, this.automatedMsgPrefix, true, this, this.classes.Agent);


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

        var id = "liveMsgId" + ( Math.random() * 100);

        var printTimeStamp = document.createElement("p");

        if(isCustomerMsg == true){
                var msgDiv = `<div class=${msg_class.Outer}><div class= "msg-opacity ${msg_class.Inner}" id=${id}></div></div>`;
                var printMessageSuffix = document.createElement("span");
                printMessageSuffix.className = "print-only print-float-right govuk-!-font-weight-bold";
                printMessageSuffix.innerHTML = "You: ";

                printTimeStamp.className = "print-only print-float-right print-timestamp-right";
        }
        else{
            if(isSystemMsg){
                var msgDiv = `<div class= govuk-!-display-none-print ${msg_class.Outer}><div class= "msg-opacity ${msg_class.Inner}" id=${id} tabindex=-1 aria-live=polite></div></div>`;
            }
            else{
                var msgDiv = `<div class=${msg_class.Outer}><div class= "govuk-visually-hidden ${msg_class.Inner}" id=${id} aria-live=polite></div></div>`;
                var printMessageSuffix = document.createElement("span");
                printMessageSuffix.className = "print-only print-float-left govuk-!-font-weight-bold";
                if(window.Agent_Name != null){
                    printMessageSuffix.innerHTML = window.Agent_Name + ": ";
                }
                else{
                    printMessageSuffix.innerHTML = "HMRC: ";
                }

                printTimeStamp.className = "print-only print-float-left";
            }
        }

        const skipToTop = document.getElementById("skipToTop");
        const chatContainer = document.getElementById("ciapiSkinChatTranscript");

        if(!isSystemMsg)
        {
            printTimeStamp.innerHTML = this.getPrintTimeStamp(msgTimestamp);
            this.content.appendChild(printMessageSuffix);
        }

        if(window.chatId){
            document.getElementById("chat-id").innerHTML = window.chatId ;
        }


        this.content.insertAdjacentHTML("beforeend", msgDiv);

        this.content.appendChild(printTimeStamp);

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
