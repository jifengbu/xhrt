'use strict';
const React = require('react');const ReactNative = require('react-native');
const {
    AsyncStorage,
} = ReactNative;
const EventEmitter = require('EventEmitter');
const fs = require('react-native-fs');

const moment = require('moment');
var FileTransfer = require('@remobile/react-native-file-transfer');

const DocumentPath = fs.DocumentDirectoryPath + '/shareImg/';
const ITEM_NAME = 'ShardImgFiles';

class Manager extends EventEmitter {
    constructor () {
        super();
        this.get();
        this.checkRootDir();
        this.url = '';
        this.filePath = '';
    }
    get () {
        return new Promise(async(resolve, reject) => {
            let list = {};
            try {
                const infoStr = await AsyncStorage.getItem(ITEM_NAME);
                list = JSON.parse(infoStr || '{}');
            } catch (e) {
                list = {};
            }
            this.list = list;
        });
    }
    checkRootDir () {
        return new Promise(async(resolve, reject) => {
            const exist = await fs.exists(DocumentPath);
            if (!exist) {
                await fs.mkdir(DocumentPath);
            }
            await fs.mkdir(DocumentPath);
            resolve(true);
        });
    }
    getFilePath () {
        return DocumentPath + moment().format('MM_DD_HH_mm_ss') + '.png';
    }
    getFileSavePath () {
        return DocumentPath;
    }
    downImgFile (url){
        if (this.list[url]) {
            return;
        }

        this.url = url;
        this.filePath = this.getFilePath();
        const fileTransfer = new FileTransfer();

        fileTransfer.download(
            this.url,
            this.filePath,
            (result)=>{
                console.log('download img is success', this.filePath);
                const imgInfo = this.list[this.url] || {};
                imgInfo.filePath = this.filePath;
                imgInfo.url = this.url;
                this.list[this.url] = imgInfo;
                this.saveImgFile();
            },
            (error)=>{
                console.log('download img is fail');
            },
            true
        );
    }
    getLocalImgFilePath(key){
        let imgInfo = this.list[key];
        if (imgInfo && imgInfo.filePath) {
            return imgInfo.filePath;
        }else {
            return '';
        }
    }
    saveImgFile () {
        return new Promise(async(resolve, reject) => {
            await AsyncStorage.setItem(ITEM_NAME, JSON.stringify(this.list));
            resolve(true);
        });
    }
    saveImgFile (key, filePath) {
        return new Promise(async(resolve, reject) => {
            const imgInfo = this.list[key] || {};
            imgInfo.filePath = filePath;
            imgInfo.url = key;
            this.list[key] = imgInfo;
            await AsyncStorage.setItem(ITEM_NAME, JSON.stringify(this.list));
            resolve(true);
        });
    }
    clear () {
        this.list = {};
        AsyncStorage.removeItem(ITEM_NAME);
    }
}

module.exports = new Manager();
