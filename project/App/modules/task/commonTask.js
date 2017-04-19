'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    Text,
    ListView,
    Image,
    TouchableOpacity,
    TouchableHighlight,
    ScrollView,
    RefreshControl,
} = ReactNative;

const TaskItem = React.createClass({
    render () {
        const { title, flagDate, msg } = this.props;
        return (
            <View style={styles.item}>
                <View style={styles.itemTop}>
                    <Image
                        resizeMode='contain'
                        source={app.img.task_common_icon}
                        style={styles.itemIcon} />
                    <View style={styles.itemRight}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.time}>{flagDate}</Text>
                    </View>
                </View>
                <View style={styles.line} />
                <View style={styles.itemBottom}>
                    <Text style={styles.label}>{msg}</Text>
                </View>
            </View>
        );
    },
});

module.exports = React.createClass({
    getInitialState () {
        return {
            taskList: [],
            showNoData:false,
        };
    },
    componentDidMount () {
        this.getTaskList();
    },
    getTaskList () {
        const param = {
            userID: app.personal.info.userID,
        };
        POST(app.route.ROUTE_GET_PLATFORM_TASK, param, this.getTaskListSuccess, true);
    },
    getTaskListSuccess (data) {
        if (data.success) {
            this.setState({ taskList: data.context.platformTask || [] });
            data.context.platformTask.length == 0 ? this.setState({ showNoData: true }) : this.setState({ showNoData: false });
        } else {
            Toast(data.msg);
        }
    },
    render () {
        const { taskList, showNoData } = this.state;
        return (
            <ScrollView style={styles.container} refreshControl={
                <RefreshControl
                    style={{
                        backgroundColor : 'transparent',
                    }}
                    refreshing={false}
                    onRefresh={this.getTaskList}
                    title='正在刷新...' />}>
                {taskList.map((item, i) => (
                    <TaskItem {...item} key={i} />
                ))}
                {showNoData && <Text style={{ color: 'gray', fontSize: 14, textAlign:'center', marginTop:20 }}>{'暂无数据！'}</Text>}
            </ScrollView>
        );
    },
});

const styles = StyleSheet.create({
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
        textAlign:'center',
    },
});
