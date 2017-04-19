'use strict';

const ReactNative = require('react-native');
const {
    Navigator,
    Dimensions,
    PixelRatio,
    Platform,
    NativeModules,
} = ReactNative;

const SCREEN_WIDTH_BASE = 375;

const { width, height } = Dimensions.get('screen') || Dimensions.get('window'),
    pxielRatio = PixelRatio.get();

const { TotalNavHeight } = Navigator.NavigationBar.Styles.General;
const statusBarHeight = (Platform.OS === 'android') ? NativeModules.UtilsModule.statusBarHeight / pxielRatio : 0;
const isStatusBar = (Platform.OS === 'android') ? NativeModules.UtilsModule.isStatusBar : false;
const statusBarOffset = isStatusBar ? 0 : statusBarHeight;
module.exports = {
    w: SCREEN_WIDTH_BASE, // 屏幕的宽度
    h: (height - statusBarOffset) * SCREEN_WIDTH_BASE / width, // 屏幕的高度（android不包含状态栏）
    fh: height * SCREEN_WIDTH_BASE / width, // 屏幕全屏的高度（android包含状态栏）
    tw: width, // 屏幕的真实宽度
    th: height - statusBarOffset, // 屏幕的真实高度（android不包含状态栏）
    tfh: height, // 屏幕全屏的真实高度（android包含状态栏）
    ch: (height - statusBarOffset - TotalNavHeight) * SCREEN_WIDTH_BASE / width, // 界面的高度
    tch: height - statusBarOffset - TotalNavHeight, // 界面的真实高度
    statusBarHeight: statusBarHeight * SCREEN_WIDTH_BASE / width, // android状态栏高度
    trueStatusBarHeight: statusBarHeight, // android状态栏真实高度
    totalNavHeight: TotalNavHeight * SCREEN_WIDTH_BASE / width, // 导航栏的高度
    trueTotalNavHeight: TotalNavHeight, // 导航栏的真实高度
    pr: pxielRatio,
    ws: (w) => { return w * width / SCREEN_WIDTH_BASE; },
    rws: (w) => { return w * SCREEN_WIDTH_BASE / width; },
};
