'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TouchableHighlight,
} = ReactNative;

const { Button } = COMPONENTS;

module.exports = React.createClass({
    onPressImage () {
        app.closeModal();
    },
    render () {
        return (
            <View style={styles.overlayContainer}>
                <Image
                    resizeMode='stretch'
                    source={app.img.specops_guideImg}
                    style={styles.overlayBackgroundStyle}>
                    <TouchableOpacity
                        onPress={this.onPressImage}
                        style={styles.bannerTouch} />
                </Image>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    overlayContainer: {
        position:'absolute',
        top: 0,
        alignItems:'center',
        justifyContent: 'center',
        width:sr.w,
        height:sr.h,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    overlayBackgroundStyle: {
        width:sr.w,
        height:sr.h,
        alignItems:'center',
    },
    bannerTouch: {
        marginTop: 190,
        width: 120,
        height: 60,
    },
});
