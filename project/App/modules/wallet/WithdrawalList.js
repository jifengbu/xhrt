'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
} = ReactNative;

const moment = require('moment');
const WithdrawRules = require('./WithdrawalRules.js');
const PageList = require('./PageList20.js');
const { Button, MessageBox, DImage } = COMPONENTS;

module.exports = React.createClass({
    statics: {
        color: '#FFFFFF',
        title: '提现记录',
        leftButton: { image: app.img.common_back, handler: () => { app.navigator.pop(); } },
        rightButton: { image: app.img.wallet_question_white, handler: () => { app.scene.toggleMenuPanel(); } },
    },
    toggleMenuPanel() {
        app.navigator.push({
            component: WithdrawRules,
        });
    },
    renderRow (obj, sectionID, rowID, onRowHighlighted) {
        let applySource = obj.source==0?'微信-提现':obj.source==1?'支付宝-提现':'银行卡-提现';
        let applyDate = moment(obj.createDate).format('YYYY/MM/DD HH:mm');
        // 0=审核中, 1=审核通过, 2=审核不通过,3=取消申请,4=已经划拨
        let applyState = '审核中';
        let bgColor = '#26aa28';
        if (obj.state==1) {
            applyState = '审核通过';
            bgColor = '#61b548';
        } else if (obj.state==2) {
            applyState = '审核未通过';
            bgColor = '#454545';
        } else if (obj.state==3) {
            applyState = '取消申请';
            bgColor = 'red';
        } else if (obj.state==4) {
            applyState = '提现成功';
            bgColor = '#f04339';
        }
        return (
            <View style={styles.itemContainer}>
                <View style={styles.leftView}>
                    <Text style={styles.sourceText}>{applySource}</Text>
                    <Text style={styles.dateText}>{applyDate}</Text>
                </View>
                <View style={styles.rightView}>
                    <Text style={styles.moneyText}>{`${obj.amount*1/100}元`}</Text>
                    <Text style={[styles.stateText, {color: bgColor}]}>{applyState}</Text>
                </View>
            </View>
        );
    },
    renderSeparator (sectionID, rowID) {
        return (
            <View style={styles.separator} key={sectionID + '_' + rowID} />
        );
    },
    render () {
        return (
            <View style={styles.container}>
                <PageList
                    ref={listView => { this.listView = listView; }}
                    renderRow={this.renderRow}
                    renderSeparator={this.renderSeparator}
                    listParam={{ userID: app.personal.info.userID }}
                    listName='applyList'
                    listUrl={app.route.ROUTE_GET_APPLY_DETAILED}
                    />
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0EFF5',
    },
    separator: {
        height: 1,
    },
    itemContainer: {
        width: sr.w,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
    },
    leftView: {
        marginLeft: 15,
    },
    sourceText: {
        fontSize: 15,
        fontWeight: '400',
    },
    dateText: {
        fontSize: 11,
        color: '#666666',
        marginTop: 5,
    },
    rightView: {
        marginRight: 15,
    },
    moneyText: {
        alignSelf: 'flex-end',
        fontSize: 14,
        fontFamily: 'STHeitiSC-Medium',
    },
    stateText: {
        fontSize: 12,
        marginTop: 2,
    },
});
