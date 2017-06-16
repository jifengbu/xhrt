'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    Image,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} = ReactNative;

const UmengMgr = require('../../manager/UmengMgr.js');
const moment = require('moment');

const { Button, DImage } = COMPONENTS;

module.exports = React.createClass({
    getInitialState () {
        this.isCollectSel = false;
        return {
            personinfo: app.personal.info,
        };
    },
    deleteCollect () {
        if (this.isCollectSel) {
            return;
        }
        this.isCollectSel = true;
        const param = {
            userID:app.personal.info.userID,
            vedioIDList:[this.props.data.videoID],
        };
        POST(app.route.ROUTE_SUBMIT_DELETEMYCOLLECTION, param, this.deleteCollectSuccess);
    },
    deleteCollectSuccess (data) {
        this.isCollectSel = false;
        if (data.success) {
            this.noticeShow(this.props.data.videoID, 'subCollection');
        }
    },
    _onPressRow (i) {
        switch (i) {
            case 0: {
                const param = {
                    userID:this.state.personinfo.userID,
                    videoID:this.props.data.videoID,
                };
                POST(app.route.ROUTE_DO_LIKE, param, this.doSuccess.bind(null, 0));
                break;
            }
            case 1: {
                if (this.isCollectSel) {
                    return;
                }
                this.isCollectSel = true;
                const param = {
                    userID:this.state.personinfo.userID,
                    videoID:this.props.data.videoID,
                };
                POST(app.route.ROUTE_DO_COLLECTION, param, this.doSuccess.bind(null, 1));
                break;
            }
            default:
        }
    },
    doSuccess (index, data) {
        this.isCollectSel = false;
        if (data.success) {
            switch (index) {
                case 0:
                    this.noticeShow(this.props.data.videoID, 'isPraise');
                // Toast(data.msg);
                    break;
                case 1:
                    this.noticeShow(this.props.data.videoID, 'isCollection');
                    break;
                default:

            }
        } else {
            // Toast(data.msg);
        }
    },
    noticeShow (videoID, praiseOrCollection) {
        this.show(() => {
            this.props.noticeShow(videoID, praiseOrCollection);
        });
    },
    show (callback) {
        return callback();
    },
    doShareCallback () {
        const param = {
            userID:this.state.personinfo.userID,
            shareType:0, // 0-分享视频 1-分享抽奖
            keyword:this.props.data.name,
        };
        POST(app.route.ROUTE_DO_SHARE, param, this.doSuccess.bind(null, 2));
    },
    render () {
        let tempIsPraise = 1;
        let tempIsCollection = 1;
        if (this.props.data) {
            if (this.props.data.isPraise == 0) {
                tempIsPraise = 0;
            }
            if (this.props.data.isCollection == 0) {
                tempIsCollection = 0;
            }
        }
        const { isAgent, isSpecialSoldier } = app.personal.info;
        const authorized = isAgent || isSpecialSoldier;
        return (
            <View style={styles.panleMenuContainer}>
                <View style={styles.panleMenuTopContainer}>
                    <Text numberOfLines={1} style={styles.videoTitleText}>
                        {this.props.data && this.props.data.name}
                    </Text>
                    <View style={styles.playTimesContainer}>
                        <Text style={[styles.playTimesText,{color: '#FFB235'}]}>
                            {this.props.data && (this.props.data.clicks * 3 + 50)}
                        </Text>
                        <Text style={[styles.playTimesText,{color: '#979797'}]}>
                            {'人正在学习'}
                        </Text>
                    </View>
                    <View style={[styles.playTimesContainer,{justifyContent: 'space-between'}]}>
                        <View style={styles.playContainer}>
                            {
                                authorized?
                                <Image
                                    resizeMode='contain'
                                    source={app.img.home_icon_specops}
                                    style={styles.iconSpecops} />:
                                <Text style={styles.money}>{'￥'}
                                    <Text numberOfLines={1} style={styles.lastTimeText}>
                                        {'9.9'}
                                    </Text>
                                </Text>
                            }
                        </View>
                        <View style={styles.playContainer}>
                            <TouchableOpacity
                                onPress={tempIsPraise == 0 ? null : this._onPressRow.bind(null, 0)}
                                style={styles.menuBtnContainer}>
                                <DImage
                                    resizeMode='contain'
                                    source={tempIsPraise == 0 ? app.img.home_btn_zan : app.img.home_btn_zan_w}
                                    style={styles.iconStyle} />
                                <Text style={styles.panleMenuBtnText}>
                                    {this.props.data ? this.props.data.likes : 0}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={tempIsCollection == 0 ? this.deleteCollect : this._onPressRow.bind(null, 1)}
                                style={styles.menuBtnContainer}>
                                <DImage
                                    resizeMode='contain'
                                    source={tempIsCollection == 0 ? app.img.home_btn_collect : app.img.home_btn_collect_w}
                                    style={styles.iconStyle} />
                                <Text style={styles.panleMenuBtnText}>
                                    {this.props.data ? this.props.data.collections : 0}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.separator} />
                <View style={styles.titleContainer}>
                    <View style={styles.leftTitleStyle}>
                        <Image
                            resizeMode='stretch'
                            source={app.img.home_rectangle}
                            style={styles.titleView}>
                        </Image>
                        <Text style={styles.titleText}>视频简介</Text>
                    </View>
                </View>
                <View style={styles.viewText}>
                    <Text style={styles.synopsisText}>
                        {this.props.data && (app.isandroid ? '        ' : '\t') + this.props.data.detail}
                    </Text>
                </View>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    panleMenuContainer: {
        width:sr.w,
        backgroundColor: '#FFFFFF'
    },
    panleMenuTopContainer: {
        width:sr.w,
        justifyContent: 'center',
    },
    videoTitleText: {
        marginHorizontal: 10,
        fontSize: 16,
        fontFamily: 'STHeitiSC-Medium',
        color: '#424242',
        marginVertical: 10,
    },
    playTimesContainer: {
        marginHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    playContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    playTimesText: {
        fontSize: 11,
    },
    separator: {
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    menuBtnContainer: {
        width: 50,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconStyle: {
        width:13,
        height:13,
    },
    iconSpecops: {
        width: 55,
        height: 17,
    },
    panleMenuBtnText: {
        marginLeft: 5,
        fontSize: 14,
        marginVertical: 12,
        color: '#979797',
        fontFamily: 'STHeitiSC-Medium',
    },
    money: {
        color: '#FB771A',
        fontSize: 11,
    },
    lastTimeText: {
        color: '#FB771A',
        fontSize: 18,
    },
    titleContainer: {
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftTitleStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleView: {
        width: 2,
        height: 14,
        marginLeft: 8,
    },
    titleText: {
        width: 150,
        fontSize: 14,
        color: '#4A4848',
        marginLeft: 10,
        fontFamily: 'STHeitiSC-Medium',
    },
    viewText: {
        marginHorizontal: 20,
        marginBottom: 20,
    },
    synopsisText: {
        fontSize: 14,
        lineHeight: 18,
        color: '#777777',
    },
});
