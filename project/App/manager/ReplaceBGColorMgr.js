'use strict';
var ReactNative = require('react-native');
var {
    AsyncStorage,
} = ReactNative;
var EventEmitter = require('EventEmitter');

const ITEM_NAME = "REPLACE_BACKGROUND_COLOR";

class Manager extends EventEmitter {
	constructor() {
        super();
        this.getColor();
	}
    getColor() {
        return new Promise(async(resolve, reject)=>{
            try {
                var tempColor = await AsyncStorage.getItem(ITEM_NAME);
                CONSTANTS.THEME_COLOR = tempColor||'#A62045';
                app.THEME_COLOR = CONSTANTS.THEME_COLORS[0];
            } catch(e) {
            }
        });
    }
    setColor(bgColor) {
        return new Promise(async(resolve, reject)=>{
            CONSTANTS.THEME_COLOR = bgColor;
            await AsyncStorage.setItem(ITEM_NAME, bgColor);
            resolve();
        });
    }
    clear() {
        AsyncStorage.removeItem(ITEM_NAME);
    }
}

module.exports = new Manager();
