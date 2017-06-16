'use strict';
const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    TextInput,
    Image,
} = ReactNative;

const AddBankBox = require('./AddBankBox.js');
const WithdrawRules = require('./WithdrawalRules.js');
const WithdrawSteps = require('./withdrawalSteps.js');
const WithdrawList = require('./WithdrawalList.js');
const CompleteWithdraw = require('./CompleteWithdraw.js');
const BindingBank = require('./BindingBank.js');

module.exports = React.createClass({
    statics: {
        title: '提现',
        color: '#FFFFFF',
        leftButton: { image: app.img.common_back, handler: () => { app.navigator.pop(); } },
        rightButton: { title: '提现记录', smallTitle: true, delayTime:1, handler: () => { app.scene.toggleEdit(); } },
    },
    getInitialState () {
        this.num = this.props.amount;
        return {
            text: '',
            isShowBtn: false,
            defaultBank: '',
            bankList: [],
            isNumBig: false,
            isInput: false,
        };
    },
    onWillFocus () {
        this.num = this.props.amount;
        this.getUserBankList();
    },
    componentDidMount() {
        this.getUserBankList();
    },
    getUserBankList () {
        const param = {
            userID: app.personal.info.userID,
        };
        POST(app.route.ROUTE_GET_USER_BANK_LIST, param, this.getUserBankListSuccess);
    },
    getUserBankListSuccess (data) {
        if (data.success) {
            if (data.context) {
                let { bankList } = data.context;
                for (var i = 0; i < bankList.length; i++) {
                    bankList[i]['pitch'] = false;
                }
                bankList[0].pitch = true;
                this.setState({ bankList});
            }
        }
    },
    toggleEdit () {
        app.navigator.push({
            component: WithdrawList,
        });
    },
    toWithdrawRule () {
        app.navigator.push({
            component: WithdrawRules,
        });
    },
    toWithdrawStep () {
        app.navigator.push({
            component: WithdrawSteps,
        });
    },
    toComplete (name) {
        let { text, bankList } = this.state;
        let bankListId = _.find(bankList, (item) => item.pitch == true);
        if (text*1 < 300) {
            Toast('提现金额不得少于300元');
            return;
        }
        let money = text*100;
        const param = {
            userID: app.personal.info.userID,
            amount: money,
            applymode: 2,
            userBankInfoId: bankListId.id,
        };
        POST(app.route.ROUTE_SUBMIT_WITHDRAW_APPLY, param, this.withdrawAmountSuccess.bind(null,name,text), true);
    },
    withdrawAmountSuccess (name,text,data) {
        if (data.success) {
            app.navigator.push({
                component: CompleteWithdraw,
                passProps: {name,text},
            });
        } else {
            Toast(data.msg);
        }
    },
    showModel () {
        let { bankList } = this.state;
        if (bankList.length < 1) {
            app.navigator.push({
                component: BindingBank,
            });
        }else {
            app.showModal(
                <AddBankBox bankList={bankList} getName={this.getName}/>
            );
        }
    },
    getName(name,list) {
        this.setState({defaultBank: name,bankList: list});
    },
    changeText (text) {
        this.setState({text});
        if (text != '') {
            this.setState({isInput: true});
        }else {
            this.setState({isInput: false});
        }

        if (text*1>this.num || text == '') {
            this.setState({isShowBtn: false});

        } else {
            this.setState({isShowBtn: true});
        }

        if (text*1 > this.num) {
            this.setState({isNumBig: true});
        }else {
            this.setState({isNumBig: false});
        }
    },
    render () {
        let { bankList,defaultBank,isShowBtn } = this.state;
        let bankNum = bankList[0]&&bankList[0].cradno.substring(bankList[0].cradno.length-4);
        if (defaultBank == ''&&bankList.length != 0) {
            defaultBank = bankList[0].bank+' - 储蓄卡'+'('+bankNum+')';
        }
        return (
            <View style={styles.container}>
                <View style={styles.topView}>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={this.showModel}
                        style={styles.meunItemStyle}>
                        <View style={styles.titleStyle}>
                            <Text style={styles.itemNameText}>
                                {'银行卡'}
                            </Text>
                            {
                                bankList&&bankList.length>0?
                                <Text style={[styles.subText,{marginLeft: 15}]}>
                                        {defaultBank}
                                </Text>:
                                <View style={styles.bank_style}>
                                    <Image
                                        resizeMode='stretch'
                                        source={app.img.wallet_add}
                                        style={styles.icon_add} />
                                    <Text style={styles.subText}>
                                            {'添加银行卡提现'}
                                    </Text>
                                </View>
                            }
                        </View>
                        <View style={styles.infoStyle}>
                            <Image
                                resizeMode='stretch'
                                source={app.img.wallet_enter}
                                style={styles.icon_go} />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.line}/>
                    <View style={styles.midView}>
                        <Text style={styles.priceSub}>{'提现金额'}</Text>
                        <View style={styles.input}>
                            <Image
                                resizeMode='stretch'
                                source={app.img.wallet_money}
                                style={styles.icon_money} />
                            <TextInput
                                style={this.state.isInput?styles.input_text2:styles.input_text}
                                placeholder={this.state.isInput?'':"余额大于300才可提现"}
                                multiline={false}
                                keyboardType='number-pad'
                                underlineColorAndroid={'transparent'}
                                onChangeText={this.changeText}
                                value={this.state.text}
                                />
                        </View>
                    </View>
                    <View style={styles.line}/>
                    <View style={styles.bottom}>
                        <Text style={[styles.balance, {color: this.state.isNumBig?'#DC3237':'#cdcdcd'}]}>
                            {this.state.isNumBig==false?'(钱包余额'+this.num+'元)':'输入金额超过钱包余额'}
                        </Text>
                        <TouchableOpacity onPress={this.toWithdrawRule}>
                            <Image
                                resizeMode='stretch'
                                source={app.img.wallet_question}
                                style={styles.icon_question} />
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity
                    disabled={isShowBtn&&defaultBank !=''?false:true}
                    style={[styles.btn_bottom,{backgroundColor:isShowBtn&&defaultBank !=''? '#DE3031':'gray',}]}
                    onPress={this.toComplete.bind(null,defaultBank)}>
                    <Text style={styles.btn_text}>{'确认提现'}</Text>
                </TouchableOpacity>
                <View style={styles.btn_view}>
                    <Text style={styles.btn_title}>{'银行卡每月25-30日到账'}</Text>
                </View>
            </View>
        );
    },
});

// <TouchableOpacity onPress={this.toWithdrawStep}>
//     <Text style={styles.btn_red}>{'快速提现'}</Text>
// </TouchableOpacity>

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#EEEEEE',
    },
    topView: {
        marginTop: 15,
        width: sr.w,
        height: 175,
        backgroundColor: '#FFFFFF',
    },
    meunItemStyle: {
        width: sr.w,
        height: 45,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    titleStyle: {
        marginLeft: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    bank_style: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemNameText: {
        fontSize: 16,
        color: '#373737',
    },
    subText: {
        fontSize: 14,
        color: '#373737',
    },
    icon_add: {
        marginLeft: 15,
        marginRight: 5,
        width: 18,
        height: 18,
    },
    infoStyle: {
        marginRight: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    line: {
        marginLeft: 15,
        width: sr.w-30,
        height: 1,
        backgroundColor: '#eeeeee'
    },
    midView: {
        width: sr.w,
        height: 98,
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    input: {
        width: sr.w,
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon_money: {
        marginLeft: 15,
        width: 24,
        height: 28,
    },
    input_text: {
        fontSize: 14,
        marginLeft: 5,
        marginTop: app.isandroid?1:24,
        color: '#e8e8e8',
        height: app.isandroid?24:14,
        width: sr.w-60,
        paddingVertical: 0,
    },
    input_text2: {
        fontSize: 36,
        marginLeft: 5,
        marginTop: app.isandroid?10:16,
        color: '#222222',
        height: app.isandroid?60:28,
        width: sr.w-60,
    },
    price: {
        fontSize: 36,
        color: '#FFFFFF',
    },
    priceSub: {
        fontSize: 16,
        color: '#222222',
        marginLeft: 15,
        marginTop: 10,
    },
    bottom: {
        width: sr.w,
        height: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    icon_question: {
        height: 18,
        width: 18,
        marginRight: 15,
    },
    balance: {
        fontSize: 14,
        color: '#cdcdcd',
        marginLeft: 15,
    },
    btn_bottom: {
        marginTop: 40,
        height: 40,
        borderRadius: 6,
        marginLeft: 15,
        width: sr.w-30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btn_text: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    btn_title: {
        fontSize: 12,
        color: '#666666',
    },
    btn_red: {
        fontSize: 12,
        color: '#DE3031',
    },
    btn_view: {
        height: 25,
        marginTop: 5,
        marginLeft: 50,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: sr.w-100,
    },
    icon_go: {
        width: 20,
        height: 22,
    },
});
