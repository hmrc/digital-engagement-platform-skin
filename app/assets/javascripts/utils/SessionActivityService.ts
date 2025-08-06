export default class SessionActivityService {
    activityChannel: BroadcastChannel
    constructor(BrowserBroadcastChannel: typeof BroadcastChannel) {
        this.activityChannel = BrowserBroadcastChannel && new BrowserBroadcastChannel('session-activity');
    }

    logActivity(): void {
        if (this.activityChannel) {
            const event: { timestamp: number } = { timestamp: Date.now() };
            this.activityChannel.postMessage(event);
        }
    }
}