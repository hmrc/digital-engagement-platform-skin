import * as MessageState from '../NuanceMessageState';
import * as logger from '../utils/logger';
import { messages } from '../utils/Messages';
import { Agent, Customer, System, Opener } from '../DefaultClasses';

type Classes = typeof import("../DefaultClasses");

type DefaultClassesType = typeof Agent | typeof Customer | typeof System | typeof Opener
export default class Transcript {
    content: HTMLElement | null;
    classes: Classes;
    agentMsgPrefix: string;
    customerMsgPrefix: string;
    systemMsgPrefix: string;
    automatedMsgPrefix: string;
    transitions: any
    // James - This is set to any but relates to a comment below in handleRichMediaClickEvent and is explained there.

    constructor(content: HTMLElement | null, classes: Classes, msgPrefix: undefined) {
        // James - msgPrefix is declared but the value is never read. Can we delete it?
        this.content = content;
        this.classes = classes;
        this.agentMsgPrefix = messages.agentMsgPrefix;
        this.customerMsgPrefix = messages.customerMsgPrefix;
        this.systemMsgPrefix = messages.systemMsgPrefix;
        this.automatedMsgPrefix = messages.automatedMsgPrefix;
    }

    addAgentMsg(msg: string, msgTimestamp: string, agent?: undefined): void {
        // James - agent is declared but the value is not read. Should we remove it?
        this._appendMessage(msg, msgTimestamp, this.classes.Agent, this._getMsgTimestampPrefix(msgTimestamp, this.agentMsgPrefix, "h3"), false, false);
    }

    addCustomerMsg(msg: string, msgTimestamp: string, agent?: undefined): void {
        // James - agent is declared but the value is not read. Should we remove it?
        this._appendMessage(msg, msgTimestamp, this.classes.Customer, this._getMsgTimestampPrefix(msgTimestamp, this.customerMsgPrefix, "h2"), true, false);
    }

    _addPaddingToCustomerMsg(id: string): void {

        if (!document.getElementById(id)) {
            return;
        }

        const lastCustomerMessageHeight: number | undefined = document.getElementById(id)!.offsetHeight;

        let customerContainer: HTMLCollectionOf<Element> = document.getElementsByClassName("ciapi-customer-container");

        for (let i: number = 0; i < customerContainer.length; i++) {
            if (i == (customerContainer.length - 1)) {
                (customerContainer[i] as HTMLDivElement).style.paddingBottom = (lastCustomerMessageHeight + 25) + 'px';
            }
        }
    }
    // James - The issue is around lastCustomerMessageHeight being null within the if statement. I cannot easily get around this. My understanding is that 'id' comes from Nuance so I cannot tell if it will ever be undefined. My assumption is that it may. Possible options:
    // 1) I have added an if statement to return early if it is null and used the bang on lastCustomerMessageHeight to tell it that it will always be there otherwise it would have returned. The last bit of code in the loop and conditional requires this variable so I think it is fine to have an early return otherwise.
    // 2) We can get rid of the early return and use (lastCustomerMessageHeight || 0 + 25) + 'px' but this will give us 25px if it is undefined. This may be unexpected behaviour. 
    // What do you think?

    addSystemMsg(msgObject: { msg: string | undefined; joinTransfer?: string | undefined; state?: string | undefined }, msgTimestamp: string | undefined): void {
        if (msgObject.msg === undefined) msgObject.msg = "";
        if (msgObject.state === undefined) msgObject.state = "";
        if (msgObject.joinTransfer === undefined) msgObject.joinTransfer = "";

        if (msgTimestamp) {
            this._appendMessage(msgObject.msg, "", this.classes.System, this._getMsgTimestampPrefix(msgTimestamp, this.systemMsgPrefix, "h3"), false, true, msgObject.state, msgObject.joinTransfer);
        }
    }

    addOpenerScript(msg: string): void {

        let openerScriptTimestamp: string = String(new Date().getTime());

        if (sessionStorage.getItem("openerScriptTimestamp") == null) {
            sessionStorage.setItem("openerScriptTimestamp", openerScriptTimestamp);
        }

        openerScriptTimestamp = sessionStorage.getItem("openerScriptTimestamp")!;

        this._appendMessage(msg, openerScriptTimestamp, this.classes.Opener, this._getMsgTimestampPrefix(openerScriptTimestamp, this.automatedMsgPrefix, "h3"), false, false);
    }

    addSkipToBottomLink(): void {
        const chatContainer: HTMLElement | null = document.getElementById("ciapiSkinChatTranscript");

        if (chatContainer && chatContainer.scrollHeight > chatContainer.clientHeight) {
            this.createSkipLink("skipToTopWithScroll");
        } else {
            this.createSkipLink("skipToTopWithOutScroll");
        }
    }
    // I have added chatContainer to the if statement and the && to check that it is truthy. I do not think it changes the behaviour of the conditional but I would be grateful if you could double check please? I did this to get rid of the errors stating that chatContainer could be null. If you do not like this method, I could probably use the ! after the chatContainer variable because we know the element is in the HTML.

    createSkipLink(className: string): void {

        const chatContainer: HTMLElement | null = document.getElementById("ciapiSkinChatTranscript");

        chatContainer?.insertAdjacentHTML("beforeend", '<div id="skipToTop" class="' + className + ' govuk-!-padding-top-2"><a id="skipToTopLink" href="#" class="govuk-skip-link">Skip to top of conversation</a></div>');
        document.getElementById("skipToTopLink")?.addEventListener("click",
            function (e: MouseEvent): void {
                e.preventDefault();
                document.getElementById("skipToBottomLink")?.focus();
            });
    }

    decodeHTMLEntities(text: string): string {

        var entities: string[][] = [
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

        for (var i: number = 0, max: number = entities.length; i < max; ++i) {
            text = text.replace(new RegExp('&' + entities[i][0] + ';', 'g'), entities[i][1]);
        }

        return text;
    }

    appendMessageInLiveRegion(msg: string, id: string, msg_type: string, isVirtualAssistance: undefined, that: any, msg_class: DefaultClassesType, isSystemMsg: undefined, isCustomerMsg: boolean, isQuickReply: boolean | undefined): void {
        if (document.getElementById(id)) {
            let idElement = document.getElementById(id)
            if (isQuickReply && idElement) {
                idElement.append(msg);
                idElement.classList.remove("msg-opacity");
            } else {
                if (that) {
                    var msg: string = that.decodeHTMLEntities(msg);
                }
                if (idElement) {
                    idElement.innerHTML = "<div class=govuk-visually-hidden>" + msg_type + "</div> " + msg;
                    idElement.classList.remove("msg-opacity");
                }
            }
        }

        if (that) {
            that._showLatestContent(msg_class);
        }

        if (isCustomerMsg) {
            if (that) {
                that._addPaddingToCustomerMsg(id);
            }
        }
    }
    //I am not sure what the type of that is, do you have any ideas? In the console it is showing a complex object and I did not think the inference was right.

    // Please can I check whether you think I have typed message class correctly? The inference said it was any but in the console it looked like it should be defaultClasses although I have not specified which parts it is. From the console it looked like agent, customer, opener although it is difficult to tell. 

    // Can isVirtualAssistance and isSystemMsg be removed? They are declared but never read.

    // Had to do a bit of a refactor of the code, are you happy that functionality is the same?

    addAutomatonMsg(automatonData: string | HTMLDivElement, msgTimestamp: string, isQuickReply?: boolean): void {
        var id: string = "liveAutomatedMsgId" + (Math.random() * 100);
        const msgDiv: string = `<div class= "msg-opacity govuk-body ${this.classes.Agent.Inner}" tabindex=-1 id=${id}></div>`;

        const skipToTop: HTMLElement | null = document.getElementById("skipToTop");
        const chatContainer: HTMLElement | null = document.getElementById("ciapiSkinChatTranscript")
        const popupChatContainer: HTMLCollectionOf<Element> = document.getElementsByClassName("ci-api-popup");

        var agentDiv: HTMLDivElement = document.createElement("div")
        agentDiv.classList.add(this.classes.Agent.Outer);
        agentDiv.insertAdjacentHTML("beforeend", msgDiv);
        agentDiv.setAttribute('aria-live', 'polite');

        var printMessageSuffix: HTMLHeadingElement = document.createElement("h2");

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

        var printOuterTimeStamp: HTMLDivElement = document.createElement("div");

        var printTimeStamp: HTMLParagraphElement = document.createElement("p");

        if (popupChatContainer.length > 0) {
            printTimeStamp.className = "print-only govuk-body popup-print-float-left";
        } else {
            printTimeStamp.className = "print-only govuk-body print-float-left";
        }

        printTimeStamp.innerHTML = this.getPrintTimeStamp(msgTimestamp);

        printOuterTimeStamp.className = "timestamp-outer";
        printOuterTimeStamp.innerHTML = this._getTimestampPrefix(msgTimestamp) + printMessageSuffix.outerHTML + agentDiv.outerHTML + printTimeStamp.outerHTML;

        this.content?.appendChild(printOuterTimeStamp);

        setTimeout(this.appendMessageInLiveRegion, 300, automatonData, id, this._getMsgTimestampPrefix(msgTimestamp, this.automatedMsgPrefix, "h3"), true, this, this.classes.Agent, false, false, isQuickReply);

        if (chatContainer) {

            if (skipToTop != null) {
                chatContainer.removeChild(skipToTop);
            }

            this.addSkipToBottomLink();
        }
    }

    _appendMessage(msg: string, msgTimestamp: string, msg_class: DefaultClassesType, msg_type: string, isCustomerMsg: boolean, isSystemMsg: boolean, state?: string | undefined, joinTransfer?: string | undefined): void {

        var id: string = "liveMsgId" + (Math.random() * 100);

        var printOuterTimeStamp: HTMLDivElement = document.createElement("div");
        var printTimeStamp: HTMLParagraphElement = document.createElement("p");
        const popupChatContainer: HTMLCollectionOf<Element> = document.getElementsByClassName("ci-api-popup");

        if (isCustomerMsg == true) {
            var msgDiv: string = `<div class=${msg_class?.Outer}><div class= "msg-opacity govuk-body ${msg_class?.Inner}" id=${id}></div></div>`;
            var printMessageSuffix: HTMLHeadingElement = document.createElement("h2");

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
                if (state == MessageState.Agent_IsTyping) {
                    printOuterTimeStamp.classList.add("agent-typing");
                    var msgDiv: string = `<div class= govuk-!-display-none-print ${msg_class?.Outer}><div class= "msg-opacity govuk-body ${msg_class?.Inner}" id=${id} aria-live=polite></div></div>`;
                } else {
                    if (joinTransfer == "true") {
                        printOuterTimeStamp.classList.add("agent-joins-conference");
                    }
                    var msgDiv: string = `<div class= govuk-!-display-none-print ${msg_class?.Outer}><div class= "msg-opacity govuk-body ${msg_class?.Inner}" id=${id} aria-live=polite></div></div>`;
                }
            } else {
                var msgDiv: string = `<div class=${msg_class?.Outer}><div class= "msg-opacity govuk-body ${msg_class?.Inner}" tabindex=-1 id=${id} aria-live=polite></div></div>`;

                var printMessageSuffix: HTMLHeadingElement = document.createElement("h3");
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

        const skipToTop: HTMLElement | null = document.getElementById("skipToTop");
        const chatContainer: HTMLElement | null = document.getElementById("ciapiSkinChatTranscript");

        printOuterTimeStamp.classList.add("timestamp-outer");

        if (!isSystemMsg) {
            printTimeStamp.innerHTML = this.getPrintTimeStamp(msgTimestamp);
            printOuterTimeStamp.innerHTML = this._getTimestampPrefix(msgTimestamp) + printMessageSuffix!.outerHTML + msgDiv + printTimeStamp.outerHTML;
            // I have used the bang here as it works but TS is throwing an error because printMessageSuffix is used before it is assigned. This is because it is created / assigned within if statements. Are you happy with the bang and is this a refactor ticket?
        } else {
            printOuterTimeStamp.innerHTML = this._getTimestampPrefix(msgTimestamp) + msgDiv + printTimeStamp.outerHTML;
        }

        let chatIdElement: HTMLElement | null | number = document.getElementById("chat-id")
        if (window.chatId && chatIdElement) {
            chatIdElement.innerHTML = String(window.chatId);
        }

        this.content?.appendChild(printOuterTimeStamp);

        setTimeout(this.appendMessageInLiveRegion, 300, msg, id, msg_type, false, this, msg_class, isSystemMsg, isCustomerMsg);

        if (chatContainer) {

            if (skipToTop != null) {
                chatContainer.removeChild(skipToTop);
            }

            this.addSkipToBottomLink();
        }
    }

    addQuickReply(quickReplyData: { nodes: { controls: { id: string; type: string; text: string[]; values: string[]; event: { name: string } }[], id: string }[]; transitions: { name: string, from: string, trigger: string }[] }, messageText: string, messageTimestamp: string): null | undefined {
        // James - I have gotten these from using the console. However, I cannot guarantee that they will always be these types. What do you think? Probably true of a lot of this ticket.
        try {
            if (!quickReplyData.nodes) return null;

            let divContainer: HTMLDivElement = document.createElement("div");
            divContainer.innerHTML = messageText;

            let initialNode: { controls: { id: string; type: string; text: string[]; values: string[]; event: { name: string } }[], id: string } = quickReplyData.nodes[0];

            // Render first node
            let nodeContainer: HTMLDivElement = document.createElement("div");
            nodeContainer.classList.add(initialNode.id);

            let renderedControl: HTMLUListElement | HTMLLIElement[];
            // James - Based on the code in this method and the one below, do you think that renderedControl can only be HTMLUListElement? I think the <li>s are handled by the if in the switch case below. However, if I remove HTMLLIElement[] it does not like it because renderedControl is set as the output of createQuickReplyButtonAsLinks() which can be either.
            let divContainerQrw: any

            if (messageText.includes('<ul class="quick-reply-widget"')) {
                divContainerQrw = divContainer.getElementsByClassName("quick-reply-widget")[0]
                divContainerQrw.disable = function () {
                    let links: HTMLAnchorElement[] = this.querySelectorAll('a[href="#"]');
                    links.forEach(link => link.parentElement && (link.parentElement.innerText = link.text));
                }
            }
            // James - I am getting an error for the typing of divContainerQrw so I have set it as any. The error is that Property 'disable' does not exist on type 'Element'.ts(2339). However, to get divContainerQrw we are using getElementsByClassName() which returns a HTMLCollection but the [0] makes it a singular element / HTMLElement / type of HTMLElement. Using the inspect tool, this is a <ul> element containing <li> elements. I have tried using Element, HTMLElement and HTMLUListElement but that gets the same error as above plus another error. Do you have any ideas? I also tried console logging it and I am getting multiple undefined consoles.

            for (let i: number = 0; i < Object.keys(initialNode.controls).length; i++) {
                let control: { id: string; type: string; text: string[]; values: string[]; event: { name: string } } = initialNode.controls[i];

                switch (control.type) {
                    case "QuickReplyButton":
                        if (messageText.includes('<ul class="quick-reply-widget"')) {
                            divContainerQrw.append(...<[]>this.createQuickReplyButtonAsLinks(initialNode, control, messageText));
                            // James - I believe this if statement handles if it is an array of <li>s. The if statement is the same as the one in the below method where it returns an <li> array. In order to spread the return value of createQuickReplyButtonAsLinks(), it should return an array. Therefore, I have had to cast it as an array. If you think it may receive qrContainer which is a <ul> we could change the return statement to return [qrContainer] so I do not have to cast it and it is the correct type. What do you think? Personally I think the UL is handled in the else below
                        } else {
                            renderedControl = this.createQuickReplyButtonAsLinks(initialNode, control, messageText);
                        }
                        break;
                }
            }


            if (!messageText.includes('<ul class="quick-reply-widget"')) {
                divContainer.append(renderedControl! as HTMLUListElement);
                // James - Do you mind taking a look at this code please? I have had to cast it. My understanding is that this will be a HTMLUListElement because the <li>s are handled in the if case of the switch above meaning the <ul> is handled by the else above and then onto this if statement.

                // James - I have used the ! as this was working so I do not think it is an issue. However, TS is throwing the error: Variable 'renderedControl' is used before being assigned.ts(2454). This is because it is assigned in the else case in the switch case above. I think TS is telling us that in theory this could run before it is assigned. This may be one to look at during the refactor?
            }

            if (!!quickReplyData.transitions) {
                let quickReplyWidget: any = divContainer.getElementsByClassName("quick-reply-widget")[0]
                // James - This is inferred to be an element based on the getElementsByClassName function which returns HTMLCollection. Using the inspect tool I can see that quick-reply-widget is a <ul>. However, when I typed it as HTMLUListElement it is throwing an error: Property 'transitions' does not exist on type 'HTMLUListElement'.ts(2339). We are trying to set the transitions property as what is passed through as a parameter. Do you have any ideas? 
                quickReplyWidget.transitions = quickReplyData.transitions;
                quickReplyWidget.addEventListener('click', this.handleRichMediaClickEvent);
            }

            const isQuickReply: boolean = true;

            this.addAutomatonMsg(divContainer, messageTimestamp, isQuickReply);
        } catch (e: unknown) {
            logger.error('quickReplayError', e);
            return null;
        }
    }

    createQuickReplyButtonAsLinks(node: { controls: { id: string; type: string; }[]; id: string; }, controlData: { id: string; type: string; text: string[]; values: string[]; event: { name: string } }, messageText: string): HTMLLIElement[] | HTMLUListElement {
        let qrContainer: any = document.createElement("ul");
        qrContainer.classList.add('quick-reply-widget');

        qrContainer.disable = function (): void {
            // James - Typed qrContainer as any due to getting the following error when qrContainer is typed as HTMLUListElement: Property 'disable' does not exist on type 'HTMLUListElement'.ts(2339). However, surely it has to be a HTMLUListElement as we can see it is creating a <ul>. Any thoughts?
            let links: NodeListOf<HTMLAnchorElement> = this.querySelectorAll('a[href="#"]');
            links.forEach(link => link.parentElement && (link.parentElement.innerText = link.text));
        }
        // James - Are you happy with the refactor? I have used the && to check if link.parentElement is truthy in the forEach. It will do the second half of the statement if true. This gets rid of the null error.

        const buttonElements: HTMLLIElement[] | undefined = controlData.text.map((text: string, idx: number): HTMLLIElement => {
            let listItemEl: HTMLLIElement = document.createElement("li");
            let linkEl: HTMLAnchorElement = document.createElement("a");
            linkEl.href = '#';

            let prefix: string = `#${node.id}.${controlData.id}`;

            linkEl.richMediaContext = {
                [`${prefix}.selectedIndex`]: idx,
                [`${prefix}.selectedText`]: text,
                [`${prefix}.selectedValue`]: controlData.values[idx],
                'event': controlData.event?.name,
                'node': node.id,
            }
            // linkEl is creating an <a> which should be of type HTMLAnchorElement. However, it is throwing an error: Property 'richMediaContext' does not exist on type 'HTMLAnchorElement'.ts(2339). Do you have any ideas? 

            linkEl.innerText = text;
            listItemEl.append(linkEl);
            return listItemEl;
        })

        if (messageText.includes('<ul class="quick-reply-widget"')) {
            return buttonElements;
        } else {
            qrContainer.append(...buttonElements);
            return qrContainer;
        }
    }

    handleRichMediaClickEvent(event: any): void {
        // James - event is a large and very complex object not of type Event. To get it to run in the console you need to ask 'where is my' inside the DA and then click on one of the links. What is your opinion on typing this?
        event.preventDefault();

        let targetEl: any = event.target;
        // James - I have console logged this element and it is a <a> element. However, it will not allow me to type it as HTMLAnchorElement. It throws the error: Property 'richMediaContext' does not exist on type 'HTMLAnchorElement'.ts(2339)
        let targetElContext = targetEl.richMediaContext;
        // James - provides an object which is based on quick reply data from the methods above. Do you have any ideas on how to type this? 
        if (!targetElContext) return;

        let transition: { from: string, name: string, to: { sendMessage: { [key: string]: string } }, trigger: string } =
            this
                .transitions
                .find((transition: { from: string, name: string, to: { sendMessage: { [key: string]: string } }, trigger: string }) => transition.from == targetElContext.node && transition.trigger == targetElContext.event);
        // James - this should ideally be typed at the top of the file instead of any however it is not initialised so throws an error. If we type it at the top, we would not need to type this twice. This could be one for the refactor tickets? This relates to transitions at the top of the file which is typed as any.

        if (!!transition.to && !!transition.to.sendMessage) {
            let datapassDef: { [key: string]: string } = transition.to.sendMessage;

            let richContentMessageData: { [key: string]: string } = {};
            // James - I believe this is correct but not 100% sure, if you look at the below foreach, it is setting the key of the empty object to a string. Therefore it should be an object of string value pairs. Do you mind confirming?

            Object.entries(datapassDef).forEach(([key, value], index) => {
                richContentMessageData[key] = (value.substr(0, 1) == '#') ? targetElContext[value] : value;
            });
            // James - index is not being used, can it be deleted?

            Inq.SDK.sendRichContentMessage(richContentMessageData.displayText, richContentMessageData);
            // James - not sure where Inq comes from. Do you have any ideas?
        }
    }

    _showLatestContent(msg_class: DefaultClassesType): void {
        const chatContainer: HTMLElement | null = document.getElementById("ciapiSkinChatTranscript")
        const agentInner: string = msg_class.Inner;
        const innerClassArray: HTMLCollectionOf<Element> = document.getElementsByClassName(agentInner);
        const outerAgent: string = msg_class.Outer;
        const outerClassArray: HTMLCollectionOf<Element> = document.getElementsByClassName(outerAgent);

        if (innerClassArray.length > 0 && outerClassArray.length > 0) {
            const lengthOfAgentInnerArray: number = innerClassArray.length - 1;
            const heightOfLastMessage: number = innerClassArray[lengthOfAgentInnerArray].clientHeight;
            const outerAgentParentId: HTMLElement | null = outerClassArray[0].parentElement;
            const heightOfSkinChat: number | undefined = outerAgentParentId?.clientHeight;

            if (typeof heightOfLastMessage !== 'undefined' && typeof heightOfSkinChat !== 'undefined') {
                if (heightOfLastMessage > heightOfSkinChat) {
                    innerClassArray[lengthOfAgentInnerArray].scrollIntoView({ block: 'nearest' });
                } else {
                    chatContainer?.scrollTo({ top: chatContainer.scrollHeight, left: 0, behavior: "smooth" });
                }
            } else {
                chatContainer?.scrollTo({ top: chatContainer.scrollHeight, left: 0, behavior: "smooth" });
            }
        } else {
            chatContainer?.scrollTo({ top: chatContainer.scrollHeight, left: 0, behavior: "smooth" });
        }
    }
    // James - Do you think this is just Agent within default classes or other types?

    getPrintTimeStamp(msgTimestamp: string): string {
        let strTime: string = "";

        if (msgTimestamp != "") {

            const date: Date = new Date(parseInt(msgTimestamp));

            let hours: number = date.getHours();
            let minutes: number | string = date.getMinutes();
            let ampm: string = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            strTime = hours + ':' + minutes + ' ' + ampm;

        }
        return strTime;
    }

    _getTimestampPrefix(msgTimestamp: string): string {
        let timestampPrefix: HTMLSpanElement = document.createElement("span");

        timestampPrefix.className = "govuk-visually-hidden";
        timestampPrefix.innerHTML = this.getPrintTimeStamp(msgTimestamp);

        return timestampPrefix.outerHTML;
    }

    _getMsgTimestampPrefix(msgTimestamp: string, prefix: string, hTag: string): string {
        let msgTimestampPrefix: HTMLElement = document.createElement(hTag);

        msgTimestampPrefix.innerHTML = this.getPrintTimeStamp(msgTimestamp) + prefix;

        return msgTimestampPrefix.outerHTML;
    }
}
