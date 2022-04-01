import Popup from '../../../../../../../app/assets/javascripts/views/EndChatPopup'

describe('EndChatPopup', () => {
	let ecp;
	let events = {};
    let wrapper;

	beforeEach(() => {
        let container = document.createElement("div")
		ecp = new Popup(container, "");

        wrapper = ecp.wrapper;

		events = {};

		wrapper.addEventListener = jest.fn((event, callback) => {
      		events[event] = callback;
    	});
      
	});

	test('Escape key closes end chat dialogie', () => {
        jest.spyOn(ecp, 'onCancelEndChat').mockImplementation();

        var event = new KeyboardEvent('keydown', {'key': 'Escape'});
        wrapper.dispatchEvent(event);

        expect(ecp.onCancelEndChat).toHaveBeenCalled();
	});

    
    test('Click on cancel end chat closes end chat dialogie', () => {
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
});