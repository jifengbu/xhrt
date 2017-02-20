import React from 'react';
import {
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
} from 'react-native';

var moment = require('moment');
var NoCommitUserHead = require('./NoCommitUserHead.js');
var MonthPlanItem = require('./MonthPlanItem.js');
const {STATUS_TEXT_HIDE, STATUS_START_LOAD, STATUS_HAVE_MORE, STATUS_NO_DATA, STATUS_ALL_LOADED, STATUS_LOAD_ERROR} = CONSTANTS.LISTVIEW_INFINITE.STATUS;

module.exports = React.createClass({
    getInitialState() {
        var _scrollView: ScrollView;
        this.scrollView = _scrollView;
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.MonthPlanListData = [0,1];
        this.MonthDataStr = [];
        this.MonthDataNum = [];
        this.NoCommitUser = [];
        this.pageNo = 1;

        this.createTimeData('2016-06-11');
        return {
            tabIndex: 0,
            infiniteLoadStatus: STATUS_TEXT_HIDE,
        };
    },
    componentDidMount() {
        setTimeout(()=>{
            let currentMonthIndex = this.getCurrentMonthIndex();

            let movePos = 0;
            if (currentMonthIndex > 6) {
                movePos = currentMonthIndex - 6;
                // scrollTo current month
                InteractionManager.runAfterInteractions(() => {
                    setTimeout(()=>{
                        this.scrollView.scrollTo({x: sr.ws(56*movePos)});
                    }, 200);
                });
            }
            this.changeTab(currentMonthIndex);
        }, 200);
    },
    // get time data
    createTimeData(joinTime) {
        let joinYear = moment(joinTime).year();
        let joinMonth = moment(joinTime).month();

        let dateDateNum = {};
        let currentYear = moment().year();
        let currentMonth = moment().month();

        for (var i = joinYear; i <= currentYear; i++) {
            let month = [];
            let monthNUm = [];
            for (var j = 0; j < 12; j++) {
                if (i == joinYear) {
                    if (j >= joinMonth) {
                        monthNUm.push(j);
                    }
                }else if (i == currentYear) {
                    if (j <= currentMonth) {
                        monthNUm.push(j);
                    }
                }else {
                    monthNUm.push(j);
                }
            }
            dateDateNum[i] = monthNUm;
        }

        this.MonthDataNum = [];
        let tempTime = moment();
        tempTime.set('date', 15);
        for(var i in dateDateNum){
            for (var j = 0; j < dateDateNum[i].length; j++) {
                tempTime.set('year', i);
                tempTime.set('month', dateDateNum[i][j]);
                this.MonthDataNum.push(tempTime.format('YYYY-MM-DD'));
            }
        }
        while (this.MonthDataNum.length < 7 && this.MonthDataNum.length > 0) {
            let addStr = moment(this.MonthDataNum[this.MonthDataNum.length-1]).add(1, 'months').format('YYYY-MM-DD');
            this.MonthDataNum.push(addStr);
        }
        console.log('11111',this.MonthDataNum);

        this.MonthDataStr = [];
        for (var j = 0; j < this.MonthDataNum.length; j++) {
            this.MonthDataStr.push(moment(this.MonthDataNum[j]).month()+1+'月');
        }
        console.log('00000',this.MonthDataStr);
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
    getCurrentMonthIndex(){
        let tTime = moment();
        tTime.set('date', 15);
        let tTimeStr = tTime.format('YYYY-MM-DD');

        for (var i = 0; i < this.MonthDataNum.length; i++) {
            if (this.MonthDataNum[i] === tTimeStr) {
                return i;
            }
        }
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
    getMonthPlanList(month) {
        var param = {
            companyId: app.personal.info.userID,
            date: month,
            pageNo: this.pageNo,
        };
        this.setState({infiniteLoadStatus: this.pageNo===1?STATUS_START_LOAD:STATUS_HAVE_MORE});
        POST(app.route.ROUTE_GET_MONTH_CENTEXE_USER_LIST, param, this.getMonthPlanListSuccess, this.getMonthPlanListFailed);
    },
    getMonthPlanListSuccess(data) {
        if (data.success) {
            // add new pageData to MonthPlanListData
            for (var i = 0; i < data.context.planContext.length; i++) {
                this.MonthPlanListData.push(data.context.planContext[i]);
            }
            var infiniteLoadStatus = data.context.planContext.length < CONSTANTS.PER_PAGE_COUNT ? STATUS_ALL_LOADED : STATUS_HAVE_MORE;
            this.setState({
                infiniteLoadStatus: infiniteLoadStatus,
            });

            // no commit user
            this.NoCommitUser = data.context.noUserList.slice(0);
        } else {
            this.getMonthPlanListFailed();
        }
    },
    getMonthPlanListFailed() {
        this.pageNo--;
        this.setState({infiniteLoadStatus: STATUS_LOAD_ERROR});
    },
    onEndReached() {
        console.log('------onEndReached');
        if (this.state.infiniteLoadStatus === STATUS_ALL_LOADED || this.state.infiniteLoadStatus === STATUS_TEXT_HIDE) {
            return;
        }
        this.pageNo++;
        this.getMonthPlanList(this.MonthDataNum[this.state.tabIndex]);
    },
    changeTab(index){
        console.log('------index month', index);
        if (this.state.tabIndex == index) {
            return;
        }
        this.setState({tabIndex:index});
        this.getMonthPlanList(this.MonthDataNum[index]);
        let month = index+1;
        this.currentTimeStr = moment(this.MonthDataNum[index]).format('YYYY年M月');
    },
    renderRow(obj, sectionID, rowID) {
        return (
            <MonthPlanItem planData={obj}/>
        )
    },
    renderFooter() {
        return (
            <View style={styles.listFooterContainer}>
                <Text style={styles.listFooter}>{CONSTANTS.LISTVIEW_INFINITE.TEXT[this.state.infiniteLoadStatus]}</Text>
            </View>
        )
    },
    renderHeader() {
        return (
            <View>
                <ScrollView style={styles.container}
                    ref={(scrollView) => {this.scrollView = scrollView;}}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}>
                    {
                        this.MonthDataStr.length > 0 &&
                        this.MonthDataStr.map((item, i)=>{
                            return (
                                <View key={i} style={styles.itemView}>
                                    <TouchableOpacity
                                        key={i}
                                        onPress={this.changeTab.bind(null, i)}
                                        style={[styles.tabButton, this.state.tabIndex===i?{borderTopWidth: 4, backgroundColor: '#FF8686', borderColor: '#FF6262'}:null]}>
                                        <Text style={[styles.tabText, this.state.tabIndex===i?{marginTop: 16, color: '#FFFFFF'}:null]} >
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                    {
                                        (i!==this.MonthDataStr.length-1 && this.state.tabIndex-1 !== i && this.state.tabIndex !== i) &&
                                        <View style={styles.vline}/>
                                    }
                                </View>
                            )
                        })
                    }
                </ScrollView>
                <View style={styles.currentTimeView}>
                    <Text style={styles.currentTimeText} >
                        {this.currentTimeStr}
                    </Text>
                </View>
                <NoCommitUserHead userData={this.NoCommitUser} style={styles.separator}/>
            </View>
        )
    },
    render() {
        return (
            <View style={styles.containerAll}
                  onStartShouldSetResponderCapture={this.onStartShouldSetResponderCapture}>
                <ListView
                    initialListSize={1}
                    onEndReachedThreshold={10}
                    enableEmptySections={true}
                    style={styles.listStyle}
                    onEndReached={this.onEndReached}
                    dataSource={this.ds.cloneWithRows(this.MonthPlanListData)}
                    renderRow={this.renderRow}
                    renderHeader={this.renderHeader}
                    renderFooter={this.renderFooter}
                    />
            </View>
        );
    },
});

var styles = StyleSheet.create({
    containerAll: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    currentTimeView: {
        width: sr.w,
        height: 24,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    currentTimeText: {
        marginTop: 4,
        fontSize: 16,
        color: '#454545',
        fontFamily:'STHeitiSC-Medium',
    },
    listStyle: {
        alignSelf:'stretch',
        backgroundColor: '#FFFFFF',
    },
    separator: {
        height:1,
        backgroundColor:'#F1F1F1',
    },
    blankView: {
        height:60,
    },
    itemView: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 56,
    },
    tabButton: {
        alignItems:'center',
        backgroundColor: '#F4FFFA',
        height: 56,
        width: sr.w/7,
    },
    vline: {
        width: 1,
        height: 40,
        backgroundColor: '#D2D2D2',
    },
    tabText: {
        marginTop: 20,
        fontSize: 12,
        color: '#888888',
        textAlign: 'center',
    },
    listFooterContainer: {
        height: 60,
        alignItems: 'center',
    },
    listFooter: {
        marginVertical: 10,
        color: 'gray',
        fontSize: 14,
    },
});
