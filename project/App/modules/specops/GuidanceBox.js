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
        this.props.doGuidance();
        app.closeModal();
    },
    render () {
        return (
            <View style={styles.overlayContainer}>
                <Image
                    resizeMode='stretch'
                    source={app.img.specops_guide}
                    style={styles.overlayBackgroundStyle}>
                    <View style={styles.container}>
                        <View style={styles.topContainer}>
                            <Text style={styles.nameText}>
                                {'世界500强的管控系统'}
                            </Text>
                            <Text style={[styles.nameText, { marginTop:3 }]}>
                                {'系统化的赢销人才成长体系'}
                            </Text>
                            <Text style={[styles.nameText, { marginTop:3 }]}>
                                {'可便捷记录工作报表，轻松管理每日工作'}
                            </Text>
                        </View>
                        <Text style={styles.promptText}>
                            {'点击立即开通'}
                        </Text>
                        <Text style={styles.detailText}>
                            {'即可观看48集赢销截拳道系列课程'}
                        </Text>
                        <View style={styles.bottomContainer}>
                            <TouchableOpacity
                                onPress={this.finishGuide}
                                style={styles.bannerTouch}>
                                <Text style={styles.btnText}>
                                    {'立即开通'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableHighlight
                        onPress={app.closeModal}
                        underlayColor='rgba(0, 0, 0, 0)'
                        style={styles.touchableHighlight}>
                        <Image
                            resizeMode='contain'
                            source={app.img.draw_back}
                            style={styles.closeIcon} />
                    </TouchableHighlight>
                </Image>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        width:sr.w - 60,
        height: 250,
        marginTop: 130,
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
        width:sr.w,
        height:sr.h,
        alignItems:'center',
        justifyContent: 'center',
    },
    nameText: {
        color: '#666666',
        fontSize: 14,
        fontFamily: 'STHeitiSC-Medium',
    },
    promptText: {
        color: '#000000',
        fontSize: 16,
        marginTop: 20,
        fontFamily: 'STHeitiSC-Medium',
    },
    detailText: {
        color: '#DE3031',
        fontSize: 16,
        marginTop: 10,
        fontFamily: 'STHeitiSC-Medium',
    },
    btnText: {
        color: '#FFFFFF',
        fontSize: 20,
    },
    topContainer: {
        width: sr.w - 60,
        height: 90,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomContainer: {
        width: sr.w - 60,
        height: 60,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bannerTouch: {
        width: 130,
        height: 40,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DE3031',
    },
    closeIcon: {
        width: 30,
        height: 30,
    },
    touchableHighlight: {
        position:'absolute',
        top: 128,
        right: 12,
        width: 30,
        height: 30,
    },
});
