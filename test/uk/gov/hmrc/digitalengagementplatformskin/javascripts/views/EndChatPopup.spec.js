import { wrap } from 'lodash';
import Popup from '../../../../../../../app/assets/javascripts/views/EndChatPopup'

describe('EndChatPopup', () => {
	let ecp;
	let events = {};
    let wrapper;
    let eventHandler = {
        onCancelEndChat: jest.fn(),
        onConfirmEndChat: jest.fn()
    };

	beforeEach(() => {
        jest.clearAllMocks();

        let container = document.createElement("div");

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

	test('Click on confirm end chat calls the expected method on the eventHandler', () => {
        const evt = { preventDefault: jest.fn() };
        ecp.onConfirmEndChat(evt);

        expect(eventHandler.onConfirmEndChat).toHaveBeenCalledTimes(1);
    });

    test('Click on cancel end chat calls the expected method on the eventHandler', () => {
        const evt = { preventDefault: jest.fn() };
        ecp.onCancelEndChat(evt);

        expect(eventHandler.onCancelEndChat).toHaveBeenCalledTimes(1);
    });

    test('Calls setDisplay with the expected state', () => {
        jest.spyOn(ecp, '_setDisplay').mockImplementation();
        
        ecp.show();

        expect(ecp._setDisplay).toBeCalledWith("block");
        // expect(ecp._setDisplay).toBeCalledTimes(1);
        expect(wrapper.style.display).toBe("block");
        expect(wrapper.style.display).toBeCalledTimes(2);
    });
});
