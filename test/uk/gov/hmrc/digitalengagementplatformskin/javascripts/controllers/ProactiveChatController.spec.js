import CommonChatController from '../../../../../../../app/assets/javascripts/controllers/CommonChatController'
import ProactiveChatController from '../../../../../../../app/assets/javascripts/controllers/ProactiveChatController'

describe("ProactiveChatController", () => {

    afterEach(() => {
        document.getElementsByTagName('html')[0].innerHTML = ''; 
    });

    it("launches a proactive chat", () => {
        console.error = jest.fn();
        const commonChatController = new CommonChatController();
        const proactiveChatController = new ProactiveChatController();
        var html = `
          <span class="govuk-phase-banner__text">
            This is a new service – your <a class="govuk-link" href="xxx">feedback</a> will help us to improve it.
          </span>
          <a hreflang="en" class="govuk-link hmrc-report-technical-issue " rel="noreferrer noopener" target="_blank" href="xxx" lang="en">
            Is this page not working properly? (opens in new tab)
          </a>
          <a class="govuk-footer__link" href="xxx">
            Cookies
          </a>
          <a class="govuk-footer__link" href="xxx">
            Accessibility statement
          </a>
        `;

        document.body.innerHTML = html;

        let spy = jest.spyOn(commonChatController, 'updateDav3DeskproRefererUrls').mockImplementation(() => {});

        const sdk = {
            isChatInProgress: jest.fn().mockReturnValue(false),
            getOpenerScripts: jest.fn().mockReturnValue(null),
            chatDisplayed: jest.fn()
        };

        window.Inq = {
            SDK: sdk
        };

        commonChatController.nuanceFrameworkLoaded(window);
        proactiveChatController.launchProactiveChat({state: 'show'});

        expect(sdk.getOpenerScripts).toHaveBeenCalledTimes(1);
        expect(sdk.chatDisplayed).toHaveBeenCalledTimes(1);
    });
});
