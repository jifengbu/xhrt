'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    Text,
    ListView,
} = ReactNative;

const AgentReturns = require('./AgentReturns.js');

module.exports = React.createClass({
    statics: {
        title:'提现记录',
    },
    getInitialState () {
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return {
            dataSource: this.ds.cloneWithRows([]),
            recordBool: null,
        };
    },
    componentDidMount () {
        this.getCashRecode();
    },
    getCashRecode () {
        const param = {
            userID: app.personal.info.userID,
        };
        POST(app.route.ROUTE_CASH_RECORD, param, this.doGetCashRecodeSuccess);
    },
    doGetCashRecodeSuccess (data) {
        if (data.success) {
            const applyList = data.context.applyList || [];
            this.setState({ dataSource: this.ds.cloneWithRows(applyList), recordBool:applyList.length });
        }
    },
    renderSeparator (sectionID, rowID) {
        return (
            <View
                style={styles.separator}
                key={rowID} />
        );
    },
    renderRow (obj) {
        return (
            <View style={{ marginTop: 10, flexDirection: 'row' }}>
                <View style={styles.dateContainer}>
                    <View style={styles.cicleContainer} />
                    <View style={styles.lineContainer} />
                </View>
                <View style={styles.timeContainer}>
                    <Text style={styles.textTitle}>
                        {obj.applyTime}
                    </Text>
                    <ItemListView obj={obj} />
                </View>
            </View>
        );
    },
    render () {
        return (
            <View style={styles.container}>
                <ListView
                    initialListSize={1}
                    enableEmptySections
                    style={styles.list}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    renderSeparator={this.renderSeparator}
                    />
            </View>
        );
    },
});

const ItemListView = React.createClass({
    render () {
        const { obj } = this.props;
        return (
            <View style={styles.timeContainerChild}>
                <View style={styles.viewContainer}>
                    <Text style={styles.textStyle}>
                        {'提出申请提现 '}
                    </Text>
                    <Text style={styles.textApply}>
                        {'￥' + obj.value}
                    </Text>
                </View>
                <View style={{ marginTop: 15 }}>
                    <Text style={styles.textTitle}>
                        {obj.playMoneyTime}
                    </Text>
                </View>
                {
                    obj.Status == '0' ?
                        <Text style={styles.textStyle}>
                        打款处理中...
                    </Text>
                    :
                        <View style={styles.viewContainer}>
                            <Text style={styles.textStyle}>
                                {'成功提现'}
                            </Text>
                            <Text style={styles.textApply}>
                                {' ￥' + obj.value}
                            </Text>
                            <Text style={styles.textStyle}>
                                {',   当前账户余额￥' + obj.balance}
                            </Text>
                        </View>
                }
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    dateContainer: {
        width: 50,
    },
    cicleContainer: {
        width: 14,
        height: 14,
        borderRadius: 7,
        marginTop: 3,
        marginLeft: 25,
        backgroundColor: '#A42346',
    },
    lineContainer: {
        width: 2,
        height: 80,
        marginLeft: 32,
        backgroundColor: '#DDDDDD',
    },
    timeContainer: {
        width: sr.w - 60,
    },
    timeContainerChild: {
    },
    viewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textStyle: {
        fontSize: 14,
        color: '#555555',
    },
    textTitle: {
        fontSize: 14,
        marginVertical: 3,
        color: CONSTANTS.THEME_COLOR,
    },
    textApply: {
        fontSize: 14,
        color: CONSTANTS.THEME_COLOR,
    },
});
