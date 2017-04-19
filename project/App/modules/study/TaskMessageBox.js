'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    StyleSheet,
    Text,
    Image,
    Animated,
    View,
    TouchableHighlight,
} = ReactNative;
const { Button } = COMPONENTS;

module.exports = React.createClass({
    getInitialState () {
        return {
            taskList: this.props.taskList,
            opacity: new Animated.Value(0),
        };
    },
    componentDidMount () {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 500,
        }).start();
    },
    doCloseTask () {
        this.closeModal(() => {
            this.props.doCloseTask();
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
                    <View style={[styles.panelContainer, this.props.style]}>
                        {
                            this.state.taskList.map((item, i) => {
                                return (
                                    item.isFinish === 0 ?
                                        <View
                                            key={i}
                                            style={[styles.isFinishPanelBtn, { marginBottom:18 }]}>
                                            <Text style={[styles.btnText, { color:'#FFFFFF' }]}>
                                                {item.taskName}
                                            </Text>
                                            <Image
                                                resizeMode='contain'
                                                source={app.img.study_progres_ok}
                                                style={styles.finish_icon} />
                                        </View>
                                    :
                                        <Button
                                            key={i}
                                            disable
                                            style={[styles.panelBtn, { marginBottom:18 }]}
                                            textStyle={[styles.btnText, { color:'grey' }]}>
                                            {item.taskName}
                                        </Button>
                                );
                            })
                        }
                    </View>
                    <TouchableHighlight
                        onPress={this.doCloseTask}
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
        paddingBottom: 80,
        alignItems:'center',
        justifyContent:'center',
    },
    panelContainer: {
        alignSelf: 'center',
        paddingTop: 35,
        paddingBottom: 10,
        borderRadius: 10,
        width:sr.w / 5 * 4,
        backgroundColor:'#FFFFFF',
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
    isFinishPanelBtn: {
        height: 30,
        borderRadius: 4,
        justifyContent:'center',
        marginHorizontal: 38,
        flexDirection: 'row',
        backgroundColor: CONSTANTS.THEME_COLOR,
    },
    btnText: {
        fontSize: 14,
        fontWeight: '400',
        alignSelf: 'center',
    },
    finish_icon: {
        width: 20,
        height: 20,
        position:'absolute',
        top: 5,
        right: 5,
    },
    panelBtn: {
        height: 30,
        marginHorizontal: 38,
        borderRadius: 4,
        alignItems:'center',
        backgroundColor: '#EEEEEE',
        justifyContent:'center',
    },
    touchableHighlight: {
        position:'absolute',
        top:-5,
        left:sr.w * 5 / 6 - 36,
        width: 38,
        height: 38,
        marginTop:-12,
    },
    closeIcon: {
        width: 38,
        height: 38,
    },
});
