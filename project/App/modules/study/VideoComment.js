'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    Image,
    TextInput,
    Text,
    TouchableOpacity,
    StyleSheet,
    View,
    Navigator,
} = ReactNative;

var moment = require('moment');
var ReplyList = require('./ReplyList.js');
var {Button, DImage, PageList} = COMPONENTS;
var isShowReplyList = true;

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
        isShowReplyList = true;
        this.setState({clickComment: !this.state.clickComment});
    },
    updateClickComment() {
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
                        <View style={styles.topRow}>
                            {
                                obj.publisherName?
                                <Text
                                    style={styles.nameText}>
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
                    (this.state.clickComment&&isShowReplyList) &&
                    <View style={styles.container}>
                        <ReplyList
                            commentInfo={obj}
                            userID={app.personal.info.userID}
                            videoID={this.props.videoID}
                            noticeShow={this.updateClickComment}/>
                    </View>
                }
            </View>
        );
    },
});

module.exports = React.createClass({
    getInitialState() {
        return {
            isSendding: false,
        };
    },
    noticePopup(commentID, publisherName) {
        this.props.popupInputbox(commentID, publisherName);
    },
    renderRow(obj) {
        return (
            <CommentList
                obj = {obj}
                noticePopup={this.noticePopup}
                videoID={this.props.data.videoID}/>
        )
    },
    show(callback) {
        return callback();
    },
    doRefresh(curComment) {
        isShowReplyList = false;
        this.listView.updateList((list)=>{
            list.unshift(curComment);
            return list;
        });
    },
    render() {
        return (
            <View style={styles.listContainer}>
                <View style={styles.commentTitleContainer}>
                    <Text style={styles.titleTypeText}>学习感悟</Text>
                </View>
                <View style={styles.separator}></View>
                <PageList
                    ref={listView=>this.listView=listView}
                    style={[styles.container, {paddingBottom: 35}]}
                    renderRow={this.renderRow}
                    listParam={{userID: app.personal.info.userID, videoID: this.props.data.videoID,}}
                    listName="commentList"
                    listUrl={app.route.ROUTE_GET_COMMENT}
                    ListFailedText="暂无数据!"
                    />
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
        marginTop: 15,
        backgroundColor: '#FFFFFF',
    },
    commentTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    titleTypeText: {
        fontSize: 15,
        marginLeft: 8,
        fontWeight: '400',
        color: '#555555',
        paddingVertical: 4,
    },
    separator: {
        height: 1,
        backgroundColor: '#EEEEEE'
    },
    headerIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginLeft: 10,
    },
    textInput: {
        marginLeft: 15,
        width: sr.w-130,
        height:40,
        fontSize: 16,
        backgroundColor: 'transparent',
        alignSelf: 'center',
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
    topRow: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    itemNameText: {
        fontSize: 14,
        marginTop: 5,
        width: sr.w-60,
        color: '#555555',
    },
    nameText: {
        fontSize: 15,
        fontWeight: '500',
        flexDirection: 'row',
        color: '#bf9f62',
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
        position: 'absolute',
        right: 50,
        top: -5,
        width: 60,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingVertical: 5,
    },
    commentText: {
        alignSelf: 'center',
        color: '#A62045',
        fontSize: 12,
    },
});
