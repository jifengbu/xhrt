'use strict';

var React = require('react');
var ReactNative = require('react-native');

var {
    StyleSheet,
    View,
    Text,
    Image,
} = ReactNative;

var SplashScreen = require('@remobile/react-native-splashscreen');
var Button = require('@remobile/react-native-simple-button');
var Camera = require('@remobile/react-native-camera');
var Capture = require('@remobile/react-native-capture');

module.exports = React.createClass({
    componentWillMount() {
        SplashScreen.hide();
    },
    getInitialState() {
        return {
            filePath: '',
        };
    },
    takePicture(i) {
        var options = [{
            quality: 30,
            allowEdit: true,
            targetWidth: 240,
            targetHeight: 240,
            cameraDirection: Camera.Direction.FRONT,
            destinationType: Camera.DestinationType.FILE_URI,
        }, {
            quality: 100,
            allowEdit: true,
            cameraDirection: Camera.Direction.FRONT,
            destinationType: Camera.DestinationType.FILE_URI,
        }, {
            quality: 100,
            allowEdit: false,
            cameraDirection: Camera.Direction.FRONT,
            destinationType: Camera.DestinationType.FILE_URI,
        }, {
            quality: 100,
            allowEdit: false,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        }, {
            quality: 30,
            allowEdit: true,
            targetWidth: 240,
            targetHeight: 240,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        }, {
            quality: 100,
            allowEdit: true,
            targetWidth: 240,
            targetHeight: 240,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        }, {
            quality: 100,
            allowEdit: false,
            destinationType: Camera.DestinationType.FILE_URI,
            mediaType:Camera.MediaType.VIDEO,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        }];
        Camera.getPicture((filePath) => {
            console.log(filePath);
            this.setState({filePath:'file://'+filePath});
        }, null, options[i]);
    },
    taskVideo() {
        Capture.captureVideo((mediaFiles)=>{
            let filePath = mediaFiles[0].fullPath;
            this.setState({filePath});
        }, ()=>{
            Toast('录制失败');
        }, {limit:1});
    },
    cleanup () {
        Camera.cleanup();
    },
    render() {
        const {filePath} = this.state;
        return (
            <View style={styles.container}>
                <Button onPress={this.takePicture.bind(null, 0)}>照相可编辑(30)</Button>
                <Button onPress={this.takePicture.bind(null, 1)}>照相可编辑(100)</Button>
                <Button onPress={this.takePicture.bind(null, 2)}>照相(100)</Button>
                <Button onPress={this.takePicture.bind(null, 3)}>选择(100)</Button>
                <Button onPress={this.takePicture.bind(null, 4)}>选择可编辑(30)</Button>
                <Button onPress={this.takePicture.bind(null, 5)}>选择可编辑(100)</Button>
                <Button onPress={this.takePicture.bind(null, 6)}>选择视频</Button>
                <Button onPress={this.taskVideo}>摄像</Button>
                <Button onPress={this.cleanup}>(ios)清除</Button>
                <Text>{filePath}</Text>
                <Image
                    resizeMode='stretch'
                    defaultSource={app.img.common_default}
                    source={{uri: filePath}}
                    style={styles.image} />
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        width: sr.w-40,
        height: 200,
        backgroundColor: 'gray',
    }
});
