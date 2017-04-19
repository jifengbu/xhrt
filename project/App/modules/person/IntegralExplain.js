'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    WebView,
} = ReactNative;

module.exports = React.createClass({
    statics: {
        title: '积分说明',
        leftButton: { image: app.img.common_back2, handler: () => { app.navigator.pop(); } },
    },
    render () {
        return (
            <View style={styles.container}>
                <WebView
                    style={styles.webview}
                    source={{ uri: CONSTANTS.INTEGRAL_EXPLAINDIR_SERVER }}
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
    webview: {
        width:sr.w,
    },
});
