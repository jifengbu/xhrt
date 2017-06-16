'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    StyleSheet,
    Image,
    Text,
    View,
    TextInput,
    TouchableOpacity,
} = ReactNative;

const TimerMixin = require('react-timer-mixin');
const { Button, WebviewMessageBox, DImage } = COMPONENTS;

module.exports = React.createClass({
    mixins: [TimerMixin],
    statics: {
        title: '修改密码',
    },
    getInitialState () {
        this.DEFAULT_CODE_TIMEOUT = 60;
        const time = Math.floor((Date.now() - (app.data.registerVerificationCodeTimeout || 0)) / 1000);
        const flag = time > this.DEFAULT_CODE_TIMEOUT;
        return {
            phone: '',
            password: '',
            passwordAgain: '',
            verificationCode: '',
            protocalRead: true,
            overlayShow:false,
            verificationCodeTimeout: flag ? this.DEFAULT_CODE_TIMEOUT : this.DEFAULT_CODE_TIMEOUT - time,
            verificationCodeEnable: flag,
            verificationCodeText: flag ? '获取验证码' : this.DEFAULT_CODE_TIMEOUT - time + '秒后再获取',
            errorStr: '',
            haveDlg: false,
            modifyStateStr: '修改中...',
            haveDlgok: false,
            haveDlgFail: false,
        };
    },
    componentDidMount () {
        if (!this.state.verificationCodeEnable) {
            this.updateVerificationCodeTimeout();
        }
    },
    doSubmitModify1 () {
        if (!app.utils.checkPhone(this.state.phone)) {
            // Toast('请输入正确的手机号');
            this.setState({errorStr:'请输入正确的手机号'});
            return;
        }
        if (!app.utils.checkVerificationCode(this.state.verificationCode)) {
            // Toast('请输入正确的验证码');
            this.setState({errorStr:'请输入正确的验证码'});
            return;
        }
        if (!app.utils.checkPassword2(this.state.password)) {
            // Toast('请输入正确的密码长度');
            this.setState({errorStr:'请输入正确的密码长度'});
            return;
        }
        if (this.state.password !== this.state.passwordAgain) {
            // Toast('两次输入密码不一致');
            this.setState({errorStr:'两次输入密码不一致'});
            return;
        }
        const param = {
            phone:this.state.phone,
            verificationCode:this.state.verificationCode,
        };
        POST(app.route.ROUTE_FIND_PWD, param, this.doSubmitModify1Success, this.doSubmitModify1Fail);
        this.setState({haveDlg: true});
    },
    doSubmitModify1Success (data) {
        if (data.success) {
            this.doSubmitModify2();
        } else {
            this.setState({haveDlgFail: true});
            this.setState({modifyStateStr:data.msg});
            this.setTimeout(()=>{
                this.setState({haveDlg: false});
                this.setState({haveDlgFail: false});
                this.setState({haveDlgok: false});
                this.setState({modifyStateStr:'修改中...'});
            }, 2000);
        }
    },
    doSubmitModify1Fail (data) {
        this.setState({haveDlgFail: true});
        this.setState({modifyStateStr:'修改失败'});
        this.setTimeout(()=>{
            this.setState({haveDlg: false});
            this.setState({haveDlgFail: false});
            this.setState({haveDlgok: false});
            this.setState({modifyStateStr:'修改中...'});
        }, 2000);
    },
    doSubmitModify2 () {
        this.setState({errorStr:''});
        const param = {
            phone: this.state.phone,
            pwd:this.state.password,
            pwdAgain:this.state.passwordAgain,
        };
        POST(app.route.ROUTE_UP_DATEPWD, param, this.doSubmitModify2Success, this.doSubmitModify2Fail);
    },
    doSubmitModify2Success (data) {
        if (data.success) {
            this.setState({haveDlgok: true});
            this.setState({modifyStateStr:'修改成功'});
            this.setTimeout(()=>{
                app.navigator.resetTo({
                    title: '登录赢销截拳道',
                    component: require('../login/Login.js'),
                }, 0);
            }, 1000);
        } else {
            this.setState({haveDlgFail: true});
            this.setState({modifyStateStr:data.msg});
            this.setTimeout(()=>{
                this.setState({haveDlg: false});
                this.setState({haveDlgFail: false});
                this.setState({haveDlgok: false});
                this.setState({modifyStateStr:'修改中...'});
            }, 2000);
        }
    },
    doSubmitModify2Fail () {
        this.setState({haveDlgFail: true});
        this.setState({modifyStateStr:'修改失败'});
        this.setTimeout(()=>{
            this.setState({haveDlg: false});
            this.setState({haveDlgFail: false});
            this.setState({haveDlgok: false});
            this.setState({modifyStateStr:'修改中...'});
        }, 2000);
    },
    doGetVerificationCode () {
        if (!this.state.verificationCodeEnable) {
            return;
        }
        if (!app.utils.checkPhone(this.state.phone)) {
            Toast('手机号码不是有效的手机号码');
            return;
        }
        const param = {
            phone:this.state.phone,
            type: 3, //1 表示登录  2 表示注册   3 表示忘记密码
        };
        app.data.registerVerificationCodePhone = this.state.phone;
        POST(app.route.ROUTE_SEND_VERIFICATION_CODE, param, this.doGetVerificationCodeSuccess, true);
    },
    doGetVerificationCodeSuccess (data) {
        if (data.success) {
            this.setState({ verificationCodeEnable: false, verificationCodeText: this.DEFAULT_CODE_TIMEOUT + '秒后再获取' });
            app.data.registerVerificationCodeTimeout = Date.now();
            this.updateVerificationCodeTimeout();
            Toast('验证码发送成功!');
        } else {
            Toast(data.msg);
        }
    },
    updateVerificationCodeTimeout () {
        this.intervalID = this.setInterval(() => {
            const verificationCodeTimeout = this.state.verificationCodeTimeout - 1;
            if (verificationCodeTimeout === 0) {
                this.clearInterval(this.intervalID);
                this.setState({ verificationCodeTimeout:this.DEFAULT_CODE_TIMEOUT, verificationCodeEnable: true, verificationCodeText: '获取验证码' });
            } else {
                this.setState({ verificationCodeTimeout, verificationCodeText: verificationCodeTimeout + '秒后再获取' });
            }
        }, 1000);
    },
    render () {
        return (
            <View style={styles.container}>
                <View style={styles.lineView}/>
                    <Text style={styles.errorText}>{this.state.errorStr}</Text>
                    <View style={styles.inputContainer}>
                        <Image source={app.img.personal_pw_sj}
                            resizeMode='stretch'
                            style={styles.imageiconstyle} />
                        <TextInput
                            placeholder='请输入注册手机号'
                            underlineColorAndroid='transparent'
                            onChangeText={(text) => this.setState({ phone: text })}
                            defaultValue={this.state.phone}
                            style={styles.text_input}
                            keyboardType='phone-pad'
                        />
                    </View>
                    <View style={styles.lineView1}/>
                    <View style={styles.inputContainer}>
                        <Image source={app.img.personal_pw_ok}
                            resizeMode='stretch'
                            style={styles.imageiconstyle} />
                        <TextInput
                            placeholder='请输出短信验证码'
                            underlineColorAndroid='transparent'
                            onChangeText={(text) => this.setState({ verificationCode: text })}
                            defaultValue={this.state.verificationCode}
                            style={styles.text_input3}
                            keyboardType='number-pad'
                        />
                        <Button onPress={this.doGetVerificationCode}
                            disable={!this.state.verificationCodeEnable}
                            style={this.state.verificationCodeEnable?styles.btnVerification:styles.btnVerificationTime}
                            textStyle={styles.btnVerificationText}>
                            {this.state.verificationCodeText}
                        </Button>
                    </View>
                    <View style={styles.lineView2}/>
                    <View style={styles.inputContainer}>
                        <Image source={app.img.personal_pw_mm}
                            resizeMode='stretch'
                            style={styles.imageiconstyle2} />
                        <TextInput
                            placeholder='新密码（6-16位字符）'
                            underlineColorAndroid='transparent'
                            secureTextEntry
                            onChangeText={(text) => this.setState({ password: text })}
                            defaultValue={this.state.password}
                            style={styles.text_input}
                        />
                    </View>
                    <View style={styles.lineView1}/>
                    <View style={styles.inputContainer}>
                        <Image source={app.img.personal_pw_mm}
                            resizeMode='stretch'
                            style={styles.imageiconstyle2} />
                        <TextInput
                            placeholder='确认新密码（6-16位字符）'
                            underlineColorAndroid='transparent'
                            secureTextEntry
                            onChangeText={(text) => this.setState({ passwordAgain: text })}
                            defaultValue={this.state.passwordAgain}
                            style={styles.text_input}
                        />
                    </View>
                    <View style={styles.lineView1}/>
                    <Button onPress={this.doSubmitModify1} style={styles.btnSubmit} textStyle={styles.btnModityText}>确认修改</Button>
                    {
                        this.state.haveDlg &&
                        <View style={styles.waitView}>
                            <View style={styles.waitSubView}>
                                {
                                    this.state.haveDlgok &&
                                    <Image resizeMode='stretch' source={app.img.personal_pw_dlgok}
                                        style={styles.imageiconstyle3} />
                                }
                                {
                                    this.state.haveDlgFail &&
                                    <Image resizeMode='stretch' source={app.img.personal_pw_dlgfail}
                                        style={styles.imageiconstyle3} />
                                }

                                <Text style={styles.dlgText}>{this.state.modifyStateStr}</Text>
                            </View>
                        </View>
                    }
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    waitView: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: sr.h,
        width: sr.w,
        // backgroundColor: 'rgba(222,0,0, 0.5)',
        // backgroundColor: 'transparent',
        // justifyContent: 'center',
        alignItems: 'center',
    },
    waitSubView: {
        marginTop: 200,
        height: 80,
        width: 110,
        borderRadius: 10,
        backgroundColor: 'rgba(55,55,55, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    lineView: {
        height: 1,
        backgroundColor: '#aaaaaa',
    },
    lineView1: {
        height: 1,
        backgroundColor: '#aaaaaa',
        width: sr.w-60,
        marginLeft: 30
    },
    lineView2: {
        height: 1,
        backgroundColor: '#aaaaaa',
        width: sr.w-180,
        marginLeft: 30
    },
    imageiconstyle: {
        marginLeft: 32,
        height: 22,
        width: 18,
    },
    imageiconstyle2: {
        marginLeft: 34,
        height: 18,
        width: 14,
    },
    imageiconstyle3: {
        height: 18,
        width: 18,
    },
    btnSubmit: {
        height: 42,
        marginTop: 50,
        marginHorizontal: 36,
        borderRadius: 2,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: '#DE3031',
    },
    inputContainerBK: {
        height: 154,
        backgroundColor: '#EEEEEE',
    },
    inputContainer: {
        height: 50,
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
        height: 40,
        width: 320,
        marginLeft:10,
        alignSelf: 'center',
        fontSize:14,
    },
    text_input3: {
        paddingLeft: 10,
        height: 40,
        width: 180,
        marginLeft:10,
        alignSelf: 'center',
        fontSize:14,
    },
    btnVerification: {
        marginTop: 12,
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 4,
        height: 36,
        marginRight: 20,
        borderWidth: 1,
        borderColor: '#DE3031',
        backgroundColor: 'white',
    },
    btnVerificationTime: {
        marginTop: 12,
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 4,
        height: 36,
        marginRight: 20,
        borderWidth: 1,
        borderColor: '#DE3031',
        backgroundColor: 'white',
    },
    btnVerificationText: {
        fontSize: 14,
        color: '#DE3031',
    },
    btnModityText: {
        fontSize: 16,
        color: 'white',
    },
    errorText: {
        fontSize: 14,
        color: 'red',
        marginTop: 10,
        marginLeft: 40,
    },
    dlgText: {
        fontSize: 14,
        color: 'white',
        marginTop: 10,
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
        width: (sr.w - 30),
        borderRadius: 5,
        backgroundColor: '#DE3031',
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
    },
});
