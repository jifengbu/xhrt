'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    Easing,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    TouchableHighlight,
} = ReactNative;

const Audio = require('@remobile/react-native-audio');
const ScoresInfoView = require('./ScoresInfoView.js');
const AidBigImage = require('./AidBigImage.js');
const { Button, DImage } = COMPONENTS;

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        title: '方案详情',
        leftButton: { handler: () => app.scene.goBack() },
    },
    goBack () {
        this.props.doRefresh();
        app.navigator.pop();
    },
    componentDidMount () {
        app.phoneMgr.toggleSpeaker(true);
        this.setState({ isSpeakerOn:app.phoneMgr.isSpeakerOn });
    },
    componentWillUnmount () {
        this.stopSpeak();
    },
    stopSpeak () {
        if (this.player) {
            this.player.stop();
            this.player.release();
            this.player = null;
            for (let i = 0; i < this.isPlaying.length; i++) {
                this.isPlaying[i] = false;
            }
            this.setState({ isPlaying: this.isPlaying });
        }
    },
    componentWillMount () {
        this.getList();
    },
    getList () {
        const param = {
            schemeID: this.props.schemeID,
            userID: app.personal.info.userID,
        };
        POST(app.route.ROUTE_GET_CASE_SCHEME_DETAIL, param, this.getListSuccess);
    },
    getListSuccess (data) {
        if (data.success) {
            this.isPlaying = _.fill(Array(data.context.audioArray.length), false);
            this.setState({ planDetail:data.context, isPlaying: this.isPlaying });
        } else {
            Toast(data.msg);
        }
    },
    getInitialState () {
        this.isPlaying = [];
        return {
            content: '',
            planDetail:{},
            isSpeakerOn:app.phoneMgr.isSpeakerOn,
            schemeDetail: this.props.schemeDetail,
            isPlaying: false,
            isTimeOut:'',
        };
    },
    doReadVoice (url, index) {
        if (!url || url === 'null') {
            Toast('音频地址为空');
            return;
        }
        if (this.player && this.isPlaying[index]) {
            this.player.stop();
            this.player.release();
            this.player = null;
            this.isPlaying[index] = false;
            this.setState({ isPlaying: this.isPlaying });
        } else {
            const tempIsPlaying = _.find(this.isPlaying, (item) => item == true);
            if (tempIsPlaying && tempIsPlaying != null) {
                if (this.player != null) {
                    this.player.stop();
                    this.player.release();
                }
                this.player = null;
                this.isPlaying[this.tempIndex] = false;
                this.setState({ isPlaying: this.isPlaying });
                this.player = new Audio(url, (error) => {
                    if (!error) {
                        this.isPlaying[index] = true;
                        this.setState({ isPlaying: this.isPlaying });
                        this.tempIndex = index;
                        this.player != null && this.player.play(() => {
                            this.player.release();
                            this.player = null;
                            this.isPlaying[index] = false;
                            this.setState({ isPlaying: this.isPlaying });
                        });
                    } else {
                        Toast('播放失败');
                    }
                });
            } else {
                this.player = new Audio(url, (error) => {
                    if (!error) {
                        this.isPlaying[index] = true;
                        this.setState({ isPlaying: this.isPlaying });
                        this.tempIndex = index;
                        this.player != null && this.player.play(() => {
                            this.player.release();
                            this.player = null;
                            this.isPlaying[index] = false;
                            this.setState({ isPlaying: this.isPlaying });
                        });
                    } else {
                        Toast('播放失败');
                    }
                });
            }
        }
    },
    toggleSpeaker () {
        app.phoneMgr.toggleSpeaker();
        this.setState({ isSpeakerOn:app.phoneMgr.isSpeakerOn });
        if (this.state.isSpeakerOn) {
            Toast('已经为你切换到扬声器');
        } else {
            Toast('已经为你切换到听筒');
        }
    },
    _onPress () {
        const param = {
            userID: app.personal.info.userID,
            kitID: this.props.schemeID,
            type: this.props.tabIndex,
        };
        POST(app.route.ROUTE_PARISE_KITS, param, this.praiseKitsSuccess);
    },
    praiseKitsSuccess (data) {
        if (data.success) {
            this.getList();
            if (this.state.planDetail.isPraise) {
                this.setState({ isTimeOut: '-1' });
            } else {
                this.setState({ isTimeOut: '+1' });
            }
        } else {
            Toast(data.msg);
        }
    },
    showBigImage (imageArray, index) {
        app.showModal(
            <AidBigImage
                doImageClose={app.closeModal}
                defaultIndex={index}
                defaultImageArray={imageArray} />
        );
    },
    goScore () {
        this.stopSpeak();
        app.navigator.push({
            component: ScoresInfoView,
            title:'打分',
            passProps: { schemeID: this.props.schemeID, theme: this.state.schemeDetail.title },
        });
    },
    render () {
        return (
            <View style={styles.container}>
                <View style={styles.contentstyle2}>

                    <View style={styles.lineupstyle}>
                        <View style={styles.themeStyle}>
                            <Text style={styles.Textstyle} >{'主题：' + this.state.schemeDetail.title}</Text>
                        </View>
                        <View style={styles.linestyle} />
                    </View>
                    <View style={styles.linedownstyle}>
                        <Text style={styles.TextstyleTime} >{'发布时间:' + this.state.schemeDetail.createTime}</Text>
                    </View>
                </View>
                <View style={styles.iconstyle}>
                    <DImage defaultSource={app.img.personal_head} source={{ uri: this.state.schemeDetail.publisherImg }} style={styles.imageiconstyle} />
                    <Text numberOfLines={1} style={styles.Textstyle1} >{this.state.schemeDetail.publisherName}</Text>
                </View>
                <View style={styles.scrollImageStyle}>
                    <ScrollView horizontal style={styles.imageContainer}>
                        {
                            this.state.planDetail.imageArray && this.state.planDetail.imageArray.map((item, i) => {
                                return (
                                    <TouchableHighlight key={i} underlayColor='rgba(0, 0, 0, 0)' onPress={this.showBigImage.bind(null, this.state.planDetail.imageArray, i)} style={styles.bigImageTouch}>
                                        <Image
                                            key={i}
                                            resizeMode='stretch'
                                            defaultSource={app.img.common_default}
                                            source={{ uri: item }}
                                            style={styles.imageStyle}
                                        />
                                    </TouchableHighlight>
                                );
                            })
                        }
                    </ScrollView>
                </View>
                <View style={styles.contentstyle1}>
                    <ScrollView style={styles.contentstyle2}>
                        {
                            this.state.planDetail.audioArray && this.state.planDetail.audioArray.map((item, i) => {
                                return (
                                    <View key={i} style={[styles.audioContainer]}>
                                        <Text style={styles.audioText} >
                                            {item.whenLong + "''"}
                                        </Text>
                                        <TouchableOpacity
                                            onPress={this.doReadVoice.bind(null, item.recordPath, i)}
                                            delayLongPress={1500}
                                            onLongPress={this.toggleSpeaker}
                                            style={styles.tabButton}>
                                            <View
                                                style={styles.audioPlay}>
                                                <Image
                                                    source={this.state.isPlaying[i] ? app.img.actualCombat_voice_playing : app.img.actualCombat_voice_play}
                                                    style={styles.imagevoice} />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                );
                            })
                        }
                    </ScrollView>
                </View>
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        onPress={this._onPress}
                        style={[styles.tabButton1, { backgroundColor:'#FFFFFF' }]}>
                        <Image source={this.state.planDetail.isPraise ? app.img.actualCombat_heart : app.img.actualCombat_heart2} style={styles.imagesstyle} />
                        <Text style={[styles.tabText, { color: CONSTANTS.THEME_COLOR }]} >{this.state.planDetail.praise}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.goScore}
                        style={[styles.tabButton1, { backgroundColor: CONSTANTS.THEME_COLOR }]}>
                        <Image source={app.img.actualCombat_mark} style={styles.imagesstyle} />
                        <Text style={[styles.tabText, { color:'#FFFFFF' }]} >去打分</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#EEEEEE',
    },
    contentstyle2: {
        width:sr.w,
    },
    contentstyle1: {
        marginVertical: 10,
        width:sr.w,
        backgroundColor: '#EEEEEE',
    },
    scrollImageStyle: {
        paddingVertical: 10,
        width:sr.w,
        height: 120,
        backgroundColor: '#FFFFFF',
    },
    tabContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width:sr.w,
        height: 50,
        backgroundColor: CONSTANTS.THEME_COLOR,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    tabButton: {
        marginHorizontal: 10,
        alignItems:'center',
        justifyContent:'center',
        flexDirection: 'row',
    },
    tabButton1: {
        flex: 1,
        margin: 2,
        alignItems:'center',
        justifyContent:'center',
        flexDirection: 'row',
    },
    tabText: {
        fontSize: 16,
    },
    tabTextAnimation1: {
        fontSize: 20,
        textAlign: 'right',
        color:'#FFFFFF',
    },
    imagesstyle:{
        width:27,
        height:27,
        marginRight:10,
    },
    imageiconstyle:{
        width:30,
        height:30,
        borderRadius: app.isandroid ? 30 * 4 : 15,
        borderWidth:1.5,
        borderColor:'#A60245',
    },
    imagevoice:{
        position:'absolute',
        right:10,
        top:5,
        width:17,
        height:22,
    },
    linestyle:{
        height:1,
        width: 285,
        marginTop: 15,
        marginRight: 10,
        backgroundColor:'#DDDDDD',
    },
    themeStyle: {
        width: sr.w,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#BE9451',
    },
    lineupstyle:{
        height: 55,
        width:sr.w,
    },
    linedownstyle:{
        height: 50,
        width:sr.w,
        backgroundColor: '#EEEEEE',
    },
    Textstyle: {
        fontSize: 16,
        color:'#FFFFFF',
    },
    audioText: {
        fontSize: 12,
        color:'gray',
    },
    Textstyle1: {
        width: 48,
        fontSize: 12,
        marginTop: 5,
        marginLeft: 3,
        color:'gray',
    },
    TextstyleTime: {
        fontSize: 12,
        marginTop:6,
        marginRight:10,
        color:'#555555',
        textAlign:'right',
    },
    iconstyle: {
        position: 'absolute',
        right: 0,
        top: 25,
        height:30,
        width: 80,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        flexDirection: 'row',
    },
    imageStyle: {
        width: 100,
        height: 100,
        marginRight: 10,
    },
    audioContainer: {
        width: sr.w,
        height:60,
        justifyContent: 'flex-end',
        flexDirection:'row',
        alignItems: 'center',
    },
    audioPlay: {
        height: 32,
        width: 80,
        borderRadius: 6,
        flexDirection:'row',
        backgroundColor: CONSTANTS.THEME_COLOR,
    },
    bigImageTouch: {
        flexDirection: 'row',
        flex: 1,
        marginHorizontal: 2,
    },
});
