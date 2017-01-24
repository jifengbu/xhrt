'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    Image,
    TextInput,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    StyleSheet,
    View,
    Navigator,
    ListView,
} = ReactNative;

var moment = require('moment');
var {Button, DImage, PageList} = COMPONENTS;
var isShowReplyList = true;

var CommentList = React.createClass({
    doPraiseComment(commentID, isPraise) {
        var param = {
            userID:app.personal.info.userID,
            praiseType: 1, //0：推荐阅读点赞，1：阅读评论点赞
            objID: commentID,
        };
        if (isPraise==0) {
            POST(app.route.ROUTE_PRAISE_LOG, param, (data)=>{
                if (data.success) {
                    this.props.addPraise(commentID);
                } else {
                    Toast('点赞评论失败');
                }
            });
        } else {
            POST(app.route.ROUTE_CANCEL_PRAISE_LOG, param, (data)=>{
                if (data.success) {
                    this.props.subPraise(commentID);
                } else {
                    Toast('取消点赞失败');
                }
            });
        }

    },
    render() {
        let obj = this.props.obj;
        let img = app.personal.info.sex==1?app.img.personal_sex_male:app.img.personal_sex_female;
        return (
            <View style={styles.itemContainer}>
                <Image
                    resizeMode='cover'
                    defaultSource={app.personal.info.sex==1?app.img.personal_sex_male:app.img.personal_sex_female}
                    source={obj.userLogo?{uri:obj.userLogo}:img}
                    style={[styles.headerIcon, {marginLeft: 25}]} />
                <View style={styles.nameStyle}>
                    <View style={styles.topRow}>
                        <Text
                            style={styles.nameText}>
                            {obj.userName||''}
                        </Text>
                        <TouchableHighlight underlayColor="rgba(0, 0, 0, 0)" onPress={this.doPraiseComment.bind(null, obj.commentID, obj.isPraise)}>
                            <View style={[styles.praiseContainer, {marginLeft: 21, marginRight: 10}]}>
                                <DImage
                                    resizeMode='contain'
                                    source={obj.isPraise==0?app.img.personal_praise:app.img.personal_praise_pressed}
                                    style={styles.iconStyle}/>
                                    <Text style={[styles.textStyle, {marginLeft: 10}]}>
                                       {obj.praises}
                                    </Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                    <Text style={styles.itemNameText}>
                        {obj.content}
                    </Text>
                    <Text style={styles.timeText}>
                        {moment(obj.createTime).format('YYYY.MM.DD')}
                    </Text>
                </View>
            </View>
        );
    },
});

module.exports = React.createClass({
    getInitialState() {
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            isSendding: false,
            comList: [],
        };
    },
    componentDidMount() {
        var param = {
            userID: app.personal.info.userID,
            articleID: this.props.articleId,
        };
        POST(app.route.ROUTE_GET_COMMENT_ARTICLE_LIST, param, (data)=>{
            if (data.success) {
                this.setState({
                    comList: data.context.CommentArticleList
                });
            } else {
                Toast(data.msg);
            }
        });
    },
    addPraise(commentID) {
        var commentInfo = _.find(this.state.comList, (item)=>item.commentID==commentID);
        commentInfo.isPraise=1;
        commentInfo.praises +=1;
        this.setState({dataSource: this.ds.cloneWithRows(this.state.comList)})
    },
    subPraise(commentID) {
        var commentInfo = _.find(this.state.comList, (item)=>item.commentID==commentID);
        commentInfo.isPraise=0;
        commentInfo.praises -=1;
        this.setState({dataSource: this.ds.cloneWithRows(this.state.comList)})
    },
    renderRow(obj, sectionID, rowID) {
        return (
            <View>
                {
                    rowID != 0 && <View style={styles.lineView}/>
                }
                <CommentList
                    obj = {obj} addPraise={this.addPraise} subPraise={this.subPraise}/>
            </View>
        )
    },
    doRefresh(curComment) {
        let tList = this.state.comList.slice();
        tList.unshift(curComment);
        this.setState({comList: tList});
    },
    render() {
        let {comList} = this.state;
        return (
            <View style={styles.listContainer}>
                {
                    this.state.comList != 0&&
                    <View style={styles.commentTitleContainer}>
                        <Text style={styles.titleTypeText}>{`${'评论  '+'('+comList.length+'条)'}`}</Text>
                    </View>
                }
                <ListView
                    ref={listView=>this.listView=listView}
                    enableEmptySections={true}
                    style={[styles.container, {marginBottom: 30}]}
                    renderRow={this.renderRow}
                    dataSource={this.ds.cloneWithRows(this.state.comList)}
                    />
                <View style={styles.blankView}/>
            </View>
        )
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    listContainer: {
        flex: 1,
        width:sr.w,
    },
    commentTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 25,
        marginTop: 22,
        marginBottom: 12,
    },
    blankView: {
        height: 20,
        backgroundColor: 'white',
    },
    lineView: {
        height: 1,
        backgroundColor: '#F5F5F5',
        marginHorizontal: 16,
    },
    titleTypeText: {
        fontSize: 18,
        marginLeft: 18,
        color: '#1C1C1C',
        fontFamily: 'STHeitiSC-Medium',
    },
    itemContainer: {
        paddingVertical: 15,
        flexDirection: 'row',
    },
    headerIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    nameStyle: {
        marginLeft: 12,
        flexDirection: 'column',
    },
    topRow: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    nameText: {
        fontSize: 14,
        color: '#2F2F2F',
        fontFamily: 'STHeitiSC-Medium',
    },
    praiseContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
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
    itemNameText: {
        fontSize: 14,
        width: sr.w-85,
        color: '#2F2F2F',
        fontFamily: 'STHeitiSC-Medium',
    },
    timeText: {
        fontSize: 10,
        color: '#9E9E9E',
        marginTop: 8,
        fontFamily: 'STHeitiSC-Medium',
    },
});
