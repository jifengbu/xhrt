'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
    Animated,
    Navigator,
} = ReactNative;

var Update = require('./Update.js');
var {Button} = COMPONENTS;

module.exports = React.createClass({
    statics: {
        title: '版本更新',
        leftButton: { image: app.img.common_back2, handler: ()=>{app.navigator.pop()}},
    },
    render() {
        return (
            <View style={styles.container}>
                <Update />
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#FFFFFF',
    },
});
