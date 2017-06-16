'use strict';
const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    ListView,
    Image,
    TextInput,
} = ReactNative;

const { Picker } = COMPONENTS;

module.exports = React.createClass({
    statics: {
        title: '余额提现',
        color: '#FFFFFF',
        leftButton: { image: app.img.common_back, handler: () => { app.navigator.pop(); } },
    },
    getInitialState () {
        return {
            name: '',
            card: '',
            bank: '',
            branch: '',
            bankList: [],
        };
    },
    componentDidMount() {
        this.getBankNameList();
    },
    getBankNameList () {
        const param = {
            userID: app.personal.info.userID,
        };
        POST(app.route.ROUTE_GET_BANK_NAME_LIST, param, this.getBankNameListSuccess);
    },
    getBankNameListSuccess (data) {
        if (data.success) {
            if (data.context) {
                this.setState({ bankList: data.context.bankName});
            }
        }
    },
    checkBankCard (pwd) {
        return /^([1-9]{1})(\d{14}|\d{18})$/.test(pwd);
    },
    showPicker (pickerData) {
        Picker(pickerData, ['中国银行'], '').then((value)=>{
            this.setChooseValue(value);
        });
    },
    setChooseValue (value) {
        this.setState({ bank: value });
    },
    bindingInfo() {
        let { name, card, branch, bank} = this.state;
        if (name == '') {
            Toast('请输入持卡人姓名');
            return;
        }
        if (card == '') {
            Toast('请输入银行卡号');
            return;
        }
        if (bank == '') {
            Toast('请选择银行名称');
            return;
        }
        if (branch == '') {
            Toast('请输入开户网点');
            return;
        }
        const param = {
            userID: app.personal.info.userID,
            bank:bank[0],
            cradno: card,
            accountname: name,
            bankaccount: branch,
        };
        POST(app.route.ROUTE_BINDING_USER_BANK_INFO, param, this.bindingInfoSuccess);
    },
    bindingInfoSuccess (data) {
        if (data.success) {
            Toast('绑定银行卡成功');
            app.navigator.pop();
        } else {
            Toast('您还没邀请过，不能添加银行卡提现');
        }
    },
    render () {
        let { bankList } = this.state;
        return (
            <View style={styles.container}>
                <Text style={styles.themeTitle}>{'请填写你的提现银行卡信息'}</Text>
                <View style={styles.itemBgStyle} >
                    <Text style={styles.headText}>姓名</Text>
                    <TextInput
                        onChangeText={(text) => this.setState({ name: text })}
                        onFocus={this.onTextInputFocus}
                        underlineColorAndroid={'transparent'}
                        defaultValue={this.state.name}
                        placeholder={'持卡人姓名'}
                        placeholderTextColor={'#BABABA'}
                        style={styles.text_input} />
                </View>
                <View style={styles.line}>
                </View>
                <View style={styles.itemBgStyle} >
                    <Text style={styles.headText}>卡号</Text>
                    <TextInput
                        onChangeText={(text) => this.setState({ card: text })}
                        onFocus={this.onTextInputFocus}
                        underlineColorAndroid={'transparent'}
                        defaultValue={this.state.card}
                        placeholder={'银行卡卡号'}
                        placeholderTextColor={'#BABABA'}
                        style={styles.text_input} />
                </View>
                <View style={styles.line}>
                </View>
                <View style={styles.itemBgStyle} >
                    <Text style={styles.headText}>银行</Text>
                    <Text style={styles.bankText}>{this.state.bank}</Text>
                    <TouchableOpacity style={styles.bank} onPress={this.showPicker.bind(null, bankList)}>
                        <Text style={styles.btn_select}>{'请选择银行'}</Text>
                            <Image
                                resizeMode='stretch'
                                source={app.img.common_go}
                                style={styles.img_go} />
                    </TouchableOpacity>
                </View>
                <View style={styles.line}>
                </View>
                <View style={styles.itemBgStyle} >
                    <Text style={styles.headText}>开户行</Text>
                    <TextInput
                        onChangeText={(text) => this.setState({ branch: text })}
                        onFocus={this.onTextInputFocus}
                        underlineColorAndroid={'transparent'}
                        defaultValue={this.state.branch}
                        placeholder={'开户网点名称'}
                        placeholderTextColor={'#BABABA'}
                        style={styles.text_input} />
                </View>
                <TouchableOpacity style={styles.btn_bottom} onPress={this.bindingInfo}>
                    <Text style={styles.btn_text}>{'确定'}</Text>
                </TouchableOpacity>
            </View>

        );
    },
});

const styles = StyleSheet.create({
    container: {
        width: sr.w,
        height: sr.ch,
        backgroundColor: '#EEEEEE',
    },
    itemBgStyle: {
        width: sr.w,
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    themeTitle: {
        fontSize: 14,
        marginLeft: 15,
        marginVertical: 10,
        color: '#444444',
    },
    headText: {
        fontSize: 16,
        marginLeft: 15,
        marginVertical: 10,
        color: '#222222',
    },
    bankText: {
        fontSize: 16,
        marginLeft: 20,
        width: sr.w-170,
        marginVertical: 10,
        color: '#222222',
    },
    text_input: {
        height: 40,
        width: sr.w-80,
        fontSize: 14,
        fontFamily: 'STHeitiSC-Medium',
        marginLeft: 20,
        paddingLeft: 0,
        color: '#BABABA',
        alignSelf: 'center',
    },
    line: {
        height: 10,
        width: sr.w,
    },
    btn_bottom: {
        marginTop: 140,
        height: 40,
        borderRadius: 6,
        marginLeft: 15,
        width: sr.w-30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DE3031',
    },
    btn_text: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    btn_select: {
        fontSize: 14,
        color: '#999999',
    },
    img_go: {
        marginLeft: 3,
        width: 6,
        height: 9,
        transform:[{ rotate: '90deg' }],
    },
    bank: {
        flexDirection: 'row',
        alignItems:'center',
    },
});
