'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    StyleSheet,
    Text,
    Animated,
    View,
    TouchableHighlight,
} = ReactNative;

const Button = require('../../components/Button.js');

module.exports = React.createClass({
    getDefaultProps: function () {
        return {
            title: '绑定失败',
            content: '',
            cancelText: '取消',
            confirmText: '确定',
        };
    },
    getInitialState () {
        return {
            opacity: new Animated.Value(0),
        };
    },
    doCancel () {
        this.closeModal(() => {
            // this.props.doCancel();
        });
    },
    doConfirm () {
        this.closeModal(() => {
            this.props.doConfirm();
        });
    },
    componentDidMount () {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 500,
        }).start();
    },
    closeModal (callback) {
        Animated.timing(this.state.opacity, {
            toValue: 0,
            duration: 500,
        }).start(() => {
            callback();
        });
    },
    render () {
        return (
            <Animated.View style={[styles.overlayContainer, { opacity: this.state.opacity }]}>
                <View style={styles.container}>
                    <Text style={styles.title}>{this.props.title}</Text>
                    <Text style={styles.redLine} />
                    <Text style={styles.content}>
                        {this.props.msg}
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
    },
});

const styles = StyleSheet.create({
    buttonViewStyle: {
        flexDirection: 'row',
        width: sr.w * 5 / 6 - 20,
        height: 40,
    },
    H_Line: {
        marginTop: 10,
        width: sr.w * 5 / 6,
        height: 1,
        backgroundColor: '#b4b4b4',
    },
    redLine: {
        marginVertical: 10,
        width:sr.w * 5 / 6,
        height: 1,
        backgroundColor: '#4FC1E9',
    },
    line: {
        width: 1,
        height: 50,
        backgroundColor: '#b4b4b4',
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
        color: '#ffffff',
    },
    container: {
        width:sr.w * 6 / 7,
        height:sr.h / 3,
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
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
});
