'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    Image,
    ListView,
    TextInput,
    Text,
    AsyncStorage,
    TouchableOpacity,
    StyleSheet,
    View,
    Navigator,
} = ReactNative;

var Subscribable = require('Subscribable');
var RefreshComments = require('../../manager/RefreshComments.js');
var {Button, DImage} = COMPONENTS;

var SonCommentList = React.createClass({
    render() {
        var obj = this.props.obj;
        var tempPublisherTime =app.utils.getJetlagString(obj.publisherTime);
        return (
            <View
                underlayColor="#EEB422">
                <View style={styles.itemContainer}>
                    <DImage
                        resizeMode='cover'
                        defaultSource={app.img.personal_head}
                        source={{uri:obj.publisherImg}}
                        style={styles.headerIcon} />
                    <View style={styles.titleStyle}>
                        <Text
                            style={styles.itemContentText}>
                            {obj.publisherName}
                        </Text>
                        <Text
                            style={styles.itemNameText}>
                            {obj.sonComment}
                        </Text>
                        <View style={styles.commentDateContainer}>
                            <Text style={styles.itemContentText}>
                                {tempPublisherTime}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    },
});

module.exports = React.createClass({
    mixins: [Subscribable.Mixin],
    getInitialState() {
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            userID:this.props.userID,
            videoID:this.props.videoID,
            commentInfo:this.props.commentInfo,
            dataSource: this.ds.cloneWithRows([]),
            isSendding: false,
            commentLength: true,
            listData: [],
        };
    },
    componentWillMount() {
        this.addListenerOn(RefreshComments, 'DO_REFRESH_COMMENTS', (param)=>{
            this.getSonComment();
        });
    },
    componentDidMount() {
        this.getSonComment();
    },
    renderSeparator(sectionID, rowID) {
        return (
            <View
                style={styles.separator}
                key={rowID}/>
        );
    },
    getSonComment() {
        var param = {
            userID:this.state.userID,
            videoID:this.state.videoID,
            commentID:this.state.commentInfo.commentID,
        };
        POST(app.route.ROUTE_GET_SON_COMMENT, param, this.doGetSonCommentSuccess);
    },
    doGetSonCommentSuccess(data) {
        if (data.success) {
            let commentList = data.context.commentList||[];
            var commentLength = data.context.commentList.length;
            this.setState({listData: commentList, dataSource: this.ds.cloneWithRows(commentList), commentLength: commentLength});
        } else {
            this.setState({commentLength: false});
        }
    },
    renderComment(obj) {
        return (
            <SonCommentList obj = {obj} />
        )
    },
    render() {
        return (
            <View style={styles.listContainer}>
                <View style={styles.container}>
                    {
                        this.state.commentLength?
                        <ListView
                            initialListSize={1}
                            enableEmptySections={true}
                            dataSource={this.state.dataSource}
                            renderRow={this.renderComment}
                            renderSeparator={this.renderSeparator}
                            />
                        :
                        <Text style={{alignSelf: 'center', marginBottom: 15}}>暂无评论回复!</Text>
                    }
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
    separator: {
        height: 1,
        backgroundColor: '#EEEEEE'
    },
    itemContainer: {
        marginTop: 10,
        marginLeft: 50,
        flexDirection: 'row',
    },
    titleStyle: {
        marginLeft: 10,
        marginRight: 10,
        flexDirection: 'column',
        alignSelf: 'center',
    },
    itemContentText: {
        fontSize: 10,
        color: 'gray',
    },
    commentDateContainer: {
        flex: 1,
        marginVertical: 5,
        alignSelf: 'center',
        flexDirection: 'row',
        width: sr.w,
    },
    itemNameText: {
        fontSize: 14,
        width: sr.w-110,
        marginRight: 10,
    },
    headerIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
});
