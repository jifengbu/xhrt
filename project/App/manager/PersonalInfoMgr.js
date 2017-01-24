'use strict';
var ReactNative = require('react-native');
var {
    AsyncStorage,
} = ReactNative;
var EventEmitter = require('EventEmitter');
var moment = require('moment');
const ITEM_NAME = "personalInfo";

class Manager extends EventEmitter {
	constructor() {
        super();
        this.get();
	}
    get() {
        return new Promise(async(resolve, reject)=>{
            var info;
            try {
                var infoStr = await AsyncStorage.getItem(ITEM_NAME);
                info = JSON.parse(infoStr);
            } catch(e) {
                info = null;
            }
            this.info = info;
        });
    }
    set(info) {
        return new Promise(async(resolve, reject)=>{
            this.info = info;
            await AsyncStorage.setItem(ITEM_NAME, JSON.stringify(info));
            resolve();
        });
    }
    setUserHead(head) {
        this.emit('USER_HEAD_CHANGE_EVENT', {head:head});
    }
    setSpecialSoldier(flag) {
        this.info.isSpecialSoldier = flag;
        this.info.becomeSpecialSoldierDay = moment().format('YYYY-MM-DD HH:mm:ss');
        this.set(this.info);
    }
    clear() {
        this.info = null;
        AsyncStorage.removeItem(ITEM_NAME);
    }
}

module.exports = new Manager();
