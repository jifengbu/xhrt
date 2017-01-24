'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    StyleSheet,
    Image,
    Text,
    View,
    TextInput,
    TouchableOpacity,
} = ReactNative;

var TimerMixin = require('react-timer-mixin');
var {Button, WebviewMessageBox} = COMPONENTS;

module.exports = React.createClass({
    mixins: [TimerMixin],
    doGetVerificationCode() {
        if (!this.state.verificationCodeEnable) {
            return;
        }
        if (!app.utils.checkPhone(this.state.phone)) {
            Toast('手机号码不是有效的手机号码');
            return;
        }
        var param = {
            phone:this.state.phone,
            type: 2, //1 表示登录  2 表示注册   3 表示忘记密码
        };
        app.data.registerVerificationCodePhone = this.state.phone;
        POST(app.route.ROUTE_SEND_VERIFICATION_CODE, param, this.doGetVerificationCodeSuccess, true);
    },
    doGetVerificationCodeSuccess(data) {
        if (data.success) {
            this.setState({verificationCodeEnable: false, verificationCodeText: CONSTANTS.DEFAULT_CODE_TIMEOUT+'秒后再发送...'});
            app.data.registerVerificationCodeTimeout = Date.now();
            this.updateVerificationCodeTimeout();
            Toast('验证码发送成功!');
        } else {
            Toast(data.msg);
        }
    },
    updateVerificationCodeTimeout() {
        this.intervalID = this.setInterval(()=>{
            var verificationCodeTimeout = this.state.verificationCodeTimeout - 1;
            if (verificationCodeTimeout === 0) {
                this.clearInterval(this.intervalID);
                this.setState({verificationCodeTimeout:CONSTANTS.DEFAULT_CODE_TIMEOUT, verificationCodeEnable: true, verificationCodeText: '发送验证码'});
            } else {
                this.setState({verificationCodeTimeout, verificationCodeText: verificationCodeTimeout+'秒后再发送...'});
            }
        }, 1000);
    },
    doRegister() {
        if (!this.state.protocalRead) {
            Toast('注册前请先阅读赢销截拳道用户协议');
            return;
        }
        if (!app.utils.checkPhone(this.state.phone)) {
            Toast('请填写正确的手机号码');
            return;
        }
        if (!app.utils.checkVerificationCode(this.state.verificationCode)) {
            Toast('验证码不正确');
            return;
        }
        if (!app.utils.checkPassword(this.state.password)) {
            Toast('密码必须由 6-20 位的数字或，字母，下划线组成');
            return;
        }
        var param = {
            phone:this.state.phone,
            verificationCode: this.state.verificationCode,
            pwd: this.state.password,
        };
        POST(app.route.ROUTE_REGISTER, param, this.doRegisterSuccess);
    },
    doRegisterSuccess(data) {
        if (data.success) {
            Toast(data.msg);
            this.props.changeToLoginPanel(this.state.phone);
        } else {
            Toast(data.msg);
        }
    },
    doShowProtocal() {
        app.showModal(
            <WebviewMessageBox
                webAddress={app.route.ROUTE_USER_PROTOCOL}/>,
            {title: '赢销截拳道用户协议'}
        );
    },
    getInitialState() {
        var {DEFAULT_CODE_TIMEOUT} = CONSTANTS;
        var time = Math.floor((Date.now() - (app.data.registerVerificationCodeTimeout||0))/1000);
        var flag = time > DEFAULT_CODE_TIMEOUT;
        return {
            phone: app.data.registerVerificationCodePhone||'',
            password: '',
            verificationCode: '',
            protocalRead: true,
            overlayShow:false,
            verificationCodeTimeout: flag?DEFAULT_CODE_TIMEOUT:DEFAULT_CODE_TIMEOUT-time,
            verificationCodeEnable: flag,
            verificationCodeText: flag?'发送验证码':DEFAULT_CODE_TIMEOUT-time+'秒后再发送...',
        };
    },
    componentDidMount() {
        if (!this.state.verificationCodeEnable) {
            this.updateVerificationCodeTimeout();
        }
    },
    changeProtocalState() {
        this.setState({protocalRead: !this.state.protocalRead});
    },
    render() {
        return (
            <View style={styles.container}>
              <View
                style={styles.inputContainerBK}>
                <View style={[styles.inputContainerIphone, {justifyContent: 'space-between'}]}>
                    <Text style={styles.text_phone_header}>+86</Text>
                    <TextInput
                        placeholder='手机号码'
                        onChangeText={(text) => this.setState({phone: text})}
                        defaultValue={this.state.phone}
                        style={styles.text_input}
                        keyboardType='phone-pad'
                        />
                    <Button onPress={this.doGetVerificationCode}
                        disable={!this.state.verificationCodeEnable}
                        style={[styles.btnVerification, this.state.verificationCodeEnable?{backgroundColor: '#DE3031'}:{backgroundColor: '#D5D6D7'}]}
                         textStyle={[styles.btnVerificationText, this.state.verificationCodeEnable?{color: 'white'}:{color: '#525252'}]}>
                         {this.state.verificationCodeText}
                    </Button>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder='验证码'
                        onChangeText={(text) => this.setState({verificationCode: text})}
                        defaultValue={this.state.verificationCode}
                        style={styles.text_input2}
                        keyboardType='number-pad'
                        />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder='密码'
                        secureTextEntry={true}
                        onChangeText={(text) => this.setState({password: text})}
                        defaultValue={this.state.password}
                        style={styles.text_input2}
                        />
                </View>
              </View>
              <View style={styles.bottomContainer}>
                  <View style={styles.btnRegisterContainer}>
                      <Button onPress={this.doRegister} style={styles.btnRegister} textStyle={styles.btnRegisterText}>注  册</Button>
                  </View>
                  <View style={styles.protocalContainer}>
                      <TouchableOpacity onPress={this.changeProtocalState}>
                          <Image
                              resizeMode='cover'
                              source={this.state.protocalRead?app.img.login_tick_press:app.img.login_tick}
                              style={styles.protocal_icon}
                              />
                      </TouchableOpacity>
                      <Text style={styles.protocal_text}>  我已阅读并同意 </Text>
                      <Button onPress={this.doShowProtocal} style={styles.protocal_button} textStyle={styles.protocal_button_text}>赢销截拳道用户协议</Button>
                  </View>
              </View>
            </View>
        )
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputContainerBK: {
        height: 154,
        backgroundColor: '#EEEEEE',
    },
    inputContainerIphone: {
        height: 50,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        overflow: 'hidden',
        alignItems:'center',
    },
    inputContainer: {
        height: 50,
        marginTop: 2,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        overflow: 'hidden',
        alignItems:'center',
    },
    text_phone_header: {
        color: '#A1A2A3',
        marginLeft: 20,
        fontSize:14,
    },
    text_input: {
        paddingLeft: 10,
        height:40,
        width: 180,
        alignSelf: 'center',
        fontSize:14,
        backgroundColor: '#FFFFFF',
    },
    text_input2: {
        paddingLeft: 10,
        height: 40,
        width: 320,
        marginLeft:10,
        alignSelf: 'center',
        fontSize:14,
        backgroundColor: '#FFFFFF',
    },
    btnVerification: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 3,
        height: 25,
        marginRight: 20,
    },
    btnVerificationText: {
        fontSize: 12,
        color: '#525252',
    },
    bottomContainer: {
        flex: 1,
        alignSelf: 'center',
    },
    btnRegisterContainer: {
        flex:1,
        justifyContent: 'center',
    },
    btnRegister: {
      height: 45,
      width: (sr.w-30),
      borderRadius: 5,
      backgroundColor: '#DE3031'
    },
    btnRegisterText: {
        fontSize: 20,
        fontWeight: '600',
    },
    protocalContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    protocal_icon: {
        height: 15,
        width: 15,
    },
    protocal_text: {
        fontSize: 13,
        color: '#4B4B4B',
        backgroundColor: 'transparent',
    },
    protocal_button: {
        backgroundColor:'transparent',
    },
    protocal_button_text: {
        color:'#DE3031',
        fontSize: 13,
        fontStyle: 'italic',
    }
});
