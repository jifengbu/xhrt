'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
    ListView,
} = ReactNative;

const UmengMgr = require('../../manager/UmengMgr.js');
const { QRCode, DImage } = COMPONENTS;

module.exports = React.createClass({
    getInitialState () {
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return {
            dataSource: this.ds.cloneWithRows([]),
            DetailData: null,
            tabIndex: 0,
            codeContent: '',
            isShowImage: false,
        };
    },
    componentDidMount () {
        this.getQRCodeItem();
    },
    getQRCodeItem () {
        const param = {
            userID: app.personal.info.userID,
        };
        POST(app.route.ROUTE_GET_AGENT_INFO, param, this.getQRCodeItemSuccess);
    },
    getQRCodeItemSuccess (data) {
        if (data.success) {
            this.setState({ DetailData: data.context });
            if (!data.context.freeQRCode.length) {
                this.setState({ isShowImage: true });
            }
            this.old_arry = this.state.DetailData.freeQRCode || [];
            const codeStr = this.getRandomQRCode(this.old_arry);
            if (codeStr) {
                this.setState({ codeContent:codeStr });
            }
        } else {
            Toast(data.msg);
        }
    },
    changeTab (tabIndex) {
        this.setState({ tabIndex });
    },
    updateQRCode () {
        // 更新二维码
        const codeStr = this.getRandomQRCode(this.old_arry);
        if (!codeStr) {
            this.getQRCodeItem();
            return;
        }
        this.setState({ codeContent:codeStr });
    },
    shareQRCode (code) {
        // 分享二维码
        const data = 'code=' + code;
        const dataEncode = encodeURI(data);
        UmengMgr.doActionSheetShare(CONSTANTS.SHARE_SHAREDIR_SERVER + 'shareQRCode.html?' + dataEncode, '赢销二维码', '扫一扫可成为我们尊贵的特种兵，可以拥有一年的学习时间。专业为你打造特种兵', 'web', CONSTANTS.SHARE_IMGDIR_SERVER + 'qr-code.png', this.doShareCallback);
    },
    doShareCallback () {

    },
    getRandomQRCode (codeArr) {
        const index = _.random(0, codeArr.length - 1);
        const code = codeArr[index];
        // 在原数组删掉，然后在下轮循环中就可以避免重复获取
        codeArr.splice(index, 1);
        return code;
    },
    render () {
        const isFirstTap = this.state.tabIndex === 0;
        const { DetailData, tabIndex, isShowImage } = this.state;
        const { authorized } = this.props;
        let already = 0;
        let surplus = 0;
        let codeText = '';
        const isFree = (authorized === 1 && tabIndex === 0) ? 1 : 0; // 1表示免费  0表示收费
        if (DetailData) {
            if (isFree) {
                surplus = DetailData.totalFreeQRCodeNum - DetailData.boundFreeQRCodeNum;
                already = DetailData.boundFreeQRCodeNum;
                codeText = this.state.codeContent;
            } else {
                already = DetailData.boundFeeQRCodeNum;
                codeText = DetailData.feeQRCode;
            }
        }
        return (
            <Image
                resizeMode='stretch'
                source={app.img.login_background}
                style={styles.imageContainer}>
                {   // authorized 1表示代理商 2表示特种兵
                    authorized === 1 ?
                        <View style={styles.tabContainer}>
                            <TouchableOpacity
                                onPress={this.changeTab.bind(null, 0)}
                                style={[styles.tabButton, { backgroundColor: isFirstTap ? CONSTANTS.THEME_COLOR : '#FFFFFF' }]}>
                                <Text style={[styles.tabText, { color:isFirstTap ? '#FFFFFF' : CONSTANTS.THEME_COLOR }]} >免费二维码管理</Text>
                                {isFirstTap && <View style={[styles.makeup, { right:0 }]} />}
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={this.changeTab.bind(null, 1)}
                                style={[styles.tabButton, { backgroundColor:!isFirstTap ? CONSTANTS.THEME_COLOR : '#FFFFFF' }]}>
                                <Text style={[styles.tabText, { color:!isFirstTap ? '#FFFFFF' : CONSTANTS.THEME_COLOR }]} >收费二维码管理</Text>
                                {!isFirstTap && <View style={[styles.makeup, { left:0 }]} />}
                            </TouchableOpacity>
                        </View>
                    :
                        <View style={styles.themeContainer}>
                            <Text style={[styles.tabText, { color: '#FFFFFF' }]}>{'我的二维码管理'}</Text>
                        </View>
                }
                {
                    isFree ?
                        <View style={styles.MessageView}>
                            <Text style={[styles.MessageText, { color: '#555555' }]}>{'剩余'}</Text>
                            <Text style={[styles.MessageText, { color: CONSTANTS.THEME_COLOR }]}>{surplus}</Text>
                            <Text style={[styles.MessageText, { color: '#555555' }]}>{'个邀请码，该码使用权限为1年'}</Text>
                        </View>
                    :
                        <View style={styles.MessageView}>
                            <Text style={[styles.MessageText, { color: '#555555' }]}>{'邀请码使用权限为1年'}</Text>
                        </View>
                }
                <View style={styles.QRcodeContainer}>
                    <Image
                        resizeMode='cover'
                        source={app.img.personal_green_end}
                        style={styles.QRcodeStyle}>
                        {
                            isShowImage && isFree ?
                                <View style={styles.QRCodeNullView}>
                                    <Image
                                        resizeMode='stretch'
                                        source={app.img.login_loginLogo}
                                        style={styles.QRCodeImage} />
                                    <Text style={styles.nullText}>{'暂无二维码'}</Text>
                                </View> :
                                <View style={[styles.QRCodeView, { marginTop: isFree ? 20 : 40 }]}>
                                    {
                                    codeText != '' &&
                                    <QRCode
                                        text={codeText}
                                        colorDark='black'
                                        width={sr.ws(150)}
                                        height={sr.ws(150)}
                                        />
                                }
                                    {
                                    codeText != '' &&
                                    <Image
                                        resizeMode='contain'
                                        source={app.img.personal_circular_logo}
                                        style={styles.logo} />
                                }
                                </View>
                        }
                        {
                            !isShowImage && isFree ?
                                <View style={styles.textTitle}>
                                    <Text style={styles.detailText}>{'一个二维码只绑定一个用户'}</Text>
                                    <Text style={styles.detailText}>{'扫一扫或者分享之前请点击更新'}</Text>
                                </View> : null
                        }
                        {
                            isShowImage && isFree ?
                            null :
                            <View style={styles.btnContainer}>
                                <TouchableOpacity
                                    onPress={this.shareQRCode.bind(null, codeText)}
                                    style={[styles.tabBtn, { backgroundColor: '#BB9F6A' }]}>
                                    <Text style={[styles.tabText, { color:'#FFFFFF' }]} >分享</Text>
                                </TouchableOpacity>
                                {
                                    isFree ?
                                        <TouchableOpacity
                                            onPress={this.updateQRCode}
                                            style={[styles.tabBtn, { backgroundColor: '#98CEA3' }]}>
                                            <Text style={[styles.tabText, { color:'#FFFFFF' }]} >更新</Text>
                                        </TouchableOpacity> : null
                                }
                            </View>
                        }
                    </Image>
                </View>
                <View style={styles.MessageBottom}>
                    <Text style={[styles.MessageText, { color: '#555555' }]}>{'已成功绑定账号'}</Text>
                    <Text style={[styles.MessageText, { color: CONSTANTS.THEME_COLOR }]}>{already}</Text>
                    <Text style={[styles.MessageText, { color: '#555555' }]}>{'个'}</Text>
                </View>
                <View style={styles.bottomContainer}>
                    {
                        this.state.DetailData &&
                        <QRCodeData DetailData={this.state.DetailData} authorized={this.props.authorized} tabIndex={this.state.tabIndex} />
                    }
                </View>
            </Image>
        );
    },
});

const QRCodeData = React.createClass({
    componentWillMount () {
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    },
    renderRow (obj) {
        return (
            <View style={styles.itemContainer}>
                <View style={styles.headContainer}>
                    <DImage
                        resizeMode='stretch'
                        defaultSource={app.img.personal_head}
                        source={{ uri:obj.userHead }}
                        style={styles.headImage} />
                    <Text style={styles.dateText}>{obj.userName}</Text>
                </View>
                <Text style={styles.dateText}>{obj.userBoundTime}</Text>
            </View>
        );
    },
    render () {
        const { DetailData, authorized, tabIndex } = this.props;
        let item = [];
        if (authorized === 1 && tabIndex === 0) {
            item = DetailData.boundFreeQRCodeInfo;
        } else {
            item = DetailData.boundFeeQRCodeInfo;
        }
        return (
            <View style={styles.container}>
                {
                    DetailData &&
                    <ListView
                        initialListSize={1}
                        pageSize={50}
                        enableEmptySections
                        removeClippedSubviews
                        style={styles.list}
                        dataSource={this.ds.cloneWithRows(item)}
                        renderRow={this.renderRow}
                        />
                }
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageContainer: {
        width: sr.w,
        height: sr.ch,
    },
    MessageView: {
        width: sr.w,
        height: 24,
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    MessageBottom: {
        width: sr.w,
        height: 24,
        marginTop: 15,
        marginLeft: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    bottomContainer: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    MessageText: {
        fontSize: 14,
    },
    QRcodeContainer: {
        width: 270,
        marginLeft: (sr.w - 270) / 2,
        height: 302,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: CONSTANTS.THEME_COLOR,
    },
    QRcodeStyle: {
        width: 235,
        height: 265,
        alignItems: 'center',
    },
    QRCodeView: {
        width: 145,
        height: 145,
        justifyContent: 'center',
        alignItems: 'center',
    },
    QRCodeNullView: {
        marginTop: 40,
        width: 145,
        height: 185,
        justifyContent: 'center',
        alignItems: 'center',
    },
    QRCodeImage: {
        width: 145,
        height: 75,
    },
    nullText: {
        fontSize: 16,
        backgroundColor: 'transparent',
        color: '#A60245',
        marginTop: 50,
    },
    logo: {
        width:40,
        height:40,
        position:'absolute',
        bottom:52.5,
        left:52.5,
        borderRadius: 20,
    },
    textTitle: {
        width: 180,
        height: 40,
        marginTop: 20,
    },
    detailText: {
        fontSize: 12,
        marginTop: 5,
        textAlign: 'center',
        color: '#A22346',
        backgroundColor: 'transparent',
    },
    btnContainer: {
        position: 'absolute',
        height: 32,
        width: 235,
        left: 0,
        bottom: 0,
        flexDirection: 'row',
    },
    tabContainer: {
        height: 30,
        marginTop: 22,
        marginHorizontal: 10,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: CONSTANTS.THEME_COLOR,
        flexDirection: 'row',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
    },
    themeContainer: {
        height: 30,
        marginTop: 22,
        width: 162,
        marginLeft: (sr.w - 162) / 2,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: CONSTANTS.THEME_COLOR,
    },
    tabButton: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
        borderRadius: 15,
    },
    tabBtn: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
    },
    tabText: {
        fontSize: 14,
    },
    itemContainer: {
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headContainer: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    headImage: {
        width: 36,
        height: 36,
        marginLeft: 22,
        borderRadius: app.isandroid ? 36 * 4 : 18,
    },
    dateText: {
        fontSize: 16,
        color: '#555555',
        marginRight: 25,
    },
    makeup: {
        backgroundColor:CONSTANTS.THEME_COLOR,
        top: 0,
        width: 15,
        height: 30,
        position: 'absolute',
    },
});
