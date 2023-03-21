import ClickToChatButtons from '../utils/ClickToChatButtons'
import ClickToChatButton from '../utils/ClickToChatButton'
import CommonChatController from './CommonChatController'
import * as DisplayState from '../NuanceDisplayState'

const c2cDisplayStateMessages = {
    [DisplayState.OutOfHours]: "Out of hours",
    [DisplayState.Ready]: "Ask HMRC a question",
    [DisplayState.Busy]: "All advisers are busy",
    [DisplayState.ChatActive]: "In progress"
};

export default class ReactiveChatController {
    constructor() {
        this.sdk = null;
        this.c2cButtons = new ClickToChatButtons(this._clickToChatCallback(), c2cDisplayStateMessages);
        this.commonChatController = new CommonChatController();
    }

    _clickToChatCallback() {
        return (c2cIdx) => this._onC2CButtonClicked(c2cIdx)
    }

    addC2CButton(c2cObj, divID, buttonClass) {
        this.c2cButtons.addButton(
            c2cObj,
            new ClickToChatButton(document.getElementById(divID), buttonClass)
        );
    }

    _onC2CButtonClicked(c2cIdx) {
        this.sdk = window.Inq.SDK;
        this.sdk.onC2CClicked(c2cIdx, (state) => {
            this.commonChatController._launchChat();
        });
    }
}
