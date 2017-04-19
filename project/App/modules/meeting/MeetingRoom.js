'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ListView,
    TextInput,
} = ReactNative;

const moment = require('moment');
const Subscribable = require('Subscribable');
const TimerMixin = require('react-timer-mixin');
const PromptMessageBox = require('../meeting/PromptMessageBox.js');
const { ProgressHud, Button, MessageBox, DImage } = COMPONENTS;

const RoundButton = React.createClass({
    render () {
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={this.props.onPress}
                >
                <Image
                    resizeMode='stretch'
                    source={this.props.image}
                    style={styles.roundButton}
                    />
            </TouchableOpacity>
        );
    },
});

module.exports = React.createClass({
    mixins: [Subscribable.Mixin, ProgressHud.Mixin, TimerMixin, SceneMixin],
    statics: {
        leftButton: { handler: () => app.scene.goBackPrompt() },
    },
    registerEvents (name) {
        this.addListenerOn(app.phoneMgr, name, (param) => {
            this[name](param);
        });
    },
    componentWillMount () {
        this.exit = false;
        app.phoneMgr.toggleSpeaker(true);
        this.registerEvents('EVENT_SERVER_INFO_ERROR');
        this.registerEvents('EVENT_CONNECT');
        this.registerEvents('EVENT_DISCONNECT');
        this.registerEvents('EVENT_MEET_UPDATE_USERLIST');
        this.registerEvents('EVENT_YOUR_ARE_KICKED');
    },
    goBack () {
        this.dismissProgressHUD();
        app.phoneMgr.closeSocket();
        app.navigator.pop();
    },
    EVENT_CONNECT (result) {
        if (!this.exit) {
            app.phoneMgr.joinMeetingRoom();
        }
    },
    EVENT_DISCONNECT (result) {
        this.exit = true;
        Toast('网络不稳定，请稍候重试');
        this.dismissProgressHUD();
        this.goBack();
    },
    EVENT_SERVER_INFO_ERROR (result) {
        Toast(result);
        this.goBack();
    },
    EVENT_YOUR_ARE_KICKED () {
        Toast('你已经被踢出了房间');
        this.goBack();
    },
    EVENT_MEET_UPDATE_USERLIST (result) {
        if (result && result.start) {
            this.dismissProgressHUD();
            if (this.intervalIDSy != null) {
                this.clearTimeout(this.intervalIDSy);
                this.intervalIDSy = null;
            }
        }
        const mgr = app.phoneMgr;
        const states = mgr.phone.meetChannelStates;
        const myUserID = app.personal.info.userID;
        const isAdmin = mgr.adminUserID == myUserID;

        const admin = _.find(mgr.competitors, (item) => mgr.adminUserID == item.userID);
        let myself = _.find(mgr.competitors, (item) => myUserID == item.userID);

        const speakers = _.filter(mgr.competitors, (item) => item.meetChannelState == states.MCAS_CHANNEL_MEET_STATE_SPEAKING);
        let listeners = _.filter(mgr.competitors, (item) => item.meetChannelState == states.MCAS_CHANNEL_MEET_STATE_LISTENING);
        const appliers = _.filter(mgr.competitors, (item) => item.meetChannelState == states.MCAS_CHANNEL_MEET_STATE_APPLYSPEAKING);
        this.speakingNumber = speakers.length;

        if (isAdmin) {
            if (admin) {
                if (admin.meetChannelState == states.MCAS_CHANNEL_MEET_STATE_SPEAKING) {
                    _.remove(speakers, (item) => mgr.adminUserID == item.userID);
                    speakers.unshift(admin);
                } else if (admin.meetChannelState == states.MCAS_CHANNEL_MEET_STATE_LISTENING) {
                    _.remove(listeners, (item) => mgr.adminUserID == item.userID);
                    listeners.unshift(admin);
                }
                myself = admin;
            }
        } else {
            if (myself.meetChannelState == states.MCAS_CHANNEL_MEET_STATE_SPEAKING) {
                _.remove(speakers, (item) => myUserID == item.userID);
                speakers.unshift(myself);
            } else if (myself.meetChannelState == states.MCAS_CHANNEL_MEET_STATE_LISTENING) {
                _.remove(listeners, (item) => myUserID == item.userID);
                listeners.unshift(myself);
            } else if (myself.meetChannelState == states.MCAS_CHANNEL_MEET_STATE_APPLYSPEAKING) {
                _.remove(appliers, (item) => myUserID == item.userID);
                appliers.unshift(myself);
            }
            if (admin) {
                if (admin.meetChannelState == states.MCAS_CHANNEL_MEET_STATE_SPEAKING) {
                    _.remove(speakers, (item) => mgr.adminUserID == item.userID);
                    speakers.unshift(admin);
                } else if (admin.meetChannelState == states.MCAS_CHANNEL_MEET_STATE_LISTENING) {
                    _.remove(listeners, (item) => mgr.adminUserID == item.userID);
                    listeners.unshift(admin);
                }
            }
        }

        const isOnDesk = myself.meetChannelState == states.MCAS_CHANNEL_MEET_STATE_SPEAKING;
        listeners = appliers.concat(listeners);
        this.setState({
            dataSource: this.ds.cloneWithRowsAndSections([speakers, listeners]),
            speakers: speakers,
            isAdmin: isAdmin,
            isOnDesk: isOnDesk,
            isApplying: mgr.status === mgr.constants.STATUS_MEET_APPLY_SPEAKING,
        });
    },
    componentDidMount () {
        this.showProgressHUD();
        app.phoneMgr.toggleSpeaker(true);
        this.setState({ isSpeakerOn:app.phoneMgr.isSpeakerOn });
        app.phoneMgr.connectMeetingServer(this.props.roomInfo);
        this.endMoment = moment(this.props.roomInfo.endTime);
        this.startCountTimeDown();

        // add timeout exit chatroom.
        this.intervalIDSy = this.setTimeout(() => {
            Toast('进入房间超时');
            this.goBack();
        }, 15000);
    },
    componentWillUnmount () {
        app.phoneMgr.toggleSpeaker(true);
    },
    getInitialState () {
        this.ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged : (s1, s2) => s1 !== s2,
        });
        return {
            dataSource: this.ds.cloneWithRowsAndSections([[], []]),
            speakers: [],
            isAdmin: false,
            isOnDesk: false,
            isApplying: false,
            isSpeakerOn:app.phoneMgr.isSpeakerOn,
            timeClock: '00:00:00',
            showMessageBox: false,
            countTimeDownRedColor: false,
            showPromptMessageBox: false,
            promptMessageContent: null,
        };
    },
    toggleSpeaker () {
        app.phoneMgr.toggleSpeaker();
        this.setState({ isSpeakerOn:app.phoneMgr.isSpeakerOn });
    },
    getDiffFormat (duration) {
        let second = Math.floor(duration / 1000);
        let minute = Math.floor(second / 60);
        second = second - minute * 60;
        const hour = Math.floor(minute / 60);
        minute = minute - hour * 60;
        return app.utils.timeFormat(hour, minute, second);
    },
    startCountTimeDown () {
        // this.intervalID = this.setInterval(()=>{
        //     const now = moment();
        //     const duration = this.endMoment.diff(now);
        //     if (duration < 0 && !this.intervalID) {
        //         this.clearInterval(this.intervalID);
        //         this.intervalID = null;
        //         this.setState({
        //             showMessageBox: true,
        //         });
        //     } else if (!this.state.countTimeDownRedColor && duration < CONSTANTS.MEET_COUNT_TIME_DOWN) {
        //         this.setState({countTimeDownRedColor: true});
        //     }
        //         this.setState({
        //             timeClock: this.getDiffFormat(duration),
        //         });
        //         if (this.getDiffFormat(duration) <= '00:02:00') {
        //             Toast("请注意！开会时间即将结束");
        //         }
        //         if (this.getDiffFormat(duration) <= '00:00:01') {
        //             Toast("请注意！即将退出房间");
        //             this.goBack();
        //         }
        // }, 1000);
    },
    meetingApplySpeak () {
        this.setState({ isApplying: true });
        app.phoneMgr.meetingApplySpeak();
    },
    meetingCancelApplySpeak () {
        this.setState({ isApplying: false });
        app.phoneMgr.meetingCancelApplySpeak();
    },

    goBackPrompt () {
        this.doPromptMessageBoxConfirm = () => {
            this.setState({ showPromptMessageBox: false });
            this.goBack();
        };
        this.setState({
            showPromptMessageBox: true,
            promptMessageContent: <Text style={styles.promptText}>是否要退出房间</Text>,
        });
    },
    meetingChangeAdmin (obj) {
        this.doPromptMessageBoxConfirm = () => {
            this.setState({ showPromptMessageBox: false });
            app.phoneMgr.meetingChangeAdmin(obj.userID);
        };
        this.setState({
            showPromptMessageBox: true,
            promptMessageContent: <Text style={styles.promptText}>是否将管理员移交给 <Text style={styles.promptUsername}>{obj.userInfo.userName}</Text></Text>,
        });
    },
    meetingKickUser (obj) {
        this.doPromptMessageBoxConfirm = () => {
            this.setState({ showPromptMessageBox: false });
            app.phoneMgr.meetingKickUser(obj.userID);
        };
        this.setState({
            showPromptMessageBox: true,
            promptMessageContent: <Text style={styles.promptText}>是否将 <Text style={styles.promptUsername}>{obj.userInfo.userName}</Text> 踢出本房间</Text>,
        });
    },
    meetingEndSpeak (userID) {
        app.phoneMgr.meetingEndSpeak(userID);
    },
    meetingBeginSpeak (userID) {
        if (this.speakingNumber < CONSTANTS.MAX_MEETING_SPEAKER_NUMBER) {
            app.phoneMgr.meetingBeginSpeak(userID);
        } else {
            Toast('没有空位置');
        }
    },
    meetingCloseRoom (userID) {
        app.phoneMgr.meetingCloseRoom(userID);
    },
    getNameColor (person) {
        if (!person) {
            return null;
        }
        const mgr = app.phoneMgr;
        const states = mgr.phone.meetChannelStates;
        if (mgr.adminUserID == person.userID) {
            return { color: '#FA3F3D' };
        } else if (person.meetChannelState == states.MCAS_CHANNEL_MEET_STATE_SPEAKING) {
            return { color: '#40B2DA' };
        }
        return { color: '#AEAEAE' };
    },
    getBottomButton () {
        const mgr = app.phoneMgr;
        let button;
        if (this.state.isOnDesk) {
            button = (
                <Button
                    style={[styles.btn, { backgroundColor:'#BD9F67' }]}
                    textStyle={styles.btnText}
                    onPress={this.meetingEndSpeak.bind(null, app.personal.info.userID)}>
                    下  麦
                </Button>
            );
        } else if (mgr.status === mgr.constants.STATUS_MEET_APPLY_SPEAKING) {
            button = (
                <Button
                    style={[styles.btn, { backgroundColor:'#70BE99' }]}
                    textStyle={styles.btnText}
                    onPress={this.meetingCancelApplySpeak}>放弃上麦</Button>
            );
        } else {
            button = (
                <Button
                    style={styles.btn}
                    textStyle={styles.btnText}
                    onPress={this.meetingApplySpeak}>申请上麦</Button>
            );
        }
        return (
            <View style={styles.bottomContainer}>
                {button}
            </View>
        );
    },
    renderRowButton (obj, sectionID) {
        const buttons = [];
        const mgr = app.phoneMgr;
        if (obj.userID === app.personal.info.userID) {
            if (sectionID == 0) {
                buttons.push(
                    <RoundButton
                        image={app.img.meeting_hung_up}
                        key='1'
                        onPress={this.meetingEndSpeak.bind(null, obj.userID)} />
                );
            } else {
                buttons.push(
                    <RoundButton
                        image={app.img.meeting_speach}
                        key='1'
                        onPress={this.meetingBeginSpeak.bind(null, obj.userID)} />
                );
            }
        } else {
            buttons.push(
                <RoundButton
                    image={app.img.meeting_exchange}
                    key='2'
                    onPress={this.meetingChangeAdmin.bind(null, obj)} />
            );
            buttons.push(
                <RoundButton
                    image={app.img.meeting_leave}
                    key='3'
                    onPress={this.meetingKickUser.bind(null, obj)} />
            );
            if (sectionID == 0) {
                buttons.push(
                    <RoundButton
                        image={app.img.meeting_hung_up}
                        key='4'
                        onPress={this.meetingEndSpeak.bind(null, obj.userID)} />
                );
            } else if (obj.meetChannelState == mgr.phone.meetChannelStates.MCAS_CHANNEL_MEET_STATE_APPLYSPEAKING) {
                buttons.push(
                    <RoundButton
                        image={app.img.meeting_speach}
                        key='4'
                        onPress={this.meetingBeginSpeak.bind(null, obj.userID)} />
                );
            }
        }
        return (
            <View style={styles.buttonContainer}>
                {buttons}
            </View>
        );
    },
    renderRow (obj, sectionID, rowID) {
        return (
            <View style={styles.itemContainer}>
                <DImage
                    resizeMode='cover'
                    defaultSource={app.img.personal_head}
                    source={{ uri:obj.userInfo.userImg || 'undefined' }}
                    style={styles.headImage} />
                <View style={styles.nameContainer}>
                    <View style={styles.usernameContainer}>
                        <Text style={styles.username}>
                            {obj.userInfo.userName}
                        </Text>
                        {
                            app.phoneMgr.adminUserID == obj.userID &&
                            <View style={[styles.adminContainer, styles.adminContainerAdmin, { marginLeft: 10 }]}>
                                <Text numberOfLines={1} style={styles.adminSeat}>
                                    管理员
                                </Text>
                            </View>
                        }
                        {
                            app.personal.info.userID == obj.userID &&
                            <View style={[styles.adminContainer, styles.adminContainerMe, { marginLeft: 10 }]}>
                                <Text numberOfLines={1} style={styles.adminSeat}>
                                    我
                                </Text>
                            </View>
                        }
                    </View>
                    <Text style={styles.userAlias}>
                        {obj.userInfo.userAlias}
                    </Text>
                </View>
                {
                    (this.state.isApplying && obj.userID == app.personal.userID) &&
                    <Text style={styles.username}>申请上麦...</Text>
                }
                {this.state.isAdmin && this.renderRowButton(obj, sectionID)}
            </View>
        );
    },
    renderSeparator (sectionID, rowID) {
        return (
            <View
                style={styles.separator}
                key={sectionID + '' + rowID} />
        );
    },
    renderSectionHeader (obj, sectionID) {
        const text = sectionID == 0 ? '麦上 ' : '旁听 ';
        return (
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>
                    {text}
                </Text>
                <Text style={styles.sectionHeaderCount}>
                    {obj.length}
                </Text>
            </View>
        );
    },
    render () {
        const speakers = this.state.speakers;
        const cnt = this.state.speakers.length;
        return (
            <View style={styles.container}>
                <Image
                    resizeMode='stretch'
                    source={app.img.meeting_background}
                    style={styles.headImgBack} />
                <View style={styles.headImgView}>
                    <Text numberOfLines={1} style={styles.speakerIng}>
                        {cnt > 0 ? '正在讲话...' : ''}
                    </Text>
                    {
                       cnt > 0 &&
                       <DImage
                           resizeMode='cover'
                           defaultSource={app.img.personal_head}
                           source={cnt > 0 ? { uri:speakers[0].userInfo.userImg || 'undefined' } : app.img.personal_head}
                           style={styles.headImgTopIos} />
                    }
                    {
                      cnt > 0 &&
                      <View style={styles.headImgTopRed} />
                    }
                    <Text numberOfLines={1} style={styles.speakerName}>
                        {cnt > 0 ? speakers[0].userInfo.userName : ''}
                    </Text>
                    <Text numberOfLines={1} style={styles.speakerAlias}>
                        {cnt > 0 ? speakers[0].userInfo.userAlias : ''}
                    </Text>
                </View>
                <ListView                    enableEmptySections
                    style={styles.listView}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    renderSeparator={this.renderSeparator}
                    renderSectionHeader={this.renderSectionHeader}
                    />
                {!this.state.isAdmin && this.getBottomButton()}
                <TouchableOpacity
                    style={styles.speakerOnContainer}
                    onPress={this.toggleSpeaker}>
                    {
                        this.state.isSpeakerOn ?
                            <Image
                                resizeMode='stretch'
                                source={app.img.train_speaker_on}
                                style={styles.speakerOn} />
                    : <Image
                        resizeMode='stretch'
                        source={app.img.train_speaker_off}
                        style={styles.speakerOff} />
                    }
                </TouchableOpacity>
                {
                    this.state.showMessageBox &&
                    <MessageBox
                        content='时间结束，请退出房间'
                        doConfirm={this.goBack}
                        />
                }
                <ProgressHud
                    isVisible={this.state.is_hud_visible}
                    isDismissible={false}
                    overlayColor='rgba(0, 0, 0, 0.6)'
                    color='#239FDB'
                    />
                {
                    this.state.showPromptMessageBox &&
                    <PromptMessageBox
                        doConfirm={this.doPromptMessageBoxConfirm}
                        doCancel={() => this.setState({ showPromptMessageBox: false })}
                        >
                        {this.state.promptMessageContent}
                    </PromptMessageBox>
                }
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headImgBack:{
        width:sr.w,
        height:173,
        position:'absolute',
        left:0,
        top:0,
    },
    headImgView:{
        width:sr.w,
        height:173,
        alignItems:'center',
        justifyContent:'center',
    },
    headImgTopIos:{
        width:  60,
        height: 60,
        borderRadius: 30,
    },
    headImgTopRed:{
        marginTop:-14,
        marginLeft:40,
        width:12,
        height:12,
        borderRadius:6,
        backgroundColor:'red',
    },
    speakerIng: {
        position: 'absolute',
        top: 15,
        left: 15,
        fontSize: 15,
        fontWeight: '300',
        color: '#444444',
    },
    speakerName: {
        marginTop: 5,
        fontSize: 15,
        fontWeight: '300',
        color: '#111111',
    },
    speakerAlias: {
        marginTop: 5,
        fontSize: 13,
        fontWeight: '300',
        color: '#222222',
    },
    timeContainer: {
        position: 'absolute',
        right: 10,
        bottom: 10,
    },
    timeText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    speakerOnContainer: {
        position: 'absolute',
        right: 10,
        top: 10,
        width: 30,
        height: 30,
        borderRadius: 20,
        alignItems:'center',
        justifyContent:'center',
    },
    speakerOn: {
        width: 25,
        height: 25,
    },
    speakerOff: {
        width: 22,
        height: 22,
    },
    listView: {
        flex: 1,
    },
    separator: {
        backgroundColor: '#DDDDDD',
        height: 1,
    },
    sectionHeader: {
        marginTop: 19,
        height: 48,
        backgroundColor: '#FFFFFF',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionHeaderText: {
        fontSize: 14,
        color: '#BD9F67',
        marginLeft: 10,
    },
    sectionHeaderCount: {
        fontSize: 16,
        color: '#BD9F67',
    },
    sectionHeaderMark: {
        fontSize: 14,
        color: 'gray',
    },
    itemContainer: {
        marginTop: 1,
        paddingVertical: 6,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    headImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        marginLeft: 8,
    },
    usernameContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    username: {
        fontSize: 16,
        marginBottom:5,
        color: '#666666',
    },
    adminContainer: {
        alignItems:'center',
        justifyContent:'center',
    },
    adminContainerAdmin: {
        marginTop: 1,
        height: 18,
        width: 45,
        borderRadius: 9,
        backgroundColor:'#BD9F67',
    },
    adminContainerMe: {
        marginTop: 1,
        height: 18,
        width: 18,
        borderRadius: 9,
        backgroundColor:'#56C2E7',
    },
    adminSeat: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '100',
        textAlign: 'center',
        overflow: 'hidden',
    },
    userAlias: {
        fontSize: 12,
        color: '#969799',
    },
    buttonContainer: {
        flexDirection: 'row',
        position: 'absolute',
        marginTop: 5,
        right: 0,
    },
    roundButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
    },
    bottomContainer: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    btn: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        height: 34,
        width: 150,
        marginRight: 6,
    },
    btnApplyText: {
        fontSize: 18,
        fontWeight: '800',
    },
    promptText: {
        fontSize: 16,
        color: '#656667',
    },
    promptUsername: {
        color: '#A62045',
    },
});
