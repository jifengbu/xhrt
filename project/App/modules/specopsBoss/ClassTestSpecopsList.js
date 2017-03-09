'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    View,
    Text,
    Image,
    StyleSheet,
    ListView,
    ScrollView,
    TouchableOpacity,
    TouchableHighlight,
} = ReactNative;

var moment = require('moment');

module.exports = React.createClass({
    statics: {
        title: '随堂测试成绩',
    },
    getInitialState() {
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            excellent: null,
            good: null,
            medium: null,
            poor: null,
            listData:[],
            dataSource: this.ds.cloneWithRows([]),
        };
    },
    componentDidMount() {
        this.getPersonalQuizzesDetailsData();
    },
    getPersonalQuizzesDetailsData() {
        var param = {
            companyId: app.personal.info.companyInfo.companyId,
            userID: this.props.userID,
        };
        POST(app.route.ROUTE_GET_PERSONAL_QUIZZES_DETAILS, param, this.getPersonalQuizzesDetailsDataSuccess);
    },
    getPersonalQuizzesDetailsDataSuccess(data) {
        if (data.success) {
            let {excellent, good, medium, poor} = data.context;
            var listData = [];
            (excellent&&JSON.stringify(excellent)!='{}')&&listData.push(excellent);
            (good&&JSON.stringify(good)!='{}')&&listData.push(good);
            (medium&&JSON.stringify(medium)!='{}')&&listData.push(medium);
            (poor&&JSON.stringify(poor)!='{}')&&listData.push(poor);
            var infiniteLoadStatus = !listData.length ? '暂无成绩数据' : '没有更多数据';
            this.setState({dataSource: this.ds.cloneWithRows(listData), infiniteLoadStatus: infiniteLoadStatus});
        } else {
            Toast(data.msg);
        }
    },
    renderRow(obj) {
        let title = obj.sectionMax + '~' + obj.sectionMin + ' (分) ' + obj.number + ' 次';
        return (
            <View style={styles.itemContainer}>
                <View style={styles.headerContainer}>
                    <Text style={styles.monthStyle}>
                        {title}
                    </Text>
                </View>
                <View>
                    {
                        obj.contentList&&obj.contentList.map((item, i)=>{
                            return (
                                <View key={i} style={styles.itemContainer}>
                                    <View style={styles.listItemContain}>
                                        <View style={styles.rowRight}>
                                            <View style={styles.courseContent}>
                                                <Text style={styles.courseText} >
                                                    {'课程: '+item.courseTitle}
                                                </Text>
                                            </View>
                                            <View style={styles.courseScore}>
                                                <View style={styles.scoreStyle}>
                                                    <Text numberOfLines={1} style={styles.scoreText} >
                                                        {item.mark}
                                                    </Text>
                                                    <Text numberOfLines={1} style={styles.scoreText1} >
                                                        {'分'}
                                                    </Text>
                                                </View>
                                                <Text numberOfLines={1} style={styles.dateText} >
                                                    {moment(item.submitTime).format('YYYY.MM.DD')}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.separator}></View>
                                </View>
                            )
                        })
                    }
                </View>
            </View>
        );
    },
    renderFooter() {
        var status = this.state.infiniteLoadStatus;
        return (
            <View style={styles.listFooterContainer}>
                <Text style={styles.listFooter}>{status}</Text>
            </View>
        )
    },
    render() {
        let {excellent, good, medium, poor} = this.state;
        return (
            <View style={styles.container}>
                <ListView
                    initialListSize={1}
                    enableEmptySections={true}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    renderFooter={this.renderFooter}/>
            </View>
        )
    },
});


var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    listFooterContainer: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listFooter: {
        color: 'gray',
        fontSize: 14,
    },
    itemContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    separator: {
        width: sr.w,
        backgroundColor: '#EDEDED',
        height: 1,
    },
    headerContainer: {
        width: sr.w,
        height: 36,
        justifyContent: 'center',
        backgroundColor: '#F1F1F1',
    },
    monthStyle: {
        fontSize: 15,
        color: '#999999',
        marginLeft: 24,
    },
    listItemContain: {
        flexDirection: 'row',
        width: sr.w,
        height: 70,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    rowLeft: {
        marginLeft: 19,
    },
    headImg: {
        height: 40,
        width: 40,
        borderRadius: 20,
    },
    rowRight: {
        flex: 1,
        marginLeft: 14,
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    courseContent: {
        flexDirection: 'column',
        justifyContent: 'center',
    },
    rightTopStyle: {
        flexDirection: 'row',
    },
    nameText: {
        fontSize: 16,
        color: '#313131',
        fontWeight: '800',
    },
    positionText: {
        fontSize: 10,
        color: '#FFFFFF',
        fontFamily: 'STHeitiSC-Medium',
        backgroundColor: '#FF7373',
        marginLeft: 20,
        paddingHorizontal: 3,
    },
    courseText: {
        width: sr.w-90,
        fontSize: 16,
        color: '#424242',
        fontFamily: 'STHeitiSC-Medium',
    },
    courseScore: {
        alignItems: 'center',
        marginRight: 15,
    },
    scoreStyle: {
        flexDirection: 'row',
    },
    scoreText: {
        fontSize: 24,
        color: '#FF6363',
        fontWeight: '600',
    },
    scoreText1: {
        fontSize: 16,
        fontWeight: '600',
        color: '#494949',
        marginBottom: 3,
        alignSelf: 'flex-end',
    },
    dateText: {
        fontSize: 10,
        color: '#A7A7A7',
        marginTop: 2,
        fontFamily: 'STHeitiSC-Light',
    },
});
