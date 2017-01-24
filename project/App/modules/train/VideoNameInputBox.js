'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    StyleSheet,
    Text,
    Animated,
    View,
    TextInput,
    TouchableHighlight,
} = ReactNative;

var {Button} = COMPONENTS;

module.exports = React.createClass({
    doConfirm() {
        Animated.timing(this.state.opacity, {
            toValue: 0,
            duration: 500,
        }).start(()=>{
            this.props.doConfirm(this.state.fileName);
            Toast('保存成功,可以点击右上角查看噢')
        });
    },
    getInitialState() {
        return {
            fileName: this.props.fileName,
            opacity: new Animated.Value(0)
        };
    },
    componentDidMount() {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 500,
        }).start();
    },
    render() {
        return (
            <Animated.View style={[styles.overlayContainer, {opacity: this.state.opacity}]}>
                <View style={styles.container}>
                    <Text style={styles.title}>提示</Text>
                    <Text style={styles.redLine}>
                    </Text>
                    <Text style={styles.content}>请输入文件名以保存当前录音</Text>
                    <TextInput
                        onChangeText={(text) => this.setState({fileName: text})}
                        defaultValue={this.state.fileName}
                        underlineColorAndroid = {'transparent'}
                        style={styles.text_input} />
                    <Text style={styles.H_Line}>
                    </Text>
                    <View style={styles.buttonViewStyle}>
                        <TouchableHighlight
                            underlayColor="rgba(0, 0, 0, 0)"
                            onPress={this.doConfirm}
                            style={styles.buttonStyleContain}>
                            <Text style={styles.buttonStyle} >确定</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Animated.View>
        );
    }
});

var styles = StyleSheet.create({
    buttonViewStyle: {
        flexDirection: 'row',
        width: sr.w*5/6-20,
        height: 40,
    },
    H_Line: {
        marginTop: 5,
        width: sr.w*5/6,
        height: 1,
        backgroundColor: '#b4b4b4'
    },
    redLine: {
        marginTop: 10,
        width: sr.w-110,
        height: 1,
        backgroundColor: '#ff3c30'
    },
    line: {
        width: 1,
        height: 50,
        backgroundColor: '#b4b4b4'
    },
    buttonStyleContain: {
        height: 50,
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
    },
    buttonStyle: {
        fontSize: 15,
        color: '#000000'
    },
    container: {
        width:sr.w*5/6,
        height:210,
        marginTop: -80,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#FFFFFF',
        borderRadius:10,
    },
    title: {
        color: '#ff3c30',
        fontSize: 18,
        fontWeight: '100',
        textAlign: 'center',
        overflow: 'hidden',
    },
    content: {
        alignSelf:'center',
        color:'#000000',
        margin: 20,
    },
    text_input: {
        paddingVertical: -5,
        width:sr.w*5/6-20,
        marginTop: 5,
        paddingLeft: 20,
        height: 35,
    },
    overlayContainer: {
        position:'absolute',
        top: 0,
        alignItems:'center',
        justifyContent: 'center',
        width:sr.w,
        height:sr.h-84,
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
});
