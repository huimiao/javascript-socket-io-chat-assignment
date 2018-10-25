function sendMessage(event, socket) {
	event.preventDefault();

	let channel = document.getElementById('channel').value;
	let message = document.getElementById('message').value;
	let username = document.getElementById('username').value;

	let msg = `Me : ${message}`;
	generateChatMsgTemplate(msg);
	socket.emit('message', { username, channel, message });

}

function joinChannel(event, socket) {
	event.preventDefault();
	let channel = document.getElementById('newchannel').value;

	if (channel) {
		socket.emit('joinChannel', { channel });
	}

}

function leaveChannel(event, socket) {
	event.preventDefault();
	let channel = document.getElementById('newchannel').value;

	if (channel) {
		socket.emit('leaveChannel', { channel });
	}
}

function onWelcomeMessageReceived(welcomeMessage) {
	let msg = `System : ${welcomeMessage}`;
	generateChatMsgTemplate(msg);
}

function onNewMessageReceived(newMessage) {
	let msg = `${newMessage.username} : ${newMessage.message}`;
	generateChatMsgTemplate(msg);
}

function onAddedToNewChannelReceived(data) {
	let channel = data.channel;

	let alertMessage = `You are added to <strong>${channel}</strong> successfully!`;
	let content = generateAlertMsgTemplate(alertMessage);
	document.getElementById('alertContainer').innerHTML += content;

	let select = document.getElementById('channelsList');
	let option = document.createElement("option")
	option.text = `${channel}`;
	select.appendChild(option);
}

function onRemovedFromChannelReceived(data) {

	let channel = data.channel;

	let alertMessage = `You are removed from <strong>${channel}</strong> successfully!`;
	let content = generateAlertMsgTemplate(alertMessage);
	document.getElementById('alertContainer').innerHTML += content;

	let select = document.getElementById('channelsList');
	let optionList = select.options;

	let optionIndexToRemove;
	for (let i = 0; i < optionList.length; i++) {
		let option = optionList.options[i];

		if (option.value === channel) {
			optionIndexToRemove = i;
		}
	}

	select.removeChild(optionIndexToRemove);
}

function generateChatMsgTemplate(msg) {
	var content = `
	<div class="col-12">
		<div class="card received-message">
			<div class="card-body">
				<p class="card-text">${msg}</p>
			</div>
		</div>
	</div>
	`;

	let initialcontent = document.getElementById('chatContainer').innerHTML;
	let finalContent = content + initialcontent;
	document.getElementById('chatContainer').innerHTML = finalContent;

	return content;
}

function generateAlertMsgTemplate(msg) {
	let content = `
		<div class="alert alert-success alert-dismissible fade show" role="alert">
			${msg}
			<button type="button" class="close" data-dismiss="alert" aria-label="Close">
				<span aria-hidden="true">&times;</span>
			</button>
		</div>
	`;
	return content;
}


module.exports = {
	sendMessage,
	joinChannel,
	leaveChannel,
	onWelcomeMessageReceived,
	onNewMessageReceived,
	onAddedToNewChannelReceived,
	onRemovedFromChannelReceived
};

// You will get error - Uncaught ReferenceError: module is not defined
// while running this script on browser which you shall ignore
// as this is required for testing purposes and shall not hinder
// it's normal execution

