'use strict';
const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
} = ReactNative;

const Withdraw = require('./Withdraw.js');
const BillingList = require('./BillingList.js');

const MenuItem = React.createClass({
    showChildPage () {
        app.navigator.push({
            component: this.props.page.module,
            passProps: {amount:this.props.page.amount},
        });
    },
    render () {
        const { title, img, info } = this.props.page;
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={this.showChildPage}
                style={styles.meunItemStyle}>
                <View style={styles.titleStyle}>
                    <Image
                        resizeMode='stretch'
                        source={img}
                        style={styles.icon_img} />
                    <Text style={styles.itemNameText}>{title}</Text>
                </View>
                <View style={styles.infoStyle}>
                    <Text style={styles.itemNoticeText}>{info}</Text>
                    <Image
                        resizeMode='stretch'
                        source={app.img.wallet_enter}
                        style={styles.icon_go} />
                </View>
            </TouchableOpacity>
        );
    },
});

module.exports = React.createClass({
    statics: {
        title: '钱包',
        color: '#FFFFFF',
        leftButton: { image: app.img.common_back, handler: () => { app.navigator.pop(); } },
    },
    getInitialState () {
        return {
            options: null,
            amount: 0,
        };
    },
    componentWillMount () {
        app.updateNavbarColor('#DE3031');
    },
    onWillFocus () {
        app.updateNavbarColor('#DE3031');
        this.getUserSumAmount();// 获取钱包余额
    },
    componentDidMount() {
        this.getUserSumAmount();// 获取钱包余额
    },
    getUserSumAmount () {
        const param = {
            userID: app.personal.info.userID,
        };
        POST(app.route.ROUTE_GET_USER_SUMAMOUNT, param, this.getUserSumAmountSuccess, true);
    },
    getUserSumAmountSuccess (data) {
        if (data.success) {
            const { amount } = data.context;
            let money = amount*1/100;
            this.setState({ amount:money});
        }
    },
    getChildPages (amount) {
        return [
            { seprator:false, title:'余额提现', module: Withdraw ,info: '(每月25-30日到账)',img: app.img.wallet_balance,amount:amount},
            { seprator:false, title:'账单明细', module: BillingList ,img: app.img.wallet_bill,amount:amount},
        ].map((item, i) => !item.hidden && <MenuItem page={item} key={i} />);
    },
    render () {
        let { amount } = this.state;
        const money = parseFloat(amount).toFixed(2);
        return (
            <View style={styles.container}>
                <View style={styles.topView}>
                    <Text style={styles.priceSub}>{'账户余额(元)'}</Text>
                    <Text style={styles.price}>{money}</Text>
                </View>
                <View style={styles.menuView}>
                    {
                        this.getChildPages(money)
                    }
                </View>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#F0EFF5',
    },
    topView: {
        width: sr.w,
        height: 143,
        justifyContent: 'center',
        backgroundColor: '#DE3031',
    },
    price: {
        fontSize: 60,
        color: '#FFFFFF',
        marginLeft: 15,
    },
    priceSub: {
        marginBottom: 5,
        fontSize: 14,
        color: '#FFFFFF',
        marginLeft: 15,
    },
    menuView: {
        marginTop: 2,
    },
    loginStyle: {
        width: sr.w,
        height: 45,
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
    },
    meunItemStyle: {
        width: sr.w,
        height: 45,
        marginTop: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
    },
    titleStyle: {
        marginLeft: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoStyle: {
        marginRight: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemNameText: {
        fontSize: 14,
        color: '#373737',
    },
    itemNoticeText: {
        fontSize: 12,
        color: '#888888',
    },
    icon_go: {
        width: 20,
        height: 22,
    },
    icon_img: {
        marginRight: 10,
        width: 16,
        height: 17,
    },
});
