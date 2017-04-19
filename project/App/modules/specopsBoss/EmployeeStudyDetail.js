'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TouchableHighlight,
} = ReactNative;

import Swiper from 'react-native-swiper2';
const HomeworkList = require('./HomeworkList.js');
const ClassTestList = require('./ClassTestList.js');
const EmployeeStudyTable = require('./EmployeeStudyTable.js');
const PieChart = require('./pieChart.js');
const moment = require('moment');
const CoursePlayer = require('../specops/CoursePlayer.js');
const { DImage, MessageBox } = COMPONENTS;

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        leftButton: { handler: () => { app.navigator.pop(); } },
    },
    getInitialState () {
        this.isRefreshScroll = false;
        this.sections = [];
        this.radios = [];
        this.numbers = [];
        this.startTimes = [];
        this.endTimes = [];
        for (let i = 0; i < 5; i++) {
            this.sections[i] = [];
            this.radios[i] = [];
            this.numbers[i] = [];
        }
        return {
            welcomeCourses: [],
            studyWhenLong: {},
            specopsUserTask: [],
            quizzesSuccess: [],
            monthAvgCoursesNumber: [],
            avgCoursesNumber: {},
            monthStudyWhenLong:[],
            haveData: false,
        };
    },
    componentDidMount () {
        this.getList();
    },
    getList () {
        const param = {
            userID: app.personal.info.userID,
            companyId: app.personal.info.companyInfo.companyId,
        };
        POST(app.route.ROUTE_GET_STUDY_SITUATION_DETAILS, param, this.getListSuccess, true);
    },
    getListSuccess (data) {
        if (data.success) {
            if (data.context) {
                this.sections = [];
                this.radios = [];
                this.numbers = [];
                for (let i = 0; i < 5; i++) {
                    this.sections[i] = [];
                    this.radios[i] = [];
                    this.numbers[i] = [];
                }
                const { avgCoursesNumber, monthAvgCoursesNumber, quizzesSuccess, specopsUserTask, studyWhenLong, welcomeCourses, monthStudyWhenLong } = data.context;
                this.setState({ avgCoursesNumber, monthAvgCoursesNumber, quizzesSuccess, specopsUserTask, studyWhenLong, welcomeCourses, monthStudyWhenLong });
                if (quizzesSuccess != null) {
                    for (let i in quizzesSuccess) {
                        this.startTimes.push(quizzesSuccess[i].startData);
                        this.endTimes.push(quizzesSuccess[i].endData);
                        for (let j in quizzesSuccess[i].content) {
                            this.sections[i].push(quizzesSuccess[i].content[j].title + '(' + quizzesSuccess[i].content[j].sectionMax + '~' + quizzesSuccess[i].content[j].sectionMin + ')');
                            this.radios[i].push(quizzesSuccess[i].content[j].proportion + '%');
                            this.numbers[i].push(quizzesSuccess[i].content[j].number);
                        }
                    }
                }
                _.remove(this.sections, (item) => item.length === 0);
                _.remove(this.radios, (item) => item.length === 0);
                _.remove(this.numbers, (item) => item.length === 0);
            }
            this.setState({ haveData: false });
            setTimeout(() => {
                this.setState({ haveData: true });
            }, 600);
        } else {
            Toast(data.msg);
        }
    },
    toHomeworkList () {
        app.navigator.push({
            title: '课后作业',
            component: HomeworkList,
            passProps: { showAll: true },
        });
    },
    toTestList () {
        app.navigator.push({
            component: ClassTestList,
        });
    },
    toPlayVideo (obj) {
        // 跳转到特种兵视频播放页
        const param = {
            userID:app.personal.info.userID,
            videoID: obj.videoID,
        };
        POST(app.route.ROUTE_STUDY_PROGRESS, param, (data) => {
            if (data.success) {
                if (!obj.isOver) {
                    app.navigator.push({
                        component: CoursePlayer,
                        passProps: { otherVideoID:obj.videoID, newSee:0, lastSee:1, update:true },
                    });
                } else {
                    app.navigator.push({
                        component: CoursePlayer,
                        passProps: { isCourseRecord:true, lastStudyProgress: data.context, otherVideoID: obj.videoID },
                    });
                }
            } else {
                Toast('该特种兵课程学习进度获取失败，请重试！');
            }
        });
    },
    onChangePage () {
        this.setState({});
    },
    onLayoutSwiper (e) {
        const { height } = e.nativeEvent.layout;
        this.viewSwiperHeight = e.nativeEvent.layout.y - height;
    },
    render () {
        const { avgCoursesNumber, monthAvgCoursesNumber, quizzesSuccess, specopsUserTask, studyWhenLong, welcomeCourses, monthStudyWhenLong } = this.state;
        return (
            <View style={styles.container}>
                <ScrollView onScroll={(e) => {
                    if (e.nativeEvent.contentOffset.y >= this.viewSwiperHeight) {
                        if (!this.isRefreshScroll) {
                            setTimeout(() => {
                                this.setState({ changePage: true });
                                this.isRefreshScroll = true;
                            }, 100);
                        }
                    }
                }}>
                    <View style={styles.line} />
                    {
                        this.state.haveData &&
                        <EmployeeStudyTable avgCoursesNumber={avgCoursesNumber} monthAvgCoursesNumber={monthAvgCoursesNumber} studyWhenLong={studyWhenLong} monthStudyWhenLong={monthStudyWhenLong} />
                    }
                    <View style={styles.classStyle}>
                        <View style={styles.line} />
                        <View style={styles.topStyle}>
                            <Text style={styles.themeStyles}>
                                {'本周最受欢迎课程'}
                            </Text>
                        </View>
                        {
                            welcomeCourses.length ?
                            welcomeCourses.map((item, i) => {
                                return (
                                    <TouchableHighlight
                                        key={i}
                                        underlayColor='rgba(0, 0, 0, 0)'
                                        onPress={this.toPlayVideo.bind(null, item)}
                                        style={styles.rowStyle}>
                                        <View style={styles.listViewItemContain}>
                                            {
                                                i == 0 ?
                                                    <View style={styles.rowLineOne} />
                                                :
                                                    <View style={styles.rowLine} />
                                            }
                                            <View style={styles.ItemContentContain}>
                                                <Text
                                                    style={styles.numStyles}>
                                                    {i + 1}
                                                </Text>
                                                <DImage
                                                    resizeMode='stretch'
                                                    defaultSource={app.img.common_default}
                                                    source={{ uri:item.urlImg }}
                                                    style={styles.LeftImage} />
                                                <View style={styles.flexConten}>
                                                    <View style={styles.rowViewStyle}>
                                                        <Text
                                                            numberOfLines={2}
                                                            style={styles.nameTextStyles}>
                                                            {item.name}
                                                        </Text>
                                                    </View>
                                                    <View style={styles.columnViewStyle}>
                                                        <Text
                                                            numberOfLines={1}
                                                            style={styles.lastTimeText}>
                                                            { item.userClicks + '位员工已学习'}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableHighlight>
                                );
                            })
                            : <View style={styles.listFooterContainer}>
                                <View style={styles.rowLineOne} />
                                <Text style={styles.listFooter}>{'您的员工还没有开始学习'}</Text>
                            </View>
                        }
                        <View style={styles.line} />
                    </View>
                    <View style={styles.testStyle}>
                        <View style={styles.line} />
                        <View style={styles.topStyle}>
                            <Text style={styles.themeStyles}>
                                {'随堂测试成绩'}
                            </Text>
                        </View>
                        <View style={styles.line} />
                        {
                            this.state.haveData &&
                            <Swiper
                                paginationStyle={styles.paginationStyle}
                                dot={<View style={{ backgroundColor:'#E0E0E0', width: 6, height: 6, borderRadius: 3, marginLeft: 6, marginRight: 6 }} />}
                                activeDot={<View style={{ backgroundColor:'#FA4C50', width: 12, height: 6, borderRadius: 3, marginLeft: 6, marginRight: 6 }} />}
                                height={sr.ws(169)}
                                onChangePage={this.onChangePage}
                                loop={false}>
                                {
                                    this.sections.map((item, i) => {
                                        let timeText = '';
                                        const startMoment = moment(this.startTimes[i]), nowMoment = moment(), endMoment = moment(this.endTimes[i]);
                                        if (!nowMoment.isBefore(startMoment) && nowMoment.isBefore(endMoment)) {
                                            timeText = '本周随堂测试成绩';
                                        } else {
                                            timeText = moment(this.startTimes[i]).format('M月D日') + ' ~ ' + moment(this.endTimes[i]).format('M月D日') + ' 随堂测试成绩';
                                        }
                                        return (
                                            <View key={i} onLayout={this.onLayoutSwiper} style={styles.bannerImage}>
                                                <View style={styles.tableTop}>
                                                    <Text style={styles.tableTopText}>
                                                        {timeText}
                                                    </Text>
                                                </View>
                                                {
                                                    this.state.haveData &&
                                                    <PieChart showUnitText={'人'} sections={this.sections[i]} radios={this.radios[i]} numbers={this.numbers[i]} />
                                                }
                                            </View>
                                        );
                                    })
                                }
                            </Swiper>
                        }
                        <View style={styles.line} />
                        <TouchableOpacity
                            onPress={this.toTestList}
                            style={styles.btnStyle}>
                            <Text style={styles.themeStyles}>
                                {'查看详情'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.testStyle}>
                        <View style={styles.line} />
                        <TouchableOpacity
                            onPress={this.toHomeworkList}
                            style={styles.topStyle}>
                            <Text style={styles.themeStyles}>
                                {'课后作业'}
                            </Text>
                            <Text style={[styles.themeStyles, { marginRight: 10, color:'#7E7E7E' }]}>
                                {'查看更多'}
                            </Text>
                        </TouchableOpacity>
                        <HomeworkList showAll={false} />
                    </View>
                </ScrollView>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F1F2',
    },
    line: {
        height: 1,
        width: sr.w,
        backgroundColor: '#E0E0E0',
    },
    classStyle: {
        width: sr.w,
        marginTop: 10,
        backgroundColor:'white',
    },
    topStyle: {
        width: sr.w,
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor:'white',
    },
    themeStyles: {
        fontSize: 16,
        marginLeft: 20,
        fontFamily: 'STHeitiSC-Medium',
        color: '#252525',
    },
    btnStyle: {
        height: 45,
        marginLeft: 80,
        width: sr.w - 160,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowLine: {
        position: 'absolute',
        height: 1,
        left: 20,
        top: 0,
        width: sr.w - 40,
        backgroundColor: '#E0E0E0',
    },
    rowLineOne: {
        position: 'absolute',
        height: 1,
        left: 0,
        top: 0,
        width: sr.w,
        backgroundColor: '#E0E0E0',
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
    numStyles: {
        margin: 10,
        width: 20,
        fontFamily: 'STHeitiSC-Medium',
        fontSize: 16,
        color: '#252525',
        alignSelf: 'center',
    },
    LeftImage: {
        width: 72,
        height: 54,
        borderRadius: 2,
    },
    flexConten: {
        width: 222,
        marginLeft: 16,
    },
    rowViewStyle: {
        backgroundColor: 'transparent',
    },
    nameTextStyles: {
        color: '#3C3C3C',
        fontSize: 14,
        fontFamily: 'STHeitiSC-Medium',
        backgroundColor: 'transparent',
    },
    columnViewStyle: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 222,
        height: 16,
        justifyContent: 'center',
    },
    lastTimeText: {
        color: '#A2A2A2',
        fontFamily: 'STHeitiSC-Medium',
        fontSize: 12,
    },
    testStyle: {
        width: sr.w,
        marginTop: 10,
        backgroundColor: '#FFFFFF',
    },
    paginationStyle: {
        bottom: 10,
    },
    tableTop: {
        width: sr.w,
        height: 25,
        justifyContent: 'flex-end',
    },
    tableTopText: {
        color: '#797979',
        fontFamily: 'STHeitiSC-Medium',
        fontSize: 14,
        marginLeft: 20,
    },
    bannerImage: {
        width: sr.w,
        height: 169,
    },
    brokenStyle: {
        width: sr.w,
        height: 270,
    },
    listFooterContainer: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listFooter: {
        color: 'gray',
        fontSize: 14,
    },
});
