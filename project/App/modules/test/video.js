'use strict';

import React from 'react';
import {
    AlertIOS,
    AppRegistry,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

var Player = require('../study/Player.js');
var SplashScreen = require('@remobile/react-native-splashscreen');

module.exports = React.createClass({
    componentWillMount() {
        SplashScreen.hide();
    },
    onEnd() {
        console.log("=onComplete");
    },
    fullScreenListener(isFullScreen) {
        console.log("fullScreenListener", isFullScreen);
    },
    render() {
        return (
            <View style={styles.container}>
                <Player
                    uri="http://192.168.1.137:3000/video/test.m3u8"
                    fullScreenListener={this.fullScreenListener}
                    onEnd={this.onEnd}
                    />
            </View>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
