import ClickToChatButtons from '../utils/ClickToChatButtons'
import ClickToChatButton from '../utils/ClickToChatButton'
import CommonChatController from './CommonChatController'
import * as DisplayState from '../NuanceDisplayState'
import { messages} from '../utils/Messages'

const c2cDisplayStateMessages = {
    [DisplayState.OutOfHours]: messages.outofhours,
    [DisplayState.Ready]: messages.ready,
    [DisplayState.Busy]: messages.busy,
    [DisplayState.ChatActive]: messages.active
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
        if (c2cObj.displayState == "ready") {
            this.c2cButtons.addButton(
                c2cObj,
                new ClickToChatButton(document.getElementById(divID), buttonClass),
                divID
            );
        }
    }

    _onC2CButtonClicked(c2cIdx) {
        const reactiveObj= {
            type: 'reactive'
        }
        this.sdk = window.Inq.SDK;
        this.sdk.onC2CClicked(c2cIdx, (state) => {
            this.commonChatController._launchChat(reactiveObj);
        });
    }
}
