'use strict';
const React = require('react');const ReactNative = require('react-native');
const {
    AsyncStorage,
} = ReactNative;
const EventEmitter = require('EventEmitter');

const ITEM_NAME = 'leftTimes';

class LeftTimes extends EventEmitter {
    constructor () {
        super();
        this.get();
    }
    get () {
        return new Promise(async(resolve, reject) => {
            const INIT_INFO = { '10001':0, '10002':0, '10003':0 };
            let info = INIT_INFO;
            try {
                const infoStr = await AsyncStorage.getItem(ITEM_NAME);
                info = JSON.parse(infoStr);
            } catch (e) {
                info = INIT_INFO;
            }
            this.info = info;
        });
    }
    set (info) {
        return new Promise(async(resolve, reject) => {
            this.info = info;
            await AsyncStorage.setItem(ITEM_NAME, JSON.stringify(info));
            resolve();
        });
    }
    setLeftTimes (type, times) {
        this.info[type] = times;
        this.set(this.info);
    }
    addLeftTimes (type, times) {
        this.info[type] = (this.info[type] || 0) + times;
        this.set(this.info);
    }
    subLeftTime (type) {
        this.info[type] = (this.info[type] || 0) - 1;
        this.set(this.info);
    }
    getLeftTimeByType (type) {
        return this.info[type];
    }
    clear () {
        this.info = null;
        AsyncStorage.removeItem(ITEM_NAME);
    }
}

module.exports = new LeftTimes();
