'use strict';
var React = require('react');
var ReactNative = require('react-native');
var {
	Platform,
} = ReactNative;
var EventEmitter = require('EventEmitter');

class Manager extends EventEmitter {
	constructor() {
		super();
	}
	register(roomId) {
		console.log('register');
		this.available = true;
		this.roomId = roomId;
		this.list = [];
		this.connect();
	}
	unregister() {
		this.available = false;
		console.log('unregister');
		if (this.socket) {
			this.socket.close();
			this.socket = null;
		}
	}
	connect() {
		if (this.socket) {
			this.socket.close();
		}
		var url = app.route.ROUTE_WS_CHAT+'?userID=' + app.personal.info.userID+'&roomID='+this.roomId;
		console.log(url);
		this.socket = new WebSocket(url);
		this.socket.onopen = () => {
			console.log('onopen');
			if (!this.available) {
				this.unregister();
			}
		};
		this.socket.onmessage = (e) => {
			console.log('onmessage', e.data);
			let param;
			try {
				param = JSON.parse(e.data);
			} catch(e) {
				Toast('解决Websocket出错');
			}
			switch (param.type) {
				case 'SEND_LIVE_MESSAGE_NF':
				this.list.push(param.data);
				this.emit('UPDATE_MESSAGE_EVENT');
				break;
			}
		};
		this.socket.onerror = (e) => {
			console.log("onerror",e.message);
		};
		this.socket.onclose = (e) => {
			console.log("onclose");
			this.socket = null;
			if (this.available) {
				setTimeout(this.reconnect.bind(this), 2000);
			}
		};
	}
	reconnect() {
		console.log('reconnect');
		this.connect();
	}
	sendData(type, data) {
		var param = { type, data };
		console.log("ws send:", type, data);
		this.socket && this.socket.send(JSON.stringify(param));
	}
	sendMessage(content) {
		const {userID, name, phone} = app.personal.info;
		this.sendData('SEND_LIVE_MESSAGE_RQ', {messageType:1, from:userID, content, fromName: name||phone});
		this.list.push({messageType:1, content, send:true});
		this.emit('UPDATE_MESSAGE_EVENT');
	}
}

module.exports = new Manager();
