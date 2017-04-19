'use strict';

const React = require('react');
const ReactNative = require('react-native');

const {
    StyleSheet,
    View,
    Text,
    Image,
} = ReactNative;

const SplashScreen = require('@remobile/react-native-splashscreen');
const Button = require('@remobile/react-native-simple-button');
import Swipeout from 'react-native-swipe-out';

module.exports = React.createClass({
    componentWillMount () {
        SplashScreen.hide();
    },
    getInitialState () {
        return {
            backgroundColor :'red',
        };
    },
    onOpen (a, b, c) {
        console.log(a, b, c);
        this.setState({ backgroundColor: 'blue' });
    },
    onClose (a, b, c) {
        console.log(a, b, c);
        this.setState({ backgroundColor: 'red' });
    },
    render () {
        const swipeoutBtns = [
            {
                text: 'Button',
                backgroundColor: 'blue',
            },
            {
                text: 'Button',
                backgroundColor: 'green',
            },
        ];
        return (
            <View style={styles.container}>
                <Swipeout right={swipeoutBtns}
                    onOpened={this.onOpen}
                    onClosed={this.onClose}
                    autoClose
                    >
                    <View style={[styles.fang, { backgroundColor: this.state.backgroundColor }]}>
                        <Text>Swipe me left</Text>
                    </View>
                </Swipeout>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fang: {
        height: 50,
        width: sr.w,
    },
});
