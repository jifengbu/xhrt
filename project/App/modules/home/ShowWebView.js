'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
    AppState,
    Text,
    ScrollView,
    Image,
    TouchableOpacity
} = ReactNative;

var WebView = require('react-native-webview-bridge');

var CompanyDetail = React.createClass({
    statics: {
        leftButton: { handler: ()=>{app.navigator.pop()}},
    },
    render() {
        const { htmlUrl } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.line}/>
                <WebView
                    style={styles.webview}
                    scrollEnabled={true}
                    source={{uri: htmlUrl? htmlUrl:'http://www.baidu.com'}}
                    scalesPageToFit={false}
                    />
            </View>
        );
    }
});
module.exports = CompanyDetail;

var styles = StyleSheet.create({
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
