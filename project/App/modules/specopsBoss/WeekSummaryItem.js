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
        return {
            daySummary: '',
            problemArray: [],
        };
    },
    clearMonthData() {
        // test data
        this.userHeadImage = '';
        this.userHeadName = '姓名姓名';
        this.userHeadJob = '职位职位';
        this.userHeadTime = '66:66';
        this.setState({daySummary:'jpdfajlsdfjlsdkfjiwefjdslfakd'});

        let testData = {};
        testData.problemTitle = '这是测试';
        testData.problemContent = '这不测试';
        for (var i = 0; i < 3; i++) {
            this.state.problemArray.push(testData);
        }

        // process data
        if (this.props.planData && this.props.planData.length > 0) {
            let {planData} = this.props;

            this.userHeadImage = planData.userImg;
            this.userHeadName = planData.userName;
            this.userHeadJob = planData.post;
            this.userHeadTime = planData.submitDate;

            this.setState({daySummary:planData.daySummary.content});

            let testData = {};
            for (let i = 0; i < planData.fixedProblem.length; i++) {
                testData.problemTitle = planData.fixedProblem[i].problemTitle;
                testData.problemContent = planData.fixedProblem[i].problemContent;
                this.state.problemArray.push(testData);
            }
            for (let j= 0; j < planData.myQuestionList.length; j++) {
                testData.problemTitle = planData.myQuestionList[j].title;
                testData.problemContent = planData.myQuestionList[j].content;
                this.state.problemArray.push(testData);
            }
        }
    },
    componentDidMount() {
        this.clearMonthData();
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
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.separator2}></View>
                <this.monthPlanHead />
                <this.weekPlanConclusion />
                <this.weekProblemView />
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
    //每日总结
    weekPlanConclusion() {
        var {daySummary} = this.state;
        return (
            <View onLayout={this.onLayoutSummary}>
                <View style={styles.separator}></View>
                <View style={styles.titleContainerWeek}>
                    <Text style={styles.headItemText}>
                        工作总结
                    </Text>
                </View>
                <View style={styles.separator1}></View>
                <TouchableOpacity style={styles.inputContainerDaySummary}
                                onLongPress={this.onLongPress.bind(null, this.state.daySummary)}>
                    <Text
                        style={styles.detailStyleDaySummary}
                        multiline={true}>
                        {this.state.daySummary}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    },
    //每日备注
    weekProblemView() {
        var {problemArray} = this.state;
        return(
            <View onLayout={this.onLayoutProblem}>
            <View style={styles.titleContainerWeek}>
                <Text style={styles.headItemText}>
                    每日三省
                </Text>
            </View>
            <View style={styles.separator1}></View>
            {
                problemArray.map((item, i)=>{
                if (item.problemContent) {
                    var textInputHeight = this.calculateStrLength(item.problemContent, 34);
                }
                return(
                    <View key={i}>
                        <Text style={styles.questionTitle}>
                            {(i+1)+'、'+item.problemTitle}
                        </Text>
                        <View style={styles.separator3}></View>
                        <TouchableOpacity onLongPress={this.onLongPress.bind(null, item.problemContent)}>
                        {
                            item.problemContent==''?
                            <Text
                                style={styles.detailStyle2}
                                multiline={true}>
                                {'未完成'}
                            </Text>
                            :
                            <Text
                                style={styles.detailStyle}
                                multiline={true}>
                                {item.problemContent}
                            </Text>
                        }
                        </TouchableOpacity>
                    </View>
                )
                })
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
    questionTitle: {
        marginLeft: 18,
        color:'#535353',
        fontFamily:'STHeitiSC-Medium',
        fontSize: 14,
        marginVertical: 6,
        width: sr.w-44,
    },
    titleContainerWeek: {
        alignItems: 'center',
        height: 44,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headItemText: {
        marginLeft: 18,
        fontSize: 18,
        color: '#333333',
        fontWeight: '500',
        fontFamily:'STHeitiSC-Medium',
    },

    separator: {
        width: sr.w,
        height: 1,
        backgroundColor: '#F1F0F5',
        alignSelf: 'center',
    },
    separator1: {
        marginLeft: 18,
        width: sr.w-18,
        height: 1,
        backgroundColor: '#F1F0F5',
    },
    separator2: {
        width: sr.w,
        height: 10,
        backgroundColor: '#F1F0F5',
        alignSelf: 'center',
    },
    separator3: {
        width: sr.w-36,
        height: 1,
        backgroundColor: '#F1F0F5',
        marginLeft: 18,
    },
    inputContainerDaySummary: {
        marginTop: 4,
        backgroundColor: '#FFFFFF',
    },
    detailStyle:{
        fontSize:16,
        color: '#000000',
        marginVertical: 6,
        marginHorizontal: 18,
        fontWeight: '500',
        fontFamily:'STHeitiSC-Light',
    },
    detailStyle2:{
        fontSize:16,
        color: '#999999',
        marginVertical: 6,
        marginHorizontal: 18,
        backgroundColor: '#F1F1F1',
        fontWeight: '500',
        fontFamily:'STHeitiSC-Light',
    },
    detailStyleDaySummary:{
        marginHorizontal: 18,
        fontSize: 16,
        color: '#333333',
        fontWeight: '500',
        fontFamily:'STHeitiSC-Medium',
    },
});
