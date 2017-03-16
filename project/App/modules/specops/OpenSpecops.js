'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
    Text,
    Animated,
    View,
    Image,
    Linking,
    TouchableOpacity,
    TouchableHighlight,
} = ReactNative;

var PaySpecopsMessageBox = require('./PaySpecopsMessageBox.js');

const contentList = ['观看全部王雩的线上教学课程', '解锁全部新功能,解锁全部新功能,解锁全部新功能', '后续还会提供更全面的内容'];

module.exports = React.createClass({
    toUnauthorized() {
        app.showModal(
            <PaySpecopsMessageBox
                doPayByWechat={this.doPayByWechat}
                doPayByAlipay={this.doPayByAlipay}
                doClose={()=>app.closeModal}
            />
        );
    },
    doPayByWechat() {
        this.onBuySuccess();
    },
    doPayByAlipay() {
        this.onBuySuccess();
    },
    onBuySuccess() {
        app.closeModal();
        this.props.setAuthorized();
        Toast("恭喜你成为特种兵");
    },
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.separator}></View>
                <Text style={styles.title}>{'开通赢销特种兵'}</Text>
                <Text style={styles.introduce}>{'体验更全面课程和更优质服务'}</Text>
                <View style={styles.contentView}>
                    {
                        contentList.map((item, i)=>{
                            return (
                                <View style={styles.contentItemView}>
                                    <Image resizeMode='contain' source={app.img.specops_mark_tick} style={styles.icon}></Image>
                                    <Text style={styles.content}>{item}</Text>
                                </View>
                            )
                        })
                    }
                </View>
                <TouchableOpacity
                    onPress={this.toUnauthorized}
                    style={styles.touchStyle}>
                    <Text style={styles.touchText}>开通特种兵</Text>
                </TouchableOpacity>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:'center',
        backgroundColor: '#FFFFFF',
    },
    separator: {
        width: sr.w,
        backgroundColor: '#EDEDED',
        height: 1,
    },
    title: {
        color: '#fc1919',
        fontSize: 20,
        fontFamily: 'STHeitiSC-Medium',
        marginTop: 40,
    },
    introduce: {
        color: '#4e4e4e',
        fontSize: 16,
        fontFamily: 'STHeitiSC-Medium',
        marginTop: 15,
    },
    contentView: {
        width: sr.w,
        marginTop: 55,
        alignItems: 'center',
    },
    contentItemView: {
        width: sr.w-60,
        marginLeft: 30,
        marginTop: 25,
        alignItems: 'center',
        flexDirection: 'row',
    },
    icon: {
        width: 23,
        height: 23,
        marginRight: 10,
    },
    content: {
        width: sr.w-96,
        color:'#666666',
        fontSize:16,
        fontFamily: 'STHeitiSC-Medium',
    },
    touchStyle: {
        width: sr.w-40,
        height: 50,
        bottom: 20,
        left: 20,
        position: 'absolute',
        borderRadius: 2,
        backgroundColor: '#fc4045',
        alignItems: 'center',
        justifyContent: 'center',
    },
    touchText: {
        fontSize: 18,
        color: '#FFFFFF',
        fontFamily: 'STHeitiSC-Medium',
    },
});
