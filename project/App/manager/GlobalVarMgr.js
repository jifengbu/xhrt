'use strict';
const React = require('react');const ReactNative = require('react-native');

let globallet = {};

class GloballetMgr {
    constructor () {
        globallet = {};
        globallet.isFullScreen = false;
    }
    getItem (key) {
        return _.get(globallet, key);
    }
    setItem (key, value) {
        _.set(globallet, key, value);
    }
    removeItem (key) {
        _.set(globallet, key, undefined);
    }
    clear () {
        globallet = {};
    }
}

module.exports = new GloballetMgr();
