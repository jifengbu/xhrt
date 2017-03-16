'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} = ReactNative;

var {Button} = COMPONENTS;

module.exports = React.createClass({
    finishGuide() {
        this.props.doGuidance();
    },
    render() {
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
                            <Text style={styles.nameText}>
                                {'系统化的赢销人才成长体系'}
                            </Text>
                            <Text style={styles.nameText}>
                                {'可便捷记录工作报表，轻松管理每日工作'}
                            </Text>
                        </View>
                        <View style={styles.midContainer}>
                            <Text style={styles.themeText}>
                                {'已为您免费开通'}
                            </Text>
                            <Text style={styles.titleText}>
                                {'3集王雩老师课程'}
                            </Text>
                        </View>
                        <View style={styles.bottomContainer}>
                            <TouchableOpacity
                                onPress={this.finishGuide}
                                style={styles.bannerTouch}>
                                <Text style={styles.btnText}>
                                    {'立即体验'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Image>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        width:sr.w-60,
        height: 260,
        marginTop: 140,
        backgroundColor:'#FFFFFF',
    },
    overlayContainer: {
        position:'absolute',
        top: 0,
        alignItems:'center',
        justifyContent: 'center',
        width:sr.w,
        height:sr.h,
        backgroundColor: 'rgba(0,0,0,0.3)'
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
        fontFamily: 'STHeitiSC-Medium'
    },
    themeText: {
        color: 'black',
        fontSize: 15,
        fontFamily: 'STHeitiSC-Medium'
    },
    titleText: {
        color: '#DE3031',
        fontSize: 17,
        fontWeight: '500',
        marginTop: 5,
        fontFamily: 'STHeitiSC-Medium'
    },
    btnText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontFamily: 'STHeitiSC-Medium'
    },
    topContainer: {
        width: sr.w-60,
        height: 90,
        alignItems: 'center',
        justifyContent: 'center',
    },
    midContainer: {
        width: sr.w-60,
        height: 90,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomContainer: {
        width: sr.w-60,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bannerTouch: {
        width: 130,
        height: 40,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DE3031'
    },
});
