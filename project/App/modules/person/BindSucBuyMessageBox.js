'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    Text,
    Image,
    Animated,
    View,
    TouchableHighlight,
    TouchableOpacity,
} = ReactNative;

module.exports = React.createClass({
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
    doConfirm () {
        this.closeModal(() => {
            this.props.doConfirm();
        });
    },
    doCancle () {
        this.closeModal(() => {
            this.props.doCancle();
        });
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
            <Animated.View style={styles.overlayContainer}>
                <View style={styles.container}>
                    <View style={styles.panelContainer}>
                        <View style={styles.paneltex}>
                            <Text style={styles.paneltext}>{'恭喜您绑定成功'}</Text>
                        </View>
                        <View style={styles.lineside} />
                        <View style={styles.confirmside}>
                            <Text style={styles.paneltext1}>{'由于您绑定的是收费邀请码，需要购买年费会员后才可以使用学习场和训练场'}</Text>
                            <TouchableOpacity
                                onPress={this.doConfirm}
                                style={[styles.panelBtn, { backgroundColor:'#A0D26F' }]}>
                                <Text style={styles.btnText} >购买会员
                              </Text>
                                <View style={[styles.makeup, { right:0, backgroundColor:'#A0D26F' }]} />
                            </TouchableOpacity>
                        </View>

                    </View>
                    <TouchableHighlight
                        onPress={this.doCancle}
                        underlayColor='rgba(0, 0, 0, 0)'
                        style={[styles.touchableHighlight, this.props.style]}>
                        <Image
                            resizeMode='contain'
                            source={app.img.draw_back}
                            style={styles.closeIcon} />
                    </TouchableHighlight>
                </View>
            </Animated.View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        alignItems:'center',
        justifyContent:'center',
    },
    panelContainer: {
        alignSelf: 'center',
        alignItems:'center',
        justifyContent:'center',
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 6,
        width:sr.w / 8 * 7,
        backgroundColor:'#EEEEEE',
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
    btnText: {
        fontSize: 12,
        alignSelf: 'center',
        color:'white',
    },
    paneltex: {
        flexDirection:'row',
    },
    paneltext: {
        fontSize: 14,
        alignSelf: 'center',
        color:'black',
        marginVertical:10,
    },
    paneltext1: {
        fontSize: 14,
        alignSelf: 'center',
        marginHorizontal: 20,
        color:'gray',
        marginTop: 30,
    },
    panelBtn: {
        height: 30,
        width:100,
        marginVertical:20,
        borderRadius: 4,
        alignItems:'center',
        justifyContent:'center',
    },
    touchableHighlight: {
        position:'absolute',
        top:0,
        left:sr.w * 8 / 9 - 30,
        width: 30,
        height: 30,
        marginTop:-8,
    },
    closeIcon: {
        width: 30,
        height: 30,
    },
    lineside: {
        height: 1,
        width:sr.w / 5 * 4,
        backgroundColor:'#9adeff',
    },
    confirmside: {
        height: 120,
        alignItems:'center',
        justifyContent:'center',
        width:sr.w / 5 * 4,
        backgroundColor:'#EEEEEE',
    },
});
