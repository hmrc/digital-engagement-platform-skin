import * as MessageState from '../NuanceMessageState';
import * as logger from '../utils/logger';
import { messages } from '../utils/Messages';
import { Agent, Customer, System, Opener } from '../DefaultClasses';
import { QuickReplyData } from '../types';

type Classes = typeof import("../DefaultClasses");

type DefaultClassesType = typeof Agent | typeof Customer | typeof System | typeof Opener
export default class Transcript {
    content: HTMLElement | null;
    classes: Classes;
    agentMsgPrefix: string;
    customerMsgPrefix: string;
    systemMsgPrefix: string;
    automatedMsgPrefix: string;
    transitions?: { from: string, name: string, to: { sendMessage: { [key: string]: string } }, trigger: string }[]

    constructor(content: HTMLElement | null, classes: Classes, msgPrefix?: undefined) {
        this.content = content;
        this.classes = classes;
        this.agentMsgPrefix = messages.agentMsgPrefix;
        this.customerMsgPrefix = messages.customerMsgPrefix;
        this.systemMsgPrefix = messages.systemMsgPrefix;
        this.automatedMsgPrefix = messages.automatedMsgPrefix;
    }

    addAgentMsg(msg: string, msgTimestamp: string, agent?: undefined): void {
        this._appendMessage(msg, msgTimestamp, this.classes.Agent, this._getMsgTimestampPrefix(msgTimestamp, this.agentMsgPrefix, "h3"), false, false);
    }

    addCustomerMsg(msg: string, msgTimestamp: string, agent?: undefined): void {
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

    addSystemMsg(msgObject: { msg?: string; joinTransfer?: string; state?: string }, msgTimestamp?: string): void {
        if (msgObject.msg === undefined) msgObject.msg = "";
        if (msgObject.msg.includes('hmrcda')) {
            msgObject.msg = 'Your chat has ended.'
        }
        if (msgObject.state === undefined) msgObject.state = "";
        if (msgObject.joinTransfer === undefined) msgObject.joinTransfer = "";
        if (msgTimestamp === undefined) msgTimestamp = '';

        this._appendMessage(msgObject.msg, "", this.classes.System, this._getMsgTimestampPrefix(msgTimestamp, this.systemMsgPrefix, "h3"), false, true, msgObject.state, msgObject.joinTransfer);
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
            printTimeStamp.className = "print-only govuk-body popup-print-float-left print-timestamp";
        } else {
            printTimeStamp.className = "print-only govuk-body print-float-left print-timestamp";
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
                printTimeStamp.className = "print-only govuk-body popup-print-float-right print-timestamp";
            } else {
                printTimeStamp.className = "print-only govuk-body print-float-right print-timestamp";
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
                    printTimeStamp.className = "print-only govuk-body popup-print-float-left print-timestamp";
                } else {
                    printTimeStamp.className = "print-only govuk-body print-float-left print-timestamp";
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

    addQuickReply(quickReplyData: QuickReplyData, messageText: string, messageTimestamp: string): null | undefined {
        try {
            if (!quickReplyData.nodes) return null;

            let divContainer: HTMLDivElement = document.createElement("div");
            divContainer.innerHTML = messageText;

            let initialNode: { controls: { id: string; type: string; text: string[]; values: string[]; event: { name: string } }[], id: string } = quickReplyData.nodes[0];

            // Render first node
            let nodeContainer: HTMLDivElement = document.createElement("div");
            nodeContainer.classList.add(initialNode.id);

            let renderedControl: HTMLUListElement | HTMLLIElement[];
            let divContainerQrw: any

            if (messageText.includes('<ul class="quick-reply-widget"')) {
                divContainerQrw = divContainer.getElementsByClassName("quick-reply-widget")[0]
                divContainerQrw.disable = function () {
                    let links: HTMLAnchorElement[] = this.querySelectorAll('a[href="#"]');
                    links.forEach(link => link.parentElement && (link.parentElement.innerText = link.text));
                }
            }


            for (let i: number = 0; i < Object.keys(initialNode.controls).length; i++) {
                let control: { id: string; type: string; text: string[]; values: string[]; event: { name: string } } = initialNode.controls[i];

                switch (control.type) {
                    case "QuickReplyButton":
                        if (messageText.includes('<ul class="quick-reply-widget"')) {
                            divContainerQrw.append(...<[]>this.createQuickReplyButtonAsLinks(initialNode, control, messageText));
                        } else {
                            renderedControl = this.createQuickReplyButtonAsLinks(initialNode, control, messageText);
                        }
                        break;
                }
            }


            if (!messageText.includes('<ul class="quick-reply-widget"')) {
                divContainer.append(renderedControl! as HTMLUListElement);
            }

            if (!!quickReplyData.transitions) {
                let quickReplyWidget: any = divContainer.getElementsByClassName("quick-reply-widget")[0]
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
            let links: NodeListOf<HTMLAnchorElement> = this.querySelectorAll('a[href="#"]');
            links.forEach(link => link.parentElement && (link.parentElement.innerText = link.text));
        }

        const buttonElements: HTMLLIElement[] | undefined = controlData.text.map((text: string, idx: number): HTMLLIElement => {
            let listItemEl: HTMLLIElement = document.createElement("li");
            let linkEl: any = document.createElement("a");
            linkEl.href = '#';

            let prefix: string = `#${node.id}.${controlData.id}`;

            linkEl.richMediaContext = {
                [`${prefix}.selectedIndex`]: idx,
                [`${prefix}.selectedText`]: text,
                [`${prefix}.selectedValue`]: controlData.values[idx],
                'event': controlData.event?.name,
                'node': node.id,
            }

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
        event.preventDefault();

        let targetEl = event.target;
        let targetElContext = targetEl.richMediaContext;
        if (!targetElContext) return;

        let transition =
            this
                .transitions!
                .find((transition) => transition.from == targetElContext.node && transition.trigger == targetElContext.event);

        if (!!transition && !!transition.to && !!transition.to.sendMessage) {
            let datapassDef: { [key: string]: string } = transition.to.sendMessage;

            let richContentMessageData: { [key: string]: string } = {};

            Object.entries(datapassDef).forEach(([key, value], index) => {
                richContentMessageData[key] = (value.substr(0, 1) == '#') ? targetElContext[value] : value;
            });

            // @ts-ignore
            Inq.SDK.sendRichContentMessage(richContentMessageData.displayText, richContentMessageData);
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