'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    Text,
    Image,
    Animated,
    View,
} = ReactNative;

const { Button } = COMPONENTS;

module.exports = React.createClass({
    doUseLoudSpeaker () {
        this.closeModal(() => {
            this.props.doUseLoudSpeaker();
        });
    },
    doDelete () {
        this.closeModal(() => {
            this.props.doDelete();
        });
    },
    doBack () {
        this.closeModal(() => {
            this.props.doBack();
        });
    },
    getInitialState () {
        return {
            opacity: new Animated.Value(0),
        };
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
                    <Button
                        onPress={this.doDelete}
                        textStyle={styles.btnText}
                        style={styles.selectButton}>删除</Button>
                    <View style={styles.lineView} />
                    <Button
                        onPress={this.doBack}
                        textStyle={styles.btnText}
                        style={styles.selectButton}>返回</Button>
                </View>
            </Animated.View>
        );
    },
});
const styles = StyleSheet.create({
    container: {
        width:sr.w * 5 / 8,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#FFFFFF',
    },
    overlayContainer: {
        position:'absolute',
        bottom: 0,
        alignItems:'center',
        justifyContent: 'center',
        width:sr.w,
        height:sr.h,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    lineView: {
        marginVertical: 5,
        width: sr.w * 5 / 8,
        height: 1,
        backgroundColor: '#cccccc',
    },
    btnText: {
        fontSize: 17,
        fontWeight: '600',
        color:'gray',
    },
    selectButton: {
        height:45,
        width: sr.w * 5 / 8 - 50,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start',
        backgroundColor:'white',
    },
});
