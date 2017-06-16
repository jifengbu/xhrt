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
    finishGuide () {
        // this.props.doGuidance();
        // app.closeModal();
    },
    render () {
        return (
            <View style={styles.overlayContainer}>
                <View style={styles.container}>
                    <Image
                        resizeMode='stretch'
                        source={app.img.home_box_bg}
                        style={styles.overlayBackgroundStyle}>
                        <TouchableOpacity
                            onPress={this.finishGuide}
                            style={styles.bannerTouch}>
                            <Image
                                resizeMode='stretch'
                                source={app.img.home_btn_specops2}
                                style={styles.btnStyle}/>
                        </TouchableOpacity>
                    </Image>
                    <TouchableHighlight
                        onPress={app.closeModal}
                        underlayColor='rgba(0, 0, 0, 0)'
                        style={styles.touchableHighlight}>
                        <Image
                            resizeMode='contain'
                            source={app.img.home_btn_cancel}
                            style={styles.closeIcon} />
                    </TouchableHighlight>
                </View>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        width: 300,
        height: 510,
        alignItems: 'center',
    },
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
        width: 300,
        height: 435,
        alignItems: 'center',
    },
    bannerTouch: {
        width: 250,
        height: 40,
        marginTop: 360,
    },
    btnStyle: {
        width: 250,
        height: 40,
    },
    closeIcon: {
        width: 50,
        height: 50,
    },
    touchableHighlight: {
        position:'absolute',
        bottom: 10,
        left: 125,
        width: 50,
        height: 50,
    },
});
