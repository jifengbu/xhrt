'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
    Text,
    WebView,
} = ReactNative;

var {DImage} = COMPONENTS;

module.exports = React.createClass({
    statics: {
        title: '关于',
        leftButton: { image: app.img.common_back2, handler: ()=>{app.navigator.pop()}},
    },
    render() {
        //备注：为防止测试版不拉取版本号数据 所以默认一个版本号
        let appVersionName = app.appVersionName==undefined?(app.isandroid ? '2.3.0' : '2.1.0'):app.appVersionName;
        return (
          <View style={styles.container}>
              <View style={styles.versionView}>
                  <DImage resizeMode='contain' source={app.img.login_logo} style={styles.logoImage}></DImage>
                  <Text style={styles.versionText}>{'版本号:' + appVersionName}</Text>
              </View>
              <WebView
                  style={styles.webview}
                  source={{uri:app.route.ROUTE_ABOUT_PAGE}}
                  scalesPageToFit={false}
                  />
          </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        width:sr.w,
        height:sr.ch,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    versionView: {
        marginTop: 10,
        width:sr.w,
        // justifyContent: 'center',
        alignItems: 'center',
        // flexDirection: 'row',
    },
    logoImage: {
        width: 50,
        height: 50
    },
    versionText: {
        fontSize: 14,
        color: '#313131',
        marginTop: 10,
    },
    webview: {
        width:sr.w-40,
    },
});
