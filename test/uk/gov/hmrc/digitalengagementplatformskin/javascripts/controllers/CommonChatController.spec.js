import CommonChatController from '../../../../../../../app/assets/javascripts/controllers/CommonChatController';
import {getTextAreaValue} from '../../../../../../../app/assets/javascripts/controllers/CommonChatController';

//const jsdom = require("jsdom");
//const { JSDOM } = jsdom;

//const textareaValue = 'My-value';
//const dom = new JSDOM(`
//<!DOCTYPE html>
//<body>
 //<textarea id="textarea" value="${textareaValue}"></textarea>
//</body>
//`);

//const { document } = dom;

let spy;
beforeAll(() => {
    spy = jest.spyOn(document, 'getElementById');
});

describe("CommonChatController", () => {
    
    afterEach(() => {
        //document.getElementsByTagName('html')[0].innerHTML = ''; 
      });

      let mockElement;
    beforeAll(() => {
      // here you create the element that the document.createElement will return
      // it might be even without an id
      mockElement = document.createElement("div");
      spy.mockReturnValue(mockElement);
    });

 

      

    it("getTextAreaValue returns an Element object", () => {
        const commonChatController = new CommonChatController();
        //const getTextAreaValue = jest.spyOn(commonChatController, 'getTextAreaValue').mockImplementation((val) => (val));

        //document.body.innerHTML = `<div id="textarea" />`;
        document.body.innerHTML = '<!DOCTYPE html><body><textarea id="textarea" value="test"></textarea></body>';

        //document.getElementById = jest.fn().mockImplementation((id) => (id === 'estateList' ? 'estateList-dom' : null));

        

        expect(commonChatController.getTextAreaValue("hello")).toContain("dfdfdf");

        //expect().toEqual({ 
         //   id: 1,
         //   text: textareaValue
         // });


    

        //const getTextAreaValue = jest.spyOn(commonChatController, 'onPostChatSurveyWebchatSubmitted').;

        //commonChatController.onPostChatSurveyWebchatSubmitted(document);


        //expect(getTextAreaValue).toHaveReturnedWith
    });
});
