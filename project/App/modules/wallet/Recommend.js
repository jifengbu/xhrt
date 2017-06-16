'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    CameraRoll,
    ScrollView,
} = ReactNative;

const RecommendList = require('./RecommendList.js');
const PersonInfo = require('../person/PersonInfo.js');
const UmengMgr = require('../../manager/UmengMgr.js');
const Umeng = require('../../native/index.js').Umeng;
const ImgFileMgr = require('../../manager/ImgFileMgr.js');

const { QRCode, ShareSheet,ActionSheet} = COMPONENTS;
import { takeSnapshot,dirs } from "react-native-view-shot";
const fs = require('react-native-fs');
const { DownloadDir, CacheDir} = dirs;
var saveDir = app.isandroid?DownloadDir:CacheDir;

import QRCodeView from 'react-native-qrcode';

module.exports = React.createClass({
    statics: {
        title: '推荐大使',
        color: '#FFFFFF',
        leftButton: { image: app.img.common_back, handler: () => { app.scene.goBack(); } },
        rightButton: { title: '邀请记录', smallTitle: true, delayTime:1, handler: () => { app.scene.toggleEdit(); } },
    },
    getInitialState () {
        this.shardFileUrl = '';
        this.thumbUrl = '';
        return {
            isShowAll: false,
            actionSheetVisible: false,
            actionVisible: false,
            shwoQRcode: false,
            imgFilePath: '',
            QRCodeWidth: 100,
            QRCodeHeight: 100,
            showQRcode2: false,
            QRImgFilePath: '',
            showShard: true,
            showSave: false,
        };
    },
    uploadShardBk (filePath, bkUrl) {
        const options = {};
        options.fileKey = 'file';
        options.fileName = filePath.substr(filePath.lastIndexOf('/') + 1);
        options.mimeType = 'jpeg';
        options.params = {
            userID:app.personal.info.userID,
        };
        UPLOAD(filePath, app.route.ROUTE_UPDATE_FILE, options, (progress) => console.log(progress),
        this.uploadShardBkSuccess.bind(null, bkUrl), this.uploadShardBkError);
    },
    uploadShardBkSuccess (bkUrl, data) {
        console.log('uploadShardBkSuccess', data.context);
        if (data.success) {
            this.shardFileUrl = data.context.url;
            ImgFileMgr.saveImgFile(bkUrl+'shardJpeg', this.shardFileUrl);
        } else {
            this.shardFileUrl = '';
        }
    },
    uploadShardBkError () {
        this.shardFileUrl = '';
    },
    showAll () {
        this.setState({isShowAll: !this.state.isShowAll});
    },
    goBack () {
        if (this.props.comeRecommend) {
            const routes = app.navigator.getCurrentRoutes();
            app.navigator.popToRoute(routes[1]);
        } else {
            app.navigator.pop();
        }
    },
    toggleEdit () {
        app.navigator.push({
            component: RecommendList,
        });
    },
    componentWillMount () {
        app.updateNavbarColor('#DE3031');
    },
    componentDidMount(){
        let QRFilePath = ImgFileMgr.getLocalImgFilePath(app.personal.info.userID);
        let needUpdate = false;
        if (QRFilePath != '') {
            QRFilePath = 'file://' + QRFilePath;
        }else {
            needUpdate = true;
        }
        this.setState({QRImgFilePath:QRFilePath});

        // console.log('-----------', app.personal.info.extensionImg);

        let filePath = ImgFileMgr.getLocalImgFilePath(app.personal.info.extensionImg);
        if (filePath != '') {
            filePath = 'file://' + filePath;
        }
        this.setState({imgFilePath:filePath});

        // if (needUpdate == false) {
        //     this.shardFileUrl = ImgFileMgr.getLocalImgFilePath(app.personal.info.extensionImg+'shardJpeg');
        // }else {
        //     this.shardFileUrl = '';
        // }

        if (QRFilePath=='') {
            setTimeout(()=>{
                app.showProgressHUD();
                this.setState({showQRcode2:true});
            }, 200);
            setTimeout(()=>{
                app.dismissProgressHUD();
                this.setState({shwoQRcode:true});
            }, 3000);
            setTimeout(()=>{
                this.saveQRcode();
            }, 3500);
        }else {
            this.setState({shwoQRcode:true});
        }
        setTimeout(()=>{
            takeSnapshot(this.refs.Snapshot, {format: 'jpeg', quality: 0.2,result:"file",width:30,height:55,path:saveDir+'/qrcodeShareThumb.jpeg'})
            .then((uri) => {
                this.thumbUrl = uri;
            })
        }, 8000);
        if (this.shardFileUrl == '') {
            setTimeout(()=>{
                takeSnapshot(this.refs.Snapshot, {format: 'jpeg', quality: 0.4,result:"file",width:750,height:1334,path:saveDir+'/qrcodeShare.jpeg'})
                .then((uri) => {
                    this.uploadShardBk(saveDir+'/qrcodeShare.jpeg', app.personal.info.extensionImg);
                })
            }, 8000);
        }
    },
    onWillFocus () {
        app.updateNavbarColor('#DE3031');
    },
    doShowActionSheet () {
        this.setState({ showShard:true });
        this.setState({ showSave:false });
        this.setState({ actionVisible:false });

        setTimeout(()=>{
            this.setState({ actionSheetVisible:true });
        }, 600);
    },
    doCloseActionSheet () {
        this.setState({ actionSheetVisible:false });
    },
    doShowSheet () {
        this.setState({ showShard:false });
        this.setState({ showSave:true });
        this.setState({ actionSheetVisible:false });

        setTimeout(()=>{
            this.setState({ actionVisible:true });
        }, 600);
    },
    doCloseSheet () {
        this.setState({ actionVisible:false });
    },
    doShareWeChat () {
        this.doShare(0);
    },
    doShareTimeline () {
        this.doShare(1);
    },
    doShareQQ () {
        this.doShare(2);
    },
    doShare (index) {
        let platform;
        switch (index) {
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
        if (app.isandroid) {
            if (this.shardFileUrl == '') {
                // Toast('this.shardFileUrl is null');
                takeSnapshot(this.refs.Snapshot, {format: 'jpeg', quality: 0.2,result:"file",width:60,height:110,path:saveDir+'/qrcodeShareThumb.jpeg'})
                .then((uri) => {
                    let thumbUrl = uri;
                    // UmengMgr.doSingleShare(platform,null, '二维码分享', '二维码分享', 'image', app.personal.info.extensionImg, this.doShareCallback);
                    takeSnapshot(this.refs.Snapshot, {format: 'jpeg', quality: 0.2,result:"file",width:375,height:667,path:saveDir+'/qrcodeShare.jpeg'})
                    .then((uri) => {
                            UmengMgr.doSingleShare(platform,null, '二维码分享', '二维码分享', 'image', uri, this.doShareCallback, thumbUrl);
                    })
                })
            }else {
                if (this.thumbUrl == '') {
                    takeSnapshot(this.refs.Snapshot, {format: 'jpeg', quality: 0.2,result:"file",width:60,height:110,path:saveDir+'/qrcodeShareThumb.jpeg'})
                    .then((uri) => {
                        this.thumbUrl = uri;
                        UmengMgr.doSingleShare(platform,null, '二维码分享', '二维码分享', 'image', this.shardFileUrl, this.doShareCallback, this.thumbUrl);
                    })
                }else {
                    UmengMgr.doSingleShare(platform,null, '二维码分享', '二维码分享', 'image', this.shardFileUrl, this.doShareCallback, this.thumbUrl);
                }
            }
        }else {
            takeSnapshot(this.refs.Snapshot, {format: 'jpeg', quality: 0.2,result:"file",width:750,height:1334,path:saveDir+'/qrcodeShare.jpeg'})
            .then((uri) => {
                fs.readFile(uri, 'base64')
                .then((content) => {
                    var imgData = 'data:image/jpeg;base64,'+content;
                    // console.log('>>>>>>',imgData);
                    UmengMgr.doSingleShare(platform,null, '二维码分享', '二维码分享', 'image', imgData, this.doShareCallback);
                })
            })
        }
    },
    doShareCallback () {
        this.doCloseActionSheet();
    },
    saveImg() {
        if (this.state.actionVisible == false) {
            return;
        }
        if (app.isandroid) {
            takeSnapshot(this.refs.Snapshot, {format: 'jpeg', quality: 0.9,result:"file",width:750,height:1334,path:saveDir+'/qrcodeShare.jpeg'})
            .then((uri) => {
                Toast('图片已保存至:'+saveDir+'/qrcodeShare.jpeg');
            }).catch((error) => {
                Toast('保存失败！')}
            );
        } else {
            takeSnapshot(this.refs.Snapshot, {format: 'jpeg', quality: 0.9,result:"file",width:750,height:1334,path:saveDir+'/qrcodeShare.jpeg'})
            .then((uri) => {
                fs.readFile(uri, 'base64')
                .then((content) => {
                    console.log("content:",content);
                    var imgData = 'data:image/jpeg;base64,'+content;
                    CameraRoll.saveToCameraRoll(imgData)
                        .then(function(result) {
                          Toast('保存成功！');
                        }).catch(function(error) {
                          Toast('保存失败！');
                        });
                }).catch((error) => {
                  console.log('readFile error>>>' + error);
                });
            })
            .catch(
                (error) => console.log("<<<<<takeSnapshot error",error)
            );
        }
        this.doCloseSheet();
    },
    saveQRcode() {
        let filePath = ImgFileMgr.getFilePath();
        takeSnapshot(this.refs.QRcodeImg, {format: 'png', quality: 1,result:"file",
                    width:sr.ws(this.state.QRCodeWidth+10),height:sr.ws(this.state.QRCodeHeight+10),path:filePath})
        .then((uri) => {
            console.log('保存成功！');
            ImgFileMgr.saveImgFile(app.personal.info.userID, filePath);
        }).catch((error) => {
            console.log('保存失败！')}
        );
    },
    onGetWidthAndHeight(width, height){
        this.setState({QRCodeWidth: width, QRCodeHeight: height});
    },
    render () {
        let qrParam={};
        qrParam.errorCorrectLevel = 0;
        qrParam.typeNumber = -1;
        let {isShowAll} = this.state;
        let { feeQRCode } = this.props;
        let comments = ['      很骄傲你成为了一名优秀的特种兵，成为我们的推荐大使，将知识传递给身边的朋友，邀请你的朋友加入特种兵和你一起成长！',
                        '      每邀请1人通过你的邀请码购买特种兵账号，立得80元现金。通过你的链接购买你的小伙伴也能立减20元现金。'];
        let titles = ['亲爱的特种兵你好！','推荐大使特有福利'];
        let shareUrl = CONSTANTS.SHARE_SHAREDIR_SERVER+'goodsdetail.html?feeQRCode='+feeQRCode;
        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.imgText}>{this.state.shwoQRcode?'长按图片保存到相册':''}</Text>
                <Image
                    resizeMode='stretch'
                    source={app.img.wallet_qrcode_bg}
                    style={[styles.img_iconBG, {height:this.state.shwoQRcode?sr.ws(506):0}]}>
                <TouchableOpacity activeOpacity={1} onLongPress={this.doShowSheet}>
                    <View ref='Snapshot' collapsable={false} style={[styles.img_icon, {height:this.state.shwoQRcode?sr.ws(490):0,marginTop:2}]}>
                        <Image
                            resizeMode='stretch'
                            source={this.state.imgFilePath!=''?{uri:this.state.imgFilePath}:app.img.wallet_QRcode}
                            style={[styles.img_icon, {height:this.state.shwoQRcode?sr.ws(490):0}]}>
                            <View style={styles.QRcodeFView}>
                                <Image resizeMode='stretch' source={app.img.wallet_QRcode_ys} style={
                                        {
                                            width: sr.ws(this.state.QRCodeWidth+32),
                                            height: sr.ws(this.state.QRCodeHeight+36),
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                        {
                                            this.state.QRImgFilePath=='' &&
                                            <View ref='QRcodeImg' collapsable={false} style={
                                                {
                                                    width: sr.ws(this.state.QRCodeWidth+10),
                                                    height: sr.ws(this.state.QRCodeHeight+10),
                                                    marginBottom: sr.ws(12),
                                                    marginLeft: sr.ws(1),
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    backgroundColor: '#FFFFFF',
                                                }
                                            }>
                                            {
                                                // this.state.showQRcode2 &&
                                                // <QRCode
                                                //     text={shareUrl}
                                                //     colorDark='black'
                                                //     width={sr.ws(this.state.QRCodeWidth)}
                                                //     height={sr.ws(this.state.QRCodeHeight)}
                                                //     />
                                                this.state.showQRcode2 &&
                                                <QRCodeView
                                                    value={shareUrl}
                                                    size={sr.ws(this.state.QRCodeWidth)}
                                                    level={qrParam}
                                                    />
                                            }
                                            </View>
                                        }
                                        {
                                            this.state.QRImgFilePath!='' &&
                                            <Image
                                                resizeMode='stretch'
                                                source={{uri:this.state.QRImgFilePath}}
                                                style={
                                                    {
                                                        width: sr.ws(this.state.QRCodeWidth+10),
                                                        height: sr.ws(this.state.QRCodeHeight+10),
                                                        marginBottom: sr.ws(12),
                                                        marginLeft: sr.ws(1),
                                                    }
                                                } />
                                        }
                                    </Image>
                                    <Text numberOfLines={1} style={styles.QRcode_text}>
                                        {`我是：${app.personal.info.name}`}
                                    </Text>
                                </View>
                            </Image>
                        </View>
                    </TouchableOpacity>
                </Image>
                <TouchableOpacity
                    onPress={this.doShowActionSheet}
                    style={[styles.img_containerView, {height:this.state.shwoQRcode?sr.ws(28):0}]}>
                    <Image
                        resizeMode='stretch'
                        source={app.img.wallet_share_btn}
                        style={[styles.img_container, {height:this.state.shwoQRcode?sr.ws(28):0}]} />
                </TouchableOpacity>
                <View style={{height: app.isandroid?60:0, backgroundColor: 'transparent', width: sr.w}} />
                </ScrollView>
                <View style={[styles.action_style,{height: isShowAll?sr.ws(288):this.state.shwoQRcode?sr.ws(60):0,}]}>
                    <View style={styles.topView}>
                        <Text style={styles.notice_text}>
                            {'二维码使用说明'}
                        </Text>
                        <TouchableOpacity style={styles.btn_style} onPress={this.showAll}>
                            <Text style={styles.btn_text}>
                                {'了解详情'}
                            </Text>
                            <Image
                                resizeMode='stretch'
                                source={app.img.common_go}
                                style={[styles.img_go,{transform:[{ rotate: isShowAll?'90deg':'-90deg' }],}]} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.line1}/>
                    {
                        isShowAll&&
                        <View style={styles.message}>
                            {
                                comments.map( (item, i) => {
                                    return (
                                        <View key={i} style={styles.detail}>
                                            {
                                                i != 0 &&
                                                <View style={styles.line}/>
                                            }
                                            <View style={styles.title_view}>
                                                <View style={styles.icon_view}>
                                                </View>
                                                <Text style={styles.title_text}>{titles[i]}</Text>
                                            </View>
                                            <Text style={styles.comment}>{item}</Text>
                                        </View>
                                    );
                                })
                            }
                        </View>

                    }
                </View>
                {
                    (this.state.showShard && this.state.showSave==false)&&
                    <ShareSheet
                        visible={this.state.actionSheetVisible}
                        onCancel={this.doCloseActionSheet} >
                        <ShareSheet.Button image={app.img.specops_wechat} onPress={this.doShareWeChat}>微信好友</ShareSheet.Button>
                        <ShareSheet.Button image={app.img.specops_friend_circle} onPress={this.doShareTimeline}>朋友圈</ShareSheet.Button>
                        <ShareSheet.Button image={app.img.specops_qq} onPress={this.doShareQQ}>QQ</ShareSheet.Button>
                    </ShareSheet>
                }
                {
                    (this.state.showShard==false && this.state.showSave)&&
                    <ActionSheet
                        visible={this.state.actionVisible}
                        cancelText='返   回'
                        onCancel={this.doCloseSheet} >
                        <ActionSheet.Button style={styles.btnStyle} onPress={this.saveImg}>保存到相册</ActionSheet.Button>
                    </ActionSheet>
                }
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EEEEEE',
    },
    scrollContainer: {
        width: sr.w,
    },
    imgText: {
        color:"#d06061",
        marginTop: 9,
        alignSelf: 'center',
    },
    img_icon: {
        width: 280,
        height: 0,
        alignItems: 'center',
    },
    img_iconBG: {
        marginTop: app.isandroid?2:4,
        width: 296,
        height: 0,
        marginLeft: (sr.w-296)/2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    img_container: {
        height: 27,
        width: 85,
    },
    img_containerView: {
        position: 'absolute',
        left: sr.w*2/3-20,
        top: 48,
        height: 27,
        width: 85,
    },
    action_style: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: sr.w,
        backgroundColor: '#FFFFFF'
    },
    topView: {
        width: sr.w,
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF'
    },
    btn_style: {
        marginLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    notice_text: {
        marginLeft: 15,
        fontSize: 15,
        color: '#DE3031',
    },
    btn_text: {
        fontSize: 12,
        marginVertical: 5,
        color: '#909090',
    },
    QRcode_text: {
        marginTop: 2,
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '900',
        backgroundColor: 'transparent',
    },
    comment: {
        fontSize: 14,
        lineHeight: 20,
        marginHorizontal: 10,
        color: '#5b5b5b',
    },
    title_text: {
        fontSize: 14,
        marginHorizontal: 10,
        color: '#404040',
        fontWeight: '600'
    },
    img_go: {
        marginLeft: 3,
        marginRight: 15,
        width: 6,
        height: 9,
    },
    message: {
        width: sr.w,
        height: 240,
    },
    detail: {
        width: sr.w,
        height: 120,
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    line: {
        position: 'absolute',
        width: sr.w-20,
        left: 10,
        top: 0,
        height: 1,
        backgroundColor: '#eeeeee',
    },
    line1: {
        marginLeft: 10,
        width: sr.w-20,
        height: 1,
        backgroundColor: '#eeeeee',
    },
    title_view: {
        width: sr.w,
        height: 28,
        flexDirection: 'row',
    },
    icon_view: {
        width: 3,
        height: 15,
        marginLeft: 10,
        marginTop: app.isandroid?3:0,
        backgroundColor: '#DE3031',
    },
    QRcodeFView: {
        width: 160,
        height: 140,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 210,
    },
    QRCodeView: {
        width: 120,
        height: 120,
        marginTop: 12,
        marginLeft: 16,
    },
    QRCodeCtontainer: {
        width: 134,
        height: 138,
    },
});
