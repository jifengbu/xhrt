'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
    ScrollView,
    Text,
    ListView,
    Image,
    TouchableOpacity,
    TouchableHighlight,
    RefreshControl,
} = ReactNative;
var Button = require('@remobile/react-native-simple-button');
var CoursePlayer = require('../specops/CoursePlayer.js');
var WeekPlan = require('../specops/WeekPlan.js');
var MonthPlan = require('../specops/MonthPlan.js');
var Subscribable = require('Subscribable');
var PersonalInfoMgr = require('../../manager/PersonalInfoMgr.js');
var Unauthorized = require('../specops/Unauthorized.js');

const TaskItem = React.createClass({
    render() {
        const {title, flagDate, msg, isOver,videoImage,buttonMsg} = this.props;
        return (
            <View style={styles.item}>
                <View style={styles.itemTop}>
                    <Image
                        resizeMode='contain'
                        source={videoImage?app.img.task_play_blue:app.img.task_specops_icon}
                        style={styles.itemIcon}>
                    </Image>
                    <View style={styles.itemRight}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.time}>{flagDate}</Text>
                    </View>
                </View>
                <View  style={styles.line} />
                <View style={[styles.itemBottom,videoImage?{height:47}:null]}>
                    <Text style={styles.label}>{msg}</Text>
                </View>
                {videoImage&&<Image
                    resizeMode='stretch'
                    source={{uri:videoImage}}
                    style={styles.itemImg}>
                </Image>}
                <View  style={styles.line} />
                <View style={styles.button}>
                    <Button textStyle={styles.buttonTextStyle} onPress={this.props.doStartAction}>{buttonMsg}</Button>
                </View>
            </View>
        );
    },
});

module.exports = React.createClass({
    mixins: [Subscribable.Mixin],
    getInitialState() {
        const {isAgent, isSpecialSoldier} = app.personal.info;
        return {
            context: {},
            authorized: isAgent||isSpecialSoldier, //是否是特种兵1—是  0—不是
        };
    },
    componentDidMount() {
        this.getSpecialTask();
        this.addListenerOn(PersonalInfoMgr, 'UPDATE_SPECOPS_TASK_EVENT', this.getSpecialTask);
    },
    getSpecialTask() {
        var param = {
            userID: app.personal.info.userID,
        };
        POST(app.route.ROUTE_GET_SPECIAL_TASK, param, this.getSpecialTaskSuccess, true);
    },
    getSpecialTaskSuccess(data) {
        if (data.success) {
            this.setState({context: data.context||{}});
        } else {
            Toast(data.msg);
        }
    },
    startStudy(obj) {
        app.navigator.push({
            component: CoursePlayer,
            passProps: {otherVideoID:obj.videoID,newSee:obj.newSee,lastSee:obj.lastSee,update:true},
        });
    },
    writeMonthPlan() {
        app.navigator.push({
            component: MonthPlan,
            passProps: {
                refreshTask:this.getSpecialTask,
            }
        });
    },
    writeDayPlan() {
        app.navigator.push({
            component: WeekPlan,
            passProps: {
                indexPos: 0,
                refreshTask:this.getSpecialTask,
            }
        });
    },
    writeWeekPlan() {
        app.navigator.push({
            component: MonthPlan,
            passProps: {
                refreshTask:this.getSpecialTask,
            }
        });
    },
    writeDaySummary() {
        app.navigator.push({
            component: WeekPlan,
            passProps: {
                indexPos: 1,
                refreshTask:this.getSpecialTask,
            }
        });
    },
    writeDayProblem() {
        app.navigator.push({
            component: WeekPlan,
            passProps: {
                indexPos: 2,
                refreshTask:this.getSpecialTask,
            }
        });
    },
    setAuthorized() {
        app.personal.setSpecialSoldier(true);
        this.setState({authorized: true});
    },
    render() {
        const {context,authorized} = this.state;
        if(authorized){
            return (
                <ScrollView style={styles.container} refreshControl={
                    <RefreshControl
                        style={{
                            backgroundColor : 'transparent',
                        }}
                        refreshing={false}
                        onRefresh={this.getSpecialTask}
                        title="正在刷新..."/> }>
                    {context.specialStudyCurriculum&&<TaskItem {...context.specialStudyCurriculum} doStartAction={this.startStudy.bind(null,context.specialStudyCurriculum)} />}
                    {context.monthPlan&&<TaskItem {...context.monthPlan} doStartAction={this.writeMonthPlan} />}
                    {context.dayPlan&&<TaskItem {...context.dayPlan} doStartAction={this.writeDayPlan} />}
                    {context.weekPlan&&<TaskItem {...context.weekPlan} doStartAction={this.writeWeekPlan} />}
                    {context.daySummary&&<TaskItem {...context.daySummary} doStartAction={this.writeDaySummary} />}
                    {context.dayProblem&&<TaskItem {...context.dayProblem} doStartAction={this.writeDayProblem} />}
                </ScrollView>
            );
        } else {
            return (
                <Unauthorized setAuthorized={this.setAuthorized}/>
            );
        }
    },
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F1F1',
    },
    item: {
        backgroundColor: '#FFFFFF',
        width: sr.w,
        marginTop: 10,
    },
    itemTop: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
    },
    itemIcon: {
        width: 36,
        height: 36,
        marginRight: 10,
        marginLeft: 20,
    },
    title: {
        fontSize: 14,
    },
    time: {
        fontSize: 12,
        color: '#AAAAAA',
    },
    itemRight: {
        justifyContent: 'space-around',
        height: 50,
        paddingVertical: 8,
    },
    line: {
        backgroundColor: '#F1F1F1',
        height: 1,
    },
    itemBottom: {
        height: 64,
        justifyContent: 'center',
    },
    itemImg: {
        height: 166,
        marginHorizontal:14,
        marginBottom:14,
    },
    label: {
        fontSize: 16,
        textAlign:'center',
    },
    button: {
        height: 40,
        justifyContent: 'center',
    },
    buttonTextStyle: {
        fontSize: 16,
        fontWeight: 'normal',
        color: '#6190C6',
    },
});
