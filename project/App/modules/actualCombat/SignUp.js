'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
} = ReactNative;

var PixelRatio = require('PixelRatio');
var fs = require('react-native-fs');
var ImagePicker = require('@remobile/react-native-image-picker');
var AidBigImage = require('./AidBigImage.js');
var AudioRecorder = require('../../native/index.js').AudioRecorder;
var RecordVoiceMessageBox = require('./RecordVoiceMessageBox.js');
var VoiceLongPressMessageBox = require('./VoiceLongPressMessageBox.js');
var ImageLongPressMessageBox = require('./ImageLongPressMessageBox.js');

var {Button,DelayTouchableOpacity}  = COMPONENTS;

var HeaderView = React.createClass({
    render(){
        return(
                <View style={styles.topContainer}>
                    <View style={styles.titleContainer}>
                        <Text
                            numberOfLines={1}
                            style={[styles.titleText,{marginHorizontal:20}]}>
                            {this.props.message&&this.props.message.title}
                        </Text>
                    </View>
                    <View style={styles.detailContainer}>
                        <View style={styles.deteContainer}>
                            <Text style={styles.contextTextTime}>
                                {this.props.tabIndex===0?(this.props.message.startTime+'至'+this.props.message.endTime):this.props.message.startTime}
                            </Text>
                            <View style={styles.rightTitle}>
                                <Image
                                    resizeMode='stretch'
                                    source={app.img.train_integral}
                                    style={styles.iconCount}
                                    />
                                <Text style={[styles.describeText,{fontSize: 16}]}>
                                    {'¥ '+this.props.message.price+'元'}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.deteContainer1}>
                            <Text style={styles.contextText}>
                                {this.props.message&&this.props.message.titleDec}
                            </Text>
                        </View>
                    </View>
                </View>
        )
    }
})


module.exports = React.createClass({
    statics:  {
        title: '报名参加',
    },
    getInitialState() {
        this.isPlaying = [];
        this.timeArray=[];
        return {
            localUrlImages : [],
            netUrlImages:[],
            uploadVoices:[],
            isPlaying: false,
            uploadLocalVoices:[],
            overlayShowMessageBox:false,
            overlayShowLongPressMessageBox:false,
            overlayShowImageLongPressMessageBox:false,
        };
    },
    componentWillUnmount() {
        AudioRecorder.playStop();
    },
    goBack() {
        AudioRecorder.playStop();
        app.navigator.pop();
    },
    goStudy(){
        app.navigator.popToTop();
        app.showMainScene(1);
    },
    goTrain(){
        app.navigator.popToTop();
        app.showMainScene(2);
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
    },
    uploadErrorCallback() {
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
    showRecordMessageBox() {
        this.setState({overlayShowMessageBox: true});
    },
    showLongPressMessageBox(filepath, index) {
        this.clickVoiceFilePath = filepath;
        this.clickVoiceIndex = index;
        this.setState({overlayShowLongPressMessageBox: true});
    },
    showImageLongPressMessageBox(netPah, index) {
        this.clickImageNetPath = netPah;
        this.tempImageIndex = index;
        this.setState({overlayShowImageLongPressMessageBox: true});
    },
    doUseLoudSpeaker() {
        this.setState({overlayShowLongPressMessageBox: false});
        AudioRecorder.play(this.clickVoiceFilePath, (result)=>{
        }, (error)=>{
            Toast('无效音频');
        });
    },
    doDelete() {
        if (this.isPlaying[this.clickVoiceIndex]) {
            AudioRecorder.playStop();
            this.isPlaying[this.tempIndex] = false;
            this.setState({isPlaying: this.isPlaying});
        }
        this.setState({overlayShowLongPressMessageBox: false});
        fs.unlink(this.clickVoiceFilePath);
        var LocalArray = this.state.uploadLocalVoices;
        var netArray = this.state.uploadVoices;
        _.remove(netArray, (item)=>netArray[this.clickVoiceIndex]==item);
        _.remove(LocalArray, (item)=>this.clickVoiceFilePath==item);
        this.timeArray.splice(this.clickVoiceIndex,1);
        this.setState({
            uploadLocalVoices:LocalArray,
            uploadVoices:netArray,
        });
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
        this.timeArray.push(voiceTime);
        this.setState({voiceTime:voiceTime});
        AudioRecorder.stop((result)=>{
            this.uploadVoice(this.fileInfo.filepath,voiceTime);
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
        if (this.isPlaying[index]) {
            AudioRecorder.playStop();
            this.isPlaying[index] = false;
            this.setState({isPlaying: this.isPlaying});
        } else {
            var tempIsPlaying = _.find(this.isPlaying, (item)=>item==true);
            if (tempIsPlaying && tempIsPlaying != null) {
                // AudioRecorder.playStop();
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
    uploadVoice(filePath,voiceTime) {
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
            this.uploadVoiceSuccessCallback.bind(null,voiceTime,filePath), this.uploadVoiceErrorCallback.bind(null,filePath), true);
    },
    uploadVoiceSuccessCallback(voiceTime, filePath,data) {
        if (data.success) {
            var array = this.state.uploadVoices;

            array = array.concat(data.context.url+'#'+voiceTime);
            this.setState({uploadVoices: array});
            var LocalArray = this.state.uploadLocalVoices;
            LocalArray = LocalArray.concat(this.curUploadFile);
            this.setState({uploadLocalVoices: LocalArray});
            this.isPlaying = _.fill(Array(LocalArray.length), false);
            this.setState({uploadLocalVoices: LocalArray, isPlaying: this.isPlaying});

        } else {
            Toast("上传失败");
            var LocalArray = this.state.uploadLocalVoices;
            _.remove(LocalArray, (item)=>filePath==item);
            this.timeArray.splice(this.timeArray.length-1,1);
            this.setState({
                uploadLocalVoices:LocalArray,
            });
        }
    },
    uploadVoiceErrorCallback(filePath) {
        var LocalArray = this.state.uploadLocalVoices;
        _.remove(LocalArray, (item)=>filePath==item);
        this.timeArray.splice(this.timeArray.length-1,1);
        this.setState({
            uploadLocalVoices:LocalArray,
        });
    },
    submitKit() {
        let {netUrlImages, uploadVoices} = this.state;
        if (!netUrlImages.length&& !uploadVoices.length) {
            Toast("图片或语音不能为空！");
            return;
        }
        var param = {
            userData:{
                userID: app.personal.info.userID,
                kitID:this.props.kitID,
                imageArray: netUrlImages||[],
                audioArray: uploadVoices||[],
            },
        };
        POST(app.route.ROUTE_SUBMIT_KIT, param, this.submitKitSuccess, true);
    },
    submitKitSuccess(data) {
        Toast(data.msg);
        if (data.success) {
            this.props.updateCaseList(this.props.kitID);
            app.navigator.pop();
        }
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
    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <HeaderView  message={this.props.toKitDetail}/>
                      <View style={styles.imageUpside}>
                          <View style={styles.imageStyleView}>
                              <DelayTouchableOpacity
                                  activeOpacity={0.6}
                                  onPress={this.showPohotoImg}>
                                  <View  style={styles.imageButtonView}>
                                      <Image source={app.img.actualCombat_logo_alone} style={styles.imagelogostyle} />
                                      <Text style={styles.textlogotile} >点击添加图片</Text>
                                  </View>
                              </DelayTouchableOpacity>
                              <ScrollView horizontal={true} style={styles.imageContainer}>
                                  {
                                      this.state.localUrlImages&&this.state.localUrlImages.map((item, i)=>{
                                          return (
                                              <TouchableOpacity
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
                                              </TouchableOpacity>
                                          )
                                      })
                                  }
                              </ScrollView>
                          </View>
                      </View>
                      <View style={styles.voiceUpside}>
                          <View style={styles.voiceStyleView}>
                              <TouchableOpacity onPress={this.showRecordMessageBox} style={styles.voiceButtonView}>
                                  <Image source={app.img.actualCombat_voice_icon2} style={styles.voiceStyle} />
                              </TouchableOpacity>
                          </View>
                          <ScrollView horizontal={true}  style={[styles.imageContainer, {marginLeft:10}]}>
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
                    <Button
                        style={styles.btnStyle}
                        onPress={this.submitKit}
                        textStyle={styles.btnText}>
                        提交
                    </Button>
                    {!CONSTANTS.ISSUE_IOS&&
                        <View style={styles.divisionContainer}>
                            <View style={styles.separator}/>
                            <Text style={{fontSize: 12, fontWeight: '400', color: '#b4b4b4'}}>觉得自己不足.或者你也可以</Text>
                            <View style={styles.separator}/>
                        </View>
                    }
                    <View style={styles.divisionGoContainer}>
                        <View style={{flexDirection:'row'}}>
                            <Button
                                onPress={this.goStudy}
                                style={styles.btnStyle2}
                                textStyle={styles.gobtnText}
                                >去学习场深造
                            </Button>
                            <Button
                                onPress={this.goTrain}
                                style={styles.btnStyle3}
                                textStyle={styles.gobtnText}
                                >去训练场PK
                            </Button>
                        </View>
                    </View>
                </ScrollView>
                {
                    this.state.overlayShowMessageBox &&
                    <RecordVoiceMessageBox
                        showType={0}
                        doStartRecord={this.recordVoice}
                        doGiveup={this.doGiveup}
                        doConfirm={this.stopRecordVoice}>
                    </RecordVoiceMessageBox>
                }
                {
                    this.state.overlayShowLongPressMessageBox &&
                    <VoiceLongPressMessageBox
                        doUseLoudSpeaker={this.doUseLoudSpeaker}
                        doDelete={this.doDelete}
                        doBack={this.doBack}>
                    </VoiceLongPressMessageBox>
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
    },
    topContainer: {
        backgroundColor: '#EEEEEE',
    },
    titleContainer: {
        backgroundColor: '#bf9f62',
        width: sr.w,
        height: 29,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 16,
        color: 'white',
        fontWeight: '500',
        alignSelf:'center',
    },
    detailContainer: {
        paddingVertical: 8,
        backgroundColor: '#FFFFFF',
    },
    deteContainer: {
        marginHorizontal: 10,
        flexDirection: 'row',
        width: sr.w-20,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    contextTextTime: {
        fontSize: 11,
        color: '#555555',
    },
    rightTitle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCount: {
        marginRight: 5,
        width: 12,
        height: 12,
    },
    describeText: {
        fontWeight: '500',
        color: CONSTANTS.THEME_COLOR,
    },
    deteContainer1: {
        marginHorizontal: 10,
        width: sr.w-20,
        justifyContent: 'center',
        marginTop: 10,
    },
    contextText: {
        fontSize: 14,
        color: '#555555',
    },
    imageUpside:{
        marginTop: 16,
        backgroundColor:'#FFFFFF',
    },
    imageStyleView: {
        height: 142,
        alignItems: 'center',
        flexDirection:'row',
    },
    textlogotile:{
        fontSize: 12,
        marginTop:10,
        textAlign:'center',
        color :'#848484',
    },
    bigImageTouch: {
        flexDirection: 'row',
        width: 100,
        height: 100,
        marginHorizontal: 2,
    },
    voiceUpside: {
        height: 47,
        marginTop: 16,
        flexDirection:'row',
        backgroundColor:'#FFFFFF',
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
    divisionContainer: {
        flexDirection: 'row',
        marginHorizontal: 30,
        alignItems: 'center',
        alignSelf: 'center',
    },
    divisionGoContainer: {
        flexDirection: 'row',
        marginTop:35,
        marginBottom: 50,
        alignItems: 'center',
        alignSelf: 'center',
    },
    gobtnText: {
        fontSize: 16,
        fontWeight: '500',
        color:'#FFFFFF',
    },
    separator: {
        height: 1.2,
        width:50,
        paddingHorizontal :10,
        alignSelf: 'center',
        backgroundColor: '#b4b4b4',
    },
    btnStyle: {
        height:45,
        borderRadius:6,
        marginTop: 50,
        marginBottom: 38,
        marginHorizontal: 10,
        justifyContent: 'space-around',
        backgroundColor: CONSTANTS.THEME_COLOR,
    },
    btnStyle2: {
        height:35,
        width:120,
        marginRight:15,
        backgroundColor: '#c1974b',
        justifyContent: 'space-around',
        borderRadius:8,
    },
    btnStyle3: {
        height:35,
        width:120,
        marginLeft:15,
        backgroundColor: '#262626',
        justifyContent: 'space-around',
        borderRadius:8,
    },
    btnText: {
        fontSize: 18,
        fontWeight: '500',
        color:'#FFFFFF',
    },
    imageContainer: {
        flexDirection: 'row',
        marginLeft:10,
    },
    imageButtonView: {
        height: 105,
        width:105,
        marginLeft:10,
        backgroundColor:'#eeeeee',
    },
    imagelogostyle: {
        width: 30,
        height: 30,
        marginHorizontal:35,
        marginTop:20,
    },
    imageStyletu: {
        width: 100,
        height: 100,
        marginRight: 10,
    },
    audioContainer: {
        width: 70,
        height:47,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection:'row',
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
    textTime:{
        fontSize: 12,
        textAlign: 'left',
        color :'gray',
    },
});
