import ClickToChatButton from '../../../../../../../app/assets/javascripts/utils/ClickToChatButton'


describe("ClickToChatButton", () => {
    it("cteates a ClickToChatButton", () => {
        
        let div = document.createElement("div");
        div.setAttribute("id", "HMRC_Fixed_1");
        div.setAttribute("class", "hmrc-fixed-available");
        document.body.appendChild(div);
        
        console.log("------------------------document.body.innerHTML spec = " + document.body.innerHTML);
        let divId = document.createElement("div");
        divId.setAttribute("class", "c2cButton");
        divId.innerHTML = "ReadyText";
       
        const buttonClass = '<div class="hmrc-fixed-available">ReadyText</div>'

        const clickToChatButton = new ClickToChatButton(divId, buttonClass);
        
        let clickToChatButtonSpy = jest.spyOn(divId, 'appendChild').mockImplementation();
        clickToChatButton.replaceChild(div);

        expect(clickToChatButtonSpy).toHaveBeenCalledTimes(1);
    });
});
