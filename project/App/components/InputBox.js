'use strict';

var React = require('react');
var {
    StyleSheet,
    Text,
    Animated,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    Modal,
    TouchableHighlight
} = ReactNative;

var Button = require('./Button.js');
var dismissKeyboard = require('dismissKeyboard');

module.exports = React.createClass({
    getInitialState() {
        return {
            inputText: '',
            title: '',
        };
    },
    doConfirm() {
        let context = this.fomatString(this.state.inputText);
        let contitle = this.fomatString(this.state.title);
        if (this.props.haveTitle&&!contitle) {
            Toast("标题不能为空");
            return;
        } else if (context === '') {
            Toast("内容为空");
            return;
        }

        if (contitle) {
            this.props.doConfirm(contitle,context);
        } else {
            this.props.doConfirm(context);
        }
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
    doDelete() {
        this.props.doDelete();
        app.closeModal();
    },
    doHideDismissKeyboard() {
        dismissKeyboard();
    },
    componentDidMount() {
        this.setState({inputText:this.props.inputText});
        this.setState({title:this.props.title});
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
        let tempHeight = this.calculateStrLength(this.state.title);
        let textHeight = 50;
        if (tempHeight<= 50) {
            textHeight = 50;
        } else if (tempHeight>50 && tempHeight<= 96) {
            textHeight = tempHeight;
        } else {
            textHeight = 96;
        }
        return (
            <Modal transparent={true}>
            <TouchableOpacity
                activeOpacity={1}
                onPress={this.doHideDismissKeyboard}
                style={styles.overlayContainer}>
                <View style={[styles.background,{height:this.props.haveTitle?sr.ws(332):sr.ws(282)}]}>
                    <View style={[styles.container,{height:this.props.haveTitle?sr.ws(312):sr.ws(262)}]}>
                        {
                            this.props.haveTitle&&
                            <View>
                                <View style={[styles.topViewNoSide,{height: textHeight}]}>
                                    {
                                        !this.props.modifyTitle&&this.props.index &&
                                        <TextInput
                                          editable={true}
                                          style={[styles.topStyle,{height: textHeight-10}]}
                                          onChangeText={(text) => this.setState({title: text})}
                                          multiline={true}
                                          placeholder={''}
                                          autoCapitalize={'none'}
                                          underlineColorAndroid={'transparent'}
                                          defaultValue={this.props.index+'、'+this.props.title}
                                          />
                                    }
                                    {
                                        this.props.modifyTitle&&
                                        <TextInput
                                          editable={this.props.modifyTitle}
                                          style={[styles.topStyle,{height: textHeight-10}]}
                                          onChangeText={(text) => this.setState({title: text})}
                                          multiline={true}
                                          placeholder={'请输入标题'}
                                          autoCapitalize={'none'}
                                          underlineColorAndroid={'transparent'}
                                          defaultValue={this.props.title}
                                          />
                                    }
                                </View>
                                <View style={styles.lineView}/>
                            </View>
                        }
                        <View style={[styles.textStyleViewNoSide,{height: sr.ws(250-textHeight)}]}>
                            <TextInput
                              ref={(ref)=>this.contentInput = ref}
                              style={styles.textStyle}
                              onChangeText={(text) => this.setState({inputText: text})}
                              multiline={true}
                              placeholder={this.props.haveTitle?'输入备注内容':'轻触开始填写'}
                              autoCapitalize={'none'}
                              underlineColorAndroid={'transparent'}
                              defaultValue={this.props.inputText}
                              keyboardType={'default'}
                              />
                        </View>
                        <View style={styles.buttonViewStyle}>
                            <TouchableOpacity
                                onPress={this.doConfirm}
                                style={[styles.buttonStyleContain,!this.props.haveDelete?{borderBottomRightRadius: 2}:null]}>
                                <Text style={styles.buttonStyle} >保存</Text>
                            </TouchableOpacity>
                            {
                                this.props.haveDelete &&
                                <TouchableOpacity
                                    onPress={this.doDelete}
                                    style={styles.buttonStyleContainCancel}>
                                    <Text style={styles.buttonStyle} >删除</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                    <TouchableHighlight
                        onPress={app.closeModal}
                        underlayColor="rgba(0, 0, 0, 0)"
                        style={styles.touchableHighlight}>
                        <Image
                            resizeMode='contain'
                            source={app.img.draw_back}
                            style={styles.closeIcon}>
                        </Image>
                    </TouchableHighlight>
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
    },
    buttonStyle: {
        fontSize: 20,
        color: '#FFFFFF',
        fontFamily: 'STHeitiSC-Medium',
    },
    background: {
        width: sr.w,
        marginTop: 150,
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    container: {
        width: sr.w-30,
        marginTop: 20,
        borderRadius: 2,
        backgroundColor: '#FFFFFF',
    },
    topViewNoSide: {
        width: sr.w-45,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        flexDirection: 'row',
    },
    indexStyle: {
        fontSize: 18,
        marginLeft: 15,
        flex: 1,
        marginTop: 10,
        fontFamily: 'STHeitiSC-Medium',
        color: '#2A2A2A',
    },
    topStyle: {
        marginTop: 10,
        fontSize: 18,
        width: sr.w-180,
        flex: 1,
        paddingVertical: 2,
        marginLeft: 15,
        fontFamily: 'STHeitiSC-Medium',
        color: '#2A2A2A',
    },
    lineView: {
        position:'absolute',
        bottom: 0,
        left: 6,
        height: 1,
        width: 334,
        backgroundColor: '#DFDFDF'
    },
    overlayContainer: {
        position:'absolute',
        top: 0,
        alignItems:'center',
        width:sr.w,
        height:sr.h,
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    touchableHighlight: {
        position:'absolute',
        top: 8,
        right: 4,
        width: 30,
        height: 30,
    },
    closeIcon: {
        width: 30,
        height: 30
    },
});