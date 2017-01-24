'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet
} = ReactNative;

var TimerMixin = require('react-timer-mixin');
var VhallPlayer = require('../../native/index.js').VhallPlayer;
var SplashScreen = require('@remobile/react-native-splashscreen');
var Button = require('@remobile/react-native-simple-button');

module.exports = React.createClass({
    mixins: [TimerMixin, HideStatusMixin],
    componentWillMount() {
        SplashScreen.hide();
    },
    getInitialState() {
        return {
            status: 1, //1:IDLE 2:PREPARING 3:BUFFERING 4:READY 5:ENDED
            isControlShow: false,
            statusBarHidden: true,
        };
    },
    goBack() {
        // this.setState({statusBarHidden: false}, ()=>{
        //     app.navigator.pop();
        // });
        Toast(123+'');
    },
    toggleControlPanel() {
        this.clearControlPanelTimeout();
        if (!this.state.isControlShow) {
            this.setState({isControlShow: true});
            this.startControlPanelTimeout();
        } else {
            this.setState({isControlShow: false});
        }
    },
    startControlPanelTimeout() {
        this.timeoutID = this.setTimeout(()=>{
            this.timeoutID = null;
            this.setState({isControlShow: false});
        }, 5000);
    },
    clearControlPanelTimeout() {
        if (this.timeoutID != null) {
            this.clearTimeout(this.timeoutID);
            this.timeoutID = null;
        }
    },
    onDocFlash(e) {
        var obj = e.nativeEvent;
        console.log(obj);
    },
    onStateChange(e) {
        var obj = e.nativeEvent;
        this.setState({status: obj.state});
    },
    onPlayError(e) {
        var obj = e.nativeEvent;
        console.log(obj);
    },
    render() {
        return (
            <View style={styles.container}>
                <View style={app.isandroid?styles.playerFullAndroid:styles.playerFullIos}>
                    <VhallPlayer
                        style={[{flex:1}, app.isandroid?{backgroundColor:'transparent'}:{backgroundColor:'black'}]}
                        full={this.state.statusBarHidden}
                        videoId="292309114"
                        appKey="1349953300"
                        appSecretKey="b4f69bd6dd0c37db138b2a613786f24f"
                        name="fang"
                        email="42550564@sina.com"
                        password="123"
                        onDocFlash={this.onDocFlash}
                        onStateChange={this.onStateChange}
                        onPlayError={this.onPlayError}
                        />
                    {
                        this.state.status<4 &&
                        <View style={[styles.touchLayer, {
                                alignItems:'center',
                                justifyContent: 'center',
                            }]}>
                            <ActivityIndicator size="large"/>
                        </View>
                    }
                    <TouchableOpacity
                        style={styles.touchLayer}
                        onPress={this.toggleControlPanel}>
                        {
                            this.state.isControlShow &&
                            <TouchableOpacity
                                style={styles.closeButtonContainer}
                                onPress={this.goBack}>
                                <Image
                                    resizeMode='stretch'
                                    style={styles.closeButton}
                                    source={app.img.live_exit}/>
                            </TouchableOpacity>
                        }
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
});

var NORMAL_WIDTH = sr.w;
var NORMAL_HEIGHT = NORMAL_WIDTH*2/3;
var FULL_WIDTH = sr.h;
var FULL_HEIGHT = sr.w;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    touchLayer: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },
    playerFullAndroid: {
        width: FULL_WIDTH,
        height: FULL_HEIGHT,
    },
    playerFullIos: {
        top: (FULL_WIDTH-FULL_HEIGHT)/2,
        left: (FULL_HEIGHT-FULL_WIDTH-31)/2,
        width: FULL_WIDTH,
        height: FULL_HEIGHT,
        transform:[{rotate:'90deg'}],
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
