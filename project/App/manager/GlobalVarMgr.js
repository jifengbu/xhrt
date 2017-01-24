'use strict';
var React = require('react');var ReactNative = require('react-native');

var globalVar = {};

class GlobalVarMgr{
  	constructor() {
          globalVar = {};
          globalVar.isFullScreen = false;
  	}
    getItem(key) {
        return _.get(globalVar, key);
    }
    setItem(key, value) {
        _.set(globalVar, key, value);
    }
    removeItem(key){
        _.set(globalVar, key, undefined);
    }
    clear() {
        globalVar = {};
    }
}

module.exports = new GlobalVarMgr();
