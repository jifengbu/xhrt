'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
    ScrollView,
    Text,
    Image,
    TouchableOpacity,
} = ReactNative;

import Swiper from 'react-native-swiper2';
var AddPurchase = require('./AddPurchase.js');
var WriteOrder = require('../order/WriteOrder.js');
var IndexBottom = require('./indexBottom.js');
var ShopIntroduce = require('./ShopIntroduce.js');
var CommentBigImage = require('./CommentBigImage.js');
var UmengMgr = require('../../../manager/UmengMgr.js');
var Call = require('@remobile/react-native-call');

var {Button, ActionSheet} = COMPONENTS;

module.exports = React.createClass({
    statics: {
        title: '商品详情',
    },
    getInitialState() {
        return {
            merchandisingData:{},
            changePage: true,
            lineWidth: 0,
            lineHeight: 0,
            tabIndex: 0,
        };
    },
    doClose() {
        this.setState({overlayShow:false});
    },
    showBuyDialog(merchandisingData) {
        this.setState({overlayShow:true, merchandisingData: this.state.merchandisingData});
    },
    componentDidMount() {
        this.getGoodsDetail();
    },
    getGoodsDetail() {
        var param = {
            goodsID: this.props.goodsID,
        };
        POST(app.route.ROUTE_GET_GOODS_DETAIL, param, this.getGoodsDetailSuccess, true);
    },
    getGoodsDetailSuccess(data) {
        if (data.success) {
            this.getMerchandising();
            this.setState({goodsDetail: data.context});
        } else {
            Toast(data.msg);
        }
    },
    getMerchandising() {
        var param = {
            goodsID: this.props.goodsID,
        };
        POST(app.route.ROUTE_MERCHANDISING, param, this.getMerchandisingSuccess);
    },
    getMerchandisingSuccess(data) {
        if (data.success) {
            this.isFlag = false;
            if (this.props.buyType == 1) {
                this.isFlag = true;
            }
            this.setState({merchandisingData: data.context, overlayShow: this.isFlag});
        } else {
            Toast(data.msg);
        }
    },
    gotoWriteOrderView(selectArray, totalPrice) {
        this.setState({overlayShow:false});
        selectArray.unshift(this.props.goodsID);
        var selectStr = selectArray.join('-');
        app.navigator.push({
            component: WriteOrder,
            passProps: {totalPrice: totalPrice, goodsInfo: this.state.goodsDetail,selectStr:selectStr},
        });
    },
    changeTab(tabIndex) {
        this.setState({tabIndex});
    },
    showBigImage(imageArray, index) {
        app.showModal(
            <CommentBigImage
                doImageClose={app.closeModal}
                defaultIndex={index}
                defaultImageArray={imageArray}>
            </CommentBigImage>
        );
    },
    render() {
        return (
          <View style={styles.container}>
              {
                  (this.state.goodsDetail == null) ?
                  null
                  :
                  <View style={styles.container}>
                  {
                    this.state.changePage?
                      <View style={styles.container}>
                          <ScrollView
                              style={styles.container}
                              onScroll={(e) => {
                                      if (e.nativeEvent.contentOffset.y > 2) {
                                          this.setState({changePage: false});
                                      }
                                  }
                              }>
                              <this.TopView />
                          </ScrollView>
                          <this.BottomView/>
                      </View>:
                      <View style={styles.container}>
                          <View style={styles.changeTabContainer}>
                              <TouchableOpacity
                                  onPress={this.changeTab.bind(null, 0)}
                                  style={styles.tabButtonLeft}>
                                  <Text style={[styles.tabText, this.state.tabIndex===0?{color:'#ff3c30'}:null]} >商品介绍</Text>
                                  {this.state.tabIndex===0&&<View style={[styles.makeup, {right:0}]}></View>}
                              </TouchableOpacity>
                              <TouchableOpacity
                                  onPress={this.changeTab.bind(null, 1)}
                                  style={styles.tabButtonCenter}>
                                  <Text style={[styles.tabText, this.state.tabIndex===1?{color:'#ff3c30'}:null]} >购买评价</Text>
                              </TouchableOpacity>
                          </View>
                          <ScrollView
                              style={styles.container}
                              onScroll={(e) => {
                                  if (e.nativeEvent.contentOffset.y < 0) {
                                      this.setState({changePage: true});
                                  }
                                }
                              }>
                              <IndexBottom noticeShow={this.showBigImage} goodsDetail={this.state.goodsDetail} goodsID={this.props.goodsID} tabIndex={this.state.tabIndex}/>
                          </ScrollView>
                          <this.BottomView/>
                      </View>
                  }
                </View>
          }
          {
              this.state.overlayShow &&
              <AddPurchase
                  goodsID={this.props.goodsID}
                  merchandisingData={this.state.merchandisingData}
                  doClose={this.doClose}
                  gotoWriteOrderView={this.gotoWriteOrderView}>
              </AddPurchase>
          }
          <this.ActionSheetViewItem/>
      </View>
        );
    },

    _measureLineWidth(e) {
      if (!this.state.lineWidth) {
          var {width, height} = e.nativeEvent.layout;
          this.setState({lineWidth: width, lineHeight: height});
      }
    },

    //商品介绍
    TopView() {
        var lineHeight = this.state.lineHeight/2;
        return (
          <View style={styles.container}>
              <Swiper
                  paginationStyle={styles.paginationStyle}
                  height={sr.ws(300)}>
                  {
                      this.state.goodsDetail.bannerArray.map((item, i)=>{
                          return (
                              <Image
                                  key={i}
                                  resizeMode='stretch'
                                  defaultSource={app.img.common_default}
                                  source={{uri: item}}
                                  style={styles.bannerImage}
                                  />
                          )
                      })
                  }
              </Swiper>
              <View style={styles.separator}/>
              <View style={{flexDirection: 'row'}}>
                  <Text style={[styles.titleText, {color: '#ff3c30'}]}>{this.state.goodsDetail.goodsLable}</Text>
                  <Text style={[styles.titleText, {color: '#333333', marginRight: 8, flex: 1}]}>{this.state.goodsDetail.goodsDec}</Text>
              </View>
              <Text style={styles.detailText}>
                  {this.state.goodsDetail.detailDec}
              </Text>
              <View style={styles.priceContainer}>
                  <View style={{flexDirection: 'row', flex: 4, alignSelf: 'flex-start'}}>
                      <Text style={{color: '#333333', fontSize: 20, fontWeight: 'bold'}}>
                          {'专享价:'}
                      </Text>
                      <Text style={{color: '#ff3c30', fontSize: 20, fontWeight: 'bold'}}>
                          {'￥'+this.state.goodsDetail.goodsPrice}
                      </Text>
                      <View style={{marginLeft: 10, alignSelf: 'center'}}>
                          <View style={styles.container}>
                              <Text onLayout={this._measureLineWidth} style={{color: '#666666', fontSize: 10}}>
                                  {'原价:￥'+ this.state.goodsDetail.goodsSale}
                              </Text>
                              <View style={{height: 1, width: this.state.lineWidth, backgroundColor: '#666666', position: 'absolute', bottom: lineHeight}}></View>
                          </View>
                      </View>
                  </View>
                  <View style={{flex: 1, alignSelf: 'center'}}>
                      <Text style={styles.soldText}>
                          {'已售:'+this.state.goodsDetail.sales+'件'}
                      </Text>
                  </View>
              </View>
              <View style={styles.separator}/>
              <TouchableOpacity style={styles.choiceContainer} onPress={this.showBuyDialog}>
                  <Text style={{fontSize: 14, color: '#666666', alignSelf: 'flex-start'}}>{'选择产品款式和种类'}</Text>
                  <View style={{flex: 1}}>
                      <Image
                          resizeMode='stretch'
                          source={app.img.common_go}
                          style={styles.goChoiceImg}>
                      </Image>
                  </View>
              </TouchableOpacity>
              <View style={styles.separator}/>
              <View style={styles.divisionContainer}>
                  <View style={styles.divisionSeparator}/>
                  <Text style={{fontSize: 12}, {color: '#b4b4b4', marginHorizontal: 3}}>{'上拉查看详细产品介绍'}</Text>
                  <View style={styles.divisionSeparator}/>
              </View>
          </View>
        )
    },

    _onPressRow(index) {
        switch (index) {
          case 0:
            this.doShowActionSheet();
            break;
          case 1:
            app.navigator.push({
                component: ShopIntroduce,
                passProps: {shopID: this.state.goodsDetail.shopID},
            });
            break;
          case 2:
            this.doShare();
            break;
          case 3:
            this.showBuyDialog();
            break;
          default:

        }
    },
    callPhone(data) {
        this.doCloseActionSheet();
        Call.callNumber(()=>{
          }, ()=>{
          },
          "085186810083",
          true,
        );
    },
    doCloseActionSheet() {
        this.setState({actionSheetVisible:false});
    },
    doShowActionSheet() {
        this.setState({actionSheetVisible:true});
    },
    doShare() {
        UmengMgr.doActionSheetShare(CONSTANTS.SHARE_APPDOWNLOAD_SERVER,'应用分享','来源于商场','web',CONSTANTS.SHARE_IMGDIR_SERVER+'study-video.png',this.doShareCallback);
    },
    doShareCallback() {
        // var param = {
        //     userID:this.state.personinfo.userID,
        //     shareType:0, //0-分享视频 1-分享抽奖 2-分享战果
        //     keyword:this.props.data.name,
        // };
        // POST(app.route.ROUTE_DO_SHARE, param, this.doSuccess.bind(null, 2));
    },
    //底部按钮
    BottomView() {
        return (
            <View style={styles.bottomContainer}>
            <View style={{backgroundColor: '#666666', flex: 2, flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={this._onPressRow.bind(null, 0)} style={{flex: 2, alignItems: 'center'}}>
                    <Image
                        resizeMode='stretch'
                        source={app.img.mall_customer_service_icon}
                        style={styles.iconStyle}>
                    </Image>
                    <Text style={styles.btnText}>
                        {'客服'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this._onPressRow.bind(null, 1)} style={{flex: 2, alignItems: 'center'}}>
                    <Image
                        resizeMode='stretch'
                        source={app.img.mall_business_ntroduction_icon}
                        style={styles.iconStyle}>
                    </Image>
                    <Text style={styles.btnText}>
                        {'商家介绍'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this._onPressRow.bind(null, 2)} style={{flex: 2, alignItems: 'center'}}>
                    <Image
                        resizeMode='stretch'
                        source={app.img.mall_share_icon}
                        style={styles.iconStyle}>
                    </Image>
                    <Text style={styles.btnText}>
                        {'分享产品'}
                    </Text>
                </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={this._onPressRow.bind(null, 3)} style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ff3c30'}}>
                    <Text style={[styles.btnText, {fontSize: 18}]}>
                        {'购买'}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    },
    //底部ActionSheet
    ActionSheetViewItem() {
        return (
            <ActionSheet
                visible={this.state.actionSheetVisible}
                cancelText="取   消"
                onCancel={this.doCloseActionSheet} >
                <ActionSheet.Button onPress={this.callPhone}>085186810083</ActionSheet.Button>
            </ActionSheet>
        )
    },
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    paginationStyle: {
        bottom: 30,
    },
    bannerImage: {
        width: sr.w,
        height: 300,
    },
    separator: {
        height: 1,
        width: sr.w,
        marginVertical: 15,
        backgroundColor: '#b4b4b4'
    },
    specificationsTitleText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#333333',
        fontWeight: 'bold',
    },
    detailText: {
        width: sr.w-20,
        color: '#ff3c30',
        fontSize: 12,
        marginHorizontal: 8,
        marginTop: 10,
    },
    priceContainer: {
        marginLeft: 8,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    choiceContainer: {
        marginHorizontal: 8,
        width: sr.w-16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    goChoiceImg: {
        height: 20,
        width: 10,
        alignSelf: 'flex-end',
    },
    divisionContainer: {
        flexDirection: 'row',
        width: sr.w-100,
        marginTop: 15,
        alignItems: 'center',
        alignSelf: 'center',
    },
    divisionSeparator: {
        height: 1,
        flex: 1,
        alignSelf: 'center',
        backgroundColor: '#b4b4b4',
    },
    bottomContainer: {
        width: sr.w,
        height: 50,
        flexDirection: 'row',
        bottom: 0,
    },
    titleText: {
        fontSize: 16,
        marginLeft: 8,
        fontWeight: 'bold',
    },
    soldText: {
        fontSize: 10,
        color: '#666666',
        alignSelf: 'flex-end',
        marginRight: 10,
    },
    iconStyle: {
        width: 25,
        height: 25,
    },
    btnText: {
        color: 'white',
    },
    changeTabContainer: {
        height: 40,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    tabButtonLeft: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
    },
    tabButtonCenter: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
    },
    tabText: {
        fontSize: 16,
    },
});
