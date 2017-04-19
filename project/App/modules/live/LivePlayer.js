'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicator,
  StatusBar,
  AppState,
  NativeModules,
  StyleSheet,
} = ReactNative;

const moment = require('moment');
const TimerMixin = require('react-timer-mixin');
const PackageList = require('../package/PackageList.js');
const VhallPlayer = require('../../native/index.js').VhallPlayer;
const { MessageBox } = COMPONENTS;

module.exports = React.createClass({
    mixins: [TimerMixin, SceneMixin],
    statics: {
        title: '课堂直播',
        leftButton: { handler: () => app.scene.goBack() },
    },
    getInitialState () {
        return {
            status: 3, // 1:IDLE 2:PREPARING 3:BUFFERING 4:READY 5:ENDED
            isControlShow: false,
            statusBarHidden: true,
            showPayMessageBox: false,
            videoEnable: true,
        };
    },
    componentWillMount () {
        app.toggleNavigationBar(false);
    },
    componentDidMount () {
        AppState.addEventListener('change', this._handleAppStateChange);
    },
    componentWillUnmount () {
        AppState.removeEventListener('change', this._handleAppStateChange);
    },
    _handleAppStateChange (currentAppState) {
        if (currentAppState === 'background') {
            this.setState({ videoEnable: false });
        } else if (currentAppState === 'active') {
            this.setState({ videoEnable: true });
        }
    },
    toggleControlPanel () {
        this.clearControlPanelTimeout();
        if (!this.state.isControlShow) {
            this.setState({ isControlShow: true });
            this.startControlPanelTimeout();
        } else {
            this.setState({ isControlShow: false });
        }
    },
    startControlPanelTimeout () {
        this.timeoutID = this.setTimeout(() => {
            this.timeoutID = null;
            this.setState({ isControlShow: false });
        }, 5000);
    },
    clearControlPanelTimeout () {
        if (this.timeoutID != null) {
            this.clearTimeout(this.timeoutID);
            this.timeoutID = null;
        }
    },
    doBuyYearMembership () {
        this.setState({ showPayMessageBox: false, statusBarHidden: false }, () => {
            app.toggleNavigationBar(true);
            app.navigator.replace({
                title: '套餐',
                component: PackageList,
            });
        });
    },
    goBack () {
        this.setState({ statusBarHidden: false }, () => {
            app.navigator.pop();
            app.toggleNavigationBar(true);
        });
    },
    onDocFlash (e) {
        const obj = e.nativeEvent;
    },
    onStateChange (e) {
        const obj = e.nativeEvent;
        this.setState({ status: obj.state });
    },
    onPlayError (e) {
        const obj = e.nativeEvent;
        if (obj.content) {
            Toast(obj.content + '');
        } else {
            Toast('直播已经结束，请关注官方直播时间');
        }
        this.goBack();
    },
    render () {
        return (
            <View style={styles.container}>
                <StatusBar hidden={this.state.statusBarHidden} />
                {
                    this.state.videoEnable &&
                    <View style={styles.playerFull}>
                        <VhallPlayer
                            style={[{ flex:1, backgroundColor:'black' }]}
                            videoId={this.props.broadcastRoomID}
                            appKey={CONSTANTS.VHALL_APP_KEY}
                            appSecretKey={CONSTANTS.VHALL_APP_SECRECT_KEY}
                            name={app.login.list[0]}
                            email='wangyu298632@sina.com'
                            password=''
                            onDocFlash={this.onDocFlash}
                            onStateChange={this.onStateChange}
                            onPlayError={this.onPlayError}
                        />
                        {
                            this.state.status < 4 &&
                            <View style={[styles.touchLayer, {
                                alignItems:'center',
                                justifyContent: 'center',
                            }]}>
                                <ActivityIndicator size='large' />
                            </View>
                        }

                        <TouchableHighlight
                            style={styles.touchLayer}
                            underlayColor='rgba(0, 0, 0, 0)'
                            onPress={this.toggleControlPanel}>
                            <View>
                                {
                                this.state.isControlShow &&
                                <TouchableHighlight
                                    underlayColor='rgba(0, 0, 0, 0.5)'
                                    style={styles.closeButtonContainer}
                                    onPress={this.goBack}>
                                    <Image
                                        resizeMode='stretch'
                                        style={styles.closeButton}
                                        source={app.img.common_back} />
                                </TouchableHighlight>
                            }
                            </View>
                        </TouchableHighlight>

                    </View>
                }
            </View>
        );
    },
});
const NORMAL_WIDTH = sr.w;
const NORMAL_HEIGHT = NORMAL_WIDTH * 2 / 3;
const FULL_WIDTH = sr.fh;
const FULL_HEIGHT = sr.w;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },
    touchLayer: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },
    playerFull: {
        top: (FULL_WIDTH - FULL_HEIGHT) / 2,
        left: (FULL_HEIGHT - FULL_WIDTH) / 2,
        width: FULL_WIDTH,
        height: FULL_HEIGHT,
        transform:[{ rotate:'90deg' }],
    },
    closeButtonContainer: {
        width: 40,
        height: 40,
        marginTop: 10,
        marginLeft: 20,
    },
    closeButton: {
        width: 40,
        height: 40,
    },
});
