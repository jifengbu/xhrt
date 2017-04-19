'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    Image,
    StyleSheet,
    ListView,
    TextInput,
    Text,
    View,
    TouchableOpacity,
} = ReactNative;

const TimerMixin = require('react-timer-mixin');
const SilentPost = require('../../utils/net/SilentPost.js');

const { Button } = COMPONENTS;
const DEFAULT_SCROLL_OFFSET = 50;

module.exports = React.createClass({
    mixins: [TimerMixin],
    componentDidMount () {
        this.setInterval(function () {
            this.getUpdateMessage();
        }.bind(this), 2000);
    },
    getInitialState () {
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.list = [];
        this.messageID = 0;
        this.listViewHeight = 0;
        this.autoScrollEnable = true;
        return {
            clickComment: false,
            dataSource: this.ds.cloneWithRows([]),
        };
    },
    getUpdateMessage () {
        const param = {
            roomID:this.props.roomID,
            userID:app.personal.info.userID,
            messageID: this.messageID,
        };
        this.lastMessageID = this.messageID;
        SilentPost(app.route.ROUTE_UPDATE_MESSAGE, param, this.doUpdateMessageSuccess);
    },
    doUpdateMessageSuccess (data) {
        if (data.success) {
            const infoList = data.context.infoList || [];
            if (infoList.length > 0) {
                this.messageID = data.context.messageID;
                if (this.lastMessageID === this.messageID) {
                    return;
                }
                this.list = this.list.concat(infoList);
                this.setState({ dataSource: this.ds.cloneWithRows(this.list) });
                for (let i in infoList) {
                    const item = infoList[i];
                    // 1-表示文本信息 2-表示道具信息
                    if (item.messageType === 2) {
                        this.noticeShow(item.propCode);
                        const personInfo = app.personal.info;
                        // 0表示用积分购买 1-用赢销币购买 收到后给自己添加相应的积分和营销币
                        if (personInfo.userID === item.toUserId) {
                            if (item.propType == 1) {
                                personInfo.integral = personInfo.integral * 1 + item.propValue;
                            } else if (item.propType == 2) {
                                personInfo.winCoin = personInfo.winCoin * 1 + item.propValue;
                            }
                            app.personal.set(personInfo);
                        }
                    }
                }
            }
        }
    },
    noticeShow (propCode) {
        this.show(() => {
            this.props.noticeShow(propCode);
        });
    },
    show (callback) {
        return callback();
    },
    _onPressRow (obj) {
        this.setState({ clickComment: !this.state.clickComment });
    },
    _doSend (obj) {
        this.setState({ clickComment: !this.state.clickComment });
        if (this.state.content === '') {
            // Toast('请输入内容');
            return;
        }
        const param = {
            roomID: this.props.roomID,
            userID: app.personal.info.userID,
            content:this.state.content,
        };
        POST(app.route.ROUTE_SEND_MESSAGE, param, this.doSendMessageSuccess);
    },
    doSendMessageSuccess (data) {
        if (data.success) {
            this.state.content = '';
        } else {
            Toast(data.msg);
        }
    },
    onContentSizeChange (w, h) {
        this.yOffset = h - this.listViewHeight;
        if (this.yOffset > 0 && this.autoScrollEnable) {
            this.listView.scrollTo({ x:0, y:this.yOffset, animated:true });
        }
    },
    onScroll (e) {
        const y = e.nativeEvent.contentOffset.y;
        this.autoScrollEnable = y + DEFAULT_SCROLL_OFFSET >= this.yOffset;
    },
    onLayout (e) {
        this.listViewHeight = e.nativeEvent.layout.height;
    },
    renderSeparator (sectionID, rowID) {
        return (
            <View style={styles.separator} key={rowID} />
        );
    },
    renderRow (obj) {
        return (
            <View style={styles.ItemContainer}>
                {obj.messageType === 1 ?
                    <View style={{ flexDirection: 'row' }}>
                        <Text
                            style={styles.itemNameText}>
                            {obj.userName}:
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
    render () {
        return (
            <View style={[styles.container, this.props.style]}>
                <View style={styles.listStyle}>
                    <ListView                        onScroll={this.onScroll}                        onContentSizeChange={this.onContentSizeChange}                        onLayout={this.onLayout}                        ref={(listView) => { this.listView = listView; }}                        initialListSize={1}
                        enableEmptySections
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow}
                        renderSeparator={this.renderSeparator}
                            />
                </View>
                <View style={styles.inputStyle}>
                    {this.state.clickComment === false ?
                        <TouchableOpacity onPress={this._onPressRow.bind(null, this.state.clickComment)}>
                            <Image
                                resizeMode='contain'
                                source={app.img.train_chat}
                                style={styles.chatImage} />
                        </TouchableOpacity>
                            :
                        <View style={styles.inputContainer}>
                            <TextInput
                                autoFocus
                                onChangeText={(text) => this.setState({ content: text })}
                                defaultValue={this.state.content}
                                placeholder={'请输入内容'}
                                style={styles.textInput}
                                    />
                            <Button
                                onPress={this._doSend.bind(null, this.state.clickComment)}
                                style={styles.btnSend}
                                textStyle={styles.btnSendCodeText}>
                                    发送
                                </Button>
                        </View>
                        }
                </View>
            </View>
        );
    },
});

const WIDTH_NO_SCALE = 375 / sr.tw;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1F20',
    },
    listStyle: {
        height: 82,
        width: sr.w,
        paddingVertical: 8,
        backgroundColor: '#1E1F20',
    },
    ItemContainer: {
        marginHorizontal: 8,
        flexDirection: 'row',
    },
    itemNameText: {
        fontSize: 14,
        alignSelf: 'center',
        color: '#83724B',
    },
    itemChatText: {
        fontSize: 14,
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
    inputStyle: {
        position:'absolute',
        bottom: 0,
        left: 0,
        width: sr.w,
        height: 42 * WIDTH_NO_SCALE,
        backgroundColor: '#1E1F20',
    },
    chatImage: {
        width: 40,
        height: 35,
        marginRight: 10,
        alignSelf: 'flex-end',
    },
    inputContainer: {
        height: 35,
        marginHorizontal: 10,
        borderRadius: 5,
        borderColor: '#D7D7D7',
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems:'center',
    },
    textInput: {
        marginLeft: 2,
        paddingLeft: 10,
        paddingVertical: -3,
        height:30,
        width: sr.w - 80,
        backgroundColor: '#FFFFFF',
    },
    btnSend: {
        flex: 1,
        height: 30,
        marginHorizontal: 3,
        borderRadius: 6,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#A62045',
    },
    btnSendCodeText: {
        fontSize: 14,
        alignSelf: 'center',
    },
});
