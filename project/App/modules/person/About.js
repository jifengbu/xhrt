'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
    WebView,
} = ReactNative;

module.exports = React.createClass({
    statics: {
        title: '关于',
        leftButton: { image: app.img.common_back2, handler: ()=>{app.navigator.pop()}},
    },
    render() {
        return (
          <View style={styles.container}>
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
    webview: {
        width:sr.w-40,
    },
});
