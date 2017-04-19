'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    Image,
    Text,
    ScrollView,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    AsyncStorage,
} = ReactNative;

const AidBigImage = require('./AidBigImage.js');
const FileTransfer = require('@remobile/react-native-file-transfer');
const ImagePicker = require('@remobile/react-native-image-picker');
const moment = require('moment');
const AudioRecorder = require('../../native/index.js').AudioRecorder;
const RecordVoiceMessageBox = require('./RecordVoiceMessageBox.js');
const PayMessageBox = require('./PayMessageBox.js');
const VoiceLongPressMessageBox = require('./VoiceLongPressMessageBox.js');
const ImageLongPressMessageBox = require('./ImageLongPressMessageBox.js');
const AidKitManagement = require('./AidKitManagement.js');
const PublishRuleMessageBox = require('./PublishRuleMessageBox.js');
const fs = require('react-native-fs');
const { Button, DImage, ActionSheet, DelayTouchableOpacity, Picker} = COMPONENTS;

const ITEM_NAME = 'PublishRuleMessageBox';

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        title: '发布求救包',
        leftButton: { handler: () => app.scene.goBack() },
    },
    getInitialState () {
        this.isPlaying = [];
        this.timeArray = [];
        return {
            title: '',
            desc: '',
            price: 0,
            priceStr: '',
            position: '',
            voiecTime:'',
            startTime: moment(),
            endTime: moment().add(24, 'hour'),
            pickerData: [''],
            defaultSelectValue: '',
            uploadVoices:[],
            isPlaying: false,
            uploadLocalVoices:[],
            overlayShowMessageBox:false,
            overlayShowPayMessageBox:false,
            overlayShowLongPressMessageBox:false,
            overlayShowPublishRuleMessageBox:CONSTANTS.IS_RULES_SHOW,
            overlayShowImageLongPressMessageBox:false,
            second:0,
            minute:0,
            netUrlImages:[],
            localUrlImages: [],
            kitID: '',
            payType: 4,
        };
    },
    componentDidMount () {
        app.phoneMgr.toggleSpeaker(true);
    },
    showBigImage (localUrlImages, index) {
        app.showModal(
            <AidBigImage
                doImageClose={app.closeModal}
                defaultIndex={index}
                defaultImageArray={localUrlImages} />
        );
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
    goBack () {
        if (this.uploadOn) {
            Toast('正在上传文件，请稍后再退出');
            return;
        }
        app.navigator.pop();
    },
    showMessageBox () {
        this.setState({ overlayShowMessageBox: true });
    },
    showLongPressMessageBox (filepath, index) {
        this.clickVoiceFilePath = filepath;
        this.clickVoiceIndex = index;
        this.setState({ overlayShowLongPressMessageBox: true });
    },
    showImageLongPressMessageBox (netPah, index) {
        this.clickImageNetPath = netPah;
        this.tempImageIndex = index;
        this.setState({ overlayShowImageLongPressMessageBox: true });
    },
    doDeleteVoice () {
        if (this.isPlaying[this.clickVoiceIndex]) {
            AudioRecorder.playStop();
            this.isPlaying[this.tempIndex] = false;
            this.setState({ isPlaying: this.isPlaying });
        }
        this.setState({ overlayShowLongPressMessageBox: false });
        fs.unlink(this.clickVoiceFilePath);
        const LocalArray = this.state.uploadLocalVoices;
        const netArray = this.state.uploadVoices;
        _.remove(netArray, (item) => netArray[this.clickVoiceIndex] == item);
        _.remove(LocalArray, (item) => this.clickVoiceFilePath == item);
        this.timeArray.splice(this.clickVoiceIndex, 1);
        this.setState({
            uploadLocalVoices:LocalArray,
            uploadVoices:netArray,
        });
    },
    doDeleteImage () {
        const { netUrlImages, localUrlImages } = this.state;
        _.remove(netUrlImages, (item) => netUrlImages[this.tempImageIndex] == item);
        _.remove(localUrlImages, (item) => this.clickImageNetPath == item);
        this.setState({ overlayShowImageLongPressMessageBox: false, netUrlImages, localUrlImages });
    },
    doBack () {
        this.setState({ overlayShowLongPressMessageBox: false });
    },
    doImageBack () {
        this.setState({ overlayShowImageLongPressMessageBox: false });
    },
    recordVoice () {
        AudioRecorder.playStop();
        for (let i = 0; i < this.isPlaying.length; i++) {
            this.isPlaying[i] = false;
        }
        this.setState({ isPlaying: this.isPlaying });
        const time = Date.now();
        const name = app.audioFileMgr.getFileNameFromTime(time);
        const filepath = app.audioFileMgr.getFilePathFromName(name);
        this.fileInfo = {
            time: time,
            name: name,
            filepath: filepath,
        };
        AudioRecorder.record((result) => {

        }, (error) => {
            Toast('录制音频文件失败，请稍后再试');
        }, filepath);
    },
    stopRecordVoice (voiceTime) {
        this.timeArray.push(voiceTime);
        this.setState({ voiceTime:voiceTime });
        AudioRecorder.stop((result) => {
            this.uploadVoice(this.fileInfo.filepath, voiceTime);
        }, (error) => {
            Toast('录制音频文件失败，请稍后再试');
        });
        this.setState({ overlayShowMessageBox: false });
    },
    doGiveup () {
        AudioRecorder.stop((result) => {
            fs.unlink(this.fileInfo.filepath);
        }, (error) => {
            Toast('放弃录音失败，请稍后再试');
        });
        this.setState({ overlayShowMessageBox: false });
    },
    playVoice (filepath, index) {
        if (!filepath) {
            Toast('音频地址为空');
            return;
        }
        app.phoneMgr.phone.speakerOn();
        if (this.isPlaying[index]) {
            AudioRecorder.playStop();
            this.isPlaying[index] = false;
            this.setState({ isPlaying: this.isPlaying });
        } else {
            const tempIsPlaying = _.find(this.isPlaying, (item) => item == true);
            this.clickVoiceIndex = index;
            if (tempIsPlaying && tempIsPlaying != null) {
                this.isPlaying[this.tempIndex] = false;
                this.isPlaying[index] = true;
                this.setState({ isPlaying: this.isPlaying });
                this.tempIndex = index;
                AudioRecorder.play(filepath, (result) => {
                    this.isPlaying[index] = false;
                    this.setState({ isPlaying: this.isPlaying });
                }, (error) => {
                    Toast('无效音频');
                    this.isPlaying[index] = false;
                    this.setState({ isPlaying: this.isPlaying });
                });
            } else {
                this.isPlaying[index] = true;
                this.setState({ isPlaying: this.isPlaying });
                this.tempIndex = index;
                AudioRecorder.play(filepath, (result) => {
                    this.isPlaying[index] = false;
                    this.setState({ isPlaying: this.isPlaying });
                }, (error) => {
                    Toast('无效音频');
                    this.isPlaying[index] = false;
                    this.setState({ isPlaying: this.isPlaying });
                });
            }
        }
    },
    uploadVoice (filePath, voiceTime) {
        const options = {};
        options.fileKey = 'file';
        options.fileName = filePath.substr(filePath.lastIndexOf('/') + 1);
        options.mimeType = 'm4a';
        options.params = {
            userID:app.personal.info.userID,
        };
        this.uploadOn = true;
        this.curUploadFile = filePath;
        UPLOAD(filePath, app.route.ROUTE_UPDATE_FILE, options, (progress) => console.log(progress),
        this.uploadVoiceSuccessCallback.bind(null, voiceTime, filePath), this.uploadVoiceErrorCallback.bind(null, filePath), true);
    },
    uploadVoiceSuccessCallback (voiceTime, filePath, data) {
        if (data.success) {
            let array = this.state.uploadVoices;
            array = array.concat(data.context.url + '#' + voiceTime);
            this.setState({ uploadVoices: array });
            let LocalArray = this.state.uploadLocalVoices;
            LocalArray = LocalArray.concat(this.curUploadFile);
            this.isPlaying = _.fill(Array(LocalArray.length), false);
            this.setState({ uploadLocalVoices: LocalArray, isPlaying: this.isPlaying });
        } else {
            Toast('上传失败');
            const LocalArray = this.state.uploadLocalVoices;
            _.remove(LocalArray, (item) => filePath == item);
            this.timeArray.splice(this.timeArray.length - 1, 1);
            this.setState({
                uploadLocalVoices:LocalArray,
            });
        }
        this.uploadOn = false;
    },
    uploadVoiceErrorCallback (filePath) {
        const LocalArray = this.state.uploadLocalVoices;
        _.remove(LocalArray, (item) => filePath == item);
        this.timeArray.splice(this.timeArray.length - 1, 1);
        this.setState({
            uploadLocalVoices:LocalArray,
        });
        this.uploadOn = false;
    },
    doPublisherKid () {
        // 点击提交按钮时停止播放音频
        if (this.isPlaying[this.clickVoiceIndex]) {
            AudioRecorder.playStop();
            this.isPlaying[this.tempIndex] = false;
            this.setState({ isPlaying: this.isPlaying });
        }
        if (!this.state.title) {
            Toast('请输入一个主题');
            return;
        }
        if (!this.state.desc) {
            Toast('请输入主题包简介');
            return;
        }
        if (!app.utils.checkNumberCode(this.state.priceStr)) {
            Toast('请输入有效的价格');
            return;
        }
        const param = {
            Kid:{
                type: '2',
                userID: app.personal.info.userID,
                title: this.state.title,
                startTime: this.getDateText(this.state.startTime),
                endTime: this.getDateText(this.state.endTime),
                desc: this.state.desc,
                price: this.state.priceStr,
                imageArray: this.state.netUrlImages ? this.state.netUrlImages : [],
                audioArray: this.state.uploadVoices ? this.state.uploadVoices : [],
            },
        };
        POST(app.route.ROUTE_PUBLISHER_KID, param, this.doPublisherKidSuccess, true);
    },
    doPublisherKidSuccess (data) {
        if (data.success) {
            this.setState({
                price:Number(this.state.priceStr).toFixed(2),
                kitID:data.context.id,
                overlayShowPayMessageBox: true,
            });
        } else {
            Toast(data.msg);
        }
    },
    showDataPicker (index) {
        let date = index === 0 ? this.state.startTime : this.state.endTime;
        const now = moment();
        if (date.isBefore(now)) {
            date = now;
        }
        this.pickerType = index === 0 ? 'startDate' : 'endDate';
        let pickerData = app.utils.createDateData(now);
        let defaultSelectValue = [date.year() + '年', (date.month() + 1) + '月', date.date() + '日'];
        Picker(pickerData, defaultSelectValue, '').then((value)=>{
            this.setChooseValue(value);
        });
    },
    getDateText (date) {
        return moment(date).format('YYYY-MM-DD');
    },
    setChooseValue (value) {
        const type = this.pickerType;
        if (type === 'startDate') {
            const date = moment(value, 'YYYY年MM月DD日');
            let endTime = this.state.endTime;
            if (endTime.isBefore(date)) {
                endTime = date;
            }
            this.setState({ startTime: date, endTime:endTime });
        } else if (type === 'endDate') {
            const date = moment(value, 'YYYY年MM月DD日');
            let startTime = this.state.startTime;
            if (startTime.isAfter(date)) {
                startTime = date;
            }
            this.setState({ startTime: startTime, endTime:date });
        }
    },
    doClosePayMessageBox () {
        this.setState({ overlayShowPayMessageBox: false });
        this.props.updateAidList();
        app.navigator.pop();
    },
    doPayByWechat () {
        this.setState({ overlayShowPayMessageBox: false });
        this.props.updateAidList();
        app.navigator.pop();
    },
    doPayByAlipay () {
        this.setState({ overlayShowPayMessageBox: false });
        this.props.updateAidList();
        app.navigator.pop();
    },
    doPayByApplePay () {
        this.setState({ overlayShowPayMessageBox: false });
        this.props.updateAidList();
        app.navigator.pop();
    },
    doRuleConfirm () {
        this.setState({ overlayShowPublishRuleMessageBox: false });
    },
    doRuleNoPrompt () {
        this.setState({ overlayShowPublishRuleMessageBox: false });
        CONSTANTS.IS_RULES_SHOW = false;
        AsyncStorage.setItem(ITEM_NAME, 'no');
    },
    render () {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollUpside}>
                    <View style={styles.infoContainer}>
                        <TextInput
                            style={styles.themeStyle}
                            onChangeText={(text) => this.setState({ title: text })}
                            defaultValue={this.state.title}
                            maxLength={15}
                            placeholder={'请输入您所要发布的求救包主题(15字以内)'}
                            />
                        <View style={styles.separator} />
                        <View style={styles.upsidedesc}>
                            <TextInput
                                style={styles.detailStyle}
                                onChangeText={(text) => this.setState({ desc: text })}
                                defaultValue={this.state.desc}
                                multiline
                                placeholder={'请输入您求救包的主题简介'}
                                />
                        </View>
                    </View>
                    <View style={styles.dateContainer}>
                        <TouchableOpacity onPress={this.showDataPicker.bind(null, 0)} style={styles.timeContainer}>
                            <Text style={styles.texttile}>开始日期</Text>
                            <View style={styles.updownlside}>
                                <Text style={styles.textupcenter}>{this.getDateText(this.state.startTime)}</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.separator} />
                        <TouchableOpacity onPress={this.showDataPicker.bind(null, 1)} style={styles.timeContainer}>
                            <Text style={styles.texttile}>结束日期</Text>
                            <View style={styles.updownlside}>
                                <Text style={styles.textupcenter}>{this.getDateText(this.state.endTime)}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.imageUpside}>
                        <View style={styles.imageStyleView}>
                            <DelayTouchableOpacity
                                activeOpacity={0.6}
                                onPress={this.showPohotoImg}>
                                <View style={styles.imageButtonView}>
                                    <Image source={app.img.actualCombat_logo_alone} style={styles.imagelogostyle} />
                                    <Text style={styles.textlogotile} >点击添加图片</Text>
                                </View>
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
                    </View>
                    <View style={styles.voiceUpside}>
                        <View style={styles.voiceStyleView}>
                            <TouchableOpacity onPress={this.showMessageBox} style={styles.voiceButtonView}>
                                <Image source={app.img.actualCombat_voice_icon2} style={styles.voiceStyle} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView horizontal style={[styles.imageContainer, { marginLeft:10 }]}>
                            {
                                this.state.uploadLocalVoices && this.state.uploadLocalVoices.map((item, i) => {
                                    return (
                                        <View key={i} style={[styles.audioContainer]}>
                                            <TouchableOpacity
                                                key={i}
                                                activeOpacity={0.6}
                                                onPress={this.playVoice.bind(null, item, i)}
                                                delayLongPress={1500}
                                                onLongPress={this.showLongPressMessageBox.bind(null, item, i)}
                                                style={styles.audioPlay}>
                                                <Image source={this.state.isPlaying[i] ? app.img.actualCombat_voice_say_play : app.img.actualCombat_voice_say} style={styles.imagevoice} />
                                                <Text style={styles.textTime} >{this.timeArray[i] + "''"}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    );
                                })
                            }
                        </ScrollView>
                    </View>
                    <View style={styles.priceStyle}>
                        <TextInput
                            style={styles.themeStyle}
                            onChangeText={(text) => this.setState({ priceStr: text })}
                            defaultValue={this.state.priceStr}
                            placeholder={'请输入你要悬赏金额，并转入赢销截拳道暂时保管'}
                            />
                    </View>
                    <View style={styles.themeupstyle}>
                        <TouchableOpacity
                            onPress={this.doPublisherKid}
                            style={[styles.tabButton, { backgroundColor: CONSTANTS.THEME_COLOR }]}>
                            <Text style={styles.textcenter} >提    交</Text>
                            <View style={[styles.makeup, { right:0, backgroundColor:'#4FC1E9' }]} />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                {
                    this.state.overlayShowMessageBox &&
                    <RecordVoiceMessageBox
                        showType={0}
                        doStartRecord={this.recordVoice}
                        doGiveup={this.doGiveup}
                        doConfirm={this.stopRecordVoice} />
                }
                {
                    this.state.overlayShowPayMessageBox &&
                    <PayMessageBox {...this.state}
                        typeCode={4}
                        kitID={this.state.kitID}
                        doPayByWechat={this.doPayByWechat}
                        doPayByAlipay={this.doPayByAlipay}
                        doClose={this.doClosePayMessageBox}
                        doPayByApplePay={this.doPayByApplePay} />
                }
                {
                    this.state.overlayShowLongPressMessageBox &&
                    <VoiceLongPressMessageBox
                        doDelete={this.doDeleteVoice}
                        doBack={this.doBack} />
                }
                {
                    this.state.overlayShowPublishRuleMessageBox &&
                    <PublishRuleMessageBox
                        doRuleConfirm={this.doRuleConfirm}
                        doRuleNoPrompt={this.doRuleNoPrompt} />
                }
                {
                    this.state.overlayShowImageLongPressMessageBox &&
                    <ImageLongPressMessageBox
                        doDelete={this.doDeleteImage}
                        doBack={this.doImageBack} />
                }
            </View>
        );
    },
});
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'space-around',
    },
    scrollUpside: {
        flex: 1,
    },
    infoContainer: {
        marginTop: 20,
        backgroundColor: '#FFFFFF',
    },
    upsidedesc: {
        height:100,
        marginHorizontal: 10,
        backgroundColor:'#FFFFFF',
    },
    detailStyle:{
        textAlignVertical: 'top',
        fontSize:14,
        height:90,
        marginVertical: 5,
        paddingVertical: 2,
        marginLeft: 5,
        backgroundColor: '#FFFFFF',
    },
    updownlside:{
        height:30,
        marginHorizontal:10,
        flexDirection:'row',
        alignItems: 'center',
    },
    priceStyle: {
        marginTop: 21,
        height: 47,
        width: sr.w,
        backgroundColor:'#FFFFFF',
    },
    themeStyle:{
        marginHorizontal: 10,
        fontSize:14,
        height:47,
        backgroundColor: '#FFFFFF',
    },
    dateContainer: {
        marginTop: 21,
        backgroundColor:'#FFFFFF',
    },
    timeContainer:{
        paddingTop: 3,
        height:47,
        alignItems: 'center',
        flexDirection: 'row',
    },
    separator: {
        width: sr.w - 20,
        alignSelf: 'center',
        backgroundColor: '#EEEEEE',
        height: 1,
    },
    textcenter:{
        fontSize: 14,
        textAlign: 'center',
        color :'#FFFFFF',
    },
    textupcenter:{
        fontSize: 14,
        marginRight: 10,
    },
    texttile:{
        fontSize: 14,
        flex: 1,
        marginLeft:20,
        color :'gray',
    },
    textlogotile:{
        fontSize: 12,
        marginTop:10,
        textAlign:'center',
        color :'#848484',
    },
    themeupstyle:{
        height:40,
        marginTop: 50,
        marginBottom: 20,
        marginHorizontal:10,
        borderRadius:6,
    },
    tabButton: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
        borderRadius: 10,
    },
    imageStyletu: {
        width: 100,
        height: 100,
        marginRight: 10,
    },
    voiceStyle: {
        width: 27,
        height: 27,
    },
    imagelogostyle: {
        width: 30,
        height: 30,
        marginHorizontal:33,
        marginTop:20,
    },
    imageStyleView: {
        height: 144,
        alignItems: 'center',
        flexDirection:'row',
    },
    voiceUpside: {
        height: 47,
        marginTop: 21,
        flexDirection:'row',
        backgroundColor:'#FFFFFF',
    },
    voiceStyleView: {
        height: 47,
        width:50,
        justifyContent: 'center',
    },
    imageButtonView: {
        height: 105,
        width:105,
        marginLeft:10,
        backgroundColor:'#EEEEEE',
    },
    voiceButtonView: {
        height: 30,
        width:30,
        marginLeft:10,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageContainer: {
        flexDirection: 'row',
        marginLeft:10,
    },
    imageUpside:{
        marginTop: 20,
        backgroundColor:'#FFFFFF',
    },
    audioContainer: {
        width: 70,
        height:47,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection:'row',
    },
    textTime:{
        fontSize: 12,
        textAlign: 'left',
        color :'gray',
    },
    audioPlay: {
        height: 35,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EEEEEE',
    },
    imagevoice:{
        width:17,
        height:22,
        marginRight: 10,
    },
    bigImageTouch: {
        flexDirection: 'row',
        width: 100,
        height: 100,
        marginHorizontal: 2,
    },
});
