'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    Animated,
    TextInput,
    Text,
    TouchableOpacity,
    Navigator,
} = ReactNative;

const dismissKeyboard = require('dismissKeyboard');

const { Button } = COMPONENTS;

module.exports = React.createClass({
    statics: {
        title: '意见反馈',
        leftButton: { image: app.img.common_back2, handler: () => { app.scene.goBack(); } },
    },
    toggleEdit () {
        this.doSubmit();
    },
    goBack () {
        dismissKeyboard();
        app.navigator.pop();
    },
    getInitialState () {
        return {
            content: '',
        };
    },
    doSubmit () {
        if (!this.state.content) {
            Toast('请填写您需要反馈的内容');
            return;
        }
        const param = {
            userID: app.personal.info.userID,
            content: this.state.content,
        };
        POST(app.route.ROUTE_SUBMIT_FEEDBACK, param, this.doSubmitSuccess);
    },
    doSubmitSuccess (data) {
        if (data.success) {
            Toast('提交成功');
            app.navigator.pop();
        } else {
            Toast(data.msg);
        }
    },
    render () {
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.contentInput}
                            underlineColorAndroid='transparent'
                            onChangeText={(text) => this.setState({ content: text })}
                            defaultValue={this.state.content}
                            multiline
                            textStyle={styles.contentText}
                            placeholderTextColor={'#A7A7A7'}
                            placeholder={'请填写反馈建议！\n您的意见就是我们成长的基石。'}
                            />
                    </View>
                    <TouchableOpacity
                        onPress={this.doSubmit}
                        style={styles.doButtonStyle}>
                        <Text style={[styles.doButtonText, { color:'#FFFFFF' }]} >提交</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0EFF5',
    },
    inputContainer: {
        height: 174,
        marginTop: 8,
        borderRadius: 2,
        marginHorizontal: 5,
        backgroundColor: '#FFFFFF',
    },
    contentInput: {
        flex: 1,
        fontSize: 16,
        marginVertical: 15,
        marginLeft: 10,
        lineHeight: 22,
        paddingVertical: 2,
        backgroundColor: '#FFFFFF',
        textAlignVertical: 'top',
    },
    contentText: {
        fontSize: 16,
        color: '#A7A7A7',
        lineHeight: 24,
        fontFamily: 'STHeitiSC-Medium',
    },
    doButtonStyle: {
        width: sr.w - 10,
        height: 46,
        marginTop: 47,
        borderRadius: 2,
        marginHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#55B0FE',
    },
    doButtonText: {
        fontSize: 18,
        lineHeight: 24,
        color: '#FFFFFF',
        fontFamily: 'STHeitiSC-Medium',
    },
});
