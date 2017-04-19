'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} = ReactNative;

const { Button } = COMPONENTS;
import Swiper from 'react-native-swiper2';

module.exports = React.createClass({
    getInitialState () {
        return {
            overlayImage1: true,
            overlayImage2: false,
            overlayImage3: false,
            overlayImage4: false,
        };
    },
    onPressImage1 () {
        this.setState({
            overlayImage1: false,
            overlayImage2: true,
        });
    },
    onPressImage2 () {
        this.setState({
            overlayImage2: false,
            overlayImage3: true,
        });
    },
    onPressImage3 () {
        this.setState({
            overlayImage3: false,
            overlayImage4: true,
        });
    },
    onPressImage4 () {
        app.closeModal();
    },
    render () {
        const images = [app.img.specops_guide1, app.img.specops_guide2, app.img.specops_guide3, app.img.specops_guide4];
        return (
            <View style={styles.overlayContainer}>
                {
                    this.state.overlayImage1 &&
                    <Image
                        resizeMode='stretch'
                        source={app.img.specops_guide1}
                        style={styles.overlayBackgroundStyle}>
                        <TouchableOpacity
                            onPress={this.onPressImage1}
                            style={styles.bannerTouch} />
                    </Image>
                }
                {
                    this.state.overlayImage2 &&
                    <Image
                        resizeMode='stretch'
                        source={app.img.specops_guide2}
                        style={styles.overlayBackgroundStyle}>
                        <TouchableOpacity
                            onPress={this.onPressImage2}
                            style={styles.bannerTouch} />
                    </Image>
                }
                {
                    this.state.overlayImage3 &&
                    <Image
                        resizeMode='stretch'
                        source={app.img.specops_guide3}
                        style={styles.overlayBackgroundStyle}>
                        <TouchableOpacity
                            onPress={this.onPressImage3}
                            style={styles.bannerTouch} />
                    </Image>
                }
                {
                    this.state.overlayImage4 &&
                    <Image
                        resizeMode='stretch'
                        source={app.img.specops_guide4}
                        style={styles.overlayBackgroundStyle}>
                        <TouchableOpacity
                            onPress={this.onPressImage4}
                            style={styles.bannerOther} />
                    </Image>
                }
            </View>
        );
    },
});

const styles = StyleSheet.create({
    overlayContainer: {
        position:'absolute',
        top: 0,
        width:sr.w,
        height:sr.h,
    },
    overlayBackgroundStyle: {
        width:sr.w,
        alignItems: 'center',
        height:sr.h,
    },
    btnText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontFamily: 'STHeitiSC-Medium',
    },
    bottomContainer: {
        width: sr.w - 60,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bannerTouch: {
        width: 160,
        height: 50,
        marginTop: 550,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    bannerOther: {
        width: 160,
        height: 50,
        marginTop: 290,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
});
