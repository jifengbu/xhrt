'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    View,
    Text,
    Image,
    StyleSheet,
    ListView,
    TouchableHighlight,
} = ReactNative;

const RecommendVideoPlayer = require('../home/RecommendVideoPlayer.js');
const moment = require('moment');

const { STATUS_TEXT_HIDE, STATUS_START_LOAD, STATUS_HAVE_MORE, STATUS_NO_DATA, STATUS_ALL_LOADED, STATUS_LOAD_ERROR } = CONSTANTS.LISTVIEW_INFINITE.STATUS;

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        title: '已购视频',
        leftButton: { image: app.img.common_back2, handler: () => { app.navigator.pop(); } },
    },
    getInitialState () {
        this.pageNo = 1;
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        if (this.props.briefDisplay && this.props.learningRecordBase != undefined && this.props.learningRecordBase.videoList != undefined) {
            this.list = this.props.learningRecordBase.videoList;
        }
        return {
            dataSource: this.ds.cloneWithRows([]),
            infiniteLoadStatus: STATUS_TEXT_HIDE,
        };
    },
    componentWillReceiveProps: function (nextProps) {
        const { learningRecordBase } = nextProps;
        const oldLearningRecordBase = this.props.learningRecordBase;
        if (!_.isEqual(learningRecordBase, oldLearningRecordBase)) {
            this.list = this.props.briefDisplay && learningRecordBase != undefined && learningRecordBase.videoList != undefined ? learningRecordBase.videoList : [];
            this.setState({ dataSource: this.ds.cloneWithRows(this.list) });
        }
    },
    componentDidMount () {
        if (!this.props.briefDisplay) {
            this.getList();
        }
    },
    getList () {
        const param = {
            userID: app.personal.info.userID,
            pageNo: this.pageNo,
        };
        this.setState({ infiniteLoadStatus: this.pageNo === 1 ? STATUS_START_LOAD : STATUS_HAVE_MORE });
        POST(app.route.ROUTE_GET_ENCOURAGE_COURSE_LIST, param, this.getListSuccess, this.getListFailed);
    },
    getListSuccess (data) {
        if (data.success) {
            let length = 0;
            if (data.context.videoList) {
                if (this.props.briefDisplay) {
                    this.list = data.context.videoList.length >= 3 ? data.context.videoList.slice(0, 3) : data.context.videoList;
                } else {
                    this.list = data.context.videoList.length != 0 && data.context.videoList;
                }
                const infiniteLoadStatus = data.context.videoList.length < CONSTANTS.PER_PAGE_COUNT ? STATUS_ALL_LOADED : STATUS_TEXT_HIDE;
                this.setState({
                    dataSource: this.ds.cloneWithRows(this.list),
                    infiniteLoadStatus: infiniteLoadStatus,
                });
            }
        } else {
            this.getListFailed();
        }
    },
    getListFailed () {
        this.pageNo--;
        this.setState({ infiniteLoadStatus: STATUS_LOAD_ERROR });
    },
    onEndReached () {
        if (this.state.infiniteLoadStatus !== STATUS_TEXT_HIDE) {
            return;
        }
        this.pageNo++;
        this.getList();
    },
    // 更新视频的播放和点赞数量
    updateClickOrLikeNum (clickNum) {
        const video = _.find(this.state.dataSource._dataBlob.s1, (item) => item.videoID == clickNum.videoID);
        if (video) {
            if (clickNum.type === 'click') {
                video.clicks += 1;
            } else if (clickNum.type === 'heart') {
                video.likes += 1;
                video.isPraise = 0;
            }
            this.setState({ dataSource: this.ds.cloneWithRows(this.state.dataSource._dataBlob.s1) });
        }
    },
    playVideo (obj) {
        // 跳转到普通视频播放页
        app.navigator.push({
            component: RecommendVideoPlayer,
            passProps: { videoInfo:obj, updateClickOrLikeNum: this.updateClickOrLikeNum },
        });
    },
    renderRow (obj, sectionID, rowID, onRowHighlighted) {
        const name = obj.name ? obj.name : '';
        return (
            <TouchableHighlight
                onPress={this.playVideo.bind(null, obj)}
                underlayColor='#EEB422'>
                <View style={styles.listViewItemContain}>
                    {
                      rowID == 0 ? <View style={{ backgroundColor: '#FFFFFF' }} /> :
                      <View style={styles.separator} />
                    }
                    <View style={styles.ItemContentContain}>
                        <Image
                            resizeMode='stretch'
                            source={{ uri:obj.urlImg }}
                            style={styles.LeftImage} >
                        </Image>
                        <View style={styles.flexConten}>
                            <View style={styles.rowViewStyle}>
                                <Text
                                    numberOfLines={2}
                                    style={styles.nameTextStyles}>
                                    {name}
                                </Text>
                                <Text
                                    numberOfLines={1}
                                    style={styles.detailTextStyles}>
                                    {obj.detail}
                                </Text>
                            </View>
                            <View style={styles.columnViewStyle}>
                                <Text numberOfLines={1} style={styles.lastTimeText}>
                                    { '￥'+'9.9'}
                                </Text>
                                <View style={styles.mainSpeakStyles}>
                                    <Text style={[styles.mainSpeakTag, {color: '#989898'}]}>{obj.likes+'人正在学习'}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    },
    renderFooter () {
        if (this.props.briefDisplay) {
            return null;
        }
        return (
            <View style={styles.listFooterContainer}>
                <Text style={styles.listFooter}>{CONSTANTS.LISTVIEW_INFINITE.TEXT[this.state.infiniteLoadStatus]}</Text>
            </View>
        );
    },
    render () {
        return (
            <View style={styles.container}>
                {
                    !this.props.briefDisplay&&
                    <View style={styles.line} >
                    </View>
                }
                <ListView
                    ref={listView => { this.listView = listView; }}
                    initialListSize={1}
                    onEndReachedThreshold={10}
                    enableEmptySections
                    onEndReached={this.props.briefDisplay ? null : this.onEndReached}
                    style={styles.listStyle}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    renderFooter={this.renderFooter}
                    />
            </View>
        );
    },
});

const styles = StyleSheet.create({
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
        width: sr.w,
        height: 1,
        left: 0,
        right: 0,
        top: 0,
        backgroundColor: '#F7F7F7',
    },
    columnViewStyle: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 228,
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
        width: sr.w - 20,
        margin: 10,
    },
    LeftImage: {
        width: 125,
        height:85,
    },
    flexConten: {
        width: 232,
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
        marginTop: 5,
        color: '#989898',
        fontSize:12,
        backgroundColor: 'transparent',
    },
    mainSpeakStyles: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    mainSpeakTag: {
        color: '#FFFFFF',
        fontSize: 12,
        marginLeft: 5,
        backgroundColor: 'transparent',
    },
    lastTimeText: {
        color: 'red',
        fontSize: 12,
    },
    line: {
        height: 1,
        width: sr.w,
        backgroundColor: '#E0E0E0',
    },
});
