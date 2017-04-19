'use strict';
const React = require('react');const ReactNative = require('react-native');
const {
    AsyncStorage,
} = ReactNative;
const EventEmitter = require('EventEmitter');

const ITEM_NAME = 'inputText';

class InputTextMgr extends EventEmitter {
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
    getTextContent (textID) {
        const text = _.find(this.list, (item) => item.textID === textID);
        return text ? text.textContent : '';
    }
    setTextContent (textID, textContent) {
        const text = _.find(this.list, (item) => item.textID === textID);
        if (text) {
            text.textContent = textContent;
        } else {
            this.list.push({ textID, textContent });
        }
        this.set(this.list);
    }
    removeItem (textID) {
        _.remove(this.list, (item) => item.textID === textID);
        this.set(this.list);
    }
    clear () {
        this.list = [];
        AsyncStorage.removeItem(ITEM_NAME);
    }
}

module.exports = new InputTextMgr();
