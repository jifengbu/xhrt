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

const Audio = require('@remobile/react-native-audio');

module.exports = React.createClass({
    getInitialState () {
        return {
            opacity: new Animated.Value(0),
            isPlaying: false,
        };
    },
    componentDidMount () {
        app.phoneMgr.toggleSpeaker(true);
        this.setState({ isSpeakerOn:app.phoneMgr.isSpeakerOn });
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 500,
        }).start();
    },
    componentWillUnmount () {
        app.phoneMgr.toggleSpeaker(false);
    },
    doCancle () {
        if (this.player != null) {
            this.player.stop();
            this.player.release();
            this.player = null;
        }
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
    playVoice (url) {
        if (!url) {
            Toast('音频地址为空');
            return;
        }
        if (this.player && this.state.isPlaying) {
            this.player.stop();
            this.player.release();
            this.player = null;
            this.setState({ isPlaying: false });
        } else {
            this.player = new Audio(url, (error) => {
                if (!error) {
                    this.setState({ isPlaying: true });
                    this.player.play(() => {
                        this.player.release();
                        this.player = null;
                        this.setState({ isPlaying: false });
                    });
                } else {
                    Toast('播放失败');
                }
            });
        }
    },
    toggleSpeaker () {
        app.phoneMgr.toggleSpeaker();
        this.setState({ isSpeakerOn:app.phoneMgr.isSpeakerOn });
        if (this.state.isSpeakerOn) {
            Toast('已经为你切换到扬声器');
        } else {
            Toast('已经为你切换到听筒');
        }
    },
    render () {
        return (
            <Animated.View style={styles.overlayContainer}>
                <View style={styles.container}>
                    <View style={styles.panelContainer}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleText}>
                                {'谢谢你的打赏，'}
                            </Text>
                            <Text style={[styles.titleText, { marginTop: 2 }]}>
                                {'发布者给你录了一段感恩谢话'}
                            </Text>
                        </View>
                        <View style={styles.lineside} />
                        <View style={styles.voiceside}>
                            <Text style={[styles.paneltext, { marginRight: 5 }]}>{this.props.thankLong && this.props.thankLong + "''"}
                            </Text>
                            <TouchableOpacity
                                onLongPress={this.toggleSpeaker}
                                onPress={this.playVoice.bind(null, this.props.thankAudio)}
                                style={styles.panelBtn}>
                                <Image source={this.state.isPlaying ? app.img.actualCombat_voice_playing : app.img.actualCombat_voice_play} style={styles.imagevoice} />
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
    overlayContainer: {
        position:'absolute',
        bottom: 0,
        alignItems:'center',
        justifyContent: 'center',
        width:sr.w,
        height:sr.h,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    panelContainer: {
        alignSelf: 'center',
        alignItems:'center',
        justifyContent:'center',
        paddingTop: 15,
        paddingBottom: 10,
        borderRadius: 6,
        width:sr.w / 8 * 7,
        backgroundColor:'#FFFFFF',
    },
    titleContainer: {
        marginVertical:8,
        flexDirection: 'column',
    },
    titleText: {
        fontSize: 16,
        alignSelf: 'center',
        color:'#666666',
    },
    paneltext: {
        fontSize: 12,
        alignSelf: 'center',
        color:'gray',
    },
    panelBtn: {
        height: 30,
        width:70,
        borderRadius: 4,
        alignItems: 'flex-end',
        justifyContent: 'center',
        backgroundColor: CONSTANTS.THEME_COLOR,
    },
    touchableHighlight: {
        position:'absolute',
        top:0,
        left:sr.w * 8 / 9 - 30,
        width: 38,
        height: 38,
        marginTop:-12,
    },
    closeIcon: {
        width: 38,
        height: 38,
    },
    lineside: {
        height: 1,
        marginTop:10,
        width:sr.w / 5 * 4,
        backgroundColor:'#cccccc',
    },
    voiceside: {
        height: 40,
        width:200,
        marginVertical:30,
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row',
    },
    imagevoice:{
        width: 12,
        height:16,
        marginRight: 10,
    },
});
