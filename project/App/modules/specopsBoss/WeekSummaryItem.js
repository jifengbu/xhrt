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
var SpecopsPerson = require('./SpecopsPerson.js');

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
            lineHeight: 0,
            isLookAll: false,
            isShow: false,
        };
    },
    clearMonthData() {
        this.userId = '';
        this.userHeadImage = '';
        this.sex = -1;
        this.userHeadName = '';
        this.userHeadJob = '';
        this.userHeadTime = '';
        // process data
        if (this.props.planData) {
            let {planData} = this.props;
            this.userId = planData.userId;
            this.userHeadImage = planData.userImg;
            this.sex = planData.sex;
            this.userHeadName = planData.userName;
            this.userHeadJob = planData.post;
            this.userHeadTime = planData.submitDate;

            if (planData.daySummary) {
                this.setState({daySummary:planData.daySummary.content});
            }

            for (let i = 0; i < planData.fixedProblem.length; i++) {
                let testData = {};
                testData.problemTitle = '';
                testData.problemContent = '';
                testData.problemTitle = planData.fixedProblem[i].problemTitle;
                testData.problemContent = planData.fixedProblem[i].problemContent;
                this.state.problemArray.push(testData);
            }
            for (let j= 0; j < planData.myQuestionList.length; j++) {
                let testData = {};
                testData.problemTitle = '';
                testData.problemContent = '';
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
                <this.weekProblemView />
            </View>
        );
    },
    toSpecopsPerson(userId) {
        app.navigator.push({
            component: SpecopsPerson,
            passProps: {userID: userId},
        });
    },
    calculateStrWidth(oldStr) {
        let height = 0;
        let linesWidth = 0;
        if (oldStr) {
            oldStr = oldStr.replace(/<\/?.+?>/g,/<\/?.+?>/g,"");
            oldStr = oldStr.replace(/[\r\n]/g, '|');
            let StrArr = oldStr.split('|');
            for (var i = 0; i < StrArr.length; i++) {
                //计算字符串长度，一个汉字占2个字节
                linesWidth = StrArr[i].replace(/[^\x00-\xff]/g,"aa").length;
            }
            return linesWidth;
        }
    },
    // 头像view
    monthPlanHead() {
        let nameTemWidth = this.calculateStrWidth(this.userHeadName);
        let postTemWidth = this.calculateStrWidth(this.userHeadJob);
        let nameWidth = nameTemWidth*13+3;
        let postWidth = postTemWidth*6+3;
        let headUrl = this.userHeadImage?this.userHeadImage:this.sex===1?app.img.personal_sex_male:app.img.personal_sex_female;
        return (
            <View style={styles.monthPlanHeadView}>
                <View style={styles.monthPlanHeadView1}>
                    <TouchableOpacity onPress={this.toSpecopsPerson.bind(null,this.userId)}>
                        <DImage
                            resizeMode='cover'
                            defaultSource={app.img.personal_head}
                            source={this.userHeadImage?{uri: headUrl}:headUrl}
                            style={styles.HeadViewImage}  />
                    </TouchableOpacity>
                    <View style={{width: nameWidth>140?sr.ws(140):sr.ws(nameWidth)}}>
                        <Text numberOfLines={1} style={styles.HeadViewTextName}>
                            {this.userHeadName}
                        </Text>
                    </View>
                    {
                        this.userHeadJob != '' &&
                        <View style={[styles.rowPosition,{width: postWidth>56?sr.ws(56):sr.ws(postWidth)}]}>
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
        )
    },
    _measureLineHeight(e) {
        if (!this.state.lineheight) {
            var {height} = e.nativeEvent.layout;
            // this.setState({lineHeight: height});
            if (height >= 90) {
                this.setState({lineHeight: height, isShow: true});
            } else {
                this.setState({lineHeight: height});
            }
        }
    },
    doLookAll() {
        this.setState({isLookAll: !this.state.isLookAll});
    },
    //每日备注
    weekProblemView() {
        var {problemArray, isLookAll, lineHeight} = this.state;
        return(
            <View onLayout={this.onLayoutProblem}>
                <View style={styles.separator}>
                </View>
                <View style={styles.titleContainerWeek}>
                    <Text style={styles.headItemText}>
                        工作总结
                    </Text>
                </View>
                <View style={styles.separator1}>
                </View>
                <TouchableOpacity
                    style={[styles.inputContainerDaySummary, {height: lineHeight}]}
                    onLongPress={this.onLongPress.bind(null, this.state.daySummary)}>
                    <Text
                        onLayout={this._measureLineHeight}
                        style={styles.detailStyleDaySummary}
                        numberOfLines={isLookAll?200:4}>
                        {this.state.daySummary}
                    </Text>
                    {
                        !isLookAll&&lineHeight>75&&
                        <Image resizeMode='stretch' source={app.img.specops_mask} style={[styles.maskImage, {height: lineHeight/2}]}/>
                    }
                </TouchableOpacity>
                {
                    lineHeight<25&&!isLookAll&&
                    <View style={styles.weekContainer}>
                        <View style={styles.titleContainerWeek}>
                            <Text style={styles.headItemText}>
                                每日三省
                            </Text>
                        </View>
                        <View style={styles.separator1}></View>
                        {
                            problemArray.length>0&&
                            <View>
                                <Text style={styles.questionTitle}>
                                    {'1、'+problemArray[0].problemTitle}
                                </Text>
                                {
                                    problemArray[0].problemContent==''?
                                    <Text
                                        style={styles.detailStyle2}
                                        multiline={true}>
                                        {'未完成'}
                                    </Text>
                                    :
                                    <Text
                                        numberOfLines={1}
                                        style={styles.detailStyle}
                                        multiline={true}>
                                        {problemArray[0].problemContent}
                                    </Text>
                                }
                            </View>
                        }
                        {
                            !isLookAll&&
                            <Image resizeMode='stretch' source={app.img.specops_mask} style={[styles.maskImage, {height: 50}]}/>
                        }
                    </View>
                }
                {
                    (lineHeight>25&&lineHeight<50&&!isLookAll)&&
                    <View style={styles.weekContainer}>
                        <View style={styles.titleContainerWeek}>
                            <Text style={styles.headItemText}>
                                每日三省
                            </Text>
                        </View>
                        <View style={styles.separator1}></View>
                        {
                            problemArray.length>0&&
                            <Text style={styles.questionTitle}>
                                {'1、'+problemArray[0].problemTitle}
                            </Text>
                        }
                        {
                            !isLookAll&&
                            <Image resizeMode='stretch' source={app.img.specops_mask} style={[styles.maskImage, {height: 50}]}/>
                        }
                    </View>
                }
                {
                    (lineHeight>50&&lineHeight<75&&!isLookAll)&&
                    <View style={styles.weekContainer}>
                        <View style={styles.titleContainerWeek}>
                            <Text style={styles.headItemText}>
                                每日三省
                            </Text>
                        </View>
                        <View style={styles.separator1}></View>
                        {
                            !isLookAll&&
                            <Image resizeMode='stretch' source={app.img.specops_mask} style={[styles.maskImage, {height: 50}]}/>
                        }
                    </View>
                }
                {
                    isLookAll&&
                    <View style={styles.weekContainer}>
                        <View style={styles.titleContainerWeek}>
                            <Text style={styles.headItemText}>
                                每日三省
                            </Text>
                        </View>
                        <View style={styles.separator1}>
                        </View>
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
                                        <View style={styles.separator3}>
                                        </View>
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
                }
                <TouchableOpacity onPress={this.doLookAll} style={styles.lookAllStyle}>
                    <Text style={styles.lookAllText}>{isLookAll?'点击收起':'点击展开更多'}</Text>
                </TouchableOpacity>
            </View>
        )
    },
});

var styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF'
    },
    weekContainer: {
        width: sr.w,
        flexDirection: 'column',
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
        marginLeft: 12,
        fontSize: 20,
        color: '#333333',
        fontFamily:'STHeitiSC-Medium',
    },
    rowPosition: {
        marginLeft:18,
        backgroundColor: '#FF5E5F',
        borderRadius: 2,
    },
    rowPositionText: {
        fontFamily: 'STHeitiSC-Medium',
        fontSize:10,
        marginHorizontal: 3,
        color: '#FFFFFF',
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
        color: '#FF6A6A',
        marginVertical: 6,
        marginHorizontal: 18,
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
    maskImage: {
        width: sr.w,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
    lookAllStyle: {
        width: 100,
        height: 30,
        marginTop: 10,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    lookAllView: {
        width: sr.w,
        height: 20,
        backgroundColor: 'transparent',
    },
    lookAllText: {
        fontSize: 14,
        color: '#45B0F7',
        fontFamily: 'STHeitiSC-Medium',
        marginBottom: 10,
    },
});
