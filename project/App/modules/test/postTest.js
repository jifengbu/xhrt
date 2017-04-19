'use strict';

const React = require('react');
const ReactNative = require('react-native');

const {
    StyleSheet,
    View,
    Text,
    Image,
    Platform,
    screenPhysicalPixels,
    Dimensions,
    UIManager,
} = ReactNative;

const SplashScreen = require('@remobile/react-native-splashscreen');
const Button = require('@remobile/react-native-simple-button');
import Swipeout from 'react-native-swipe-out';

module.exports = React.createClass({
    componentWillMount () {
        SplashScreen.hide();
    },
    doPost () {
        const param = {
            userID: '578ed52f0cf2a4e1d94c8efa',
        };
        POST(app.route.ROUTE_GET_PERSONAL_INFO, param, this.doPostSuccess);
    },
    doPostSuccess (data) {
        console.log(data);
    },
    render () {
        return (
            <View style={styles.container}>
                <Button onPress={this.doPost}>测试</Button>
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
