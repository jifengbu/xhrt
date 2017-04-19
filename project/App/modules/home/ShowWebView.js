'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    AppState,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
} = ReactNative;

const WebView = require('react-native-webview-bridge');
const UmengMgr = require('../../manager/UmengMgr.js');
const Umeng = require('../../native/index.js').Umeng;

const { ShareSheet } = COMPONENTS;

const CompanyDetail = React.createClass({
    statics: {
        leftButton: { handler: () => { app.navigator.pop(); } },
        rightButton: { image: app.img.home_share, handler: () => { app.scene.doShowActionSheet(); } },
    },
    getInitialState () {
        return {
            actionSheetVisible: false,
        };
    },
    doShowActionSheet () {
        this.setState({ actionSheetVisible:true });
    },
    doCloseActionSheet () {
        this.setState({ actionSheetVisible:false });
    },
    doShareWeChat () {
        this.doShare(0);
    },
    doShareTimeline () {
        this.doShare(1);
    },
    doShareQQ () {
        this.doShare(2);
    },
    doShare (index) {
        const { htmlUrl, imageUrl, title, describe } = this.props;
        let url =  encodeURIComponent(htmlUrl);
        let platform;
        switch (index) {
            case 0:
                platform = Umeng.platforms.UMShareToWechatSession;
                break;
            case 1:
                platform = Umeng.platforms.UMShareToWechatTimeline;
                break;
            case 2:
                platform = Umeng.platforms.UMShareToQQ;
                break;
            default:
                Toast('未知分享');
                return;
        }
        UmengMgr.doSingleShare(platform, CONSTANTS.SHARE_SHAREDIR_SERVER + 'shareBanner.html?webUrl=' + url, title, describe || '信息介绍', 'web', imageUrl, this.doShareCallback);
    },
    doShareCallback () {
        this.doCloseActionSheet();
    },
    render () {
        const { htmlUrl } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.line} />
                <WebView
                    style={styles.webview}
                    scrollEnabled
                    source={{ uri: htmlUrl || 'http://www.baidu.com' }}
                    scalesPageToFit={false}
                    />
                <ShareSheet
                    visible={this.state.actionSheetVisible}
                    onCancel={this.doCloseActionSheet} >
                    <ShareSheet.Button image={app.img.specops_wechat} onPress={this.doShareWeChat}>微信好友</ShareSheet.Button>
                    <ShareSheet.Button image={app.img.specops_friend_circle} onPress={this.doShareTimeline}>朋友圈</ShareSheet.Button>
                    <ShareSheet.Button image={app.img.specops_qq} onPress={this.doShareQQ}>QQ</ShareSheet.Button>
                </ShareSheet>
            </View>
        );
    },
});
module.exports = CompanyDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    webview: {
        width: sr.w,
        height: sr.ch,
        backgroundColor: '#FFFFFF',
    },
    line: {
        width: sr.w,
        height: 1,
        backgroundColor: '#EFEFEF',
    },
});
