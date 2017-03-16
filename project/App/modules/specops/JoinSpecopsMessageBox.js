'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
    Text,
    Animated,
    View,
    TouchableOpacity,
} = ReactNative;

var {DImage} = COMPONENTS;

module.exports = React.createClass({
    getInitialState() {
        return {
            opacity: new Animated.Value(0),
        };
    },
    doClose() {
          this.closeModal(()=>{
              this.props.doClose();
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
            <Animated.View style={styles.container}>
                <DImage
                    resizeMode='stretch'
                    source={app.img.specops_join_specops_box}
                    style={styles.joinSpecopsContainer}>
                    <TouchableOpacity
                        onPress={this.doClose}
                        style={styles.touchCloseStyle}>
                        <DImage resizeMode='contain' source={app.img.specops_close_specops_box} style={styles.closeIcon} />
                    </TouchableOpacity>
                    <Text style={styles.title}>开通赢销特种兵</Text>
                    <Text style={styles.introduce}>开通特种兵，观看所有课程视频！</Text>
                    <TouchableOpacity
                        onPress={this.doConfirm}
                        style={styles.touchStyle}>
                        <Text style={styles.touchText}>开通特种兵</Text>
                    </TouchableOpacity>
                </DImage>
            </Animated.View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        width: sr.w,
        height:250,
        alignItems:'center',
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
    joinSpecopsContainer: {
        width: sr.w,
        height:250,
        alignItems:'center',
    },
    touchCloseStyle: {
        width: 30,
        height: 30,
        top: 15,
        right: 5,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeIcon: {
        width: 15,
        height: 15,
    },
    title: {
        color: '#DE3031',
        fontSize: 20,
        fontFamily: 'STHeitiSC-Medium',
        marginTop: 60,
        backgroundColor: 'transparent',
    },
    introduce: {
        color: '#3a3a3a',
        fontSize: 18,
        marginTop: 20,
        backgroundColor: 'transparent',
    },
    touchStyle: {
        width: sr.w-40,
        height: 50,
        bottom: 20,
        left: 20,
        position: 'absolute',
        borderRadius: 2,
        backgroundColor: '#fc4145',
        alignItems: 'center',
        justifyContent: 'center',
    },
    touchText: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: '700',
        fontFamily: 'STHeitiSC-Medium',
    },
});
