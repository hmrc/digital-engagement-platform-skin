export default class SessionActivityService {
    activityChannel: any;

    constructor(BrowserBroadcastChannel: any) {
        this.activityChannel = BrowserBroadcastChannel && new BrowserBroadcastChannel('session-activity');

        this.activityChannel = new window.BroadcastChannel('session-activity')
    }

    logActivity() {
        if (this.activityChannel) {
            const event = { timestamp: Date.now() };
            this.activityChannel.postMessage(event);
        }
    }
}