import { formatNiceMessageText } from './NiceMessageFormatter';

// Renders rich content as a message element for Transcript.addAutomatonMsg. It handles two kinds:
// - NICE content types: QUICK_REPLIES, LIST_PICKER, RICH_LINK
// - Cognigy rich messages, which reach NICE as a TEXT message holding "CXRICH:<base64 JSON>:CXRICH"

export type SendPostback = (postback: string, text: string) => Promise<unknown>;

interface ReplyOption {
    text: string;
    postback?: string;
    url?: string;
    description?: string;
}

const CXRICH_PATTERN: RegExp = /CXRICH:([A-Za-z0-9+/=_-]+):CXRICH/;
const FALLBACK_TEXT: string = "[This message requires a rich-content renderer.]";

function contentText(value: any): string {
    if (typeof value === "string") return value;
    return value?.content ?? "";
}

// Only web and phone links are used, so a "javascript:" URL from a message can never run.
function safeUrl(url: unknown): string | undefined {
    return typeof url === "string" && /^(https?:|tel:)/i.test(url.trim()) ? url.trim() : undefined;
}

// Text parts are formatted and escaped by formatNiceMessageText, so they are safe to set as innerHTML here.
function textElement(text: string): HTMLDivElement {
    const div: HTMLDivElement = document.createElement("div");
    div.innerHTML = formatNiceMessageText(text);
    return div;
}

// Each option is a GOV.UK secondary button. Once one is used, all of them are disabled so it cannot be answered twice.
function replyButtons(options: ReplyOption[], sendPostback: SendPostback): HTMLDivElement {
    const group: HTMLDivElement = document.createElement("div");
    group.className = "govuk-button-group nice-quick-replies";

    const setDisabled = (disabled: boolean): void =>
        group.querySelectorAll<HTMLButtonElement>("button").forEach((button: HTMLButtonElement) => button.disabled = disabled);

    options.forEach((option: ReplyOption) => {
        if (option.url) {
            const link: HTMLAnchorElement = document.createElement("a");
            link.href = option.url;
            link.className = "govuk-button govuk-button--secondary";
            link.setAttribute("role", "button");
            link.setAttribute("draggable", "false");
            if (!option.url.startsWith("tel:")) {
                link.target = "_blank";
                link.rel = "noopener noreferrer";
            }
            link.textContent = option.url.startsWith("tel:") ? option.text : `${option.text} (opens in a new tab)`;
            group.appendChild(link);
            return;
        }

        const button: HTMLButtonElement = document.createElement("button");
        button.type = "button";
        button.className = "govuk-button govuk-button--secondary";
        button.textContent = option.text;
        if (option.description) button.title = option.description;

        button.addEventListener("click", async () => {
            setDisabled(true);
            try {
                await sendPostback(option.postback ?? option.text, option.text);
            } catch (err) {
                // Let the customer try again if the postback could not be sent
                setDisabled(false);
                console.error("NICE postback failed", err);
            }
        });
        group.appendChild(button);
    });
    return group;
}

function richLink(payload: any): HTMLParagraphElement {
    const p: HTMLParagraphElement = document.createElement("p");
    const link: HTMLAnchorElement = document.createElement("a");
    link.href = safeUrl(payload.url) ?? "#";
    link.className = "govuk-link";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = `${contentText(payload.title) || payload.url} (opens in a new tab)`;
    p.appendChild(link);
    return p;
}

function niceActions(actions: any[] | undefined): ReplyOption[] {
    return (actions ?? []).map((action: any) => ({ text: action.text, postback: action.postback, description: action.description }));
}

// Base64 to text, keeping non-ASCII characters (such as £ or ’) intact. Accepts URL-safe base64 too.
function decodeBase64(encoded: string): string {
    const binary: string = atob(encoded.replace(/-/g, "+").replace(/_/g, "/"));
    return decodeURIComponent(Array.from(binary, (c: string) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0")).join(""));
}

// Cognigy button types: "postback" sends the payload to the bot, "web_url" opens a page, "phone_number" calls the payload.
// A link button whose URL is not allowed is left out.
function cognigyOptions(buttons: any[] | undefined): ReplyOption[] {
    const options: ReplyOption[] = [];
    for (const button of buttons ?? []) {
        const text: string = button.title ?? String(button.payload ?? "");
        const type: string = button.type ?? button.contentType ?? "postback";
        if (type === "web_url" || type === "phone_number") {
            const url: string | undefined = safeUrl(type === "web_url" ? button.url : `tel:${button.payload}`);
            if (url) options.push({ text, url });
        } else {
            options.push({ text, postback: String(button.payload ?? text) });
        }
    }
    return options;
}

// One entry of a Cognigy list or gallery: title (a link when it has defaultActionUrl), subtitle and its own buttons.
// Images are left out; the title and subtitle carry the meaning.
function cognigyItem(item: any, sendPostback: SendPostback): HTMLDivElement {
    const section: HTMLDivElement = document.createElement("div");
    section.className = "nice-list-item";

    const title: HTMLParagraphElement = document.createElement("p");
    title.className = "govuk-!-font-weight-bold govuk-!-margin-bottom-1";
    const titleUrl: string | undefined = safeUrl(item.defaultActionUrl);
    if (titleUrl) {
        const link: HTMLAnchorElement = document.createElement("a");
        link.href = titleUrl;
        link.className = "govuk-link";
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = `${item.title ?? ""} (opens in a new tab)`;
        title.appendChild(link);
    } else {
        title.textContent = item.title ?? "";
    }
    section.appendChild(title);

    if (item.subtitle) {
        section.appendChild(textElement(item.subtitle));
    }
    const options: ReplyOption[] = cognigyOptions(item.buttons);
    if (options.length > 0) {
        section.appendChild(replyButtons(options, sendPostback));
    }
    return section;
}

function renderCognigy(cognigy: any, sendPostback: SendPostback): HTMLDivElement {
    const content: any = cognigy?._default ?? {};
    const container: HTMLDivElement = document.createElement("div");

    if (content._buttons) {
        container.appendChild(textElement(content._buttons.text ?? ""));
        container.appendChild(replyButtons(cognigyOptions(content._buttons.buttons), sendPostback));
    } else if (content._quickReplies) {
        container.appendChild(textElement(content._quickReplies.text ?? ""));
        container.appendChild(replyButtons(cognigyOptions(content._quickReplies.quickReplies), sendPostback));
    } else if (content._list || content._gallery) {
        const list: any = content._list ?? content._gallery;
        if (list.text) {
            container.appendChild(textElement(list.text));
        }
        (list.items ?? []).forEach((item: any) => container.appendChild(cognigyItem(item, sendPostback)));
        // A list can have one button under all the items
        const footer: ReplyOption[] = cognigyOptions(list.button ? [list.button] : []);
        if (footer.length > 0) {
            container.appendChild(replyButtons(footer, sendPostback));
        }
    } else {
        // Adaptive Cards and media are not supported yet
        console.warn("Cognigy rich message not rendered:", JSON.stringify(cognigy));
        const text: unknown = Object.values(content).map((item: any) => item?.text ?? item?.fallbackText).find(Boolean);
        container.appendChild(textElement(typeof text === "string" ? text : FALLBACK_TEXT));
    }
    return container;
}

function renderCxRich(text: string, sendPostback: SendPostback): HTMLDivElement | null {
    const match: RegExpMatchArray | null = text.match(CXRICH_PATTERN);
    if (!match) return null;

    let decoded: any;
    try {
        decoded = JSON.parse(decodeBase64(match[1]));
    } catch (err) {
        console.error("Could not decode CXRICH message", err);
        return textElement(FALLBACK_TEXT);
    }

    const container: HTMLDivElement = document.createElement("div");
    const surroundingText: string = text.replace(CXRICH_PATTERN, "").trim();
    if (surroundingText) {
        container.appendChild(textElement(surroundingText));
    }
    container.appendChild(renderCognigy(decoded?._cognigy, sendPostback));
    return container;
}

// Returns null for content shown as ordinary text (plain TEXT messages and anything unknown).
export function renderNiceRichContent(messageContent: any, sendPostback: SendPostback): HTMLDivElement | null {
    const payload: any = messageContent?.payload ?? {};
    const container: HTMLDivElement = document.createElement("div");

    switch (messageContent?.type) {
        case "TEXT":
            return renderCxRich(contentText(payload.text), sendPostback);
        case "QUICK_REPLIES":
            container.appendChild(textElement(contentText(payload.text)));
            container.appendChild(replyButtons(niceActions(payload.actions), sendPostback));
            return container;
        case "LIST_PICKER": {
            const title: string = contentText(payload.title);
            if (title) {
                const heading: HTMLParagraphElement = document.createElement("p");
                heading.className = "govuk-!-font-weight-bold";
                heading.textContent = title;
                container.appendChild(heading);
            }
            container.appendChild(textElement(contentText(payload.text)));
            container.appendChild(replyButtons(niceActions(payload.actions), sendPostback));
            return container;
        }
        case "RICH_LINK":
            container.appendChild(richLink(payload));
            return container;
        default:
            return null;
    }
}
