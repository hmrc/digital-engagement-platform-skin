import { StateType } from '../types';
import CommonChatController from './CommonChatController'

export default class ProactiveChatController {
    commonChatController: CommonChatController;
    constructor() {
        this.commonChatController = new CommonChatController();
    }

    launchProactiveChat(obj: { state: StateType }): void {
        let proactiveObj: { state: StateType, type: string } = {
            state: obj.state,
            type: 'proactive'
        }
        this.commonChatController._launchChat(proactiveObj);
    }
}