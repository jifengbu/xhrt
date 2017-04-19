'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    StyleSheet,
    TouchableOpacity,
    Image,
    Text,
    View,
} = ReactNative;

const Button = require('./button.js');
const Overlay = require('./overlay.js');
const Sheet = require('./sheet.js');

module.exports = React.createClass({
    render () {
        return (
            <Overlay visible={this.props.visible}>
                <View style={styles.actionSheetContainer}>
                    <TouchableOpacity
                        style={{ flex:1 }}
                        onPress={this.props.onCancel} />
                    <Sheet visible={this.props.visible}>
                        <View style={styles.cancelView}>
                            <Image
                                resizeMode='stretch'
                                source={app.img.common_lightLeft}
                                style={styles.imageStyle} />
                            <Text style={styles.buttonText}>
                                {'  分享  '}
                            </Text>
                            <Image
                                resizeMode='stretch'
                                source={app.img.common_lightRight}
                                style={styles.imageStyle} />
                            <TouchableOpacity
                                style={styles.cancel}
                                onPress={this.props.onCancel}>
                                <Image
                                    resizeMode='stretch'
                                    source={app.img.common_cancel}
                                    style={styles.cancelStyle} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.buttonContainer}>
                            {this.props.children}
                        </View>
                    </Sheet>
                </View>
            </Overlay>
        );
    },
});
module.exports.Button = Button;

const styles = StyleSheet.create({
    actionSheetContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    cancelView: {
        overflow: 'hidden',
        height: 70,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FCFCFC',
    },
    buttonContainer: {
        overflow: 'hidden',
        height: 99,
        width: sr.w,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#FCFCFC',
    },
    cancel: {
        overflow: 'hidden',
        position: 'absolute',
        right: 5,
        top: 5,
        height: 23,
        width: 23,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 17,
        color: '#D9D9D9',
    },
    imageStyle: {
        width: 128,
        height: 1,
    },
    cancelStyle: {
        width: 13,
        height: 13,
    },
});
