'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    Text,
    Image,
} = ReactNative;

module.exports = React.createClass({
    render () {
        const { img, children, style, textStyle } = this.props;
        return (
            <View style={[styles.labelContainer, style]}>
                {!!img && <Image resizeMode='stretch' source={img} style={styles.labelIcon} />}
                <Text style={[styles.label, textStyle]}>{children}:</Text>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    labelContainer: {
        marginTop: 10,
        marginBottom: 6,
        flexDirection: 'row',
        overflow: 'hidden',
        alignItems:'center',
    },
    label: {
        color: '#969696',
        fontSize: 14,
    },
    labelIcon: {
        width: 20,
        height: 20,
    },
});
