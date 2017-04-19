'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    WebView,
} = ReactNative;

const Button = require('./Button.js');

module.exports = React.createClass({
    render () {
        return (
            <View style={styles.overlayContainer}>
                <View style={styles.container}>
                    <WebView
                        style={styles.webview}
                        source={{ uri:this.props.webAddress }}
                        scalesPageToFit={false}
                        />
                    <View style={styles.contentView}>
                        <Button
                            onPress={app.closeModal}
                            style={styles.contentButton}>返回</Button>
                    </View>
                </View>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    overlayContainer: {
        position:'absolute',
        top: 0,
        bottom: 0,
        left:0,
        right: 0,
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container: {
        width:sr.w * 5 / 6,
        height:sr.h * 4 / 5,
        top: sr.totalNavHeight + 7,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: 'white',
        borderRadius:8,
        position: 'absolute',
        left: sr.w * 1 / 12,
    },
    webview: {
        marginTop: 5,
        width:sr.w * 5 / 6,
        height:sr.h * 4 / 5 - 50,
    },
    contentView: {
        width:sr.w * 5 / 6,
        height:49,
        borderRadius: 6,
        backgroundColor:'#A62045',
    },
    contentButton: {
        width:sr.w * 5 / 6,
        height:44,
        borderRadius: 0,
        marginBottom: 5,
        backgroundColor:'#A62045',
    },
});
