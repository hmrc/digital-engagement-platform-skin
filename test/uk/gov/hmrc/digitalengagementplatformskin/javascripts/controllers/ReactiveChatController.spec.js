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
