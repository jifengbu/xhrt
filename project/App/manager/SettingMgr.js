'use strict';
const ReactNative = require('react-native');
const {
    AsyncStorage,
} = ReactNative;
const EventEmitter = require('EventEmitter');

const ITEM_NAME = 'APP_SETTING_MANAGER';

class Manager extends EventEmitter {
    constructor () {
        super();
        this.data = {};
        this.get();
    }
    get () {
        return new Promise(async(resolve, reject) => {
            let data = [];
            try {
                const infoStr = await AsyncStorage.getItem(ITEM_NAME);
                data = JSON.parse(infoStr);
            } catch (e) {
            }
            this.data = data || {};
        });
    }
    set (data) {
        return new Promise(async(resolve, reject) => {
            this.data = data;
            await AsyncStorage.setItem(ITEM_NAME, JSON.stringify(data));
            resolve();
        });
    }
    setOnlyWifiUpload (flag) {
        const data = this.data;
        data.onlyWifiUpload = flag;
        this.set(data);
    }
    setLiveAppointment (obj) {
        const data = this.data;
        data.liveAppointment = obj;
        this.set(data);
    }
    clear () {
        this.data = {};
        AsyncStorage.removeItem(ITEM_NAME);
    }
}

module.exports = new Manager();
