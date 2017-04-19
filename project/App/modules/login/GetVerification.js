'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    TextInput,
    Text,
} = ReactNative;

const TimerMixin = require('react-timer-mixin');
const ForgetPassword = require('./ForgetPassword.js');

const { Button } = COMPONENTS;

module.exports = React.createClass({
    mixins: [TimerMixin],
    statics: {
        color: CONSTANTS.THEME_COLORS[1],
        title: '手机验证',
        leftButton: { color: CONSTANTS.THEME_COLORS[1], handler: () => { app.navigator.pop(); } },
    },
    getInitialState () {
        const { DEFAULT_CODE_TIMEOUT } = CONSTANTS;
        const time = Math.floor((Date.now() - (app.data.forgetVerificationCodeTimeout || 0)) / 1000);
        const flag = time > DEFAULT_CODE_TIMEOUT;
        return {
            phone: app.data.forgetVerificationCodePhone || '',
            verificationCode: '',
            verificationCodeTimeout: flag ? DEFAULT_CODE_TIMEOUT : DEFAULT_CODE_TIMEOUT - time,
            verificationCodeEnable: flag,
            verificationCodeText: flag ? '发送验证码' : DEFAULT_CODE_TIMEOUT - time + '秒后再发送...',
            fang:'123',
        };
    },
    componentDidMount () {
        if (!this.state.verificationCodeEnable) {
            this.updateVerificationCodeTimeout();
        }
    },
    doGetVerificationCode () {
        if (!app.utils.checkPhone(this.state.phone)) {
            Toast('手机号码不是有效的手机号码');
            return;
        }
        const param = {
            phone:this.state.phone,
            type: 3, //1 表示登录  2 表示注册   3 表示忘记密码
        };
        app.data.forgetVerificationCodePhone = this.state.phone;
        POST(app.route.ROUTE_SEND_VERIFICATION_CODE, param, this.doGetVerificationCodeSuccess, true);
    },
    doGetVerificationCodeSuccess (data) {
        if (data.success) {
            this.setState({ verificationCodeEnable: false, verificationCodeText: CONSTANTS.DEFAULT_CODE_TIMEOUT + '秒后再发送...' });
            app.data.forgetVerificationCodeTimeout = Date.now();
            this.updateVerificationCodeTimeout();
            Toast('验证码发送成功，请查看短信!');
        } else {
            Toast(data.msg);
        }
    },
    updateVerificationCodeTimeout () {
        this.intervalID = this.setInterval(() => {
            const verificationCodeTimeout = this.state.verificationCodeTimeout - 1;
            if (verificationCodeTimeout === 0) {
                this.clearInterval(this.intervalID);
                this.setState({ verificationCodeTimeout:CONSTANTS.DEFAULT_CODE_TIMEOUT, verificationCodeEnable: true, verificationCodeText: '发送验证码' });
            } else {
                this.setState({ verificationCodeTimeout, verificationCodeText: verificationCodeTimeout + '秒后再发送...' });
            }
        }, 1000);
    },
    doSubmit () {
        if (!app.utils.checkVerificationCode(this.state.verificationCode)) {
            Toast('验证码不正确');
            return;
        }
        const param = {
            phone:this.state.phone,
            verificationCode:this.state.verificationCode,
        };
        POST(app.route.ROUTE_FIND_PWD, param, this.doSubmitSuccess);
    },
    doSubmitSuccess (data) {
        if (data.success) {
            app.navigator.push({
                component: ForgetPassword,
                passProps: { phone: this.state.phone },
            });
        } else {
            Toast(data.msg);
        }
    },
    render () {
        return (
            <View style={styles.container}>
                <View style={styles.outsideContainer}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder='您的手机号码'
                            underlineColorAndroid='transparent'
                            onChangeText={(text) => this.setState({ phone: text })}
                            style={styles.text_input}
                            defaultValue={this.state.phone}
                            keyboardType='phone-pad'
                            />
                        <Button onPress={this.doGetVerificationCode}
                            disable={!this.state.verificationCodeEnable}
                            style={[styles.btnGetCode, { backgroundColor: this.state.verificationCodeEnable ? '#DE3031' : '#A8B5B8' }]}
                            textStyle={styles.btnSendCodeText}>
                            {this.state.verificationCodeText}
                        </Button>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder='请输入验证码'
                            underlineColorAndroid='transparent'
                            style={styles.txt_code_input}
                            onChangeText={(text) => this.setState({ verificationCode: text })}
                            defaultValue={this.state.verificationCode}
                            keyboardType='number-pad'
                            />
                    </View>
                    <Button
                        onPress={this.doSubmit}
                        style={styles.btnSubmit}>确定</Button>
                </View>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    text_input: {
        paddingLeft: 10,
        height:40,
        width: 200,
        alignSelf: 'center',
        backgroundColor: '#FFFFFF',
    },
    txt_code_input: {
        paddingLeft: 10,
        height: 40,
        width: 200,
        alignSelf: 'center',
        backgroundColor: '#FFFFFF',
    },
    outsideContainer: {
        flex: 1,
        marginTop: 35,
    },
    inputContainer: {
        height: 58,
        marginTop: 2,
        borderColor: '#D7D7D7',
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        overflow: 'hidden',
        alignItems:'center',
        justifyContent: 'space-between',
    },
    btnSendCodeText: {
        fontSize: 14,
        alignSelf: 'center',
    },
    btnSubmit: {
        height: 45,
        marginTop: 56,
        marginHorizontal: 10,
        borderRadius: 6,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: '#DE3031',
    },
    btnGetCode: {
        width: 100,
        height: 35,
        marginHorizontal: 15,
        borderRadius: 4,
        alignItems:'center',
        justifyContent:'center',
    },
});
