import { container } from 'webpack';
import Popup from '../../../../../../../app/assets/javascripts/views/EndChatPopup'

describe('EndChatPopup', () => {
	let ecp;
	let events = {};
    let wrapper;

	beforeEach(() => {
        let container = document.createElement("div");
        let eventHandler = (jest.fn(), jest.fn());
        ecp = new Popup(container, eventHandler);

        wrapper = ecp.wrapper;

		events = {};

		wrapper.addEventListener = jest.fn((event, callback) => {
      		events[event] = callback;
    	});
      
	});

	test('Escape key closes end chat dialogue', () => {
        jest.spyOn(ecp, 'onCancelEndChat').mockImplementation();

        var event = new KeyboardEvent('keydown', {'key': 'Escape'});
        wrapper.dispatchEvent(event);

        expect(ecp.onCancelEndChat).toHaveBeenCalled();
	});

    test('Click on cancel end chat closes end chat dialogue', () => {
        jest.spyOn(ecp, 'onCancelEndChat').mockImplementation();

        var event = new KeyboardEvent('click', {});
        wrapper.querySelector("#cancelEndChat").dispatchEvent(event);

        expect(ecp.onCancelEndChat).toHaveBeenCalled();
	});

    test('Click on confirm end chat and end chat', () => {
        jest.spyOn(ecp, 'onConfirmEndChat').mockImplementation();

        var event = new KeyboardEvent('click', {});
        wrapper.querySelector("#confirmEndChat").dispatchEvent(event);

        expect(ecp.onConfirmEndChat).toHaveBeenCalled();
	});

	test('Click on cancel end chat closes end chat dialogue TEST', () => {
        // let eventHandler = (jest.fn(), jest.fn());
        // ecp = new Popup(container, eventHandler)
        
        const evt = { preventDefault: jest.fn() };
        ecp.onConfirmEndChat(evt);

        // expect(ecp.onConfirmEndChat).toHaveBeenCalledTimes(1);
        expect(evt.preventDefault).toHaveBeenCalledTimes(1);
        // expect(ecp.eventHandler.onConfirmEndChat).toBeCalledTimes(1);
    });

});
