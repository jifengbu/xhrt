'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  View,
  StyleSheet
} = ReactNative;

var {ClipRect} = COMPONENTS;

module.exports = React.createClass({
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.container1}>
                    <ClipRect style={styles.cliprect1}/>
                    <View style={styles.rect1} />
                </View>
                <View style={styles.line} />
                <View style={styles.container1}>
                    <ClipRect style={styles.cliprect2}/>
                    <View style={styles.rect1} />
                </View>
                <View style={styles.rect1} />
            </View>
        )
    }
});

var BACK_COLOR = 'rgba(0, 0, 0, 0.4)';
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cliprect1: {
        width: 100,
        height: 100,
        borderRadius: 50,
        color: BACK_COLOR,
    },
    cliprect2: {
        width: 300,
        height: 100,
        borderRadius: 10,
        color: BACK_COLOR,
    },
    line: {
        height: 50,
        backgroundColor: BACK_COLOR,
    },
    container1: {
        flexDirection: 'row',
    },
    rect1: {
        flex: 1,
        backgroundColor: BACK_COLOR,
    }
});
