import ChatSdk, {EnvironmentName, SecureSessions} from "@nice-devone/nice-cxone-chat-web-sdk";



 async function   initializeSDK() {
     //console.log("niceChannelId----",niceChannelId);
     console.log("host:  ",window.location.hostname)
     console.log("window.location:  ",window.location)
     console.log("window.niceChannelId:  ",window.niceChannelId)
     console.log("window.niceIsLiveThread:  ",window.isLiveThread)
     console.log("window.appName:  ",window.applicationName)
     const niceChannelId=window.niceChannelId;
     const applicationName=window.applicationName;
     /*const custId= crypto.randomUUID();*/
     const custId= "navnavnavnav";
     const custName= applicationName+custId;
    const sdk = new ChatSdk({
        brandId: Number(1027),
        //channelId: 'chat_2eb777e8-4c6f-4728-af23-26329f3ab463',
        channelId: niceChannelId,
        customerId: custId,
        customerName: custName || undefined,
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
        appName: applicationName,
        onError: (err) => {
            console.log('SDK error', String(err?.message || err));
        },
        onRawEvent: (event: any) => {
            console.debug(
                'CXone raw event:',
                event
            );
        }
    });

    await sdk.connect();

     console.log('sdk object', sdk);
     var threadId=sessionStorage.getItem("runningThreadID")
     console.log("threadId available in session",threadId)
     if(!threadId || threadId==="null") {
        const  threadIdN = crypto.randomUUID();
         sessionStorage.setItem("runningThreadID", threadIdN);
         sessionStorage.setItem("isFreshChat", true);
         const thread = sdk.getThread(threadIdN);
         console.log("sdk  ", sdk);
         console.log("thread  ", thread);
         window.sdk = sdk;
         window.thread = thread;

     }else{
         console.log("recovering thread")
         const thread = sdk.getThread(String(threadId));
         console.log("thread  ", thread);
         sessionStorage.setItem("isFreshChat", false);
         const rec = await thread.recover();
         console.log("recovering thread", rec);
         window.sdk = sdk;
         window.thread = thread;
         window.recoveredMessages=Array.from(rec.messages ?? []).reverse();
         /*console.log("Shutting down the sdk window.sdk.getWebsocketClient() ", window.sdk.getWebsocketClient());
         window.thread.endChat();
         window.sdk.getWebsocketClient()?.disconnect();*/
     }
}
window.addEventListener("pageshow", () => {
    const navigation = performance.getEntriesByType(
        "navigation"
    )[0] as PerformanceNavigationTiming | undefined;

    if (navigation?.type === "reload") {
        console.log("Page was refreshed");
    }
});
export default initializeSDK;