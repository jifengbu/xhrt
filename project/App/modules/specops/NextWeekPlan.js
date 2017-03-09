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
    TouchableOpacity,
} = ReactNative;

var RecordItemView = require('./RecordItemView.js');
var moment = require('moment');
var MonthPlan = require('./MonthPlan.js')
var InputTextMgr = require('../../manager/InputTextMgr.js');

var {Button, InputBox} = COMPONENTS;

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        title: '填写下周计划',
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
    getInitialState() {
        var _scrollView: ScrollView;
        this.scrollView = _scrollView;
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            tabIndex: 0,
            daySummary: '',
            currentWeekID:'',
            currentDayID:'',
            monthDataSource: this.ds.cloneWithRows([]),
            weekDataSource: this.ds.cloneWithRows([]),
            dayDataSource: this.ds.cloneWithRows([]),
            memDayTime: [],
            isNextWeek: true,
            scrollSize: 80,
            isModify:true,
        };
    },
    goWeekPlan() {
        app.navigator.push({
            component: MonthPlan,
        });
    },
    getDayPlan(index) {
        return this.weekData.dayPlan[index];
    },
    clearWeekData() {
        this.weekData.monthPlan = [];
        this.weekData.weekPlan = [];
        this.weekData.dayPlan = [];
        for (var i = 0; i < 7; i++) {
            this.weekData.dayPlan[i] = [];
        }
    },
    processDayPlan(obj){
        var tWeek = Number(obj.week);
        if (tWeek === 0) {
            this.weekData.dayPlan[6].push(obj);
        }else {
            this.weekData.dayPlan[tWeek-1].push(obj);
        }
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
    renderSeparator(sectionID, rowID) {
        return (
            <View style={styles.separator} key={rowID}/>
        );
    },
    onWillFocus() {
        var tTime = '';
        if (this.state.isNextWeek) {
            tTime = this.state.memDayTime[0];
        }else {
            tTime = moment().format('YYYY-MM-DD');
        }
        this.currentTime = tTime;
        this.timeFunc(tTime);

        var param = {
            userID:app.personal.info.userID,
            planDate:moment().format('YYYY-MM-DD'),
        };
        POST(app.route.ROUTE_GET_MONTH_PLAN, param, this.getMonthDataSuccess, true);
    },
    componentDidMount() {
        this.weekData = {};
        this.clearWeekData();
        this.processDayTime(moment().format('YYYY-MM-DD'));

        var tTime = '';
        if (this.state.isNextWeek) {
            tTime = this.state.memDayTime[0];
        }else {
            tTime = moment().format('YYYY-MM-DD');
        }
        this.currentTime = tTime;
        this.timeFunc(tTime);

        var param = {
            userID:app.personal.info.userID,
            planDate:moment().format('YYYY-MM-DD'),
        };
        POST(app.route.ROUTE_GET_MONTH_PLAN, param, this.getMonthDataSuccess, true);
    },
    getMonthDataSuccess(data) {
        if (data.success) {
            // process month plan..
            let monthPlan = data.context.monthPlan||[];
            this.weekData.monthPlan = [];
            for (var i = 0; i < monthPlan.length; i++) {
                this.weekData.monthPlan.push(monthPlan[i]);
            }

            this.setState({monthDataSource: this.ds.cloneWithRows(this.weekData.monthPlan)});
        } else {
            Toast(data.msg);
        }
    },
    getWeekDataSuccess(data) {
        if (data.success) {
            let weekPlan = data.context.weekPlan||[];
            let dayPlan = data.context.dayPlan||[];
            this.clearWeekData();
            // process week plan..
            for (var i = 0; i < weekPlan.length; i++) {
                this.weekData.weekPlan.push(weekPlan[i]);
            }
            // process day plan..
            for (var i = 0; i < dayPlan.length; i++) {
                this.processDayPlan(dayPlan[i]);
            }

            this.setState({weekDataSource: this.ds.cloneWithRows(this.weekData.weekPlan)});
            this.changeTab(0);

        } else {
            Toast(data.msg);
        }
    },
    modifyDayPlan(strContent) {
        if (strContent === '') {
            return;
        }
        var param = {
            userID:app.personal.info.userID,
            id: this.state.currentDayID,
            content: strContent,
        };
        POST(app.route.ROUTE_EDIT_DAY_PLAN, param, this.modifyDayPlanSuccess.bind(null, this.state.currentDayID), true);
    },
    modifyDayPlanSuccess(currentDayID, data){
        if (data.success) {
            var dayData = this.getDayPlan(this.state.tabIndex);
            var planInfo = _.find(dayData,(item)=>item.id==currentDayID);
            if (planInfo) {
                Object.assign(planInfo, data.context);
                this.setState({dayDataSource: this.ds.cloneWithRows(dayData)});
            }
        } else {
            Toast(data.msg);
        }
    },
    addDayPlanContent() {
        var textID = 'specops_nextWeekPlan1';
        var textContent = InputTextMgr.getTextContent(textID);
        app.showModal(
            <InputBox
                doConfirm={this.submitDayPlan}
                textID={textID}
                inputText={textContent}
                doCancel={app.closeModal}
                />
        );
    },
    //删除日计划
    doDeleteDayPlan() {
        var param = {
            userID: app.personal.info.userID,
            id: this.state.currentDayID,
        };
        POST(app.route.ROUTE_DELETE_DAY_PLAN, param, this.doDeleteDayPlanSuccess.bind(null,this.state.currentDayID), true);
    },
    doDeleteDayPlanSuccess(id, data) {
        if (data.success) {
            let dayData = this.getDayPlan(this.state.tabIndex);
            var planInfo = _.find(dayData,(item)=>item.id==id);
            if (planInfo) {
                _.remove(dayData, planInfo);
                this.setState({dayDataSource: this.ds.cloneWithRows(dayData)});
            }
        } else {
            Toast(data.msg);
        }
    },
    showDayPlanDetail(obj){
        app.showModal(
            <InputBox
                doConfirm={this.modifyDayPlan}
                doDelete={this.doDeleteDayPlan}
                inputText={obj.content}
                doCancel={app.closeModal}
                haveDelete={true}
                />
        );
        this.setState({currentDayID: obj.id});
    },
    submitDayPlan(content, textID) {
        if (content === '') {
            return;
        }
        //请求接口成功更新页面
        var param = {
            addContent: content,
            userID:app.personal.info.userID,
            planDate:this.state.memDayTime[this.state.tabIndex],
            weekNum: this.state.tabIndex,
        };
        POST(app.route.ROUTE_ADD_TODAY_PLAN, param, this.submitDayPlanSuccess.bind(null, textID), true);
    },
    submitDayPlanSuccess(textID, data) {
        if (data.success) {
            var dayData = this.getDayPlan(this.state.tabIndex);
            //请求接口成功更新页面
            dayData.push({'id': data.context.dayPlan.id, 'planId':data.context.dayPlan.planId, 'content':data.context.dayPlan.content, isOver: false})
            this.setState({dayDataSource: this.ds.cloneWithRows(dayData)});
            InputTextMgr.removeItem(textID);
            Toast('新增成功');
        } else {
            Toast(data.msg);
        }
    },
    changeTab(tabIndex) {
        this.setState({tabIndex});
        var dayData = this.getDayPlan(tabIndex);
        this.setState({dayDataSource: this.ds.cloneWithRows(dayData)});
    },
    timeFunc(time){
        var param = {
            userID:app.personal.info.userID,
            planDate:time,
        };
        POST(app.route.ROUTE_GET_WEEK_PLAN, param, this.getWeekDataSuccess, true);
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
    renderRowWeek(obj,sectionID,rowID) {
        var itemHeight = this.getItemHeight(obj.content);
        obj.itemHeight = itemHeight;
        return (
            <RecordItemView
                data={obj}
                rowHeight={12}
                onPress = {null}
                />
        )
    },
    renderRowDay(obj,sectionID,rowID) {
        var itemHeight = this.getItemHeight(obj.content);
        obj.itemHeight = itemHeight;
        return (
            <RecordItemView
                data={obj}
                rowHeight={12}
                haveSerialNum={parseInt(rowID)+1}
                onPress = {this.showDayPlanDetail.bind(null, obj)}
                />
        )
    },
    render() {
        return (
            <View style={styles.container}
                onStartShouldSetResponderCapture={this.onStartShouldSetResponderCapture}>
                <View style={styles.topLine}/>
                <ScrollView
                    ref={(scrollView) => { this.scrollView = scrollView; }}>
                    <this.monthPlanPurpose />
                    <this.weekPlanPurpose />
                    <this.weekPlanContent />
                </ScrollView>
            </View>
        );
    },
    //本月工作计划
    monthPlanPurpose() {
        return (
                <View>
                    <TouchableOpacity onPress={this.goWeekPlan} style={styles.titleContainerWeek}>
                        <View style={styles.titleContainerWeekSub}>
                            <Text style={styles.headItemText}>
                                月工作目标
                            </Text>
                            <Image resizeMode='contain' source={app.img.specops_go_white} style={styles.goPlanImage}></Image>
                        </View>
                        <View style={styles.separator3}/>
                    </TouchableOpacity>
                    <ListView
                        style={styles.listView}
                        enableEmptySections={true}
                        dataSource={this.state.monthDataSource}
                        renderRow={this.renderRowWeek}
                        renderSeparator={this.renderSeparator}
                        />
                </View>
            );
    },
    //本周工作计划
    weekPlanPurpose() {
        return (
            <View style={styles.weekPlanPurposeViewStyle}>
                <TouchableOpacity onPress={this.goWeekPlan} style={styles.titleContainerWeek}>
                    <View style={styles.titleContainerWeekSub}>
                        <Text style={styles.headItemText}>
                            周工作目标
                        </Text>
                        <Image resizeMode='contain' source={app.img.specops_go_white} style={styles.goPlanImage}></Image>
                    </View>
                    <View style={styles.separator3}/>
                </TouchableOpacity>
                <ListView
                    style={styles.listView}
                    enableEmptySections={true}
                    dataSource={this.state.weekDataSource}
                    renderRow={this.renderRowWeek}
                    renderSeparator={this.renderSeparator}
                    />
                <View style={styles.separator}></View>
            </View>
        )
    },
    calculateStrLength(oldStr) {
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
                    linesHeight = Math.ceil(newStr/48);
                }
                //计算高度，每行18
                height += linesHeight*sr.ws(18);
            }
            return height+1*sr.ws(18);
        } else {
            return 0;
        }
    },
    //本周详细工作计划
    weekPlanContent() {
        var {tabIndex} = this.state;
        var menuAdminArray = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        return (
            <View style={styles.weekPlanInfoViewStyle}>
                <View style={styles.tabContainer}>
                    {
                        menuAdminArray.map((item, i)=>{
                            return (
                                <View key={i} style={{flexDirection: 'row',flex: 1,alignItems: 'center'}}>
                                    <TouchableOpacity
                                        key={i}
                                        onPress={this.changeTab.bind(null, i)}
                                        style={[styles.tabButton, this.state.tabIndex===i?{borderTopWidth: 4, backgroundColor: '#FF8686'}:{backgroundColor:'#F2FFF9'}]}>
                                        <Text style={[styles.tabText, this.state.tabIndex===i?{marginTop: 8, color: '#FFFFFF'}:{color:'#696A69'}]} >
                                            {item}
                                        </Text>
                                        <Text style={[styles.tabTextTime, this.state.tabIndex===i?{color: '#FFFFFF'}:{color:'#696A69'}]} >
                                            {moment(this.state.memDayTime[i]).format('MM.DD')}
                                        </Text>
                                    </TouchableOpacity>
                                    {(i!==menuAdminArray.length-1 && this.state.tabIndex-1 !== i && this.state.tabIndex !== i) &&
                                        <View style={styles.vline}/>}
                                </View>
                            )
                        })
                    }
                </View>
                <View style={styles.separator}></View>
                <ListView
                    style={styles.list}
                    enableEmptySections={true}
                    dataSource={this.state.dayDataSource}
                    renderRow={this.renderRowDay}
                    renderSeparator={this.renderSeparator}
                    />
                {
                    this.state.isModify &&
                    <TouchableOpacity
                        onPress={this.addDayPlanContent}
                        style={styles.addItemText}>
                        <Image
                            resizeMode='contain'
                            source={app.img.specops_add}
                            style={styles.iconStyle}>
                        </Image>
                        <Text style={[styles.contextText, {color: '#FF6363'}]}>{'增加一条新任务'}</Text>
                    </TouchableOpacity>
                }
            </View>
        )
    },
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    topLine: {
        height: 1,
        width: sr.w,
        backgroundColor: '#E0E0E0'
    },
    headItemText: {
        marginLeft: 10,
        fontSize: 16,
        height: 24,
        color: '#FFFFFF',
        fontFamily:'STHeitiSC-Medium',
        backgroundColor: 'transparent',
    },
    titleContainerWeek: {
        alignItems: 'center',
        height: 46,
        backgroundColor: '#99886A'
    },
    titleContainerWeekSub: {
        alignItems: 'center',
        height: 44,
        width: sr.w-10,
        marginLeft: 10,
        justifyContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: '#C8B086',
    },
    weekPlanPurposeViewStyle: {
        width: sr.w,
        flexDirection: 'column',
    },
    contextText: {
        fontSize: 14,
    },
    separator: {
        width: sr.w-30,
        marginLeft: 15,
        height: 1,
        backgroundColor: '#F1F0F5',
    },
    separator3: {
        width: sr.w,
        height: 2,
        backgroundColor: '#F1F0F5',
        alignSelf: 'center',
    },
    list: {
        alignSelf:'stretch',
        marginTop: 5,
        marginHorizontal: 22,
    },
    listView: {
        alignSelf:'stretch',
    },
    addItemText: {
        width: sr.w,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginVertical: 16,
    },
    iconStyle: {
        width: 13,
        height: 13,
        marginRight: 12,
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
        borderColor: '#FF6363',
        backgroundColor: '#FFFFFF',
        height: 56,
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
    goPlanImage: {
        width: 12,
        height: 12,
        marginRight: 30,
    },
    vline: {
        width: 1,
        height: 46,
        borderRadius: 1,
        backgroundColor: '#D2D2D2',
    },
});
