'use strict';
const ReactNative = require('react-native');
const {
    AsyncStorage,
} = ReactNative;
const EventEmitter = require('EventEmitter');

class Manager extends EventEmitter {
    constructor () {
        super();
    }
    doRefreshComments () {
        this.emit('DO_REFRESH_COMMENTS', null);
    }
}

module.exports = new Manager();
