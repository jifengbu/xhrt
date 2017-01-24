'use strict';
var React = require('react');var ReactNative = require('react-native');
var {
    AsyncStorage,
} = ReactNative;
var EventEmitter = require('EventEmitter');
var fs = require('react-native-fs');

var moment = require('moment');
var DocumentPath = fs.DocumentDirectoryPath+"/audioRecodes/";

const ITEM_NAME = "audioRecordeFiles";
const FILE_COUNT_LIMIT = 10;

class Manager extends EventEmitter {
	constructor() {
        super();
        this.get();
	}
    get() {
        return new Promise(async(resolve, reject)=>{
            var list = {};
            try {
                var infoStr = await AsyncStorage.getItem(ITEM_NAME);
                list = JSON.parse(infoStr||'{}');
            } catch(e) {
                list = {};
            }
            if (list instanceof Array) { //为了适配以前版本单Array的情况
                this.list = {};
                this.list['10001'] = list;
            } else {
                this.list = list;
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
	checkRootDir() {
		return new Promise(async(resolve, reject) => {
			var exist = await fs.exists(DocumentPath);
			if (!exist) {
				await fs.mkdir(DocumentPath);
			}
			await fs.mkdir(DocumentPath);
            resolve(true);
        });
    }
	getFileNameFromTime(time) {
		return moment(time).format('MM_DD_HH_mm_ss');
	}
	getFilePathFromName(name) {
		return DocumentPath+name+'.m4a';
	}
	saveRecordFile(info) {
		var {filepath, name, time, type} = info;
		return new Promise(async(resolve, reject) => {
			var list = this.list[type]||[];
			if (list.length >= FILE_COUNT_LIMIT) {
				var item = list.shift();
				await fs.unlink(item.filepath);
			}
			list.push({
				name: name,
				filepath: filepath,
				time:time,
			});
			this.list[type] = list;
            await AsyncStorage.setItem(ITEM_NAME, JSON.stringify(this.list));
            resolve(true);
        });
    }
    clear() {
        this.list = {};
        AsyncStorage.removeItem(ITEM_NAME);
    }
}

module.exports = new Manager();
