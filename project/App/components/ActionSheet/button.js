'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} = ReactNative;

module.exports = React.createClass({
    render () {
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                style={[styles.button, this.props.buttonStyle]}
                onPress={this.props.onPress}>
                <Text style={[styles.buttonText, this.props.textStyle]}>
                    {this.props.children}
                </Text>
                <View style={styles.lineText} />
            </TouchableOpacity>
        );
    },
});

const styles = StyleSheet.create({
    buttonText: {
        color: '#202020',
        alignSelf: 'center',
        fontSize: 18,
    },
    button: {
        height: 160 / 3,
        borderColor: '#A1A2A3',
        justifyContent: 'center',
        backgroundColor: '#F6F6F6',
    },
    lineText: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: sr.w,
        height: 1,
        backgroundColor: '#D0D0D0',
    },
});
