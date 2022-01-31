const html = `
    <div id="postChatSurvey">
        <legend class="govuk-fieldset__legend govuk-fieldset__legend--l" id="legend_give_feedback" tabindex="-1">
          <h1 class="govuk-fieldset__heading">Give feedback</h1>
        </legend>

        <p>We use your feedback to improve our services. The survey takes about one minute to complete. There are 3 questions and they are all optional.</p>

        <div class="govuk-grid-row">
            <div class="govuk-grid-column-two-thirds">

              <form method='POST'>

                <div class="govuk-form-group">

                  <fieldset class="govuk-fieldset" id="question1">
                    <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
                      <h2 class="govuk-fieldset__heading">Was the digital assistant useful?</h2>
                    </legend>
                    <div class="govuk-radios govuk-radios--inline">
                      <div class="govuk-radios__item">
                        <input class="govuk-radios__input" id="q1-" name="q1-" type="radio" value="Yes">
                        <label class="govuk-label govuk-radios__label" for="formItem-">Yes</label>
                      </div>
                      <div class="govuk-radios__item">
                        <input class="govuk-radios__input" id="q1--2" name="q1-" type="radio" value="No">
                        <label class="govuk-label govuk-radios__label" for="q1--2">No</label>
                      </div>
                    </div>
                  </fieldset>

                  <fieldset class="govuk-fieldset" id="question2">
                    <h2 class="govuk-label-wrapper">
                        <label class="govuk-label govuk-label--m" for="more-detail">
                            How could you improve it?
                        </label>
                    </h2>
                    <textarea class="govuk-textarea" id="q2-" name="q2-" rows="5" aria-describedby="more-detail-hint"></textarea>
                  </fieldset>

                  <fieldset class="govuk-fieldset" id="question3">
                    <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
                      <h2 class="govuk-fieldset__heading">If you had not used the chatbot, how else would you have contacted us?</h2>
                    </legend>
                    <div class="govuk-radios" data-module="govuk-radios">
                      <div class="govuk-radios__item">
                        <input class="govuk-radios__input" id="q3-" name="q3-" type="radio" value="Phone">
                        <label class="govuk-label govuk-radios__label" for="q3-">Phone</label>
                      </div>
                      <div class="govuk-radios__item">
                        <input class="govuk-radios__input" id="q3--2" name="q3-" type="radio" value="Webchat with an HMRC adviser">
                        <label class="govuk-label govuk-radios__label" for="q3--2">Webchat with an HMRC adviser</label>
                      </div>
                      <div class="govuk-radios__item">
                        <input class="govuk-radios__input" id="q3--3" name="q3-" type="radio" value="Social media">
                        <label class="govuk-label govuk-radios__label" for="q3--3">Social media</label>
                      </div>
                      <div class="govuk-radios__item">
                        <input class="govuk-radios__input" id="q3--4" name="q3-" type="radio" value="I would not have used another contact method">
                        <label class="govuk-label govuk-radios__label" for="q3--4">I would not have used another contact method</label>
                      </div>
                      <div class="govuk-radios__item">
                        <input class="govuk-radios__input" id="q3-5" name="q3-" type="radio" value="Other" aria-controls="other-contact-details">
                        <label class="govuk-label govuk-radios__label" for="q3--5">Other</label>
                      </div>
                      <div class="govuk-radios__conditional govuk-radios__conditional--hidden" id="other-contact-details">
                        <div class="govuk-form-group">
                          <label class="govuk-label" for="contact-by-other">Provide other contact options?</label>
                          <textarea class="govuk-textarea"  id="q4-" name="q4-" rows="5" aria-describedby="other-contact-details"></textarea>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                  <button id="submitPostChatSurvey" class="govuk-button">Submit</button>
              </form>
            </div>
        </div>
    </div>
`

export default class PostChatSurveyDigitalAssistant {
    constructor(onSubmitted) {
        this.onSubmitted = onSubmitted;
    }

    attachTo(container) {
        this.container = container;

        this.wrapper = document.createElement("div");
        this.wrapper.id = "postChatSurveyWrapper";
        this.wrapper.insertAdjacentHTML("beforeend", html);
        container.appendChild(this.wrapper);

        this.wrapper.querySelector("#submitPostChatSurvey").addEventListener(
            "click",
            (e) => {
                this.onSubmitted(this);
            }
        );

        $('input[name="q3-"]').on('click', function() {
           if ($(this).val() != 'Other') {
                document.getElementById("q4-").value = "";
           }
        });
    }

    detach() {
        this.container.removeChild(this.wrapper)
    }
}