'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    StyleSheet,
    TouchableOpacity,
    Image,
    Text,
    View,
} = ReactNative;

var Button = require('./button.js');
var Overlay = require('./overlay.js');
var Sheet = require('./sheet.js');

module.exports =  React.createClass({
    render() {
        return (
            <Overlay visible={this.props.visible}>
                <View style={styles.actionSheetContainer}>
                    <TouchableOpacity
                        style={{flex:1}}
                        onPress={this.props.onCancel}>
                    </TouchableOpacity>
                    <Sheet visible={this.props.visible}>
                        <View style={styles.cancelView}>
                            <Image
                                resizeMode='stretch'
                                source={app.img.common_lightLeft}
                                style={styles.imageStyle}>
                            </Image>
                            <Text style={styles.buttonText}>
                                {'  分享  '}
                            </Text>
                            <Image
                                resizeMode='stretch'
                                source={app.img.common_lightRight}
                                style={styles.imageStyle}>
                            </Image>
                            <TouchableOpacity
                                style={styles.cancel}
                                onPress={this.props.onCancel}>
                                <Image
                                    resizeMode='stretch'
                                    source={app.img.common_cancel}
                                    style={styles.cancelStyle}>
                                </Image>
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

var styles = StyleSheet.create({
    actionSheetContainer: {
        flex: 1,
        justifyContent: "flex-end",
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
