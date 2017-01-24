'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    StyleSheet,
    Text,
    Animated,
    View,
    TouchableHighlight,
} = ReactNative;

var Button = require('./Button.js');

module.exports = React.createClass({
    getDefaultProps: function() {
        return {
            title: '温馨提示',
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
            this.props.doCancel();
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
                    <Text style={styles.content}>
                        {this.props.content}
                    </Text>

                    <View style={styles.buttonViewStyle}>
                        {!!this.props.doCancel &&
                            <TouchableHighlight
                                onPress={this.doCancel}
                                style={styles.buttonStyleContainCannel}>
                                <Text style={styles.buttonStyleCannel}>{this.props.cancelText}</Text>
                            </TouchableHighlight>
                        }
                        <TouchableHighlight
                            onPress={this.doConfirm}
                            style={styles.buttonStyleContain}>
                            <Text style={styles.buttonStyle} >{this.props.confirmText}</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Animated.View>
        );
    }
});

var styles = StyleSheet.create({
    buttonViewStyle: {
        position:'absolute',
        bottom: 0,
        flexDirection: 'row',
        width: sr.w-40,
        height: 50,
        justifyContent:'space-between',
    },
    redLine: {
        marginTop: 10,
        width: sr.w-40,
        height: 1,
        backgroundColor: '#A62045'
    },
    buttonStyleContain: {
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: '#A62045',
    },
    buttonStyleContainCannel: {
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#A62045',
    },
    buttonStyle: {
        fontSize: 20,
        color: 'white'
    },
    buttonStyleCannel: {
        fontSize: 20,
        color: '#A62045'
    },
    container: {
        width:sr.w-40,
        height:sr.h/3,
        alignItems:'center',
        backgroundColor:'#FFFFFF',
    },
    title: {
        color: '#A62045',
        fontSize: 20,
        textAlign: 'center',
        overflow: 'hidden',
        marginTop: 40,
    },
    content: {
        alignSelf:'center',
        color:'#000000',
        margin: 30,
        fontSize:16,
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
