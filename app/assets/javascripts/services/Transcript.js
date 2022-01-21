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
        if(document.getElementsByClassName("cui-technical-error")) {
            document.getElementsByClassName("cui-technical-error").style.display = "none";
        }
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


    appendMessgeInLiveRegion(msg, id, msg_type, isVirtualAssistance, that){
        if(document.getElementById(id)){
              if(that){
                  var msg = that.decodeHTMLEntities(msg);
              }

              document.getElementById(id).innerHTML = "<p class=govuk-visually-hidden>" + msg_type + "</p> " + msg;
              document.getElementById(id).classList.remove("govuk-visually-hidden");
        }
        if(isVirtualAssistance == true){
              document.getElementById(id).focus();
        }
    }

    addAutomatonMsg(msg) {

        var id = "liveAutomatedMsgId" + ( Math.random() * 100);
        const msgDiv = `<div class= "govuk-visually-hidden ${this.classes.Agent.Inner}" tabindex=-1 id=${id} aria-live=polite></div>`;

        const skipToTop = document.getElementById("skipToTop");
        const chatContainer = document.getElementById("ciapiSkinChatTranscript")

        let agentDiv = document.createElement("div")
        agentDiv.classList.add(this.classes.Agent.Outer);
        agentDiv.insertAdjacentHTML("beforeend", msgDiv);

        this._fixUpVALinks(agentDiv);

        this.content.appendChild(agentDiv);

        setTimeout(this.appendMessgeInLiveRegion, 300, msg, id, this.automatedMsgPrefix, true, this);


        if (chatContainer) {

            if (skipToTop != null) {
                chatContainer.removeChild(skipToTop)
            }

            this.addSkipToBottomLink();

        }
        this._showLatestContent(this.classes.Agent);
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

    _appendMessage(msg, msg_class, msg_type, isCustomerMsg) {

        var id = "liveMsgId" + ( Math.random() * 100);

        if(isCustomerMsg == true){
                var msgDiv = `<div class=${msg_class.Outer}><div class= "govuk-visually-hidden ${msg_class.Inner}" id=${id}></div></div>`;
        }
        else{
                var msgDiv = `<div class=${msg_class.Outer}><div class= "govuk-visually-hidden ${msg_class.Inner}" id=${id} aria-live=polite></div></div>`;
        }

        const skipToTop = document.getElementById("skipToTop");
        const chatContainer = document.getElementById("ciapiSkinChatTranscript")

        this.content.insertAdjacentHTML("beforeend", msgDiv);

        setTimeout(this.appendMessgeInLiveRegion, 300, msg, id, msg_type, false, this);

        if (chatContainer) {

            if (skipToTop != null) {
                chatContainer.removeChild(skipToTop)
            }

            this.addSkipToBottomLink();

        }

        this._showLatestContent(msg_class);
    }

    _showLatestContent(msg_class) {
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
                    this.content.scrollTo(0, this.content.scrollHeight);
                }
            } else {
                this.content.scrollTo(0, this.content.scrollHeight);
            }
        } else {
            this.content.scrollTo(0, this.content.scrollHeight);
        }
    }
}
