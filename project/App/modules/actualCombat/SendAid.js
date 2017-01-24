'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
    TextInput,
    ScrollView,
    TouchableHighlight,
    AsyncStorage,
} = ReactNative;

var {Button, DImage, ActionSheet,DelayTouchableOpacity} = COMPONENTS;
var ImagePicker = require('@remobile/react-native-image-picker');
var AidBigImage = require('./AidBigImage.js');
var AudioRecorder = require('../../native/index.js').AudioRecorder;
var RecordVoiceMessageBox = require('./RecordVoiceMessageBox.js');
var VoiceLongPressMessageBox = require('./VoiceLongPressMessageBox.js');
var PublishRuleMessageBox = require('./PublishRuleMessageBox.js');
var ImageLongPressMessageBox = require('./ImageLongPressMessageBox.js');
var fs = require('react-native-fs');

const ITEM_NAME = "PublishRuleMessageBox";

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        title: '发布急救包',
        leftButton: {handler: ()=>app.scene.goBack()},
    },
    getInitialState() {
        this.isPlaying = [];
        this.timeArray=[];
        this.timesingle='';

        return {
            title: '',
            desc: '',
            price: '',
            uploadVoices:[],
            urlsingle:[],
            urlsingles:[],
            isPlaying: false,
            uploadLocalVoices:[],
            overlayShowMessageBox:false,
            overlayShowLongPressMessageBox:false,
            overlayShowPublishRuleMessageBox:CONSTANTS.IS_RULES_SHOW,
            overlayShowImageLongPressMessageBox:false,
            isRecord: false,
            isRecordPlaying: false,
            localUrlImages:[],
            netUrlImages:[],
            thankAudio:[],
        };
    },
    componentDidMount() {
        app.phoneMgr.toggleSpeaker(true);
    },
    goBack() {
        if (this.uploadOn) {
            Toast('正在上传文件，请稍后再退出');
            return;
        }
        app.navigator.pop();
    },
    getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
          month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
      }
      var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
      return currentdate;

    },
    showPohotoImg() {
        var options = {maximumImagesCount: 3, width: 400};
        var filePaths=[];
        ImagePicker.getPictures(options, (results) => {
            if (results.length>0) {
                for (var i = 0; i < results.length; i++) {
                    var filePath = results[i];
                    var item = {
                        name: 'file',
                        filename: filePath.substr(filePath.lastIndexOf('/')+1),
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
    uploadFiles(filePaths) {
        let {localUrlImages} = this.state;
        this.tempLocalUrlImages = [];
        filePaths.map((item, i)=>{
            localUrlImages = localUrlImages.concat(item.filepath);
            this.tempLocalUrlImages.push(item.filepath);
        })
        this.setState({localUrlImages: localUrlImages});
        var param = {
            userID:app.personal.info.userID
        };
        this.uploadOn = true;
        MULTIUPLOAD(filePaths, app.route.ROUTE_UPDATE_MULTI_FILES, param, (progress) => console.log(progress),
        this.uploadSuccessCallback, this.uploadErrorCallback, true);
    },
    uploadSuccessCallback(data) {
        if (data.success) {
            var {netUrlImages} = this.state;
            netUrlImages = netUrlImages.concat(data.context.url);
            this.setState({netUrlImages});
        } else {
            // 删除该数组
            let {localUrlImages} = this.state;
            localUrlImages = _.difference(localUrlImages, this.tempLocalUrlImages);
            this.setState({localUrlImages: localUrlImages});
            Toast("上传失败");
        }
        this.uploadOn = false;
    },
    uploadErrorCallback() {
        this.uploadOn = false;
    },
    showBigImage(localUrlImages, index) {
        app.showModal(
            <AidBigImage
                doImageClose={app.closeModal}
                defaultIndex={index}
                defaultImageArray={localUrlImages}>
            </AidBigImage>
        );
    },
    showMessageBox() {
        this.setState({overlayShowMessageBox: true});
    },
    showLongPressMessageBox(filepath, index, tabIndex) {
        this.tabIndex = tabIndex;
        this.clickVoiceFilePath = filepath;
        this.clickVoiceIndex = index;
        this.setState({overlayShowLongPressMessageBox: true});
    },
    showImageLongPressMessageBox(netPah, index) {
    this.clickImageNetPath = netPah;
    this.tempImageIndex = index;
    this.setState({overlayShowImageLongPressMessageBox: true});
    },
    doDeleteVoice() {
        this.setState({overlayShowLongPressMessageBox: false});
        fs.unlink(this.clickVoiceFilePath);
        if (this.tabIndex === 0) {
            if (this.isRecordPlaying) {
                AudioRecorder.playStop();
                this.isRecordPlaying = false;
                this.setState({isRecordPlaying: this.isRecordPlaying});
            }
            var LocalArray = this.state.urlsingles;
            var netArray = this.state.urlsingle;
            _.remove(LocalArray, (item)=>this.clickVoiceFilePath==item);
            _.remove(netArray, (item)=>netArray[0]==item);
            this.setState({
                urlsingles: LocalArray,
                urlsingle: netArray,
                isRecord: false
            });
        } else {
            if (this.isPlaying[this.clickVoiceIndex]) {
                AudioRecorder.playStop();
                this.isPlaying[this.tempIndex] = false;
                this.setState({isPlaying: this.isPlaying});
            }
            var LocalArray = this.state.uploadLocalVoices;
            var netArray = this.state.uploadVoices;
            _.remove(netArray, (item)=>netArray[this.clickVoiceIndex]==item);
            _.remove(LocalArray, (item)=>this.clickVoiceFilePath==item);
            this.timeArray.splice(this.clickVoiceIndex,1);
            this.setState({
                uploadLocalVoices:LocalArray,
                uploadVoices:netArray,
            });
        }
    },
    doDeleteImage() {
        var {netUrlImages, localUrlImages} = this.state;
        _.remove(netUrlImages, (item)=>netUrlImages[this.tempImageIndex]==item);
        _.remove(localUrlImages, (item)=>this.clickImageNetPath==item);
        this.setState({overlayShowImageLongPressMessageBox: false, netUrlImages,localUrlImages});
    },
    doBack() {
        this.setState({overlayShowLongPressMessageBox: false});
    },
    doImageBack() {
        this.setState({overlayShowImageLongPressMessageBox: false});
    },
    recordVoice() {
        AudioRecorder.playStop();
        this.isRecordPlaying = false;
        this.setState({isRecordPlaying: this.isRecordPlaying});
        for (var i=0;i< this.isPlaying.length;i++) {
            this.isPlaying[i]=false;
        }
        this.setState({isPlaying: this.isPlaying});
        var time = Date.now();
        var name = app.audioFileMgr.getFileNameFromTime(time);
        var filepath = app.audioFileMgr.getFilePathFromName(name);
        this.fileInfo = {
            time: time,
            name: name,
            filepath: filepath
        };
        AudioRecorder.record((result)=>{
        }, (error)=>{
            Toast('录制音频文件失败，请稍后再试');
        }, filepath);
    },
    stopRecordVoice(voiceTime) {
      if (this.tabIndex === 0) {
        this.timesingle=voiceTime;
      } else {
        this.timeArray.push(voiceTime);
      }
        this.setState({voiceTime:voiceTime});
        AudioRecorder.stop((result)=>{
            this.uploadVoice(this.fileInfo.filepath, voiceTime);
        }, (error)=>{
            Toast('录制音频文件失败，请稍后再试');
        });
        this.setState({overlayShowMessageBox: false});
    },
    doGiveup() {
        AudioRecorder.stop((result)=>{
            fs.unlink(this.fileInfo.filepath);
        }, (error)=>{
            Toast('放弃录音失败，请稍后再试');
        });
        this.setState({overlayShowMessageBox: false});
    },
    playVoice(filepath,index){
        app.phoneMgr.phone.speakerOn();
        this.isRecordPlaying = false;
        this.setState({isRecordPlaying: this.isRecordPlaying});
        if (this.isPlaying[index]) {
            AudioRecorder.playStop();
            this.isPlaying[index] = false;
            this.setState({isPlaying: this.isPlaying});
        } else {
            var tempIsPlaying = _.find(this.isPlaying, (item)=>item==true);
            this.clickVoiceIndex = index;
            if (tempIsPlaying && tempIsPlaying != null) {
                this.isPlaying[this.tempIndex] = false;
                this.isPlaying[index] = true;
                this.setState({isPlaying: this.isPlaying});
                this.tempIndex = index;
                AudioRecorder.play(filepath, (result)=>{
                    this.isPlaying[index] = false;
                    this.setState({isPlaying: this.isPlaying});
                }, (error)=>{
                    Toast('无效音频');
                    this.isPlaying[index] = false;
                    this.setState({isPlaying: this.isPlaying});
                });
            } else {
                this.isPlaying[index] = true;
                this.setState({isPlaying: this.isPlaying});
                this.tempIndex = index;
                AudioRecorder.play(filepath, (result)=>{
                    this.isPlaying[index] = false;
                    this.setState({isPlaying: this.isPlaying});
                }, (error)=>{
                    Toast('无效音频');
                    this.isPlaying[index] = false;
                    this.setState({isPlaying: this.isPlaying});
                });
            }
        }
    },
    playVoicesingle(filepath){
        app.phoneMgr.phone.speakerOn();
        for (var i=0;i< this.isPlaying.length;i++) {
            this.isPlaying[i]=false;
        }
        this.setState({isPlaying: this.isPlaying});
        if (this.isRecordPlaying) {
            AudioRecorder.playStop();
            this.isRecordPlaying = false;
            this.setState({isRecordPlaying: this.isRecordPlaying});
        } else {
            this.isRecordPlaying = true;
            this.setState({isRecordPlaying: this.isRecordPlaying});
            AudioRecorder.play(filepath, (result)=>{
                this.isRecordPlaying = false;
                this.setState({isRecordPlaying: this.isRecordPlaying});
            }, (error)=>{
                Toast('无效音频');
                this.isRecordPlaying = false;
                this.setState({isRecordPlaying: this.isRecordPlaying});
            });

        }
    },
    uploadVoice(filePath, voiceTime) {
        var options = {};
        options.fileKey = 'file';
        options.fileName = filePath.substr(filePath.lastIndexOf('/')+1);
        options.mimeType = 'm4a';
        options.params = {
            userID:app.personal.info.userID
        };
        this.uploadOn = true;
        this.curUploadFile = filePath;
        UPLOAD(filePath, app.route.ROUTE_UPDATE_FILE, options, (progress) => console.log(progress),
        this.uploadVoiceSuccessCallback.bind(null, voiceTime, filePath), this.uploadVoiceErrorCallback.bind(null,filePath), true);
    },
    uploadVoiceSuccessCallback(voiceTime, filePath, data) {
        if (data.success) {
            if(this.tabIndex===0) {
                var array = this.state.urlsingle;
                array = array.concat(data.context.url);
                  this.setState({urlsingle: array});
                  var LocalArray = this.state.urlsingles;
                  LocalArray = LocalArray.concat(this.curUploadFile);
                  this.setState({urlsingles: LocalArray, isRecord:true});
            } else {
              var array = this.state.uploadVoices;
              array = array.concat(data.context.url+'#'+voiceTime);
                this.setState({uploadVoices: array});
                var LocalArray = this.state.uploadLocalVoices;
                LocalArray = LocalArray.concat(this.curUploadFile);
                this.isPlaying = _.fill(Array(LocalArray.length), false);
                this.setState({uploadLocalVoices: LocalArray, isPlaying: this.isPlaying});
            }
        } else {
            Toast("上传失败");
            if (this.tabIndex === 0) {
                var LocalArray = this.state.urlsingles;
                _.remove(LocalArray, (item)=>LocalArray[0]==item);
                this.setState({
                    urlsingles: LocalArray,
                    isRecord: false
                });
            } else {
                var LocalArray = this.state.uploadLocalVoices;
                _.remove(LocalArray, (item)=>filePath==item);
                this.timeArray.splice(this.timeArray.length-1,1);
                this.setState({
                    uploadLocalVoices:LocalArray,
                });
            }
        }
        this.uploadOn = false;

    },
    uploadVoiceErrorCallback(filePath) {
        if (this.tabIndex === 0) {
            var LocalArray = this.state.urlsingles;
            _.remove(LocalArray, (item)=>LocalArray[0]==item);
            this.setState({
                urlsingles: LocalArray,
                isRecord: false
            });
        } else {
            var LocalArray = this.state.uploadLocalVoices;
            _.remove(LocalArray, (item)=>filePath==item);
            this.timeArray.splice(this.timeArray.length-1,1);
            this.setState({
                uploadLocalVoices:LocalArray,
            });
        }
        this.uploadOn = false;
    },
    doPublisherKid() {
        //点击提交按钮时停止播放音频
        if (this.isRecordPlaying) {
            AudioRecorder.playStop();
            this.isRecordPlaying = false;
            this.setState({isRecordPlaying: this.isRecordPlaying});
        }
        if (this.isPlaying[this.clickVoiceIndex]) {
            AudioRecorder.playStop();
            this.isPlaying[this.tempIndex] = false;
            this.setState({isPlaying: this.isPlaying});
        }
        if (!this.state.title) {
            Toast('请输入一个主题');
            return;
        }
        if (!this.state.desc) {
            Toast('请输入主题包简介');
            return;
        }
        if (!app.utils.checkNumberCode(this.state.price)) {
            Toast('请输入有效的价格');
            return;
        }
        var param = {
            Kid:{
                type: '1',
                userID: app.personal.info.userID,
                title: this.state.title,
                desc: this.state.desc,
                startTime: this.getNowFormatDate(),
                endTime: this.getNowFormatDate(),
                price: this.state.price,
                thankLong:this.timesingle,
                thankAudio: this.state.urlsingle?this.state.urlsingle[0]:'',
                imageArray: this.state.netUrlImages?this.state.netUrlImages:[],
                audioArray: this.state.uploadVoices?this.state.uploadVoices:[],
            },
        };
        POST(app.route.ROUTE_PUBLISHER_KID, param, this.doPublisherKidSuccess, true);
    },
    doPublisherKidSuccess(data) {
        if (data.success) {
            Toast('提交成功');
            this.props.updateAidList();
            app.navigator.pop();
        }else {
            Toast(data.msg);
        }
    },
    doRuleConfirm() {
        this.setState({overlayShowPublishRuleMessageBox: false});
    },
    doRuleNoPrompt() {
        this.setState({overlayShowPublishRuleMessageBox: false});
        CONSTANTS.IS_RULES_SHOW = false;
        new Promise(async(resolve, reject)=>{
            await AsyncStorage.setItem(ITEM_NAME, "no");
            resolve();
        });
    },
    goRecordsingle(){
        this.tabIndex = 0;
        this.showMessageBox();
    },
    goRecord(){
       this.tabIndex =1;
       this.showMessageBox();
    },
    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.downside}>
                    <View style={styles.infoContainer}>
                        <TextInput
                            style={styles.themeStyle}
                            onChangeText={(text) => this.setState({title: text})}
                            defaultValue={this.state.title}
                            maxLength={15}
                            placeholder={'请输入您所要发布的急救包主题(15字以内)'}
                            />
                    </View>
                    <View style={styles.upsidedesc}>
                        <TextInput
                            style={styles.detailStyle}
                            onChangeText={(text) => this.setState({desc: text})}
                            defaultValue={this.state.desc}
                            multiline={true}
                            placeholder={'请输入您急救包的主题简介'}
                            />
                    </View>
                    <View style={styles.priceStyle}>
                        <TextInput
                            style={styles.themeStyle}
                            onChangeText={(text) => this.setState({price: text})}
                            defaultValue={this.state.price}
                            placeholder={'请输入你想要得到的打赏金额'}
                            />
                    </View>
                    <View style={styles.tempside}>
                        {
                            this.state.isRecord?
                            this.state.urlsingles&&this.state.urlsingles.map((item, i)=>{
                              return(
                                <View key = {i} style={styles.voicebtnside}>
                                    <Text style={[styles.texttile, {color :'#666666'}]} >{this.timesingle+"''"}</Text>
                                    <TouchableOpacity
                                        activeOpacity={0.6}
                                        onPress={this.playVoicesingle.bind(null,item)}
                                        delayLongPress={1500}
                                        onLongPress={this.showLongPressMessageBox.bind(null,item, i, 0)}
                                        style={styles.audioBtn}>
                                        <Image
                                            source={this.state.isRecordPlaying?app.img.actualCombat_voice_playing:app.img.actualCombat_voice_play}
                                            style={styles.imageVoicestyle} />
                                    </TouchableOpacity>
                                </View>
                          )
                        })
                            :
                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={this.goRecordsingle}
                                style={styles.recordbtnside}>
                                <Text style={styles.texttile} >为给你打赏的大爷们录一段感谢的话</Text>
                            </TouchableOpacity>

                        }
                    </View>
                    <View style={styles.imageUpside}>
                        <View style={styles.imageStyleView}>
                            <DelayTouchableOpacity
                                activeOpacity={0.6}
                                onPress={this.showPohotoImg}>
                                <View  style={styles.imageButtonView}>
                                    <Image
                                        source={app.img.actualCombat_logo_alone}
                                        style={styles.imagelogostyle} />
                                    <Text style={styles.textlogotile} >点击添加图片</Text>
                                </View>
                            </DelayTouchableOpacity>
                            <ScrollView
                                horizontal={true}
                                style={styles.imageContainer}>
                                {
                                    this.state.localUrlImages&&this.state.localUrlImages.map((item, i)=>{
                                        return (
                                            <TouchableHighlight
                                                key={i}
                                                underlayColor="rgba(0, 0, 0, 0)"
                                                onPress={this.showBigImage.bind(null, this.state.localUrlImages, i)}
                                                onLongPress={this.showImageLongPressMessageBox.bind(null,item, i)}
                                                style={styles.bigImageTouch}>
                                                <Image
                                                    key={i}
                                                    resizeMode='stretch'
                                                    source={{uri: item}}
                                                    style={styles.imageStyletu}
                                                    />
                                            </TouchableHighlight>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                    </View>
                    <View style={styles.voiceUpside}>
                        <View style={styles.voiceStyleView}>
                            <TouchableOpacity
                                onPress={this.goRecord}
                                style={styles.voiceButtonView}>
                                <Image
                                source={app.img.actualCombat_voice_icon2}
                                style={styles.voiceStyle} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView
                            horizontal={true}
                            style={styles.imageContainer}>
                            {
                                this.state.uploadLocalVoices&&this.state.uploadLocalVoices.map((item, i)=>{
                                    return (
                                        <View key={i} style={[styles.audioContainer]}>
                                            <TouchableOpacity
                                                key={i}
                                                activeOpacity={0.6}
                                                onPress={this.playVoice.bind(null,item,i)}
                                                delayLongPress={1500}
                                                onLongPress={this.showLongPressMessageBox.bind(null,item,i)}
                                                style={styles.audioPlay}>
                                                <Image source={this.state.isPlaying[i]?app.img.actualCombat_voice_say_play:app.img.actualCombat_voice_say} style={styles.imagevoice} />
                                                <Text style={styles.textTime} >{this.timeArray[i]+"''"}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                    <View style={styles.themeupstyle}>
                        <TouchableOpacity
                            onPress={this.doPublisherKid}
                            style={styles.tabButton}>
                            <Text style={styles.textcenter} >
                                提交
                            </Text>
                            <View style={[styles.makeup, {right:0,backgroundColor:'#4FC1E9'}]}>
                            </View>
                        </TouchableOpacity>
                    </View>
                    </ScrollView>
                    {
                        this.state.overlayShowMessageBox &&
                        <RecordVoiceMessageBox
                            showType={0}
                            doStartRecord={this.recordVoice}
                            doGiveup={this.doGiveup}
                            noticeShow={this.updateTheTime}
                            doConfirm={this.stopRecordVoice}>
                        </RecordVoiceMessageBox>
                    }
                    {
                        this.state.overlayShowLongPressMessageBox &&
                        <VoiceLongPressMessageBox
                            doDelete={this.doDeleteVoice}
                            doBack={this.doBack}>
                        </VoiceLongPressMessageBox>
                    }
                    {
                        this.state.overlayShowPublishRuleMessageBox &&
                        <PublishRuleMessageBox
                            doRuleConfirm={this.doRuleConfirm}
                            doRuleNoPrompt={this.doRuleNoPrompt}>
                        </PublishRuleMessageBox>
                    }
                    {
                        this.state.overlayShowImageLongPressMessageBox &&
                        <ImageLongPressMessageBox
                            doDelete={this.doDeleteImage}
                            doBack={this.doImageBack}>
                        </ImageLongPressMessageBox >
                    }

            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'space-around',
    },
    upside:{
        height:320,
    },
    imageUpside:{
        marginTop: 20,
        backgroundColor:'#FFFFFF',
    },
    infoContainer: {
        marginTop: 20,
        backgroundColor: '#FFFFFF',
    },
    tempside:{
        marginVertical: 5,
        justifyContent: 'center',
    },
    midupside:{
        height:140,
        backgroundColor:'white',
    },
    voiceUpside:{
        height: 47,
        marginTop: 21,
        flexDirection:'row',
        backgroundColor:'#FFFFFF',
    },
    themeStyle:{
        fontSize:14,
        paddingTop: 3,
        paddingLeft: 5,
        height:45,
        backgroundColor: '#FFFFFF',
        marginHorizontal: 10,
    },
    detailStyle:{
        textAlignVertical: 'top',
        fontSize:14,
        height:90,
        marginVertical: 5,
        paddingVertical: 2,
        marginHorizontal: 10,
        backgroundColor: '#FFFFFF',
    },
    upsidedesc: {
        height:100,
        marginTop: 12,
        backgroundColor:'#FFFFFF',
    },
    priceStyle: {
        marginTop: 12,
        height: 45,
        width: sr.w,
        backgroundColor:'#FFFFFF',
    },
    imageStyleView: {
        height: 144,
        alignItems: 'center',
        flexDirection:'row',
    },
    imageButtonView: {
        height: 105,
        width:105,
        marginLeft:10,
        backgroundColor:'#EEEEEE',
    },
    imagelogostyle: {
        width: 30,
        height: 30,
        marginHorizontal:33,
        marginTop:20,
    },
    textlogotile:{
        fontSize: 12,
        marginTop:10,
        textAlign:'center',
        color :'#848484',
    },
    texttile:{
        fontSize: 14,
        color :'#FFFFFF',
        marginHorizontal:10,
    },
    imageContainer: {
        flexDirection: 'row',
        marginLeft:10,
    },
    bigImageTouch: {
        flexDirection: 'row',
        width: 100,
        height: 100,
        marginHorizontal: 2,
    },
    imageStyletu: {
        width: 100,
        height: 100,
        marginRight: 10,
    },
    voiceStyleView: {
        height: 47,
        width:50,
        justifyContent: 'center',
    },
    voiceButtonView: {
        height: 30,
        width:30,
        marginLeft:10,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    voiceStyle: {
        width: 27,
        height: 27,
    },
    imageStyletu1: {
        width: 18,
        height: 24.5,
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
    audioBtn: {
        height: 32,
        width: 70,
        borderRadius:4,
        alignItems: 'flex-end',
        justifyContent: 'center',
        backgroundColor: CONSTANTS.THEME_COLOR,
    },
    imagevoice:{
        width:17,
        height:22,
        marginRight: 10,
    },
    imageVoicestyle:{
        width: 12,
        height:16,
        marginRight: 10,
    },
    themeupstyle:{
        height:45,
        marginTop: 50,
        marginBottom: 30,
        marginHorizontal:10,
        borderRadius:6,
        backgroundColor: CONSTANTS.THEME_COLOR,
    },
    tabButton: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
        borderRadius: 10,
    },
    textcenter:{
        fontSize: 15,
        fontWeight: '500',
        textAlign: 'center',
        color :'white',
    },
    voicebtnside:{
        height:40,
        alignItems: 'center',
        flexDirection:'row',
        marginHorizontal:10,
        marginVertical:20,
    },
    recordbtnside:{
        height:45,
        marginTop: 12,
        justifyContent: 'center',
        backgroundColor:'#c1974b',
    },
});
