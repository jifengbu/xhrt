'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
    Text,
    Animated,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    Modal,
} = ReactNative;

var Button = COMPONENTS;
var dismissKeyboard = require('dismissKeyboard');

module.exports = React.createClass({
    getInitialState() {
        return {
            inputText: '',
        };
    },
    doConfirm() {
        let context = this.fomatString(this.state.inputText);
        if (context === '') {
            Toast("内容为空");
            return;
        }
        this.props.doConfirm(context);
        app.closeModal();
    },
    fomatString(oldStr) {
        let newStr = '';
        let context = '';
        if (oldStr) {
            newStr = oldStr.replace(/(^\s*)|(\s*$)/g,""); //删除首尾空格
            context = newStr.replace(/(^[\r\n])+/g, "");//删除空行
        }
        return context;
    },
    doHideDismissKeyboard() {
        dismissKeyboard();
    },
    calculateStrLength(oldStr) {
        let height = 0;
        let linesHeight = 0;
        if (oldStr) {
            oldStr = oldStr.replace(/<\/?.+?>/g,/<\/?.+?>/g,"");
            oldStr = oldStr.replace(/[\r\n]/g, '|');
            let StrArr = oldStr.split('|');
            for (var i = 0; i < StrArr.length; i++) {
                //计算字符串长度，一个汉字占2个字节
                let newStr = StrArr[i].replace(/[^\x00-\xff]/g,"aa").length;
                //计算行数
                if (newStr == 0) {
                    linesHeight = 1;
                } else {
                    linesHeight = Math.ceil(newStr/30);
                }
                //计算高度，每行18
                height += linesHeight*sr.ws(22);
            }
            return height+1*sr.ws(30);
        } else {
            return 0;
        }
    },
    render() {
        return (
            <Modal transparent={true}>
            <TouchableOpacity
                activeOpacity={1}
                onPress={this.doHideDismissKeyboard}
                style={styles.overlayContainer}>
                <View style={[styles.container,{height:this.props.haveTitle?sr.ws(312):sr.ws(262)}]}>
                    <View style={styles.textStyleViewNoSide}>
                        <TextInput
                          ref={(ref)=>this.contentInput = ref}
                          style={styles.textStyle}
                          onChangeText={(text) => this.setState({inputText: text})}
                          multiline={true}
                          placeholder={'输入评论内容'}
                          autoCapitalize={'none'}
                          underlineColorAndroid={'transparent'}
                          defaultValue={this.props.inputText}
                          keyboardType={'default'}
                          />
                    </View>
                    <View style={styles.buttonViewStyle}>
                        <TouchableOpacity
                            onPress={this.doConfirm}
                            style={styles.buttonStyleContain}>
                            <Text style={styles.buttonStyle} >评论</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={app.closeModal}
                            style={styles.buttonStyleContainCancel}>
                            <Text style={styles.buttonStyle} >取消</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
            </Modal>
        );
    }
});
// autoFocus={true}
var styles = StyleSheet.create({
    buttonViewStyle: {
        position:'absolute',
        bottom: 0,
        flexDirection: 'row',
        width: 345,
        height: 46,
        justifyContent:'center',
        alignItems:'center',
    },
    buttonStyleContain: {
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: '#FF6363',
        height: 46,
        borderColor:'#FF6363',
        borderWidth:1,
        borderBottomLeftRadius: 2,
    },
    buttonStyleContainCancel: {
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: '#C6C6C6',
        height: 46,
        borderColor:'#C6C6C6',
        borderWidth:1,
        borderBottomRightRadius: 2,
    },
    textStyle: {
        fontSize: 18,
        paddingVertical: 2,
        margin: 5,
        width: sr.w-60,
        flex: 1,
        fontFamily: 'STHeitiSC-Medium',
        color: '#2A2A2A',
        textAlignVertical: 'top',
    },
    textStyleViewNoSide:{
        margin: 10,
        width: sr.w-50,
        height: 250,
    },
    buttonStyle: {
        fontSize: 20,
        color: '#FFFFFF',
        fontFamily: 'STHeitiSC-Medium',
    },
    container: {
        width: sr.w-30,
        marginTop: 20,
        borderRadius: 2,
        backgroundColor: '#FFFFFF',
    },
    overlayContainer: {
        position:'absolute',
        top: 0,
        alignItems:'center',
        width:sr.w,
        height:sr.h,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
});
