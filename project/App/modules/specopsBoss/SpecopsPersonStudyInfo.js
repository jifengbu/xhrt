'use strict';
var React = require('react');
var ReactNative = require('react-native');
var {
    Image,
    StyleSheet,
    Text,
    View,
    ScrollView,
} = ReactNative;

var {DImage} = COMPONENTS;

module.exports = React.createClass({
    getInitialState() {
        return {
            studyInfo: null,
        };
    },
    componentDidMount() {
        this.getUserStudyInfo();
    },
    getUserStudyInfo() {
        var param = {
            userID: this.props.userID,
        };
        POST(app.route.ROUTE_GET_USER_STUDY_INFO, param, this.getUserStudyInfoSuccess);
    },
    getUserStudyInfoSuccess(data) {
        if (data.success) {
            this.setState({studyInfo: data.context});
        } else {
            Toast(data.msg);
        }
    },
    render() {
        var {studyInfo} = this.state;
        let headUrl = studyInfo&&studyInfo.headImg?studyInfo.headImg:studyInfo.sex===1?app.img.personal_sex_male:app.img.personal_sex_female;
        return (
            <View style={styles.personContainer}>
                {
                    studyInfo&&
                    <View>
                        <View style={styles.personalInfoContainer}>
                            <DImage
                                resizeMode='cover'
                                defaultSource={app.img.personal_head}
                                source={studyInfo.headImg?{uri: headUrl}:headUrl}
                                style={styles.headerIcon}  />
                            <View style={styles.personalInfoStyle}>
                                <View style={styles.nameContainer}>
                                    <Text style={[styles.nameText, {fontSize: 18}]} numberOfLines={1}>
                                        {studyInfo.userName}
                                    </Text>
                                    <View style={styles.verticalLine}>
                                    </View>
                                    <Text style={[styles.nameText, {fontSize: 12}]}>
                                        {studyInfo.alias}
                                    </Text>
                                </View>
                                <Text style={styles.companyText}>
                                    {(studyInfo.company ==null || studyInfo.company=='')?'您还未设置企业信息':studyInfo.company}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.divisionLine}>
                        </View>
                        <View style={styles.studyDetailContainer}>
                            <View style={styles.panelContainer}>
                                <View style={styles.timeContainer}>
                                    <Text style={[styles.timeStyle, {color: '#60A4F5'}]}>
                                        {studyInfo.watchVideoLength}
                                    </Text>
                                    <Text style={[styles.timeText, {alignSelf: 'flex-end'}]}>分钟</Text>
                                </View>
                                <Text style={styles.timeText}>总共学习</Text>
                            </View>
                            <View style={styles.vline}/>
                            <View style={styles.panelContainer}>
                                <View style={styles.timeContainer}>
                                    <Text style={[styles.timeStyle, {color: '#A2D66C'}]}>
                                        {studyInfo.overVideoStudy}
                                    </Text>
                                    <Text style={[styles.timeText, {alignSelf: 'flex-end'}]}>课时</Text>
                                </View>
                                <Text style={styles.timeText}>完成课程</Text>
                            </View>
                            <View style={styles.vline}/>
                            <View style={styles.panelContainer}>
                                <View style={styles.timeContainer}>
                                    <Text style={[styles.timeStyle, {color: '#FED057'}]}>
                                        {studyInfo.continuousLogin}
                                    </Text>
                                    <Text style={[styles.timeText, {alignSelf: 'flex-end'}]}>天</Text>
                                </View>
                                <Text style={styles.timeText}>累计学习</Text>
                            </View>
                        </View>
                    </View>
                }
            </View>
        );
      }
});

var styles = StyleSheet.create({
    personContainer: {
        width: sr.w-6,
        height: 147,
        alignSelf: 'center',
        borderRadius: 6,
        backgroundColor: '#FFFFFF',
    },
    personalInfoContainer: {
        height: 82,
        flexDirection: 'row',
    },
    headerIcon: {
        width: 54,
        height: 54,
        marginLeft: 18,
        marginTop: 15,
        borderRadius: 27,
    },
    personalInfoStyle: {
        marginLeft: 31,
        justifyContent: 'center',
        flexDirection: 'column',
    },
    nameContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 10,
    },
    nameText: {
        color: '#2A2A2A',
        fontFamily: 'STHeitiSC-Medium',
    },
    verticalLine: {
        width: 1,
        height: 12,
        marginLeft: 21,
        marginRight: 12,
        backgroundColor: '#D4D4D4',
    },
    companyText: {
        fontSize: 12,
        color: '#999999',
        fontFamily: 'STHeitiSC-Medium',
    },
    divisionLine: {
        width: sr.w-24,
        height: 1,
        alignSelf: 'center',
        backgroundColor: '#F8F8F8',
    },
    studyDetailContainer: {
        height: 62,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    panelContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    timeContainer: {
        height: 24,
        flexDirection: 'row',
        marginBottom: 6,
    },
    timeStyle: {
        fontSize: 18,
        fontFamily: 'STHeitiSC-Medium',
    },
    timeText: {
        color: '#2A2A2A',
        fontSize: 12,
        fontFamily: 'STHeitiSC-Medium',
    },
    vline: {
        width: 1,
        height: 34,
        backgroundColor: '#EEEEEE',
    },
});
