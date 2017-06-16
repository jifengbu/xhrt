'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
} = ReactNative;

const { DImage } = COMPONENTS;

module.exports = React.createClass({
    statics: {
        color: '#FFFFFF',
        title: '快速提现',
        leftButton: { image: app.img.common_back, handler: () => { app.navigator.pop(); } },
    },
    render () {
        return (
            <View style={styles.container}>
                <DImage
                    resizeMode='stretch'
                    source={app.img.wallet_kstx}
                    style={styles.guideImage}/>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    guideImage: {
        width: sr.w,
        height: sr.ch,
    },
});
