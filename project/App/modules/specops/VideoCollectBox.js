'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    Text,
    Animated,
    View,
    TouchableOpacity,
} = ReactNative;

module.exports = React.createClass({
    getInitialState () {
        return {
            opacity: new Animated.Value(0),
        };
    },
    doCancel () {
        this.closeModal(() => {
            this.props.doCancel();
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
            <Animated.View style={styles.overlayContainer}>
                <View style={styles.shadowStyle}>
                    <View style={styles.container}>
                        <Text style={styles.content}>
                            {'收藏成功'}
                        </Text>
                        <View style={styles.lineStyleTop} />
                        <View style={styles.buttonViewStyle}>
                            <TouchableOpacity
                                onPress={this.doCancel}
                                style={styles.buttonStyleContain}>
                                <Text style={styles.buttonStyle}>确认</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Animated.View>
        );
    },
});

const styles = StyleSheet.create({
    buttonViewStyle: {
        position:'absolute',
        bottom: 0,
        flexDirection: 'row',
        width: 232,
        height: 44,
        justifyContent:'space-between',
    },
    buttonStyleContain: {
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: 'white',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    buttonStyle: {
        fontSize: 17,
        color: '#0076FF',
    },
    lineStyleTop: {
        position: 'absolute',
        bottom: 44,
        left: 0,
        width: 232,
        height: 1,
        backgroundColor: '#D6D6D6',
    },
    shadowStyle: {
        width: 232,
        height:131,
        marginTop: 64 + 152,
        borderRadius: 12,
        alignItems:'center',
        backgroundColor:'#D6D6D6',
    },
    container: {
        width: 232,
        height:129,
        borderRadius: 12,
        alignItems:'center',
        backgroundColor:'#FFFFFF',
    },
    content: {
        color:'#030303',
        margin: 30,
        fontSize:17,
        fontFamily: 'STHeitiSC-Medium',
    },
    overlayContainer: {
        position: 'absolute',
        width: sr.w,
        height: sr.h,
        left: 0,
        bottom: 0,
        alignItems:'center',
        backgroundColor: 'transparent',
    },
});
