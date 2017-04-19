'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    Text,
    Animated,
    View,
    Linking,
    TextInput,
    Modal,
    TouchableOpacity,
} = ReactNative;

const TimerMixin = require('react-timer-mixin');
const { Button } = COMPONENTS;

module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState () {
        const { DEFAULT_CODE_TIMEOUT } = CONSTANTS;
        const time = Math.floor((Date.now() - (app.data.registerVerificationCodeTimeout || 0)) / 1000);
        const flag = time > DEFAULT_CODE_TIMEOUT;
        return {
            opacity: new Animated.Value(0),
            verificationCode: '',
            phone: app.data.registerVerificationCodePhone || '',
            password: '',
            verificationCodeTimeout: flag ? DEFAULT_CODE_TIMEOUT : DEFAULT_CODE_TIMEOUT - time,
            verificationCodeEnable: flag,
            verificationCodeText: flag ? '发送验证码' : DEFAULT_CODE_TIMEOUT - time + '秒后再发送...',
        };
    },
    componentDidMount () {
        if (!this.state.verificationCodeEnable) {
            this.updateVerificationCodeTimeout();
        }
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
            type: 4, //1 表示登录  2 表示注册   3 表示忘记密码 4 三方登录电话绑定
        };
        app.data.registerVerificationCodePhone = this.state.phone;
        POST(app.route.ROUTE_SEND_VERIFICATION_CODE, param, this.doGetVerificationCodeSuccess, true);
    },
    doGetVerificationCodeSuccess (data) {
        if (data.success) {
            this.setState({ verificationCodeEnable: false, verificationCodeText: CONSTANTS.DEFAULT_CODE_TIMEOUT + '秒后再发送...' });
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
                this.setState({ verificationCodeTimeout:CONSTANTS.DEFAULT_CODE_TIMEOUT, verificationCodeEnable: true, verificationCodeText: '发送验证码' });
            } else {
                this.setState({ verificationCodeTimeout, verificationCodeText: verificationCodeTimeout + '秒后再发送...' });
            }
        }, 1000);
    },
    doBinding () {
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
        const param = {
            phone:this.state.phone,
            uid:app.uid,
            verificationCode: this.state.verificationCode,
            pwd: this.state.password,
        };
        POST(app.route.ROUTE_USER_INFO_BINDING, param, this.doBindingSuccess);
    },
    cancelBinding () {
        if (this.intervalID) {
            this.clearInterval(this.intervalID);
        }
        app.closeModal();
    },
    doBindingSuccess (data) {
        if (data.success) {
            const info = app.personal.info;
            if (data.context) {
                info.userID = data.context.user.id;
            //   info.name = data.context.user.userName;
            //   info.alias = data.context.user.alias;
            //   info.headImg = data.context.user.userImg;
            //   info.company = data.context.user.company;
            //   info.post = data.context.user.post;
                info.isSpecialSoldier = data.context.isSpecialSoldier;
                app.personal.set(info);
                this.doGetPersonalInfo(data.context.user.id);
            }
            app.isBind = true;
        } else {
            Toast(data.msg);
        }
    },
    doGetPersonalInfo (id) {
        const param = {
            userID: id,
        };
        POST(app.route.ROUTE_GET_PERSONAL_INFO, param, this.getPersonalInfoSuccess);
    },
    getPersonalInfoSuccess (data) {
        if (data.success) {
            const context = data.context;
            context['userID'] = app.personal.info.userID;
            context['phone'] = app.personal.info.phone;
            app.personal.set(context);
            this.props.doRefresh();
            Toast('绑定成功');
            app.closeModal();
        }
    },
    render () {
        return (
            <Modal onRequestClose={() => {}} transparent>
                <View style={styles.overlayContainer}>
                    <View style={styles.container}>
                        <View style={styles.titleView}>
                            <Text style={styles.title}>
                                {'绑定手机号'}
                            </Text>
                        </View>
                        <Text style={styles.redLine} />
                        <View
                            style={styles.inputContainerBK}>
                            <View style={[styles.inputContainerIphone, { justifyContent: 'space-between' }]}>
                                <Text style={styles.text_phone_header}>+86</Text>
                                <TextInput
                                    placeholder='手机号码'
                                    underlineColorAndroid='transparent'
                                    onChangeText={(text) => this.setState({ phone: text })}
                                    defaultValue={this.state.phone}
                                    style={[styles.text_input, { width: this.state.verificationCodeEnable ? 180 : 160 }]}
                                    keyboardType='phone-pad'
                                />
                                <Button
                                    onPress={this.doGetVerificationCode}
                                    disable={!this.state.verificationCodeEnable}
                                    style={[styles.btnVerification, this.state.verificationCodeEnable ? { backgroundColor: '#DE3031' } : { backgroundColor: '#D5D6D7' }]}
                                    textStyle={[styles.btnVerificationText, this.state.verificationCodeEnable ? { color: 'white' } : { color: '#525252' }]}>
                                    {this.state.verificationCodeText}
                                </Button>
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    placeholder='验证码'
                                    underlineColorAndroid='transparent'
                                    onChangeText={(text) => this.setState({ verificationCode: text })}
                                    defaultValue={this.state.verificationCode}
                                    style={styles.text_input2}
                                    keyboardType='number-pad'
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    placeholder='密码'
                                    underlineColorAndroid='transparent'
                                    secureTextEntry
                                    onChangeText={(text) => this.setState({ password: text })}
                                    defaultValue={this.state.password}
                                    style={styles.text_input2}
                                />
                            </View>
                        </View>
                        <View style={styles.buttonViewStyle}>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={this.cancelBinding}
                                style={styles.buttonStyleContainCannel}>
                                <Text style={styles.buttonStyleCannel}>以后再说</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={this.doBinding}
                                style={styles.buttonStyleContain}>
                                <Text style={styles.buttonStyle} >立即绑定</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    },
});

const styles = StyleSheet.create({
    buttonViewStyle: {
        marginTop: 1,
        flexDirection: 'row',
        width: sr.w - 60,
        height: 60,
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 2,
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    redLine: {
        width: sr.w - 60,
        height: 1,
        backgroundColor: '#DC3237',
    },
    buttonStyleContain: {
        width: 120,
        height: 35,
        marginLeft: 30,
        justifyContent:'center',
        alignItems:'center',
        marginTop: 10,
        backgroundColor: '#DE3031',
    },
    buttonStyleContainCannel: {
        width: 120,
        height: 35,
        marginTop: 10,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#DE3031',
    },
    buttonStyle: {
        fontSize: 16,
        color: 'white',
        fontFamily: 'STHeitiSC-Medium',
    },
    buttonStyleCannel: {
        fontSize: 16,
        color: '#DE3031',
        fontFamily: 'STHeitiSC-Medium',
    },
    container: {
        width:sr.w - 60,
        marginTop: 160,
        borderRadius: 2,
        alignItems:'center',
        backgroundColor:'#EEEEEE',
    },
    titleView: {
        width: sr.w - 60,
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
        backgroundColor: '#FFFFFF',
    },
    title: {
        color: '#151515',
        fontSize: 18,
        marginVertical: 15,
        textAlign: 'center',
        fontFamily: 'STHeitiSC-Medium',
    },
    overlayContainer: {
        position:'absolute',
        top: 0,
        alignItems:'center',
        width:sr.w,
        height:sr.h,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    inputContainerBK: {
        width: sr.w - 60,
        height: 152,
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
        marginTop: 1,
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
        alignSelf: 'center',
        fontSize:14,
        backgroundColor: '#FFFFFF',
    },
    text_input2: {
        paddingLeft: 10,
        height: 40,
        width: 300,
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
        marginRight: 30,
    },
    btnVerificationText: {
        fontSize: 12,
        color: '#525252',
    },
});
