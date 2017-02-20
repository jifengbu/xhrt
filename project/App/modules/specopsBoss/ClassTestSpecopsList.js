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

module.exports = React.createClass({
    statics: {
        title: '随堂测试成绩',
    },
    getInitialState() {
        return {
            excellent: null,
            good: null,
            medium: null,
            poor: null,
        };
    },
    componentDidMount() {
        this.getPersonalQuizzesDetailsData();
    },
    getPersonalQuizzesDetailsData() {
        var param = {
            companyId: app.personal.info.userID,
            userID: app.personal.info.userID,
        };
        POST(app.route.ROUTE_GET_PERSONAL_QUIZZES_DETAILS, param, this.getPersonalQuizzesDetailsDataSuccess);
    },
    getPersonalQuizzesDetailsDataSuccess(data) {
        if (data.success) {
            let {excellent, good, medium, poor} = data.context;
            this.setState({excellent, good, medium, poor});
        } else {
            Toast(data.msg);
        }
    },
    renderRow(data) {
        let title = data.quizzesData.sectionMax + '~' + data.quizzesData.sectionMin + ' (分) ' + data.quizzesData.number + ' 次';
        return (
            <View style={styles.itemContainer}>
                <View style={styles.headerContainer}>
                    <Text style={styles.monthStyle}>
                        {title}
                    </Text>
                </View>
                <View>
                    {
                        data.quizzesData.contentList.map((item, i)=>{
                            return (
                                <View key={i} style={styles.itemContainer}>
                                    <View style={styles.listItemContain}>
                                        <View style={styles.rowRight}>
                                            <View style={styles.courseContent}>
                                                <Text numberOfLines={1} style={styles.courseText} >
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
                                                    {item.submitTime}
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
    render() {
        let {excellent, good, medium, poor} = this.state;
        return (
            <View style={styles.container}>
                <ScrollView>
                    {
                        excellent&&<this.renderRow quizzesData={excellent}/>
                    }
                    {
                        good&&<this.renderRow quizzesData={good}/>
                    }
                    {                        medium&&<this.renderRow quizzesData={medium}/>                    }                    {                        poor&&<this.renderRow quizzesData={poor}/>                    }                </ScrollView>            </View>
        )
    },
});


var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
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
