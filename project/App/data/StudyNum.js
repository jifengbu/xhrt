'use strict';
var React = require('react');var ReactNative = require('react-native');
var {
    AsyncStorage,
} = ReactNative;
var EventEmitter = require('EventEmitter');

const ITEM_NAME = "studyNum";

class StudyNum extends EventEmitter {
  	constructor() {
          super();
          this.get();
  	}
    get() {
        return new Promise(async(resolve, reject)=>{
            var INIT_INFO = {'time': '', 'num': 0, 'videoList': []};
            var info = INIT_INFO;
            try {
                var infoStr = await AsyncStorage.getItem(ITEM_NAME);
                info = JSON.parse(infoStr);
            } catch(e) {
                info = INIT_INFO;
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
    initStudyNum() {
        var init_info = {'time': app.utils.getCurrentDateString(), 'num': 0, 'videoList': []};
        this.set(init_info);
    }
    addStudyNum(videoID) {
        var videoInfo = _.find(this.info.videoList, (item)=>item==videoID);
        if (!videoInfo) {
            this.info['num'] = this.info['num']+1;
            this.info.videoList.push(videoID);
            this.set(this.info);
        }
    }
    clear() {
        this.info = null;
        AsyncStorage.removeItem(ITEM_NAME);
    }
}

module.exports = new StudyNum();
