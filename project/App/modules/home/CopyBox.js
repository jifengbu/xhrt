'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    Text,
    Animated,
    View,
    Image,
    Clipboard,
    TouchableOpacity,
} = ReactNative;

module.exports = React.createClass({
    doConfirm () {
        Clipboard.setString(this.props.copyString);
        app.closeModal();
    },
    render () {
        const { copyX, copyY } = this.props;
        return (
            <TouchableOpacity activeOpacity={1} onPress={app.closeModal} style={styles.overlayContainer}>
                <TouchableOpacity
                    onPress={this.doConfirm}
                    style={[styles.container, { marginLeft: sr.ws(copyX - 30), marginTop: sr.ws(copyY - 40) }]}>
                    <Image
                        resizeMode='stretch'
                        source={app.img.home_copyBox}
                        style={styles.imageStyle}>
                        <Text style={styles.buttonStyle}>复 制</Text>
                    </Image>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    },
});

const styles = StyleSheet.create({
    buttonStyle: {
        fontSize: 14,
        color: '#FFFFFF',
        alignSelf: 'center',
        marginTop: app.isandroid ? 5 : 8,
    },
    container: {
        width: 60,
        height: 40,
        alignItems:'center',
        backgroundColor:'transparent',
    },
    imageStyle: {
        width: 60,
        height: 40,
        alignItems: 'center',
    },
    overlayContainer: {
        position: 'absolute',
        width: sr.w,
        height: sr.h,
        left: 0,
        bottom: 0,
    },
});
