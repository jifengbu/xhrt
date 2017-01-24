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
} = ReactNative;
var Button = require('@remobile/react-native-simple-button');
var CoursePlayer = require('../specops/CoursePlayer.js');
var WeekPlan = require('../specops/WeekPlan.js');
var MonthPlan = require('../specops/MonthPlan.js');
const TaskItem = React.createClass({
    render() {
        const {title, flagDate, msg, isOver,videoImage,buttonMsg} = this.props;
        return (
            <View style={styles.item}>
                <View style={styles.itemTop}>
                    <Image
                        resizeMode='contain'
                        source={app.img.task_specops_icon}
                        style={styles.itemIcon}>
                    </Image>
                    <View style={styles.itemRight}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.time}>{flagDate}</Text>
                    </View>
                </View>
                <View  style={styles.line} />
                <View style={styles.itemBottom}>
                    <Text style={styles.label}>{msg}</Text>
                </View>
                <View  style={styles.line} />
                <View style={styles.button}>
                    <Button textStyle={styles.buttonTextStyle} onPress={this.props.doStartAction}>{buttonMsg}</Button>
                </View>
            </View>
        );
    },
});

module.exports = React.createClass({
    getInitialState() {
        return {
            context: {},
        };
    },
    componentDidMount() {
        this.getSpecialTask();
    },
    getSpecialTask() {
        var param = {
            userID: "app.personal.info.userID",
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
    startStudy() {
        app.navigator.push({
            component: CoursePlayer,
            passProps: {lastStudyProgress: this.state.studyProgressDetail},
        });
    },
    writeMonthPlan() {
        app.navigator.push({
            component: MonthPlan,
        });
    },
    writeDayPlan() {
        app.navigator.push({
            component: WeekPlan,
            passProps: {
                indexPos: 0,
            }
        });
    },
    writeWeekPlan() {
        app.navigator.push({
            component: MonthPlan,
        });
    },
    writeDaySummary() {
        app.navigator.push({
            component: WeekPlan,
            passProps: {
                indexPos: 1,
            }
        });
    },
    writeDayProblem() {
        app.navigator.push({
            component: WeekPlan,
            passProps: {
                indexPos: 2,
            }
        });
    },
    render() {
        const {context} = this.state;
        return (
            <ScrollView style={styles.container}>
                <TaskItem {...context.specialStudyCurriculum} doStartAction={this.startStudy} />
                <TaskItem {...context.monthPlan} doStartAction={this.writeMonthPlan} />
                <TaskItem {...context.dayPlan} doStartAction={this.writeDayPlan} />
                <TaskItem {...context.weekPlan} doStartAction={this.writeWeekPlan} />
                <TaskItem {...context.daySummary} doStartAction={this.writeDaySummary} />
                <TaskItem {...context.dayProblem} doStartAction={this.writeDayProblem} />
            </ScrollView>
        );
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
        height: 80,
        justifyContent: 'center',
        marginLeft: 60,
    },
    label: {
        fontSize: 16,
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
