'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
} = ReactNative;

const { Button } = COMPONENTS;
const BindSucMgeBox = require('./BindSucMessageBox.js');
const BindFailMgeBox = require('./BindFailMessageBox.js');
const BindSucBuyMgeBox = require('./BindSucBuyMessageBox.js');
const PackageList = require('../package/PackageList.js');

module.exports = React.createClass({
    statics: {
        title: '帐号绑定',
    },
    getInitialState () {
        return {
            showBindSuccessBox: false,
            showBindFailBox: false,
            showBindBuySuccessBox: false,
            inputText:'',
            msg:'',
        };
    },
    doConfirm () {
        this.setState({
            showBindFailBox:false,
            showBindBuySuccessBox:false,
        });
    },
    doConfirmSuccess () {
        this.setState({
            showBindSuccessBox:false,
        });
        app.navigator.pop();
    },
    doConfirmGoBuy () {
        this.setState({
            showBindBuySuccessBox:false,
        });
        app.navigator.push({
            title: '套餐',
            component: PackageList,
        });
    },
    bindAccount () {
        const param = {
            userID: app.personal.info.userID,
            accountID: this.state.inputText,
        };
        console.log('shiyi log: ' + this.state.inputText);
        POST(app.route.ROUTE_BIND_ACCOUNT_SCORE, param, this.bindAccountSuccess, this.bindAccountFailed);
    },
    bindAccountSuccess (data) {
        if (data.success) {
            const personInfo = app.personal.info;
            if (data.obj.userType == '2') {
                personInfo.userType = '2';
                this.setState({ showBindSuccessBox:true });
            } else {
                personInfo.userType = '0';
                this.setState({ showBindBuySuccessBox:true });
            }
            app.personal.set(personInfo);
        } else {
            this.setState({ showBindFailBox:true });
            this.setState({ msg:data.msg });
        }
    },
    bindAccountFailed () {
    },
    updateText: function (text) {
        this.setState({ inputText:text });
    },
    render () {
        return (
            (app.personal.info.endTime && app.personal.info.userType == 2) ?
                <View style={[styles.infoTextView, { marginTop:40 }]}>
                    <Text style={styles.infoText}>
                      您已经是年费会员
                </Text>
                    <View style={styles.infoRowTextView}>
                        <Text style={styles.infoText}>
                        会员有效期至  :
                    </Text>
                        <Text style={styles.infoText2}>
                            {'  '}{app.personal.info.endTime}
                        </Text>
                    </View>
                </View> :
                <View style={styles.container}>
                    <TextInput
                        style={styles.keyInputText}
                        maxLength={128}
                        onChange={(event) => this.updateText(
                    event.nativeEvent.text
                  )}
                        placeholder={'请输入您的邀请码'} />
                    <View style={styles.infoTextView}>
                        <Text style={styles.infoText}>
                            绑定邀请码可以成为年费会员
                      </Text>
                        <View style={styles.infoRowTextView}>
                            <Text style={styles.infoText}>
                                邀请码使用权限  :
                            </Text>
                            <Text style={styles.infoText2}>
                                {'    '}{'一年'}
                            </Text>
                        </View>
                    </View>
                    <Button
                        onPress={this.bindAccount}
                        style={styles.btnBind}
                        textStyle={styles.btnBindText}>
                  确   定
              </Button>

                    {
                  this.state.showBindSuccessBox &&
                  <BindSucMgeBox doConfirm={this.doConfirmSuccess}
                     />
              }
                    {
                  this.state.showBindBuySuccessBox &&
                  <BindSucBuyMgeBox doConfirm={this.doConfirmGoBuy} doCancle={this.doConfirm}
                     />
              }
                    {
                  this.state.showBindFailBox &&
                  <BindFailMgeBox {...this.state}
                      doConfirm={this.doConfirm}
                     />
              }

                </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyInputText: {
        borderRadius: 5,
        marginHorizontal: 10,
        marginVertical: 20,
        marginTop: 150,
        marginBottom: 130,
        height: 40,
        padding: 10,
        fontSize: 14,
        backgroundColor: '#FFFFFF',
    },
    btnBind: {
        marginHorizontal: 10,
        marginVertical: 20,
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 10,
        height: 40,
    },
    btnBindText: {
        fontSize: 18,
    },
    infoTextView:{
        alignItems:'center',
        justifyContent:'center',
    },
    infoText:{
        fontStyle: 'italic',
        fontSize: 15,
        padding:5,
        color: '#8b8b8b',
    },
    infoText2:{
        fontStyle: 'italic',
        fontSize: 15,
        padding:5,
        color: CONSTANTS.THEME_COLOR,
    },
    infoRowTextView: {
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'center',
    },
});
