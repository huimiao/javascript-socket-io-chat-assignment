function bootstrapSocketServer(io) {
	io.on('connection', (socket) => {
		console.log('a user has connected');

		socket.on('register', (message) => {
			let username = message.username;
			let channels = message.channels;

			if (username && username !== 'Anonymous') {
				socket.emit('welcomeMessage', `Welcome ${message.username} !!`);

				channels.forEach(channel => {
					if(channel) {
						socket.join(channel);
						socket.emit('addedToChannel', {channel});
					}
				});
			} 
		});

		socket.on('message', (newMessage) => {
			let message = newMessage.message;
			let channel = newMessage.channel;
			let username = newMessage.username;

			if(message && channel) {
				socket.broadcast.to(channel).emit('newMessage', { username, channel, message });
			}
		});

		socket.on('joinChannel', (newChannel) => {
			let channel = newChannel.channel;
			if(channel) {
				socket.join(channel);
				socket.emit('addedToChannel', {channel});
			}
		});

		socket.on('leaveChannel', (newChannel) => {
			let channel = newChannel.channel;
			if(channel) {
				socket.emit('removedFromChannel', {channel});
				socket.leave(channel);
			}
		});

	})
}

module.exports = bootstrapSocketServer;
