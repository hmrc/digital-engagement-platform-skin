import MarkdownIt from 'markdown-it';

// NICE sends message text as plain text, and the Cognigy bot writes it in Markdown, but Transcript renders
// messages as HTML (Nuance sent HTML). These functions build that HTML with GOV.UK classes, so the skin
// and GOV.UK CSS style NICE messages the same way.

// html: false means any HTML the bot or agent types is shown as text, never run.
// breaks: true keeps single line breaks, as the bot expects.
const markdown: MarkdownIt = new MarkdownIt({ html: false, linkify: true, breaks: true });

const GOVUK_CLASSES: { [tokenType: string]: string } = {
    bullet_list_open: "govuk-list govuk-list--bullet",
    ordered_list_open: "govuk-list govuk-list--number",
    blockquote_open: "govuk-inset-text",
    hr: "govuk-section-break govuk-section-break--m govuk-section-break--visible",
    table_open: "govuk-table",
    thead_open: "govuk-table__head",
    tbody_open: "govuk-table__body",
    tr_open: "govuk-table__row",
    th_open: "govuk-table__header",
    td_open: "govuk-table__cell",
};

// The page and the chat window already have their own headings, so a bot "# Heading" becomes an h3 and so on.
const HEADING_LEVEL_OFFSET: number = 2;

markdown.core.ruler.push("govuk_classes", (state) => {
    for (const token of state.tokens) {
        const govukClass: string | undefined = GOVUK_CLASSES[token.type];
        if (govukClass) {
            token.attrJoin("class", govukClass);
        }
        if (token.type === "heading_open" || token.type === "heading_close") {
            const level: number = Math.min(6, Number(token.tag.slice(1)) + HEADING_LEVEL_OFFSET);
            token.tag = `h${level}`;
            if (token.type === "heading_open") {
                token.attrJoin("class", level <= 3 ? "govuk-heading-m" : "govuk-heading-s");
            }
        }
    }
});

// Links open in a new tab and say so, as Nuance links did.
const NEW_TAB_TEXT: string = "(opens in a new tab)";
markdown.renderer.rules.link_open = (tokens, idx, options, _env, self) => {
    const token = tokens[idx];
    token.attrJoin("class", "govuk-link");
    token.attrSet("target", "_blank");
    token.attrSet("rel", "noopener noreferrer");
    if (token.attrGet("title") === NEW_TAB_TEXT.slice(1, -1)) {
        token.attrs = (token.attrs ?? []).filter(([name]) => name !== "title");
    }
    return self.renderToken(tokens, idx, options);
};
markdown.renderer.rules.link_close = (tokens, idx, options, _env, self) => {
    const suffix: string = collectLinkText(tokens, idx).includes("new tab") ? "" : ` ${NEW_TAB_TEXT}`;
    return suffix + self.renderToken(tokens, idx, options);
};

function collectLinkText(tokens: MarkdownIt.Token[], closeIdx: number): string {
    let text: string = "";
    for (let i = closeIdx - 1; i >= 0 && tokens[i].type !== "link_open"; i--) {
        text = tokens[i].content + text;
    }
    return text;
}

// Uses numeric entities because Transcript.decodeHTMLEntities turns &lt; &gt; &amp; &quot; back into markup
// before setting innerHTML. It does not decode these, so text from NICE is always shown as text.
function toNumericEntities(html: string): string {
    return html
        .replace(/&amp;/g, "&#38;")
        .replace(/&lt;/g, "&#60;")
        .replace(/&gt;/g, "&#62;")
        .replace(/&quot;/g, "&#34;");
}

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, "&#38;")
        .replace(/</g, "&#60;")
        .replace(/>/g, "&#62;")
        .replace(/"/g, "&#34;")
        .replace(/'/g, "&#8217;");
}

// Agent and bot messages: Markdown (headings, bold, italic, lists, links, tables, quotes, code) rendered with GOV.UK classes.
export function formatNiceMessageText(text: string): string {
    return toNumericEntities(markdown.render(text.replace(/\r\n?/g, "\n").trim()));
}

// Customer messages: shown as typed, without formatting or links, as with Nuance.
export function formatNiceCustomerText(text: string): string {
    return escapeHtml(text.replace(/\r\n?/g, "\n").trim()).replace(/\n/g, "<br>");
}

// NICE gives an ISO date such as "2026-11-02T10:15:00.000Z"; Transcript expects epoch milliseconds as a string, as Nuance sent.
export function toTranscriptTimestamp(createdAt: string | Date | undefined): string {
    const time: number = createdAt ? new Date(createdAt).getTime() : NaN;
    return String(isNaN(time) ? Date.now() : time);
}
