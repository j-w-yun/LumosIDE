function createServer(server) {
	let io = require('socket.io')(server);

	let default_io = create_default_socket(io);
	let chat_io = create_chat_socket(io);
}

function create_default_socket(io) {
	let default_io = io;
	default_io.on('connection', function (socket) {
		console.log('default socket connected:', socket.id);
		// socket.emit('message', 'default socket connected');

		socket.on('message', function (message) {
			console.log('message', message);
		});

		socket.on('disconnect', function () {
			console.log('default socket disconnected:', socket.id);
		});
	});
	return default_io;
}

function create_chat_socket(io) {
	let chat_io = io.of('/chat');
	chat_io.on('connection', function (socket) {
		console.log('chat socket connected:', socket.id);
		// socket.emit('message', 'chat socket connected');

		socket.on('message', function (content) {
			let message = {
				id: socket.id,
				content: content,
			};
			console.log('message', message);
			chat_io.emit('message', message);
		});

		socket.on('disconnect', function () {
			console.log('chat socket disconnected:', socket.id);
		});
	});
	return chat_io;
}

module.exports = {
	createServer: createServer,
};