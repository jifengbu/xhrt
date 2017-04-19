'use strict';
const React = require('react');const ReactNative = require('react-native');
const {
    AsyncStorage,
} = ReactNative;
const EventEmitter = require('EventEmitter');

const ITEM_NAME = 'LocalData';

class LocalDataMgr extends EventEmitter {
    constructor () {
        super();
        this.list = [];
        this.get();
    }
    get () {
        return new Promise(async(resolve, reject) => {
            let list;
            try {
                const infoStr = await AsyncStorage.getItem(ITEM_NAME);
                list = JSON.parse(infoStr);
            } catch (e) {
                list = [];
            }
            this.list = list;
            if (!this.list) {
                this.list = [];
            }
        });
    }
    set (list) {
        return new Promise(async(resolve, reject) => {
            this.list = list;
            await AsyncStorage.setItem(ITEM_NAME, JSON.stringify(list));
            resolve();
        });
    }
    getValueFromKey (key) {
        const data = _.find(this.list, (item) => item.key === key);
        return data ? data.value : null;
    }
    setValueAndKey (key, value) {
        const data = _.find(this.list, (item) => item.key === key);
        if (data) {
            data.value = value;
        } else {
            this.list.push({ key, value });
        }
        this.set(this.list);
    }
    removeItem (key) {
        _.remove(this.list, (item) => item.key === key);
        this.set(this.list);
    }
    clear () {
        this.list = [];
        AsyncStorage.removeItem(ITEM_NAME);
    }
}

module.exports = new LocalDataMgr();
