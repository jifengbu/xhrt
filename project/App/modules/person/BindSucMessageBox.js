'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    StyleSheet,
    Text,
    Animated,
    View,
    TouchableHighlight,
} = ReactNative;

var Button = require('../../components/Button.js');

module.exports = React.createClass({
    getDefaultProps: function() {
        return {
            title: '恭喜您绑定成功',
            content: '确定要执行操作吗？',
            cancelText: '取消',
            confirmText: '确定',
        };
    },
    getInitialState() {
        return {
            opacity: new Animated.Value(0)
        };
    },
    doCancel() {
        this.closeModal(()=>{
            //this.props.doCancel();
        });
    },
    doConfirm() {
        this.closeModal(()=>{
            this.props.doConfirm();
        });
    },
    componentDidMount() {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 500,
        }).start();
    },
    closeModal(callback) {
        Animated.timing(this.state.opacity, {
            toValue: 0,
            duration: 500,
        }).start(()=>{
            callback();
        });
    },
    render() {
        return (
            <Animated.View style={[styles.overlayContainer, {opacity: this.state.opacity}]}>
                <View style={styles.container}>
                    <Text style={styles.title}>{this.props.title}</Text>
                    <Text style={styles.redLine}>
                    </Text>
                    <View style={styles.contentView}>
                      <Text style={styles.content}>
                            {"年费会员拥有"}
                      </Text>
                      <Text style={styles.contentRed}>
                            {"  1  "}
                      </Text>
                      <Text style={styles.content}>
                            {"年的特权"}
                      </Text>
                    </View>

                    <Text style={styles.content}>
                        {"可在学习场无限学习"}
                    </Text>
                    <Text style={styles.content}>
                        {"在训练场和高手对决"}
                    </Text>
                    <View style={styles.buttonViewStyle}>
                        <Button
                          onPress={this.doConfirm}
                          style={styles.buttonStyleContain}
                          textStyle={styles.buttonStyle}>
                          确   定
                        </Button>
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
        marginTop: 10,
        width: sr.w*5/6,
        height: 1,
        backgroundColor: '#b4b4b4'
    },
    redLine: {
        marginVertical: 10,
        width:sr.w*5/6,
        height: 1,
        backgroundColor: '#4FC1E9'
    },
    line: {
        width: 1,
        height: 50,
        backgroundColor: '#b4b4b4'
    },
    buttonStyleContain: {
        backgroundColor: '#91C458',
        height: 40,
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
        marginHorizontal: 40,
        marginVertical: 20,
        borderRadius:5,
    },
    buttonStyle: {
        fontSize: 15,
        color: '#ffffff'
    },
    container: {
        width:sr.w*6/7,
        height:sr.h/3,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#FFFFFF',
        borderRadius:5,
    },
    title: {
        color: '#000000',
        fontSize: 18,
        fontWeight: '100',
        textAlign: 'center',
        overflow: 'hidden',
        top:0,
    },
    contentView: {
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'center',
    },
    content: {
        alignSelf:'center',
        color:'#8b8b8b',
        marginVertical: 3,
    },
    contentRed: {
        alignSelf:'center',
        color:'#ff0000',
        marginVertical: 3,
    },
    overlayContainer: {
        position:'absolute',
        bottom: 0,
        alignItems:'center',
        justifyContent: 'center',
        width:sr.w,
        height:sr.h,
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
});
