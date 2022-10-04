import CommonPostChatSurvey from "./CommonPostChatSurvey"

const html = `
<div id="postChatSurvey">
  <h2 id="legend_give_feedback" tabindex="-1">Give feedback</h2>

  <p>We use your feedback to improve our services. These questions are optional.</p>

  <div>
    <p>You can still <a href="javascript:void(0);" id="printPostChat">print or save your chat</a>.</p>
  </div>

  <div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">

      <form method='POST'>

        <div class="govuk-form-group">

          <fieldset class="govuk-fieldset govuk-!-margin-bottom-5" id="question1">
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
              Were you able to do what you needed to do today?
            </legend>
            <div class="govuk-radios govuk-radios--inline">
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="q1-" name="q1-" type="radio" value="Yes">
                <label class="govuk-label govuk-radios__label" for="q1-">Yes</label>
              </div>
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="q1--2" name="q1-" type="radio" value="No">
                <label class="govuk-label govuk-radios__label" for="q1--2">No</label>
              </div>
            </div>
          </fieldset>

          <fieldset class="govuk-fieldset govuk-!-margin-bottom-5" id="question2">
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
              How easy was it to do what you needed to do today?
            </legend>
            <div class="govuk-radios" data-module="govuk-radios">
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="q2-" name="q2-" type="radio" value="Very easy">
                <label class="govuk-label govuk-radios__label" for="q2-">Very easy</label>
              </div>
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="q2--2" name="q2-" type="radio" value="Easy">
                <label class="govuk-label govuk-radios__label" for="q2--2">Easy</label>
              </div>
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="q2--3" name="q2-" type="radio"
                       value="Neither easy nor difficult">
                <label class="govuk-label govuk-radios__label" for="q2--3">Neither easy nor difficult</label>
              </div>
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="q2--4" name="q2-" type="radio" value="Difficult">
                <label class="govuk-label govuk-radios__label" for="q2--4">Difficult</label>
              </div>
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="q2--5" name="q2-" type="radio" value="Very difficult">
                <label class="govuk-label govuk-radios__label" for="q2--5">Very difficult</label>
              </div>
            </div>
          </fieldset>

          <fieldset class="govuk-fieldset govuk-!-margin-bottom-5" id="question3">
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
              Overall, how did you feel about the service you received today?
            </legend>
            <div class="govuk-radios">
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="q3-" name="q3-" type="radio" value="Very satisfied">
                <label class="govuk-label govuk-radios__label" for="q3-">Very satisfied</label>
              </div>
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="q3--2" name="q3-" type="radio" value="Satisfied">
                <label class="govuk-label govuk-radios__label" for="q3--2">Satisfied</label>
              </div>
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="q3--3" name="q3-" type="radio"
                       value="Neither satisfied nor dissatisfied">
                <label class="govuk-label govuk-radios__label" for="q3--3">Neither satisfied nor dissatisfied</label>
              </div>
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="q3--4" name="q3-" type="radio" value="Dissatisfied">
                <label class="govuk-label govuk-radios__label" for="q3--4">Dissatisfied</label>
              </div>
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="q3--5" name="q3-" type="radio" value="Very dissatisfied">
                <label class="govuk-label govuk-radios__label" for="q3--5">Very dissatisfied</label>
              </div>
            </div>
          </fieldset>

          <label class="govuk-label govuk-label--m" for="q4-">
            Why did you give these scores?
          </label>
          <textarea class="govuk-textarea" id="q4-" name="q4-" rows="5"></textarea>

          <fieldset class="govuk-fieldset govuk-!-margin-bottom-5" id="question5">
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
              How would you prefer to get in touch with HMRC?
            </legend>
            <div class="govuk-radios" data-module="govuk-radios">

              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="q5-" name="q5-" type="radio"
                       value="Online webchat with HMRC adviser">
                <label class="govuk-label govuk-radios__label" for="q5-">Online webchat with HMRC adviser</label>
              </div>

              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="q5--2" name="q5-" type="radio"
                       value="Social media messaging (such as, WhatsApp and Twitter)">
                <label class="govuk-label govuk-radios__label" for="q5--2">Social media messaging (such as, WhatsApp and
                  Twitter)</label>
              </div>

              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="q5--3" name="q5-" type="radio" value="Phone">
                <label class="govuk-label govuk-radios__label" for="q5--3">Phone</label>
              </div>

              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="q5--4" name="q5-" type="radio" value="Other"
                       aria-controls="conditional-contact">
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

export default class PostChatSurveyWebchat extends CommonPostChatSurvey {
  constructor(onSubmitted) {
    super(html, onSubmitted)
}
}
