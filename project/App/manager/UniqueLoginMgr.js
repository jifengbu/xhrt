'use strict';
var ReactNative = require('react-native');
var {
    AsyncStorage,
} = ReactNative;

const ITEM_NAME = "UNIQUE_LOGIN_MANAGER";

class Manager {
	constructor() {
        this.get();
	}
    getUUID() {
        var S4 = () => (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        return S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+Date.now();
    }
    get() {
        return new Promise(async(resolve, reject)=>{
            this.uuid = await AsyncStorage.getItem(ITEM_NAME);
            if (!this.uuid) {
                this.uuid = this.getUUID();
                await AsyncStorage.setItem(ITEM_NAME, this.uuid);
            }
            resolve();
        });
    }
}

module.exports = new Manager();
