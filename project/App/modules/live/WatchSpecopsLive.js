'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    Text,
    Image,
    TextInput,
    ListView,
    ScrollView,
    TouchableOpacity,
    PanResponder,
    Animated,
    ActivityIndicator,
    Keyboard,
} = ReactNative;

const Subscribable = require('Subscribable');
const CardBox = require('../shared/CardBox.js');
const VhallPlayer = require('../../native/index.js').VhallPlayer;

const { Button } = COMPONENTS;

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
    mixins: [Subscribable.Mixin],
    registerEvents (name) {
        this.addListenerOn(app.chatMgr, name, (param) => {
            this[name](param);
        });
    },
    UPDATE_MESSAGE_EVENT (result) {
        this.setState({
            dataSource: this.ds.cloneWithRows(app.chatMgr.list),
        });
    },
    componentWillMount () {
        app.toggleNavigationBar(false);
        app.chatMgr.register(this.props.broadcastRoomID);
        this.registerEvents('UPDATE_MESSAGE_EVENT');
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: this._handleStart,
            onMoveShouldSetPanResponder: this._handleStart,
            onPanResponderMove: Animated.event([null, {
                dx: this.state.containerTranslateX,
            }]),
            onPanResponderRelease: this._handlePanResponderEnd,
            onPanResponderTerminate: this._handlePanResponderEnd,
        });
    },
    componentDidMount () {
        if (app.isandroid) {
            Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
            Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
        }
    },
    componentWillUnmount () {
        if (app.isandroid) {
            Keyboard.removeListener('keyboardDidShow', this.keyboardDidShow);
            Keyboard.removeListener('keyboardDidHide', this.keyboardDidHide);
        }
        app.chatMgr.unregister();
    },
    goBack () {
        app.toggleNavigationBar(true);
        app.navigator.pop();
    },
    keyboardDidShow () {
        this.setState({ showButtons: false });
    },
    keyboardDidHide () {
        this.setState({ showButtons: true });
    },
    _handleStart: function (event, gestureState) {
        if (this.state.left === 0) {
            const flag = Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && gestureState.dx > 10;
            if (flag) {
                this.hideInputPanel();
            }
            return flag;
        } else {
            return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && gestureState.dx < -10;
        }
    },
    _handlePanResponderEnd: function (e: Object, gestureState: Object) {
        if (this.state.left === 0) {
            this.hideSubtitlePanelWithAnimated();
        } else {
            this.showSubtitlePanelWithAnimated();
        }
    },
    hideSubtitlePanelWithAnimated () {
        Animated.timing(this.state.containerTranslateX, {
            toValue: sr.tw,
            duration: 500,
        }).start(() => {
            this.setState({ left: sr.tw });
        });
    },
    showSubtitlePanelWithAnimated () {
        Animated.timing(this.state.containerTranslateX, {
            toValue: -sr.tw,
            duration: 500,
        }).start(() => {
            this.state.containerTranslateX.setValue(0);
            this.setState({ left: 0 });
        });
    },
    getInitialState () {
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return {
            tabIndex: 0,
            dataSource: this.ds.cloneWithRows([]),
            showButtons: true,
            screenTop: 0,
            left: 0,
            containerTranslateX: new Animated.Value(0),
            content: '',
            showCard: false,
            status: 3, //1:IDLE 2:PREPARING 3:BUFFERING 4:READY 5:ENDED
        };
    },
    hideCard () {
        this.setState({ showCard: false });
    },
    showCard () {
        this.setState({ showCard: true });
    },
    renderSpeaker () {
        return (
            <TouchableOpacity style={styles.speakerContainer} onPress={this.showCard}>
                <Image
                    resizeMode='cover'
                    defaultSource={app.img.personal_head}
                    source={{ uri: '123' }}
                    style={styles.headStyle} />
                <View style={styles.speakerInfoContainer}>
                    <Text style={styles.speakerName}>王雩老师</Text>
                    <Text style={styles.levelLabel}>等级 <Text style={styles.levelNumber}> 10</Text></Text>
                </View>
            </TouchableOpacity>
        );
    },
    renderRow (obj, sectionID, rowID) {
        return (
            <View style={styles.rowContainer}>
                {
                    obj.messageType === 1 ?
                        <View style={{ flexDirection: 'row' }}>
                            <Text
                                style={[styles.itemNameText, obj.send && { color: '#9932CC' }]}>
                                {obj.send ? '我' : obj.fromName}:
                        </Text>
                            <Text style={styles.itemChatText}>
                                {obj.content}
                            </Text>
                        </View>
                    :
                        <Text style={styles.itemPropText}>
                            {obj.fromUserName}给了{obj.toUserName}一个大大的{obj.propName}
                        </Text>
                }
            </View>
        );
    },
    showInputPanel () {
        this.setState({ showButtons: false });
    },
    hideInputPanel () {
        this.setState({ showButtons: true });
    },
    renderButtons () {
        return (
            <View style={styles.buttonsPanel}>
                <RoundButton
                    onPress={this.showInputPanel}
                    image={app.img.live_speak}
                    />
                <RoundButton
                    onPress={this.goBack}
                    image={app.img.live_back}
                    />
            </View>
        );
    },
    sendMessage () {
        const { content } = this.state;
        if (!content) {
            Toast('不能发送空消息');
            return;
        }
        app.chatMgr.sendMessage(content);
        this.setState({ content: '' });
    },
    renderInputBox () {
        return (
            <View style={styles.inputPanel}>
                <View style={styles.inputContainer}>
                    <TextInput
                        ref={(ref) => { this.textInput = ref; }}
                        autoFocus
                        defaultValue={this.state.content}
                        onChangeText={(text) => this.setState({ content: text })}
                        placeholder='请输入内容'
                        underlineColorAndroid='transparent'
                        onBlur={this.hideInputPanel}
                        style={styles.textInput}
                        />
                </View>
                <Button
                    style={styles.btnSend}
                    onPress={this.sendMessage}
                    textStyle={styles.btnSendCodeText}>
                    发送
                </Button>
            </View>
        );
    },
    renderChatPanel () {
        const { showButtons } = this.state;
        return (
            <View style={styles.chatPanel}>
                <ListView
                    ref={(listView) => { this.listView = listView; }}
                    enableEmptySections
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    />
                {showButtons && <this.renderButtons /> || <this.renderInputBox />}
            </View>
        );
    },
    onDocFlash (e) {
        const obj = e.nativeEvent;
    },
    onStateChange (e) {
        const obj = e.nativeEvent;
        this.setState({ status: obj.state });
    },
    onPlayError (e) {
        const obj = e.nativeEvent;
        if (obj.content) {
            Toast(obj.content + '');
        } else {
            Toast('直播已经结束，请关注官方直播时间');
        }
        this.goBack();
    },
    render () {
        return (
            <View style={styles.container}>
                <VhallPlayer
                    style={[{ flex:1 }, app.isandroid ? { backgroundColor:'transparent' } : { backgroundColor:'black' }]}
                    videoId={this.props.broadcastRoomID}
                    appKey={CONSTANTS.VHALL_APP_KEY}
                    appSecretKey={CONSTANTS.VHALL_APP_SECRECT_KEY}
                    name={app.login.list[0] || 'wangyu'}
                    email='wangyu298632@sina.com'
                    password=''
                    onDocFlash={this.onDocFlash}
                    onStateChange={this.onStateChange}
                    onPlayError={this.onPlayError}
                    />
                {
                    this.state.status < 4 &&
                    <View style={[styles.touchLayer, {
                        alignItems:'center',
                        justifyContent: 'center',
                    }]}>
                        <ActivityIndicator size='large' />
                    </View>
                }
                <View style={[styles.touchLayer, { backgroundColor:'rgba(255, 255, 255, 0.1)' }]} {...this._panResponder.panHandlers}>
                    <Animated.View style={[styles.subtitlePanel, { left: this.state.left, transform: [{ translateX: this.state.containerTranslateX }] }]}>
                        {/* <this.renderSpeaker /> */}
                        <this.renderChatPanel />
                    </Animated.View>
                </View>
                {
                    this.state.showCard &&
                    <CardBox hideCard={this.hideCard} />
                }
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    touchLayer: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },
    subtitlePanel: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },
    speakerContainer: {
        flexDirection: 'row',
        backgroundColor:'rgba(0, 0, 0, 0.3)',
        width: 130,
        marginTop: 26,
        borderRadius: 25,
    },
    headStyle: {
        alignSelf: 'center',
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    speakerInfoContainer: {
        justifyContent: 'space-around',
        paddingLeft: 6,
        paddingVertical: 4,
    },
    speakerName: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    levelLabel: {
        fontSize: 11,
        color: '#FFFFFF',
    },
    levelNumber: {
        color: 'yellow',
    },
    chatPanel: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        width: sr.w,
        height: 160,
        position: 'absolute',
        left: 0,
        bottom: 0,
    },
    rowContainer: {
        marginHorizontal: 8,
        flexDirection: 'row',
    },
    itemNameText: {
        fontSize: 14,
        alignSelf: 'center',
        color: '#239fdb',
    },
    itemChatText: {
        fontSize: 14,
        flex: 1,
        alignSelf: 'center',
        marginLeft: 8,
        color: 'white',
    },
    itemPropText: {
        flex: 1,
        fontSize: 14,
        alignSelf: 'center',
        color: 'white',
    },
    buttonsPanel: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        height: 40,
    },
    roundButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
    },
    inputPanel: {
        flexDirection: 'row',
        paddingVertical: 4,
    },
    inputContainer: {
        flex: 1,
        height: 35,
        marginHorizontal: 8,
        borderRadius: 6,
        borderColor: '#D7D7D7',
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
    },
    textInput: {
        paddingLeft: 10,
        paddingVertical: -3,
        height:30,
        backgroundColor: '#FFFFFF',
    },
    btnSend: {
        height: 35,
        paddingHorizontal: 10,
        marginRight: 10,
        borderRadius: 6,
    },
    btnSendCodeText: {
        fontSize: 14,
    },
});
