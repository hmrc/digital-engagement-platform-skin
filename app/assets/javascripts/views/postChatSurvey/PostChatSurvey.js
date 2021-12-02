const html = `
    <div id="postChatSurvey">
        <legend class="govuk-fieldset__legend govuk-fieldset__legend--l" id="legend_give_feedback" tabindex="-1">
          <h2 class="govuk-fieldset__heading">Give feedback</h2>
        </legend>

        <p>Your feedback helps us improve our services. The survey takes about one minute and all of the questions are optional.</p>

        <div class="govuk-grid-row">
            <div class="govuk-grid-column-two-thirds">

              <form>

                <div class="govuk-form-group">

                  <fieldset class="govuk-fieldset" id="question1">
                    <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
                      <h2 class="govuk-fieldset__heading">Was the chatbot useful?</h2>
                    </legend>
                    <div class="govuk-radios govuk-radios--inline">
                      <div class="govuk-radios__item">
                        <input class="govuk-radios__input" id="q1-" name="q1-" type="radio" value="yes">
                        <label class="govuk-label govuk-radios__label" for="formItem-">Yes</label>
                      </div>
                      <div class="govuk-radios__item">
                        <input class="govuk-radios__input" id="q1--2" name="q1-" type="radio" value="no">
                        <label class="govuk-label govuk-radios__label" for="q1--2">No</label>
                      </div>
                    </div>
                  </fieldset>

                  <fieldset class="govuk-fieldset" id="question2">
                    <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
                      <h2 class="govuk-fieldset__heading">Was the chatbot your first contact choice?</h2>
                    </legend>
                    <div class="govuk-radios govuk-radios--inline">
                      <div class="govuk-radios__item">
                        <input class="govuk-radios__input" id="q2-" name="q2-" type="radio" value="yes">
                        <label class="govuk-label govuk-radios__label" for="formItem-">Yes</label>
                      </div>
                      <div class="govuk-radios__item">
                        <input class="govuk-radios__input" id="q2--2" name="q2-" type="radio" value="no">
                        <label class="govuk-label govuk-radios__label" for="q2--2">No</label>
                      </div>
                    </div>
                  </fieldset>

                  <fieldset class="govuk-fieldset" id="question3">
                    <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
                      <h2 class="govuk-fieldset__heading">If you had not used chatbot today, how else would you have contacted us?</h2>
                    </legend>
                    <div class="govuk-radios">
                      <div class="govuk-radios__item">
                        <input class="govuk-radios__input" id="q3-" name="q3-" type="radio" value="phone">
                        <label class="govuk-label govuk-radios__label" for="q3-">Phone</label>
                      </div>
                      <div class="govuk-radios__item">
                        <input class="govuk-radios__input" id="q3--2" name="q3-" type="radio" value="webchat">
                        <label class="govuk-label govuk-radios__label" for="q3--2">Webchat</label>
                      </div>
                      <div class="govuk-radios__item">
                        <input class="govuk-radios__input" id="q3--3" name="q3-" type="radio" value="social media">
                        <label class="govuk-label govuk-radios__label" for="q3--3">Social media</label>
                      </div>
                      <div class="govuk-radios__item">
                        <input class="govuk-radios__input" id="q3--4" name="q3-" type="radio" value="other">
                        <label class="govuk-label govuk-radios__label" for="q3--4">Other</label>
                      </div>
                    </div>
                  </fieldset>

                </div>

                <button id="submitPostChatSurvey" class="govuk-button">Submit</button>

              </form>
            </div>
        </div>
    </div>
`

export default class PostChatSurvey {
  constructor(onSubmitted) {
    this.onSubmitted = onSubmitted;
  }

  attachTo(container) {
    this.container = container;

    this.wrapper = document.createElement("div")
    this.wrapper.id = "postChatSurveyWrapper";
    this.wrapper.insertAdjacentHTML("beforeend", html);
    container.appendChild(this.wrapper);

    this.wrapper.querySelector("#submitPostChatSurvey").addEventListener(
      "click",
      (e) => {
        this.onSubmitted(this);
      }
    );
  }

  detach() {
    this.container.removeChild(this.wrapper)
  }
}
