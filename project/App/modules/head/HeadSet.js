'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    Image,
    Navigator,
    BackAndroid,
    NativeAppEventEmitter,
} = ReactNative;

const Camera = require('@remobile/react-native-camera');
const FileTransfer = require('@remobile/react-native-file-transfer');

const { Button, DImage, ActionSheet } = COMPONENTS;

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        title: '设置头像',
        leftButton: { handler: () => app.scene.goBack() },
    },
    getInitialState () {
        return {
            actionSheetVisible: false,
            userhead: app.personal.info.headImg,
        };
    },
    selectPicture () {
        this.doCloseActionSheet();
        const options = {
            quality: 30,
            targetWidth: 240,
            targetHeight: 240,
            allowEdit: true,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        };
        Camera.getPicture((filePath) => {
            this.uploadUserHead(filePath);
        }, () => {
            Toast('操作失败');
        }, options);
    },
    goBack () {
        if (this.uploadOn) {
            Toast('正在上传头像，请稍后再退出');
            return;
        }
        app.navigator.pop();
    },
    takePicture () {
        this.doCloseActionSheet();
        const options = {
            quality: 30,
            allowEdit: true,
            targetWidth: 240,
            targetHeight: 240,
            cameraDirection: Camera.Direction.FRONT,
            destinationType: Camera.DestinationType.FILE_URI,
        };
        Camera.getPicture((filePath) => {
            this.uploadUserHead(filePath);
        }, () => {
            Toast('操作失败');
        }, options);
    },
    uploadUserHead (filePath) {
        this.setState({ userhead: filePath });
        const options = {};
        options.fileKey = 'file';
        options.fileName = filePath.substr(filePath.lastIndexOf('/') + 1);
        options.mimeType = 'image/jpeg';
        options.params = {
            userID:app.personal.info.userID,
        };
        this.uploadOn = true;
        UPLOAD(filePath, app.route.ROUTE_UPDATE_FILE, options, (progress) => console.log(progress),
            this.uploadSuccessCallback, this.uploadErrorCallback, true);
    },
    uploadSuccessCallback (data) {
        if (data.success) {
            const context = data.context;
            app.personal.setUserHead(context.url);
            app.navigator.pop();
        } else {
            Toast('上传失败');
            this.setState({ userhead: app.personal.info.headImg });
        }
        this.uploadOn = false;
    },
    uploadErrorCallback () {
        this.uploadOn = false;
        this.setState({ userhead: app.personal.info.headImg });
    },
    doCloseActionSheet () {
        this.setState({ actionSheetVisible:false });
    },
    doShowActionSheet () {
        this.setState({ actionSheetVisible:true });
    },

    render () {
        return (
            <View style={styles.container}>
                <View style={styles.headContainer}>
                    <DImage
                        resizeMode='cover'
                        defaultSource={app.img.personal_head}
                        source={{ uri:this.state.userhead }}
                        style={styles.image_head}
                      />
                    <Button onPress={this.doShowActionSheet} style={styles.button_layer} textStyle={styles.button_text}>点击设置头像</Button>
                </View>
                <ActionSheet
                    visible={this.state.actionSheetVisible}
                    cancelText='返   回'
                    onCancel={this.doCloseActionSheet} >
                    <ActionSheet.Button style={styles.btnStyle} onPress={this.selectPicture}>从相册中选择</ActionSheet.Button>
                    <ActionSheet.Button onPress={this.takePicture}>自    拍</ActionSheet.Button>
                </ActionSheet>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 1)',
    },
    headContainer: {
        flex:1,
        alignItems:'center',
        marginTop: 50,
    },
    image_head: {
        margin: 10,
        width: 200,
        height: 200,
        borderWidth: 2,
        borderColor: '#A62045',
        borderRadius: 100,
    },
    button_layer: {
        paddingVertical: 5,
        borderRadius: 4,
        paddingHorizontal: 10,
        marginTop: 10,
        backgroundColor: '#bf954b',
    },
    button_text: {
        fontSize: 16,
        alignSelf: 'center',
    },
    btnStyle: {
        borderRadius: 4,
        backgroundColor: 'green',
    },
});
