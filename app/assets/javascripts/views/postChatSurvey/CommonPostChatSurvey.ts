export default class CommonPostChatSurvey {
    html: string
    container: HTMLElement | undefined
    wrapper: HTMLElement | undefined
    onSubmitted: (a: object) => void

    constructor(html: string, onSubmitted: (a: object) => void) {
        this.html = html;
        this.onSubmitted = onSubmitted;
    }

    attachTo(container: HTMLElement): void {
        this.container = container;
        this.wrapper = document.createElement("div");
        this.wrapper.id = "postChatSurveyWrapper";
        this.wrapper.insertAdjacentHTML("beforeend", this.html);
        container?.appendChild(this.wrapper);

        this.wrapper.querySelector<HTMLElement>("#submitPostChatSurvey")?.addEventListener(
            "click",
            (e: Event): void => {
                e.preventDefault();
                this.onSubmitted(this);
            }
        );

        this.wrapper.querySelector<HTMLElement>("#skipSurvey")?.addEventListener(
            "click",
            (_: Event): void => {
                sessionStorage.setItem("surveySkipped", "true");
                this.onSubmitted(this);
            }
        );

        this.wrapper.querySelector<HTMLElement>('#question5')?.addEventListener(
            "click",
            (_: Event): void => {
                if ((document.getElementById('q5--4') as HTMLInputElement).checked) {
                    document.getElementById("conditional-contact")?.classList.remove("govuk-radios__conditional--hidden")
                } else {
                    (document.getElementById("q6-") as HTMLTextAreaElement).value = "";
                    document.getElementById("conditional-contact")?.classList.add("govuk-radios__conditional--hidden");
                }
            }
        )

        window.addEventListener('afterprint', (_: Event): void => {
            this.showTranscriptAndSurvey(false, true)
        });

        let isAndroidAndChrome: boolean
        if ((/Android/i.test(navigator.userAgent)) && (navigator.userAgent.match(/chrome|chromium|crios/i))) {
            isAndroidAndChrome = true
        } else {
            isAndroidAndChrome = false
        }

        let printContainer: HTMLElement | null = document.getElementById("surveyPrintContainer")
        if (printContainer) {
            printContainer.style.display = isAndroidAndChrome ? "none" : "";
        }
    }

    showTranscriptAndSurvey(showTranscript: boolean, showSurvey: boolean): void {
        let transcript: HTMLElement | null = document.getElementById("ciapiSkinChatTranscript");
        if (transcript) {
            transcript.style.display = showTranscript ? "" : "none";
        }
        let postChatSurvey: HTMLElement | null = document.getElementById("postChatSurveyWrapper");
        if (postChatSurvey) {
            postChatSurvey.style.display = showSurvey ? "" : "none";
        }
    }

    detach(): void {
        if (this.wrapper) {
            this.container?.removeChild(this.wrapper)
        }
    }
}
