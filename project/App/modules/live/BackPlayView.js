'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
    AppState,
    ActivityIndicator,
    NativeModules,
} = ReactNative;

var TimerMixin = require('react-timer-mixin');
import Video from '@remobile/react-native-video';

var UtilsModule = NativeModules.UtilsModule;
var {Slider} = COMPONENTS;
var videoEnable = true;
var hasPause = false;

var ControlPanel = React.createClass({
    getShowTime(sec) {
        sec = Math.floor(sec);
        var min = Math.floor(sec/60);
        sec -= min*60;
        return app.utils.timeFormat(min, sec);
    },
    measureSliderValue(sec) {
        var {playTime, totalTime} = this.props;
        if (totalTime<=0) {
            return 0;
        }
        return playTime/totalTime;
    },
    measureTime(progress) {
        var {totalTime} = this.props;
        return totalTime*progress;
    },
    onSlidingStart() {
        this.props.stopPlayVideo();
        this.props.clearControlPanelTimeout();
        this.progress = this.refs.slider.props.value;
    },
    onSlidingComplete() {
        this.props.startControlPanelTimeout();
        this.props.seekVideo(this.measureTime(this.progress));
    },
    onValueChange(value) {
        this.progress = value;
    },
    shouldComponentUpdate(nextProps, nextState){
        return videoEnable && !hasPause;
    },
    render() {
        return (
            <TouchableOpacity
                style={styles.controlFullPanel}
                activeOpacity={1}>
                <TouchableOpacity onPress={this.props.togglePlayVideo}>
                    <Image
                        resizeMode='stretch'
                        source={this.props.paused?app.img.play_play:app.img.play_stop}
                        style={[styles.video_icon, {marginLeft:10, marginRight:16,}]}>
                    </Image>
                </TouchableOpacity>
                <View style={styles.video_progress_container}>
                    <Slider
                        ref="slider"
                        vertical={true}
                        thumbTouchSize={{width:40, height:80}}
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
            </TouchableOpacity>
        )
    }
});

module.exports = React.createClass({
    mixins: [TimerMixin, HideStatusMixin],
    getInitialState() {
        this.lock(false);
        return {
            isControlShow: true,
            playTime: 0,
            showPlayTime: 0,
            totalTime: 0,
            paused: false,
            seek: 0,
            indicator: true,
        };
    },
    lock(paused) {
        if (app.isandroid) {
            if (paused) {
                UtilsModule.unlockScreen();
            } else {
                UtilsModule.lockScreen();
            }
        }
    },
    _handleAppStateChange(currentAppState) {
        if (currentAppState === 'background') {
            this.oldpaused = this.state.paused;
            this.setState({paused: true});
            this.lock(this.state.paused);
        } else if (currentAppState === 'active') {
            this.setState({paused: true});
            if (!this.oldpaused) {
                this.setState({paused: false});
                this.lock(this.state.paused);;
            }
        }
    },
    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
    },
    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    },
    componentWillMount() {
        app.phoneMgr.phone.speakerOn();
        this.lastPlayTime = 0;
    },
    startControlPanelTimeout() {
        if (this.state.isControlShow) {
            this.timeoutID = this.setTimeout(()=>{
                this.timeoutID = null;
                this.setState({isControlShow: !this.state.isControlShow});
            }, 5000);
        }
    },
    clearControlPanelTimeout() {
        if (this.timeoutID != null) {
            this.clearTimeout(this.timeoutID);
            this.timeoutID = null;
        }
    },
    toggleControlPanel() {
        this.clearControlPanelTimeout();
        this.setState({isControlShow: !this.state.isControlShow});
        this.startControlPanelTimeout();
    },
    togglePlayVideo() {
        this.setState({paused: !this.state.paused});
        videoEnable = true;
        this.lock(this.state.paused);
    },
    stopPlayVideo() {
        videoEnable = false;
        this.setState({paused: true});
        this.lock(this.state.paused);
    },
    seekVideo(time) {
        this.setState({indicator: true});
        this.video.seek(time);
        this.setTimeout(()=>{
            this.onVideoSeek();
        }, 500);
    },
    onVideoSeek() {
        this.setState({paused: false, indicator: false});
        this.lock(this.state.paused);
        videoEnable = true
    },
    setDuration(e) {
        if (app.isandroid && hasPause) {
            this.setState({paused:true, indicator: true});
            this.video.seek(this.lastPlayTimeSave||0);
            this.setTimeout(()=>{
                hasPause = false;
            }, 1000);
        } else {
            this.setState({
                totalTime: e.duration,
                indicator: false,
            });
        }
    },
    onProgress(e) {
        var deltaTime = (e.currentTime-this.lastPlayTime)/this.state.totalTime*200;
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
    onEnd() {
    },
    onPause() {
        hasPause = true;
        this.lastPlayTimeSave = this.lastPlayTime;
    },
    onResume() {
    },
    render() {
        return (
            <View style={styles.container}>
                <Video
                    ref={(video)=>{this.video=video}}
                    source={{uri: this.props.uri}}
                    rate={1.0}
                    volume={1.0}
                    muted={false}
                    seek={this.state.seek}
                    paused={this.state.paused}
                    resizeMode="stretch"
                    repeat={true}
                    onLoadStart={this.loadStart}
                    onLoad={this.setDuration}
                    onProgress={this.onProgress}
                    onSeek={this.onVideoSeek}
                    onEnd={this.onEnd}
                    onError={this.videoError}
                    onPause={this.onPause}
                    onResume={this.onResume}
                    style={styles.videoFullFrame}
                    />
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={this.toggleControlPanel}
                    style={styles.controlFullFrame}
                    >
                    {
                        this.state.isControlShow&&
                        <View style={{flex:1}}>
                            <ControlPanel
                                playTime={this.state.playTime}
                                showPlayTime={this.state.showPlayTime}
                                totalTime={this.state.totalTime}
                                clearControlPanelTimeout={this.clearControlPanelTimeout}
                                startControlPanelTimeout={this.startControlPanelTimeout}
                                seekVideo={this.seekVideo}
                                stopPlayVideo={this.stopPlayVideo}
                                togglePlayVideo={this.togglePlayVideo}
                                paused={this.state.paused}
                                />
                            <TouchableOpacity
                                style={styles.closeButtonContainer}
                                onPress={this.props.goBack}>
                                <Image
                                    resizeMode='stretch'
                                    style={styles.closeButton}
                                    source={app.img.live_exit}/>
                            </TouchableOpacity>
                        </View>
                    }
                </TouchableOpacity>
                {this.state.indicator &&
                    <View style={[styles.controlFullFrame, {
                            alignItems:'center',
                            justifyContent: 'center',
                        }]}>
                        <ActivityIndicator size="large"/>
                    </View>
                }
            </View>
        );
    }
});

var NORMAL_WIDTH = sr.w;
var NORMAL_HEIGHT = NORMAL_WIDTH*2/3;
var FULL_WIDTH = sr.h;
var FULL_HEIGHT = sr.w;

var isPhone4S = (!app.isandroid && sr.th===480)?1:0;
var isPhone5 = (!app.isandroid && sr.th===568)?1:0;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000000',
        flex:1,
    },
    videoNormalFrameLayer: {
        width: NORMAL_WIDTH,
        height: NORMAL_HEIGHT,
        backgroundColor: 'transparent',
    },
    videoFullFrame: {
        top: (FULL_WIDTH-FULL_HEIGHT)/2,
        left: (FULL_HEIGHT-FULL_WIDTH)/2+isPhone4S*15+isPhone5*20,
        width: FULL_WIDTH,
        height: FULL_HEIGHT,
        transform:[{rotate:'90deg'}],
    },
    controlFullFrame: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: FULL_HEIGHT,
        height: FULL_WIDTH,
    },
    controlFullPanel: {
        height: 40,
        width: FULL_WIDTH,
        top: (FULL_WIDTH-40)/2,
        left: ((app.isandroid?50:40)-FULL_WIDTH)/2+isPhone4S*38+isPhone5*40,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flexDirection: 'row',
        alignItems:'center',
        transform:[{rotate: '90deg'}],
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
        backgroundColor: '#FFFFFF'
    },
    video_progress_back: {
        height: 3,
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    video_time_container: {
        width: 65,
        marginLeft: 10,
        marginRight: 20,
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
    closeButtonContainer: {
        width: 40,
        height: 40,
        right: 10,
        top: 20,
        position: 'absolute',
        transform:[{rotate: '90deg'}],
    },
    closeButton: {
        width: 40,
        height: 40,
    },
});
