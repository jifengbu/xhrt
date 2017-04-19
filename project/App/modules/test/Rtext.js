'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} = ReactNative;

const SplashScreen = require('@remobile/react-native-splashscreen');
const { DelayTouchableOpacity, RText } = COMPONENTS;

module.exports = React.createClass({
    componentWillMount () {
        SplashScreen.hide();
    },
    render () {
        return (
            <View style={styles.container}>
                <View style={{ width: 300, height: 400, backgroundColor: 'green', marginTop: 100 }}>
                    <RText style={styles.contextText}>
                        哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈啊哈
                    </RText>
                </View>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contextText: {
        fontSize: 18,
        // lineHeight: 20,
        justifyContent: 'center',
        backgroundColor: 'red',
        color: '#555555',
    },
});
