'use strict';
const React = require('react');
const ReactNative = require('react-native');
const {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} = ReactNative;

module.exports = React.createClass({
    render () {
        return (
            <View style={styles.container}>
                <Text style={styles.contextContainer}>
                    选项卡
                </Text>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contextContainer: {
        flex: 1,
        alignSelf:'center',
        color:'red',
    },
});
