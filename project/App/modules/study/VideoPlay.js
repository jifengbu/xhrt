'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    AppState,
    Image,
    StyleSheet,
    ScrollView,
    TextInput,
    AsyncStorage,
    Text,
    View,
    TouchableOpacity,
} = ReactNative;
var dismissKeyboard = require('dismissKeyboard');
var UmengMgr = require('../../manager/UmengMgr.js');
var VideoComment = require('./VideoComment.js');
var VideoRecommend = require('./VideoRecommend.js');
var VideoMenuPanel = require('./VideoMenuPanel.js');
var StudyAwardMessageBox = require('./StudyAwardMessageBox.js');
var TaskMessageBox = require('./TaskMessageBox.js');
var Draw = require('./Draw.js');
var Player = require('./Player.js');
var ShowMealBox = require('../package/ShowMealBox.js');
var FirstMessageBox = require('./FirstMessageBox.js');

var {Button, DImage} = COMPONENTS;
const ITEM_NAME = "DO_REFRESH_COMMENTS";

var VideoPlay = React.createClass({
    mixins: [SceneMixin],
    statics: {
        color: '#000000',
        guideLayer: require('../guide/StudyGuide.js'),
        leftButton: { image: app.img.common_back2, handler: ()=>{app.navigator.pop()}},
    },
    componentWillMount() {
        app.updateNavbarColor(CONSTANTS.THEME_COLORS[1]);
    },
    onWillHide() {
        if (this.props.isFromRecords) {
        } else {
            app.updateNavbarColor(CONSTANTS.THEME_COLORS[1]);
        }
    },
    componentDidMount() {
        this.doUpdateClicks();
        AppState.addEventListener('change', this._handleAppStateChange);
    },
    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    },
    _handleAppStateChange: function(currentAppState) {
        if (currentAppState !== 'active') {
            this.fullScreenListener(false);
        }
    },
    doUpdateClicks() {
        var param = {
            userID:this.state.personinfo.userID,
            videoID:this.props.videoInfo.videoID
        };
        POST(app.route.ROUTE_UPDATECLICKS, param, this.doUpdateClicksSuccess);
    },
    doUpdateClicksSuccess(data) {
        if (data.success) {
            //点击视频播放接口返回成功后通知列表更新点击数
            this.props.updateClickOrLikeNum && this.props.updateClickOrLikeNum({videoID: this.props.videoInfo.videoID, type: 'click'});
        } else {
            Toast(data.msg);
        }
    },
    getInitialState() {
        return {
            overlayShowStudyAward:false,
            overlayFirstMessageBox: false,
            isFullScreen: false,
            makePoint:0,
            personinfo: app.personal.info,
            ShowMealBox: false,
            boxTitle: 0,
            boxPoint: 0,
            isSendding: false,
            isChildComment: false,
            tempCommentID: 0,
            tempPublisherName: '',
            commentContent: '',
            scrollEnabled: true,
        };
    },
    doCancle() {
        this.setState({ShowMealBox: false});
    },
    toggleMenuPanel() {
        if (!this.state.overlayShowTask) {
            var param = {
                userID:this.state.personinfo.userID,
            };
            POST(app.route.ROUTE_GET_TASK_INTEGRATION, param, this.doGetTaskIntegrationSuccess, true);
        }
    },
    doGetTaskIntegrationSuccess(data) {
        if (data.success) {
            let taskList = data.context.taskList||[];
            this.setState({taskList: taskList, overlayShowTask:true});
        } else {
            Toast(data.msg);
        }
    },
    onComplete() {
        this.getWatchVideoReward();
    },
    doClose() {
        this.setState({overlayShowStudyAward:false});
    },
    doCloseFirst() {
        this.setState({overlayFirstMessageBox:false});
    },
    doCloseTask() {
        this.setState({overlayShowTask:false});
    },
    doGetRewardList() {
        var param = {
            userID:this.state.personinfo.userID,
        };
        POST(app.route.ROUTE_GET_REWARD_LIST, param, this.doGetRewardListSuccess, true);
    },
    doGetRewardListSuccess(data) {
        this.setState({overlayShowStudyAward:false});
        app.navigator.push({
            component: Draw,
            passProps: {rewardBackImg:data.context.rewardImg,costCoin:data.context.consMarsCoin},
        });
    },
    doDraw() {
        this.doGetRewardList();
    },
    doShare(makePoint) {
        this.setState({overlayShowStudyAward:false});
        let name = '亲爱的特种兵'+app.personal.info.name+'同志';
        let percentage = makePoint > 0? ('获得赢销积分+'+makePoint+'分'):'';
        let encourage = makePoint > 0? '并且获得一次抽奖机会':'获得一次抽奖机会';
        var desc = name+percentage+encourage;
        var data = 'name='+name+'&logo='+app.personal.info.headImg+'&percentage='+percentage+'&encourage='+encourage
        var dataEncode = encodeURI(data);
        UmengMgr.doActionSheetShare(CONSTANTS.SHARE_SHAREDIR_SERVER+'shareStudyAndCompletion.html?'+dataEncode,'积分奖励',desc,'web',this.props.videoInfo.urlImg,this.doShareCallback);
    },
    doShareCallback() {
        var param = {
            userID:this.state.personinfo.userID,
            shareType:1, //0-分享视频 1-分享抽奖 2-分享战果
            keyword:'一次抽奖机会',
        };
        POST(app.route.ROUTE_DO_SHARE, param, this.doShareSuccess);
    },
    doShareSuccess(data) {
        Toast(data.msg);
    },
    doPayConfirm() {
        app.navigator.push({
            title: '套餐',
            component: require('../package/PackageList.js'),
        });
        this.setState({ShowMealBox: false});
    },
    fullScreenListener(isFullScreen) {
        this.setState({scrollEnabled: !isFullScreen});
        app.toggleNavigationBar(!isFullScreen);
        this.setState({isFullScreen});
        app.GlobalVarMgr.setItem('isFullScreen', isFullScreen);
    },
    getWatchVideoReward() {
        var param = {
            userID:this.state.personinfo.userID,
            videoID:this.props.videoInfo.videoID,
        };
         POST(app.route.ROUTE_WATCH_VIDEO, param, this.getWatchVideoRewardSuccess, true);
    },
    getWatchVideoRewardSuccess(data) {
        dismissKeyboard();
        if (data.success) {
            var personInfo = app.personal.info;
            this.setState({makePoint:data.context.makePoint, overlayShowStudyAward:true});
            personInfo.integral += data.context.makePoint;
            app.personal.set(personInfo);
            //增加学习课程数量,用于首页显示
            app.studyNumMgr.addStudyNum(this.props.videoInfo.videoID);
        } else {
            Toast(data.msg);
        }
    },
    doRestart(obj) {
        if (app.personal.info.userType == "0" && obj.isFree != 1) {
            this.setState({ShowMealBox: true});
            return;
        }
        if (app.personal.info.userType == "1" && obj.isFree != 1) {
            if (_.find(app.personal.info.validVideoList,(item)=>item==obj.videoID)) {
                app.navigator.replace({
                    title: obj.name,
                    component: VideoPlay,
                    passProps: {videoInfo:obj},
                });
                return;
            }
            this.setState({ShowMealBox: true});
            return;
        }
        app.navigator.replace({
            title: obj.name,
            component: VideoPlay,
            passProps: {videoInfo:obj},
        });
    },
    //通过回调得到点赞成功改变数量显示
    updateHeart(videoID) {
        this.props.updateClickOrLikeNum && this.props.updateClickOrLikeNum({videoID: videoID, type: 'heart'});
    },
    updatePoint(boxTitle,boxPoint) {
        this.setState({boxTitle:boxTitle,boxPoint:boxPoint});
        this.setState({overlayFirstMessageBox:true});
    },
    updatePointCom(boxTitle,boxPoint) {
    this.setState({boxTitle:boxTitle,boxPoint:boxPoint});
    this.setState({overlayFirstMessageBox:true});
},
doSubmitComment() {
    dismissKeyboard();
    if (this.state.commentContent === '') {
        Toast('请提交感悟信息');
        return;
    }
    if (!this.state.isSendding) {
        Toast('正在发送感悟...');
        this.setState({isSendding: true});
        //为true子评论，为false评论
        if (this.state.isChildComment) {
            var param = {
                userID:app.personal.info.userID,
                videoID:this.props.videoInfo.videoID,
                commentID:this.state.tempCommentID,
                comment:this.state.commentContent,
            };
            POST(app.route.ROUTE_SUBMIT_SON_COMMENT, param, this.doSubmitSonCommentSuccess);
        } else {
            var param = {
                userID: app.personal.info.userID,
                videoID:this.props.videoInfo.videoID,
                comment:this.state.commentContent,
            };
            POST(app.route.ROUTE_SUBMIT_COMMENT, param, this.submitCommentSuccess);
        }
    }
},
submitCommentSuccess(data) {
    if (data.success) {
        var info = app.personal.info;
        var curComment = {
            commentID: 0,
            publisherImg: info.headImg,
            publisherName: info.name,
            publisherTime: app.utils.getCurrentTimeString(),
            publisherAlias: info.alias,
            comment: this.state.commentContent,
        }
        this.setState({commentContent: '', isSendding: false, isChildComment: false});
        //更新积分
        info.integral += data.context.integral;
        app.personal.set(info);
        Toast('发表感悟成功');
        this.commentList.doRefresh(curComment);
        if (data.context.integral !== 0) {
            this.updatePointCom('感悟',data.context.integral);
        }
    } else {
        Toast(data.msg);
    }
},
doSubmitSonCommentSuccess(data) {
    if (data.success) {
        Toast('回复成功');
        app.refreshComments.doRefreshComments();
        this.setState({commentContent: '', isSendding: false, isChildComment: false});
    } else {
        Toast(data.msg);
    }
},
popupInputbox(commentID, publisherName) {
    this.setState({
        tempCommentID: commentID,
        tempPublisherName: publisherName,
        isChildComment: true,
    });
    this.commentInput.focus();
},
onBlur() {
    if (this.state.commentContent === '') {
        this.setState({
            tempCommentID: 0,
            tempPublisherName: '',
            isChildComment: false,
        });
    }
},
render() {
    var videoInfo = this.props.videoInfo;
    return (
        <View style={styles.container}>
            <ScrollView scrollEnabled={this.state.scrollEnabled}>
                <Player
                    uri={videoInfo.urlPlay}
                    fullScreenListener={this.fullScreenListener}
                    onComplete={this.onComplete}
                    />
                {
                    !this.state.isFullScreen &&
                    <View style={styles.container}>

                        <VideoMenuPanel
                            data={videoInfo}
                            noticeShow={this.updateHeart}
                            noticeShowBox={this.updatePoint}/>
                        <VideoRecommend
                            doRestart={this.doRestart}
                            data={videoInfo}/>

                    </View>
                }
            </ScrollView>
            {
                // !this.state.isFullScreen &&
                // <View style={styles.inputContainer}>
                //     <View style={styles.bottomInput}>
                //         <View style={styles.inputView}>
                //             <TextInput
                //                 ref={(ref)=>this.commentInput = ref}
                //                 onBlur={this.onBlur}
                //                 onChangeText={(text) => this.setState({commentContent: text})}
                //                 defaultValue={this.state.commentContent}
                //                 placeholder={this.state.isChildComment?("回复"+this.state.tempPublisherName+"："):"有什么感想快来说说吧"}
                //                 style={styles.textInput}/>
                //         </View>
                //         <Button
                //             onPress={this.doSubmitComment}
                //             style={styles.btnSend}
                //             textStyle={styles.butText}>
                //             发送
                //         </Button>
                //     </View>
                // </View>
            }
            {
                this.state.overlayShowStudyAward &&
                <StudyAwardMessageBox
                    makePoint={this.state.makePoint}
                    doClose={this.doClose}
                    doDraw={this.doDraw}
                    doShare={this.doShare}>
                </StudyAwardMessageBox>
            }
            {
                this.state.overlayFirstMessageBox &&
                <FirstMessageBox
                    point={this.state.boxPoint}
                    doCloseFirst={this.doCloseFirst}
                    title={this.state.boxTitle}>
                </FirstMessageBox>
            }
            {
                this.state.overlayShowTask &&
                <TaskMessageBox
                    taskList={this.state.taskList}
                    doCloseTask={this.doCloseTask}>
                </TaskMessageBox>
            }
            {
                this.state.ShowMealBox &&
                <ShowMealBox
                    doConfirm={this.doPayConfirm}
                    doCancle={this.doCancle}>
                </ShowMealBox>
            }
        </View>
    );
}
});
module.exports = VideoPlay;

var styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: 'transparent',
},
separator: {
    height: 1,
    backgroundColor: '#EEEEEE'
},
overlayContainer: {
    position:'absolute',
    bottom: 0,
    justifyContent: 'center',
    width:sr.w,
    height:sr.h,
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
},
inputContainer: {
    width: sr.w,
    height: 50,
    bottom: 0,
    left: 0,
    position: 'absolute',
    backgroundColor: '#cbcccd',
},
textInput: {
    width: sr.w-96,
    height:30,
    fontSize: 16,
    paddingVertical: -3,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
},
bottomInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
},
inputView: {
    marginLeft: 15,
    width: sr.w-90,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
},
btnSend: {
    width: 50,
    height: 30,
    marginRight: 10,
    borderRadius: 4,
},
butText: {
    fontSize: 14,
    fontWeight: '500',
    alignSelf: 'center',
},
});
