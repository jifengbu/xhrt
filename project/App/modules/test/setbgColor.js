'use strict';
var React = require('react');
var ReactNative = require('react-native');
var {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} = ReactNative;

var SplashScreen = require('@remobile/react-native-splashscreen');
var {Button} = COMPONENTS;

module.exports = React.createClass({
    componentWillMount() {
        SplashScreen.hide();
    },
    getInitialState() {
        return {
            bgColorStr: CONSTANTS.THEME_COLOR
        };
    },
    setColor0 () {
        app.replaceBGColorMgr.setColor('#239FDB');
        this.setState({bgColorStr: CONSTANTS.THEME_COLOR});
    },
    setColor1 () {
        app.replaceBGColorMgr.setColor('#A62045');
        this.setState({bgColorStr: CONSTANTS.THEME_COLOR});
    },
    render() {
        return (
            <View style={styles.container}>
                <Button onPress={this.setColor0} style={styles.bgcolor}>蓝色</Button>
                <Button onPress={this.setColor1} style={styles.bgcolor}>红色</Button>
                <Text style={styles.bgTextColor}>{this.state.bgColorStr}</Text>
                <View style={{backgroundColor: this.state.bgColorStr, width: 100, height: 100}}></View>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bgcolor: {
        width: 100,
        height: 50,
        marginTop: 50,
    },
    bgTextColor: {
        fontSize: 16,
        color: 'red'
    },
});
