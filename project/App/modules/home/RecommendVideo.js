'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    View,
    Text,
    Image,
    StyleSheet,
    ListView,
    TouchableHighlight,
} = ReactNative;

var RecommendVideoPlayer = require('./RecommendVideoPlayer.js');
var CoursePlayer = require('../specops/CoursePlayer.js');
var moment = require('moment');
var Unauthorized = require('../specops/Unauthorized.js');

var {MessageBox} = COMPONENTS;

const VIDEO_TYPES = ['精品课程', '精彩案例', '编辑推荐', '课程亮点'];
const {STATUS_TEXT_HIDE, STATUS_START_LOAD, STATUS_HAVE_MORE, STATUS_NO_DATA, STATUS_ALL_LOADED, STATUS_LOAD_ERROR} = CONSTANTS.LISTVIEW_INFINITE.STATUS;

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        leftButton: { handler: ()=>{app.navigator.pop()}},
    },
    getInitialState() {
        this.pageNo = 1;
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            dataSource: this.ds.cloneWithRows([]),
            infiniteLoadStatus: STATUS_TEXT_HIDE,
        };
    },
    componentDidMount() {
        this.getList();
    },
    getList() {
        var param = {
            userID: app.personal.info.userID,
            pageNo: this.pageNo,
        };
        this.setState({infiniteLoadStatus: this.pageNo===1?STATUS_START_LOAD:STATUS_HAVE_MORE});
        POST(app.route.ROUTE_GET_ENCOURAGE_COURSE_LIST, param, this.getListSuccess, this.getListFailed);
    },
    getListSuccess(data) {
        if (data.success) {
            var length = 0;
            if (data.context.videoList) {
                let list = data.context.videoList.length != 0&&data.context.videoList;
                var infiniteLoadStatus = (list.length < CONSTANTS.PER_PAGE_COUNT) ? STATUS_ALL_LOADED : STATUS_TEXT_HIDE;
                this.setState({
                    dataSource: this.ds.cloneWithRows(list),
                    infiniteLoadStatus: infiniteLoadStatus
                });
            }

        } else {
            this.getListFailed();
        }
    },
    getListFailed() {
        this.pageNo--;
        this.setState({infiniteLoadStatus: STATUS_LOAD_ERROR});
    },
    onEndReached() {
        if (this.state.infiniteLoadStatus !== STATUS_TEXT_HIDE) {
            return;
        }
        this.pageNo++;
        this.getList();
    },
    //更新视频的播放和点赞数量
    updateClickOrLikeNum(clickNum) {
        var video = _.find(this.state.dataSource._dataBlob.s1, (item)=>item.videoID==clickNum.videoID);
        if (video) {
            if (clickNum.type === 'click') {
                video.clicks += 1;
            } else if (clickNum.type === 'heart') {
                video.likes += 1;
                video.isPraise = 0;
            }
            this.setState({dataSource: this.ds.cloneWithRows(this.state.dataSource._dataBlob.s1)})
        }
    },
    playVideo(obj) {
        const {isAgent, isSpecialSoldier} = app.personal.info;
        let authorized = isAgent||isSpecialSoldier; //是否是特种兵1—是  0—不是
        if (obj.videoType==6) {
            if (!authorized) {
                //跳转到购买特种兵页
                app.navigator.pop();
                app.showMainScene(1);
            } else {
                //跳转到特种兵视频播放页
                var param = {
                    userID:app.personal.info.userID,
                    videoID: obj.videoID,
                };
                POST(app.route.ROUTE_STUDY_PROGRESS, param, (data)=>{
                    if (data.success) {
                        app.navigator.push({
                            component: CoursePlayer,
                            passProps: {isCourseRecord:true, lastStudyProgress: data.context, updateClickOrLikeNum: this.updateClickOrLikeNum, otherVideoID: obj.videoID},
                        });
                    } else {
                        Toast('该特种兵课程学习进度获取失败，请重试！');
                    }
                });
            }
        } else {
            //跳转到普通视频播放页
            app.navigator.push({
                component: RecommendVideoPlayer,
                passProps: {videoInfo:obj, updateClickOrLikeNum: this.updateClickOrLikeNum,},
            });
        }
    },
    renderRow(obj, sectionID, rowID, onRowHighlighted) {
        let videoType = obj.videoType&&obj.videoType < 5? VIDEO_TYPES[obj.videoType-1]+'：':'';
        let name = obj.name ? obj.name: '';
        return (
            <TouchableHighlight
                onPress={this.playVideo.bind(null, obj)}
                underlayColor="#EEB422">
                <View style={styles.listViewItemContain}>
                    {
                      rowID==0?<View style={{backgroundColor: '#FFFFFF'}}/>:
                      <View style={styles.separator}/>
                    }
                    <View style={styles.ItemContentContain}>
                        <Image
                            resizeMode='stretch'
                            source={{uri:obj.urlImg}}
                            style={styles.LeftImage} />
                        <View style={styles.flexConten}>
                            <View style={styles.rowViewStyle}>
                                <Text
                                    numberOfLines={1}
                                    style={styles.nameTextStyles}>
                                    {videoType+name}
                                </Text>
                                <Text
                                    numberOfLines={2}
                                    style={styles.detailTextStyles}>
                                    {obj.detail}
                                </Text>
                            </View>
                            <View style={styles.columnViewStyle}>
                                <View style={styles.mainSpeakStyles}>
                                    <Image
                                        resizeMode='stretch'
                                        source={app.img.personal_eye}
                                        style={styles.eyeImage} />
                                    <Text style={styles.mainSpeakTag}>{obj.clicks*3+50}</Text>
                                    <Image
                                        resizeMode='stretch'
                                        source={obj.isPraise === 0?app.img.personal_praise_pressed:app.img.personal_praise}
                                        style={styles.praiseImage} />
                                    <Text style={styles.mainSpeakTag}>{obj.likes}</Text>
                                </View>
                                <Text numberOfLines={1} style={styles.lastTimeText}>
                                    { moment(obj.createTime).format('YYYY.MM.DD')}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        )
    },
    renderFooter() {
        return (
            <View style={styles.listFooterContainer}>
                <Text style={styles.listFooter}>{CONSTANTS.LISTVIEW_INFINITE.TEXT[this.state.infiniteLoadStatus]}</Text>
            </View>
        )
    },
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.line}/>
                <ListView
                    ref={listView=>this.listView=listView}
                    initialListSize={1}
                    onEndReachedThreshold={10}
                    enableEmptySections={true}
                    onEndReached={this.onEndReached}
                    style={styles.listStyle}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    renderFooter={this.renderFooter}
                    />
            </View>
        )
    },
});


var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listStyle: {
        alignSelf:'stretch',
        backgroundColor: '#FFFFFF',
    },
    listFooterContainer: {
        alignItems: 'center',
    },
    listFooter: {
        color: 'gray',
        fontSize: 14,
    },
    separator: {
        position: 'absolute',
        width: sr.w-20,
        height: 1,
        left: 10,
        right: 10,
        top: 0,
        backgroundColor: '#F7F7F7',
    },
    columnViewStyle: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 240,
        height: 20,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    listViewItemContain: {
        flexDirection: 'row',
        width: sr.w,
        paddingVertical: 2,
        backgroundColor: '#FFFFFF',
    },
    ItemContentContain: {
        flexDirection: 'row',
        width: sr.w-20,
        margin: 10,
    },
    LeftImage: {
        width: 100,
        height:72,
        borderRadius: 2,
    },
    flexConten: {
        width: 245,
        marginLeft: 10,
        flexDirection: 'column',
    },
    rowViewStyle: {
        backgroundColor: 'transparent',
    },
    nameTextStyles: {
        color: '#252525',
        fontSize:16,
        backgroundColor: 'transparent',
    },
    detailTextStyles: {
        marginTop: 3,
        color: '#989898',
        fontSize:12,
        backgroundColor: 'transparent',
    },
    mainSpeakStyles: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    eyeImage: {
        height: 12,
        width: 13,
    },
    praiseImage: {
        height: 12,
        width: 12,
    },
    mainSpeakTag: {
        color: '#989898',
        fontSize: 12,
        marginLeft: 5,
        marginRight: 15,
    },
    lastTimeText: {
        color: '#B2B2B2',
        fontSize: 12,
    },
    line: {
        height: 1,
        width: sr.w,
        backgroundColor: '#E0E0E0',
    },
});
