'use strict';
const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    Text,
    Image,
    TextInput,
    ListView,
    ScrollView,
    TouchableHighlight,
    TouchableOpacity,
} = ReactNative;
const { DImage } = COMPONENTS;

const moment = require('moment');
const MonthList = require('../specops/MonthList.js');
const WeekList = require('../specops/WeekList.js');
const BossRecordItem = require('./BossRecordItem.js');
const HomeworkPersonal = require('./HomeworkPersonal.js');
const SpecopsPersonStudyInfo = require('./SpecopsPersonStudyInfo.js');
const ClassTestSpecopsList = require('./ClassTestSpecopsList.js');
const PieChart = require('./pieChart.js');
const EmployeeStudyTable = require('./EmployeeStudyTable.js');

module.exports = React.createClass({
    statics: {
        title: '赢销特种兵',
    },
    onStartShouldSetResponderCapture (evt) {
        app.touchPosition.x = evt.nativeEvent.pageX;
        app.touchPosition.y = evt.nativeEvent.pageY;
        return false;
    },
    getInitialState () {
        this.isRefresh = false;
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return {
            tabIndex: 0,
            weekCount: 0,
            monthDataSource: this.ds.cloneWithRows([]),
            weekDataSource: this.ds.cloneWithRows([]),
            dayDataSource: this.ds.cloneWithRows([]),
            isNextMonth: this.props.isNextMonth,
            memWeekTime: [],
            isLookAll: false,
            isShowBtn: false,
            lineHeight: 0,
            actualWorks: [],
            dayPlan: [],
            daySummary: null,
            studyDetailData: null,
            monthTaskData: null,
            studyInfo: null,
            haveData: false,
        };
    },
    componentDidMount () {
        this.monthData = {};
        this.memWeekCount = 0;
        this.clearMonthData();
        this.currentMonthNum = this.generateMyCurrentYearMonth().month;
        this.currentYearNum = this.generateMyCurrentYearMonth().year;
        this.processWeekTime(this.currentMonthNum);

        const tTime = moment();
        tTime.set('date', 15);
        tTime.set('year', this.currentYearNum);
        tTime.set('month', this.currentMonthNum);

        const param = {
            userID:this.props.userID,
            planDate:tTime.format('YYYY-MM-DD'),
        };
        POST(app.route.ROUTE_GET_MONTH_PLAN, param, this.getMonthDataSuccess, true);
        this.getDayPlanData(tTime);// 获取日计划
        this.getPersonalStudyDetailsData(tTime);// 获取日计划
        this.getPersonalMonthTaskData();// 获取个人本月任务提交情况
        this.getUserStudyInfo();
        this.setState({ tabIndex: this.getCurrentWeekIndex() });
    },
    getMonthDataSuccess (data) {
        if (data.success) {
            // process month plan..
            const monthPlan = data.context.monthPlan || [];
            const weekPlan = data.context.weekPlan || [];
            for (let i = 0; i < monthPlan.length; i++) {
                this.monthData.monthPlan.push(monthPlan[i]);
            }
            // process week plan..
            for (let i = 0; i < weekPlan.length; i++) {
                this.processWeekPlan(weekPlan[i]);
            }

            this.setState({ monthDataSource: this.ds.cloneWithRows(this.monthData.monthPlan) });
            this.changeTab(this.getCurrentWeekIndex());
        } else {
            Toast(data.msg);
        }
    },
    getDayPlanData (tTime) {
        const param = {
            userID:this.props.userID,
            planDate:moment().format('YYYY-MM-DD'),
        };
        POST(app.route.ROUTE_GET_DAY_PLAN, param, this.getDayPlanDataSuccess);
    },
    getDayPlanDataSuccess (data) {
        if (data.success) {
            const { actualWorks, dayPlan, daySummary } = data.context;
            this.setState({ actualWorks: actualWorks.contextList, dayPlan, daySummary });
        } else {
            Toast(data.msg);
        }
    },
    getPersonalStudyDetailsData () {
        const param = {
            companyId: app.personal.info.companyInfo.companyId,
            userID: this.props.userID,
        };
        POST(app.route.ROUTE_GET_PERSONAL_STUDY_DETAILS, param, this.getPersonalStudyDetailsDataSuccess);
    },
    getPersonalStudyDetailsDataSuccess (data) {
        if (data.success) {
            this.setState({ studyDetailData: data.context });
            setTimeout(() => {
                this.setState({ haveData: true });
            }, 400);
        } else {
            Toast(data.msg);
        }
    },
    getPersonalMonthTaskData () {
        const param = {
            userID: this.props.userID,
            date: moment().format('YYYY-MM-DD'),
        };
        POST(app.route.ROUTE_GET_PERSONAL_MONTH_TASK, param, this.getPersonalMonthTaskDataSuccess);
    },
    getPersonalMonthTaskDataSuccess (data) {
        if (data.success) {
            this.setState({ monthTaskData: data.context });
        } else {
            Toast(data.msg);
        }
    },
    getUserStudyInfo () {
        const param = {
            userID: this.props.userID,
        };
        POST(app.route.ROUTE_GET_USER_STUDY_INFO, param, this.getUserStudyInfoSuccess);
    },
    getUserStudyInfoSuccess (data) {
        if (data.success) {
            this.setState({ studyInfo: data.context });
        } else {
            Toast(data.msg);
        }
    },
    getWeekPlan (index) {
        return this.monthData.weekPlan[index];
    },
    clearMonthData () {
        this.monthData.monthPlan = [];
        this.monthData.weekPlan = [];
        for (let i = 0; i < 5; i++) {
            this.monthData.weekPlan[i] = [];
        }
    },
    processWeekPlan (obj) {
        this.monthData.weekPlan[obj.weekNum - 1].push(obj);
    },
    processWeekTime (month) {
        // find month first monday
        let isFirstMonday = false;
        let addPos = 0;

        let firstDay = '';
        firstDay = moment().set('date', 1).set('month', month).format('YYYY-MM-DD');

        let firstMonday = '';
        while (isFirstMonday === false) {
            const isMonday = moment(firstDay).add(1 * addPos, 'd').day();
            if (isMonday === 1) {
                isFirstMonday = true;
                firstMonday = moment(firstDay).add(1 * addPos, 'd').format('YYYY-MM-DD');
                break;
            }
            addPos++;
        }
        if (moment().date() < moment(firstMonday).date()) {
            isFirstMonday = false;
            addPos = 0;
            firstDay = moment().subtract(1, 'M').set('date', 1).format('YYYY-MM-DD');
            firstMonday = '';
            while (isFirstMonday === false) {
                const isMonday = moment(firstDay).add(1 * addPos, 'd').day();
                if (isMonday === 1) {
                    isFirstMonday = true;
                    firstMonday = moment(firstDay).add(1 * addPos, 'd').format('YYYY-MM-DD');
                    break;
                }
                addPos++;
            }
        }
        // get week date
        for (let i = 0; i < 6; i++) {
            if (moment(firstMonday).add(7 * i, 'd').month() === moment(firstMonday).month()) {
                this.state.memWeekTime[i] = moment(firstMonday).add(7 * i, 'd').format('YYYY-MM-DD');
            } else {
                this.setState({ weekCount: i });
                this.memWeekCount = i;
                break;
            }
        }
    },
    getWeekNum (time) {
        let currentWeek = moment(time).week();
        const currentWeekday = moment(time).weekday();
        if (currentWeekday === 0) {
            currentWeek = currentWeek - 1;
        }
        return currentWeek;
    },
    getCurrentMonthMonday () {
        // find month first monday
        let isFirstMonday = false;
        let addPos = 0;

        let firstDay = '';
        firstDay = moment().set('date', 1).format('YYYY-MM-DD');

        let firstMonday = '';
        while (isFirstMonday === false) {
            const isMonday = moment(firstDay).add(1 * addPos, 'd').day();
            if (isMonday === 1) {
                isFirstMonday = true;
                firstMonday = moment(firstDay).add(1 * addPos, 'd').format('YYYY-MM-DD');
                break;
            }
            addPos++;
        }
        if (moment().date() < moment(firstMonday).date()) {
            isFirstMonday = false;
            addPos = 0;
            firstDay = moment().subtract(1, 'M').set('date', 1).format('YYYY-MM-DD');
            firstMonday = '';
            while (isFirstMonday === false) {
                const isMonday = moment(firstDay).add(1 * addPos, 'd').day();
                if (isMonday === 1) {
                    isFirstMonday = true;
                    firstMonday = moment(firstDay).add(1 * addPos, 'd').format('YYYY-MM-DD');
                    break;
                }
                addPos++;
            }
        }
        return firstMonday;
    },
    generateMyCurrentYearMonth () {
        // find month first monday
        let isFirstMonday = false;
        let addPos = 0;

        let firstDay = '';
        firstDay = moment().set('date', 1).format('YYYY-MM-DD');

        let firstMonday = '';
        while (isFirstMonday === false) {
            const isMonday = moment(firstDay).add(1 * addPos, 'd').day();
            if (isMonday === 1) {
                isFirstMonday = true;
                firstMonday = moment(firstDay).add(1 * addPos, 'd').format('YYYY-MM-DD');
                break;
            }
            addPos++;
        }

        const ret = {};
        ret.year = moment().year();
        ret.month = moment().month();
        if (moment(firstMonday).date() > moment().date()) {
            ret.month = ret.month - 1;
            if (ret.month < 0) {
                ret.month = 11;
                ret.year = ret.year - 1;
            }
        }
        return ret;
    },
    getCurrentMonth () {
        const strFirstMonday = this.getCurrentMonthMonday();
        let monthNum = 0;
        if (moment().date() < moment(strFirstMonday).date()) {
            return moment().month();
        } else {
            return moment().month() + 1;
        }
    },
    getCurrentYear () {
        const strFirstMonday = this.getCurrentMonthMonday();
        let monthNum = 0;
        if (moment().date() < moment(strFirstMonday).date()) {
            if (moment().month() == 0) {
                return moment().year() - 1;
            }
        }
        return moment().year();
    },
    isSameWeekWithCurrentTime (time) {
        const currentWeek = this.getWeekNum(moment().format('YYYY-MM-DD'));
        const selectWeek = this.getWeekNum(time);
        if (currentWeek === selectWeek) {
            return true;
        } else {
            return false;
        }
    },
    isLastWeekWithCurrentTime (time) {
        const currentWeek = this.getWeekNum(moment().format('YYYY-MM-DD'));
        const selectWeek = this.getWeekNum(time);
        if (currentWeek > selectWeek) {
            return true;
        } else {
            return false;
        }
    },
    getCurrentWeekIndex () {
        let index = 0;
        let strWeek = '';
        if (moment().day() === 0) {
            strWeek = moment().subtract(1, 'd').format('YYYY-MM-DD');
        } else {
            strWeek = moment().format('YYYY-MM-DD');
        }
        for (let i = 0; i < this.memWeekCount; i++) {
            if (moment(this.state.memWeekTime[i]).week() === moment(strWeek).week()) {
                index = i;
                break;
            }
        }
        return index;
    },
    processDayTime (time) {
        //  current time get day data.
        let dayStr = '';
        const day = moment(time).day();
        if (day === 0) {
            dayStr = moment(time).subtract(1, 'd').format('YYYY-MM-DD');
        } else {
            dayStr = moment(time).format('YYYY-MM-DD');
        }
        if (this.state.isNextWeek) {
            dayStr = moment(dayStr).add(7, 'd').format('YYYY-MM-DD');
        }
        for (let i = 0; i < 7; i++) {
            this.state.memDayTime[i] = moment(dayStr).startOf('week').add(1 + i, 'd').format('YYYY-MM-DD');
        }
    },
    getCurrentDayIndex () {
        let index = 0;
        for (let i = 0; i < 7; i++) {
            if (moment(this.state.memDayTime[i]).day() === moment().day()) {
                index = i;
                break;
            }
        }
        return index;
    },
    changeTab (tabIndex) {
        this.setState({ tabIndex });
        const weekData = this.getWeekPlan(tabIndex);

        this.setState({ weekDataSource: this.ds.cloneWithRows(weekData) });
    },
    doLookAll () {
        this.setState({ isLookAll: !this.state.isLookAll });
    },
    goMonthPlanPage () {
        app.navigator.push({
            title: '工作目标',
            component: MonthList,
            passProps: { userID: this.props.userID },
        });
    },
    goWeekListPage () {
        app.navigator.push({
            title: '工作计划与总结',
            component: WeekList,
            passProps: { haveImage:false, userID: this.props.userID },
        });
    },
    goHomeworkPersonalPage () {
        app.navigator.push({
            title: '课后作业',
            component: HomeworkPersonal,
            passProps: { showAll: true, userID: this.props.userID },
        });
    },
    goClassTestSpecopsListPage () {
        app.navigator.push({
            title: '随堂测试成绩',
            component: ClassTestSpecopsList,
            passProps: { userID: this.props.userID },
        });
    },
    renderSeparator (sectionID, rowID) {
        return (
            <View style={styles.separator3} key={rowID} />
        );
    },
    render () {
        return (
            <View style={styles.container}
                onStartShouldSetResponderCapture={this.onStartShouldSetResponderCapture}>
                <View style={[styles.lineDivision, { height: sr.ws(1) }]} />
                {
                    this.state.studyInfo && <this.personalStudyInfoTop />
                }
                <ScrollView onScroll={(e) => {
                    if (e.nativeEvent.contentOffset.y >= this.viewSummaryHeight) {
                        if (!this.isRefresh) {
                            this.setState({ changePage: true });
                            this.isRefresh = true;
                        }
                    }
                }}>
                    {
                        this.state.studyInfo && <this.personalStudyInfoBottom />
                    }
                    <View style={[styles.lineDivision, { height: sr.ws(10) }]} />
                    <this.currentMonthTask />
                    <View style={[styles.lineDivision, { height: sr.ws(10) }]} />
                    <this.monthPlanPurpose />
                    <this.monthPlanContent />
                    <View style={[styles.lineDivision, { height: sr.ws(10) }]} />
                    <this.todayPlanPurpose />
                    <View style={[styles.lineDivision, { height: sr.ws(10) }]} />
                    <this.employeeStudy />
                    <View style={[styles.lineDivision, { height: sr.ws(10) }]} />
                    <this.classTestResults />
                    <View style={[styles.lineDivision, { height: sr.ws(10) }]} />
                    <this.homeworkList />
                </ScrollView>
            </View>
        );
    },
    renderRowMonth (obj) {
        return (
            <BossRecordItem
                data={obj}
                rowHeight={5}
                />
        );
    },
    renderRowWeek (obj) {
        return (
            <BossRecordItem
                data={obj}
                rowHeight={5}
                />
        );
    },
    renderRowDay (obj) {
        return (
            <BossRecordItem
                data={obj}
                rowHeight={5}
                isWideStyle
                />
        );
    },
    renderRowDayCommplete (obj) {
        return (
            <BossRecordItem
                data={obj}
                rowHeight={5}
                haveImage
                />
        );
    },
    calculateStrLength (oldStr) {
        let height = 0;
        let linesWidth = 0;
        if (oldStr) {
            oldStr = oldStr.replace(/<\/?.+?>/g, /<\/?.+?>/g, '');
            oldStr = oldStr.replace(/[\r\n]/g, '|');
            const StrArr = oldStr.split('|');
            for (let i = 0; i < StrArr.length; i++) {
                // 计算字符串长度，一个汉字占2个字节
                linesWidth = StrArr[i].replace(/[^\x00-\xff]/g, 'aa').length;
            }
            return linesWidth;
        }
    },
    // 特种兵个人学习时长
    personalStudyInfoTop () {
        const { studyInfo } = this.state;
        const headUrl = studyInfo && studyInfo.headImg ? studyInfo.headImg : studyInfo.sex === 1 ? app.img.personal_sex_male : app.img.personal_sex_female;
        const nameTemWidth = this.calculateStrLength(studyInfo.userName);
        const nameWidth = nameTemWidth * 10;
        return (
            <View style={styles.personContainer}>
                <View style={styles.personalInfoContainer}>
                    <DImage
                        resizeMode='cover'
                        defaultSource={app.img.personal_head}
                        source={studyInfo.headImg ? { uri: headUrl } : headUrl}
                        style={styles.headerIcon} />
                    <View style={styles.personalInfoStyle}>
                        <View style={styles.nameContainer}>
                            <Text style={[styles.nameText, { width: nameWidth > 155 ? sr.ws(155) : sr.ws(nameWidth) }]} numberOfLines={1}>
                                {studyInfo.userName}
                            </Text>
                            <View style={styles.verticalLine} />
                            <Text style={styles.aliasText}>
                                {studyInfo.alias}
                            </Text>
                        </View>
                        <Text style={styles.companyText}>
                            {(studyInfo.company == null || studyInfo.company == '') ? '未设置企业信息' : studyInfo.company}
                        </Text>
                    </View>
                </View>
                <View style={styles.divisionLine} />
            </View>
        );
    },
    // 特种兵个人学习时长
    personalStudyInfoBottom () {
        const { studyInfo } = this.state;
        return (
            <View style={styles.personContainer}>
                <View style={styles.studyDetailContainer}>
                    <View style={styles.panelContainer}>
                        <View style={styles.timeContainer}>
                            <Text style={[styles.timeStyle, { color: '#60A4F5' }]}>
                                {studyInfo.watchVideoLength}
                            </Text>
                            <Text style={[styles.timeText, { alignSelf: 'flex-end' }]}>分钟</Text>
                        </View>
                        <Text style={styles.timeText}>总共学习</Text>
                    </View>
                    <View style={styles.vline} />
                    <View style={styles.panelContainer}>
                        <View style={styles.timeContainer}>
                            <Text style={[styles.timeStyle, { color: '#A2D66C' }]}>
                                {studyInfo.overVideoStudy}
                            </Text>
                            <Text style={[styles.timeText, { alignSelf: 'flex-end' }]}>课时</Text>
                        </View>
                        <Text style={styles.timeText}>完成课程</Text>
                    </View>
                    <View style={styles.vline} />
                    <View style={styles.panelContainer}>
                        <View style={styles.timeContainer}>
                            <Text style={[styles.timeStyle, { color: '#FED057' }]}>
                                {studyInfo.continuousLogin}
                            </Text>
                            <Text style={[styles.timeText, { alignSelf: 'flex-end' }]}>天</Text>
                        </View>
                        <Text style={styles.timeText}>累计学习</Text>
                    </View>
                </View>
            </View>
        );
    },
    // 本月工作计划
    monthPlanPurpose () {
        return (
            <View style={styles.monthPlanPurposeViewStyle}>
                <View style={styles.titleContainerWeek}>
                    <View style={styles.titleContainerWeekSub}>
                        <View style={styles.headRedView} />
                        <Text style={styles.headItemText}>
                            本月目标
                        </Text>
                    </View>
                    <TouchableOpacity onPress={this.goMonthPlanPage}>
                        <Text style={styles.seeMoreText}>
                            查看更多
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.separator, { marginLeft: 18, width: sr.w - 18 }]} />
                <ListView
                    style={styles.list}
                    enableEmptySections
                    dataSource={this.state.monthDataSource}
                    renderRow={this.renderRowMonth}
                    renderSeparator={this.renderSeparator}
                    />
            </View>
        );
    },
    // 学习情况
    currentMonthTask () {
        const { monthTaskData } = this.state;
        const monthActualSumit = monthTaskData && monthTaskData.monthPlan.actualSumit;
        const monthShouldSumit = monthTaskData && monthTaskData.monthPlan.shouldSumit;
        const dayActualSumit = monthTaskData && monthTaskData.dayPlan.actualSumit;
        const dayShouldSumit = monthTaskData && monthTaskData.dayPlan.shouldSumit;
        const summaryActualSumit = monthTaskData && monthTaskData.daySummary.actualSumit;
        const summaryShouldSumit = monthTaskData && monthTaskData.daySummary.shouldSumit;
        return (
            <View style={styles.homeworkContainer}>
                <View style={styles.titleContainerWeek}>
                    <View style={styles.titleContainerWeekSub}>
                        <View style={styles.headRedView} />
                        <Text style={styles.headItemText}>
                            本月任务提交情况
                        </Text>
                    </View>
                </View>
                <View style={styles.separator} />
                <View style={styles.studyDetailContainer}>
                    <View style={styles.panelContainer}>
                        <View style={styles.timeContainer}>
                            <Text style={styles.countStyle}>
                                {monthActualSumit || '0'}
                            </Text>
                            <Text style={styles.totalStyle}>
                                {'/' + (monthShouldSumit || '0')}
                            </Text>
                        </View>
                        <Text style={[styles.countText, { color: '#60A4F5' }]}>工作目标</Text>
                    </View>
                    <View style={styles.vline} />
                    <View style={styles.panelContainer}>
                        <View style={styles.timeContainer}>
                            <Text style={styles.countStyle}>
                                {dayActualSumit || '0'}
                            </Text>
                            <Text style={styles.totalStyle}>
                                {'/' + (dayShouldSumit || '0')}
                            </Text>
                        </View>
                        <Text style={[styles.countText, { color: '#A2D66C' }]}>工作计划</Text>
                    </View>
                    <View style={styles.vline} />
                    <View style={styles.panelContainer}>
                        <View style={styles.timeContainer}>
                            <Text style={styles.countStyle}>
                                {summaryActualSumit || '0'}
                            </Text>
                            <Text style={styles.totalStyle}>
                                {'/' + (summaryShouldSumit || '0')}
                            </Text>
                        </View>
                        <Text style={[styles.countText, { color: '#FED057' }]}>工作总结</Text>
                    </View>
                </View>
            </View>
        );
    },
    onLayoutSummary (e) {
        const { height } = e.nativeEvent.layout;
        this.viewSummaryHeight = e.nativeEvent.layout.y - height;
    },
    // 学习情况
    employeeStudy () {
        const { studyDetailData } = this.state;
        return (
            <View onLayout={this.onLayoutSummary} style={styles.homeworkContainer}>
                <View style={styles.titleContainerWeek}>
                    <View style={styles.titleContainerWeekSub}>
                        <View style={styles.headRedView} />
                        <Text style={styles.headItemText}>
                            学习情况
                        </Text>
                    </View>
                </View>
                <View style={styles.separator} />
                {
                    studyDetailData && this.state.haveData &&
                    <EmployeeStudyTable avgCoursesNumber={studyDetailData.avgCoursesNumber} monthAvgCoursesNumber={studyDetailData.monthAvgCoursesNumber} studyWhenLong={studyDetailData.studyWhenLong} monthStudyWhenLong={studyDetailData.monthStudyWhenLong} isPerson />
                }
            </View>
        );
    },
    // 随堂测试成绩
    classTestResults () {
        const { studyDetailData } = this.state;
        const sections = [];
        const radios = [];
        const numbers = [];
        if (studyDetailData) {
            const quizzesSuccess = studyDetailData.quizzesSuccess;
            for (let i in quizzesSuccess) {
                sections.push(quizzesSuccess[i].title + '(' + quizzesSuccess[i].sectionMax + '~' + quizzesSuccess[i].sectionMin + ')');
                radios.push(quizzesSuccess[i].proportion + '%');
                numbers.push(quizzesSuccess[i].number);
            }
        }
        return (
            <View style={styles.homeworkContainer}>
                <View style={styles.titleContainerWeek}>
                    <View style={styles.titleContainerWeekSub}>
                        <View style={styles.headRedView} />
                        <Text style={styles.headItemText}>
                            随堂测试成绩
                        </Text>
                    </View>
                </View>
                <View style={styles.separator} />
                {
                    this.state.haveData &&
                    <PieChart showUnitText={'次'} sections={sections} radios={radios} numbers={numbers} />
                }
                <View style={styles.separator} />
                <TouchableOpacity onPress={this.goClassTestSpecopsListPage} style={styles.seeDetail}>
                    <Text style={styles.detailText}>
                        查看详情
                    </Text>
                </TouchableOpacity>
            </View>
        );
    },
    // 课后作业
    homeworkList () {
        return (
            <View style={styles.homeworkContainer}>
                <View style={styles.titleContainerWeek}>
                    <View style={styles.titleContainerWeekSub}>
                        <View style={styles.headRedView} />
                        <Text style={styles.headItemText}>
                            课后作业
                        </Text>
                    </View>
                    <TouchableOpacity onPress={this.goHomeworkPersonalPage}>
                        <Text style={styles.seeMoreText}>
                            查看更多
                        </Text>
                    </TouchableOpacity>
                </View>
                <HomeworkPersonal showAll={false} userID={this.props.userID} />
            </View>
        );
    },
    // 本月详细工作计划
    monthPlanContent () {
        const { tabIndex } = this.state;
        const menuAdminArray1 = ['第一周', '第二周', '第三周', '第四周'];
        const menuAdminArray2 = ['第一周', '第二周', '第三周', '第四周', '第五周'];
        let menuAdminArray = [];
        if (this.state.weekCount > 4) {
            menuAdminArray = menuAdminArray2;
        } else {
            menuAdminArray = menuAdminArray1;
        }

        let monthStr = '';
        if (this.state.isNextMonth) {
            monthStr = moment(this.state.memWeekTime[0]).add(1, 'M').format('YYYY年M月');
        } else {
            monthStr = moment(this.state.memWeekTime[0]).format('YYYY年M月');
        }

        return (
            <View style={styles.monthPlanInfoViewStyle}>
                <View style={styles.tabContainer}>
                    {
                        menuAdminArray.map((item, i) => {
                            const time1 = moment(this.state.memWeekTime[i]);
                            const time2 = moment(this.state.memWeekTime[i]).add(6, 'd');
                            let strTime = '';

                            if (this.state.memWeekTime[i] != undefined) {
                                strTime = time1.format('MM.DD') + '-' + time2.format('MM.DD');
                            }

                            const isCurrentWeek = this.isSameWeekWithCurrentTime(this.state.memWeekTime[i]);

                            if (this.state.tabIndex === i) {
                                return (
                                    <TouchableOpacity
                                        key={i}
                                        onPress={this.changeTab.bind(null, i)}
                                        style={styles.tabButton}>
                                        <Image
                                            resizeMode='stretch'
                                            source={app.img.specops_weekBackImg}
                                            style={[styles.weekImageStyle, { width: sr.w / menuAdminArray.length }]}>
                                            <View style={styles.tabButtonItem}>
                                                <Text style={[styles.tabText, { color:'white' }]} >
                                                    {isCurrentWeek ? '本周' : item}
                                                </Text>
                                                <Text style={[styles.tabText2, { color:'white' }]} >
                                                    {strTime}
                                                </Text>
                                            </View>
                                        </Image>
                                    </TouchableOpacity>
                                );
                            } else {
                                return (
                                    <TouchableOpacity
                                        key={i}
                                        onPress={this.changeTab.bind(null, i)}
                                        style={styles.tabButton}>
                                        <View style={styles.tabButtonItemView}>
                                            <View style={styles.tabButtonItem}>
                                                <Text style={styles.tabText} >
                                                    {isCurrentWeek ? '本周' : item}
                                                </Text>
                                                <Text style={styles.tabText2} >
                                                    {strTime}
                                                </Text>
                                            </View>
                                        </View>
                                        {(i !== menuAdminArray.length - 1 && this.state.tabIndex - 1 !== i) &&
                                            <Image resizeMode='stretch' source={app.img.specops_grey_line} style={styles.vline} />}
                                    </TouchableOpacity>
                                );
                            }
                        })
                    }
                </View>
                <ListView
                    style={styles.list}
                    enableEmptySections
                    dataSource={this.state.weekDataSource}
                    renderRow={this.renderRowWeek}
                    renderSeparator={this.renderSeparator}
                    />
            </View>
        );
    },
    _measureLineHeight (e) {
        if (!this.state.lineheight) {
            const { height } = e.nativeEvent.layout;
            if (height > 90) {
                this.setState({ isShowBtn: true });
            }
            this.setState({ lineHeight: height + 26 });
        }
    },
    // 今日计划
    todayPlanPurpose () {
        const { isLookAll, isShowBtn, lineHeight, actualWorks, dayPlan, daySummary } = this.state;
        return (
            <View style={styles.monthPlanPurposeViewStyle}>
                <View style={styles.titleContainerWeek}>
                    <View style={styles.titleContainerWeekSub}>
                        <View style={styles.headRedView} />
                        <Text style={styles.headItemText}>
                            今日计划
                        </Text>
                    </View>
                    <TouchableOpacity onPress={this.goWeekListPage}>
                        <Text style={styles.seeMoreText}>
                            查看更多
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.separator} />
                <View style={styles.monthPlanInfoViewStyle}>
                    <View style={styles.titleContainerWeekSub2}>
                        <Text style={styles.planItemText}>
                            计划工作项
                        </Text>
                    </View>
                    <View style={styles.separatorLine} />
                    <ListView
                        style={styles.list}
                        enableEmptySections
                        dataSource={this.ds.cloneWithRows(dayPlan)}
                        renderRow={this.renderRowDay}
                        renderSeparator={this.renderSeparator}
                        />
                </View>
                <View style={styles.monthPlanInfoViewStyle}>
                    <View style={styles.titleContainerWeekSub2}>
                        <Text style={styles.planItemText}>
                            实际工作项
                        </Text>
                    </View>
                    <View style={styles.separatorLine} />
                    <ListView
                        style={styles.list}
                        enableEmptySections
                        dataSource={this.ds.cloneWithRows(actualWorks)}
                        renderRow={this.renderRowDayCommplete}
                        renderSeparator={this.renderSeparator}
                            />
                </View>
                <View style={styles.monthPlanInfoViewStyle}>
                    <View style={styles.titleContainerWeekSub2}>
                        <Text style={styles.planItemText}>
                            工作总结
                        </Text>
                    </View>
                    <View style={[styles.separator, { marginLeft: 18, width: sr.w - 18 }]} />
                    <View style={[styles.synopsisStyle, { height: lineHeight }]}>
                        <Text onLayout={this._measureLineHeight} numberOfLines={isLookAll ? 200 : isShowBtn ? 4 : 10} style={styles.conclusionText}>
                            {daySummary && daySummary.content}
                        </Text>
                        {
                            !isLookAll && isShowBtn &&
                            <Image resizeMode='stretch' source={app.img.specops_mask} style={[styles.maskImage, { height: (this.state.lineHeight) / 2 }]} />
                        }
                        {
                            isShowBtn &&
                            <TouchableOpacity onPress={this.doLookAll} style={styles.lookAllStyle}>
                                <Text style={styles.lookAllText}>{isLookAll ? '点击收起' : '点击展开更多'}</Text>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    lineDivision: {
        width: sr.w,
        backgroundColor: '#F1F1F1',
    },
    monthPlanPurposeViewStyle: {
        width: sr.w,
        flexDirection: 'column',
    },
    titleContainerWeek: {
        alignItems: 'center',
        height: 44,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
    },
    titleContainerWeekSub: {
        alignItems: 'center',
        height: 44,
        flexDirection: 'row',
    },
    headRedView: {
        width: 4,
        height: 18,
        marginLeft: 18,
        backgroundColor: '#FF3F3F',
    },
    headItemText: {
        marginLeft: 10,
        fontSize: 18,
        color: '#333333',
        fontWeight: '600',
        fontFamily:'STHeitiSC-Medium',
    },
    planItemText: {
        marginLeft: 33,
        fontSize: 16,
        color: '#333333',
        fontFamily:'STHeitiSC-Medium',
    },
    seeMoreText: {
        fontSize: 14,
        color: '#7E7E7E',
        fontFamily: 'STHeitiSC-Medium',
        marginRight: 14,
    },
    separator: {
        width: sr.w,
        height: 1,
        backgroundColor: '#F1F0F5',
        alignSelf: 'center',
    },
    separatorLine: {
        width: sr.w - 44,
        height: 1,
        backgroundColor: '#F1F0F5',
        marginLeft: 34,
    },
    list: {
        alignSelf:'stretch',
    },
    monthPlanInfoViewStyle: {
        flexDirection: 'column',
    },
    tabContainer: {
        width:sr.w,
        height: 56,
        flexDirection: 'row',
        // backgroundColor: '#F4F4F4',
        justifyContent: 'space-between',
    },
    tabButton: {
        flex: 1,
        justifyContent:'center',
        flexDirection: 'row',
        height: 56,
    },
    tabButtonItemView: {
        flex: 1,
        justifyContent:'center',
        backgroundColor: '#F5F5F5',
        height: 48,
    },
    tabButtonItem: {
        alignItems:'center',
        justifyContent:'center',
    },
    weekImageStyle: {
        height: 56,
        paddingTop: 5,
    },
    tabText: {
        fontSize: 16,
        color: '#6E6E6E',
        fontFamily: 'STHeitiSC-Medium',
        backgroundColor: 'transparent',
    },
    tabText2: {
        fontSize: 10,
        color: '#6E6E6E',
        fontFamily: 'STHeitiSC-Medium',
        backgroundColor: 'transparent',
    },
    titleContainerWeekSub2: {
        alignItems: 'center',
        height: 44,
        flexDirection: 'row',
    },
    conclusionText: {
        fontSize: 16,
        color: '#333333',
        fontFamily:'STHeitiSC-Medium',
    },
    synopsisStyle: {
        width: sr.w - 30,
        marginTop: 12,
        marginBottom: 8,
        marginHorizontal: 15,
    },
    synopsisText: {
        width: sr.w - 48,
        marginLeft: 24,
        fontSize: 16,
        color: '#151515',
        fontFamily: 'STHeitiSC-Medium',
    },
    maskImage: {
        width: sr.w,
        bottom: 20,
        left: 0,
        position: 'absolute',
    },
    lookAllStyle: {
        width: 100,
        height: 20,
        bottom: 0,
        left: (sr.w - 30) / 2 - 50,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    lookAllText: {
        fontSize: 14,
        color: '#45B0F7',
        fontFamily: 'STHeitiSC-Medium',
    },
    iconStyle: {
        width: 11,
        height: 11,
        marginLeft: 6,
    },
    homeworkContainer: {
        flexDirection: 'column',
    },
    seeDetail: {
        width: sr.w,
        height: 39,
        alignItems: 'center',
        justifyContent: 'center',
    },
    detailText: {
        fontSize: 14,
        color: '#404040',
        fontFamily: 'STHeitiSC-Medium',
    },
    panelContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    timeContainer: {
        height: 24,
        flexDirection: 'row',
        marginBottom: 10,
    },
    countStyle: {
        fontSize: 18,
        fontFamily: 'STHeitiSC-Medium',
    },
    totalStyle: {
        fontSize: 14,
        color: '#999999',
        alignSelf: 'flex-end',
        fontFamily: 'STHeitiSC-Medium',
    },
    countText: {
        color: '#2A2A2A',
        fontSize: 12,
        fontFamily: 'STHeitiSC-Medium',
    },
    vline: {
        width: 1,
        height: 34,
        backgroundColor: '#EEEEEE',
    },
    personContainer: {
        width: sr.w - 6,
        alignSelf: 'center',
        borderRadius: 6,
        backgroundColor: '#FFFFFF',
    },
    personalInfoContainer: {
        height: 82,
        flexDirection: 'row',
    },
    headerIcon: {
        width: 54,
        height: 54,
        marginLeft: 18,
        marginTop: 15,
        borderRadius: 27,
    },
    personalInfoStyle: {
        marginLeft: 31,
        justifyContent: 'center',
        flexDirection: 'column',
    },
    nameContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 10,
    },
    nameText: {
        fontSize: 18,
        color: '#2A2A2A',
        fontFamily: 'STHeitiSC-Medium',
    },
    aliasText: {
        fontSize: 12,
        color: '#2A2A2A',
        fontFamily: 'STHeitiSC-Medium',
    },
    verticalLine: {
        width: 1,
        height: 12,
        marginLeft: 21,
        marginRight: 12,
        backgroundColor: '#D4D4D4',
    },
    companyText: {
        fontSize: 12,
        color: '#999999',
        fontFamily: 'STHeitiSC-Medium',
    },
    divisionLine: {
        width: sr.w - 24,
        height: 1,
        alignSelf: 'center',
        backgroundColor: '#F8F8F8',
    },
    studyDetailContainer: {
        height: 62,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    timeStyle: {
        fontSize: 18,
        fontFamily: 'STHeitiSC-Medium',
    },
    timeText: {
        color: '#2A2A2A',
        fontSize: 12,
        fontFamily: 'STHeitiSC-Medium',
    },
});
