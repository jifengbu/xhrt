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
            weekCount: 0,
            planDataSource: this.ds.cloneWithRows([]),
            actualDataSource: this.ds.cloneWithRows([]),
            memWeekTime: [],
        };
    },
    clearMonthData() {
        this.dayData = {};
        this.dayData.plan = [];
        this.dayData.actual = [];

        this.userHeadImage = '';
        this.userHeadName = '姓名姓名';
        this.userHeadJob = '职位职位';
        this.userHeadTime = '66:66';

        // test data
        let obj = {};
        obj.content = '12345';
        obj.isOver = 0;
        this.dayData.plan.push(obj);
        this.dayData.plan.push(obj);
        this.dayData.plan.push(obj);
        this.dayData.actual.push(obj);
        this.dayData.actual.push(obj);
        this.dayData.actual.push(obj);

        // process data.
        if (this.props.planData && this.props.planData.length > 0) {
            let {planData} = this.props;

            this.userHeadImage = planData.userImg;
            this.userHeadName = planData.userName;
            this.userHeadJob = planData.post;
            this.userHeadTime = planData.submitDate;

            this.dayData.plan = planData.dayplan.slice(0);
            this.dayData.actual = planData.actualWorks.slice(0);
        }

        this.setState({planDataSource: this.ds.cloneWithRows(this.dayData.plan)});
        this.setState({actualDataSource: this.ds.cloneWithRows(this.dayData.actual)});
    },
    componentDidMount() {
        this.clearMonthData();
    },
    renderSeparator(sectionID, rowID) {
        return (
            <View style={styles.separator3} key={rowID}/>
        );
    },
    renderRowPlan(obj) {
        return (
            <RecordItemView
                data={obj}
                rowHeight={5}
                isWideStyle={true}
                />
        )
    },
    renderRowActual(obj) {
        return (
            <RecordItemView
                data={obj}
                rowHeight={5}
                haveImage={true}
                />
        )
    },
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.separator2}></View>
                <this.monthPlanHead />
                <this.monthPlanPurpose />
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
    //工作计划
    monthPlanPurpose() {
        return (
            <View style={styles.monthPlanPurposeViewStyle}>
                <View style={styles.separator}></View>
                <View style={styles.titleContainerWeek}>
                    <Text style={styles.headItemText}>
                        计划工作项
                    </Text>
                </View>
                <View style={styles.separator3}></View>
                <ListView
                    style={styles.list}
                    enableEmptySections={true}
                    dataSource={this.state.planDataSource}
                    renderRow={this.renderRowPlan}
                    renderSeparator={this.renderSeparator}
                    />
                <View style={styles.titleContainerWeek}>
                    <Text style={styles.headItemText}>
                        实际工作项
                    </Text>
                </View>
                <View style={styles.separator3}></View>
                <ListView
                    style={styles.list}
                    enableEmptySections={true}
                    dataSource={this.state.actualDataSource}
                    renderRow={this.renderRowActual}
                    renderSeparator={this.renderSeparator}
                    />
            </View>
        )
    },
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
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
    headItemText: {
        marginLeft: 32,
        fontSize: 16,
        color: '#333333',
        fontWeight: '600',
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
        marginLeft: 42,
        width: sr.w-42,
        height: 1,
        backgroundColor: '#F1F0F5',
    },
});
