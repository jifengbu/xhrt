'use strict';
var React = require('react');
var ReactNative = require('react-native');
var {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} = ReactNative;


module.exports = React.createClass({
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.contextContainer}>
                    选项卡
                </Text>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contextContainer: {
        flex: 1,
        alignSelf:'center',
        color:'red',
    },
});
