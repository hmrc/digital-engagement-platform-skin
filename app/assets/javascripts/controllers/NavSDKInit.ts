import ChatSdk, {EnvironmentName, SecureSessions} from "@nice-devone/nice-cxone-chat-web-sdk";



 async function   initializeSDK() {
     console.log("navChannelID----",navChannelID);
     console.log("host:  ",window.location.hostname)
    const sdk = new ChatSdk({
        brandId: Number(1027),
        //channelId: 'chat_2eb777e8-4c6f-4728-af23-26329f3ab463',
        channelId: navChannelID,
        customerId: 'navCustId',
        customerName: 'navCust' || undefined,
        environment: EnvironmentName.custom,
        customEnvironment: {

            chat: 'https://channels-de-uk3.nicecxone-sov2.uk',
            gateway: 'wss://chat-gw-de-uk3.nicecxone-sov2.uk',
            authorize: 'https://digital-oauth-de-uk3.nicecxone-sov2.uk',
            name: 'https://channels-de-uk3.nicecxone-sov2.uk',
        },
        isLivechat: true,
        securedSession: SecureSessions.ANONYMOUS,
        storage: null,
        cacheStorage: null,
        appName: 'CXone Cognigy test harness',
        onError: (err) => {
            console.log('SDK error', String(err?.message || err));
        }
    });

    await sdk.connect();

    const threadId=crypto.randomUUID();
    sessionStorage.setItem("runningThreadID", threadId);
    const thread = sdk.getThread(threadId);
    console.log("threadId  ",threadId );
    console.log("thread  ",thread );
    window.sdk = sdk;
    window.thread=thread;
}

export default initializeSDK;