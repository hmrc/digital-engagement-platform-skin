import * as MessageState from '../NuanceMessageState';

function isJsonString(str) {
    console.log("This is the string we are checking is json : " + str )
   
    try {
        const result = JSON.parse(str);
        const type = Object.prototype.toString.call(result);
        return type === '[object Object]' 
            || type === '[object Array]';
    } catch (err) {
        return false;
    }
}

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

    appendMessgeInLiveRegion(msg, id, msg_type, isVirtualAssistance, that, msg_class, isSystemMsg, isCustomerMsg, isForm) {
        if (document.getElementById(id)) {
            if (that) {
                var msg = that.decodeHTMLEntities(msg);
            }

            if(isForm) {

                if(isJsonString(msg) === true) {

                    let formData = JSON.parse(msg);
                    
                    let label1 = formData.nodes[0].controls[0].label;

                    if(label1 === "First Name") {
                        let id1 = formData.nodes[0].controls[0].id;
                        let label2 = formData.nodes[0].controls[1].label;
                        let id2 = formData.nodes[0].controls[1].id;
                        let pegaFormButtonId1 = formData.nodes[0].controls[2].id;
                        let buttonText = formData.nodes[0].controls[2].text;
                        let displayText = formData.transitions[0].to.sendMessage.displayText;
                        

                        msg = `<div class="nuan-widget-outer-cont" style="height: 100%;">
                        <div tabindex="-1" class="nuan-widget-container nuan-mlr-1 nuan-p-1 form">
                            <div class="nuan-row input">
                                <fieldset class="govuk-fieldset">
                                    <label class="govuk-label govuk-label--m" for="${id1}" >${label1}</label>
                                    <div style="position:relative;"><input type="text" class="govuk-input" id="${id1}"><span class="validation-error-icon"></span></div>
                                </fieldset>
                            </div>
                            <div class="nuan-row input">
                                <fieldset class="govuk-fieldset">
                                    <label class="govuk-label govuk-label--m" for="${id2}">${label2}</label>
                                    <div style="position:relative;"><input type="text" class="govuk-input" id="${id2}"><span class="validation-error-icon"></span></div>
                                </fieldset>
                            </div>
                            <button data-module="govuk-button" data-prevent-double-click="true" id="${pegaFormButtonId1}" class="govuk-button nuanbtn nuanbtn-success nuanbtn-sm close"><span class="nuan-inline-block"><span data-id="${pegaFormButtonId1}" class="nuanbtn-text">${buttonText}</span></span></button></div>
                        </div>
                        </div>`

                        document.getElementById(id).innerHTML = "<div class=govuk-visually-hidden>" + msg_type + "</div> " + msg;
                        document.getElementById(id).classList.remove("msg-opacity");

                        document.getElementById("custMsg").disabled = true;
                        document.getElementById(id1).focus();

                        document.querySelector('#' + pegaFormButtonId1).addEventListener('click', (e) => {
                            let firstNameValue = document.getElementById(id1).value;
                            let familyNameValue = document.getElementById(id2).value;

                            let data =  {"firstName": "" + firstNameValue + "","familyName": "" + familyNameValue + "","displayText": "" + displayText + ""};
                            window.Inq.SDK.sendRichContentMessage(displayText, data, () => {});
                        });
                    } else {
                        let id1 = formData.nodes[0].controls[0].id;
                        let pegaFormButtonId2 = formData.nodes[0].controls[1].id;
                        let buttonText = formData.nodes[0].controls[1].text;
                        let displayText = formData.transitions[0].to.sendMessage.displayText;
                        msg = `<div class="nuan-widget-outer-cont" style="height: 100%;">
                        <div tabindex="-1" class="nuan-widget-container nuan-mlr-1 nuan-p-1 form">
                            <div class="nuan-row input">
                                <fieldset class="govuk-fieldset">
                                    <label class="govuk-label govuk-label--m" for="${id1}" >${label1}</label>
                                    <div style="position:relative;"><input type="text" class="govuk-input" id="${id1}"><span class="validation-error-icon"></span></div>
                                </fieldset>
                            </div>
                            <button data-module="govuk-button" data-prevent-double-click="true" id="${pegaFormButtonId2}" class="govuk-button nuanbtn nuanbtn-success nuanbtn-sm close"><span class="nuan-inline-block"><span data-id="${pegaFormButtonId2}" class="nuanbtn-text">${buttonText}</span></span></button></div>
                        </div>
                        </div>`

                        document.getElementById(id).innerHTML = "<div class=govuk-visually-hidden>" + msg_type + "</div> " + msg;
                        document.getElementById(id).classList.remove("msg-opacity");

                        let inputIds = document.querySelectorAll('#' + id1);
                        for( var inputCount = 0; inputCount < inputIds.length; inputCount ++) {
                            if(inputCount ===1) {
                                inputIds[inputCount].focus();
                            }
                        }

                        let submitIds = document.querySelectorAll('#' + pegaFormButtonId2);
                        var ninoValue = null;

                        for(var count = 0; count < submitIds.length;count++) {
                            if(count === 1) {
                                submitIds[count].addEventListener('click', (e) => {
                                    let inputIds = document.querySelectorAll('#' + id1);
                                    for( var count2 = 0; count2 < inputIds.length; count2 ++) {
                                        if(count2 === 1) {
                                            ninoValue = inputIds[count2].value;
                                        }
                                    }
                                    
                                    let data =  {"NINo": "" + ninoValue + "","displayText": "" + displayText + ""};
                                    window.Inq.SDK.sendRichContentMessage(displayText, data, () => {});
                                })
                            }
                        }
                    } 
                } else {
                    document.getElementById(id).innerHTML = "<div class=govuk-visually-hidden>" + msg_type + "</div> " + msg;
                    document.getElementById(id).classList.remove("msg-opacity");

                    document.getElementById("custMsg").disabled = false;
                }

            } else {
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

    addAutomatonMsg(msg, msgTimestamp, isForm = false) {

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

        printOuterTimeStamp.className = "timestamp-outer";
        printOuterTimeStamp.innerHTML = printMessageSuffix.outerHTML + agentDiv.outerHTML + printTimeStamp.outerHTML;

        this.content.appendChild(printOuterTimeStamp);

        setTimeout(this.appendMessgeInLiveRegion, 300, msg, id, this.automatedMsgPrefix, true, this, this.classes.Agent, false, false, isForm);

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
            var printMessageSuffix = document.createElement("span");
            printMessageSuffix.className = "print-only print-float-right govuk-!-font-weight-bold govuk-body";
            printMessageSuffix.innerHTML = "You: ";

            printTimeStamp.className = "print-only govuk-body print-float-right print-timestamp-right";

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

        printOuterTimeStamp.classList.add("timestamp-outer");

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

        setTimeout(this.appendMessgeInLiveRegion, 300, msg, id, msg_type, false, this, msg_class, isSystemMsg, isCustomerMsg);

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
