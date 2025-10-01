import { messages } from "../../../../../../../app/assets/javascripts/utils/Messages";
import { timerUtils } from "../../../../../../../app/assets/javascripts/utils/TimerUtils";

describe("TimerUtils", () => {
    beforeEach(() => {
        timerUtils.businessAreaTitle = 'National Clearance Hub'
        document.title = 'National Clearance Hub'
        jest.useFakeTimers()
        timerUtils.intervalId = null
        timerUtils.displayingBusinessAreaName = true
        timerUtils.updatedPageTitle = ''
    })

    afterEach(() => {
        jest.clearAllTimers()
    });

    it("updateAndTogglePageTitle creates a new interval to alternate the document title between the state and National Clearance Hub", () => {
        const intervalSpy = jest.spyOn(global, 'setInterval');
        timerUtils.updateAndTogglePageTitle(messages.busyHeading);
        
        expect(timerUtils.updatedPageTitle).toBe(messages.busyHeading);
        expect(document.title).toBe(messages.busyHeading);
        expect(timerUtils.displayingBusinessAreaName).toBe(false);
        expect(intervalSpy).toHaveBeenCalledTimes(1);
        expect(intervalSpy).toHaveBeenLastCalledWith(expect.any(Function), 2000);
        expect(timerUtils.intervalId).not.toBe(null);
        
        jest.advanceTimersByTime(2000);
        expect(document.title).toBe('National Clearance Hub');
        expect(timerUtils.displayingBusinessAreaName).toBe(true);

        jest.advanceTimersByTime(2000);
        expect(document.title).toBe(messages.busyHeading);""
        expect(timerUtils.displayingBusinessAreaName).toBe(false);

        timerUtils.updateAndTogglePageTitle(messages.busyHeading);

        jest.advanceTimersByTime(2000);
        expect(document.title).toBe('National Clearance Hub');
        expect(timerUtils.displayingBusinessAreaName).toBe(true);

        jest.advanceTimersByTime(2000);
        expect(document.title).toBe(messages.busyHeading);
        expect(timerUtils.displayingBusinessAreaName).toBe(false);
    });

    it("updateAndTogglePageTitle creates a new interval which alternates the document title between the state and National Clearance Hub. It then receives another argument which is different to the original", () => {
        const intervalSpy = jest.spyOn(global, 'setInterval');
        timerUtils.updateAndTogglePageTitle(messages.busyHeading);

        expect(timerUtils.updatedPageTitle).toBe(messages.busyHeading);
        expect(document.title).toBe(messages.busyHeading);
        expect(timerUtils.displayingBusinessAreaName).toBe(false);
        expect(intervalSpy).toHaveBeenCalledTimes(1);
        expect(intervalSpy).toHaveBeenLastCalledWith(expect.any(Function), 2000);
        expect(timerUtils.intervalId).not.toBe(null);
        
        jest.advanceTimersByTime(2000);
        expect(document.title).toBe('National Clearance Hub');
        expect(timerUtils.displayingBusinessAreaName).toBe(true);

        jest.advanceTimersByTime(2000);
        expect(document.title).toBe(messages.busyHeading);
        expect(timerUtils.displayingBusinessAreaName).toBe(false);

        timerUtils.updateAndTogglePageTitle(messages.readyHeading);
        expect(timerUtils.updatedPageTitle).toBe(messages.readyHeading);
        expect(document.title).toBe(messages.readyHeading);
        expect(timerUtils.displayingBusinessAreaName).toBe(false);

        jest.advanceTimersByTime(2000);
        expect(document.title).toBe('National Clearance Hub');
        expect(timerUtils.displayingBusinessAreaName).toBe(true);

        jest.advanceTimersByTime(2000);
        expect(document.title).toBe(messages.readyHeading);
        expect(timerUtils.displayingBusinessAreaName).toBe(false);

        timerUtils.updateAndTogglePageTitle(messages.outofhours);
        expect(timerUtils.updatedPageTitle).toBe(messages.outofhours);
        expect(document.title).toBe(messages.outofhours);
        expect(timerUtils.displayingBusinessAreaName).toBe(false);

        jest.advanceTimersByTime(2000);
        expect(document.title).toBe('National Clearance Hub');
        expect(timerUtils.displayingBusinessAreaName).toBe(true);

        jest.advanceTimersByTime(2000);
        expect(document.title).toBe(messages.outofhours);
        expect(timerUtils.displayingBusinessAreaName).toBe(false);
    });

    it("updateAndTogglePageTitleOnce changes the document title to speaking to an adviser and changes it back to National Clearance Hub", () => {
        const timeoutSpy = jest.spyOn(global, 'setTimeout');
        timerUtils.updateAndTogglePageTitleOnce();

        expect(timeoutSpy).toHaveBeenCalledTimes(1);
        expect(timeoutSpy).toHaveBeenLastCalledWith(expect.any(Function), 2000);
        expect(document.title).toBe(messages.adviser);
        
        jest.advanceTimersByTime(2000);
        expect(document.title).toBe('National Clearance Hub');
    });

      it("stopTogglingPageTitle stops the two second interval, clears the intervalId and sets the document title to the business area title", () => {
        timerUtils.intervalId = 101;
        const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
        timerUtils.stopTogglingPageTitle();

        expect(clearIntervalSpy).toHaveBeenCalledTimes(1);
        expect(clearIntervalSpy).toHaveBeenCalledWith(101);
        expect(timerUtils.intervalId).toBe(null)
        expect(document.title).toBe('National Clearance Hub')
        expect(timerUtils.displayingBusinessAreaName).toBe(true)
    });
});