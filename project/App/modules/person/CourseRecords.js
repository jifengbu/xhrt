'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    View,
    Text,
    Image,
    StyleSheet,
    Navigator,
    ListView,
    TouchableHighlight,
} = ReactNative;

const VideoPlay = require('../specops/CoursePlayer.js');
const Progress = require('react-native-progress');
const moment = require('moment');

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        title: '我的课程',
        leftButton: { image: app.img.common_back2, handler: () => { app.navigator.pop(); } },
    },
    getInitialState () {
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return {
            dataSource: this.ds.cloneWithRows([]),
        };
    },
    componentDidMount () {
        this.getStudyProgressList();
    },
    getStudyProgressList () {
        const param = {
            userID: app.personal.info.userID,
        };
        POST(app.route.ROUTE_STUDY_PROGRESS_LIST, param, this.getStudyProgressListSuccess,true);
    },
    getStudyProgressListSuccess (data) {
        if (data.success) {
            const { courseList } = data.context;
            if (courseList) {
                const videoList = this.props.showCount && courseList.length >= 3 ? (courseList.slice(0, 3) || []) : courseList;
                this.setState({ dataSource:this.ds.cloneWithRows(videoList) });
            }
        }
    },
    playVideo (obj) {
        app.updateNavbarColor(CONSTANTS.THEME_COLORS[1]);
        app.navigator.push({
            component: VideoPlay,
            passProps: { otherVideoID:obj.videoID, isCourseRecord:true, refreshProgress:this.refreshProgress },
        });
    },
    refreshProgress () {
        this.refStudyProgressList();
    },
    refStudyProgressList () {
        const param = {
            userID: app.personal.info.userID,
        };
        POST(app.route.ROUTE_STUDY_PROGRESS_LIST, param, this.refStudyProgressListSuccess);
    },
    refStudyProgressListSuccess (data) {
        if (data.success) {
            const { courseList } = data.context;
            if (courseList) {
                const videoList = this.props.showCount && courseList.length >= 3 ? (courseList.slice(0, 3) || []) : courseList;
                this.setState({ dataSource:this.ds.cloneWithRows(videoList) });
            }
        }
    },
    renderRow (obj, sectionID, rowID) {
        return (
            <TouchableHighlight
                onPress={this.playVideo.bind(null, obj)}
                underlayColor='#EEB422'>
                <View style={styles.listViewItemContain}>
                    <View style={styles.itemContentTitle}>
                        <View style={styles.titleRed} />
                        <Text numberOfLines={1} style={styles.titleText}>
                            {obj.videoName}
                        </Text>
                    </View>
                    <View style={styles.itemContentProgress}>
                        <View style={styles.numView}>
                            <Text style={[styles.numText, { marginLeft: sr.ws(254 * obj.studyProgress / 100) }]}>
                                {obj.studyProgress + '%'}
                            </Text>
                        </View>
                        <Text style={styles.progressText}>
                            {'课程进度'}
                        </Text>
                        <View style={styles.progressViewStyle}>
                            <Progress.Bar
                                progress={obj.studyProgress / 100}
                                width={sr.ws(254)}
                                height={sr.ws(5)}
                                borderRadius={sr.ws(3)}
                                animated
                                borderWidth={1}
                                borderColor='#FFFFFF'
                                color='#FF6363' />
                        </View>
                    </View>
                    <View style={styles.itemContentTime}>
                        <Text style={styles.commentText}>
                            { moment(obj.createTime).format('MM-DD HH:mm')}
                        </Text>
                        <View style={styles.itemContentTimeDizan}>
                            <Image
                                resizeMode='stretch'
                                source={app.img.personal_praise}
                                style={styles.icon_likes} />
                            <Text style={styles.commentText}>
                                {obj.likes}
                            </Text>
                            <Image
                                resizeMode='stretch'
                                source={app.img.personal_eye}
                                style={styles.icon_wicth} />
                            <Text style={styles.commentText}>
                                {obj.clicks*3+50}
                            </Text>
                        </View>
                    </View>
                    {
                        rowID != 0 &&
                        <View style={styles.separator} />
                    }
                </View>
            </TouchableHighlight>
        );
    },
    render () {
        return (
            <View style={styles.container}>
                {
                    !this.props.showCount &&
                    <View style={styles.line} />
                }
                <ListView
                    enableEmptySections                    removeClippedSubviews={false}                    style={styles.listStyle}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
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
    },
    separator: {
        position: 'absolute',
        width: sr.w - 48,
        height: 1,
        left: 24,
        top: 0,
        backgroundColor: '#EFEFEF',
    },
    line: {
        width: sr.w,
        height: 1,
        backgroundColor: '#EFEFEF',
    },
    listViewItemContain: {
        width: sr.w,
        paddingVertical: 2,
        backgroundColor: '#FFFFFF',

    },
    itemContentTitle: {
        flexDirection: 'row',
        width: sr.w,
        marginTop: 12,
        paddingLeft:28,
        paddingRight:15,
        alignItems: 'center',
    },
    titleRed: {
        width: 6,
        height: 6,
        backgroundColor: '#DE3031',
        borderRadius: 6,
    },
    titleText: {
        fontSize: 16,
        marginLeft: 11,
        fontFamily: 'STHeitiSC-Medium',
        color: '#292929',
        width: 300,
    },
    itemContentProgress: {
        width: sr.w,
        paddingLeft:44,
        paddingRight:15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    numView: {
        position: 'absolute',
        top: 0,
        left: 87,
        height: 15,
        width: 286,
        justifyContent: 'flex-end',
    },
    numText: {
        fontSize: 9,
        fontFamily: 'STHeitiSC-Medium',
        color: '#DE3031',
    },
    progressText: {
        fontSize: 10,
        width: 42,
        marginRight: 10,
        marginVertical: 12,
        fontFamily: 'STHeitiSC-Medium',
        color: '#606060',
    },
    commentText: {
        fontSize: 10,
        fontFamily: 'STHeitiSC-Medium',
        color: '#989898',
        marginRight: 12,
    },
    itemContentTime: {
        flexDirection: 'row',
        width: sr.w,
        marginBottom: 7,
        paddingLeft:44,
        paddingRight:15,
        justifyContent: 'space-between',
    },
    itemContentTimeDizan: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressViewStyle: {
        width: 254,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#D8D8D8',
    },
    icon_wicth: {
        width: 12,
        height: 10,
        marginRight: 5,
    },
    icon_likes: {
        width: 11,
        height: 11,
        marginRight: 5,
    },
});
