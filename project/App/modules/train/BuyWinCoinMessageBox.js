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
let currentWinCoinData = {};

module.exports = React.createClass({
    doPayWechat () {
        this.closeModal(() => {
            this.props.doPayWechat(currentWinCoinData.winCoinID);
        });
    },
    doPayAlipay () {
        this.closeModal(() => {
            this.props.doPayAlipay(currentWinCoinData.winCoinID, currentWinCoinData.price);
        });
    },
    getInitialState () {
        return {
            tabIndex: 0,
            checked:false,
            opacity: new Animated.Value(0),
            winCoinList: [],
        };
    },
    componentDidMount () {
        this.getWinCoinGoods();
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 500,
        }
        ).start();
    },
    doSaveCurrentWinCoinData (data, i) {
        for (let index in this.state.winCoinList) {
            if (index == i) {
                this.state.winCoinList[index]['checked'] = true;
            } else {
                this.state.winCoinList[index]['checked'] = false;
            }
        }
        this.setState({ checked:!this.state.checked });
        currentWinCoinData = data;
    },
    doClose () {
        this.closeModal(() => {
            this.props.doClose();
        });
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
                <View style={styles.container}>
                    <View style={styles.panelContainer}>
                        <Text style={styles.title}>1人民币=1赢销币，您当前的赢销币为：</Text>
                        <Text style={styles.winCoinTitle}>{app.personal.info.winCoin}</Text>
                        <View style={styles.hLine} />
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
                                                  style={styles.bannerImage}>
                                                  {
                                                          item.checked &&
                                                          <Image
                                                              resizeMode='contain'
                                                              source={app.img.common_check} />
                                                      }
                                              </Image>
                                          </TouchableOpacity>
                                      );
                                  })
                              }
                                </View>
                            </ScrollView>
                            <View style={styles.hLine} />
                        </View>
                        <View style={styles.trainRankButtonView}>
                            <Button onPress={this.doPayWechat} style={styles.trainRankButton}>微信支付</Button>
                            <Button onPress={this.doPayAlipay} style={styles.trainRankButton}>支付宝支付</Button>
                        </View>
                    </View>
                    <TouchableHighlight
                        onPress={this.doClose}
                        underlayColor='rgba(0, 0, 0, 0)'
                        style={styles.touchableHighlight}>
                        <Image
                            resizeMode='contain'
                            source={app.img.draw_back}
                            style={styles.closeIcon} />
                    </TouchableHighlight>
                </View>
            </Animated.View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        alignItems:'center',
        justifyContent:'center',
    },
    panelContainer: {
        alignSelf: 'center',
        alignItems:'center',
        justifyContent:'center',
        paddingTop: 30,
        paddingBottom: 10,
        borderRadius: 6,
        width:sr.w * 6 / 7,
        backgroundColor:'white',
    },
    title: {
        flexDirection:'row',
        width:sr.w * 5 / 6,
        color: 'gray',
        backgroundColor:'white',
        fontSize: 14,
        textAlign:'center',
        overflow: 'hidden',
        marginTop: 5,
    },
    winCoinTitle: {
        alignSelf: 'center',
        justifyContent: 'center',
        fontSize: 15,
        color:'red',
    },
    recordBottomView: {
        width:sr.w * 5 / 6,
        height:180,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'white',
        marginTop: 10,
    },
    scrollViewStyle: {
        width: sr.w * 5 / 6,
        height: 120,
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
    trainRankButtonView: {
        width:sr.w * 5 / 6,
        height:80,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'white',
    },
    trainRankButton: {
        width:120,
        height:50,
        marginHorizontal:20,
    },
    tabContainer: {
        width:sr.w * 5 / 6,
        height: 50,
        marginTop: 10,
        marginHorizontal: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#4FC1E9',
        flexDirection: 'row',
        overflow: 'hidden',
        backgroundColor:'white',
    },
    tabButtonLeft: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
        borderTopLeftRadius: 10,
    },
    tabButtonRight: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
        borderTopRightRadius: 10,
    },
    hLine: {
        width:sr.w * 5 / 6 - 20,
        height:2,
        paddingHorizontal:10,
        backgroundColor: '#CCC',
    },
    bannerImage: {
        width:110,
        height: 150,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
    },
    wrapper: {
        width:sr.w * 5 / 6,
        height: 150,
        alignSelf:'center',
        marginHorizontal:2,
    },
    touchableHighlight: {
        position:'absolute',
        top:0,
        left:sr.w * 7 / 8 - 30,
        width: 30,
        height: 30,
        marginTop:-8,
    },
    closeIcon: {
        width: 30,
        height: 30,
    },
});
