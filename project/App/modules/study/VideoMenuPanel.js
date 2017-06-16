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
import Share from 'react-native-share';
const UmengMgr = require('../../manager/UmengMgr.js');

const { Button } = COMPONENTS;
const titleArray = ['精品课程', '精彩案例', '编辑推荐', '课程亮点', '优秀案例'];

const LABEL_IMAGES = [
    app.img.home_class,
    app.img.study_mark_1,
    app.img.study_mark_2,
    app.img.study_mark_3,
];

module.exports = React.createClass({
    getInitialState () {
        return {
            personinfo: app.personal.info,
        };
    },
    componentDidMount () {
        this.getVideoInfoById();
    },
    getVideoInfoById () {
        const param = {
            userID:this.state.personinfo.userID,
            videoID: this.props.data.videoID,
        };
        POST(app.route.ROUTE_GET_VIDEO_INFO_BYID, param, this.doGetVideoInfoByIdSuccess);
    },
    doGetVideoInfoByIdSuccess (data) {
        if (data.success) {
            this.setState({ videoInfo: data.context });
        } else {
            Toast(data.msg);
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
                const param = {
                    userID:this.state.personinfo.userID,
                    videoID:this.props.data.videoID,
                };
                POST(app.route.ROUTE_DO_COLLECTION, param, this.doSuccess.bind(null, 1));
                break;
            }
            case 2: {
                this.doShare();// 弹出分享框
                break;
            }
            default:
        }
    },
    doSuccess (index, data) {
        if (data.success) {
            switch (index) {
                case 0:
                    this.noticeShow(this.props.data.videoID);
                    this.setState({ isPraise:0 });
                    Toast(data.msg);
                    break;
                case 1:
                    this.setState({ isCollection:0 });
                    Toast(data.msg);
                    break;
                case 2:
                    if (data.context.makePoint !== 0) {
                        this.noticeShowBox('分享', data.context.makePoint);
                    }
                    break;
                default:

            }
        } else {
            Toast(data.msg);
        }
    },
    noticeShow (videoID) {
        this.show(() => {
            this.props.noticeShow(videoID);
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
    doShare () {
        this.props.doShareCallVideo();
        const { name, clicks, urlPlay, urlImg, videoType } = this.props.data;
        const data = 'videoTitle=' + name + '&playTimes=' + clicks + '&videoUrl=' + urlPlay + '&videoImg=' + urlImg + '&videoType=' + videoType;
        const dataEncode = encodeURI(data);
        UmengMgr.doActionSheetShare(CONSTANTS.SHARE_SHAREDIR_SERVER + 'shareStudyVideo.html?' + dataEncode, '赢销学习场', name, 'web', urlImg, this.doShareCallback);
    },
    doShareCallback () {
        const param = {
            userID:this.state.personinfo.userID,
            shareType:0, // 0-分享视频 1-分享抽奖 2-分享战果
            keyword:this.props.data.name,
        };
        POST(app.route.ROUTE_DO_SHARE, param, this.doSuccess.bind(null, 2));
    },
    render () {
        let isPraise = 1;
        let isCollection = 1;
        if (typeof (this.state.videoInfo) != 'undefined') {
            if (this.state.isPraise == 0 || this.state.videoInfo.isPraise == 0) {
                isPraise = 0;
            }
            if (this.state.isCollection == 0 || this.state.videoInfo.isCollection == 0) {
                isCollection = 0;
            }
        }
        return (
            <View>
                {
                    (typeof (this.state.videoInfo) == 'undefined') ?
                        <View />
                    :
                        <View style={styles.panleMenuContainer}>
                            <View style={styles.panleMenuTopContainer}>
                                <Text style={styles.videoTitleText}>
                                    {this.state.videoInfo.name}
                                </Text>
                                <Image
                                    resizeMode='stretch'
                                    source={LABEL_IMAGES[this.state.videoInfo.videoType - 1]}
                                    style={styles.labelStyle} />
                            </View>
                            <View style={styles.panleMenuDownContainer}>
                                <Text style={styles.panleMenuText}>播放次数:{(this.state.videoInfo.clicks + 1) * 3 + 50}</Text>
                                <View
                                    style={styles.panleMenuBtnContainer}
                                    ref='menus'>
                                    <TouchableOpacity
                                        onPress={isPraise == 0 ? null : this._onPressRow.bind(null, 0)}
                                        style={styles.menuBtnContainer}>
                                        <Image
                                            resizeMode='contain'
                                            source={isPraise == 0 ? app.img.study_heart_press : app.img.study_heart}
                                            style={styles.iconStyle} />
                                        <Text style={styles.panleMenuBtnText}>
                                            {isPraise == 0 ? '已赞' : '点赞'}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={isCollection == 0 ? null : this._onPressRow.bind(null, 1)}
                                        style={styles.menuBtnContainer}>
                                        <Image
                                            resizeMode='contain'
                                            source={isCollection == 0 ? app.img.study_star_press : app.img.study_star}
                                            style={styles.iconStyle} />
                                        <Text style={styles.panleMenuBtnText}>
                                        收藏
                                    </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={this._onPressRow.bind(null, 2)}
                                        style={styles.menuBtnContainer}>
                                        <Image
                                            resizeMode='contain'
                                            source={app.img.study_share}
                                            style={styles.iconStyle} />
                                        <Text style={styles.panleMenuBtnText}>
                                        分享
                                    </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                }
            </View>
        );
    },
});

const styles = StyleSheet.create({
    panleMenuContainer: {
        height: 90,
        width:sr.w,
    },
    panleMenuTopContainer: {
        width:sr.w,
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    videoTitleText: {
        marginLeft: 8,
        fontSize: 15,
        marginTop: 12,
        fontWeight: '400',
        alignSelf: 'center',
        color: '#000',
    },
    labelStyle: {
        position: 'absolute',
        right: 0,
        top: 0,
        height: 48,
        width: 48,
    },
    panleMenuDownContainer: {
        width:sr.w,
        marginTop: 1,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
    },
    panleMenuText: {
        marginLeft: 10,
        fontSize: 12,
        alignSelf: 'center',
        justifyContent: 'center',
        color: 'grey',
    },
    panleMenuBtnContainer: {
        flexDirection: 'row',
    },
    menuBtnContainer: {
        marginRight: 10,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconStyle: {
        width:20,
        height:20,
    },
    panleMenuBtnText: {
        marginRight: 5,
        fontSize: 12,
        color: 'grey',
    },
});
