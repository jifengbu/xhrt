'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    View,
    Text,
    Image,
    StyleSheet,
    ListView,
    TouchableOpacity,
    TouchableHighlight,
} = ReactNative;

const moment = require('moment');

const { DImage } = COMPONENTS;
const {STATUS_TEXT_HIDE, STATUS_START_LOAD, STATUS_HAVE_MORE, STATUS_NO_DATA, STATUS_ALL_LOADED, STATUS_LOAD_ERROR} = CONSTANTS.LISTVIEW_INFINITE.STATUS;

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        color: '#FFFFFF',
        title: '账单明细',
        leftButton: { image: app.img.common_back, handler: () => { app.navigator.pop(); } },
    },
    getInitialState() {
        this.list = {};
        this.pageNo = 1;
        this.ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged : (s1, s2) => s1 !== s2
        });
        return {
            dataSource: this.ds.cloneWithRowsAndSections({}),
            infiniteLoadStatus: STATUS_TEXT_HIDE,
        };
    },
    componentDidMount() {
        this.getList();
    },
    getList () {
        const param = {
            userID: app.personal.info.userID,
        };
        POST(app.route.ROUTE_GET_ACCOUNT_DETAILED, param, this.getListSuccess, this.getListFailed,true);
    },
    getListSuccess (data) {
        if (data.success) {
            var monthList = data.context.accountList||[];
            var length = 0;
            _.forEach(monthList, (item)=>{
                var month = item.month;
                if (item.content) {
                    var content = item.content;
                    length += content.length;
                    this.list[month] = (this.list[month]||[]).concat(content);
                }
            });
            var infiniteLoadStatus = length < CONSTANTS.PER_PAGE_COUNT ? STATUS_ALL_LOADED : STATUS_TEXT_HIDE;
            this.setState({
                dataSource: this.ds.cloneWithRowsAndSections(this.list),
                infiniteLoadStatus: infiniteLoadStatus
            });
        } else {
            this.getListFailed();
        }
    },
    getListFailed () {
        this.setState({ infiniteLoadStatus: STATUS_LOAD_ERROR });
    },
    renderRow(obj, sectionID, rowID, onRowHighlighted) {
        let date = moment(obj.createDate).format('MM月DD日');
        let time = moment(obj.createDate).format('HH:mm');
        this.sourceString = '';
        if (obj.action == 1) {
            this.sourceString = obj.source==0?'公众号':'APP';
        } else if (obj.action == 2) {
            this.sourceString = obj.source==0?'微信':obj.source==1?'支付宝':'银行卡';
        }
        return (
            <View style={styles.listViewItemContain}>
                <View style={styles.billTypeView}>
                    <View style={styles.itemView}>
                        <Text style={styles.date}>{date}</Text>
                        <Text style={styles.date}>{time}</Text>
                    </View>
                    <DImage
                        resizeMode='cover'
                        source={obj.action==1?app.img.wallet_user_2:app.img.wallet_balance_icon}
                        style={styles.balanceIcon} />
                    <Text style={styles.describeText}>{obj.msg}</Text>
                </View>
                <View style={styles.itemView}>
                    <Text style={[styles.moneyText, {color: obj.action==1?'#f88350':'#666666'}]}>{(obj.action==1?'+':'-')+obj.amount*1/100}</Text>
                    <Text style={styles.date}>{`(${this.sourceString})`}</Text>
                </View>
            </View>
        )
    },
    renderSeparator(sectionID, rowID) {
        return (
            <View
                style={styles.separator}
                key={sectionID+''+rowID}/>
        );
    },
    renderSectionHeader(obj, sectionID) {
        if (!obj || !obj.length) {
            return null;
        }
        let month = moment(sectionID).format('MM');
        let currentMonth = moment().month();
        let sectionHeader = month==(currentMonth+1)?'本月':(month+'月');
        return (
            <View style={{backgroundColor: '#EEEEEE',}}>
                <Text style={styles.monthStyle}>
                    {sectionHeader}
                </Text>
            </View>
        );
    },
    renderFooter() {
        return (
            <View style={styles.listFooterContainer}>
                <Text style={styles.listFooter}>{CONSTANTS.LISTVIEW_INFINITE.TEXT[this.state.infiniteLoadStatus]}</Text>
            </View>
        )
    },
    render() {
        return (
            <View style={styles.container}>
                <ListView
                    initialListSize={1}
                    onEndReachedThreshold={10}
                    enableEmptySections={true}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    renderFooter={this.renderFooter}
                    renderSeparator={this.renderSeparator}
                    renderSectionHeader={this.renderSectionHeader}
                    />
            </View>
        )
    },
});


var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listFooterContainer: {
        alignItems: 'center',
    },
    listFooter: {
        marginTop: 20,
        color: 'gray',
        fontSize: 14,
    },
    separator: {
        backgroundColor: '#DDDDDD',
        width: sr.w,
        height: 1,
    },
    monthStyle: {
        fontSize: 15,
        color: '#999999',
        marginLeft: 10,
        marginBottom: 5,
        marginTop: 10,
    },
    listViewItemContain: {
        flexDirection: 'row',
        width: sr.w,
        paddingVertical: 13,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
    },
    itemView: {
        marginRight: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    date: {
        fontSize: 12,
        color: '#666666',
    },
    describeText: {
        color: '#666666',
        fontSize:14,
        marginLeft: 5,
    },
    blackColor: {
        color: '#666666',
        fontSize:14,
    },
    billTypeView: {
        marginLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    balanceIcon: {
        width: 24,
        height: 24,
    },
    moneyText: {
        fontSize: 16,
    },
});
