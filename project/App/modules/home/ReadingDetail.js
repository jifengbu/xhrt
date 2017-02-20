'use strict';

var React = require('react');var ReactNative = require('react-native');

var {
    AppState,
    Image,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Linking,
} = ReactNative;

var moment = require('moment');
var WebView = require('react-native-webview-bridge');
var CommentBox = require('./CommentBox.js');
var ReadingDetailComment = require('./ReadingDetailComment.js');
var UmengMgr = require('../../manager/UmengMgr.js');
var {DImage, PageList} = COMPONENTS;

module.exports = React.createClass({
    getInitialState() {
        return {
            articleInfo: null,
        }
    },
    componentDidMount() {
        this.getArticleInfo();
        AppState.addEventListener('change', this._handleAppStateChange);
    },
    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    },
    _handleAppStateChange: function(currentAppState) {
        this.setState({currentAppState});
        if (currentAppState === 'active') {
            // this.playerPlay && this.playerPlay.stopPlayVideo();
        } else {
            this.refs.webviewbridge.reload();// 重新加载webview 让视频播放暂停
        }
    },
    getArticleInfo() {
        app.showProgressHUD();
        var param = {
            userID: app.personal.info.userID,
            articleID: this.props.articleId,
        };
        POST(app.route.ROUTE_ARTICLE_INFO, param, this.getArticleInfoSuccess);
    },
    getArticleInfoSuccess(data) {
        if (data.success) {
            this.setState({articleInfo: data.context});
            this.doWatchLog();

            // if (!app.isandroid) {
            //     if (data.context.type == 1) {
            //         Linking.canOpenURL(data.context.linkUrl).then(
            //             supported => {
            //               if (!supported) {
            //                 console.log('不能打开链接: ' + data.context.linkUrl);
            //               } else {
            //                 return Linking.openURL(data.context.linkUrl);
            //               }
            //           }
            //       ).catch(err => console.log('打开链接失败:'+data.context.linkUrl));
            //     }
            //
            //     setTimeout(()=>{
            //         app.navigator.pop();
            //     }, 600);
            // }
        } else {
            Toast(data.msg);
        }
    },
    doWatchLog() {
        var param = {
            userID:app.personal.info.userID,
            watchType:0,
            objID: this.props.articleId,
        };
        // POST(app.route.ROUTE_WATCH_LOG, param, this.doWatchLogSuccess);
        POST(app.route.ROUTE_WATCH_LOG, param, (data)=>{
            if (data.success) {
                //点击阅读返回成功后通知列表更新阅读数
                this.props.updateClickAndLikeNum && this.props.updateClickAndLikeNum({articleId: this.props.articleId, type: 'reads'});
            }
        });
    },
    modifyComment(context) {
        var param = {
            userID:app.personal.info.userID,
            articleID: this.props.articleId,
            content: context,
        };
        POST(app.route.ROUTE_COMMENT_ARTICLE, param, (data)=>{
            if (data.success) {
                var info = app.personal.info;
                var curComment = {
                    commentID: data.context.id,
                    content: context,
                    createTime: app.utils.getCurrentTimeString(),
                    isPraise:0,
                    userLogo: info.headImg,
                    praises:0,
                    userName: info.name,
                }
                this.commentList.doRefresh(curComment);
                Toast(data.msg);
            } else {
                Toast(data.msg);
            }
        });
    },
    doShareCallback() {
        var param = {
            userID:app.personal.info.userID,
            shareType: 2, //0-分享视频 1-分享作业 2-分享推荐阅读
            objID: this.props.articleId,
        };
        POST(app.route.ROUTE_SHARE_LOG, param, (data)=>{
            if (data.success) {
                // Toast(data.msg);
            } else {
                Toast(data.msg);
            }
        });
    },
    onPressMenu(index) {
        //0 分享 1评论 2收藏 3点赞
        var {articleInfo} = this.state;
        switch (index) {
            case 0:
                if (articleInfo) {
                    let linkUrl = CONSTANTS.SHARE_SHAREDIR_SERVER+'shareArticle.html?userID='+app.personal.info.userID+'&articleID='+this.props.articleId;
                    UmengMgr.doActionSheetShare(linkUrl, '赢销截拳道', articleInfo.describe, 'web', articleInfo.imgUrl, this.doShareCallback);
                }
                break;
            case 1:
                app.showModal(
                    <CommentBox
                        doConfirm={this.modifyComment}
                        inputText={''}
                        doCancel={app.closeModal}
                        />
                )
                break;
            case 2:
                if(this.doCollection) return;
                this.doCollection = true
                if (articleInfo.isCollection == 1) {
                    var param = {
                        userID:app.personal.info.userID,
                        collectionType: 0, //推荐阅读收藏
                        objID: this.props.articleId,
                    };
                    POST(app.route.ROUTE_CANCEL_COLLECTION_LOG, param, (data)=>{
                        if (data.success) {
                            articleInfo.isCollection=0;
                            this.setState({articleInfo});
                            Toast('取消收藏成功');
                        } else {
                            Toast('取消收藏失败');
                        }
                        this.doCollection = false;
                    });
                }else {
                    var param = {
                        userID:app.personal.info.userID,
                        collectionType: 0, //推荐阅读收藏
                        objID: this.props.articleId,
                    };
                    POST(app.route.ROUTE_COLLECTION_LOG, param, (data)=>{
                        if (data.success) {
                            articleInfo.isCollection=1;
                            this.setState({articleInfo});
                            Toast('收藏成功');
                        } else {
                            Toast('收藏失败');
                        }
                        this.doCollection = false;
                    });
                }
                break;
            case 3:
                if(this.doPraise) return;
                this.doPraise = true
                var param = {
                    userID:app.personal.info.userID,
                    praiseType: 0, //0：推荐阅读点赞，1：阅读评论点赞
                    objID: this.props.articleId,
                };
                if (articleInfo.isPraise == 1) {
                    POST(app.route.ROUTE_CANCEL_PRAISE_LOG, param, (data)=>{
                        if (data.success) {
                            this.props.updateClickAndLikeNum && this.props.updateClickAndLikeNum({articleId: this.props.articleId, type: 'subPraise'});
                            articleInfo.isPraise=0;
                            articleInfo.likes-=1;
                            this.setState({articleInfo});
                        } else {
                            Toast('取消点赞失败');
                        }
                        this.doPraise = false;
                    });
                }else {
                    POST(app.route.ROUTE_PRAISE_LOG, param, (data)=>{
                        if (data.success) {
                            this.props.updateClickAndLikeNum && this.props.updateClickAndLikeNum({articleId: this.props.articleId, type: 'addPraise'});
                            articleInfo.isPraise=1;
                            articleInfo.likes+=1;
                            this.setState({articleInfo});
                        } else {
                            Toast('点赞失败');
                        }
                        this.doPraise = false;
                    });
                }
                break;
            default:

        }
    },
    onLoadEnd() {
        app.dismissProgressHUD();
    },
    renderSeparator(sectionID, rowID) {
        return (
            <View
                style={styles.separator}
                key={rowID}/>
        );
    },
    onBridgeMessage(message){
        const { webviewbridge } = this.refs;
        let type, data;
        try {
            let result = JSON.parse(message);
            type = result.type;
            data = result.data;
        } catch (e) {}
        switch (type) {
            case "heightChange":
                this.setState({webHeight: data});
            break;
        }
    },
    render() {
        var {articleInfo} = this.state;
        var {shareList = []} = articleInfo||{};
        shareList = shareList.slice(0,6);
        let linkUrl = app.route.ROUTE_ARTICLE_PAGE+'?userID='+app.personal.info.userID+'&articleID='+this.props.articleId;
        if (articleInfo) {
            linkUrl = articleInfo.type == 1?articleInfo.linkUrl: app.route.ROUTE_ARTICLE_PAGE+'?userID='+app.personal.info.userID+'&articleID='+this.props.articleId;
        }
        const injectScript = `
        (function () {
            var height = document.body.offsetHeight;
            WebViewBridge.send(JSON.stringify({
                type:'heightChange',
                data: height,
            }));
          }());`;
        return (
            <View style={{flex: 1}}>
                <View style={styles.divisionLine}/>
                {
                    articleInfo&&
                    <ScrollView style={styles.container}>
                        {
                            // articleInfo.type == 0&&
                            <View style={styles.titleStyle}>
                                <Text style={styles.titleText}>{articleInfo.title}</Text>
                            </View>
                        }
                        <View style={styles.iconContainer}>
                            {
                                // articleInfo.type == 0&&
                                <Text style={styles.dateStyle}>
                                    {moment(articleInfo.createTime).format('YYYY.MM.DD')}
                                </Text>
                            }
                            <View style={[styles.praiseContainer, {marginLeft: articleInfo.type == 0?30:0}]}>
                                <DImage
                                    resizeMode='contain'
                                    source={app.img.personal_eye}
                                    style={styles.eyeIcon}/>
                                <Text style={[styles.textStyle, {marginLeft: 10}]}>
                                    {articleInfo.reads}
                                </Text>
                            </View>
                            <View style={[styles.praiseContainer, {marginLeft: 21}]}>
                                <DImage
                                    resizeMode='contain'
                                    source={app.img.personal_praise}
                                    style={styles.iconStyle}/>
                                <Text style={[styles.textStyle, {marginLeft: 10}]}>
                                    {articleInfo.likes}
                                </Text>
                            </View>
                        </View>
                        {
                            !!articleInfo &&
                            <View style={styles.midView}>
                                <WebView
                                    style={[styles.webview,{height: this.state.webHeight+30}]}
                                    ref="webviewbridge"
                                    startInLoadingState={true}
                                    onLoadEnd={this.onLoadEnd}
                                    onBridgeMessage={this.onBridgeMessage}
                                    injectedJavaScript={injectScript}
                                    scrollEnabled={false}
                                    source={{uri: linkUrl}}
                                    scalesPageToFit={false}
                                    />
                            </View>
                        }
                        {
                            shareList.length != 0&&
                            <View style={styles.sharedPersonStyle}>
                                <View style={styles.divisionLine}></View>
                                <View style={styles.contentStyle}>
                                    <Text style={styles.contentText}>分享过的学员：</Text>
                                    {
                                        shareList.map((item, i)=>{
                                            return (
                                                <DImage
                                                    key={i}
                                                    resizeMode='cover'
                                                    defaultSource={app.img.personal_head}
                                                    source={{uri: item.userLogo}}
                                                    style={[styles.headerIcon, {marginLeft: 13}]} />
                                            )
                                        })
                                    }
                                </View>
                                <View style={styles.divisionLine}></View>
                            </View>
                        }
                        <ReadingDetailComment ref={(ref)=>this.commentList = ref} articleId={this.props.articleId}/>
                    </ScrollView>
                }
                {
                    articleInfo&&
                    <View style={styles.bottomMenuStyle}>
                        <View style={styles.divisionLine}></View>
                        <View style={styles.touchViewContainer}>
                            <View style={styles.touchView}>
                                <TouchableOpacity
                                    onPress={this.onPressMenu.bind(null, 0)}
                                    style={styles.tabButton}>
                                    <DImage
                                        resizeMode='contain'
                                        source={app.img.home_share_icon}
                                        style={styles.iconStyle}/>
                                    <Text style={styles.tabText} >
                                        {'分享'}
                                    </Text>
                                </TouchableOpacity>
                                <View style={styles.vline}/>
                            </View>
                            <View style={styles.touchView}>
                                <TouchableOpacity
                                    onPress={this.onPressMenu.bind(null, 1)}
                                    style={styles.tabButton}>
                                    <DImage
                                        resizeMode='contain'
                                        source={app.img.home_comment_icon}
                                        style={styles.iconStyle}/>
                                    <Text style={styles.tabText} >
                                        {'评论'}
                                    </Text>
                                </TouchableOpacity>
                                <View style={styles.vline}/>
                            </View>
                            <View style={styles.touchView}>
                                <TouchableOpacity
                                    onPress={this.onPressMenu.bind(null, 2)}
                                    style={styles.tabButton}>
                                    <DImage
                                        resizeMode='contain'
                                        source={articleInfo.isCollection==1?app.img.personal_collect_pressed:app.img.personal_collect}
                                        style={styles.iconStyle}/>
                                    <Text style={styles.tabText} >
                                        {articleInfo.isCollection==1?'已收藏':'收藏'}
                                    </Text>
                                </TouchableOpacity>
                                <View style={styles.vline}/>
                            </View>
                            <View style={styles.touchView}>
                                <TouchableOpacity
                                    onPress={this.onPressMenu.bind(null, 3)}
                                    style={styles.tabButton}>
                                    <DImage
                                        resizeMode='contain'
                                        source={articleInfo.isPraise?app.img.personal_praise_pressed:app.img.personal_praise}
                                        style={styles.iconStyle}/>
                                    <Text style={styles.tabText} >
                                        {articleInfo.isPraise?'已赞':'点赞'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                }
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    titleStyle: {
        width: sr.w,
        marginTop: 17,
    },
    titleText: {
        marginLeft: 15,
        fontSize: 18,
        color: '#313131',
        lineHeight: 24,
        fontFamily: 'STHeitiSC-Medium',
    },
    iconContainer: {
        marginLeft: 15,
        marginTop: 15,
        flexDirection: 'row',
    },
    dateStyle: {
        fontSize: 12,
        color: '#929292',
        fontFamily: 'STHeitiSC-Medium',
    },
    praiseContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    eyeIcon: {
        width: 14,
        height: 14,
    },
    iconStyle: {
        width: 12,
        height: 12,
    },
    textStyle: {
        fontSize: 10,
        color: '#909090',
        fontFamily: 'STHeitiSC-Medium',
    },
    midView: {
        width: sr.w,
    },
    sharedPersonStyle: {
        height: 75,
        width: sr.w,
        justifyContent: 'space-between',
    },
    divisionLine: {
        width: sr.w,
        height: 1,
        backgroundColor: '#E8E8E8',
    },
    contentStyle: {
        width: sr.w,
        height: 40,
        alignItems: 'center',
        flexDirection: 'row',
    },
    contentText: {
        fontSize:  14,
        color: '#8F8F8F',
        marginLeft: 18,
        fontFamily: 'STHeitiSC-Medium',
    },
    headerIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    separator: {
        height: 1,
        width: sr.w-34,
        alignSelf: 'center',
        backgroundColor: '#F5F5F5'
    },
    bottomMenuStyle: {
        position: 'absolute',
        height: 47,
        width: sr.w,
        bottom: 0,
        left: 0,
        backgroundColor: '#FFFFFF',
    },
    touchViewContainer: {
        flexDirection: 'row',
    },
    touchView: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
    },
    tabButton: {
        flex: 1,
        height: 47,
        alignItems:'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    tabText: {
        marginLeft: 6,
        fontSize: 14,
        color: '#2F2F2F',
        textAlign: 'center',
        fontFamily: 'STHeitiSC-Light',
    },
    vline: {
        width: 1,
        height: 38,
        backgroundColor: '#F0F0F0',
    },
});
