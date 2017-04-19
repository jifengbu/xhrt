'use strict';const React = require('react');const ReactNative = require('react-native');

const {
    View,
    Text,
    StyleSheet,
    PropTypes,
    TouchableOpacity,
    Image,
} = ReactNative;

const SPEECH_STATUS = [
    { text: '等候演讲', color:'#a0d468' },
    { text: '演讲中', color:'#ff3c30' },
    { text: '演讲完毕', color:'#239fdb' },
    { text: '退出', color:'gray' },
    { text: '正在准备演讲', color:'#a0d468' },
    { text: '等待评委打分', color:'#a0d468' },
    { text: '正在打分', color:'#a0d468' },
    { text: '打分完毕', color:'#a0d468' },
    { text: '等待重新开始', color:'#a0d468' },
];

const DImage = COMPONENTS.DImage;

module.exports = React.createClass({
    showCardInfo (item) {
        console.log(item.userID);
        if (item.userInfo.isSpecialSoldier === 1) {
            this.props.onPress(item.userID);
        }
    },
    render () {
        const mgr = app.phoneMgr;
        const { isAgent } = app.personal.info;
        const showCardInfo = this.showCardInfo;
        return (
            <View style={styles.main}>
                {this.props.competitors.map(function (item, i) {
                    const isSpeech = item.channelState == mgr.phone.channelStates.MCAS_CHANNEL_STATE_SPEAKERING;
                    const status = item.extraState ? SPEECH_STATUS[item.extraState] : SPEECH_STATUS[item.channelState - 1];
                    const source = (typeof item.userInfo.userImg === 'string') ? { uri:item.userInfo.userImg } : item.userInfo.userImg;
                    return (
                        <View style={styles.container} key={i}>
                            <Text style={!isSpeech ? styles.stateTextStyle : styles.stateTextStyle2}>
                                {status.text}
                            </Text>
                            <TouchableOpacity
                                style={isSpeech ? styles.headViewStyleSpeak : styles.headViewStyle}
                                onPress={showCardInfo.bind(null, item)}>
                                <DImage
                                    resizeMode='cover'
                                    defaultSource={app.img.personal_head}
                                    source={source}
                                    style={[!isSpeech ? styles.headImgStyle : styles.headImgStyle2, { borderColor:status.color }]} />
                                {
                                    item.userInfo.isSpecialSoldier === 1 &&
                                    <Image
                                        resizeMode='stretch'
                                        source={app.img.train_card}
                                        style={isSpeech ? styles.cardStyleSpeak : styles.cardStyle} />
                                }
                            </TouchableOpacity>
                            <Text style={!isSpeech ? styles.nameStyle : styles.nameStyle2}>
                                {item.userInfo.userName}
                            </Text>
                            <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 3 }}>
                                <Text style={!isSpeech ? styles.jobStyle : styles.jobStyle2}>
                                    {item.userInfo.userAlias}
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        );
    },
});

const styles = StyleSheet.create({
    main: {
        width: sr.w - 60,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent: 'space-around',
    },
    container: {
        flex: 1,
        height: sr.h / 5,
        marginHorizontal: 5,
        marginTop: 10,
        flexDirection: 'column',
    },
    stateTextStyle: {
        fontSize: 9,
        backgroundColor: 'transparent',
        color: '#FFFFFF',
        alignSelf: 'center',
    },
    stateTextStyle2: {
        fontSize: 9,
        marginTop: -1,
        color: '#FFFFFF',
        backgroundColor: 'transparent',
        alignSelf: 'center',
    },
    cardStyle: {
        width: 18,
        height: 15,
        position: 'absolute',
        left: 30,
        top: 0,
    },
    cardStyleSpeak: {
        width: 18,
        height: 15,
        position: 'absolute',
        left: 40,
        top: 0,
    },
    headViewStyle: {
        alignSelf: 'center',
        width: 48,
        height: 38,
        margin: 2,
    },
    headViewStyleSpeak: {
        alignSelf: 'center',
        width: 62,
        height: 52,
        margin: 2,
    },
    headImgViewStyle: {
        alignSelf: 'center',
        width: 38,
        height: 38,
        margin: 2,
    },
    headImgViewStyle2: {
        alignSelf: 'center',
        width: 52,
        height: 52,
        margin: 2,
    },
    headImgStyle: {
        width: 38,
        height: 38,
        alignSelf: 'center',
        borderRadius: 19,
        borderWidth:2,
    },
    headImgStyle2: {
        width: 52,
        height: 52,
        alignSelf: 'center',
        borderRadius: 25,
        borderWidth:2,
    },
    levelStyle: {
        fontSize: 10,
        color: '#FFFFFF',
        backgroundColor: 'transparent',
    },
    levelStyle2: {
        fontSize: 12,
        color: '#FFFFFF',
        backgroundColor: 'transparent',
    },
    jobStyle: {
        fontSize: 9,
        color: '#FFFFFF',
        marginLeft: 5,
        backgroundColor: 'transparent',
    },
    jobStyle2: {
        fontSize: 12,
        color: '#FFFFFF',
        marginLeft: 5,
        backgroundColor: 'transparent',
    },
    nameStyle: {
        fontSize: 12,
        color: '#FFFFFF',
        marginTop: 3,
        backgroundColor: 'transparent',
        alignSelf: 'center',
    },
    nameStyle2: {
        fontSize: 14,
        color: '#FFFFFF',
        marginTop: 3,
        backgroundColor: 'transparent',
        alignSelf: 'center',
    },
});
