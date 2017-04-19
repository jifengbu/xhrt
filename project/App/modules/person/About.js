'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    Text,
    WebView,
} = ReactNative;

const Update = require('@remobile/react-native-update');

const { DImage } = COMPONENTS;

module.exports = React.createClass({
    statics: {
        title: '关于',
        leftButton: { image: app.img.common_back2, handler: () => { app.navigator.pop(); } },
    },
    render () {
        return (
            <View style={styles.container}>
                <View style={styles.versionView}>
                    <DImage resizeMode='contain' source={app.img.login_logo} style={styles.logoImage} />
                    <Text style={styles.versionText}>{'版本号:' + Update.getVersion()}</Text>
                </View>
                <WebView
                    style={styles.webview}
                    source={{ uri:app.route.ROUTE_ABOUT_PAGE }}
                    scalesPageToFit={false}
                  />
            </View>
        );
    },
});

const styles = StyleSheet.create({
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
        height: 50,
    },
    versionText: {
        fontSize: 14,
        color: '#313131',
        marginTop: 10,
    },
    webview: {
        width:sr.w - 40,
    },
});
