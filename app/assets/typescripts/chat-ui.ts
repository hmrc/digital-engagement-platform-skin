import ReactiveChatController from '../javascripts/controllers/ReactiveChatController';
import ProactiveChatController from '../javascripts/controllers/ProactiveChatController';
import CommonChatController from '../javascripts/controllers/CommonChatController';

function safeHandler(f) {
  
    return function () {
      try {
        f.apply(null, arguments);
      } catch (e) {
        console.error(`!!!! handler for ${f.name}: got exception `, e);
      }
    };
  }

  declare global {
    interface Window {
        chatId:any;
        agentId:string;
        nuanceFrameworkLoaded:any;
        InqRegistry:object;
        nuanceReactive_HMRC_CIAPI_Fixed_1:any;
        nuanceReactive_HMRC_CIAPI_Anchored_1: any;
        nuanceProactive:any;
    }
}

  const chatListener = {
    onAnyEvent: function (evt: any) {
      console.log('Chat any event:', evt);
      window.chatId = evt.chatID;
      window.agentId = evt.agentID;
    },
    onC2CStateChanged: function (evt: any) {
      console.log('C2C state changed...');
    },
  };

  export function hookWindow(w: Window) {
    var commonChatController = new CommonChatController();
    var reactiveChatController = new ReactiveChatController();
    var proactiveChatController = new ProactiveChatController();

    w.InqRegistry = {
        listeners: [chatListener],
      };


      w.nuanceFrameworkLoaded = safeHandler(function nuanceFrameworkLoaded() {
        commonChatController.nuanceFrameworkLoaded(w);
      });

      w.nuanceReactive_HMRC_CIAPI_Fixed_1 = safeHandler(
        function nuanceReactive_HMRC_CIAPI_Fixed_1(c2cObj) {
          reactiveChatController.addC2CButton(
            c2cObj,
            'HMRC_CIAPI_Fixed_1',
            'fixed'
          );
        }
      );

      w.nuanceReactive_HMRC_CIAPI_Anchored_1 = safeHandler(
        function nuanceReactive_HMRC_CIAPI_Anchored_1(c2cObj) {
          reactiveChatController.addC2CButton(
            c2cObj,
            'HMRC_CIAPI_Anchored_1',
            'anchored'
          );
        }
      );

      w.nuanceProactive = safeHandler(function nuanceProactive(obj) {
        console.log('### PROACTIVE', obj);
        proactiveChatController.launchProactiveChat();
      });
  }