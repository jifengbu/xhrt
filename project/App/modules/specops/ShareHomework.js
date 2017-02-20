'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
    Text,
    Image,
    Modal,
    TextInput,
    ScrollView,
    Keyboard,
    TouchableHighlight,
    TouchableOpacity,
} = ReactNative;

var dismissKeyboard = require('dismissKeyboard');
var UmengMgr = require('../../manager/UmengMgr.js');
var Umeng = require('../../native/index.js').Umeng;
var EditInformationBox = require('../person/EditInformationBox.js');
var {MessageBox} = COMPONENTS;

module.exports = React.createClass({
    statics: {
        title: '课后作业',
    },
    getInitialState() {
        var _scrollView: ScrollView;
        this.scrollView = _scrollView;
        return {
            inputText: '',
            taskID: '',
            userTaskID: '',
            videoID: '',
            taskName: '',
            showMessageBox: false,
            isShare: false,
            isFirstTap: true,//用来显示提示语
            isKeyboard: false,
            isSummit: false,//是否提交作业
        };
    },
    componentDidMount() {
        let {taskContent,taskID,userTaskID,videoID,taskName} = this.props.data;
        if (taskContent) {
            this.setState({inputText: taskContent, isFirstTap: false,userTaskID,isShare:true});
        }
        if (taskID) {
            this.setState({taskID,taskName});
        } else {
            this.setState({showMessageBox: true});
        }
        if (videoID) {
            this.setState({videoID});
        }
    },
    componentWillMount: function() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    },
    componentWillUnmount: function() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    },
    _keyboardDidShow () {
        this.setState({isKeyboard: true});
    },
    _keyboardDidHide () {
        this.setState({isKeyboard: false});
    },
    changKeyboard() {
        this.setState({isKeyboard: true});
        setTimeout(()=>{
            this.commentInput.focus();
        }, 300);
    },
    goBack () {
        dismissKeyboard();
        app.showModal(
            <EditInformationBox
                doConfirm={this.doConfirm}
                title={'是否放弃对作业的编辑'}
                />
        );
    },
    doBack() {
        app.navigator.pop();
    },
    doConfirm() {
        app.getCurrentRoute().leftButton = { handler: ()=>{app.scene.doBack()}};
        app.getCurrentRoute().rightButton = { };
        app.forceUpdateNavbar();
        let {taskContent} = this.props.data;
        if (!taskContent && !this.state.isSummit) {
            this.setState({isShare: false, isFirstTap: true});
            this.setState({inputText: ''});
        } else {
            this.setState({isShare: true,isFirstTap: false});
        }
        if (taskContent) {
            this.setState({inputText: taskContent});
        }
    },
    toSave() {
        let {inputText,taskID} = this.state;
        //提交数据
        if (!inputText) {
            Toast('提交失败，请填写内容');
            return;
        }
        if (inputText.length < 120) {
            Toast('提交失败，作业内容不得少于120字');
            return;
        }
        var param = {
            userID: app.personal.info.userID,
            taskID: taskID,
            content: inputText,
        };
        POST(app.route.ROUTE_SUBMIT_SPECIAL_SOLDIER_TASK, param, this.submitSpecialSoldierTaskSuccess, true);
    },
    submitSpecialSoldierTaskSuccess(data) {
        if (data.success) {
            Toast('提交作业成功');
            this.setState({userTaskID:data.context.specopsUserTask.id,isShare:true, isSummit: true});
            app.getCurrentRoute().leftButton = { handler: ()=>{app.scene.doBack()}};
            app.getCurrentRoute().rightButton = { };
            app.forceUpdateNavbar();
            dismissKeyboard();
        }else {
            Toast(data.msg);
        }
    },
    doShare (item) {
      //0,1,2分别表示微信，朋友圈，QQ
      let {inputText,taskID,userTaskID} = this.state;
      if (!inputText) {
          Toast('内容为空');
          return;
      }
      let platform;
      switch (item) {
          case 0:
              platform = Umeng.platforms.UMShareToWechatSession;
              break;
          case 1:
              platform = Umeng.platforms.UMShareToWechatTimeline;
              break;
          case 2:
              platform = Umeng.platforms.UMShareToQQ;
              break;
          default:
              Toast('未知分享');
              return;
      }
      let info = app.personal.info;
      var data = 'homeworkID='+userTaskID;
      var desc = '特种兵：'+info.name+' /'+inputText;
      var dataEncode = encodeURI(data);
      UmengMgr.doSingleShare(platform,CONSTANTS.SHARE_SHAREDIR_SERVER+'shareAssignment.html?'+dataEncode,'特种兵我的周任务',desc,'web',CONSTANTS.SHARE_IMGDIR_SERVER+'homework.png',this.doShareCallback.bind(null,userTaskID));
      this.shareBack(userTaskID);
    },
    doShareCallback(userTaskID) {
        this.shareBack(userTaskID);
    },
    shareBack(userTaskID) {
        var param = {
            userID: app.personal.info.userID,
            shareType: 1,
            objID: userTaskID,
        };
        POST(app.route.ROUTE_SHARE_LOG, param, this.shareBackSuccess, true);
    },
    shareBackSuccess(data) {
    },
    changeShow(item) {
        this.setState({isFirstTap: false});
        this.onFocus();
    },
    changeTab() {
        dismissKeyboard();
        if (!this.state.inputText) {
            this.setState({isFirstTap: true});
        }
    },
    onFocus() {
        this.setState({isShare: false});
        app.getCurrentRoute().rightButton = { title: '保存', delayTime:1, handler: ()=>{app.scene.toSave()}};
        app.getCurrentRoute().leftButton = { title: '取消', delayTime:1, handler: ()=>{app.scene.goBack()}};
        app.forceUpdateNavbar();
        this.changKeyboard();
    },
    cancelBox() {
        app.navigator.pop();
        this.setState({showMessageBox: false});
    },
    calculateStrLength(oldStr, strCount) {
        let height = 0;
        let linesHeight = 0;
        if (oldStr) {
            oldStr = oldStr.replace(/<\/?.+?>/g,/<\/?.+?>/g,"");
            oldStr = oldStr.replace(/[\r\n]/g, '|');
            let StrArr = oldStr.split('|');
            for (var i = 0; i < StrArr.length; i++) {
                //计算字符串长度，一个汉字占2个字节
                let newStr = StrArr[i].replace(/[^\x00-\xff]/g,"aa").length;
                //计算行数
                if (newStr == 0) {
                    linesHeight = 1;
                } else {
                    linesHeight = Math.ceil(newStr/sr.ws(strCount));
                }
                //计算高度，每行18
                height += linesHeight*sr.ws(18);
            }
            return height+sr.ws(18);
        } else {
            return 18;
        }
    },
    render() {
        let {isShare,isKeyboard,heightIntroduce} = this.state;
        let titleHeight = this.calculateStrLength(this.state.taskName, 42);
        let comHeight = this.calculateStrLength(this.state.inputText, 42);
        let textHeight = 0;
        let isHeight = true;
        if (isShare) {
            if (comHeight < sr.ch - titleHeight -212) {
                textHeight = sr.ch - titleHeight -212;
                isHeight = true;
            } else {
                isHeight = false;
            }
        } else {
            if (comHeight < sr.ch - titleHeight -66) {
                textHeight = sr.ch - titleHeight -66;
                isHeight = true;
            } else {
                isHeight = false;
            }
        }

        const titles = ['微信好友','朋友圈','QQ'];
        const images = [app.img.specops_wechat,app.img.specops_friend_circle,app.img.specops_qq];
        return (
            <ScrollView ref={(scrollView) => { this.scrollView = scrollView}} scrollEnabled={true}>
            <View style={styles.container}>
                    <View style={styles.topLine}/>
                    {
                        !isKeyboard&&
                        <View style={styles.topView}>
                            <Text style={styles.textTitle} >
                                {'题目：'+this.state.taskName}
                            </Text>
                        </View>
                    }
                    <View style={!isShare&&isKeyboard?styles.midEditView:styles.midView}>
                        {
                            !isShare&&isKeyboard?
                            <TextInput
                                ref={(ref)=>this.commentInput = ref}
                                style={styles.textStyle}
                                onChangeText={(text) => this.setState({inputText: text})}
                                onBlur={this.changeTab}
                                multiline={true}
                                placeholder={'您学习完课程有什么收获吗？是否有应用到实际场景中去呢？快来总结你的收获吧，不得少于120字。'}
                                placeholderTextColor={'#AEAEAE'}
                                underlineColorAndroid={'transparent'}
                                defaultValue={this.state.inputText}
                                />:
                            <Text onPress={isShare?this.onFocus:this.changKeyboard} style={[styles.textView,isHeight?{height: textHeight}:null]}>{this.state.inputText}</Text>

                        }
                        {
                            this.state.isFirstTap&&
                            <TouchableHighlight
                                onPress={this.changeShow}
                                style={styles.tabTouch}>
                                <Text style={styles.warningTitle} >
                                    {'轻按填写学习心得体会'}
                                </Text>
                            </TouchableHighlight>
                        }
                    </View>
                    {
                        isShare&&
                        <View style={styles.lineView}>
                            <View style={styles.lineStyle}>
                            </View>
                            <Text
                                numberOfLines={1}
                                style={styles.titleStyle} >
                                {'分享我的作业'}
                            </Text>
                            <View style={styles.lineStyle}>
                            </View>
                        </View>
                    }
                    {
                        isShare&&
                        <View style={styles.bottomView}>
                            <View style={styles.btnView}>
                                {
                                    titles.map((item, i)=>{
                                        return (
                                            <TouchableHighlight
                                                key={i}
                                                underlayColor="rgba(0, 0, 0, 0)"
                                                onPress={this.doShare.bind(null, i)}
                                                style={styles.btnTouch}>
                                                <View style={styles.btnTouch}>
                                                    <Image
                                                        resizeMode='stretch'
                                                        source={images[i]}
                                                        style={styles.imageStyle}>
                                                    </Image>
                                                    <Text numberOfLines={1} style={styles.btnTitle} >
                                                        {titles[i]}
                                                    </Text>
                                                </View>
                                            </TouchableHighlight>
                                        )
                                    })
                                }
                            </View>
                        </View>
                    }

                {
                    this.state.showMessageBox &&
                    <MessageBox
                        content="该视频没有课堂作业!"
                        doConfirm={this.cancelBox}
                        />
                }

            </View>
            </ScrollView>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0EFF5',
    },
    topLine: {
        height: 1,
        width: sr.w,
        backgroundColor: '#E0E0E0'
    },
    topView: {
        width: sr.w,
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textTitle: {
        fontSize: 14,
        fontFamily: 'STHeitiSC-Medium',
        color: '#4B4B4B',
        width: sr.w-40,
    },
    midView: {
        width: sr.w-20,
        flex: 1,
        marginLeft: 10,
        borderRadius: 2,
        backgroundColor: '#FFFFFF',
    },
    midEditView: {
        width: sr.w-20,
        height: sr.ch - 284,
        borderRadius: 2,
        marginLeft: 10,
        backgroundColor: '#FFFFFF',
    },
    textStyle: {
        flex: 1,
        margin: 10,
        fontSize: 14,
        paddingVertical: 2,
        fontFamily: 'STHeitiSC-Medium',
        color: '#4B4B4B',
        textAlignVertical: 'top',
        backgroundColor: '#FFFFFF'
    },
    textView: {
        margin: 10,
        fontSize: 14,
        fontFamily: 'STHeitiSC-Medium',
        color: '#4B4B4B',
        backgroundColor: '#FFFFFF'
    },
    tabTouch: {
        position:'absolute',
        left: 0,
        top: 0,
        width: 356,
        height: 340,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    lineView: {
        height: 65,
        width: sr.w,
        flexDirection: 'row',
        alignItems: 'center',
    },
    lineStyle: {
        height: 1,
        flex: 1,
        borderRadius: 1,
        marginHorizontal: 5,
        backgroundColor: '#C5C5C5',
    },
    titleStyle: {
        fontSize: 14,
        fontFamily: 'STHeitiSC-Medium',
        color: '#5D5D5D',
    },
    warningTitle: {
        fontSize: 14,
        fontFamily: 'STHeitiSC-Medium',
        color: '#B0B0B0',
    },
    bottomView: {
        height: 107,
        width: sr.w,
    },
    btnView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
    },
    imageStyle: {
        width: 48,
        height: 48,
    },
    btnTouch: {
        width: 88,
        height: 88,
        alignItems: 'center',
    },
    btnTitle: {
        fontSize: 14,
        marginTop: 8,
        fontFamily: 'STHeitiSC-Medium',
        color: '#393939',
    },
});
