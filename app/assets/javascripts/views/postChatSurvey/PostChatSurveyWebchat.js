const html = `
    <div id="postChatSurvey">
        <legend class="govuk-fieldset__legend govuk-fieldset__legend--l" id="legend_give_feedback" tabindex="-1">
          <h1 class="govuk-fieldset__heading">Give feedback</h1>
        </legend>

        <p>We use your feedback to improve our services. The survey takes about one minute to complete. There are 5 questions and they are all optional.</p>

        <div class="govuk-grid-row">
            <div class="govuk-grid-column-two-thirds">

              <form method='POST'>

                <div class="govuk-form-group">

                  <fieldset class="govuk-fieldset" id="question1">
                    <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
                      <h2 class="govuk-fieldset__heading">Were you able to do what you needed to do today?</h2>
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
                    <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
                      <h2 class="govuk-fieldset__heading">How easy was it to do what you needed to do today?</h2>
                    </legend>
                    <div class="govuk-radios" data-module="govuk-radios">
                      <div class="govuk-radios__item">
                        <input class="govuk-radios__input" id="q2-" name="q2-" type="radio" value="Very Easy">
                        <label class="govuk-label govuk-radios__label" for="formItem-">5. Very Easy</label>
                      </div>
                      <div class="govuk-radios__item">
                        <input class="govuk-radios__input" id="q2--2" name="q2-" type="radio" value="Easy">
                        <label class="govuk-label govuk-radios__label" for="q2--2">4. Easy</label>
                      </div>
                      <div class="govuk-radios__item">
                        <input class="govuk-radios__input" id="q2--3" name="q2-" type="radio" value="Neither easy nor difficult">
                        <label class="govuk-label govuk-radios__label" for="q2--3">3. Neither easy nor difficult</label>
                      </div>
                      <div class="govuk-radios__item">
                        <input class="govuk-radios__input" id="q2--4" name="q2-" type="radio" value="Difficult">
                        <label class="govuk-label govuk-radios__label" for="q2--4">2. Difficult</label>
                      </div>
                      <div class="govuk-radios__item">
                        <input class="govuk-radios__input" id="q2--5" name="q2-" type="radio" value="Very Difficult">
                        <label class="govuk-label govuk-radios__label" for="q2--5">1. Very Difficult</label>
                      </div>
                    </div>
                  </fieldset>

                  <fieldset class="govuk-fieldset" id="question3">
                    <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
                      <h2 class="govuk-fieldset__heading">Overall, how did you feel about the service you accessed today?</h2>
                    </legend>
                    <div class="govuk-radios">
                      <div class="govuk-radios__item">
                        <input class="govuk-radios__input" id="q3-" name="q3-" type="radio" value="Very Satisfied">
                        <label class="govuk-label govuk-radios__label" for="q3-">5. Very Satisfied</label>
                      </div>
                      <div class="govuk-radios__item">
                        <input class="govuk-radios__input" id="q3--2" name="q3-" type="radio" value="Satisfied">
                        <label class="govuk-label govuk-radios__label" for="q3--2">4. Satisfied</label>
                      </div>
                      <div class="govuk-radios__item">
                        <input class="govuk-radios__input" id="q3--3" name="q3-" type="radio" value="Neither Satisfied nor dissatisfied">
                        <label class="govuk-label govuk-radios__label" for="q3--3">3. Neither Satisfied nor dissatisfied</label>
                      </div>
                      <div class="govuk-radios__item">
                        <input class="govuk-radios__input" id="q3--4" name="q3-" type="radio" value="Dissatisfied">
                        <label class="govuk-label govuk-radios__label" for="q3--4">2. Dissatisfied</label>
                      </div>
                      <div class="govuk-radios__item">
                        <input class="govuk-radios__input" id="q3--5" name="q3-" type="radio" value="Very Dissatisfied">
                        <label class="govuk-label govuk-radios__label" for="q3--5">1. Very Dissatisfied</label>
                      </div>
                    </div>
                  </fieldset>

                  <fieldset class="govuk-fieldset" id="question4">
                    <h2 class="govuk-label-wrapper">
                        <label class="govuk-label govuk-label--m" for="more-detail">
                            Why did you give these scores?
                        </label>
                    </h2>
                    <textarea class="govuk-textarea" id="q4-" name="q4-" rows="5" aria-describedby="more-detail-hint"></textarea>
                  </fieldset>

                  <fieldset class="govuk-fieldset" id="question5">
                    <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
                        <h2 class="govuk-fieldset__heading">If you had not used webchat today, how else would you have contacted us?</h2>
                    </legend>
                    <div class="govuk-radios">
                        <div class="govuk-radios__item">
                            <input class="govuk-radios__input" id="q5-" name="q5-" type="radio" value="Phone">
                            <label class="govuk-label govuk-radios__label" for="formItem-">Phone</label>
                        </div>
                        <div class="govuk-radios__item">
                            <input class="govuk-radios__input" id="q5--2" name="q5-" type="radio" value="Social media">
                            <label class="govuk-label govuk-radios__label" for="q5--2">Social media</label>
                        </div>
                        <div class="govuk-radios__item">
                            <input class="govuk-radios__input" id="q5--3" name="q5-" type="radio" value="I would not have used another contact method">
                            <label class="govuk-label govuk-radios__label" for="q5--3">I would not have used another contact method</label>
                        </div>
                        <div class="govuk-radios__item">
                            <input class="govuk-radios__input" id="q5--4" name="q5-" type="radio" value="Other">
                            <label class="govuk-label govuk-radios__label" for="q5--4">Other</label>
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

export default class PostChatSurveyWebchat {
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
  }

  detach() {
    this.container.removeChild(this.wrapper)
  }
}
