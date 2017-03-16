'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
    Image,
    View,
    TextInput,
    ListView,
    Text,
    TouchableOpacity,
} = ReactNative;

var GetVerification = require('./GetVerification.js');
var Home = require('../home/index.js');
var Umeng = require('../../native/index.js').Umeng;
var UmengMgr = require('../../manager/UmengMgr.js');
var LocalDataMgr = require('../../manager/LocalDataMgr.js');

var {Button} = COMPONENTS;

var WeixinQQPanel = React.createClass({
    empty(type) {
        Toast(type === 1?'未安装微信':'未安装QQ');
    },
    render() {
        return (
            <View style={styles.thirdpartyContainer}>
                <View style={styles.thirdpartyButtonContainer}>
                    {
                        <TouchableOpacity
                            onPress={!!this.props.weixininstalled ? this.props.doExternalLogin.bind(null,Umeng.platforms.UMShareToWechatSession):this.empty.bind(null,1)}
                            style={styles.thirdpartyLeftButtonContainer}>
                            <Image
                                resizeMode='stretch'
                                source={app.img.login_weixin_button}
                                style={styles.image_button}
                                />
                            <Text style={styles.image_button_text}>微信登录</Text>
                        </TouchableOpacity>
                    }
                    {
                        <TouchableOpacity
                            onPress={!!this.props.qqinstalled ?this.props.doExternalLogin.bind(null,Umeng.platforms.UMShareToQQ):this.empty.bind(null,2)}
                            style={styles.thirdpartyRightButtonContainer}>
                            <Image
                                resizeMode='stretch'
                                source={app.img.login_qq_button}
                                style={styles.image_button}
                                />
                            <Text style={styles.image_button_text}>QQ登录</Text>
                        </TouchableOpacity>
                    }
                </View>
            </View>
        )
    }
});

module.exports = React.createClass({
    doExternalLogin(type) {
        UmengMgr.doThirdPartyLogin(type,this.doLoginCallback.bind(null,type));
    },
    doLoginCallback(type,detail) {
        app.uid = detail.uid;
        this.getData(type,detail);
    },
    getData(type,detail) {
        let longType = 0;
        if (type === Umeng.platforms.UMShareToWechatSession) {
            longType = 1;
        } else if (type === Umeng.platforms.UMShareToQQ) {
            longType = 2;
        }
        var param = {
            uid: detail.uid,
            screen_name: detail.screen_name,//昵称
            iconurl: detail.profile_image_url,//头像
            longType: longType  //1 表示微信登录  2 表示QQ登录
        };
        app.showProgressHUD();
        POST(app.route.ROUTE_EXTERNAL_LOGIN, param, this.getDataSuccess, this.getDataError);
    },
    getDataSuccess(data) {
        if (data.success) {
            this.userID = data.context.userID;
            app.isBind = data.context.isBind;
            LocalDataMgr.setValueAndKey('loginMethod', 1);
            this.doGetPersonalInfo();
        } else {
            Toast(data.msg);
            app.dismissProgressHUD();
        }
    },
    getDataError(error) {
        app.dismissProgressHUD();
    },
    doLogin() {
        if (!app.utils.checkPhone(this.state.phone)) {
            Toast('手机号码不是有效的手机号码');
            return;
        }
        if (!app.utils.checkPassword(this.state.password)) {
            Toast('密码必须有6-20位的数字，字母，下划线组成');
            return;
        }
        var param = {
            phone:this.state.phone,
            pwd:this.state.password,
            type:1  //1 表示登录  2 表示注册   3 表示忘记密码
        };
        app.showProgressHUD();
        POST(app.route.ROUTE_LOGIN, param, this.doLoginSuccess, this.doLoginError);
    },
    doLoginSuccess(data) {
        if (data.success) {
            this.userID = data.context.userID;
            app.login.savePhone(this.state.phone);
            app.isBind = true;
            LocalDataMgr.setValueAndKey('loginMethod', 2);
            this.doGetPersonalInfo();
        } else {
            Toast(data.msg);
            app.dismissProgressHUD();
        }
    },
    doLoginError(error) {
        app.dismissProgressHUD();
    },
    doShowForgetPassword() {
        app.navigator.push({
            component: GetVerification,
        });
    },
    doGetPersonalInfo() {
        var param = {
            userID: this.userID,
            __from__: 'login',
        };
        POST(app.route.ROUTE_GET_PERSONAL_INFO, param, this.getPersonalInfoSuccess, this.getPersonalInfoError);
    },
    getPersonalInfoSuccess(data) {
        if (data.success) {
            var context = data.context;
            context['userID'] = this.userID;
            context['phone'] = this.state.phone;
            app.personal.set(context);
            //初始化学习视频数据
            var studyNumInfo = app.studyNumMgr.info;
            if (studyNumInfo) {
                if (studyNumInfo.time != app.utils.getCurrentDateString()) {
                    app.studyNumMgr.initStudyNum();
                }
            } else {
                app.studyNumMgr.initStudyNum();
            }
            app.navigator.replace({
                component: Home,
            });
        } else {
            app.dismissProgressHUD();
            Toast(data.msg);
        }
    },
    getPersonalInfoError(error) {
        app.dismissProgressHUD();
    },
    getInitialState() {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            phone: this.props.phone|| app.login.list[0]||"",
            password: "",
            dataSource: ds.cloneWithRows(app.login.list),
            showList: false,
            showListBorder: false,
            weixininstalled: Umeng.isWeixinInstalled,
            qqinstalled: Umeng.isQQInstalled,
        };
    },
    onPhoneTextInputLayout(e) {
        var frame = e.nativeEvent.layout;
        this.listTop = frame.y+ frame.height;
    },
    renderRow(text) {
        return (
            <TouchableOpacity onPress={()=>this.setState({phone: text, showList:false, showListBorder:false})}>
                <View style={styles.row}>
                    <Text style={styles.itemText}>
                        {text}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    },
    renderSeparator(sectionID, rowID) {
        return (
            <View style={styles.separator} key={rowID}/>
        );
    },
    onFocus() {
        // this.onPhoneTextChange(this.state.phone);
    },
    onBlur() {
        // this.setState({showListBorder: true});
    },
    onPhoneTextChange(text) {
        // var dataSource = this.state.dataSource;
        // var newData = _.filter(app.login.list, (item)=>{var reg=new RegExp('^'+text+'.*'); return reg.test(item)});
        this.setState({
            phone: text,
            // dataSource: dataSource.cloneWithRows(newData),
            // showList: newData.length > 0 && text.length < 11,
            // showListBorder: false,
        });
    },
    render() {
        var row = this.state.dataSource.getRowCount();
        var listHeight = row>4?styles.listHeightMax:row<2?styles.listHeightMin:null;
        return (
            <View style={styles.container}>
                <View style={styles.inputContainerBK}>
                    <View
                        style={styles.inputContainerIphone}
                        onLayout={this.onPhoneTextInputLayout}
                        >
                        <Image
                            resizeMode='stretch'
                            source={app.img.login_user}
                            style={styles.input_icon}
                            />
                        <TextInput
                            placeholder="您的手机号码"
                            onChangeText={this.onPhoneTextChange}
                            value={this.state.phone}
                            style={styles.text_input}
                            keyboardType='phone-pad'
                            onFocus={this.onFocus}
                            onBlur={this.onBlur}
                            />
                    </View>
                    <View style={styles.inputContainerPwd}>
                        <Image
                            resizeMode='stretch'
                            source={app.img.login_locked}
                            style={styles.input_icon}
                            />
                        <TextInput
                            placeholder="您的密码"
                            secureTextEntry={true}
                            onChangeText={(text) => this.setState({password: text})}
                            defaultValue={this.state.password}
                            style={styles.text_input}
                            />
                    </View>
                </View>
                <View style={styles.btnForgetPassWordContainer}>
                    <Button onPress={this.doShowForgetPassword} style={styles.btnForgetPassWord} textStyle={styles.btnForgetPassWordText}>忘记密码?</Button>
                </View>
                <View style={styles.btnLoginContainer}>
                    <Button onPress={this.doLogin} style={styles.btnLogin} textStyle={styles.btnLoginText}>登  录</Button>
                </View>
                {
                    <WeixinQQPanel qqinstalled={this.state.qqinstalled} weixininstalled={this.state.weixininstalled} doExternalLogin={this.doExternalLogin}/>
                }
                {
                    this.state.showList &&
                    <ListView
                        enableEmptySections={true}
                        dataSource={this.state.dataSource}
                        keyboardShouldPersistTaps={true}
                        renderRow={this.renderRow}
                        renderSeparator={this.renderSeparator}
                        style={[styles.list, {top: this.listTop}, listHeight, this.state.showListBorder?{borderColor: '#A62045'}:null]}
                        />
                }
            </View>
        )
    }
});


var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputContainerBK: {
        backgroundColor: '#EEEEEE',
    },
    inputContainerIphone: {
        height: 59,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        overflow: 'hidden',
        alignItems:'center',
    },
    inputContainerPwd: {
        height: 59,
        marginTop: 1,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        overflow: 'hidden',
        alignItems:'center',
    },
    input_icon: {
        left: 20,
        width: 22,
        height: 22,
    },
    text_input: {
        left: 40,
        height:40,
        width: 250,
        fontSize:16,
        alignSelf: 'center',
        backgroundColor: '#FFFFFF',
    },
    btnForgetPassWordContainer: {
        height: 50,
        justifyContent:'center',
    },
    btnForgetPassWord: {
        marginRight: 20,
        borderRadius: 5,
        alignSelf: 'flex-end',
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: '#DE3031'
    },
    btnForgetPassWordText: {
        fontSize: 14,
    },
    btnLoginContainer: {
        flex: 1,
        justifyContent:'center',
        alignSelf: 'center',
    },
    btnLogin: {
        height: 45,
        width: (sr.w-30),
        borderRadius: 5,
        backgroundColor: '#DE3031'
    },
    btnLoginText: {
        fontSize: 18,
        fontWeight: '600',
    },
    thirdpartyContainer: {
    },
    thirdpartyButtonContainer: {
        height: 100,
        marginHorizontal: 30,
        flexDirection: 'row',
    },
    thirdpartyLeftButtonContainer: {
        flex:1,
        alignItems:'center',
    },
    thirdpartyRightButtonContainer: {
        flex:1,
        alignItems:'center',
    },
    image_button: {
        width: 50,
        height: 50,
        margin: 10,
    },
    image_button_text: {
        color: '#4C4D4E',
        fontSize: 13,
        backgroundColor: 'transparent'
    },
    thirdpartyContainer2: {
        marginTop: 30,
        height: 200,
        alignItems:'center',
        justifyContent: 'flex-end',
    },
    thirdpartyContainer2_text: {
        color: '#5DC2E6',
        fontSize: 18,
        marginBottom:60,
    },
    list: {
        position: 'absolute',
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderRadius: 5,
        borderColor: 'red',
        width: (sr.w-48),
        left: 38,
        padding: 10,
    },
    listHeightMin: {
        height: 100,
    },
    listHeightMax: {
        height: 184,
    },
    row: {
        height: 50,
        justifyContent: 'center',
    },
    itemText: {
        fontSize: 16,
    },
    separator: {
        backgroundColor: '#DDDDDD',
        height: 1,
    },
});
