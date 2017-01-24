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

module.exports = React.createClass({
    componentWillMount() {
        SplashScreen.hide();
    },
    getInitialState() {
        return {
            backgroundColor :'red',
        };
    },
    onOpen(a, b, c) {
        console.log(a, b, c)
        this.setState({backgroundColor: 'blue'});
    },
    onClose(a, b, c) {
        console.log(a, b, c)
        this.setState({backgroundColor: 'red'});
    },
    render() {
        var swipeoutBtns = [
            {
                text: 'Button',
                backgroundColor: 'blue',
            },
            {
                text: 'Button',
                backgroundColor: 'green',
            }
        ]
        return (
            <View style={styles.container}>
                <Swipeout right={swipeoutBtns}
                    onOpened={this.onOpen}
                    onClosed={this.onClose}
                    autoClose={true}
                    >
                    <View style={[styles.fang, {backgroundColor: this.state.backgroundColor}]}>
                        <Text>Swipe me left</Text>
                    </View>
                </Swipeout>
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
    fang: {
        height: 50,
        width: sr.w,
    },
});
