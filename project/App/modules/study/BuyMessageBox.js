'use strict';

const React = require('react');
const {
    PropTypes,
} = React;
const ReactNative = require('react-native');
const {
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    Animated,
    View,
    ScrollView,
    TouchableHighlight,
} = ReactNative;

const Swiper = require('react-native-swiper');

const { Button } = COMPONENTS;

module.exports = React.createClass({
    doPayWechat () {
        if (!this.currentWinCoinData) {
            Toast('请先选择要购买的赢销币套餐');
            return;
        } else {
            this.closeModal(() => {
                this.props.doPayWechat(this.currentWinCoinData.winCoinID);
            });
        }
    },
    doPayAlipay () {
        if (!this.currentWinCoinData) {
            Toast('请先选择要购买的赢销币套餐');
            return;
        } else {
            this.closeModal(() => {
                this.props.doPayAlipay(this.currentWinCoinData.winCoinID, this.currentWinCoinData.price);
            });
        }
    },
    getInitialState () {
        return {
            tabIndex: this.props.costType,
            checkedWinCoin:false,
            checkedIntegral:false,
            opacity: new Animated.Value(0),
            integralList: this.props.integralList,
            winCoinList: this.props.winCoinList,
        };
    },
    componentDidMount () {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 500,
        }
    ).start();
    },
    doClose () {
        this.closeModal(() => {
            this.props.doClose();
        });
    },
    doExchangeIntegral () {
        if (!this.currentIntegralData) {
            Toast('请先选择要兑换的积分');
            return;
        } else {
            this.closeModal(() => {
                this.props.doExchangeIntegral(this.currentIntegralData);
            });
        }
    },
    doSaveCurrentWinCoinData (data, i) {
        for (let index in this.state.winCoinList) {
            if (index == i) {
                this.state.winCoinList[index]['checkedWinCoin'] = true;
            } else {
                this.state.winCoinList[index]['checkedWinCoin'] = false;
            }
        }
        this.setState({ checkedWinCoin:!this.state.checkedWinCoin });
        this.currentWinCoinData = data;
    },
    doSaveCurrentIntegralData (data, i) {
        for (let index in this.state.integralList) {
            if (index == i) {
                this.state.integralList[index]['checkedIntegral'] = true;
            } else {
                this.state.integralList[index]['checkedIntegral'] = false;
            }
        }
        this.setState({ checkedIntegral:!this.state.checkedIntegral });
        this.currentIntegralData = data;
    },
    closeModal (callback) {
        Animated.timing(this.state.opacity, {
            toValue: 0,
            duration: 500,
        }
).start(() => {
    callback();
});
    },
    changeTab (tabIndex) {
        if (tabIndex === 0) {
            this.getIntegralGoods();
        } else {
            this.getWinCoinGoods();
        }
    },
    getIntegralGoods () {
        const param = {
            userID: app.personal.info.userID,
        };
        POST(app.route.ROUTE_GET_INTEGRAL_GOODS, param, this.getIntegralGoodsSuccess);
    },
    getIntegralGoodsSuccess (data) {
        if (data.success) {
            const integralList = data.context.integralList || [];
            this.setState({ integralList });
            this.setState({ tabIndex:0 });
        } else {
            Toast(data.msg);
        }
    },
    getWinCoinGoods () {
        const param = {
            userID: app.personal.info.userID,
        };
        POST(app.route.ROUTE_GET_WIN_COIN_GOODS, param, this.getWinCoinGoodsSuccess);
    },
    getWinCoinGoodsSuccess (data) {
        if (data.success) {
            const winCoinList = data.context.winCoinList || [];
            this.setState({ winCoinList:winCoinList });
            this.setState({ tabIndex:1 });
        } else {
            Toast(data.msg);
        }
    },
    render () {
        return (
            <Animated.View style={[styles.overlayContainer, { opacity: this.state.opacity }]}>
                <TouchableOpacity onPress={this.doClose} style={styles.container}>
                    <View style={styles.panelContainer}>
                        <View style={styles.tabContainer}>
                            <TouchableOpacity
                                onPress={this.changeTab.bind(null, 0)}
                                style={[styles.tabButtonLeft, this.state.tabIndex === 0 ? { backgroundColor:CONSTANTS.THEME_COLOR } : { backgroundColor:'#FFFFFF' }]}>
                                <Text style={[styles.tabText, this.state.tabIndex === 0 ? { color:'#FFFFFF' } : { color:CONSTANTS.THEME_COLOR }]} >{'积分充值'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={this.changeTab.bind(null, 1)}
                                style={[styles.tabButtonRight, this.state.tabIndex === 1 ? { backgroundColor:CONSTANTS.THEME_COLOR } : { backgroundColor:'#FFFFFF' }]}>
                                <Text style={[styles.tabText, this.state.tabIndex === 1 ? { color:'#FFFFFF' } : { color:CONSTANTS.THEME_COLOR }]} >{'赢销币充值'}</Text>
                            </TouchableOpacity>
                        </View>
                        {this.state.tabIndex === 0 ?
                            <View style={styles.midContainer}>
                                <View style={styles.titleView}>
                                    <Text style={styles.title}>{'1赢销币＝100积分，您当前的积分为：'}</Text>
                                    <Text style={styles.winCoinTitle}>{app.personal.info.integral}</Text>
                                </View>
                                <View style={styles.lineView} />
                                <View style={[styles.promptTitle, { marginTop: 15}]}>
                                    <Text style={styles.promptText}>{'请选择您要兑换的套餐：'}</Text>
                                </View>
                                <View style={styles.recordBottomView}>
                                    <ScrollView style={styles.scrollViewStyle} showsHorizontalScrollIndicator horizontal>
                                        <View style={{ flexDirection: 'row' }}>
                                            { this.state.integralList.map((item, i) => {
                                                return (
                                                    <TouchableOpacity key={i} onPress={this.doSaveCurrentIntegralData.bind(null, item, i)}>
                                                        <Image
                                                            resizeMode='stretch'
                                                            defaultSource={app.img.common_default}
                                                            source={{ uri:item.integralImg }}
                                                            style={styles.bannerImage} />
                                                        {
                                                        item.checkedIntegral &&
                                                        <Image
                                                            resizeMode='contain'
                                                            style={styles.checkImage}
                                                            source={app.img.specops_tick} />
                                                    }
                                                    </TouchableOpacity>
                                                );
                                            })
                                    }
                                        </View>
                                    </ScrollView>
                                </View>
                                <View style={styles.lineView} />
                                <Button onPress={this.doExchangeIntegral} style={styles.btnView}>
                                    {'确       定'}
                                </Button>
                            </View>
                    :
                            <View style={styles.midContainer}>
                                <View style={styles.titleView}>
                                    <Text style={styles.title}>{'1人民币=1赢销币，您当前的赢销币为：'}</Text>
                                    <Text style={styles.winCoinTitle}>{app.personal.info.winCoin}</Text>
                                </View>
                                <View style={[styles.promptTitle, { marginTop: 10 }]}>
                                    <Text style={styles.promptText}>{'请选择您要充值的套餐：'}</Text>
                                </View>
                                <View style={styles.recordBottomView}>
                                    <ScrollView style={styles.scrollViewStyle} showsHorizontalScrollIndicator={false} horizontal>
                                        <View style={{ flexDirection: 'row' }}>
                                            {
                                        this.state.winCoinList.map((item, i) => {
                                            return (
                                                <TouchableOpacity key={i} onPress={this.doSaveCurrentWinCoinData.bind(null, item, i)}>
                                                    <Image
                                                        resizeMode='stretch'
                                                        defaultSource={app.img.common_default}
                                                        source={{ uri:item.winCoinImg }}
                                                        style={styles.bannerImage} />
                                                    {
                                                        item.checkedWinCoin &&
                                                        <Image
                                                            resizeMode='contain'
                                                            style={styles.checkImage}
                                                            source={app.img.specops_tick} />
                                                    }
                                                </TouchableOpacity>
                                            );
                                        })
                                    }
                                        </View>
                                    </ScrollView>
                                </View>
                                <View style={styles.bottomContainer}>
                                    <View style={[styles.promptTitle, {marginTop: 10}]}>
                                        <Text style={styles.promptText}>{'请选择您的支付方式：'}</Text>
                                    </View>
                                    <View style={styles.imageContainer}>
                                        <View style={styles.touchContainer}>
                                            <TouchableHighlight
                                                onPress={this.doPayWechat}
                                                underlayColor='rgba(0, 0, 0, 0)'>
                                                <Image
                                                    resizeMode='stretch'
                                                    source={app.img.login_weixin_button}
                                                    style={styles.payImage} />
                                            </TouchableHighlight>
                                            <Text style={styles.payTitleText}>{'微信支付'}</Text>
                                        </View>
                                        <View style={styles.touchContainer}>
                                            <TouchableHighlight
                                                onPress={this.doPayAlipay}
                                                underlayColor='rgba(0, 0, 0, 0)'>
                                                <Image
                                                    resizeMode='stretch'
                                                    source={app.img.login_alipay_button}
                                                    style={styles.payImage} />
                                            </TouchableHighlight>
                                            <Text style={styles.payTitleText}>{'支付宝支付'}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                }
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
    },
    panelContainer: {
        width:sr.w * 5 / 6 + 20,
        height: sr.h/2+10,
        marginBottom: 20,
        borderRadius: 6,
        backgroundColor:'#FFFFFF',
        alignItems:'center',
        justifyContent:'center',
    },
    titleView: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        flexDirection:'row',
        color: '#555555',
        backgroundColor:'white',
        fontSize: 12,
        fontWeight: '400',
        textAlign:'center',
        overflow: 'hidden',
    },
    winCoinTitle: {
        alignSelf: 'center',
        justifyContent: 'center',
        fontSize: 15,
        color: CONSTANTS.THEME_COLOR,
    },
    lineView: {
        width:sr.w * 5 / 6,
        alignSelf: 'center',
        height: 1,
        marginTop: 20,
        backgroundColor: '#EEEEEE',
    },
    btnView: {
        width:sr.w * 5 / 6 + 20,
        height: 40,
        left: 0,
        bottom: 0,
        position: 'absolute',
        borderRadius: 0,
        backgroundColor: CONSTANTS.THEME_COLOR,
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
    },
    recordBottomView: {
        width:sr.w * 5 / 6,
        height:110,
        justifyContent:'center',
        backgroundColor:'white',
    },
    scrollViewStyle: {
        width: sr.w * 5 / 6,
        height: 110,
    },
    overlayContainer: {
        position:'absolute',
        bottom: 0,
        alignItems:'center',
        justifyContent: 'center',
        width:sr.w,
        height:sr.h,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    tabContainer: {
        width:sr.w * 5 / 6 + 20,
        height: 40,
        borderWidth: 2,
        borderTopRightRadius: 6,
        borderTopLeftRadius: 6,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderColor: CONSTANTS.THEME_COLOR,
        flexDirection: 'row',
        overflow: 'hidden',
        backgroundColor:'white',
    },
    midContainer: {
        width:sr.w * 5 / 6 + 20,
        height: sr.h/2-30,
    },
    tabButtonLeft: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
    },
    tabButtonRight: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
    },
    tabText: {
        fontSize: 16,
        fontWeight: '300',
    },
    promptTitle: {
        marginBottom: 10,
        marginLeft: 10,
    },
    promptText: {
        fontSize: 10,
        fontWeight: '400',
        color: '#999999',
    },
    bottomContainer: {
        width:sr.w * 5 / 6 + 20,
        height: 120,
        left: 0,
        bottom: 0,
        position: 'absolute',
    },
    imageContainer: {
        width:sr.w * 5 / 6 + 20,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
    },
    touchContainer: {
        marginHorizontal: 40,
        alignItems: 'center',
    },
    payImage: {
        width:50,
        height:50,
    },
    payTitleText: {
        fontSize: 10,
        color: '#999999',
        marginTop: 5,
    },
    bannerImage: {
        width:80,
        height: 100,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
    },
    checkImage: {
        width: 25,
        height: 25,
        position: 'absolute',
        right: 0,
        bottom: 0,
    },
    touchableHighlight: {
        position:'absolute',
        top:-12,
        left:sr.w * 5 / 6 + 18 - 20,
        width: 38,
        height: 38,
    },
    closeIcon: {
        width: 38,
        height: 38,
    },
});
