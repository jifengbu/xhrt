'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    Image,
    TextInput,
    Text,
    TouchableOpacity,
    StyleSheet,
    ListView,
    View,
} = ReactNative;

var Subscribable = require('Subscribable');
var RefreshComments = require('../../manager/RefreshComments.js');
var {Button, DImage} = COMPONENTS;

module.exports = React.createClass({
    mixins: [Subscribable.Mixin],
    statics: {
        title: '回复列表',
    },
    getInitialState() {
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            userID:this.props.userID,
            kitID:this.props.kitID,
            commentInfo:this.props.commentInfo,
            dataSource: this.ds.cloneWithRows([]),
            isSendding: false,
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
            <View style={styles.separator} key={rowID}/>
        );
    },
    getSonComment() {
        var param = {
            userID:this.state.userID,
            kitID:this.state.kitID,
            type: this.props.tabIndex,
            commentID:this.state.commentInfo.commentID,
        };
        POST(app.route.ROUTE_GET_SONKIDS_COMMENT, param, this.doGetSonCommentSuccess);
    },
    doGetSonCommentSuccess(data) {
        if (data.success) {
            let commentList = data.context.commentList||[];
            var commentLength = data.context.commentList.length;
            this.setState({listData: commentList, dataSource: this.ds.cloneWithRows(commentList), commentLength: commentLength});
        }
    },
    renderComment(obj) {
        var tempPublisherTime =app.utils.getJetlagString(obj.publisherTime);
        return (
            <View
                underlayColor="#EEB422">
                <View style={styles.ItemContainer}>
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
                            {obj.kidsSonComment}
                        </Text>
                        <View style={styles.commentDateContainer}>
                            <Text style={styles.itemContentText}>
                                {tempPublisherTime}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
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
                      :<Text style={{alignSelf: 'center', marginBottom: 15}}>暂无评论回复!</Text>
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
    ItemContainer: {
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
          alignSelf:'center',
          borderRadius: 20,
    },
    commentInputContainer: {
        height: 45,
        flex: 1,
        marginHorizontal: 8,
        flexDirection: 'row',
        alignItems:'center',
    },
    commentTextInput: {
        paddingLeft: 10,
        paddingVertical:-2,
        marginLeft: 5,
        height:35,
        width: sr.w-80,
        backgroundColor:'#EEEEEE',
        alignSelf: 'center',
    },
    btnSendCodeText: {
        fontSize: 14,
        alignSelf: 'center',
    },
    btnSend: {
        flex: 1,
        height: 35,
        marginHorizontal: 3,
        borderRadius: 6,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#4FC1E9',
    },
});
