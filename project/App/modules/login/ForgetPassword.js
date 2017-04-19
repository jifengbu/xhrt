'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    TextInput,
} = ReactNative;

const { Button } = COMPONENTS;

module.exports = React.createClass({
    statics: {
        color: CONSTANTS.THEME_COLORS[1],
        title: '忘记密码',
        leftButton: { color: CONSTANTS.THEME_COLORS[1], handler: () => { app.navigator.pop(); } },
    },
    doSubmit () {
        if (!app.utils.checkPassword(this.state.pwd)) {
            Toast('密码必须有6-20位的数字，字母，下划线组成');
            return;
        }
        if (this.state.pwd !== this.state.pwdAgain) {
            Toast('两次输入密码不一致，请确认后重新输入');
            return;
        }
        const param = {
            phone: this.props.phone,
            pwd:this.state.pwd,
            pwdAgain:this.state.pwdAgain,
        };
        POST(app.route.ROUTE_UP_DATEPWD, param, this.doSubmitSuccess);
        app.navigator.popToTop();
    },
    doSubmitSuccess (data) {
        if (data.success) {
            Toast(data.msg);
            app.navigator.popToTop();
        } else {
            Toast(data.msg);
        }
    },
    render () {
        return (
            <View style={styles.container}>
                <View style={styles.outsideContainer}>
                    <TextInput
                        placeholder='请输入您的新密码'
                        underlineColorAndroid='transparent'
                        style={styles.txtPassWord}
                        secureTextEntry
                        onChangeText={(text) => this.setState({ pwd: text })}
                          />
                    <TextInput
                        placeholder='再次输入您的新密码'
                        underlineColorAndroid='transparent'
                        style={styles.txtPassWord}
                        secureTextEntry
                        onChangeText={(text) => this.setState({ pwdAgain: text })}
                          />
                    <Button onPress={this.doSubmit} style={styles.btnSubmit}>确定</Button>
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
    outsideContainer: {
        flex: 1,
        marginTop: 35,
    },
    txtPassWord: {
        paddingLeft: 10,
        height: 58,
        marginTop: 2,
        borderColor: '#D7D7D7',
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        overflow: 'hidden',
        alignItems:'center',
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
});
