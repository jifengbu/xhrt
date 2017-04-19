'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    View,
} = ReactNative;

module.exports = React.createClass({
    render () {
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                style={[styles.button, this.props.buttonStyle]}
                onPress={this.props.onPress}>
                <Image
                    resizeMode='stretch'
                    source={this.props.image}
                    style={styles.imageStyle} />
                <Text style={[styles.buttonText, this.props.textStyle]}>
                    {this.props.children}
                </Text>
            </TouchableOpacity>
        );
    },
});

const styles = StyleSheet.create({
    buttonText: {
        color: '#393939',
        fontSize: 14,
        marginTop: 10,
        fontFamily: 'STHeitiSC-Medium',
    },
    button: {
        height: 80,
        width: sr.w / 3,
        borderColor: '#A1A2A3',
        alignItems: 'center',
        backgroundColor: '#FCFCFC',
    },
    imageStyle: {
        width: 48,
        height: 48,
    },
});
