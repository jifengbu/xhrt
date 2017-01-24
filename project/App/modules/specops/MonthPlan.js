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

var RecordItemView = require('./RecordItemView.js');
var moment = require('moment');
var MonthList = require('./MonthList.js');
var {Button, InputBox} = COMPONENTS;
var CopyBox = require('../home/CopyBox.js');

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        title: '工作目标',
        leftButton: {handler: ()=>app.scene.goBack()},
        rightButton: { image: app.img.specops_history_record, handler: ()=>{
            app.navigator.push({
                component: MonthList,
            });
        }},
    },
    onStartShouldSetResponderCapture(evt){
        console.log('----onStartShouldSetResponderCapture',evt.nativeEvent.pageX, evt.nativeEvent.pageY);
        app.touchPosition.x = evt.nativeEvent.pageX;
        app.touchPosition.y = evt.nativeEvent.pageY;
        return false;
    },
    onLongPress(str){
        if (str != '' && str.length > 0) {
            // 显示复制按钮
            app.showModal(
                <CopyBox copyY={app.touchPosition.y}
                        copyX={app.touchPosition.x}
                        copyString={str}/>,
                        {backgroundColor: 'transparent'}
            );
        }
    },
    goBack() {
        app.navigator.pop();
    },
    getInitialState() {
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            tabIndex: 0,
            weekSummary: '',
            weekCount: 0,
            currentWeekID:'',
            currentMonthID:'',
            monthDataSource: this.ds.cloneWithRows([]),
            weekDataSource: this.ds.cloneWithRows([]),
            isInputBoxShow: false,
            inputBoxText: '',
            isNextMonth: this.props.isNextMonth,
            memWeekTime: [],
            haveCannel: false,
            isModify:true,
        };
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
    getWeekSummary(index) {
        var weekPlan = this.monthData.weekPlan[index];
        this.setState({weekSummary:''});
        var param = {
            userID:app.personal.info.userID,
            planDate:this.state.memWeekTime[index],
        };
        POST(app.route.ROUTE_GET_WEEK_SUMMARY, param, this.getWeekSummarySuccess, true);

        // can modify.
        var currentIndex = this.getCurrentWeekIndex();
        this.setState({isModify: !(index < currentIndex)});
    },
    getWeekSummarySuccess(data) {
        if (data.success) {
            this.setState({weekSummary:data.context?data.context.content:''});
        } else {
            Toast(data.msg);
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
        this.monthData = {};
        this.onInputBoxFun = null;
        this.memTabIndex = 0;
        this.memWeekCount = 0;
        this.clearMonthData();

        this.currentMonthNum = this.getCurrentMonth();
        this.currentYearNum = this.getCurrentYear();
        this.processWeekTime(this.currentMonthNum-1);

        this.currentWeekSeq = this.getCurrentTimeWeekSeq();

        var tTime = moment();
        if (this.state.isNextMonth) {
            tTime.add(1, 'M');
            tTime.set('date', 15);
        }
        var param = {
            userID:app.personal.info.userID,
            planDate:tTime.format('YYYY-MM-DD'),
        };
        POST(app.route.ROUTE_GET_MONTH_PLAN, param, this.getMonthDataSuccess, true);

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
    renderSeparator(sectionID, rowID) {
        return (
            <View style={styles.separator3} key={rowID}/>
        );
    },
    doMonthFinished(obj) {
        if (obj.isOver) {
            return;
        }
        var param = {
            userID:app.personal.info.userID,
            id: obj.id,
            isOver: 1,
        };
        POST(app.route.ROUTE_SET_MONTH_PLAN_IS_OVER, param, this.doMonthFinishedSuccess, true);
    },
    doMonthFinishedSuccess(data){
        if (data.success) {
            var planInfo = _.find(this.monthData.monthPlan,(item)=>item.id==data.context.id);
            if (planInfo) {
                planInfo.isOver = true;
                this.setState({monthDataSource: this.ds.cloneWithRows(this.monthData.monthPlan)});
            }
        } else {
            Toast(data.msg);
        }
    },
    doWeekFinished(obj) {
        if (obj.isOver) {
            return;
        }
        var param = {
            userID:app.personal.info.userID,
            id: obj.id,
            isOver: 1,
        };
        POST(app.route.ROUTE_SET_WEEK_PLAN_IS_OVER, param, this.doWeekFinishedSuccess, true);
    },
    doWeekFinishedSuccess(data){
        if (data.success) {
            var weekData = this.getWeekPlan(this.state.tabIndex);
            var planInfo = _.find(weekData,(item)=>item.id==data.context.id);
            if (planInfo) {
                planInfo.isOver = true;
                this.setState({weekDataSource: this.ds.cloneWithRows(weekData)});
            }
        } else {
            Toast(data.msg);
        }
    },
    modifyMonthPlan(strContent) {
        if (strContent === '') {
            return;
        }
        var param = {
            userID:app.personal.info.userID,
            id: this.state.currentMonthID,
            content: strContent,
        };
        POST(app.route.ROUTE_EDIT_MONTH_PLAN, param, this.modifyMonthPlanSuccess.bind(null, this.state.currentMonthID), true);
    },
    modifyMonthPlanSuccess(currentMonthID, data){
        if (data.success) {
            var planInfo = _.find(this.monthData.monthPlan,(item)=>item.id==currentMonthID);
            if (planInfo) {
                Object.assign(planInfo, data.context);
                this.setState({monthDataSource: this.ds.cloneWithRows(this.monthData.monthPlan)});
            }
        } else {
            Toast(data.msg);
        }
    },
    modifyWeekPlan(strContent) {
        if (strContent === '') {
            return;
        }
        var param = {
            userID:app.personal.info.userID,
            id: this.state.currentWeekID,
            content: strContent,
        };
        POST(app.route.ROUTE_EDIT_WEEK_PLAN, param, this.modifyWeekPlanSuccess.bind(null, this.state.currentWeekID), true);
    },
    modifyWeekPlanSuccess(currentWeekID, data){
        if (data.success) {
            var weekData = this.getWeekPlan(this.state.tabIndex);
            var planInfo = _.find(weekData,(item)=>item.id==currentWeekID);
            if (planInfo) {
                Object.assign(planInfo, data.context);
                this.setState({weekDataSource: this.ds.cloneWithRows(weekData)});
            }
        } else {
            Toast(data.msg);
        }
    },
    deleteMonthPlan() {
        var param = {
            userID:app.personal.info.userID,
            id: this.state.currentMonthID,
        };
        POST(app.route.ROUTE_DELETE_MONTH_PLAN, param, this.deleteMonthPlanSuccess.bind(null, this.state.currentMonthID), true);
    },
    deleteMonthPlanSuccess(currentMonthID, data){
        if (data.success) {
            var planInfo = _.find(this.monthData.monthPlan,(item)=>item.id==currentMonthID);
            if (planInfo) {
                let spliceArr = _.remove(this.monthData.monthPlan, planInfo);
                this.setState({monthDataSource: this.ds.cloneWithRows(this.monthData.monthPlan)});
            }
        } else {
            Toast(data.msg);
        }
    },
    deleteWeekPlan() {
        var param = {
            userID:app.personal.info.userID,
            id: this.state.currentWeekID,
        };
        POST(app.route.ROUTE_DELETE_WEEK_PLAN, param, this.deleteWeekPlanSuccess.bind(null, this.state.currentWeekID), true);
    },
    deleteWeekPlanSuccess(currentWeekID, data){
        if (data.success) {
            var weekData = this.getWeekPlan(this.state.tabIndex);
            var planInfo = _.find(weekData,(item)=>item.id==currentWeekID);
            if (planInfo) {
                let spliceArr = _.remove(weekData, planInfo);
                this.setState({weekDataSource: this.ds.cloneWithRows(weekData)});
            }
        } else {
            Toast(data.msg);
        }
    },
    addMonthPlanContent() {
        app.showModal(
            <InputBox
                doConfirm={this.submitMonthPlan}
                inputText={''}
                doCancel={app.closeModal}
                />
        )
    },
    addWeekPlanContent() {
        app.showModal(
            <InputBox
                doConfirm={this.submitWeekPlan}
                inputText={''}
                doCancel={app.closeModal}
                />
        )
    },
    modifyMonthPlanContent(obj) {
        this.setState({currentMonthID: obj.id});
        app.showModal(
            <InputBox
                doConfirm={this.modifyMonthPlan}
                inputText={obj.content}
                doCancel={app.closeModal}
                haveDelete={true}
                doDelete={this.deleteMonthPlan}
                />
        )
    },
    modifyWeekPlanContent(obj) {
        if (this.isLastWeekWithCurrentTime(this.state.memWeekTime[this.state.tabIndex])) {
            Toast('不能修改上周制定的计划');
            return;
        }
        this.setState({currentWeekID: obj.id});
        app.showModal(
            <InputBox
                doConfirm={this.modifyWeekPlan}
                inputText={obj.content}
                doCancel={app.closeModal}
                haveDelete={true}
                doDelete={this.deleteWeekPlan}
                />
        )
    },
    showMonthPlanDetail(obj){
        this.setState({currentDayID: obj.id});
        app.showModal(
            <InputBox
                doConfirm={this.doCancel}
                inputText={obj.content}
                doCancel={app.closeModal}
                />
        )
    },
    showWeekPlanDetail(obj){
        this.setState({currentWeekID: obj.id});
        app.showModal(
            <InputBox
                doConfirm={this.doCancel}
                inputText={obj.content}
                doCancel={app.closeModal}
                />
        )
    },
    doCancel(){
        this.setState({isInputBoxShow: false});
    },
    submitMonthPlan(content) {
        this.setState({isInputBoxShow: false});
        if (content === '') {
            return;
        }
        var tTime = moment();
        if (this.state.isNextMonth) {
            tTime.add(1, 'M');
            tTime.set('date', 15);
        }
        // get month data. success get week Summary
        var param = {
            addContent: content,
            userID:app.personal.info.userID,
            planDate:tTime.format('YYYY-MM-DD'),
        };
        POST(app.route.ROUTE_ADD_MONTH_PLAN, param, this.submitMonthPlanSuccess, true);

    },
    submitMonthPlanSuccess(data) {
        if (data.success) {
            //请求接口成功更新页面
            this.monthData.monthPlan.push({'id': data.context.id, 'content':data.context.content, isOver: false})
            this.setState({monthDataSource: this.ds.cloneWithRows(this.monthData.monthPlan)});
        } else {
            Toast(data.msg);
        }
    },
    submitWeekPlan(content) {
        this.setState({isInputBoxShow: false});
        if (content=== '') {
            return;
        }
        // if (this.monthData.monthPlan.length < 1) {
        //     Toast("需要先增加月计划");
        //     return;
        // }
        //请求接口成功更新页面
        var param = {
            addContent: content,
            userID:app.personal.info.userID,
            planDate:this.state.memWeekTime[this.state.tabIndex],
        };
        POST(app.route.ROUTE_ADD_WEEK_PLAN, param, this.submitWeekPlanSuccess, true);

    },
    submitWeekPlanSuccess(data) {
        if (data.success) {

            var weekData = this.getWeekPlan(this.state.tabIndex);
            weekData.push({'id': data.context.id, 'planId':data.context.planId, 'content':data.context.content, isOver: false})
            this.setState({weekDataSource: this.ds.cloneWithRows(weekData)});

        } else {
            Toast(data.msg);
        }
    },
    editWeekSummary(){
        if (!this.state.isModify && this.state.weekSummary != '') {
            return;
        }
        app.showModal(
            <InputBox
                doConfirm={this.saveWeekSummary}
                inputText={this.state.weekSummary}
                doCancel={app.closeModal}
                />
        )
    },
    saveWeekSummary(strContext) {
        if (strContext == '') {
            return;
        }
        var param = {
            userID:app.personal.info.userID,
            context:strContext,
            planDate:this.state.memWeekTime[this.state.tabIndex],
        };
        POST(app.route.ROUTE_SUBMIT_WEEK_SUMMARY, param, this.submitWeekSummarySuccess.bind(null, strContext), true);
    },
    submitWeekSummarySuccess(strContext, data) {
        Toast('工作总结保存成功');
        this.setState({weekSummary:strContext});
    },
    changeTab(tabIndex) {
        this.setState({tabIndex});
        var weekData = this.getWeekPlan(tabIndex);

        this.setState({weekDataSource: this.ds.cloneWithRows(weekData)});
        this.getWeekSummary(tabIndex);
    },
    calculateStrLength(oldStr, strCount) {
        let height = 0;
        let linesHeight = 0;
        if (oldStr) {
            oldStr = oldStr.replace(/<\/?.+?>/g,/<\/?.+?>/g,"");
            oldStr = oldStr.replace(/[\r\n]/g, '|');
            let StrArr = oldStr.split('|');
            for (var i = 0; i < StrArr.length; i++) {
                //计算字符串长度，一个汉字占2个字节
                let newStr = StrArr[i].replace(/[^\x00-\xff]/g,"aa").length;
                //计算行数
                if (newStr == 0) {
                    linesHeight = 1;
                } else {
                    linesHeight = Math.ceil(newStr/strCount);
                }
                //计算高度，每行18
                height += linesHeight*sr.ws(18);
            }
            return height+1*sr.ws(18);
        } else {
            return 0;
        }
    },
    getItemHeight(str){
        var itemHeight = this.calculateStrLength(str);
        if (itemHeight > 46) {
            itemHeight = itemHeight+30;
        }else {
            itemHeight = 46;
        }
        return itemHeight;
    },
    renderRowMonth(obj) {
        return (
            <RecordItemView
                data={obj}
                rowHeight={12}
                onPress = {this.modifyMonthPlanContent.bind(null, obj)}
                />
        )
    },
    renderRowWeek(obj) {
        return (
            <RecordItemView
                data={obj}
                rowHeight={12}
                onPress = {this.modifyWeekPlanContent.bind(null, obj)}
                />
        )
    },
    render() {
        return (
            <View style={styles.container}
                onStartShouldSetResponderCapture={this.onStartShouldSetResponderCapture}>
                <ScrollView>
                    <this.monthPlanPurpose />
                    <this.monthPlanContent />
                    <this.monthPlanConclusion />
                </ScrollView>
                {
                    this.state.isInputBoxShow&&
                    <InputBox
                        doConfirm={this.onInputBoxFun}
                        inputText={this.state.inputBoxText}
                        leftText={"确认"}
                        rightText={"取消"}
                        doCancel={this.doCancel}
                        haveCannel={this.state.haveCannel}
                        />
                }
            </View>
        );
    },
    //本月工作计划
    monthPlanPurpose() {
        var monthStr = '';
        if (this.state.isNextMonth) {
            monthStr = moment().add(1, 'M').format('YYYY年MM月');
        }else{
            monthStr = moment().format('YYYY年MM月DD日');
        }

        return (
            <View style={styles.monthPlanPurposeViewStyle}>
                    <View style={styles.separator2}></View>
                    <View style={styles.titleContainerWeek}>
                        <View style={styles.titleContainerWeekSub}>
                            <View style={styles.headRedView}/>
                            <Text style={styles.headItemText}>
                                本月工作目标
                            </Text>
                            <Text style={styles.headItemText2}>
                                {'（'+this.currentYearNum+'年'+this.currentMonthNum+'月）'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.separator}></View>

                <ListView
                    style={styles.list}
                    enableEmptySections={true}
                    dataSource={this.state.monthDataSource}
                    renderRow={this.renderRowMonth}
                    renderSeparator={this.renderSeparator}
                    />
                <TouchableOpacity
                    onPress={this.addMonthPlanContent}
                    style={styles.addItemText}>
                    <Image
                        resizeMode='stretch'
                        source={app.img.specops_add}
                        style={styles.buttonImageStyle}>
                    </Image>
                    <Text style={styles.buttonTextStyle}>{'新增'}</Text>
                </TouchableOpacity>
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
                <View style={styles.separator2}></View>
                <View style={styles.titleContainerWeek}>
                    <View style={styles.titleContainerWeekSub}>
                        <View style={styles.headRedView}/>
                        <Text style={styles.headItemText}>
                            周工作目标
                        </Text>
                        <Text style={styles.headItemText2}>
                            {'（'+this.currentYearNum+'年'+this.currentMonthNum+'月）'}
                        </Text>
                    </View>
                </View>
                <View style={[styles.separator, {height: 2}]}></View>
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
                {
                    this.state.isModify &&
                    <TouchableOpacity
                        onPress={this.addWeekPlanContent}
                        style={styles.addItemText}>
                        <Image
                            resizeMode='stretch'
                            source={app.img.specops_add}
                            style={styles.buttonImageStyle}>
                        </Image>
                        <Text style={styles.buttonTextStyle}>{'新增'}</Text>
                    </TouchableOpacity>
                }
            </View>
        )
    },
    //每周总结
    monthPlanConclusion() {
        let height = this.calculateStrLength(this.state.weekSummary, 34);
        return (
            <View style={styles.monthPlanConclusionViewStyle}>
                    <View style={styles.separator2}></View>
                    <View style={styles.titleContainerWeek2}>
                        <View style={styles.titleContainerWeekSub2}>
                            <View style={styles.headRedView2}/>
                            <Text style={styles.headItemText}>
                                每周总结
                            </Text>
                        </View>
                    </View>
                    <View style={styles.separator}></View>
                <TouchableOpacity style={styles.inputContainerWeekSummary}
                                onPress={this.editWeekSummary}
                                onLongPress={this.onLongPress.bind(null, this.state.weekSummary)}>
                    {
                        this.state.weekSummary?
                        <Text
                            style={styles.detailStyleWeekSummary}
                            multiline={true}>
                            {this.state.weekSummary}
                        </Text>:
                        <Text
                            style={styles.warningTitle}
                            multiline={true}>
                            {'轻触填写周总结'}
                        </Text>
                    }
                </TouchableOpacity>
            </View>
        )
    },
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
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
        width: 100,
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
    containerMonthList: {
        marginTop: 1,
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    monthPlanPurposeViewStyle: {
        width: sr.w,
        flexDirection: 'column',
    },
    topPanelStyle: {
        width: sr.w,
        paddingBottom: 2,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    contextText: {
        fontSize: 15,
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
        width: sr.w-30,
        height: 1,
        backgroundColor: '#F1F0F5',
        alignSelf: 'center',
    },
    list: {
        alignSelf:'stretch',
        marginTop: 5,
    },
    inputPlanContainer: {
        height:85,
        marginHorizontal: 10,
        backgroundColor: '#e6eaeb',
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
        fontSize: 14,
        fontWeight: '900',
        color: CONSTANTS.THEME_COLOR,
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
    monthPlanConclusionViewStyle: {
        marginTop: 10,
    },
    inputContainerWeekSummary: {
        marginTop: 15,
        marginHorizontal: 22,
        marginBottom: 30,
    },
    detailStyleWeekSummary:{
        flex: 1,
        fontSize:14,
        color: '#2A2A2A',
        fontFamily:'STHeitiSC-Medium',
    },
    warningTitle: {
        fontSize: 14,
        fontFamily: 'STHeitiSC-Medium',
        color: '#B0B0B0',
    },
    inputContainer: {
        height:130,
        marginTop: 15,
        marginBottom: 10,
        marginHorizontal: 10,
        borderRadius: 2,
        backgroundColor: '#F1F1F1',
    },
    detailStyle:{
        flex: 1,
        fontSize:14,
        color: '#2A2A2A',
        marginVertical: 10,
        marginHorizontal: 15,
        backgroundColor: '#F1F1F1',
        fontWeight: '600',
        fontFamily:'STHeitiSC-Medium',
    },
    buttonContainer: {
        paddingBottom: 10,
    },
    buttonStyle: {
        flex: 1,
        height: 36,
        borderRadius: 3,
        marginHorizontal: 10,
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
    weekImageStyle: {
        height: 56,
        paddingTop: 5,
    },
});
