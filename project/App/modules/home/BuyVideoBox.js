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
        this.props.doConfirm();
        app.closeModal();
    },
    render () {
        return (
            <View style={styles.overlayContainer}>
                <Image
                    resizeMode='stretch'
                    source={app.img.home_box_bg2}
                    style={styles.overlayBackgroundStyle}>
                    <View style={styles.bottomContainer}>
                        <TouchableOpacity
                            onPress={app.closeModal}
                            style={styles.bannerTouch}>
                            <Image
                                resizeMode='stretch'
                                source={app.img.home_btn_about}
                                style={styles.btnStyle}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.finishGuide}
                            style={styles.bannerTouch}>
                            <Image
                                resizeMode='stretch'
                                source={app.img.home_btn_specops}
                                style={styles.btnStyle}/>
                        </TouchableOpacity>
                    </View>
                </Image>
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
        height: 390,
        alignItems: 'center',
    },
    bottomContainer: {
        width: 250,
        height: 40,
        marginTop: 327,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bannerTouch: {
        width: 120,
        height: 40,
    },
    btnStyle: {
        width: 120,
        height: 40,
    },
});
