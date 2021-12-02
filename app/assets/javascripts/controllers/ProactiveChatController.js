
import CommonChatController from './CommonChatController'

export default class ProactiveChatController {
    constructor() {
        this.commonChatController = new CommonChatController();
    }

    launchProactiveChat() {
        this.commonChatController._launchChat();
    }
}
