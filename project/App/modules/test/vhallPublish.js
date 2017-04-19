'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} = ReactNative;

const VhallPublish = require('../../native/index.js').VhallPublish;
const SplashScreen = require('@remobile/react-native-splashscreen');
const { Button } = COMPONENTS;

module.exports = React.createClass({
    componentWillMount () {
        SplashScreen.hide();
    },
    getInitialState () {
        return {
            show: false,
            isStart: true,
        };
    },
    switchSize () {
        this.setState({ show:!this.state.show });
    },
    onPublishStatus (obj) {
        console.log('=========', obj);
    },
    startPublish () {
        this.setState({ isStart: !this.state.isStart });
    },
    render () {
        return (
            <View style={styles.container}>
                <Button style={styles.button} onPress={this.switchSize} >切换大小</Button>
                <Button style={styles.button} onPress={this.startPublish}>开始</Button>
                <VhallPublish
                    style={this.state.show ? styles.publishView : styles.publishView1}
                    videoId='271918661'
                    appKey='1349953300'
                    appSecretKey='b4f69bd6dd0c37db138b2a613786f24f'
                    accessToken='ad9dc933f741f5b0da1e0860207a8797'
                    onPublishStatus={this.onPublishStatus}
                    isStart={this.state.isStart}
                    />
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 80,
    },
    button: {
        height: 80,
        marginBottom:20,
    },
    publishView: {
        width: 100,
        height: 100,
        backgroundColor: 'red',
    },
    publishView1: {
        width: 200,
        height: 300,
        backgroundColor: 'blue',
    },
});
