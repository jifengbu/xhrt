'use strict';
const React = require('react');const ReactNative = require('react-native');
const {
    AsyncStorage,
} = ReactNative;
const EventEmitter = require('EventEmitter');

const ITEM_NAME = 'studyNum';

class StudyNum extends EventEmitter {
    constructor () {
        super();
        this.get();
    }
    get () {
        return new Promise(async(resolve, reject) => {
            const INIT_INFO = { 'time': '', 'num': 0, 'videoList': [] };
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
    initStudyNum () {
        const init_info = { 'time': app.utils.getCurrentDateString(), 'num': 0, 'videoList': [] };
        this.set(init_info);
    }
    addStudyNum (videoID) {
        const videoInfo = _.find(this.info.videoList, (item) => item == videoID);
        if (!videoInfo) {
            this.info['num'] = this.info['num'] + 1;
            this.info.videoList.push(videoID);
            this.set(this.info);
        }
    }
    clear () {
        this.info = null;
        AsyncStorage.removeItem(ITEM_NAME);
    }
}

module.exports = new StudyNum();
