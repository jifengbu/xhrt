'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    Text,
    Image,
    TextInput,
    TouchableHighlight,
    ScrollView,
    TouchableOpacity,
} = ReactNative;

const FileTransfer = require('@remobile/react-native-file-transfer');
const ImagePicker = require('@remobile/react-native-image-picker');
const dismissKeyboard = require('dismissKeyboard');
const AidBigImage = require('../actualCombat/AidBigImage.js');
const HomeworkBox = require('./ShowHomeworkBox.js');
const ImageLongPressMessageBox = require('../actualCombat/ImageLongPressMessageBox.js');
const UmengMgr = require('../../manager/UmengMgr.js');
const { Button, DelayTouchableOpacity } = COMPONENTS;

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        rightButton: { title: '提交', handler: () => { app.scene.toggleEdit(); } },
    },
    getInitialState () {
        return {
            localUrlImages:[],
            netUrlImages:[],
        };
    },
    toggleEdit () {
        // 提交数据
        dismissKeyboard();
        // QuestionType 0提问 1回答 2写作业
        if (!this.state.descStr) {
            Toast('请填写内容');
            return;
        }
        if (this.props.QuestionType == 2) {
            if (this.state.descStr.length < 120) {
                Toast('字数不够');
                return;
            }
            const param = {
                userID: app.personal.info.userID,
                title: this.state.titleStr,
                taskID: this.props.taskID,
                content: this.state.descStr,
                imageArray: this.state.netUrlImages ? this.state.netUrlImages : [],
            };
            POST(app.route.ROUTE_SUBMIT_SPECIAL_SOLDIER_TASK, param, this.submitSpecialSoldierTaskSuccess, true);
        } else if (this.props.QuestionType == 1) {
            const param = {
                userID: app.personal.info.userID,
                questionID: this.props.questionID,
                questionContent: this.state.descStr,
                questionImages: this.state.netUrlImages ? this.state.netUrlImages : [],
            };
            POST(app.route.ROUTE_ANSWER, param, this.doAnswerSuccess, true);
        } else if (this.props.QuestionType == 0) {
            const param = {
                userID: app.personal.info.userID,
                title: this.state.titleStr,
                content: this.state.descStr,
                imageArray: this.state.netUrlImages ? this.state.netUrlImages : [],
            };
            POST(app.route.ROUTE_QUESTION, param, this.doQuestionSuccess, true);
        }
    },
    submitSpecialSoldierTaskSuccess (data) {
        if (data.success) {
            const detailsMap = {};
            detailsMap['userName'] = app.personal.info.name;
            detailsMap['headImg'] = app.personal.info.headImg;
            detailsMap['homeworkID'] = data.context.specopsUserTask.id;
            detailsMap['desc'] = this.state.descStr;
            app.showModal(
                <HomeworkBox
                    completeData={detailsMap}
                    doShare={this.doShare} />
            );
        } else {
            Toast(data.msg);
        }
    },
    doAnswerSuccess (data) {
        if (data.success) {
            Toast('提交成功');
            this.props.doRefresh();
            app.navigator.pop();
        } else {
            Toast(data.msg);
        }
    },
    doQuestionSuccess (data) {
        if (data.success) {
            Toast('提交成功');
            app.navigator.pop();
        } else {
            Toast(data.msg);
        }
    },
    showPohotoImg () {
        const options = { maximumImagesCount: 3, width: 400 };
        const filePaths = [];
        ImagePicker.getPictures(options, (results) => {
            if (results.length > 0) {
                for (let i = 0; i < results.length; i++) {
                    const filePath = results[i];
                    const item = {
                        name: 'file',
                        filename: filePath.substr(filePath.lastIndexOf('/') + 1),
                        filepath: filePath,
                        filetype: 'image/png',
                    };
                    filePaths.push(item);
                }
                this.uploadFiles(filePaths);
            }
        }, (error) => {
        });
    },
    uploadFiles (filePaths) {
        let { localUrlImages } = this.state;
        this.tempLocalUrlImages = [];
        filePaths.map((item, i) => {
            localUrlImages = localUrlImages.concat(item.filepath);
            this.tempLocalUrlImages.push(item.filepath);
        });
        this.setState({ localUrlImages: localUrlImages });
        const param = {
            userID:app.personal.info.userID,
        };
        this.uploadOn = true;
        MULTIUPLOAD(filePaths, app.route.ROUTE_UPDATE_MULTI_FILES, param, (progress) => console.log(progress),
        this.uploadSuccessCallback, this.uploadErrorCallback, true);
    },
    uploadSuccessCallback (data) {
        if (data.success) {
            let { netUrlImages } = this.state;
            netUrlImages = netUrlImages.concat(data.context.url);
            this.setState({ netUrlImages });
        } else {
            // 删除该数组
            let { localUrlImages } = this.state;
            localUrlImages = _.difference(localUrlImages, this.tempLocalUrlImages);
            this.setState({ localUrlImages: localUrlImages });
            Toast('上传失败');
        }
        this.uploadOn = false;
    },
    uploadErrorCallback () {
        this.uploadOn = false;
    },
    showBigImage (localUrlImages, index) {
        app.showModal(
            <AidBigImage
                doImageClose={app.closeModal}
                defaultIndex={index}
                defaultImageArray={localUrlImages} />
        );
    },
    showImageLongPressMessageBox (netPah, index) {
        this.clickImageNetPath = netPah;
        this.tempImageIndex = index;
        app.showModal(
            <ImageLongPressMessageBox
                doDelete={this.doDeleteImage}
                doBack={this.doImageBack} />
        );
    },
    doDeleteImage () {
        app.closeModal();
        const { netUrlImages, localUrlImages } = this.state;
        _.remove(netUrlImages, (item) => netUrlImages[this.tempImageIndex] == item);
        _.remove(localUrlImages, (item) => this.clickImageNetPath == item);
        this.setState({ netUrlImages, localUrlImages });
    },
    doImageBack () {
        app.closeModal();
    },
    doShare (complete) {
        const data = 'userName=' + complete.userName + '&headImg=' + complete.headImg + '&homeworkID=' + complete.homeworkID;
        const desc = '特种兵：' + complete.userName + ' /' + complete.desc;
        const dataEncode = encodeURI(data);
        UmengMgr.doActionSheetShare(CONSTANTS.SHARE_SHAREDIR_SERVER + 'shareWeekTask.html?' + dataEncode, '特种兵我的周任务', desc, 'web', CONSTANTS.SHARE_IMGDIR_SERVER + 'homework.png', this.doShareCallback);
    },
    doShareCallback () {
        // 分享回调
    },
    render () {
        return (
            <ScrollView style={styles.container}>
                {// QuestionType 0提问 1回答 2写作业
                    this.props.QuestionType != 0 &&
                    <View style={styles.topContainer}>
                        {
                            this.props.QuestionType === 2 &&
                            <Text style={styles.textTitle}>本周任务</Text>
                        }
                        <Text style={styles.textTheme}>{'题目：' + this.props.taskName}</Text>
                    </View>
                }
                {
                    this.props.QuestionType != 0 &&
                    <View style={styles.lineStyle} />
                }
                {
                    this.props.QuestionType != 1 &&
                    <View style={styles.titleStyle}>
                        <Text style={styles.titleText}>{'标题：'}</Text>
                        <TextInput
                            style={styles.themeStyle}
                            maxLength={20}
                            underlineColorAndroid={'transparent'}
                            textStyle={styles.contentText}
                            onChangeText={(text) => this.setState({ titleStr: text })}
                            defaultValue={this.state.titleStr}
                            placeholder={'4-20个字 (选填)'}
                            />
                    </View>
                }
                <View style={styles.lineView} />
                <View style={styles.descStyle}>
                    <TextInput
                        style={styles.descText}
                        multiline
                        underlineColorAndroid={'transparent'}
                        textStyle={styles.contentText}
                        onChangeText={(text) => this.setState({ descStr: text })}
                        defaultValue={this.state.descStr}
                        placeholder={this.props.QuestionType == 0 ? '写下你的疑问...' : this.props.QuestionType == 1 ? '写下的答案...' : '写下的答案...(至少120字)'}
                        />
                </View>
                <View style={styles.imageStyleView}>
                    <DelayTouchableOpacity
                        activeOpacity={0.6}
                        onPress={this.showPohotoImg}>
                        <Image source={app.img.specops_insert} style={styles.imageButtonView} />
                    </DelayTouchableOpacity>
                    <ScrollView horizontal style={styles.imageContainer}>
                        {
                            this.state.localUrlImages && this.state.localUrlImages.map((item, i) => {
                                return (
                                    <TouchableHighlight
                                        key={i}
                                        underlayColor='rgba(0, 0, 0, 0)'
                                        onPress={this.showBigImage.bind(null, this.state.localUrlImages, i)}
                                        onLongPress={this.showImageLongPressMessageBox.bind(null, item, i)}
                                        style={styles.bigImageTouch}>
                                        <Image
                                            key={i}
                                            resizeMode='stretch'
                                            source={{ uri: item }}
                                            style={styles.imageStyletu}
                                            />
                                    </TouchableHighlight>
                                );
                            })
                        }
                    </ScrollView>
                </View>
            </ScrollView>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#FFFFFF',
    },
    topContainer: {
        width: sr.w,
    },
    titleStyle: {
        marginTop: 5,
        height: 45,
        width: sr.w,
        alignItems: 'center',
        flexDirection: 'row',
    },
    titleText: {
        fontSize: 14,
        marginLeft: 10,
        color: '#555555',
        fontWeight: '400',
    },
    themeStyle:{
        height:45,
        flex: 1,
        fontSize:14,
        alignSelf: 'center',
        marginHorizontal: 10,
    },
    contentText: {
        fontSize: 14,
        fontWeight: '400',
    },
    lineView: {
        width: sr.w,
        height: 1,
        backgroundColor: '#EEEEEE',
    },
    lineStyle: {
        width: sr.w,
        height: 5,
        backgroundColor: '#EEEEEE',
    },
    descStyle: {
        width: sr.w,
    },
    descText: {
        height:150,
        width: sr.w - 20,
        fontSize:14,
        marginTop: 10,
        paddingVertical: 2,
        marginLeft: 10,
        textAlignVertical: 'top',
    },
    imageStyleView: {
        height: 90,
        alignItems: 'center',
        flexDirection:'row',
        backgroundColor: '#EEEEEE',
    },
    imageButtonView: {
        height: 80,
        width:80,
        marginLeft:10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#e6eaeb',
    },
    imagelogostyle: {
        width: 30,
        height: 30,
    },
    imageContainer: {
        flexDirection: 'row',
        marginLeft:10,
    },
    bigImageTouch: {
        flexDirection: 'row',
        width: 80,
        height: 80,
        marginHorizontal: 2,
    },
    imageStyletu: {
        width: 80,
        height: 80,
        marginRight: 10,
    },
    textTheme: {
        fontSize: 14,
        color: '#555555',
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 5,
    },
    textTitle: {
        fontSize: 16,
        color: CONSTANTS.THEME_COLOR,
        marginLeft: 10,
        marginTop: 10,
    },
});
