 'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
} = ReactNative;

var SplashScreen = require('@remobile/react-native-splashscreen');
var Button = require('@remobile/react-native-simple-button');
var Umeng = require('../../native/index.js').Umeng;



module.exports = React.createClass({
    componentWillMount() {
        SplashScreen.hide();
    },
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
    doThirdPartyLogin(platform, callback) {
        Umeng.ThirdPartyLogin(platform, (result)=>{
            if (result.success) {
				console.log("success", result);
			} else {
				Toast('授权失败，请重试！');
			}
        });
    },
    render() {
        return (
            <View style={styles.container}>
                <Button onPress={this.doActionSheetShare}>默认分享</Button>
                <Button onPress={this.doSingleShare.bind(null,Umeng.platforms.UMShareToWechatTimeline)}>朋友圈分享</Button>
                <Button onPress={this.doSingleShare.bind(null,Umeng.platforms.UMShareToWechatSession)}>微信分享</Button>
                <Button onPress={this.doSingleShare.bind(null,Umeng.platforms.UMShareToQQ)}>QQ分享</Button>
                <Button onPress={this.doSingleShare.bind(null,Umeng.platforms.UMShareToQzone)}>QQ空间分享</Button>
                <Button onPress={this.doThirdPartyLogin.bind(null,Umeng.platforms.UMShareToQQ)}>QQ登录</Button>
                <Button onPress={this.doThirdPartyLogin.bind(null,Umeng.platforms.UMShareToWechatSession)}>微信登录</Button>
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
