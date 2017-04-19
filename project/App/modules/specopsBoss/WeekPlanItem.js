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

const RecordItemView = require('./BossRecordItem.js');
const moment = require('moment');
const { Button, InputBox, DImage } = COMPONENTS;
const CopyBox = require('../home/CopyBox.js');
const SpecopsPerson = require('./SpecopsPerson.js');

module.exports = React.createClass({
    getInitialState () {
        this.dayData = {};
        this.dayData.plan = [];
        this.dayData.actual = [];
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return {
            weekCount: 0,
            memWeekTime: [],
            haveData: false,
        };
    },
    clearMonthData () {
        this.dayData = {};
        this.dayData.plan = [];
        this.dayData.actual = [];

        // process data.
        if (this.props.planData) {
            const { planData } = this.props;

            this.userId = planData.userId;
            this.userHeadImage = planData.userImg;
            this.sex = planData.sex;
            this.userHeadName = planData.userName;
            this.userHeadJob = planData.post;
            this.userHeadTime = planData.submitDate;

            if (planData.dayPlan) {
                this.dayData.plan = planData.dayPlan.slice(0);
            }
            if (planData.actualWorks) {
                this.dayData.actual = planData.actualWorks.slice(0);
            }
        }

        setTimeout(() => {
            this.setState({ haveData: true });
        }, 600);
    },
    componentDidMount () {
        this.clearMonthData();
    },
    render () {
        return (
            <View style={styles.container}>
                {
                this.state.haveData &&
                <View>
                    <View style={styles.separator2} />
                    <this.monthPlanHead />
                    <this.monthPlanPurpose />
                </View>
            }
            </View>
        );
    },
    toSpecopsPerson (userId) {
        app.navigator.push({
            component: SpecopsPerson,
            passProps: { userID: userId },
        });
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
    // 头像view
    monthPlanHead () {
        const nameTemWidth = this.calculateStrLength(this.userHeadName);
        const postTemWidth = this.calculateStrLength(this.userHeadJob);
        const nameWidth = nameTemWidth * 13 + 3;
        const postWidth = postTemWidth * 6 + 3;
        const headUrl = this.userHeadImage ? this.userHeadImage : this.sex === 1 ? app.img.personal_sex_male : app.img.personal_sex_female;
        return (
            <View style={styles.monthPlanHeadView}>
                <View style={styles.monthPlanHeadView1}>
                    <TouchableOpacity onPress={this.toSpecopsPerson.bind(null, this.userId)}>
                        <DImage
                            resizeMode='cover'
                            defaultSource={app.img.personal_head}
                            source={this.userHeadImage ? { uri: headUrl } : headUrl}
                            style={styles.HeadViewImage} />
                    </TouchableOpacity>
                    <View style={{ marginLeft: 15, width: nameWidth > 130 ? sr.ws(130) : sr.ws(nameWidth) }}>
                        <Text numberOfLines={1} style={styles.HeadViewTextName}>
                            {this.userHeadName}
                        </Text>
                    </View>
                    {
                        this.userHeadJob != '' &&
                        <View style={[styles.rowPosition, { width: postWidth > 60 ? sr.ws(60) : sr.ws(postWidth) }]}>
                            <Text numberOfLines={1} style={styles.rowPositionText}>
                                {this.userHeadJob}
                            </Text>
                        </View>
                    }
                </View>
                <Text style={styles.HeadViewTextTime}>
                    {moment(this.userHeadTime).format('M月D日 HH:mm')}
                </Text>
            </View>
        );
    },
    // 工作计划
    monthPlanPurpose () {
        return (
            <View style={styles.monthPlanPurposeViewStyle}>
                <View style={styles.separator} />
                <View style={styles.titleContainerWeek}>
                    <Text style={styles.headItemText}>
                        计划工作项
                    </Text>
                </View>
                <View style={styles.separator3} />
                {
                    this.dayData.plan.map((item, i) => {
                        return (
                            <View key={i}>
                                <RecordItemView
                                    data={item}
                                    rowHeight={5}
                                    isWideStyle
                                    />
                                <View style={styles.separator3} />
                            </View>
                        );
                    })
                }
                <View style={styles.titleContainerWeek}>
                    <Text style={styles.headItemText}>
                        实际工作项
                    </Text>
                </View>
                <View style={styles.separator3} />
                {
                    this.dayData.actual.map((item, i) => {
                        return (
                            <View key={i}>
                                <RecordItemView
                                    data={item}
                                    rowHeight={5}
                                    haveImage
                                />
                                <View style={styles.separator3} />
                            </View>
                        );
                    })
                }
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
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
        borderRadius: 20,
    },
    HeadViewTextName: {
        fontSize: 20,
        color: '#333333',
        fontFamily:'STHeitiSC-Medium',
    },
    rowPosition: {
        marginLeft:10,
        backgroundColor: '#FF5E5F',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
    },
    rowPositionText: {
        fontFamily: 'STHeitiSC-Medium',
        fontSize:10,
        color: '#FFFFFF',
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
        marginLeft: 42,
        width: sr.w - 42,
        height: 1,
        backgroundColor: '#F1F0F5',
    },
});
