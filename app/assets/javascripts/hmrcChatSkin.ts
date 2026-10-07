import * as chatUi from './chat-ui'
import CommonChatController from './controllers/CommonChatController'
import ReactiveChatController from './controllers/ReactiveChatController'
import ProactiveChatController from './controllers/ProactiveChatController';
import initializeSDK from './controllers/NavSDKInit'
import ChatSdk, {
    ChatEvent,
    EnvironmentName,
    ChatEventData,
    Thread,
    LivechatThread,
    SecureSessions,
    isContactStatusChangedEvent,
    isMessageCreatedEvent,
    isMessageSentEvent,
} from "@nice-devone/nice-cxone-chat-web-sdk";





/*async function initializeSDKaa() {
    const sdk = new ChatSdk({
        brandId: Number(1027),
        channelId: 'chat_2eb777e8-4c6f-4728-af23-26329f3ab463',
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
}*/

await initializeSDK();
chatUi.hookWindow(
    window,
    new CommonChatController,
    new ReactiveChatController,
    new ProactiveChatController
);

//chatUi.navLauncher( new ProactiveChatController);


//startChat();




async function startChat() {
    // 1. Initialize.
    console.log('Initialize');
    // Initialize Chat SDK with required options
    const chatSdkOptions: {
        brandId: number;
        channelId: string;
        customerId: string | undefined;
        environment: string;
        customEnvironment: { chat: string; gateway: string; authorize: string; name: string };
        isLivechat: boolean;
        securedSession: SecureSessions;
        cacheStorage: null;
        storage: null;
        onError: (error) => void;
        appName: string
    } = {
        brandId: Number(1027),
        channelId: 'chat_2eb777e8-4c6f-4728-af23-26329f3ab463',
        customerId:
            localStorage.getItem(123) || crypto?.randomUUID(),
        // use your environment from  EnvironmentName enum
        environment: 'custom',
        customEnvironment:
             {

                    chat: 'https://channels-de-uk3.nicecxone-sov2.uk',
                    gateway: 'wss://chat-gw-de-uk3.nicecxone-sov2.uk',
                 authorize: 'https://digital-oauth-de-uk3.nicecxone-sov2.uk',
                    name: 'https://channels-de-uk3.nicecxone-sov2.uk',
                }
                ,
        isLivechat: false,
        securedSession: SecureSessions.ANONYMOUS,
        cacheStorage: null,
        storage: null,
        onError: (error) => {
            console.error('Chat SDK error:', error);
        },
        appName: 'Nice Chat SDK Demo',
    };

const sdk =new ChatSdk({
    brandId: Number(1027),
    channelId: 'chat_2eb777e8-4c6f-4728-af23-26329f3ab463',
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

    /*const sdk = new ChatSdk({
        customEnvironment:
            {

                chat: 'https://channels-de-uk3.nicecxone-sov2.uk',
                gateway: 'wss://chat-gw-de-uk3.nicecxone-sov2.uk',
                authorize: 'https://digital-oauth-de-uk3.nicecxone-sov2.uk',
                name: 'https://channels-de-uk3.nicecxone-sov2.uk',
            },
        brandId: 1027,
        channelId: 'chat_2eb777e8-4c6f-4728-af23-26329f3ab463',
        isLivechat: false,
        customerId: "generateId", // a stable per-user id in real apps
        environment: EnvironmentName.custom,
        storage: null,
        cacheStorage: null,
        onError: (error) => console.error('Chat SDK error:', error)
    });*/

    // 2. (Optional) Check availability before showing any UI.
    const { status } = await sdk.getChannelAvailability();
    if (status === 'offline') {
        console.log('No agents available right now.');
    }

    // 3. Connect once.
    await sdk.connect();
    console.log('sdk.', sdk);
    // 4. Open a thread and listen for messages.
    const thread = sdk.getThread("generateId");
    thread.onThreadEvent(
        ChatEvent.MESSAGE_CREATED,
        (event: CustomEvent<ChatEventData>) => {
            if (isMessageCreatedEvent(event.detail)) {
                console.log('Message:', event.detail.data.message);
            }
        },
    );

    // 5. Send the first message.
    console.log("hello inside sdk initialization",thread );
    await thread.sendTextMessage('Hi there!');
}

//startChat();

