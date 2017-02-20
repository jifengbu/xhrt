'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    RefreshControl,
} = ReactNative;
var Button = require('@remobile/react-native-simple-button');

const TaskItem = React.createClass({
    render() {
        const {title, flagDate, msg, isOver, doStartTrain} = this.props;
        return (
            <View style={styles.item}>
                <View style={styles.itemTop}>
                    <Image
                        resizeMode='contain'
                        source={app.img.task_train_icon}
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
                {
                    !isOver &&
                    <View>
                        <View  style={styles.line} />
                        <View style={styles.button}>
                            <Button textStyle={styles.buttonTextStyle} onPress={doStartTrain}>开始训练</Button>
                        </View>
                    </View>
                }
            </View>
        );
    },
});

module.exports = React.createClass({
    getInitialState() {
        return {
            taskList: [],
        };
    },
    componentDidMount() {
        this.getTaskList();
    },
    insertCurrentTaskLog(timingTaskID,week) {
            var param = {
                userID: app.personal.info.userID,
                timingTaskID: timingTaskID,
                week:week,
                type: 2,
            };
            POST(app.route.ROUTE_INSERT_CURRENT_TASK_LOG, param,this.insertCurrentTaskLogSuccess);
    },
    insertCurrentTaskLogSuccess(data){
        app.navigator.popToTop();
        app.personal.setIndexTab(3);
    },
    getTaskList() {
		var param = {
			userID: app.personal.info.userID,
		};
		POST(app.route.ROUTE_GET_TRAIN_TASK, param, this.getTaskListSuccess, true);
	},
	getTaskListSuccess(data) {
		if (data.success) {
			this.setState({taskList: data.context.trainTask||[]});
		} else {
			Toast(data.msg);
		}
	},
    doStartTrain(timingTaskID,week) {
        this.insertCurrentTaskLog(timingTaskID,week);
    },
    render() {
        const {taskList} = this.state;
        return (
            <ScrollView style={styles.container} refreshControl={
                <RefreshControl
                    style={{
                        backgroundColor : 'transparent',
                    }}
                    refreshing={false}
                    onRefresh={this.getTaskList}
                    title="正在刷新..."/> }>
                {taskList.map((item, i)=>(
                    <TaskItem {...item} key={i} doStartTrain={this.doStartTrain.bind(null,item.timingTaskID,item.week)}/>
                ))}
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
    },
    label: {
        fontSize: 16,
        textAlign:'center'
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
