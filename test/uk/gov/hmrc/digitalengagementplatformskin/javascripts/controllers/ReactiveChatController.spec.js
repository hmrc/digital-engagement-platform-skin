<<<<<<< HEAD
import CommonChatController from '../../../../../../../app/assets/javascripts/controllers/CommonChatController'
import ReactiveChatController from '../../../../../../../app/assets/javascripts/controllers/ReactiveChatController'
import ClickToChatButtons from '../../../../../../../app/assets/javascripts/utils/ClickToChatButtons'
import ClickToChatButton from '../../../../../../../app/assets/javascripts/utils/ClickToChatButton'

describe("ReactiveChatController", () => {
    it("launches a reactive chat", () => {

        const commonChatController = new CommonChatController();
        const reactiveChatController = new ReactiveChatController();
        // const addC2CButton = new ClickToChatButton();
        const clickToChatButtons = new ClickToChatButtons();
        // const clickToChatButton = new ClickToChatButton();
        //const getDisplayStateText = jest.fn("chatactive");

        // const displayState = {
        //     name: "chatactive"
        // };

        let c2cObj = {
            c2cIdx: "c2cId",
            displayState: "chatactive",
            launchable: true
        };
        // const buttonText = getDisplayStateText;
        const button = "buttonClass";
        // const innerHTML = `<div class="${button.buttonClass} ${c2cObj.displayState}">${buttonText}</div>`;
        // const buttonClass = {
        //     button: addC2CButton
        // };
        // const div = button.replaceChild(innerHTML);
        // const divID = {
        //     divID: "HMRC_CIAPI_Anchored_1"
        // };
        // const displayStateMessages = {
        //     displayStateMessages: jest.fn()
        // };

        const sdk = {
            isChatInProgress: jest.fn().mockReturnValue(false),
            //     getOpenerScripts: jest.fn().mockReturnValue(null),
            //     button: jest.fn().mockReturnValue(null),
            //displayStateMessages: jest.fn("chatactive"),
            chatDisplayed: jest.fn()
        };

        window.Inq = {
            SDK: sdk
        };

        // const displayStateMessages = {
        //     displayStateMessages: jest.fn("chatactive")
        // };

        // window.DisplayState = {
        //     displayStateMessages: displayStateMessages
        // };

        commonChatController.nuanceFrameworkLoaded(window);
        clickToChatButtons.updateC2CButtonsToInProgress();
        //clickToChatButtons.displayStateMessages(displayStateMessages);
        //clickToChatButtons.onClicked;
        clickToChatButtons.addButton(c2cObj, button);
        //clickToChatButtons.displayStateMessages;
        // clickToChatButton.replaceChild(div);
        // reactiveChatController.addC2CButton(c2cObj, divID, buttonClass);
        reactiveChatController.addC2CButton();

        // expect(sdk.getOpenerScripts).toHaveBeenCalled();
        expect(sdk.chatDisplayed).toHaveBeenCalled();
        // expect(displayStateMessages.displayStateMessages).toHaveBeenCalled();
    });
});
=======
// import CommonChatController from '../../../../../../../app/assets/javascripts/controllers/CommonChatController';
// import ReactiveChatController from '../../../../../../../app/assets/javascripts/controllers/ReactiveChatController';

// describe("ReactiveChatController", () => {
//     it("launches a reactrive chat", () => {
//         const commonChatController = new CommonChatController();
//         const reactiveChatController = new ReactiveChatController();
        
//         // const addC2CButton = {
//         //         c2cObj: jest.fn(), 
//         //         divID: jest.fn(), 
//         //         buttonClass: jest.fn()
//         // }
//         // console.log("addC2CButton = " + addC2CButton);
        
//         const c2cObj = {
//             c2cIdx: jest.fn(),
//             displayState: jest.fn(),
//             launchable: jest.fn().mockReturnValue(false)
//         };
//         const divID = jest.fn("HMRC_CIAPI_Anchored_1");
//         const buttonClass = jest.fn().mockReturnValue("div");
        
//         console.log("c2cObj = " + c2cObj.c2cIdx.mockImplementation);
//         console.log("displayState = " + c2cObj.displayState.mockImplementation);
//         console.log("launchable = " + c2cObj.launchable.mockImplementation);
//         console.log("divID = " + divID.value);
//         console.log("buttonClass = " + buttonClass.value);

//         const sdk = {
//             isChatInProgress: jest.fn().mockReturnValue(false),
//             getOpenerScripts: jest.fn().mockReturnValue(null),
//             chatDisplayed: jest.fn()
//         }
    

//         window.Inq = {
//             SDK: sdk
//         };

//         commonChatController.nuanceFrameworkLoaded(window);
//         reactiveChatController.addC2CButton(c2cObj, divID, buttonClass);

//         expect(window.addC2CButton).toHaveBeenCalledTimes(1);
//         expect(sdk.getOpenerScripts).toHaveBeenCalled();
//         expect(sdk.chatDisplayed).toHaveBeenCalled();
//     });
// });


{/* <div id="HMRC_CIAPI_Anchored_1">
    <div class="c2cButton">
        <div class="anchored ready">Ask HMRC a question</div>
    </div>
</div> */}

// text-size-adjust: 100%;
// position: fixed;
// bottom: 0;
// right: 50px;
// color: #0b0c0c;
// font-family: "GDS Transport",arial,sans-serif;
// -webkit-font-smoothing: antialiased;
// font-weight: 400;
// margin-top: 0;
// font-size: 19px;
// line-height: 1.3157894737;
// margin-bottom: 2px;

// const myMock = jest.fn();
// console.log(myMock());
// // > undefined

// myMock.mockReturnValueOnce(10).mockReturnValueOnce('x').mockReturnValue(true);

// console.log(myMock(), myMock(), myMock(), myMock());

// addC2CButton(c2cObj, divID, buttonClass) {
//       this.c2cButtons.addButton(
//           c2cObj,
//           new ClickToChatButton(document.getElementById(divID), buttonClass)
//       );
//   }

// replaceChild(innerHTML) {
//     const buttonDiv = this.parentElement.ownerDocument.createElement("div");
//     buttonDiv.setAttribute("class", "c2cButton");
//     buttonDiv.innerHTML = innerHTML;

//     this.parentElement.innerHTML = "";
//     this.parentElement.appendChild(buttonDiv);

//     return buttonDiv;
// }
>>>>>>> main
