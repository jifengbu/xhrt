'use strict';
var React = require('react');var ReactNative = require('react-native');
var {
    AsyncStorage,
} = ReactNative;
var EventEmitter = require('EventEmitter');

const ITEM_NAME = "videoTime";

class VideoTimeMgr extends EventEmitter {
  	constructor() {
          super();
          this.list = [];
          this.get();
  	}
    get() {
        return new Promise(async(resolve, reject)=>{
            var list;
            try {
                var infoStr = await AsyncStorage.getItem(ITEM_NAME);
                list = JSON.parse(infoStr);
            } catch(e) {
                list = [];
            }
            this.list = list;
            if (!this.list) {
                this.list = [];
            }
        });
    }
    set(list) {
        return new Promise(async(resolve, reject)=>{
            this.list = list;
            await AsyncStorage.setItem(ITEM_NAME, JSON.stringify(list));
            resolve();
        });
    }
    getPlayTime(videoUrl){
        var video = _.find(this.list, (item)=>item.videoUrl===videoUrl);
        return video?video.videoTime: 0;
    }
    setPlayTime(videoUrl, videoTime) {
        var video = _.find(this.list, (item)=>item.videoUrl===videoUrl);
        if (video) {
            video.videoTime = videoTime;
        } else {
            console.log(videoUrl+"-----"+videoTime);
            this.list.push({videoUrl, videoTime});
        }
        this.set(this.list);
    }
    removeItem(videoUrl){
        _.remove(this.list, (item)=>item.videoUrl===videoUrl);
        this.set(this.list);
    }
    clear() {
        this.list = [];
        AsyncStorage.removeItem(ITEM_NAME);
    }
}

module.exports = new VideoTimeMgr();
