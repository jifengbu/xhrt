'use strict';

var React = require('react');
var ReactNative = require('react-native');

var {
    StyleSheet,
    View,
    Text,
    Image,
} = ReactNative;

var SplashScreen = require('@remobile/react-native-splashscreen');
var Button = require('@remobile/react-native-simple-button');
import  Swipeout  from 'react-native-swipe-out';
var {QRCode} = COMPONENTS;

module.exports = React.createClass({
    componentWillMount() {
        SplashScreen.hide();
        setTimeout(()=>{
            this.setState({a:"http://www.baidu.com"});
        }, 2000)
        setTimeout(()=>{
            this.setState({b:"http://www.baidu.com"});
        }, 4000)
    },
    getInitialState() {
        return {
            a: '1'
        };
    },
    render() {
        return (
            <View style={styles.container}>
                <QRCode
                    text={this.state.a}
                    width={156}
                    height={156}
                    />
                <Text>
                    {this.state.a}
                </Text>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
});
