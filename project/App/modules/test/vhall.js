'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
} = ReactNative;

const VhallPlayer = require('../../native/index.js').VhallPlayer;
const SplashScreen = require('@remobile/react-native-splashscreen');
const Button = require('@remobile/react-native-simple-button');

module.exports = React.createClass({
    componentWillMount () {
        SplashScreen.hide();
    },
    getInitialState () {
        return {
            screenType: 0, // 0为正常，1为视频全屏，2为文档全屏
            path: '',
            type: 0, // 界面布局1为单视频，2为单文档(语音 + 文档)，3为文档+视频
            status: 1, //1:IDLE 2:PREPARING 3:BUFFERING 4:READY 5:ENDED
        };
    },
    setScreenType (screenType) {
        if (this.state.status === 4) {
            this.setState({ screenType: screenType });
        }
    },
    onDocFlash (e) {
        const obj = e.nativeEvent;
        this.setState({
            path: obj.path,
            type: obj.type,
        });
    },
    onStateChange (e) {
        const obj = e.nativeEvent;
        this.setState({ status: obj.state });
    },
    onPlayError (e) {
        const obj = e.nativeEvent;
        console.log(obj);
    },
    render () {
        const { screenType, type, path } = this.state;
        const playerFull = app.isandroid ? styles.playerFullAndroid : styles.playerFullIos;
        const docSmall = app.isandroid ? styles.docSmallAndroid : styles.docSmallIos;
        return (
            <View style={styles.container}>
                <StatusBar
                    hidden={screenType === 1 || type === 1}
                    />
                {
                    (type === 2 || (type === 3 && screenType === 2)) &&
                    <View style={styles.docFull}>
                        <Image
                            resizeMode='contain'
                            style={styles.docImage}
                            source={{ uri:path }} />
                    </View>
                }
                {
                    (type !== 2) &&
                    <View style={screenType === 0 && type === 3 ? styles.playerNormal : screenType === 1 || type === 1 ? playerFull : styles.playerSmall}>
                        <VhallPlayer
                            style={[{ flex:1 }, app.isandroid ? { backgroundColor:'transparent' } : { backgroundColor:'black' }]}
                            full={screenType === 1 || type === 1}
                            videoId='271918661'
                            appKey='1349953300'
                            appSecretKey='b4f69bd6dd0c37db138b2a613786f24f'
                            name='fang'
                            email='42550564@sina.com'
                            password='123'
                            onDocFlash={this.onDocFlash}
                            onStateChange={this.onStateChange}
                            onPlayError={this.onPlayError}
                            />
                        {
                            (type === 3 && screenType !== 1) &&
                            <TouchableOpacity
                                style={styles.touchLayer}
                                onPress={this.setScreenType.bind(null, screenType === 0 ? 1 : 0)} />
                        }
                        {
                            (this.state.status === 3 && screenType !== 2 && app.isandroid) &&
                            <Text style={styles.statusText}>
                                缓冲中...
                            </Text>
                        }
                        {this.state.status < 4 &&
                            <View style={[styles.touchLayer, {
                                alignItems:'center',
                                justifyContent: 'center',
                            }]}>
                                <ActivityIndicator size='large' />
                            </View>
                        }
                    </View>
                }
                {
                    (type === 3 && screenType !== 2) &&
                    <View style={screenType === 0 ? styles.docNormal : docSmall}>
                        <Image
                            resizeMode='contain'
                            style={styles.docImage}
                            source={{ uri:path }} />
                        <TouchableOpacity
                            style={styles.touchLayer}
                            onPress={this.setScreenType.bind(null, screenType === 0 ? 2 : 0)}
                             />
                    </View>
                }
            </View>
        );
    },
});

const NORMAL_WIDTH = sr.w;
const NORMAL_HEIGHT = NORMAL_WIDTH * 2 / 3;
const FULL_WIDTH = sr.h;
const FULL_HEIGHT = sr.w;

const isPhone4S = (!app.isandroid && sr.th === 480) ? 1 : 0;
const isPhone5 = (!app.isandroid && sr.th === 568) ? 1 : 0;

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
    playerNormal: {
        width: NORMAL_WIDTH,
        height: NORMAL_HEIGHT,
    },
    playerFullAndroid: {
        width: FULL_WIDTH,
        height: FULL_HEIGHT,
    },
    playerFullIos: {
        top: (FULL_WIDTH - FULL_HEIGHT) / 2,
        left: (FULL_HEIGHT - FULL_WIDTH) / 2 + isPhone4S * 15 + isPhone5 * 20,
        width: FULL_WIDTH,
        height: FULL_HEIGHT,
        transform:[{ rotate:'90deg' }],
    },
    playerSmall: {
        width: 150,
        height: 100,
        position: 'absolute',
        left: 0,
        bottom: 0,
        borderWidth: 4,
        borderColor: 'gray',
        opacity: 0.7,
    },
    docNormal: {
        flex:1,
        borderWidth: 10,
        borderColor: 'gray',
    },
    docFull: {
        flex:1,
    },
    docSmallAndroid: {
        width: 100,
        height: 100,
        position: 'absolute',
        left: 0,
        bottom: 0,
        borderWidth: 4,
        borderColor: 'gray',
        opacity: 0.7,
    },
    docSmallIos: {
        width: 100,
        height: 100,
        position: 'absolute',
        left: 0,
        top: 0,
        borderWidth: 4,
        borderColor: 'gray',
        opacity: 0.7,
        transform:[{ rotate:'90deg' }],
    },
    docImage: {
        flex:1,
    },
    statusText: {
        position: 'absolute',
        fontSize: 12,
        color: '#FFFFFF',
        right: 10,
        top: 5,
    },
});
