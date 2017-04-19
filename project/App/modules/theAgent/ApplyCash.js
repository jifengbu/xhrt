'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
  View,
  Text,
  StyleSheet,
  TextInput,
  navigator,
  ScrollView,
  TouchableOpacity,
} = ReactNative;

const WithdrawaRecord = require('./WithdrawaRecord.js');

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        title:'申请提现',
        rightButton: { image: app.img.personal_present_record, handler: () => { app.scene._WithdrawaRecord(); } },
    },
    getInitialState () {
        return {
            playMoney: '',
            bankName: '',
            bankCard: '',
            accountName: '',
            bankAddress: '',
        };
    },
    _onPressApply () {
        if (app.personal.info.leftBrokerage < 2000) {
            Toast('金额小于2000不能提现');
            return;
        }
        if (this.state.playMoney > app.personal.info.leftBrokerage) {
            Toast('输入金额不能大于可提金额');
            return;
        }
        if (!app.utils.checkNumberCode(this.state.playMoney)) {
            Toast('请输入有效的金额');
            return;
        }
        if (!app.utils.checkBankCardCode(this.state.bankCard)) {
            Toast('请输入正确的银行卡号');
            return;
        }
        if (!this.state.bankName) {
            Toast('请输入开户行名称');
            return;
        }
        if (!this.state.accountName) {
            Toast('请输入开户行用户名');
            return;
        }
        if (!this.state.bankAddress) {
            Toast('请输入开户行网点');
            return;
        }
        const param = {
            applyPara:{
                userID: app.personal.info.userID,
                bankCard: this.state.bankCard,
                bankName: this.state.bankName,
                bankAddress: this.state.bankAddress,
                accountName: this.state.accountName,
                playMoney: this.state.playMoney,
            },
        };
        POST(app.route.ROUTE_APPLICATION_FOR_CASH, param, this.doApplySuccess.bind(null, this.state.playMoney), true);
    },
    doApplySuccess (tempPlayMoney, data) {
        if (data.success) {
            Toast('提交成功');
            const personInfo = app.personal.info;
            personInfo.leftBrokerage -= tempPlayMoney;
            app.personal.set(personInfo);
            app.navigator.pop();
        } else {
            Toast(data.msg);
        }
    },
    _WithdrawaRecord () {
        app.navigator.push({
            component: WithdrawaRecord,
        });
    },
    render () {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.inputContainerRow}>
                    <Text style={styles.layoutStyle3}>
                        可提资金
                    </Text>
                    <Text style={styles.layoutStyle}>
                        {'￥' + app.personal.info.leftBrokerage.toFixed(2)}
                    </Text>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder='请输入您需要提现的金额'
                        onChangeText={(text) => this.setState({ playMoney: text })}
                        defaultValue={this.state.playMoney}
                        style={styles.TextInput2}
                        />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder='请输入转账银行卡卡号'
                        style={styles.TextInput2}
                        onChangeText={(text) => this.setState({ bankCard: text })}
                        defaultValue={this.state.bankCard}
                        />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder='请输入开户行名称'
                        style={styles.TextInput2}
                        onChangeText={(text) => this.setState({ bankName: text })}
                        defaultValue={this.state.bankName}
                        />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder='请输入银行卡用户名'
                        style={styles.TextInput2}
                        onChangeText={(text) => this.setState({ accountName: text })}
                        defaultValue={this.state.accountName}
                        />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder='请输入开户行网点（例：XX市XX支行）'
                        style={styles.TextInput2}
                        onChangeText={(text) => this.setState({ bankAddress: text })}
                        defaultValue={this.state.bankAddress}
                        />
                </View>
                <TouchableOpacity onPress={this._onPressApply} style={{ flex:1 }}>
                    <View style={styles.buttContainer}>
                        <Text style={styles.layoutStyle2}>
                            确 定 申 请
                        </Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.textContainer1}>
                    <View style={styles.textContainer}>
                        <Text style={styles.layoutGray}>
                            {'双休日不处理业务，满 '}
                        </Text>
                        <Text style={styles.layoutBlue}>
                            {'2000 元'}
                        </Text>
                        <Text style={styles.layoutGray}>
                            {'起提'}
                        </Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.layoutGray}>
                            {'提出申请的 '}
                        </Text>
                        <Text style={styles.layoutBlue}>
                            {'一周内 '}
                        </Text>
                        <Text style={styles.layoutGray}>
                            {'工作人员会处理您的申请'}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom:20,
    },
    instructions: {
        backgroundColor:'red',
        height:100,
        marginHorizontal:20,
        padding:5,
    },
    trainRankButtonView: {
        width:sr.w * 5 / 6,
        height:80,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'white',
    },
    inputContainerRow :{
        flexDirection:'row',
        height: 45,
        marginTop: 30,
        marginHorizontal: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#D7D7D7',
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
        justifyContent: 'space-between',
        alignItems:'center',
    },
    buttContainer :{
        height: 45,
        marginVertical: 30,
        marginHorizontal: 10,
        borderRadius: 8,
        backgroundColor: CONSTANTS.THEME_COLOR,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems:'center',
    },
    textContainer :{
        flex:1,
        flexDirection: 'row',
    },
    textContainer1 :{
        marginTop: 10,
        height: 45,
        alignItems: 'center',
        marginHorizontal: 60,
    },
    inputContainer :{
        height: 50,
        marginTop: 10,
        marginHorizontal: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#D7D7D7',
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        overflow: 'hidden',
        alignItems:'center',
    },
    TextInput2 :{
        height: 45,
        fontSize: 16,
        width: sr.w - 40,
        marginHorizontal: 10,
        borderColor: 'gray',
        backgroundColor: '#FFFFFF',
    },
    fillView2 :{
        flex: 1,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
    },
    layoutStyle :{
        marginRight: 10,
        fontSize: 18,
        textAlign: 'right',
        color :'red',
    },
    layoutStyle2 :{
        fontSize: 17,
        textAlign: 'center',
        color: 'white',
    },
    layoutBlue :{
        fontSize: 12,
        color: CONSTANTS.THEME_COLOR,
    },
    layoutGray :{
        fontSize: 12,
        color: 'gray',
    },
    layoutStyle3 :{
        fontSize: 18,
        textAlign: 'left',
        margin: 10,
    },
});
