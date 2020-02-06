/*
Chat box for instant messaging/
 */

function _append_chat_message(message, is_my_message) {
	let $chat_messages = $('.chat_messages');
	let $message = $('<div>')
		.addClass('message')
		.appendTo($chat_messages);
	if (is_my_message) {
		message.id = 'You';
		$message.addClass('my_message');
	}
	$('<div>')
		.addClass('id')
		.text(message.id)
		.appendTo($message);
	let $content_container = $('<span>')
		.addClass('content')
		.appendTo($message);
	$('<span>')
		.addClass('text')
		.text(message.content)
		.appendTo($content_container);
	$('<div>')
		.addClass('time_passed')
		.text('Just now')
		.data('timestamp', (new Date()).getTime())
		.appendTo($message);
	$chat_messages.scrollTop($chat_messages[0].scrollHeight - $chat_messages[0].clientHeight);
}

function initialize() {
	$.getScript('/socket.io/socket.io.js')
		.then(function () {
			let socket = io.connect('/chat');

			// Display received messages
			socket.on('message', function (message) {
				let is_my_message = message.id === socket.id;
				_append_chat_message(message, is_my_message);
			});

			// Give focus to chat input field if the chat background is clicked
			$('.chat_box').on('click', function (event) {
				if ($(event.target).hasClass('chat_messages'))
					$('.chat_input').trigger('focus');
			});

			// Broadcast chat message if content is non-empty
			$('.chat_input_form').on('submit', function (event) {
				event.preventDefault();
				let chat_input = $('.chat_input');
				let message = chat_input.val();
				if (message.length > 0) {
					chat_input.val('');
					socket.emit('message', message);
				}
			});
		});
}

$(function () {
	initialize();
});
