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
    doBuyIntegral() {
        this.closeModal(()=>{
            this.props.doBuyIntegral();
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
            this.props.doClose();
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
                    <View style={styles.panelContainer}>
                        <View style={styles.promptTitleView}>
                            <Text style={styles.title}>需要消耗</Text>
                            <Text style={[styles.title, {color: CONSTANTS.THEME_COLOR}]}>{this.props.costCoin}</Text>
                            <Text style={styles.title}>{this.props.costType===0?'积分':'赢销币'}</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.title}>{'您当前的'}</Text>
                            <Text style={styles.title}>{this.props.costType===0?'积分不足':'赢销币不足'}</Text>
                        </View>
                        <View style={styles.divisionContainer}>
                            <View style={[styles.lineView, {marginRight: 20}]}/>
                            <Text style={styles.promptText}>是否选择充值</Text>
                            <View style={[styles.lineView, {marginLeft: 20}]}/>
                        </View>
                        <View style={styles.btnContainer}>
                            <Button
                                onPress={this.doBuyIntegral}
                                textStyle={styles.btnText}
                                style={styles.drawButton}>是</Button>
                            <Button
                                onPress={this.doClose}
                                textStyle={[styles.btnText, {color: CONSTANTS.THEME_COLOR}]}
                                style={[styles.drawButton, {backgroundColor: '#FFFFFF', borderColor: CONSTANTS.THEME_COLOR, borderWidth: 1,}]}>否</Button>
                        </View>
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
        justifyContent:'center'
    },
    panelContainer: {
        width:sr.w*6/7,
        marginBottom: 15,
        borderRadius: 6,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#FFFFFF',
    },
    promptTitleView: {
        marginTop: 20,
        alignItems: 'center',
        flexDirection: 'row',
    },
    title: {
        color: '#666666',
        fontSize: 15,
        fontWeight: '100',
        textAlign: 'center',
        overflow: 'hidden',
        marginBottom: 5,
    },
    divisionContainer: {
        flexDirection: 'row',
        marginTop: 15,
    },
    lineView: {
        flex: 1,
        height: 1,
        marginVertical: 5,
        backgroundColor: '#cccccc'
    },
    promptText: {
        fontSize: 12,
        fontWeight: '400',
        color: '#999999',
    },
    btnContainer: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        marginTop: 25,
        marginBottom: 35,
    },
    drawButton: {
        height:35,
        flex: 1,
        borderRadius: 6,
        paddingHorizontal:50,
        marginHorizontal:20,
    },
    btnText: {
        fontSize: 14,
        fontWeight: '500',
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
        top:-12,
        left:sr.w*6/7-24,
        width: 38,
        height: 38,
    },
    closeIcon: {
        width: 38,
        height: 38,
    },
});
