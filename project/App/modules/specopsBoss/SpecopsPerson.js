'use strict';
var React = require('react');
var ReactNative = require('react-native');
var {
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
var {DImage} = COMPONENTS;

var moment = require('moment');
var MonthList = require('../specops/MonthList.js');
var WeekList = require('../specops/WeekList.js');
var BossRecordItem = require('./BossRecordItem.js');
var HomeworkPersonal = require('./HomeworkPersonal.js');
var SpecopsPersonStudyInfo = require('./SpecopsPersonStudyInfo.js');
var ClassTestSpecopsList = require('./ClassTestSpecopsList.js');
var PieChart = require('./pieChart.js');
var EmployeeStudyTable = require('./EmployeeStudyTable.js');


module.exports = React.createClass({
    statics: {
        title: '赢销特种兵'
    },
    getInitialState() {
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            tabIndex: 0,
            weekCount: 0,
            monthDataSource: this.ds.cloneWithRows([]),
            weekDataSource: this.ds.cloneWithRows([]),
            dayDataSource: this.ds.cloneWithRows([]),
            isNextMonth: this.props.isNextMonth,
            memWeekTime: [],
            isLookAll: false,
            lineHeight: 0,
            actualWorks: [],
            dayplan: [],
            daySummary: null,
            studyDetailData: null,
        };
    },
    componentDidMount() {
        this.monthData = {};
        this.memWeekCount = 0;
        this.clearMonthData();
        this.currentMonthNum = this.getCurrentMonth();
        this.currentYearNum = this.getCurrentYear();
        this.processWeekTime(this.currentMonthNum-1);

        var tTime = moment();
        if (this.state.isNextMonth) {
            tTime.add(1, 'M');
            tTime.set('date', 15);
        }
        var param = {
            userID:this.props.userID,
            planDate:tTime.format('YYYY-MM-DD'),
        };
        POST(app.route.ROUTE_GET_MONTH_PLAN, param, this.getMonthDataSuccess, true);
        this.getDayPlanData(tTime);//获取日计划
        this.getPersonalStudyDetailsData(tTime);//获取日计划
    },
    getMonthDataSuccess(data) {
        if (data.success) {
            // process month plan..
            let monthPlan = data.context.monthPlan||[];
            let weekPlan = data.context.weekPlan||[];
            for (var i = 0; i < monthPlan.length; i++) {
                this.monthData.monthPlan.push(monthPlan[i]);
            }
            // process week plan..
            for (var i = 0; i < weekPlan.length; i++) {
                this.processWeekPlan(weekPlan[i]);
            }

            this.setState({monthDataSource: this.ds.cloneWithRows(this.monthData.monthPlan)});
            this.changeTab(this.getCurrentWeekIndex());
        } else {
            Toast(data.msg);
        }
    },
    getDayPlanData(tTime) {
        var param = {
            userID:this.props.userID,
            planDate:tTime.format('YYYY-MM-DD'),
        };
        POST(app.route.ROUTE_GET_DAY_PLAN, param, this.getDayPlanDataSuccess);
    },
    getDayPlanDataSuccess(data) {
        if (data.success) {
            let {actualWorks, dayplan, daySummary} = data.context;
            this.setState({actualWorks: actualWorks.contextList, dayplan, daySummary});
        } else {
            Toast(data.msg);
        }
    },
    getPersonalStudyDetailsData() {
        var param = {
            companyId: app.personal.info.companyId,
            userID: this.props.userID,
        };
        POST(app.route.ROUTE_GET_PERSONAL_STUDY_DETAILS, param, this.getPersonalStudyDetailsDataSuccess);
    },
    getPersonalStudyDetailsDataSuccess(data) {
        if (data.success) {
            this.setState({studyDetailData: data.context});
        } else {
            Toast(data.msg);
        }
    },
    getWeekPlan(index) {
        return this.monthData.weekPlan[index];
    },
    clearMonthData() {
        this.monthData.monthPlan = [];
        this.monthData.weekPlan = [];
        for (var i = 0; i < 5; i++) {
            this.monthData.weekPlan[i] = [];
        }
    },
    processWeekPlan(obj){
        this.monthData.weekPlan[obj.weekNum-1].push(obj);
    },
    processWeekTime(month){
        // find month first monday
        var isFirstMonday = false;
        var addPos = 0;

        var firstDay = '';
        firstDay = moment().set('date', 1).set('month', month).format('YYYY-MM-DD');

        var firstMonday = '';
        while (isFirstMonday === false) {
            var isMonday = moment(firstDay).add(1*addPos, 'd').day();
            if (isMonday === 1) {
                isFirstMonday = true;
                firstMonday = moment(firstDay).add(1*addPos, 'd').format('YYYY-MM-DD');
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
                var isMonday = moment(firstDay).add(1*addPos, 'd').day();
                if (isMonday === 1) {
                    isFirstMonday = true;
                    firstMonday = moment(firstDay).add(1*addPos, 'd').format('YYYY-MM-DD');
                    break;
                }
                addPos++;
            }
        }
        // get week date
        for (var i = 0; i < 6; i++) {
            if (moment(firstMonday).add(7*i, 'd').month() === moment(firstMonday).month()) {
                this.state.memWeekTime[i] = moment(firstMonday).add(7*i, 'd').format('YYYY-MM-DD');
            }else {
                this.setState({weekCount: i});
                this.memWeekCount = i;
                break;
            }
        }
    },
    getWeekNum(time){
        let currentWeek = moment(time).week();
        let currentWeekday = moment(time).weekday();
        if (currentWeekday===0) {
            currentWeek = currentWeek - 1;
        }
        return currentWeek;
    },
    getCurrentMonthMonday(){
        // find month first monday
        var isFirstMonday = false;
        var addPos = 0;

        var firstDay = '';
        firstDay = moment().set('date', 1).format('YYYY-MM-DD');

        var firstMonday = '';
        while (isFirstMonday === false) {
            var isMonday = moment(firstDay).add(1*addPos, 'd').day();
            if (isMonday === 1) {
                isFirstMonday = true;
                firstMonday = moment(firstDay).add(1*addPos, 'd').format('YYYY-MM-DD');
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
                var isMonday = moment(firstDay).add(1*addPos, 'd').day();
                if (isMonday === 1) {
                    isFirstMonday = true;
                    firstMonday = moment(firstDay).add(1*addPos, 'd').format('YYYY-MM-DD');
                    break;
                }
                addPos++;
            }
        }
        return firstMonday;
    },
    getCurrentMonth(){
        var strFirstMonday = this.getCurrentMonthMonday();
        var monthNum = 0;
        if (moment().date() < moment(strFirstMonday).date()) {
            return moment().month();
        }else {
            return moment().month()+1;
        }
    },
    getCurrentYear(){
        var strFirstMonday = this.getCurrentMonthMonday();
        var monthNum = 0;
        if (moment().date() < moment(strFirstMonday).date()) {
            if (moment().month() == 0) {
                return moment().year()-1;
            }
        }
        return moment().year();
    },
    isSameWeekWithCurrentTime(time) {
        let currentWeek = this.getWeekNum(moment().format('YYYY-MM-DD'));
        let selectWeek = this.getWeekNum(time);
        if (currentWeek === selectWeek) {
            return true;
        }else {
            return false;
        }
    },
    isLastWeekWithCurrentTime(time) {
        let currentWeek = this.getWeekNum(moment().format('YYYY-MM-DD'));
        let selectWeek = this.getWeekNum(time);
        if (currentWeek > selectWeek) {
            return true;
        }else {
            return false;
        }
    },
    getCurrentWeekIndex() {
        var index = 0;
        var strWeek = '';
        if (moment().day() === 0) {
            strWeek = moment().subtract(1, 'd').format('YYYY-MM-DD');
        }else {
            strWeek = moment().format('YYYY-MM-DD');
        }
        for (var i = 0; i < this.memWeekCount; i++) {
            if (moment(this.state.memWeekTime[i]).week() === moment(strWeek).week()) {
                index = i;
                break;
            }
        }
        return index;
    },
    processDayTime(time){
        //  current time get day data.
        var dayStr = '';
        var day = moment(time).day();
        if (day === 0) {
            dayStr = moment(time).subtract(1, 'd').format('YYYY-MM-DD');
        }else {
            dayStr = moment(time).format('YYYY-MM-DD');
        }
        if (this.state.isNextWeek) {
            dayStr = moment(dayStr).add(7, 'd').format('YYYY-MM-DD');
        }
        for (var i = 0; i < 7; i++) {
            this.state.memDayTime[i] = moment(dayStr).startOf('week').add(1+i, 'd').format('YYYY-MM-DD');
        }
    },
    getCurrentDayIndex() {
        var index = 0;
        for (var i = 0; i < 7; i++) {
            if (moment(this.state.memDayTime[i]).day() === moment().day()) {
                index = i;
                break;
            }
        }
        return index;
    },
    changeTab(tabIndex) {
        this.setState({tabIndex});
        var weekData = this.getWeekPlan(tabIndex);

        this.setState({weekDataSource: this.ds.cloneWithRows(weekData)});
    },
    doLookAll() {
        this.setState({isLookAll: !this.state.isLookAll});
    },
    goMonthPlanPage() {
        app.navigator.push({
            title: '工作目标',
            component: MonthList,
        });
    },
    goWeekListPage() {
        app.navigator.push({
            title: '工作计划与总结',
            component: WeekList,
        });
    },
    goHomeworkPersonalPage() {
        app.navigator.push({
            title: '课后作业',
            component: HomeworkPersonal,
        });
    },
    goClassTestSpecopsListPage() {
        app.navigator.push({
            title: '随堂测试成绩',
            component: ClassTestSpecopsList,
        });
    },
    renderSeparator(sectionID, rowID) {
        return (
            <View style={styles.separator3} key={rowID}/>
        );
    },
    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={[styles.lineDivision, {height: sr.ws(1)}]}/>
                    <SpecopsPersonStudyInfo />
                    <View style={[styles.lineDivision, {height: sr.ws(10)}]}/>
                    <this.currentMonthTask />
                    <View style={[styles.lineDivision, {height: sr.ws(10)}]}/>
                    <this.monthPlanPurpose />
                    <this.monthPlanContent />
                    <View style={[styles.lineDivision, {height: sr.ws(10)}]}/>
                    <this.todayPlanPurpose />
                    <View style={[styles.lineDivision, {height: sr.ws(10)}]}/>
                    <this.employeeStudy />
                    <View style={[styles.lineDivision, {height: sr.ws(10)}]}/>
                    <this.classTestResults />
                    <View style={[styles.lineDivision, {height: sr.ws(10)}]}/>
                    <this.homeworkList />
                </ScrollView>
            </View>
        );
    },
    renderRowMonth(obj) {
        return (
            <BossRecordItem
                data={obj}
                rowHeight={5}
                />
        )
    },
    renderRowWeek(obj) {
        return (
            <BossRecordItem
                data={obj}
                rowHeight={5}
                />
        )
    },
    renderRowDay(obj) {
        return (
            <BossRecordItem
                data={obj}
                rowHeight={5}
                isWideStyle={true}
                />
        )
    },
    renderRowDayCommplete(obj) {
        return (
            <BossRecordItem
                data={obj}
                rowHeight={5}
                haveImage = {true}
                />
        )
    },
    //本月工作计划
    monthPlanPurpose() {
        return (
            <View style={styles.monthPlanPurposeViewStyle}>
                <View style={styles.titleContainerWeek}>
                    <View style={styles.titleContainerWeekSub}>
                        <View style={styles.headRedView}/>
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
                <View style={styles.separator}></View>
                <ListView
                    style={styles.list}
                    enableEmptySections={true}
                    dataSource={this.state.monthDataSource}
                    renderRow={this.renderRowMonth}
                    renderSeparator={this.renderSeparator}
                    />
            </View>
        )
    },
    //学习情况
    currentMonthTask() {
        var {studyDetailData} = this.state;
        return (
            <View style={styles.homeworkContainer}>
                <View style={styles.titleContainerWeek}>
                    <View style={styles.titleContainerWeekSub}>
                        <View style={styles.headRedView}/>
                        <Text style={styles.headItemText}>
                            本月任务提交情况
                        </Text>
                    </View>
                </View>
                <View style={styles.separator}/>
                <View style={styles.studyDetailContainer}>
                    <View style={styles.panelContainer}>
                        <View style={styles.timeContainer}>
                            <Text style={styles.countStyle}>
                                {'1'}
                            </Text>
                            <Text style={styles.totalStyle}>
                                {'/1'}
                            </Text>
                        </View>
                        <Text style={[styles.countText, , {color: '#60A4F5'}]}>工作目标</Text>
                    </View>
                    <View style={styles.vline}/>
                    <View style={styles.panelContainer}>
                        <View style={styles.timeContainer}>
                            <Text style={styles.countStyle}>
                                {'23'}
                            </Text>
                            <Text style={styles.totalStyle}>
                                {'/24'}
                            </Text>
                        </View>
                        <Text style={[styles.countText, {color: '#A2D66C'}]}>工作计划</Text>
                    </View>
                    <View style={styles.vline}/>
                    <View style={styles.panelContainer}>
                        <View style={styles.timeContainer}>
                            <Text style={styles.countStyle}>
                                {'14'}
                            </Text>
                            <Text style={styles.totalStyle}>
                                {'/24'}
                            </Text>
                        </View>
                        <Text style={[styles.countText, {color: '#FED057'}]}>工作总结</Text>
                    </View>
                </View>
            </View>
        )
    },
    //学习情况
    employeeStudy() {
        var {studyDetailData} = this.state;
        return (
            <View style={styles.homeworkContainer}>
                <View style={styles.titleContainerWeek}>
                    <View style={styles.titleContainerWeekSub}>
                        <View style={styles.headRedView}/>
                        <Text style={styles.headItemText}>
                            学习情况
                        </Text>
                    </View>
                </View>
                <View style={styles.separator}/>
                {
                    studyDetailData&&
                    <EmployeeStudyTable avgCoursesNumber={studyDetailData.avgCoursesNumber} monthAvgCoursesNumber={studyDetailData.monthAvgCoursesNumber} studyWhenLong={studyDetailData.studyWhenLong} monthStudyWhenLong={studyDetailData.monthStudyWhenLong}/>
                }
            </View>
        )
    },
    //随堂测试成绩
    classTestResults() {
        let {studyDetailData} = this.state;
        let sections = [];
        let radios = [];
        let numbers = [];
        if (studyDetailData) {
            var quizzesSuccess = studyDetailData.quizzesSuccess;
            for (var i in quizzesSuccess) {
                sections.push(quizzesSuccess[i].title+'('+quizzesSuccess[i].sectionMax+'~'+quizzesSuccess[i].sectionMin+')');
                radios.push(quizzesSuccess[i].proportion+'%');
                numbers.push(quizzesSuccess[i].number);
            }
        }
        return (
            <View style={styles.homeworkContainer}>
                <View style={styles.titleContainerWeek}>
                    <View style={styles.titleContainerWeekSub}>
                        <View style={styles.headRedView}/>
                        <Text style={styles.headItemText}>
                            随堂测试成绩
                        </Text>
                    </View>
                </View>
                <View style={styles.separator}/>
                <PieChart sections={sections} radios={radios} numbers={numbers}/>
                <View style={styles.separator}/>
                <TouchableOpacity onPress={this.goClassTestSpecopsListPage} style={styles.seeDetail}>
                    <Text style={styles.detailText}>
                        查看详情
                    </Text>
                </TouchableOpacity>
            </View>
        )
    },
    //课后作业
    homeworkList() {
        return (
            <View style={styles.homeworkContainer}>
                <View style={styles.titleContainerWeek}>
                    <View style={styles.titleContainerWeekSub}>
                        <View style={styles.headRedView}/>
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
                <HomeworkPersonal />
            </View>
        )
    },
    //本月详细工作计划
    monthPlanContent() {
        var {tabIndex} = this.state;
        var menuAdminArray1 = ['第一周', '第二周', '第三周', '第四周'];
        var menuAdminArray2 = ['第一周', '第二周', '第三周', '第四周', '第五周'];
        var menuAdminArray = [];
        if (this.state.weekCount > 4) {
            menuAdminArray = menuAdminArray2;
        }else{
            menuAdminArray = menuAdminArray1;
        }

        var monthStr = '';
        if (this.state.isNextMonth) {
            monthStr = moment(this.state.memWeekTime[0]).add(1, 'M').format('YYYY年M月');
        }else{
            monthStr = moment(this.state.memWeekTime[0]).format('YYYY年M月');
        }

        return (
            <View style={styles.monthPlanInfoViewStyle}>
                <View style={styles.tabContainer}>
                    {
                        menuAdminArray.map((item, i)=>{
                            var time1 = moment(this.state.memWeekTime[i]);
                            var time2 = moment(this.state.memWeekTime[i]).add(6, 'd');
                            var strTime = '';

                            if (this.state.memWeekTime[i] != undefined) {
                                strTime = time1.format('MM.DD')+'-'+time2.format('MM.DD');
                            }

                            var isCurrentWeek = this.isSameWeekWithCurrentTime(this.state.memWeekTime[i]);

                            if (this.state.tabIndex===i) {
                                return (
                                    <TouchableOpacity
                                        key={i}
                                        onPress={this.changeTab.bind(null, i)}
                                        style={styles.tabButton}>
                                        <Image
                                            resizeMode='stretch'
                                            source={app.img.specops_weekBackImg}
                                            style={[styles.weekImageStyle, {width: sr.w/menuAdminArray.length}]}>
                                            <View style={styles.tabButtonItem}>
                                                <Text style={[styles.tabText,{color:'white'}]} >
                                                    {isCurrentWeek?'本周':item}
                                                </Text>
                                                <Text style={[styles.tabText2,{color:'white'}]} >
                                                    {strTime}
                                                </Text>
                                            </View>
                                        </Image>
                                    </TouchableOpacity>
                                )
                            }else {
                                return (
                                    <TouchableOpacity
                                        key={i}
                                        onPress={this.changeTab.bind(null, i)}
                                        style={styles.tabButton}>
                                        <View style={styles.tabButtonItemView}>
                                        <View style={styles.tabButtonItem}>
                                            <Text style={styles.tabText} >
                                                {isCurrentWeek?'本周':item}
                                            </Text>
                                            <Text style={styles.tabText2} >
                                                {strTime}
                                            </Text>
                                        </View>
                                        </View>
                                        {(i!==menuAdminArray.length-1 && this.state.tabIndex-1 !== i) &&
                                            <Image resizeMode='stretch' source={app.img.specops_grey_line} style={styles.vline}/>}
                                    </TouchableOpacity>
                                )
                            }
                        })
                    }
                </View>
                <ListView
                    style={styles.list}
                    enableEmptySections={true}
                    dataSource={this.state.weekDataSource}
                    renderRow={this.renderRowWeek}
                    renderSeparator={this.renderSeparator}
                    />
            </View>
        )
    },
    _measureLineHeight(e) {
        if (!this.state.lineheight) {
            var {height} = e.nativeEvent.layout;
            this.setState({lineHeight: height+26});
        }
    },
    //今日计划
    todayPlanPurpose() {
        var {isLookAll, actualWorks, dayplan, daySummary} = this.state;
        return (
            <View style={styles.monthPlanPurposeViewStyle}>
                <View style={styles.titleContainerWeek}>
                    <View style={styles.titleContainerWeekSub}>
                        <View style={styles.headRedView}/>
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
                <View style={styles.separator}/>
                <View style={styles.monthPlanInfoViewStyle}>
                    <View style={styles.titleContainerWeekSub2}>
                        <Text style={styles.planItemText}>
                            计划工作项
                        </Text>
                    </View>
                    <View style={styles.separator}></View>
                    <ListView
                        style={styles.list}
                        enableEmptySections={true}
                        dataSource={this.ds.cloneWithRows(dayplan)}
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
                    <View style={styles.separator}></View>
                        <ListView
                            style={styles.list}
                            enableEmptySections={true}
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
                    <View style={styles.separator}></View>
                    <View style={[styles.synopsisStyle, {height: this.state.lineHeight}]}>
                        <Text onLayout={this._measureLineHeight} numberOfLines={isLookAll?200:4} style={styles.conclusionText}>
                            {daySummary&&daySummary.content}
                        </Text>
                        {
                            !isLookAll&&
                            <Image resizeMode='stretch' source={app.img.specops_mask} style={[styles.maskImage, {height: (this.state.lineHeight)/2}]}/>
                        }
                        <TouchableOpacity onPress={this.doLookAll} style={styles.lookAllStyle}>
                            <Text style={styles.lookAllText}>{isLookAll?'点击收起':'点击展开更多'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    },
});

var styles = StyleSheet.create({
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
        width: sr.w-30,
        marginTop: 12,
        marginBottom: 8,
        marginHorizontal: 15,
    },
    synopsisText: {
        width: sr.w-48,
        marginLeft: 24,
        fontSize: 16,
        color: '#151515',
        fontFamily: 'STHeitiSC-Medium'
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
        left: sr.w/2-50,
        position: 'absolute',
        alignItems: 'center',
        flexDirection: 'row',
    },
    lookAllText: {
        fontSize: 14,
        color: '#45B0F7',
        fontFamily: 'STHeitiSC-Medium'
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
    studyDetailContainer: {
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
});
