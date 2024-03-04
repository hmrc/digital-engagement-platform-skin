import CommonChatController from './CommonChatController'

export default class ProactiveChatController {
    constructor() {
        this.commonChatController = new CommonChatController();
    }

    launchProactiveChat(obj) {
        let proactiveObj = {
            state: obj.state,
            type: 'proactive'
        }
        this.commonChatController._launchChat(proactiveObj);
    }
}