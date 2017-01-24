'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    Image,
    TextInput,
    Text,
    TouchableOpacity,
    StyleSheet,
    ListView,
    View,
} = ReactNative;

var ReplyList = require('./ReplyList.js');
var AidAllComment = require('./AidAllComment.js');

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
                        <View style={styles.topRow}>
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
                            userID={app.personal.info.userID}
                            kitID={this.props.kitID}
                            tabIndex={this.props.tabIndex}/>
                    </View>
                }
            </View>
        );
    },
});

module.exports = React.createClass({
    getInitialState() {
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.list = [];
        return {
            dataSource: this.ds.cloneWithRows([]),
            clickPrompt: false,
            isSendding: false,
            commentListLength: 0
        };
    },
    componentDidMount() {
        this.getKitComment();
    },
    renderSeparator(sectionID, rowID) {
        return (
            <View style={styles.separator} key={rowID}/>
        );
    },
    getKitComment() {
        var param = {
            kitID: this.props.kitID,
            type: this.props.tabIndex,
            pageNo: 1,
        };
        POST(app.route.ROUTE_GET_ITEM_KIT_COMMENT, param, this.doKitCommentSuccess);
    },
    doKitCommentSuccess(data) {
        if (data.success) {
            var list = data.context.commentList||[];
            this.list = this.list.concat(list);
            this.setState({
                dataSource: this.ds.cloneWithRows(this.list),
            });
            this.setState({commentListLength: data.context.commentNum, dataSource: this.ds.cloneWithRows(data.context.commentList)});
        }
    },
    _onPressPrompt() {
        this.setState({clickPrompt: !this.state.clickPrompt});
    },
    noticePopup(commentID, publisherName) {
        this.props.popupInputbox(commentID, publisherName);
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
    goAllComment() {
        this.props.isPlayer();
        app.navigator.push({
            component: AidAllComment,
            passProps: {kitID:this.props.kitID,tabIndex:this.props.tabIndex, doRefresh: this.doRefresh},
        });
    },
    doRefresh(curComment) {
        this.list.unshift(curComment);
        this.setState({
            dataSource: this.ds.cloneWithRows(this.list),
        });
    },
    render() {
        return (
            <View style={styles.listContainer}>
                <View style={styles.commentTitleContainer}>
                    <Text style={styles.titleTypeStyle}>热门评论</Text>
                    <TouchableOpacity onPress={this.goAllComment} style={styles.goAllCommentContainer}>
                        <Text style={styles.titleTypeText}>点击查看全部热评</Text>
                        <Image
                            resizeMode='stretch'
                            source={app.img.common_go}
                            style={styles.iconGo}  />
                    </TouchableOpacity>
                </View>
                <View style={styles.separator}/>
                {
                    this.list.length ?
                    <ListView
                        ref={listView=>this.listView=listView}
                        initialListSize={1}
                        enableEmptySections={true}
                        style={styles.container}
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow}
                        renderSeparator={this.renderSeparator}
                        />
                    :
                    <Text style={{alignSelf: 'center', marginBottom: 15}}>暂无评论!</Text>
                }

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
        width:sr.w,
        marginBottom: 35,
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
    goAllCommentContainer: {
        marginRight: 10,
        flexDirection: 'row',
    },
    titleTypeStyle: {
        fontSize: 15,
        marginLeft: 8,
        color: '#555555',
    },
    titleTypeText: {
        fontSize: 11,
        color: '#999999',
    },
    separator: {
        height: 1,
        backgroundColor: '#EEEEEE'
    },
    inputContainer: {
        height: 51,
        borderColor: '#D7D7D7',
        backgroundColor: '#EEEEEE',
        flexDirection: 'row',
        overflow: 'hidden',
        alignItems:'center',
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
        width: sr.w-130,
        height:35,
        fontSize: 16,
        backgroundColor: 'transparent',
        alignSelf: 'center',
    },
    textInputView: {
        height: 35,
        flexDirection: 'row',
        alignItems: 'center',
    },
    commentStyle: {
        height: 38,
        justifyContent: 'flex-end',
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
        height: 26,
        width: 45,
        marginHorizontal: 3,
        borderRadius: 4,
        alignItems:'center',
        justifyContent:'center',
    },
    btnSendText: {
        fontSize:14,
    },
    touchText: {
        flex: 1,
        justifyContent: 'center',
    },
    iconGo: {
        width: 8,
        height: 12,
        marginLeft: 10,
        alignSelf: 'center',
    },
    textStylePlace: {
        fontSize: 15,
        color: 'gray',
        backgroundColor: 'transparent'
    },
});
