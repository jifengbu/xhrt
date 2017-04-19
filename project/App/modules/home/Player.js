'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
    StatusBar,
    AppState,
    ActivityIndicator,
    NativeModules,
    BackAndroid,
} = ReactNative;

const TimerMixin = require('react-timer-mixin');
import Video from '@remobile/react-native-video';

const UtilsModule = NativeModules.UtilsModule;
const { Slider } = COMPONENTS;
let videoEnable = true;
let hasPause = false;

const ControlPanel = React.createClass({
    getShowTime (sec) {
        sec = Math.floor(sec);
        const min = Math.floor(sec / 60);
        sec -= min * 60;
        return app.utils.timeFormat(min, sec);
    },
    measureSliderValue (sec) {
        const { playTime, totalTime } = this.props;
        if (totalTime <= 0) {
            return 0;
        }
        return playTime / totalTime;
    },
    measureTime (progress) {
        const { totalTime } = this.props;
        return totalTime * progress;
    },
    onSlidingStart () {
        this.props.stopPlayVideo();
        this.props.clearControlPanelTimeout();
        this.progress = this.refs.slider.props.value;
    },
    onSlidingComplete () {
        this.props.startControlPanelTimeout();
        this.props.seekVideo(this.measureTime(this.progress));
    },
    onValueChange (value) {
        this.progress = value;
    },
    shouldComponentUpdate (nextProps, nextState) {
        return videoEnable && !hasPause;
    },
    render () {
        return (
            <TouchableOpacity
                style={this.props.isFullScreen ? styles.controlFullPanel : [styles.controlNormalPanel, { top:this.props.height - 40 }]}
                activeOpacity={1}>
                <TouchableOpacity onPress={this.props.togglePlayVideo}>
                    <Image
                        resizeMode='stretch'
                        source={this.props.paused ? app.img.play_play : app.img.play_stop}
                        style={[styles.video_icon, { marginLeft:10, marginRight:16 }]} />
                </TouchableOpacity>
                <View style={styles.video_progress_container}>
                    <Slider
                        ref='slider'
                        vertical={this.props.isFullScreen}
                        thumbTouchSize={{ width:40, height:80 }}
                        style={styles.video_progress}
                        minimumTrackTintColor='#54C1E8'
                        thumbStyle={styles.video_progress_button}
                        trackStyle={styles.video_progress_back}
                        onSlidingStart={this.onSlidingStart}
                        onSlidingComplete={this.onSlidingComplete}
                        value={this.measureSliderValue(this.props.playTime)}
                        onValueChange={this.onValueChange} />
                </View>
                <View style={styles.video_time_container}>
                    <Text style={styles.video_play_time}>
                        {this.getShowTime(this.props.showPlayTime)}
                    </Text>
                    <Text style={styles.video_total_time}>
                        /{this.getShowTime(this.props.totalTime)}
                    </Text>
                </View>
                <TouchableOpacity onPress={this.props.toggleFullScreen}>
                    <Image
                        resizeMode='stretch'
                        source={app.img.play_enlarge}
                        style={[styles.video_icon, { marginLeft: 20, marginRight: 10 }]} />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    },
});

module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState () {
        this.lock(false);
        return {
            isFullScreen:false,
            isControlShow: false,
            playTime: 0,
            showPlayTime: 0,
            totalTime: 0,
            paused: false,
            seek: 0,
            indicator: true,
            isEnd: false,
        };
    },
    lock (paused) {
        if (app.isandroid) {
            if (paused) {
                UtilsModule.unlockScreen();
            } else {
                UtilsModule.lockScreen();
            }
        }
    },
    _handleAppStateChange (currentAppState) {
        if (currentAppState !== 'active') {
            console.log('_handleAppStateChange');
            this.toggleFullScreenFalse();
        }

        if (currentAppState === 'background') {
            this.oldpaused = this.state.paused;
            this.setState({ paused: true });
            this.lock(this.state.paused);
        } else if (currentAppState === 'active') {
            this.setState({ paused: true });
            if (!this.oldpaused) {
                this.setState({ paused: false });
                this.lock(this.state.paused); ;
            }
        }
    },
    onHardwareBackPress () {
        BackAndroid.removeEventListener('hardwareBackPress', this.onHardwareBackPress);
        this.toggleFullScreen();
        return true;
    },
    componentDidMount () {
        this.hasLastTime = false;
        AppState.addEventListener('change', this._handleAppStateChange);
    },
    componentWillUnmount () {
        AppState.removeEventListener('change', this._handleAppStateChange);
        this.lock(true);
    },
    componentWillMount () {
        app.phoneMgr.phone.speakerOn();
        this.lastPlayTime = 0;
    },
    startControlPanelTimeout () {
        if (!this.state.isControlShow) {
            this.timeoutID = this.setTimeout(() => {
                this.timeoutID = null;
                this.setState({ isControlShow: !this.state.isControlShow });
            }, 5000);
        }
    },
    clearControlPanelTimeout () {
        if (this.timeoutID != null) {
            this.clearTimeout(this.timeoutID);
            this.timeoutID = null;
        }
    },
    toggleControlPanel () {
        this.clearControlPanelTimeout();
        this.setState({ isControlShow: !this.state.isControlShow });
        this.startControlPanelTimeout();
    },
    toggleFullScreen () {
        const isFullScreen = !this.state.isFullScreen;
        if (app.isandroid && isFullScreen) {
            BackAndroid.addEventListener('hardwareBackPress', this.onHardwareBackPress);
        }
        this.props.fullScreenListener(isFullScreen);
        this.setState({
            isFullScreen: isFullScreen,
            isControlShow:false,
        });
    },
    toggleFullScreenFalse () {
        console.log('toggleFullScreenFalse');
        this.props.fullScreenListener(false);
        this.setState({
            isFullScreen: false,
            isControlShow:false,
        });
        this.stopPlayVideo();
    },
    togglePlayVideo () {
        if (this.videoRewardTime === -1) {
            this.videoRewardTime = Date.now() + this.state.totalTime * CONSTANTS.VIDEO_REWARD_RATION * 1000;
            this.seekVideo(0);
        } else {
            this.setState({ paused: !this.state.paused }, () => {
                this.lock(this.state.paused);
            });
            videoEnable = true;
        }
        this.setState({ isEnd: false });
    },
    stopPlayVideo () {
        videoEnable = false;
        this.setState({ paused: true, isEnd: false });
        this.lock(this.state.paused);
    },
    seekVideo (time) {
        this.setState({ indicator: true, isEnd: false });
        this.video.seek(time);
        this.setTimeout(() => {
            this.onVideoSeek();
        }, 500);
    },
    setLastPlayTime (time) {
        this.hasLastTime = true;
        this.lastPlayTimeSave = time;
    },
    setRestartVideo (time) {
        this.setState({ indicator: true, paused: true });
        this.video.seek(time);
        this.setTimeout(() => {
            if (this.videoRewardTime === -1) {
                this.videoRewardTime = Date.now() + this.state.totalTime * CONSTANTS.VIDEO_REWARD_RATION * 1000;
            }
            this.setState({ indicator: false });
            this.lock(this.state.paused);
            videoEnable = true;
        }, app.isandroid ? 2000 : 1000);
    },
    onVideoSeek () {
        if (this.videoRewardTime === -1) {
            this.videoRewardTime = Date.now() + this.state.totalTime * CONSTANTS.VIDEO_REWARD_RATION * 1000;
        }
        this.setState({ paused: false, indicator: false });
        this.lock(this.state.paused);
        videoEnable = true;
    },
    setDuration (e) {
        const { onLoaded } = this.props;
        onLoaded && onLoaded(e.duration);
        if (app.isandroid && hasPause) {
            this.setState({ paused:true, indicator: true });
            this.video.seek(this.lastPlayTimeSave || 0);
            this.setTimeout(() => {
                hasPause = false;
            }, 1000);
        } else {
            this.videoRewardTime = Date.now() + e.duration * CONSTANTS.VIDEO_REWARD_RATION * 1000;
            this.setState({
                totalTime: e.duration,
                indicator: false,
            });
            if (this.hasLastTime) {
                if (this.lastPlayTimeSave >= e.duration || e.duration - this.lastPlayTimeSave < 10) {
                    this.lastPlayTimeSave = 1;
                }
                this.video.seek(this.lastPlayTimeSave || 0);
                this.hasLastTime = false;
            }
        }
    },
    onProgress (e) {
        const deltaTime = (e.currentTime - this.lastPlayTime) / this.state.totalTime * 200;
        if (deltaTime >= 1 || deltaTime < 0) {
            this.setState({
                playTime: e.currentTime,
            });
            this.lastPlayTime = e.currentTime;
        }
        this.setState({
            showPlayTime: e.currentTime,
        });
    },
    getPlayTime () {
        return this.state.showPlayTime;
    },
    onEnd () {
        this.props.onEnd && this.props.onEnd();
        if (CONSTANTS.ISSUE_IOS) {
            return;
        }
        if (this.videoRewardTime != -1 && this.videoRewardTime < Date.now()) {
            this.videoRewardTime = -1;
            if (this.state.isFullScreen) {
                this.toggleFullScreen();
            }
            this.setState({ paused:true });
            this.lock(this.state.paused);
            videoEnable = false;
            this.props.onComplete && this.props.onComplete();
        }
        this.setState({ isEnd: true });
    },
    onPause () {
        hasPause = true;
        this.lastPlayTimeSave = this.lastPlayTime;
    },
    onResume () {
    },
    render () {
        const { width, height } = this.props;
        return (
            <View style={[styles.container, this.state.isFullScreen ? styles.fullScreen : { width: width, height:height }]}>
                <StatusBar
                    hidden={this.state.isFullScreen}
                    />
                {!this.state.isFullScreen && <View style={[styles.videoNormalFrameLayer, { width:width, height: height }]} />}
                <Video
                    ref={(video) => { this.video = video; }}
                    source={{ uri: this.props.uri }}
                    rate={1.0}
                    volume={1.0}
                    muted={false}
                    seek={this.state.seek}
                    paused={this.state.paused}
                    resizeMode='stretch'
                    repeat={CONSTANTS.ISSUE_IOS}
                    onLoadStart={this.loadStart}
                    onLoad={this.setDuration}
                    onProgress={this.onProgress}
                    onSeek={this.onVideoSeek}
                    onEnd={this.onEnd}
                    onError={this.videoError}
                    onPause={this.onPause}
                    onResume={this.onResume}
                    style={!this.state.isFullScreen ? [styles.videoNormalFrame, { width:width, height:height }] : styles.videoFullFrame}
                    />
                {
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={this.toggleControlPanel}
                        style={!this.state.isFullScreen ? [styles.controlNormalFrame, { width: width, height: height }] : styles.controlFullFrame}
                        >
                        {
                            this.state.isControlShow &&
                            <ControlPanel
                                playTime={this.state.playTime}
                                showPlayTime={this.state.showPlayTime}
                                totalTime={this.state.totalTime}
                                clearControlPanelTimeout={this.clearControlPanelTimeout}
                                startControlPanelTimeout={this.startControlPanelTimeout}
                                seekVideo={this.seekVideo}
                                stopPlayVideo={this.stopPlayVideo}
                                togglePlayVideo={this.togglePlayVideo}
                                getPlayTime={this.getPlayTime}
                                toggleFullScreen={this.toggleFullScreen}
                                isFullScreen={this.state.isFullScreen}
                                paused={this.state.paused}
                                height={height}
                                />
                        }
                    </TouchableOpacity>
                }
                {this.state.indicator &&
                    <View style={[!this.state.isFullScreen ? [styles.controlNormalFrame, { width: width, height: height }] : styles.controlFullFrame, {
                        alignItems:'center',
                        justifyContent: 'center',
                    }]}>
                        <ActivityIndicator size='large' />
                    </View>
                }
                {
                    this.state.paused &&
                    <TouchableOpacity style={!this.state.isFullScreen ? [styles.togglePlayTouch, { top: height / 2 - sr.ws(25), left: width / 2 - sr.ws(25) }] : styles.togglePlaylFullFrame} onPress={this.togglePlayVideo}>
                        <Image resizeMode='stretch' source={app.img.specops_play} style={styles.togglePlayImage} />
                    </TouchableOpacity>
                }
            </View>
        );
    },
});

const FULL_WIDTH = sr.fh;
const FULL_HEIGHT = sr.w;

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        backgroundColor: '#000000',
    },
    videoNormalFrameLayer: {
        backgroundColor: 'transparent',
    },
    fullScreen: {
        width:sr.w,
        height:sr.fh,
    },
    videoNormalFrame: {
        position: 'absolute',
        top:0,
        left: 0,
        transform:[{ rotate:'0deg' }],
    },
    videoFullFrame: {
        top: (FULL_WIDTH - FULL_HEIGHT) / 2,
        left: (FULL_HEIGHT - FULL_WIDTH) / 2,
        width: FULL_WIDTH,
        height: FULL_HEIGHT,
        transform:[{ rotate:'90deg' }],
    },
    controlNormalFrame: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    controlFullFrame: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: FULL_HEIGHT,
        height: FULL_WIDTH,
    },
    togglePlayTouch: {
        width: 51,
        height: 51,
        position: 'absolute',
    },
    togglePlaylFullFrame: {
        width: 51,
        height: 51,
        top: FULL_WIDTH / 2 - 33,
        left: FULL_HEIGHT / 2 - 33,
        position: 'absolute',
        transform:[{ rotate: '90deg' }],
    },
    togglePlayImage: {
        width: 51,
        height: 51,
    },
    controlNormalPanel: {
        height: 40,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flexDirection: 'row',
        alignItems:'center',
    },
    controlFullPanel: {
        height: 40,
        width: FULL_WIDTH,
        top: (FULL_WIDTH - 40) / 2,
        left: (40 - FULL_WIDTH) / 2,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flexDirection: 'row',
        alignItems:'center',
        transform:[{ rotate: '90deg' }],
    },
    video_icon: {
        height: 20,
        width: 20,
    },
    video_progress_container: {
        flex: 1,
        height: 30,
        marginRight: 5,
        justifyContent: 'center',
    },
    video_progress: {
        height: 3,
    },
    video_progress_button: {
        height: 20,
        width: 20,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
    },
    video_progress_back: {
        height: 3,
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    video_time_container: {
        width: 65,
        flexDirection: 'row',
        alignItems: 'center',
    },
    video_play_time: {
        color: '#FFFFFF',
        fontSize: 13,
    },
    video_total_time: {
        color: '#FFFFFF',
        fontSize: 13,
    },
});
