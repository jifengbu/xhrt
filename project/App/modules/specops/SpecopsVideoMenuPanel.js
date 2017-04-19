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
    noticeShowBox (title, point) {
        this.show(() => {
            this.props.noticeShowBox(title, point);
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
        return (
            <View style={styles.panleMenuContainer}>
                <View style={styles.panleMenuTopContainer}>
                    <Text style={styles.videoTitleText}>
                        {this.props.data && this.props.data.name}
                    </Text>
                    <View style={styles.playTimesContainer}>
                        <DImage
                            resizeMode='contain'
                            source={app.img.personal_eye}
                            style={styles.playTimesImage} />
                        <Text style={styles.playTimesText}>
                            {this.props.data && (this.props.data.clicks * 3 + 50)}
                        </Text>
                    </View>
                </View>
                <View style={styles.separator} />
                <View style={styles.panleMenuDownContainer}>
                    <TouchableOpacity
                        onPress={tempIsPraise == 0 ? null : this._onPressRow.bind(null, 0)}
                        style={styles.menuBtnContainer}>
                        <DImage
                            resizeMode='contain'
                            source={tempIsPraise == 0 ? app.img.personal_praise_pressed : app.img.personal_praise}
                            style={styles.iconStyle} />
                        <Text style={styles.panleMenuBtnText}>
                            {tempIsPraise == 0 ? '已赞' : '点赞'}{'  (' + (this.props.data ? this.props.data.likes : 0) + ')'}
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.divisionLine} />
                    <TouchableOpacity
                        onPress={tempIsCollection == 0 ? this.deleteCollect : this._onPressRow.bind(null, 1)}
                        style={styles.menuBtnContainer}>
                        <DImage
                            resizeMode='contain'
                            source={tempIsCollection == 0 ? app.img.personal_collect_pressed : app.img.personal_collect}
                            style={styles.iconStyle} />
                        <Text style={styles.panleMenuBtnText}>
                            {tempIsCollection == 0 ? '已收藏' : '收藏'}{'  (' + (this.props.data ? this.props.data.collections : 0) + ')'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    panleMenuContainer: {
        width:sr.w,
    },
    panleMenuTopContainer: {
        width:sr.w,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    videoTitleText: {
        width: sr.w - 100,
        marginLeft: 25,
        fontSize: 16,
        fontFamily: 'STHeitiSC-Medium',
        alignSelf: 'center',
        color: '#151515',
        marginVertical: 10,
    },
    playTimesContainer: {
        height: 12,
        marginRight: 11,
        flexDirection: 'row',
        alignItems: 'center',
    },
    playTimesImage: {
        width: 13,
        height: 12,
    },
    playTimesText: {
        width: 33,
        textAlign: 'right',
        color: '#989898',
        fontSize: 12,
        fontFamily: 'STHeitiSC-Medium',
    },
    separator: {
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    panleMenuDownContainer: {
        width:sr.w,
        height: 48,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuBtnContainer: {
        width: sr.w / 2 - 0.5,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
    },
    divisionLine: {
        width: 1,
        height: 30,
        backgroundColor: '#EFEFEF',
    },
    iconStyle: {
        width:13,
        height:13,
    },
    panleMenuBtnText: {
        marginLeft: 5,
        fontSize: 14,
        color: '#616161',
        fontFamily: 'STHeitiSC-Medium',
    },
});
