'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    View,
    Text,
    Image,
    StyleSheet,
    Navigator,
    ListView,
    TouchableOpacity,
    TouchableHighlight,
} = ReactNative;

var VideoPlay = require('../study/VideoPlay.js');
var CoursePlayer = require('../specops/CoursePlayer.js');
var {Button, MessageBox} = COMPONENTS;

var moment = require('moment');

const VIDEO_TYPES = ['精品课程', '精彩案例', '编辑推荐', '课程亮点'];
const {STATUS_TEXT_HIDE, STATUS_START_LOAD, STATUS_HAVE_MORE, STATUS_NO_DATA, STATUS_ALL_LOADED, STATUS_LOAD_ERROR} = CONSTANTS.LISTVIEW_INFINITE.STATUS;

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        title: '学习记录',
        leftButton: { image: app.img.common_back2, handler: ()=>{app.navigator.pop()}},
    },
    getInitialState() {
        this.list = [];
        this.personRecord = {};
        this.pageNo = 1;
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        if (this.props.briefDisplay && this.props.learningRecordBase!=undefined && this.props.learningRecordBase.videoList!=undefined) {
            this.list = this.props.learningRecordBase.videoList;
        }
        return {
            dataSource: this.ds.cloneWithRows(this.list),
            isTime: false,
            infiniteLoadStatus: STATUS_TEXT_HIDE,
        };
    },
    componentDidMount() {
        if (!this.props.briefDisplay) {
            this.getList();
        }
        this.strTime1 = '0';
        this.strTime2 = '';
    },
    componentWillReceiveProps: function(nextProps) {
        const {learningRecordBase} = nextProps;
        const oldLearningRecordBase = this.props.learningRecordBase;
        if (!_.isEqual(learningRecordBase, oldLearningRecordBase)) {
            this.list = this.props.briefDisplay&&learningRecordBase!=undefined&&learningRecordBase.videoList!=undefined?learningRecordBase.videoList:[];
            this.setState({dataSource: this.ds.cloneWithRows(this.list)});
        }
    },
    getList() {
        var param = {
            userID: app.personal.info.userID,
            pageNo: this.pageNo,
        };
        this.setState({infiniteLoadStatus: this.pageNo===1?STATUS_START_LOAD:STATUS_HAVE_MORE});
        POST(app.route.ROUTE_SUBMIT_GETMYLEARNINGRECORD, param, this.getListSuccess, this.getListFailed);
    },
    getListSuccess(data) {
        if (data.success) {
            if (!this.state.isTime) {
                this.setState({isTime: true});
                this.personRecord = {
                    total:data.context.total,
                    lastTimeWatch:data.context.lastTimeWatch,
                    monthTotal:data.context.monthTotal,
                }
            }
            if (this.personRecord.lastTimeWatch) {
                if (this.personRecord.lastTimeWatch=='0') {
                    this.strTime1 = '0';
                }else {
                    var diffMs = moment().diff(this.personRecord.lastTimeWatch);
                    var dayMs = 24*60*60*1000;
                    var hourMs = 60*60*1000;
                    var minMs = 60*1000;
                    var day = parseInt(diffMs / dayMs);
                    var hour = parseInt(diffMs / hourMs);
                    var min = parseInt(diffMs / minMs);

                    if (day > 0) {
                        this.strTime1 = day+'';
                        this.strTime2 = '天前';
                    }else if (hour > 0) {
                        this.strTime1 = hour+'';
                        this.strTime2 = '小时前';
                    }else if (min > 0) {
                        this.strTime1 = min+'';
                        this.strTime2 = '分钟前';
                    }else {
                        this.strTime1 = '刚刚';
                        this.strTime2 = '';
                    }
                }
            }else {
                this.strTime1 = '0';
                this.strTime2 = '';
            }
            if (data.context.videoList) {
                if (this.props.briefDisplay) {
                    this.list = data.context.videoList.length>=3?data.context.videoList.slice(0,3):data.context.videoList;
                }else {
                    for (var i = 0; i < data.context.videoList.length; i++) {
                        this.list.push(data.context.videoList[i]);
                    }
                }
                var infiniteLoadStatus = data.context.videoList.length < CONSTANTS.PER_PAGE_COUNT ? STATUS_ALL_LOADED : STATUS_TEXT_HIDE;
                this.setState({
                    dataSource: this.ds.cloneWithRows(this.list),
                    infiniteLoadStatus: infiniteLoadStatus,
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
    playVideo(obj) {
        app.updateNavbarColor(CONSTANTS.THEME_COLORS[1]);
        const {isAgent, isSpecialSoldier} = app.personal.info;
        let authorized = isAgent||isSpecialSoldier; //是否是特种兵1—是  0—不是
        if (obj.videoType==6) {
            if (!authorized) {
                //跳转到购买特种兵页
                app.showMainScene(1);
            } else {
                //跳转到特种兵视频播放页
                app.navigator.push({
                    component: CoursePlayer,
                    passProps: {otherVideoID:obj.videoID, isCourseRecord:true},
                    sceneConfig: {
                        ...Navigator.SceneConfigs.HorizontalSwipeJump, gestures: null
                    }
                });
            }
        } else {
            //跳转到普通视频播放页
            app.navigator.push({
                title: obj.name,
                component: VideoPlay,
                passProps: {videoInfo:obj, isFromRecords: this.props.briefDisplay},
                sceneConfig: {
                    ...Navigator.SceneConfigs.HorizontalSwipeJump, gestures: null
                }
            });
        }
    },
    renderRow(obj, sectionID, rowID) {
        let timeArr = [];
        let time = obj.lastTime;
        if (time) {
            timeArr = time.split(' ');
        }
        let videoType = obj.videoType&&obj.videoType < 5? VIDEO_TYPES[obj.videoType-1]+'：':'';
        let name = obj.name ? obj.name: '';

        return (
            <TouchableHighlight
                onPress={this.playVideo.bind(null, obj)}
                underlayColor="#EEB422">
                <View style={styles.listViewItemContain}>
                    <View style={styles.separator}/>
                    <View style={styles.flex_4}>
                        <View style={styles.ItemContentContain}>
                            <Image
                                resizeMode='stretch'
                                source={{uri:obj.urlImg}}
                                style={styles.LeftImage} />
                            <View style={styles.flexConten}>
                                <View style={styles.rowViewStyle}>
                                    <Text
                                        numberOfLines={2}
                                        style={styles.nameTextStyles}>
                                        {videoType+name}
                                    </Text>
                                </View>
                                <View style={styles.columnViewStyle}>
                                    <View style={styles.mainSpeakStyles}>
                                        <Text style={styles.mainSpeakTag}>主讲：</Text>
                                        <Text numberOfLines={1} style={styles.mainSpeakText}>
                                            {obj.author}
                                        </Text>
                                    </View>
                                    <View style={styles.mainSpeakStyles}>
                                        <Text numberOfLines={1} style={styles.lastTimeText}>
                                            {timeArr[0].replace('-', '.').replace('-', '.')}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        )
    },
    renderFooter() {
        if (this.props.briefDisplay) {
            return null;
        }
        return (
            <View style={styles.listFooterContainer}>
                <Text style={styles.listFooter}>{CONSTANTS.LISTVIEW_INFINITE.TEXT[this.state.infiniteLoadStatus]}</Text>
            </View>
        )
    },
    render() {
        return (
            <View style={styles.container}>
                {
                    !this.props.briefDisplay&&
                    <View style={styles.listHeaderContainer}>
                        <View style={styles.headerLeft}>
                            <Text style={styles.headText1}>上次学习</Text>
                            <View style={styles.headerTextView}>
                                <Text style={styles.headText2}>
                                    {this.strTime1}
                                </Text>
                                <Text style={styles.headText2}>
                                    {this.strTime2}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.headerCenter}/>
                        <View style={styles.headerRight}>
                            <Text style={styles.headText1}>本月学习课程</Text>
                            <Text style={styles.headText2}>
                                {this.personRecord.monthTotal==undefined?0:this.personRecord.monthTotal+'节'}
                            </Text>
                        </View>
                    </View>
                }
                <ListView
                    initialListSize={1}
                    onEndReachedThreshold={10}
                    enableEmptySections={true}
                    onEndReached={this.props.briefDisplay?null:this.onEndReached}
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
    headText1: {
        color:'#989898',
        fontSize: 14,
    },
    headText2: {
        color:'#DE3031',
        marginTop:10,
        fontSize: 14,
    },
    listStyle: {
        alignSelf:'stretch',
        backgroundColor: '#FFFFFF',
    },
    listHeaderContainer: {
        height:60,
        alignItems: 'center',
        flexDirection:'row',
        backgroundColor:'white',
        marginBottom: 6,
    },
    headerTextView: {
        alignItems: 'center',
        justifyContent:'center',
        flexDirection:'row',
    },
    headerLeft: {
        flex:1,
        alignItems: 'center',
        justifyContent:'center',
        flexDirection:'column',
    },
    headerCenter: {
        width: 1,
        height: 40,
        paddingVertical: 5,
        backgroundColor: '#EAEAEA',
    },
    headerRight: {
        flex:1,
        alignItems: 'center',
        justifyContent:'center',
        flexDirection:'column',
    },
    listFooterContainer: {
        alignItems: 'center',
    },
    listFooter: {
        marginVertical: 10,
        color: 'gray',
        fontSize: 14,
    },
    row: {
        alignItems: 'center',
    },
    separator: {
        position: 'absolute',
        width: sr.w-37,
        height: 1,
        left: 23,
        right: 14,
        top: 0,
        backgroundColor: '#F7F7F7',
    },
    itemContainer: {
        marginTop: 5,
        width: sr.w,
        flexDirection: 'row',
    },
    deleteStyle: {
        marginTop: 32,
        marginLeft: 6,
        height: 25,
        width: 25,
    },
    btnStyle: {
        flex: 1,
        marginRight: 3,
        borderRadius: 5,
        alignSelf: 'flex-end',
        paddingVertical: 3,
        backgroundColor: CONSTANTS.THEME_COLOR,
    },
    btnStyleText: {
        fontSize: 14,
        fontWeight: '500',
    },
    columnViewStyle: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 210,
        height: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    listViewItemContain: {
        flexDirection: 'row',
        width: sr.w,
        paddingVertical: 2,
        backgroundColor: '#FFFFFF',
    },
    flex_4: {
        flex: 4,
    },
    ItemContentContain: {
        flexDirection: 'row',
        width: sr.w,
        marginVertical: 10,
        paddingLeft:30,
        paddingRight:15,
    },
    LeftImage: {
        width: 112.5,
        height:77,
        borderRadius: 2,
    },
    flexConten: {
        width: 210,
        marginLeft: 10,
        flexDirection: 'column',
    },
    rowViewStyle: {
        flexDirection: 'row',
    },
    nameTextStyles: {
        flex: 1,
        color: '#252525',
        fontSize:16,
        alignSelf: 'center',
    },
    mainSpeakStyles: {
        flexDirection: 'row',
    },
    mainSpeakTag: {
        color: '#989898',
        fontSize: 14,
    },
    mainSpeakText: {
        color: '#989898',
        fontSize: 14,
        width: 90,
    },
    lastTimeText: {
        color: '#B2B2B2',
        fontSize: 12,
    },
});
