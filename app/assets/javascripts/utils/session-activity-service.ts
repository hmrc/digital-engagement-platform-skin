export default class SessionActivityService {
    activityChannel: any;

    constructor(BrowserBroadcastChannel: any) {
        this.activityChannel = BrowserBroadcastChannel && new BrowserBroadcastChannel('session-activity');
    }

    logActivity() {
        if (this.activityChannel) {
            const event = { timestamp: Date.now() };
            this.activityChannel.postMessage(event);
            console.log('EVENT SAS', event)
        }
    }
}