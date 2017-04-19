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
const { QRCode } = COMPONENTS;

module.exports = React.createClass({
    componentWillMount () {
        SplashScreen.hide();
        setTimeout(() => {
            this.setState({ a:'http://www.baidu.com' });
        }, 2000);
        setTimeout(() => {
            this.setState({ b:'http://www.baidu.com' });
        }, 4000);
    },
    getInitialState () {
        return {
            a: '1',
        };
    },
    render () {
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
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
