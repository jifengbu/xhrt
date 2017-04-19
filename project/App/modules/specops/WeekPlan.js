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
    InteractionManager,
} = ReactNative;

const RecordItemView = require('./RecordItemView.js');
const moment = require('moment');
const WeekList = require('./WeekList.js');
const MonthPlan = require('./MonthPlan.js');
const TimerMixin = require('react-timer-mixin');
const CopyBox = require('../home/CopyBox.js');
const InputTextMgr = require('../../manager/InputTextMgr.js');
const UmengMgr = require('../../manager/UmengMgr.js');
const Umeng = require('../../native/index.js').Umeng;

const { Button, InputBox, ShareSheet } = COMPONENTS;

module.exports = React.createClass({
    mixins: [TimerMixin, SceneMixin],
    statics: {
        title: '本周工作任务',
        leftButton: { handler: () => app.scene.goBack() },
        rightButton: { image: app.img.specops_history_record, leftImage: app.img.home_share, handler: () => {
            app.navigator.push({
                title: '每日工作记录',
                component: WeekList,
            });
        }, leftHandler: () => { app.scene.doShowActionSheet(); } },
    },
    onStartShouldSetResponderCapture (evt) {
        console.log('----onStartShouldSetResponderCapture', evt.nativeEvent.pageX, evt.nativeEvent.pageY);
        app.touchPosition.x = evt.nativeEvent.pageX;
        app.touchPosition.y = evt.nativeEvent.pageY;
        return false;
    },
    onLongPress (str) {
        if (str != '' && str.length > 0) {
            // 显示复制按钮
            app.showModal(
                <CopyBox copyY={app.touchPosition.y}
                    copyX={app.touchPosition.x}
                    copyString={str} />,
                        { backgroundColor: 'transparent' }
            );
        }
    },
    doShowActionSheet () {
        this.setState({ actionSheetVisible:true });
    },
    doCloseActionSheet () {
        this.setState({ actionSheetVisible:false });
    },
    doShareWeChat () {
        this.doShare(0);
    },
    doShareTimeline () {
        this.doShare(1);
    },
    doShareQQ () {
        this.doShare(2);
    },
    doShare (index) {
        const { userID, name, post } = app.personal.info;
        const title = '[' + (post === '' || post == null ? name : (post + '-' + name)) + ']' + moment(this.state.memDayTime[this.currentTabIndex]).format('YYYY年MM月DD日') + '工作任务';
        var userName = encodeURI(name);
        const describe = '让我们共同学习赢销秘诀！为企业插上腾飞的翅膀!';
        let platform;
        switch (index) {
            case 0:
                platform = Umeng.platforms.UMShareToWechatSession;
                break;
            case 1:
                platform = Umeng.platforms.UMShareToWechatTimeline;
                break;
            case 2:
                platform = Umeng.platforms.UMShareToQQ;
                break;
            default:
                Toast('未知分享');
                return;
        }
        UmengMgr.doSingleShare(platform, CONSTANTS.SHARE_SHAREDIR_SERVER + 'shareWork.html?userID=' + userID + '&date=' + this.state.memDayTime[this.currentTabIndex] + '&userName=' + userName, title, describe || '工作任务', 'web', CONSTANTS.SHARE_IMGDIR_SERVER + 'logo.png', this.doShareCallback);
    },
    doShareCallback () {
        this.doCloseActionSheet();
    },
    goBack () {
        if (this.props.refreshTask) {
            this.props.refreshTask();
        }
        app.navigator.pop();
    },
    getInitialState () {
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return {
            tabIndex: 0,
            currentWeekID:'',
            currentDayID:'',
            currentActuallyID:'',
            currentProblemID:'',
            monthDataSource: this.ds.cloneWithRows([]),
            weekDataSource: this.ds.cloneWithRows([]),
            dayDataSource: this.ds.cloneWithRows([]),
            inputBoxText: '',
            haveCannel: false,
            memDayTime: [],
            memWeekTime: [],
            isNextWeek: this.props.isNextWeek,
            isDaySummaryModify:true,
            isDayPlanModify:true,
            isActualModify: true,
            isProblemModify: true,
            isProblemAdd: true,
            daySummary: '',
            actually:[],
            problemArray:[],
            showAddDayPlanDlg: false,
            actionSheetVisible: false,
        };
    },
    getDayPlan (index) {
        return this.weekData.dayPlan[index];
    },
    getDayActually (index) {
        return this.weekData.actually[index];
    },
    getDaySummaryObj (index) {
        return this.weekData.daySummary[index];
    },
    setDayActually () {
        this.weekData.actually[this.state.tabIndex] = this.state.actually.slice();
    },
    setDaySummaryObj () {
        this.weekData.daySummary[this.state.tabIndex].content = this.state.daySummary;
    },
    clearWeekData () {
        this.weekData.monthPlan = [];
        this.weekData.weekPlan = [];
        this.weekData.dayPlan = [];
        this.weekData.actually = [];
        this.weekData.daySummary = [];
        for (let i = 0; i < 7; i++) {
            this.weekData.dayPlan[i] = [];
            this.weekData.actually[i] = [];
            this.weekData.daySummary[i] = {};
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
    processDayPlan (obj) {
        if (obj.isOver == 1) {
            return;
        }
        const tWeek = Number(obj.week);
        if (tWeek === 0) {
            this.weekData.dayPlan[6].push(obj);
        } else {
            this.weekData.dayPlan[tWeek - 1].push(obj);
        }
    },
    processDayActually (obj) {
        const tWeek = Number(obj.week);
        if (tWeek === 0) {
            this.weekData.actually[6].push(obj);
        } else {
            this.weekData.actually[tWeek - 1].push(obj);
        }
    },
    processDaySummary (obj) {
        const tWeek = Number(obj.week);
        if (tWeek === 0) {
            this.weekData.daySummary[6] = obj;
        } else {
            this.weekData.daySummary[tWeek - 1] = obj;
        }
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
            } else {
                return moment().year();
            }
        }
    },
    getCurrentTimeWeekSeq () {
        const curWeekNum = this.getWeekNum(moment().format('YYYY-MM-DD'));
        for (let i = 0; i < this.state.memWeekTime.length; i++) {
            const weekNum = this.getWeekNum(this.state.memWeekTime[i]);
            if (curWeekNum == weekNum) {
                return (i + 1);
            }
        }
        return 0;
    },
    getWorkTask () {
        const param = {
            userID:app.personal.info.userID,
            date:moment().format('YYYY-MM-DD'),
        };
        POST(app.route.ROUTE_SHARE_WORK_TASK, param, this.getWorkTaskSuccess, true);
    },
    getWorkTaskSuccess (data) {
        if (data.success) {
            this.clearWeekData();
            // monthPlan
            const monthPlan = data.context.monthPlan || [];
            this.weekData.monthPlan = [];
            for (let i = 0; i < monthPlan.length; i++) {
                this.weekData.monthPlan.push(monthPlan[i]);
            }
            this.setState({ monthDataSource: this.ds.cloneWithRows(this.weekData.monthPlan) });

            // weekPlan
            const weekPlan = data.context.weekPlan || [];
            for (let i = 0; i < weekPlan.length; i++) {
                this.weekData.weekPlan.push(weekPlan[i]);
            }
            this.setState({ weekDataSource: this.ds.cloneWithRows(this.weekData.weekPlan) });

            // process day plan..
            const dayPlan = data.context.dayPlan || [];
            for (let i = 0; i < dayPlan.length; i++) {
                this.processDayPlan(dayPlan[i]);
            }
            // actually
            const actualWorks = data.context.actualWorks || [];
            for (let i = 0; i < actualWorks.length; i++) {
                this.processDayActually(actualWorks[i]);
            }
            // daySummary
            const daySummary = data.context.daySummary || [];
            for (let i = 0; i < daySummary.length; i++) {
                this.processDaySummary(daySummary[i]);
            }

            if (this.currentIndex && this.currentIndex !== -1) {
                this.changeTab(this.currentIndex);
                this.currentIndex = -1;
            } else if (this.currentIndex == 0) {
                this.changeTab(this.currentIndex);
                this.currentIndex = -1;
            } else {
                this.changeTab(this.getCurrentDayIndex());
            }
        } else {
            Toast(data.msg);
        }
    },
    getDaySummary (index) {
        // const dayPlan = this.weekData.dayPlan[index];
        // this.setState({daySummary:''});
        //
        // // get actually
        // this.getActually(index);
        //
        // const param = {
        //     userID:app.personal.info.userID,
        //     planDate:this.state.memDayTime[index],
        // };
        // POST(app.route.ROUTE_GET_DAY_SUMMARY, param, this.getDaySummarySuccess, true);

        // get problem
        this.getFixedProblem(index);
        this.currentTabIndex = index;
        // can modify.
        this.setState({ isDaySummaryModify:!moment(this.state.memDayTime[index]).isBefore(moment().format('YYYY-MM-DD')) });
        this.setState({ isActualModify:!moment(this.state.memDayTime[index]).isAfter(moment().format('YYYY-MM-DD')) });
        this.setState({ isDayPlanModify:!moment(this.state.memDayTime[index]).isAfter(moment().format('YYYY-MM-DD')) });
        this.setState({ isProblemModify:!moment(this.state.memDayTime[index]).isBefore(moment().format('YYYY-MM-DD')) });
        this.setState({ isProblemAdd:moment(this.state.memDayTime[index]).isSame(moment().format('YYYY-MM-DD')) });
    },
    getDaySummarySuccess (data) {
        if (data.success) {
            this.setState({ daySummary:data.context ? data.context.content : '' });
        } else {
            Toast(data.msg);
        }
    },
    getFixedProblem (index) {
        const param = {
            userID: app.personal.info.userID,
            date:this.state.memDayTime[index],
        };
        POST(app.route.ROUTE_GET_FIXED_PROBLEM, param, this.getFixedProblemSuccess);
    },
    getFixedProblemSuccess (data) {
        if (data.success) {
            const { fixedProblem, myQuestionList } = data.context;
            this.state.problemArray = [];
            const tempArray = [];
            for (let i = 0; i < fixedProblem.length; i++) {
                const problemItem = {};
                problemItem.index = i + 1;
                problemItem.problemId = fixedProblem[i].problemId;
                problemItem.problemTitle = fixedProblem[i].problemTitle;
                problemItem.problemContent = fixedProblem[i].problemContent ? fixedProblem[i].problemContent : '';
                tempArray.push(problemItem);
            }
            if (myQuestionList) {
                for (let j = 0; j < myQuestionList.length; j++) {
                    const problemItem = {};
                    problemItem.index = j + fixedProblem.length + 1;
                    problemItem.problemId = myQuestionList[j].myQuestinoId;
                    problemItem.problemTitle = myQuestionList[j].title ? myQuestionList[j].title : '';
                    problemItem.problemContent = myQuestionList[j].content ? myQuestionList[j].content : '';
                    tempArray.push(problemItem);
                }
            }
            this.setState({ problemArray:tempArray });

            this.goToPos();
        } else {
            Toast(data.msg);
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
    goToPos () {
        // go to pos.
        console.log('----', this.props.indexPos);
        if (this.firstMove == false) {
            this.firstMove = true;
            this.setTimeout(() => {
                InteractionManager.runAfterInteractions(() => {
                    let pos = 0;
                    if (this.props.indexPos === 0) {
                        pos = this.viewPlanHeight;
                    } else if (this.props.indexPos === 1) {
                        pos = this.viewSummaryHeight;
                    } else if (this.props.indexPos === 2) {
                        pos = this.viewProblemHeight;
                    } else {
                        pos = this.viewPlanHeight;
                    }
                    if (this.scrollView) {
                        this.scrollView.scrollTo({ y: pos });
                    } else {
                        console.log('--------need modify with shiyi--------');
                    }
                });
            }, 800);
        }
    },
    onLayoutPlan (e) {
        this.viewPlanHeight = e.nativeEvent.layout.y;
    },
    onLayoutSummary (e) {
        this.viewSummaryHeight = e.nativeEvent.layout.y;
    },
    onLayoutProblem (e) {
        this.viewProblemHeight = e.nativeEvent.layout.y;
    },
    onWillFocus () {
        this.weekData = {};
        this.onInputBoxFun = null;
        this.clearWeekData();
        this.currentMonthNum = this.getCurrentMonth();

        this.processWeekTime(this.currentMonthNum - 1);
        this.processDayTime(moment().format('YYYY-MM-DD'));

        this.currentWeekSeq = this.getCurrentTimeWeekSeq();

        // const param = {
        //     userID:app.personal.info.userID,
        //     planDate:moment().format('YYYY-MM-DD'),
        // };
        // POST(app.route.ROUTE_GET_MONTH_PLAN, param, this.getMonthDataSuccess, true);

        // let tTime = '';
        // if (this.state.isNextWeek) {
        //     tTime = this.state.memDayTime[0];
        // }else {
        //     tTime = moment().format('YYYY-MM-DD');
        // }
        // this.currentTime = tTime;
        // this.timeFunc(tTime);

        this.getWorkTask();
    },
    componentDidMount () {
        this.weekData = {};
        this.onInputBoxFun = null;
        this.clearWeekData();
        this.currentMonthNum = this.getCurrentMonth();

        this.processWeekTime(this.currentMonthNum - 1);
        this.processDayTime(moment().format('YYYY-MM-DD'));

        this.currentWeekSeq = this.getCurrentTimeWeekSeq();

        if (this.props.doWeek) {
            this.currentIndex = parseInt(this.props.doWeek) - 1;
        } else if (parseInt(this.props.doWeek) === 0) {
            this.currentIndex = 6;
        }

        // const param = {
        //     userID:app.personal.info.userID,
        //     planDate:moment().format('YYYY-MM-DD'),
        // };
        // POST(app.route.ROUTE_GET_MONTH_PLAN, param, this.getMonthDataSuccess, true);
        //
        // let tTime = '';
        // if (this.state.isNextWeek) {
        //     tTime = this.state.memDayTime[0];
        // }else {
        //     tTime = moment().format('YYYY-MM-DD');
        // }
        // this.currentTime = tTime;
        // this.timeFunc(tTime);
        this.getWorkTask();

        this.firstMove = false;
    },
    getMonthDataSuccess (data) {
        if (data.success) {
            // process month plan..
            const monthPlan = data.context.monthPlan || [];
            this.weekData.monthPlan = [];
            for (let i = 0; i < monthPlan.length; i++) {
                this.weekData.monthPlan.push(monthPlan[i]);
            }

            this.setState({ monthDataSource: this.ds.cloneWithRows(this.weekData.monthPlan) });
        } else {
            Toast(data.msg);
        }
    },
    getWeekDataSuccess (data) {
        if (data.success) {
            const weekPlan = data.context.weekPlan || [];
            const dayPlan = data.context.dayPlan || [];
            this.clearWeekData();
            // process week plan..
            for (let i = 0; i < weekPlan.length; i++) {
                this.weekData.weekPlan.push(weekPlan[i]);
            }
            // process day plan..
            for (let i = 0; i < dayPlan.length; i++) {
                this.processDayPlan(dayPlan[i]);
            }

            this.setState({ weekDataSource: this.ds.cloneWithRows(this.weekData.weekPlan) });
            // if (this.currentIndex && this.currentIndex !== -1) {
            //     this.changeTab(this.currentIndex);
            //     this.currentIndex = -1;
            // }else {
            //     this.changeTab(this.getCurrentDayIndex());
            // }
        } else {
            Toast(data.msg);
        }
    },
    addDayPlanContent () {
        const textID = 'specops_weekPlan2';
        const textContent = InputTextMgr.getTextContent(textID);
        app.showModal(
            <InputBox
                doConfirm={this.submitDayPlan}
                textID={textID}
                inputText={textContent}
                doCancel={app.closeModal}
                />
        );
    },
    modifyDayPlanContent (obj) {
        // console.log('-----', obj.updateDate);
        if (this.isLastWeekWithCurrentTime(obj.updateDate)) {
            Toast('不能修改上周制定的计划');
            return;
        }
        if (this.state.isDayPlanModify) {
            return;
        }
        this.setState({ currentDayID: obj.id });
        app.showModal(
            <InputBox
                doConfirm={this.modifyDayPlan}
                inputText={obj.content}
                doCancel={app.closeModal}
                haveDelete
                doDelete={this.deleteDayPlan}
                />
        );
    },
    showDayPlanDetail (obj) {
        app.showModal(
            <InputBox
                doConfirm={this.doCancel}
                inputText={obj.content}
                doCancel={app.closeModal}
                />
        );
    },
    doDayFinished (obj) {
        if (!this.state.isDayPlanModify) {
            Toast('不能完成未来的事');
            return;
        }
        if (obj.isOver) {
            return;
        }
        const param = {
            userID:app.personal.info.userID,
            id: obj.id,
            isOver: 1,
        };
        POST(app.route.ROUTE_SET_DAY_PLAN_IS_OVER, param, this.doDayFinishedSuccess, true);
    },
    doDayFinishedSuccess (data) {
        if (data.success) {
            const dayData = this.getDayPlan(this.state.tabIndex);
            const planInfo = _.find(dayData, (item) => item.id == data.context.dayPlan.id);
            if (planInfo) {
                const spliceArr = _.remove(dayData, planInfo);
                this.setState({ dayDataSource: this.ds.cloneWithRows(dayData) });
            }

            // 请求接口成功更新页面
            const { actually } = this.state;
            actually.push({ 'id': data.context.actualWork.id, 'content':data.context.actualWork.content });
            this.setState({ actually });

            this.setDayActually();
        } else {
            Toast(data.msg);
        }
    },
    modifyDayPlan (strContent) {
        if (strContent === '') {
            return;
        }
        const param = {
            userID:app.personal.info.userID,
            id: this.state.currentDayID,
            content: strContent,
        };
        POST(app.route.ROUTE_EDIT_DAY_PLAN, param, this.modifyDayPlanSuccess.bind(null, this.state.currentDayID), true);
    },
    modifyDayPlanSuccess (currentDayID, data) {
        if (data.success) {
            const dayData = this.getDayPlan(this.state.tabIndex);
            const planInfo = _.find(dayData, (item) => item.id == currentDayID);
            if (planInfo) {
                Object.assign(planInfo, data.context);
                this.setState({ dayDataSource: this.ds.cloneWithRows(dayData) });
            }
        } else {
            Toast(data.msg);
        }
    },
    submitDayPlan (content, textID) {
        if (content === '') {
            return;
        }
        // 请求接口成功更新页面
        const param = {
            addContent: content,
            userID:app.personal.info.userID,
            planDate:this.state.memDayTime[this.state.tabIndex],
            weekNum: this.state.tabIndex,
        };
        POST(app.route.ROUTE_ADD_TODAY_PLAN, param, this.submitDayPlanSuccess.bind(null, textID), true);
    },
    submitDayPlanSuccess (textID, data) {
        if (data.success) {
            const dayData = this.getDayPlan(this.state.tabIndex);
            // 请求接口成功更新页面
            dayData.push({ 'id': data.context.dayPlan.id, 'planId':data.context.dayPlan.planId, 'content':data.context.dayPlan.content, isOver: false });
            this.setState({ dayDataSource: this.ds.cloneWithRows(dayData) });

            // 请求接口成功更新页面
            const { actually } = this.state;
            actually.push({ 'id': data.context.actualWork.id, 'content':data.context.actualWork.content, isOver: data.context.actualWork.isOver });
            this.setState({ actually });
            InputTextMgr.removeItem(textID);
            this.setDayActually();
            Toast('新增成功');
        } else {
            Toast(data.msg);
        }
    },
    deleteDayPlan () {
        const param = {
            userID:app.personal.info.userID,
            id: this.state.currentDayID,
        };
        POST(app.route.ROUTE_DELETE_DAY_PLAN, param, this.deleteDayPlanSuccess.bind(null, this.state.currentDayID), true);
    },
    deleteDayPlanSuccess (currentDayID, data) {
        if (data.success) {
            const dayData = this.getDayPlan(this.state.tabIndex);
            const planInfo = _.find(dayData, (item) => item.id == currentDayID);
            if (planInfo) {
                const spliceArr = _.remove(dayData, planInfo);
                this.setState({ dayDataSource: this.ds.cloneWithRows(dayData) });
            }
        } else {
            Toast(data.msg);
        }
    },
    doCancel () {
        this.setState({ showAddDayPlanDlg:false });
    },
    addDayProblemView () {
        const textID = 'specops_weekPlan3';
        const textTitleID = 'specops_weekPlan4';
        const textContent = InputTextMgr.getTextContent(textID);
        const textTitleContent = InputTextMgr.getTextContent(textTitleID);
        app.showModal(
            <InputBox
                doConfirm={this.submitDayProblem}
                textID={textID}
                inputText={textContent}
                doCancel={app.closeModal}
                haveTitle
                textTitleID={textTitleID}
                title={textTitleContent}
                modifyTitle
                />
        );
    },
    modifyDayProblemView (obj) {
        if (!this.state.isProblemModify && obj.problemContent !== '') {
            return;
        }
        this.setState({ currentProblemID: obj.problemId });
        app.showModal(
            <InputBox
                doConfirm={this.modifyDayProblem}
                inputText={obj.problemContent}
                doCancel={app.closeModal}
                haveDelete
                doDelete={this.deleteDayProblem}
                haveTitle
                title={obj.problemTitle}
                index={obj.index}
                modifyTitle={false}
                />
        );
    },
    modifyFixDayProblemView (obj, index) {
        if (!this.state.isProblemModify && obj.problemContent !== '') {
            return;
        }
        const textID = 'specops_weekPlan5' + index;
        const textContent = InputTextMgr.getTextContent(textID);
        this.setState({ currentProblemID: obj.problemId });
        app.showModal(
            <InputBox
                doConfirm={this.modifyFixDayProblem}
                textID={textID}
                inputText={obj.problemContent ? obj.problemContent : textContent}
                doCancel={app.closeModal}
                haveTitle
                title={obj.problemTitle}
                index={obj.index}
                modifyTitle={false}
                />
        );
    },
    submitDayProblem (strTitle, strContent, textID, textTitleID) {
        if (strTitle === '' || strContent === '') {
            return;
        }
        const param = {
            userID: app.personal.info.userID,
            date:this.state.memDayTime[this.state.tabIndex],
            title: strTitle,
            content: strContent,
        };
        POST(app.route.ROUTE_ADD_USER_QUESTION, param, this.submitDayProblemSuccess.bind(null, textID, textTitleID), true);
    },
    submitDayProblemSuccess (textID, textTitleID, data) {
        if (data.success) {
            // 请求接口成功更新页面
            const { problemArray } = this.state;

            const problemItem = {};
            problemItem.index = problemArray.length + 1;
            problemItem.problemId = data.context.myQuestion.id;
            problemItem.problemTitle = data.context.myQuestion.title ? data.context.myQuestion.title : '';
            problemItem.problemContent = data.context.myQuestion.content ? data.context.myQuestion.content : '';

            problemArray.push(problemItem);
            this.setState({ problemArray });
            InputTextMgr.removeItem(textID);
            InputTextMgr.removeItem(textTitleID);
            Toast('新增成功');
        } else {
            Toast(data.msg);
        }
    },
    modifyDayProblem (strTitle, strContent) {
        if (strTitle === '' || strContent === '') {
            return;
        }
        const param = {
            userID: app.personal.info.userID,
            id: this.state.currentProblemID,
            date:this.state.memDayTime[this.state.tabIndex],
            title: strTitle,
            content: strContent,
        };
        POST(app.route.ROUTE_EDIT_USER_QUESTION, param, this.modifyDayProblemSuccess, true);
    },
    modifyDayProblemSuccess (data) {
        if (data.success) {
            const { problemArray } = this.state;
            const item = _.find(problemArray, (o) => o.problemId == this.state.currentProblemID);
            const problemItem = {};
            if (item) {
                problemItem.index = item.index;
                problemItem.problemId = data.context.myQuestion.id;
                problemItem.problemTitle = data.context.myQuestion.title ? data.context.myQuestion.title : '';
                problemItem.problemContent = data.context.myQuestion.content ? data.context.myQuestion.content : '';

                Object.assign(item, problemItem);
                this.setState({ problemArray });
            }
        } else {
            Toast(data.msg);
        }
    },
    modifyFixDayProblem (strTitle, strContent, textID) {
        if (strTitle === '' || strContent === '') {
            return;
        }
        const param = {
            userID: app.personal.info.userID,
            date:this.state.memDayTime[this.state.tabIndex],
            problemId: this.state.currentProblemID,
            problemContent: strContent,
        };
        POST(app.route.ROUTE_ADD_PROBLEM_ANSWER, param, this.modifyFixDayProblemSuccess.bind(null, textID), true);
    },
    modifyFixDayProblemSuccess (textID, data) {
        if (data.success) {
            const { problemArray } = this.state;
            const item = _.find(problemArray, (o) => o.problemId == this.state.currentProblemID);
            const problemItem = {};
            if (item) {
                problemItem.index = item.index;
                problemItem.problemId = data.context.answer.problemId;
                problemItem.problemTitle = item.problemTitle;
                problemItem.problemContent = data.context.answer.content ? data.context.answer.content : '';
                InputTextMgr.removeItem(textID);
                Object.assign(item, problemItem);
                this.setState({ problemArray });
            }
        } else {
            Toast(data.msg);
        }
    },
    deleteDayProblem () {
        const param = {
            userID: app.personal.info.userID,
            id: this.state.currentProblemID,
        };
        POST(app.route.ROUTE_DELETE_USER_QUESTION, param, this.deleteDayProblemSuccess.bind(null, this.state.currentProblemID), true);
    },
    deleteDayProblemSuccess (id, data) {
        if (data.success) {
            const { problemArray } = this.state;
            const planInfo = _.find(problemArray, (item) => item.problemId == id);
            if (planInfo) {
                const spliceArr = _.remove(problemArray, planInfo);
                this.setState({ problemArray });
            }
        } else {
            Toast(data.msg);
        }
    },
    addDayActuallyContent () {
        if (!this.state.isDayPlanModify) {
            Toast('不能填写未来的事');
            return;
        }
        const textID = 'specops_weekPlan1';
        const textContent = InputTextMgr.getTextContent(textID);
        app.showModal(
            <InputBox
                doConfirm={this.submitDayActually}
                textID={textID}
                inputText={textContent}
                doCancel={app.closeModal}
                doClass={this}
                />
        );
    },
    modifyDayActuallyContent (obj) {
        if (!this.state.isDayPlanModify) {
            Toast('不能编辑未来的事');
            return;
        }
        this.setState({ currentActuallyID: obj.id });
        app.showModal(
            <InputBox
                doConfirm={this.doModification}
                inputText={obj.content}
                doCancel={app.closeModal}
                haveDelete
                doDelete={this.doDeleteActually}
                />
        );
    },
    showDayActuallyDetail (obj) {
        app.showModal(
            <InputBox
                doConfirm={this.doCancel}
                inputText={obj.content}
                doCancel={app.closeModal}
                />
        );
    },
    submitDayActually (content, textID) {
        if (content === '') {
            return;
        }
        const param = {
            userID: app.personal.info.userID,
            workDate: this.state.memDayTime[this.state.tabIndex],
            content: content,
        };
        POST(app.route.ROUTE_ADD_ACTUAL_COMPLETE_WORK, param, this.submitDayActuallySuccess.bind(null, textID), true);
    },
    submitDayActuallySuccess (textID, data) {
        if (data.success) {
            // 请求接口成功更新页面
            const { actually } = this.state;
            actually.push({ 'id': data.context.actualWork.id, 'content':data.context.actualWork.content, isOver: data.context.actualWork.isOver });
            this.setState({ actually });
            InputTextMgr.removeItem(textID);
            this.setDayActually();

            Toast('新增成功');
        } else {
            Toast(data.msg);
        }
    },
    // 修改实际完成的事
    doModification (text) {
        if (text === '') {
            return;
        }
        const { currentActuallyID } = this.state;
        const param = {
            userID: app.personal.info.userID,
            id: currentActuallyID,
            content: text,
        };
        POST(app.route.ROUTE_EDIT_ACTUAL_COMPLETE_WORK, param, this.ModificationSuccess.bind(null, currentActuallyID), true);
    },
    ModificationSuccess (id, data) {
        if (data.success) {
            const { actually } = this.state;
            const item = _.find(actually, (o) => o.id == id);
            if (item) {
                Object.assign(item, data.context.actualWork);
                this.setState({ actually });

                this.setDayActually();
            }
        } else {
            Toast(data.msg);
        }
    },
    // 标记完成实际完成的事
    doActuallyComplete (currentActuallyID) {
        if (!this.state.isDayPlanModify) {
            Toast('不能完成未来的事');
            return;
        }
        const param = {
            userID: app.personal.info.userID,
            id: currentActuallyID,
        };
        POST(app.route.ROUTE_FINISH_ACTUAL_COMPLETE_WORK, param, this.doActuallyCompleteSuccess.bind(null, currentActuallyID), true);
    },
    doActuallyCompleteSuccess (id, data) {
        if (data.success) {
            const { actually } = this.state;
            const planInfo = _.find(actually, (item) => item.id == id);
            if (planInfo) {
                console.log(id);
                planInfo.isOver = 1;
                this.setState({ actually });
                this.setDayActually();
            }
        } else {
            Toast(data.msg);
        }
    },
    // 删除实际完成的事
    doDeleteActually () {
        const { currentActuallyID } = this.state;
        const param = {
            userID: app.personal.info.userID,
            id: currentActuallyID,
        };
        POST(app.route.ROUTE_DEL_ACTUAL_COMPLETE_WORK, param, this.doDeleteActuallySuccess.bind(null, currentActuallyID), true);
    },
    doDeleteActuallySuccess (id, data) {
        if (data.success) {
            const { actually } = this.state;
            const planInfo = _.find(actually, (item) => item.id == id);
            if (planInfo) {
                const spliceArr = _.remove(actually, planInfo);
                this.setState({ actually });
                this.setDayActually();
            }
        } else {
            Toast(data.msg);
        }
    },
    editDaySummary () {
        if (!this.state.isDayPlanModify) {
            Toast('不能填写未来的工作总结');
            return;
        }
        if (!this.state.isDaySummaryModify && this.state.daySummary !== '') {
            return;
        }
        const textID = 'specops_weekPlan6';
        const textContent = InputTextMgr.getTextContent(textID);
        const { daySummary } = this.state;
        app.showModal(
            <InputBox
                doConfirm={this.saveDaySummary}
                textID={textID}
                inputText={daySummary || textContent}
                doCancel={app.closeModal}
                />
        );
    },
    saveDaySummary (strContext, textID) {
        if (strContext === '') {
            return;
        }
        const param = {
            userID:app.personal.info.userID,
            context:strContext,
            planDate:this.state.memDayTime[this.state.tabIndex],
        };
        POST(app.route.ROUTE_SUBMIT_DAY_SUMMARY, param, this.submitDaySummarySuccess.bind(null, strContext, textID), true);
    },
    submitDaySummarySuccess (strContext, textID, data) {
        Toast('保存日总结成功');
        InputTextMgr.removeItem(textID);
        this.setState({ daySummary:strContext });
        this.setDaySummaryObj();
    },
    // 获取实际做的事
    getActually (index) {
        const param = {
            userID: app.personal.info.userID,
            workDate:this.state.memDayTime[index],
        };
        POST(app.route.ROUTE_GET_ACTUAL_COMPLETE_WORK, param, this.getActuallySuccess, true);
    },
    getActuallySuccess (data) {
        if (data.success) {
            const actualWorks = data.context.actualWorks || [];
            this.setState({ actually:actualWorks.slice() });
        } else {
            Toast(data.msg);
        }
    },
    addFixedProblemAnswer () {
        const param = {
            userID: app.personal.info.userID,
            answerList:this.state.problemArray,
        };
        POST(app.route.ROUTE_ADD_FIXED_PROBLEM_ANSWER, param, this.addFixedProblemAnswerSuccess, true);
    },
    addFixedProblemAnswerSuccess (data) {
        Toast(data.msg);
    },
    changeTab (tabIndex) {
        this.setState({ tabIndex });

        const dayData = this.getDayPlan(tabIndex);
        this.setState({ dayDataSource: this.ds.cloneWithRows(dayData) });

        this.setState({ actually:this.getDayActually(tabIndex).slice() });
        let content = this.getDaySummaryObj(tabIndex).content;
        if (!content) {
            content = '';
        }
        this.setState({ daySummary:content });

        this.getDaySummary(tabIndex);
    },
    timeFunc (time) {
        const param = {
            userID:app.personal.info.userID,
            planDate:time,
        };
        POST(app.route.ROUTE_GET_WEEK_PLAN, param, this.getWeekDataSuccess, true);
    },
    onBeforeWeek () {
        this.currentTime = moment(this.currentTime).subtract(7, 'days').format('YYYY-MM-DD');
        this.processDayTime(this.currentTime);
        this.timeFunc(this.currentTime);
    },
    onAfterWeek () {
        this.currentTime = moment(this.currentTime).add(7, 'days').format('YYYY-MM-DD');
        this.processDayTime(this.currentTime);
        this.timeFunc(this.currentTime);
    },
    goToMonthPlan () {
        app.navigator.push({
            component: MonthPlan,
        });
    },
    renderSeparator (sectionID, rowID) {
        return (
            <View style={styles.separator3} key={rowID} />
        );
    },
    renderRowWeek (obj, sectionID, rowID) {
        return (
            <RecordItemView
                rowHeight={10}
                data={obj}
                />
        );
    },
    renderRowDay (obj) {
        return (
            <RecordItemView
                data={obj}
                rowHeight={10}
                onPress={this.modifyDayPlanContent.bind(null, obj)}
                />
        );
    },
    renderRowDayCommplete (obj) {
        return (
            <RecordItemView
                data={obj}
                rowHeight={10}
                onPress={this.modifyDayActuallyContent.bind(null, obj)}
                haveImage
                doComplete={this.doActuallyComplete.bind(null, obj.id)}
                />
        );
    },
    render () {
        return (
            <View style={styles.container}
                onStartShouldSetResponderCapture={this.onStartShouldSetResponderCapture}>
                <View style={styles.line} />
                <ScrollView
                    ref={(scrollView) => { this.scrollView = scrollView; }}>
                    <this.monthPlanPurpose />
                    <this.weekPlanPurpose />
                    <this.weekPlanContent />
                    <this.weekPlanConclusion />
                    <this.weekProblemView />
                </ScrollView>
                <ShareSheet
                    visible={this.state.actionSheetVisible}
                    onCancel={this.doCloseActionSheet} >
                    <ShareSheet.Button image={app.img.specops_wechat} onPress={this.doShareWeChat}>微信好友</ShareSheet.Button>
                    <ShareSheet.Button image={app.img.specops_friend_circle} onPress={this.doShareTimeline}>朋友圈</ShareSheet.Button>
                    <ShareSheet.Button image={app.img.specops_qq} onPress={this.doShareQQ}>QQ</ShareSheet.Button>
                </ShareSheet>
            </View>
        );
    },
    // 本月工作计划
    monthPlanPurpose () {
        const monthStr = moment(this.state.memDayTime[0]).format('M月');

        return (
            <View>
                <View style={styles.separator2} />
                <TouchableOpacity style={styles.titleContainerWeek}
                    onPress={this.goToMonthPlan}>
                    <View style={styles.titleContainerWeekSub}>
                        <View style={styles.headRedView} />
                        <Text style={styles.headItemText}>
                                月工作目标
                            </Text>
                        <Text style={styles.headItemText2}>
                            {monthStr}
                        </Text>
                    </View>
                    <Image
                        resizeMode='stretch'
                        source={app.img.specops_go_white}
                        style={styles.headItemImg} />
                </TouchableOpacity>
                <View style={styles.separator} />
                <ListView
                    style={styles.list}
                    dataSource={this.state.monthDataSource}
                    renderRow={this.renderRowWeek}
                    enableEmptySections
                    renderSeparator={this.renderSeparator}
                        />
            </View>
        );
    },
    // 本周工作计划
    weekPlanPurpose () {
        let strTime = '';
        if (this.state.memDayTime.length > 0) {
            const time1 = moment(this.state.memDayTime[0]);
            const time2 = moment(this.state.memDayTime[0]).add(6, 'd');

            if (this.state.memDayTime[0] != undefined) {
                strTime = time1.format('MM.DD') + '-' + time2.format('MM.DD');
            }
        }
        return (
            <View style={styles.weekPlanPurposeViewStyle}>
                <View style={styles.separator2} />
                <TouchableOpacity style={styles.titleContainerWeek}
                    onPress={this.goToMonthPlan}>
                    <View style={styles.titleContainerWeekSub}>
                        <View style={styles.headRedView} />
                        <Text style={styles.headItemText}>
                            周工作目标
                        </Text>
                        <Text style={styles.headItemText2}>
                            {'第' + this.currentWeekSeq + '周' + '  ' + '（' + strTime + '）'}
                        </Text>
                    </View>
                    <Image
                        resizeMode='stretch'
                        source={app.img.specops_go_white}
                        style={styles.headItemImg} />
                </TouchableOpacity>
                <View style={styles.separator} />

                <ListView
                    style={styles.list}
                    dataSource={this.state.weekDataSource}
                    renderRow={this.renderRowWeek}
                    enableEmptySections
                    renderSeparator={this.renderSeparator}
                    />
                <View style={styles.separator} />
            </View>
        );
    },
    calculateStrLength (oldStr, strCount) {
        let height = 0;
        let linesHeight = 0;
        if (oldStr) {
            oldStr = oldStr.replace(/<\/?.+?>/g, /<\/?.+?>/g, '');
            oldStr = oldStr.replace(/[\r\n]/g, '|');
            const StrArr = oldStr.split('|');
            for (let i = 0; i < StrArr.length; i++) {
                // 计算字符串长度，一个汉字占2个字节
                const newStr = StrArr[i].replace(/[^\x00-\xff]/g, 'aa').length;
                // 计算行数
                if (newStr == 0) {
                    linesHeight = 1;
                } else {
                    linesHeight = Math.ceil(newStr / sr.ws(strCount));
                }
                // 计算高度，每行18
                height += linesHeight * sr.ws(18);
            }
            return height + sr.ws(18);
        } else {
            return 0;
        }
    },
    // 本周详细工作计划
    weekPlanContent () {
        const { tabIndex } = this.state;
        const menuAdminArray = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        return (
            <View style={styles.weekPlanInfoViewStyle}
                onLayout={this.onLayoutPlan}>
                <View style={styles.separator2} />
                <View style={styles.tabContainer}>
                    {
                        menuAdminArray.map((item, i) => {
                            return (
                                <View key={i} style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                                    <TouchableOpacity
                                        key={i}
                                        onPress={this.changeTab.bind(null, i)}
                                        style={[styles.tabButton, this.state.tabIndex === i ? { borderTopWidth: 4, backgroundColor: '#FF8686', borderColor: '#FF6262' } : null]}>
                                        <Text style={[styles.tabText, this.state.tabIndex === i ? { marginTop: 6, color: '#FFFFFF' } : null]} >
                                            {i === this.getCurrentDayIndex() ? '今日' : item}
                                        </Text>
                                        <Text style={[styles.tabTextTime, this.state.tabIndex === i ? { color: '#FFFFFF' } : null]} >
                                            {moment(this.state.memDayTime[i]).format('MM.DD')}
                                        </Text>
                                    </TouchableOpacity>
                                    {(i !== menuAdminArray.length - 1 && this.state.tabIndex - 1 !== i && this.state.tabIndex !== i) &&
                                    <View style={styles.vline} />}
                                </View>
                            );
                        })
                    }
                </View>
                <View style={styles.separator2} />
                <View style={styles.titleContainerWeekSub2}>
                    <View style={styles.headRedView2} />
                    <Text style={styles.headItemText}>
                            计划工作项
                        </Text>
                </View>
                <View style={styles.separator} />
                <ListView
                    style={styles.list}
                    enableEmptySections
                    dataSource={this.state.dayDataSource}
                    renderRow={this.renderRowDay}
                    renderSeparator={this.renderSeparator}
                    />
                {
                    !this.state.isDayPlanModify &&
                    <TouchableOpacity
                        onPress={this.addDayPlanContent}
                        style={styles.addItemText}>
                        <Image
                            resizeMode='stretch'
                            source={app.img.specops_add}
                            style={styles.buttonImageStyle} />
                        <Text style={styles.buttonTextStyle}>{'新增'}</Text>
                    </TouchableOpacity>
                }
                {
                    <View>
                        <View style={styles.separator2} />
                        <View style={styles.titleContainerWeekSub2}>
                            <View style={styles.headRedView2} />
                            <Text style={styles.headItemText}>
                                    实际工作项
                                </Text>
                        </View>
                        <View style={styles.separator} />
                        {
                            <View>
                                <ListView
                                    style={styles.list}
                                    enableEmptySections
                                    dataSource={this.ds.cloneWithRows(this.state.actually)}
                                    renderRow={this.renderRowDayCommplete}
                                    renderSeparator={this.renderSeparator}
                                    />
                                <TouchableOpacity
                                    onPress={this.addDayActuallyContent}
                                    style={styles.addItemText}>
                                    <Image
                                        resizeMode='stretch'
                                        source={app.img.specops_add}
                                        style={styles.buttonImageStyle} />
                                    <Text style={styles.buttonTextStyle}>{'新增'}</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                }
            </View>
        );
    },
    // 每日总结
    weekPlanConclusion () {
        const { daySummary } = this.state;
        const height = this.calculateStrLength(daySummary, 34);
        return (
            <View onLayout={this.onLayoutSummary}>
                <View style={styles.separator2} />
                <View style={styles.titleContainerWeekSub2}>
                    <View style={styles.headRedView2} />
                    <Text style={styles.headItemText}>
                            工作总结
                        </Text>
                </View>
                <View style={styles.separator} />
                {
                        daySummary == '' ?
                            <View style={styles.summaryView}>
                                <Image
                                    resizeMode='stretch'
                                    source={app.img.specops_bossImage}
                                    style={styles.summaryImage} />
                                <Text style={styles.summaryText}>
                                您还没有填写工作总结
                            </Text>
                                <TouchableOpacity
                                    onPress={this.editDaySummary}
                                    style={styles.summaryBtn}>
                                    <Text style={styles.summaryBtnText}>{'填写今日总结'}</Text>
                                </TouchableOpacity>
                            </View>
                        :
                            <TouchableOpacity style={styles.inputContainerDaySummary}
                                onPress={this.editDaySummary}
                                onLongPress={this.onLongPress.bind(null, this.state.daySummary)}>
                                <Text
                                    style={styles.detailStyleDaySummary}
                                    multiline>
                                    {this.state.daySummary}
                                </Text>
                            </TouchableOpacity>
                }
            </View>
        );
    },
    // 每日备注
    weekProblemView () {
        const { problemArray } = this.state;
        return (
            <View onLayout={this.onLayoutProblem}>
                <View style={styles.separator2} />
                <View style={styles.titleContainerWeekSub2}>
                    <View style={styles.headRedView2} />
                    <Text style={styles.headItemText}>
                        每日三省
                    </Text>
                </View>
                <View style={styles.separator} />
                {
                problemArray.map((item, i) => {
                    let textInputHeight = 0;
                    if (item.problemContent) {
                        textInputHeight = this.calculateStrLength(item.problemContent, 34);
                    }
                    return (
                        <View key={i}>
                            <View style={styles.titleView}>
                                <Text style={i < 3 ? styles.questionTitle : styles.questionTitle2}>{(i + 1) + '、' + item.problemTitle}
                                    {
                                    i < 3 && <Text style={{ color: 'red' }}>{'*'}</Text>
                                }
                                </Text>
                            </View>
                            <TouchableOpacity style={item.problemContent && textInputHeight > 44 ? styles.inputContainer : [styles.inputContainer, { height:sr.ws(44) }]}
                                onPress={i < 3 ? this.modifyFixDayProblemView.bind(null, item, i) : this.modifyDayProblemView.bind(null, item)}
                                onLongPress={this.onLongPress.bind(null, item.problemContent)}>
                                {
                                            item.problemContent == '' ?
                                                <Text
                                                    style={styles.detailStyle2}
                                                    multiline>
                                                    {'轻触开始填写'}
                                                </Text>
                                            :
                                                <Text
                                                    style={styles.detailStyle}
                                                    multiline>
                                                    {item.problemContent}
                                                </Text>
                                        }
                            </TouchableOpacity>
                        </View>
                    );
                })
            }
                {
                this.state.isProblemAdd &&
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={this.addDayProblemView}
                        style={styles.buttonStyle}>
                        <Image
                            resizeMode='stretch'
                            source={app.img.specops_add}
                            style={styles.buttonImageStyle} />
                        <Text style={styles.buttonTextStyle}>
                            新增备注
                        </Text>
                    </TouchableOpacity>
                </View>
            }
                <Text style={styles.noteTextStyle}>注：“吾日三省吾身”源自《论语》。是历代贤人通过每天反省、思考，提升自身能力的方式，是优秀人才必备掌握的成长方式。</Text>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    summaryView: {
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
    },
    summaryImage: {
        height: 100,
        width: 80,
    },
    summaryText: {
        fontSize: 18,
        color: '#B3B3B3',
        fontWeight: '600',
        fontFamily:'STHeitiSC-Medium',
    },
    summaryBtn: {
        width: 140,
        height: 42,
        backgroundColor: '#FF6363',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    summaryBtnText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '600',
        fontFamily:'STHeitiSC-Medium',
    },
    headRedView: {
        width: 10,
        height: 44,
        backgroundColor: '#99886A',
    },
    headRedView2: {
        width: 10,
        height: 44,
        backgroundColor: '#60987D',
    },
    headItemImg: {
        width: 8,
        height: 12,
        marginRight: 20,
    },
    headItemText: {
        marginLeft: 12,
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: '600',
        fontFamily:'STHeitiSC-Medium',
    },
    headItemText2: {
        marginLeft: 10,
        fontSize: 12,
        color: '#FFFFFF',
        fontFamily:'STHeitiSC-Medium',
    },
    headItemText3: {
        fontSize: 18,
        color: '#2A2A2A',
        fontFamily:'STHeitiSC-Medium',
    },
    titleContainerWeek: {
        alignItems: 'center',
        height: 44,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#C8B086',
    },
    titleContainerWeekSub: {
        alignItems: 'center',
        height: 44,
        flexDirection: 'row',
        backgroundColor: '#C8B086',
    },
    titleContainerWeekSub2: {
        alignItems: 'center',
        height: 44,
        flexDirection: 'row',
        backgroundColor: '#8DC9AC',
    },
    dayImage:{
        width: 16,
        height: 16,
        marginHorizontal: 20,
        marginTop: 5,
    },
    planBotStyle: {
        width: sr.w,
        height: 30,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#8DCAAC',
    },
    titleStyle: {
        marginLeft: 9,
        fontSize: 15,
        color: 'white',
        alignItems: 'center',
        fontWeight: '600',
    },
    titleView: {
        marginTop: 15,
        marginHorizontal: 22,
        flexDirection: 'row',
    },
    questionTitle: {
        color:'#2A2A2A',
        fontFamily:'STHeitiSC-Medium',
        fontSize: 14,
        marginTop: 1,
        width: sr.w - 44,
    },
    questionTitle2: {
        color:'#2A2A2A',
        fontFamily:'STHeitiSC-Medium',
        fontSize: 14,
        marginTop: 1,
        width: sr.w - 44,
    },
    weekPlanPurposeViewStyle: {
        width: sr.w,
        flexDirection: 'column',
    },
    topPanelStyle: {
        width: sr.w,
        paddingBottom: 2,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    contextText: {
        fontSize: 14,
    },
    contextTextDayTime: {
        marginTop: 10,
        marginBottom: 5,
        marginLeft: 10,
        color: '#bf954b',
        fontSize: 15,
    },
    calendarIcon: {
        marginLeft: 5,
        width: 25,
        height: 25,
    },
    separator: {
        width: sr.w,
        height: 1,
        backgroundColor: '#F1F0F5',
        alignSelf: 'center',
    },
    separator2: {
        width: sr.w,
        height: 4,
        backgroundColor: '#F1F0F5',
        alignSelf: 'center',
    },
    separator3: {
        width: sr.w - 30,
        height: 1,
        backgroundColor: '#F1F0F5',
        alignSelf: 'center',
    },
    list: {
        alignSelf:'stretch',
    },
    inputPlanContainer: {
        height:85,
        marginHorizontal: 10,
        backgroundColor: '#e4e5e6',
    },
    submitBtnStyle: {
        alignSelf: 'flex-end',
        borderRadius: 4,
        paddingVertical: 6,
        paddingHorizontal: 8,
        marginBottom: 7,
        marginRight: 8,
        backgroundColor: CONSTANTS.THEME_COLOR,
    },
    submitBtntextStyle: {
        fontSize: 16,
        fontWeight: '500',
    },
    addTextStyle: {
        fontSize: 22,
        color: '#FF6363',
    },
    addItemText: {
        width: sr.w,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginVertical: 8,
    },
    rowContainer: {
        flex: 1,
        alignItems: 'center',
        marginVertical: 8,
        flexDirection: 'row',
    },
    isFinishedIcon: {
        width: 17,
        height: 17,
        marginRight: 5,
    },
    weekPlanInfoViewStyle: {
        flexDirection: 'column',
    },
    tabContainer: {
        width:sr.w,
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        justifyContent: 'space-between',
    },
    tabButton: {
        flex: 1,
        alignItems:'center',
        backgroundColor: '#F4FFFA',
        height: 56,
    },
    vline: {
        width: 1,
        height: 40,
        backgroundColor: '#D2D2D2',
    },
    tabText: {
        marginTop: 10,
        fontSize: 12,
        color: '#888888',
        textAlign: 'center',
    },
    tabTextTime: {
        marginTop: 8,
        fontSize: 14,
        color: '#888888',
        textAlign: 'center',
    },
    inputContainer: {
        marginTop: 15,
        marginBottom: 10,
        marginHorizontal: 22,
        borderRadius: 2,
        backgroundColor: '#F1F1F1',
    },
    inputContainerDaySummary: {
        marginTop: 15,
        marginBottom: 10,
        marginHorizontal: 22,
    },
    detailStyleDaySummary:{
        flex: 1,
        fontSize:14,
        color: '#2A2A2A',
        fontFamily:'STHeitiSC-Medium',
    },
    detailStyle:{
        flex: 1,
        fontSize: 14,
        color: '#2A2A2A',
        marginVertical: 10,
        marginHorizontal: 15,
        backgroundColor: '#F1F1F1',
        fontFamily:'STHeitiSC-Medium',
    },
    detailStyle2:{
        flex: 1,
        fontSize:14,
        color: '#999999',
        marginVertical: 10,
        marginHorizontal: 15,
        backgroundColor: '#F1F1F1',
        fontWeight: '600',
        fontFamily:'STHeitiSC-Medium',
    },
    buttonContainer: {
        marginVertical: 10,
        paddingBottom: 10,
    },
    buttonTextStyle: {
        fontSize: 14,
        color: '#FF6363',
        fontFamily:'STHeitiSC-Medium',
    },
    buttonImageStyle: {
        marginRight: 12,
        width: 13,
        height: 13,
    },
    buttonStyle: {
        flexDirection: 'row',
        flex: 1,
        height: 46,
        marginHorizontal: 22,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E3E3E3',
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noteTextStyle: {
        flex: 1,
        fontSize:14,
        color: '#999999',
        marginHorizontal: 22,
        marginBottom: 15,
        fontWeight: '600',
        fontFamily:'STHeitiSC-Medium',
    },
    line: {
        width: sr.w,
        height: 1,
        backgroundColor: '#DDDDDD',
    },
});
