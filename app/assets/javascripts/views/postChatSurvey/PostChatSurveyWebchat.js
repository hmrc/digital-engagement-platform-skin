const html = `
    <div id="postChatSurvey">
          <h2 class="govuk-fieldset__heading" id="legend_give_feedback" tabindex="-1">Give feedback</h2>

        <p>We use your feedback to improve our services. The survey takes about one minute to complete. There are 5 questions and they are all optional.</p>

        <div class="govuk-grid-row">
            <div class="govuk-grid-column-two-thirds">

              <form method='POST'>

                <div class="govuk-form-group">

                  <fieldset class="govuk-fieldset" id="question1">
                    <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
                      Were you able to do what you needed to do today?
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
                      How easy was it to do what you needed to do today?
                    </legend>
                    <div class="govuk-radios" data-module="govuk-radios">
                      <div class="govuk-radios__item">
                        <input class="govuk-radios__input" id="q2-" name="q2-" type="radio" value="Very easy">
                        <label class="govuk-label govuk-radios__label" for="formItem-">5. Very easy</label>
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
                        <input class="govuk-radios__input" id="q2--5" name="q2-" type="radio" value="Very difficult">
                        <label class="govuk-label govuk-radios__label" for="q2--5">1. Very difficult</label>
                      </div>
                    </div>
                  </fieldset>

                  <fieldset class="govuk-fieldset" id="question3">
                    <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
                      Overall, how did you feel about the service you accessed today?
                    </legend>
                    <div class="govuk-radios">
                      <div class="govuk-radios__item">
                        <input class="govuk-radios__input" id="q3-" name="q3-" type="radio" value="Very satisfied">
                        <label class="govuk-label govuk-radios__label" for="q3-">5. Very satisfied</label>
                      </div>
                      <div class="govuk-radios__item">
                        <input class="govuk-radios__input" id="q3--2" name="q3-" type="radio" value="Satisfied">
                        <label class="govuk-label govuk-radios__label" for="q3--2">4. Satisfied</label>
                      </div>
                      <div class="govuk-radios__item">
                        <input class="govuk-radios__input" id="q3--3" name="q3-" type="radio" value="Neither satisfied nor dissatisfied">
                        <label class="govuk-label govuk-radios__label" for="q3--3">3. Neither satisfied nor dissatisfied</label>
                      </div>
                      <div class="govuk-radios__item">
                        <input class="govuk-radios__input" id="q3--4" name="q3-" type="radio" value="Dissatisfied">
                        <label class="govuk-label govuk-radios__label" for="q3--4">2. Dissatisfied</label>
                      </div>
                      <div class="govuk-radios__item">
                        <input class="govuk-radios__input" id="q3--5" name="q3-" type="radio" value="Very dissatisfied">
                        <label class="govuk-label govuk-radios__label" for="q3--5">1. Very dissatisfied</label>
                      </div>
                    </div>
                  </fieldset>

                  <label class="govuk-label govuk-label--m" for="q4-">
                    Why did you give these scores?
                  </label>
                  <textarea class="govuk-textarea" id="q4-" name="q4-" rows="5"></textarea>

                  <fieldset class="govuk-fieldset" id="question5">
                    <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
                        If you had not used webchat today, how else would you have contacted us?
                    </legend>
                    <div class="govuk-radios" data-module="govuk-radios">
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
                            <input class="govuk-radios__input" id="q5--4" name="q5-" type="radio" value="Other" aria-controls="conditional-contact">
                            <label class="govuk-label govuk-radios__label" for="q5--4">Other</label>
                        </div>
                         <div class="govuk-radios__conditional govuk-radios__conditional--hidden" id="conditional-contact">
                            <div class="govuk-form-group">
                                <label class="govuk-label" for="q6-">Provide other contact option</label>
                                <textarea class="govuk-textarea" id="q6-" name="q6-" rows="5"></textarea>
                            </div>
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

    $('input[name="q5-"]').on('click', function() {
       if ($(this).val() != 'Other') {
            document.getElementById("q6-").value = "";
       }
    });
  }

  detach() {
    this.container.removeChild(this.wrapper)
  }
}
