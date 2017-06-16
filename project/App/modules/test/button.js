'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    KeyboardAvoidingView,
    Modal,
    SegmentedControlIOS,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    View,
    Image,
} = ReactNative;

const SplashScreen = require('@remobile/react-native-splashscreen');
const Button = require('@remobile/react-native-simple-button');

module.exports = React.createClass({
    componentWillMount () {
        SplashScreen.hide();
    },
    open () {
        app.showProgressHUD();
        setTimeout(app.dismissProgressHUD, 1000000);
    },
    render () {
        return (
            <View style={styles.container}>
                <Button onPress={this.open}>开启</Button>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'space-around',
        paddingVertical: 150,
    },
});
