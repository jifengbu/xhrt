'use strict';
var ReactNative = require('react-native');
var {
    AsyncStorage,
} = ReactNative;
var EventEmitter = require('EventEmitter');

class Manager extends EventEmitter {
	constructor() {
        super();
	}
    doRefreshComments() {
        this.emit('DO_REFRESH_COMMENTS', null);
    }
}

module.exports = new Manager();
