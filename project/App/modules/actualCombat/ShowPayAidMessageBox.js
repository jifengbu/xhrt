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
                        <Image
                            resizeMode='stretch'
                            source={app.img.actualCombat_money}
                            style={styles.imageStyle}
                            />
                        <View style={styles.paneltex}>
                            <Text style={styles.paneltext}>
                                {'如果需要查看剩余方案,'}
                            </Text>
                            <View style={styles.bottomContainer}>
                                <Text style={styles.paneltext}>
                                    {'请为提供者打赏 '}
                                </Text>
                                <Text style={styles.paneltext1}>
                                    {this.props.winCoinNum}
                                </Text>
                                <Text style={styles.paneltext}>
                                    {' 元'}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.confirmside}>
                            <TouchableOpacity
                                onPress={this.doConfirm}
                                style={styles.panelBtn}>
                                <View style={[styles.makeup, { right:0, backgroundColor: CONSTANTS.THEME_COLOR }]} />
                                <Text style={styles.btnText} >确认打赏
                              </Text>
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
        paddingBottom: 75,
        alignItems:'center',
        justifyContent:'center',
    },
    imageStyle: {
        marginTop: 20,
        width: 71,
        height: 50,
    },
    panelContainer: {
        alignSelf: 'center',
        alignItems:'center',
        justifyContent:'center',
        paddingTop: 20,
        borderRadius: 6,
        width:sr.w / 5 * 4,
        backgroundColor:'#EEEEEE',
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
    btnText: {
        fontSize: 18,
        fontWeight: '500',
        alignSelf: 'center',
        color:'#FFFFFF',
    },
    paneltex: {
        flexDirection:'column',
        marginTop: 20,
        marginBottom: 30,
    },
    paneltext: {
        fontSize: 15,
        alignSelf: 'center',
        color:'#555555',
    },
    bottomContainer: {
        height: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    paneltext1: {
        fontSize: 12,
        color:'red',
    },
    panelBtn: {
        height: 45,
        width:sr.w / 5 * 4,
        borderRadius: 6,
        backgroundColor: CONSTANTS.THEME_COLOR,
        alignItems:'center',
        justifyContent:'center',
    },
    makeup: {
        backgroundColor:'blue',
        top: 0,
        width:sr.w / 5 * 4,
        height: 5,
        position: 'absolute',
    },
    touchableHighlight: {
        position:'absolute',
        top:0,
        left:sr.w * 4 / 5 - 24,
        width: 38,
        height: 38,
        marginTop:-12,
    },
    closeIcon: {
        width: 38,
        height: 38,
    },
    confirmside: {
        height: 45,
        alignItems:'center',
        justifyContent:'center',
        width:sr.w / 5 * 4,
    },
});
