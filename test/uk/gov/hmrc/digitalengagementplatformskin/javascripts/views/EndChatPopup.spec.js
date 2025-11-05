import Popup from '../../../../../../../app/assets/javascripts/views/EndChatPopup'

describe('EndChatPopup', () => {
	let endChatPopup;
	let events = {};
    let wrapper;
    let eventHandler = {
        onCancelEndChat: jest.fn(),
        onConfirmEndChat: jest.fn()
    };

	beforeEach(() => {
        jest.clearAllMocks();

        let container = document.createElement("div");

        endChatPopup = new Popup(container, eventHandler);

        wrapper = endChatPopup.wrapper;

		events = {};

		wrapper.addEventListener = jest.fn((event, callback) => {
      		events[event] = callback;
    	});
	});

	test('Escape key closes end chat dialogue', () => {
        jest.spyOn(endChatPopup, 'onCancelEndChat').mockImplementation();

        var event = new KeyboardEvent('keydown', {'key': 'Escape'});
        wrapper.dispatchEvent(event);

        expect(endChatPopup.onCancelEndChat).toHaveBeenCalled();
	});

    test('Click on cancel end chat closes end chat dialogue', () => {
        jest.spyOn(endChatPopup, 'onCancelEndChat').mockImplementation();

        var event = new KeyboardEvent('click', {});
        wrapper.querySelector("#cancelEndChat").dispatchEvent(event);

        expect(endChatPopup.onCancelEndChat).toHaveBeenCalled();
	});

    test('Click on confirm end chat and end chat', () => {
        jest.spyOn(endChatPopup, 'onConfirmEndChat').mockImplementation();

        var event = new KeyboardEvent('click', {});
        wrapper.querySelector("#confirmEndChat").dispatchEvent(event);

        expect(endChatPopup.onConfirmEndChat).toHaveBeenCalled();
	});

	test('Click on confirm end chat calls the expected method on the eventHandler', () => {
        const evt = { preventDefault: jest.fn() };
        endChatPopup.onConfirmEndChat(evt);

        expect(eventHandler.onConfirmEndChat).toHaveBeenCalledTimes(1);
    });

    test('Click on cancel end chat calls the expected method on the eventHandler', () => {
        const evt = { preventDefault: jest.fn() };
        endChatPopup.onCancelEndChat(evt);

        expect(eventHandler.onCancelEndChat).toHaveBeenCalledTimes(1);
    });

    test('Calls _setDisplay with the expected state, and sets the wrapper style display property', () => {
        let endChatPopupSpy = jest.spyOn(endChatPopup, '_setDisplay');
        
        endChatPopup.show();

        expect(endChatPopupSpy).toHaveBeenCalledWith("block");
        expect(wrapper.style.display).toBe("block");
    });
});
