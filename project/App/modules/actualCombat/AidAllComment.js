'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    Image,
    TextInput,
    Text,
    TouchableOpacity,
    StyleSheet,
    View,
} = ReactNative;

var dismissKeyboard = require('dismissKeyboard');
var ReplyList = require('./ReplyList.js');

var {Button, DImage, PageList} = COMPONENTS;

var CommentList = React.createClass({
    getInitialState() {
        return {
            clickComment: false,
        };
    },
    _onPressRowText(obj) {
        this.props.noticePopup(obj.commentID, obj.publisherName);
    },
    _onPressRow(obj) {
        this.setState({clickComment: !this.state.clickComment});
    },
    render() {
        var obj = this.props.obj;
        var tempPublisherTime =app.utils.getJetlagString(obj.publisherTime);
        return (
            <View
                underlayColor="#EEB422">
                <TouchableOpacity onPress={this._onPressRow.bind(null, obj)} style={styles.itemContainer}>
                    <DImage
                        resizeMode='cover'
                        defaultSource={app.img.personal_head}
                        source={{uri:obj.publisherImg}}
                        style={styles.headerIcon} />
                    <View style={styles.titleStyle}>
                        <View style={{flexDirection: 'row'}}>
                            {
                                obj.publisherName?
                                <Text
                                    style={styles.itemContentText}>
                                    {obj.publisherName+'    /'}
                                </Text>:null
                            }
                            <Text
                                style={styles.itemContentText}>
                                {obj.publisherAlias}
                            </Text>
                        </View>
                        <Text style={styles.itemNameText}>
                            {obj.comment}
                        </Text>
                        <View style={styles.commentDateContainer}>
                            <Text style={styles.itemContentText}>
                                {tempPublisherTime}
                            </Text>
                            {
                                obj.commentID!=0&&
                                <TouchableOpacity
                                    onPress={this._onPressRowText.bind(null, obj)}
                                    style={styles.touchCommentContainer}>
                                    <Text style={styles.commentText}>回复</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                </TouchableOpacity>
                {
                    this.state.clickComment&&
                    <View style={styles.container}>
                        <ReplyList
                            commentInfo={obj}
                            tabIndex={this.props.tabIndex}
                            userID={app.personal.info.userID}
                            kitID={this.props.kitID}/>
                    </View>
                }
            </View>
        );
    },
});

module.exports = React.createClass({
    statics: {
        title: '全部评论',
    },
    getInitialState() {
        return {
            clickPrompt: false,
            isSendding: false,
            commentListLength: 0,
            isChildComment: false,
            tempCommentID: 0,
            tempPublisherName: '',
            commentContent: '',
        };
    },
    _onPressPrompt() {
        this.setState({clickPrompt: !this.state.clickPrompt});
    },
    noticePopup(commentID, publisherName) {
        // this.props.popupInputbox(commentID, publisherName);
        this.setState({
            tempCommentID: commentID,
            tempPublisherName: publisherName,
            isChildComment: true,
        });
        this.commentInput.focus();
    },
    renderRow(obj) {
        return (
            <CommentList
                obj = {obj}
                noticePopup={this.noticePopup}
                tabIndex={this.props.tabIndex}
                kitID={this.props.kitID}/>
        )
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
    doSubmitComment() {
        dismissKeyboard();
        if (this.state.commentContent === '') {
            Toast('请提交评论信息');
            return;
        }
        if (!this.state.isSendding) {
            Toast('正在发送评论...');
            this.setState({isSendding: true});
            //为true子评论，为false评论
            if (this.state.isChildComment) {
                var param = {
                    userID:app.personal.info.userID,
                    kitID:this.props.kitID,
                    commentID:this.state.tempCommentID,
                    comment:this.state.commentContent,
                    type: this.props.tabIndex,
                };
                POST(app.route.ROUTE_SUBMIT_SONKIDS_COMMENT, param, this.doSubmitSonCommentSuccess);
            } else {
                var param = {
                    type:this.props.tabIndex,
                    userID: app.personal.info.userID,
                    kitID:this.props.kitID,
                    comment:this.state.commentContent,
                };
                POST(app.route.ROUTE_REPLAY_ITEM_KIT, param, this.submitCommentSuccess);
            }
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
    submitCommentSuccess(data) {
        this.setState({isSendding: false});
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
            this.listView.updateList((list)=>{
                list.unshift(curComment);
                this.setState({
                    clickPrompt: !this.state.clickPrompt,
                    commentContent: ''
                });
                return list;
            });
            this.props.doRefresh(curComment);
            Toast('发表评论成功');
        } else {
            Toast(data.msg);
        }
    },
    render() {
        return (
            <View style={styles.listContainer}>
                <View style={styles.commentTitleContainer}>
                    <Text style={styles.titleTypeStyle}>热门评论</Text>
                </View>
                <View style={styles.separator}/>
                <PageList
                    ref={listView=>this.listView=listView}
                    style={styles.container}
                    renderRow={this.renderRow}
                    listParam={{type: this.props.tabIndex, kitID: this.props.kitID}}
                    listName="commentList"
                    listUrl={app.route.ROUTE_GET_ITEM_KIT_COMMENT}
                    ListFailedText="暂无评论!"
                    />
                <View style={styles.inputContainer}>
                    <View style={styles.bottomInput}>
                        <View style={styles.inputView}>
                            <TextInput
                                ref={(ref)=>this.commentInput = ref}
                                onBlur={this.onBlur}
                                onChangeText={(text) => this.setState({commentContent: text})}
                                defaultValue={this.state.commentContent}
                                placeholder={this.state.isChildComment?("回复"+this.state.tempPublisherName+"："):"有什么感想快来说说吧"}
                                style={styles.textInput}/>
                        </View>
                        <Button
                            onPress={this.doSubmitComment}
                            style={styles.btnSend}
                            textStyle={styles.butText}>
                            发送
                        </Button>
                    </View>
                </View>
            </View>
        )
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    listContainer: {
        flex: 1,
        width:sr.w,
        backgroundColor: '#FFFFFF',
    },
    list: {
        alignSelf:'stretch'
    },
    listFooterContainer: {
        alignItems: 'center',
    },
    listFooter: {
        color: 'gray',
        fontSize: 14,
    },
    commentTitleContainer: {
        height: 36,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor :'#FFFFFF'
    },
    titleTypeStyle: {
        fontSize: 15,
        marginLeft: 8,
        color: '#555555',
    },
    goAllCommentContainer: {
        flexDirection: 'row',
        position: 'absolute',
        right: 10,
        flex: 1,
    },
    titleTypeText: {
        marginTop: 5,
        fontSize: 16,
        marginLeft: 8,
        paddingVertical: 5,
        color: '#239fdb',
    },
    separator: {
        height: 1,
        backgroundColor: '#EEEEEE'
    },
    inputContainer: {
        width: sr.w,
        height: 50,
        bottom: 0,
        left: 0,
        position: 'absolute',
        backgroundColor: '#cbcccd',
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
    headerIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginLeft: 10,
    },
    textPromptInput: {
        height:40,
        width:506,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
    },
    textInput: {
        width: sr.w-96,
        height:30,
        fontSize: 16,
        paddingVertical: -3,
        alignSelf: 'center',
        backgroundColor: '#FFFFFF',
    },
    butText: {
        fontSize: 14,
        fontWeight: '500',
        alignSelf: 'center',
    },
    textStylePlace: {
        marginLeft: 15,
        fontSize: 16,
        backgroundColor: 'transparent'
    },
    itemContainer: {
        paddingVertical: 10,
        flexDirection: 'row',
    },
    titleStyle: {
        marginLeft: 10,
        flexDirection: 'column',
        alignSelf: 'center',
    },
    itemNameText: {
        fontSize: 14,
        marginTop: 5,
        width: sr.w-60,
        color: '#555555',
    },
    itemContentText: {
        fontSize: 10,
        color: 'gray',
    },
    commentDateContainer: {
        width: sr.w,
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    touchCommentContainer: {
        width: 40,
        position: 'absolute',
        right: 55,
        bottom: 1,
        flexDirection: 'row',
    },
    commentText: {
        alignSelf: 'center',
        color: '#A62045',
        fontSize: 13,
    },
    btnSend: {
        width: 50,
        height: 30,
        marginRight: 10,
        borderRadius: 4,
    },
    touchText: {
        flex: 1,
        justifyContent: 'center',
    },
    iconGo: {
        width: 10,
        height: 15,
        marginLeft: 10,
        marginTop: 5,
        alignSelf: 'center'
    },
});
