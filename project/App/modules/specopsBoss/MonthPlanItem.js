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

var RecordItemView = require('./BossRecordItem.js');
var moment = require('moment');
var {Button, InputBox, DImage} = COMPONENTS;
var CopyBox = require('../home/CopyBox.js');

module.exports = React.createClass({
    getInitialState() {
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            tabIndex: 0,
            weekCount: 0,
            monthDataSource: this.ds.cloneWithRows([]),
            weekDataSource: this.ds.cloneWithRows([]),
            memWeekTime: [],
        };
    },
    getWeekPlan(index) {
        return this.monthData.weekPlan[index];
    },
    clearMonthData() {
        this.monthData = {};
        this.monthData.monthPlan = [];
        this.monthData.weekPlan = [];
        for (var i = 0; i < 5; i++) {
            this.monthData.weekPlan[i] = [];
        }

        // test data
        this.userHeadImage = '';
        this.userHeadName = '姓名姓名';
        this.userHeadJob = '职位职位';
        this.userHeadTime = '66:66';
        let obj = {};
        obj.content = '12345';
        obj.isOver = 0;
        this.monthData.monthPlan.push(obj);
        this.monthData.monthPlan.push(obj);
        this.monthData.monthPlan.push(obj);
        this.monthData.weekPlan[0].push(obj);
        this.monthData.weekPlan[0].push(obj);

        this.setState({monthDataSource: this.ds.cloneWithRows(this.monthData.monthPlan)});
        this.changeTab(0);

        // process data.
        if (this.props.planData && this.props.planData.length > 0) {
            let {planData} = this.props;

            this.userHeadImage = planData.userImg;
            this.userHeadName = planData.userName;
            this.userHeadJob = planData.post;
            this.userHeadTime = planData.submitDate;

            this.monthData.monthPlan = planData.monthPlan.slice(0);
            // process week plan..
            for (var i = 0; i < planData.weekPlan.length; i++) {
                this.processWeekPlan(planData.weekPlan[i]);
            }
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
    getCurrentTimeWeekSeq(){
        var curWeekNum = this.getWeekNum(moment().format('YYYY-MM-DD'));
        for (var i = 0; i < this.state.memWeekTime.length; i++) {
            var weekNum = this.getWeekNum(this.state.memWeekTime[i]);
            if (curWeekNum == weekNum) {
                return (i+1);
            }
        }
        return 0;
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
    componentDidMount() {
        this.onInputBoxFun = null;
        this.memTabIndex = 0;
        this.memWeekCount = 0;

        this.currentMonthNum = this.getCurrentMonth();
        this.currentYearNum = this.getCurrentYear();
        this.processWeekTime(this.currentMonthNum-1);
        this.currentWeekSeq = this.getCurrentTimeWeekSeq();

        this.clearMonthData();
    },
    renderSeparator(sectionID, rowID) {
        return (
            <View style={styles.separator3} key={rowID}/>
        );
    },
    changeTab(tabIndex) {
        this.setState({tabIndex});
        var weekData = this.getWeekPlan(tabIndex);

        this.setState({weekDataSource: this.ds.cloneWithRows(weekData)});
    },
    renderRowMonth(obj) {
        return (
            <RecordItemView
                data={obj}
                rowHeight={5}
                />
        )
    },
    renderRowWeek(obj) {
        return (
            <RecordItemView
                data={obj}
                rowHeight={5}
                />
        )
    },
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.separator2}></View>
                <this.monthPlanHead />
                <this.monthPlanPurpose />
                <this.monthPlanContent />
            </View>
        );
    },
    // 头像view
    monthPlanHead() {
        return (
            <View style={styles.monthPlanHeadView}>
                <View style={styles.monthPlanHeadView1}>
                    <DImage
                        resizeMode='stretch'
                        defaultSource={app.img.personal_head}
                        source={this.userHeadImage!=''?{uri: this.userHeadImage}:app.img.personal_head}
                        style={styles.HeadViewImage}  />
                    <Text style={styles.HeadViewTextName}>
                        {this.userHeadName}
                    </Text>
                    <Text style={styles.HeadViewTextJob}>
                        {this.userHeadJob}
                    </Text>
                </View>
                <Text style={styles.HeadViewTextTime}>
                    {this.userHeadTime}
                </Text>
            </View>
        )
    },
    //本月工作计划
    monthPlanPurpose() {
        return (
            <View style={styles.monthPlanPurposeViewStyle}>
                    <View style={styles.separator}></View>
                    <View style={styles.titleContainerWeek}>
                        <View style={styles.titleContainerWeekSub}>
                            <Text style={styles.headItemText}>
                                月工作目标
                            </Text>
                        </View>
                    </View>
                    <View style={styles.separator3}></View>
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
                                                    {isCurrentWeek?item:item}
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
                                                {isCurrentWeek?item:item}
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
});

var styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF'
    },
    monthPlanHeadView: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    monthPlanHeadView1: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
    },
    HeadViewImage: {
        marginLeft: 16,
        width: 40,
        height: 40,
    },
    HeadViewTextName: {
        marginLeft: 12,
        fontSize: 20,
        color: '#333333',
        fontFamily:'STHeitiSC-Medium',
    },
    HeadViewTextJob: {
        marginLeft: 12,
        fontSize: 10,
        color: '#FFFFFF',
        fontFamily:'STHeitiSC-Medium',
        backgroundColor: '#FC6467',
        borderRadius: 2,
    },
    HeadViewTextTime: {
        marginRight: 16,
        fontSize: 14,
        color: '#8D8D8D',
        fontFamily:'STHeitiSC-Medium',
    },
    titleContainerWeek: {
        alignItems: 'center',
        height: 44,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    titleContainerWeekSub: {
        alignItems: 'center',
        height: 44,
        flexDirection: 'row',
    },
    headItemText: {
        marginLeft: 42,
        fontSize: 18,
        color: '#333333',
        fontFamily:'STHeitiSC-Medium',
    },
    monthPlanPurposeViewStyle: {
        width: sr.w,
        flexDirection: 'column',
    },

    separator: {
        width: sr.w,
        height: 1,
        backgroundColor: '#F1F0F5',
        alignSelf: 'center',
    },
    separator2: {
        width: sr.w,
        height: 10,
        backgroundColor: '#F1F0F5',
        alignSelf: 'center',
    },
    separator3: {
        marginLeft: 20,
        width: sr.w-20,
        height: 1,
        backgroundColor: '#F1F0F5',
    },
    list: {
        alignSelf:'stretch',
        marginTop: 5,
    },

    monthPlanInfoViewStyle: {
        marginTop: 5,
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
    vline: {
        position: 'absolute',
        width: 2,
        height: 46,
        right: 0,
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
    weekImageStyle: {
        height: 56,
        paddingTop: 5,
    },
});