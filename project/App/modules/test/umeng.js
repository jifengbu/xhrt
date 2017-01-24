 'use strict';

var React = require('react');
var {
    StyleSheet,
    View,
} = ReactNative;

var Button = require('@remobile/react-native-simple-button');
var Umeng = require('../../native/index.js').Umeng;



module.exports = React.createClass({
    doActionSheetShare() {
        Umeng.shareWithActionSheet({
            url: CONSTANTS.SHARE_APPDOWNLOAD_SERVER,
            title: "title",
            text: "text",
            imageUrl:CONSTANTS.SHARE_IMGDIR_SERVER+'study-video.png',
            shareType:'web',
            sharePlatforms:"all"
        }, (result)=>{
            console.log("success", result);
        });
    },
    doSingleShare(platform) {
        //platform取值:
    	// Umeng.platforms.UMShareToWechatTimeline
    	// Umeng.platforms.UMShareToWechatSession
    	// Umeng.platforms.UMShareToQQ
    	// Umeng.platforms.UMShareToQzone
        Umeng.shareSingle(platform, {
            url: CONSTANTS.SHARE_APPDOWNLOAD_SERVER,
            shareType:"web",//text,image,app,web
            title: "title1",
            text: "text1",
            imageUrl:CONSTANTS.SHARE_IMGDIR_SERVER+'study-video.png',
        }, (result)=>{
            console.log("success", result);
        });
    },
    doShareCallback(){

    },
    render() {
        return (
            <View style={styles.container}>
                <Button onPress={this.doActionSheetShare}>默认分享</Button>
                <Button onPress={this.doSingleShare.bind(null,Umeng.platforms.UMShareToWechatTimeline)}>朋友圈分享</Button>
                <Button onPress={this.doSingleShare.bind(null,Umeng.platforms.UMShareToWechatSession)}>微信分享</Button>
                <Button onPress={this.doSingleShare.bind(null,Umeng.platforms.UMShareToQQ)}>QQ分享</Button>
                <Button onPress={this.doSingleShare.bind(null,Umeng.platforms.UMShareToQzone)}>QQ空间分享</Button>
            </View>
        );
    }
});


var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'space-around',
        paddingVertical: 150,
    },
});