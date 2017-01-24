'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    StyleSheet,
    Text,
    Image,
    Animated,
    View,
    TouchableHighlight,
} = ReactNative;

var {Button} = COMPONENTS;

module.exports = React.createClass({
    doConfirm() {
        this.closeModal(()=>{
            this.props.doConfirm();
        });
    },
    getInitialState() {
        return {
            opacity: new Animated.Value(0)
        };
    },
    componentDidMount() {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 500,
        }).start();
    },
    doClose() {
        this.closeModal(()=>{
            this.props.doCancel();
        });
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
                    <View style={styles.boxContainer}>
                        <Text style={styles.title}>提示</Text>
                        <View style={styles.line}/>
                        <View style={styles.drawContent}>
                            {this.props.children}
                        </View>
                        <Button
                            onPress={this.doConfirm}
                            style={styles.drawButton}>确定</Button>
                    </View>
                    <TouchableHighlight
                        onPress={this.doClose}
                        underlayColor="rgba(0, 0, 0, 0)"
                        style={styles.touchableHighlight}>
                        <Image
                            resizeMode='contain'
                            source={app.img.draw_back}
                            style={styles.closeIcon}>
                        </Image>
                    </TouchableHighlight>
                </View>
            </Animated.View>
        );
    }
});


var styles = StyleSheet.create({
    container: {
        alignItems:'center',
        justifyContent:'center',
    },
    boxContainer: {
        alignItems:'center',
        justifyContent:'center',
        width:sr.w*5/6,
        borderRadius: 2,
        backgroundColor: '#EEEEEE',
    },
    title: {
        marginVertical:10,
        fontSize: 18,
        fontWeight: '100',
        overflow: 'hidden',
    },
    line: {
        height:1,
        width:sr.w*5/6,
        backgroundColor: 'gray',
    },
    drawContent: {
        flex:1,
        marginVertical:15,
        alignItems:'center',
        justifyContent: 'center',
    },
    drawButton: {
        width:120,
        height:40,
        marginHorizontal:20,
        marginBottom: 20,
        borderRadius: 2,
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
    touchableHighlight: {
        position:'absolute',
        top:0,
        left:sr.w*5/6-24,
        width: 30,
        height: 30,
        marginTop:-8,
    },
    closeIcon: {
        width: 30,
        height: 30
    },
});
