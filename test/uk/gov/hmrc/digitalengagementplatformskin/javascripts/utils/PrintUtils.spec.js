import PrintUtils from "../../../../../../../app/assets/javascripts/utils/PrintUtils";


describe("PrintUtils", () => {

    it("getPrintDate should be called once", () => {
        var getPrintDateSpy = jest.spyOn(PrintUtils, 'getPrintDate');
    
        PrintUtils.getPrintDate();
    
        expect(getPrintDateSpy).toBeCalledTimes(1);
      });

});
