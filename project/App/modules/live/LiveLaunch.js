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
} = ReactNative;

const VhallPublish = require('../../native/index.js').VhallPublish;
const Subscribable = require('Subscribable');
const { Button } = COMPONENTS;

const RoundButton = React.createClass({
    render () {
        const { onPress, image, style } = this.props;
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={onPress}
                >
                <Image
                    resizeMode='stretch'
                    source={image}
                    style={[styles.roundButton, style]}
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
            torchMode: 0,
            isFrontCamera: false,
            isStart: true,
        };
    },
    componentWillMount () {
        app.toggleNavigationBar(false);
        app.chatMgr.register(this.props.videoId);
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
    componentWillUnmount () {
        app.chatMgr.unregister();
    },
    goBack () {
        this.setState({ isStart: false });
        app.pop(2);
        app.toggleNavigationBar(true);
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
                        underlineColorAndroid='transparent'
                        autoFocus
                        defaultValue={this.state.content}
                        onChangeText={(text) => this.setState({ content: text })}
                        placeholder='请输入内容'
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
    switchCamera () {
        this.setState({ isFrontCamera: !this.state.isFrontCamera });
    },
    toggleTorchMode () {
        this.setState({ torchMode: this.state.torchMode === 0 ? 1 : 0 });
    },
    renderControlPanel () {
        return (
            <View style={styles.controlPanel}>
                <RoundButton
                    onPress={this.switchCamera}
                    image={app.img.live_switch}
                    style={styles.controlButton}
                    />
                {
                    !this.state.isFrontCamera &&
                    <RoundButton
                        onPress={this.toggleTorchMode}
                        image={app.img.live_lamp}
                        style={styles.controlButton}
                        />
                }
            </View>
        );
    },
    onPublishStatus (obj) {
    },
    render () {
        const { videoId, accessToken } = this.props;
        const { isStart, isFrontCamera, torchMode } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.container} {...this._panResponder.panHandlers}>
                    <VhallPublish
                        style={styles.videoPlayer}
                        videoId={videoId}
                        accessToken={accessToken}
                        appKey={CONSTANTS.VHALL_APP_KEY}
                        appSecretKey={CONSTANTS.VHALL_APP_SECRECT_KEY}
                        onPublishStatus={this.onPublishStatus}
                        isStart={isStart}
                        isFrontCamera={isFrontCamera}
                        torchMode={torchMode}
                        />
                    <Animated.View style={[styles.subtitlePanel, { left: this.state.left, transform: [{ translateX: this.state.containerTranslateX }] }]}>
                        <this.renderChatPanel />
                    </Animated.View>
                    <this.renderControlPanel />
                </View>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    videoPlayer: {
        backgroundColor: '#C7C7C7',
        position: 'absolute',
        width: sr.w,
        height: sr.h,
    },
    subtitlePanel: {
        position: 'absolute',
        width:sr.w,
        height:sr.h,
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
    controlPanel: {
        marginTop: 20,
        width: sr.w,
        height: 100,
    },
    controlButton: {
        marginTop: 20,
        alignSelf: 'flex-end',
    },
});
