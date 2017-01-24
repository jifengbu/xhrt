'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    AppState,
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
} = ReactNative;

var Subscribable = require('Subscribable');
var TimerMixin = require('react-timer-mixin');
var AlipayMgr = require('../../../manager/AlipayMgr.js');
var WXpayMgr = require('../../../manager/WXpayMgr.js');
var CommodityDetail = require('../commodityDetail/index.js');
var AddressManager = require('./AddressManager.js');

var {Button} = COMPONENTS;
var WXpayOrderNo = 0;
var AlipayOrderNo = 0;

module.exports = React.createClass({
    mixins: [Subscribable.Mixin, TimerMixin],
    statics: {
        title: '填写订单',
    },
    componentWillMount() {
        this.addListenerOn(WXpayMgr, 'WXIPAY_RESULTS', (param)=>{
            this.setState({payWXStatus:false});
            if (param.state == 'success' && WXpayOrderNo==param.orderNo) {
                this.wechatPayConfirm(param.orderNo);
            } else {
                Toast(param.message);
            }
        });
        this.addListenerOn(AlipayMgr, 'ALIPAY_RESULTS', (param)=>{
            if (param.state == 'success' && AlipayOrderNo==param.orderNo) {
                this.aliPayConfirm(param.orderNo,param.price);
            } else {
                Toast('支付宝支付失败');
            }
        });
    },
    aliPayConfirm(tradeNo,price) {
        var param = {
            orderNo: tradeNo,
            price: price,
        };
        POST(app.route.ROUTE_ALIPAY_CONFIRM, param, this.aliPayConfirmResult);
    },
    aliPayConfirmResult(data) {
        Toast(data.msg);
        if (data.success) {
            app.navigator.pop();
        }
    },
    wechatPayConfirm(tradeNo) {
        var param = {
            orderNo: tradeNo,
        };
        POST(app.route.ROUTE_WECHATPAY_CONFIRM, param, this.wechatPayConfirmResult);
    },
    wechatPayConfirmResult(data) {
        Toast(data.msg);
        if (data.success) {
            app.navigator.pop();
        }
    },
    componentDidMount: function() {
      AppState.addEventListener('change', this._handleAppStateChange);
      this.getOrderData();
    },
    componentWillUnmount: function() {
      AppState.removeEventListener('change', this._handleAppStateChange);
    },
    _handleAppStateChange: function(currentAppState) {
      this.setState({ currentAppState, });
      console.log(this.state.currentAppState);
      if (this.state.currentAppState == 'active' && this.state.payWXStatus == true) {
          this.setState({payWXStatus:false});
          WXpayMgr.checkPayResult();
      }
    },
    getInitialState() {
        return {
            payWXStatus:false,
            currentAppState: AppState.currentState,
            orderData:{},
            placeOrderData:{
                paymethod: 2,
                isNeedInvoice:0,
                invoice:'',
                price:this.props.totalPrice,
                attribute:this.props.selectStr,
                userID:app.personal.info.userID,
                addNo:0,
                addr: '',
                name: '',
                phone: '',
              }
        };
    },
    getOrderData() {
        var param = {
            userID: app.personal.info.userID,
            goodsID: this.props.goodsInfo.goodsID,
        };
        POST(app.route.ROUTE_ORDER_DATA, param, this.getOrderDataSuccess, true);
    },
    getOrderDataSuccess(data) {
        if (data.success) {
            this.setState({orderData: data.context});
            this.state.placeOrderData.addNo = this.state.orderData.addNo;
            this.state.placeOrderData.addr = this.state.orderData.addr;
            this.state.placeOrderData.name = this.state.orderData.name;
            this.state.placeOrderData.phone = this.state.orderData.phone;
            console.log(this.state.orderData);
        } else {
            Toast(data.msg);
        }
    },
    placeOrderData() {
        if (this.state.orderData.name == '' || this.state.orderData.name == null
            && this.state.orderData.phone == '' || this.state.orderData.phone == null
            && this.state.orderData.addr == '' || this.state.orderData.addr == null) {
            Toast('请输入您的收货地址');
            return;
        }
        POST(app.route.ROUTE_PLACE_ORDER, this.state.placeOrderData, this.placeOrderDataSuccess, true);
    },
    placeOrderDataSuccess(data) {
        if (data.success) {
            if (this.state.placeOrderData.paymethod==2) {
                AlipayOrderNo = data.context.orderNo;
                AlipayMgr.getaliPayInfo("购买商品",data.context.orderNo,this.props.totalPrice);
            } else if (this.state.placeOrderData.paymethod==1) {
                WXpayOrderNo = data.context.orderNo;
                this.setState({payWXStatus:true});
                WXpayMgr.getWXPayInfo(app.personal.info.userID,data.context.orderNo);
            }
        } else {
            Toast(data.msg);
        }
    },
    goLogisticsList() {
        var Module = require('./LogisticsList.js');
        app.showModal(
            <Module />,
            {title: '物流信息'}
        );
    },
    updateAddr(addr) {
        this.setState({orderData: addr.orderData})
        this.state.placeOrderData.addNo = this.state.orderData.addNo;
        this.state.placeOrderData.addr = this.state.orderData.addr;
        this.state.placeOrderData.name = this.state.orderData.name;
        this.state.placeOrderData.phone = this.state.orderData.phone;
    },
    gotoAddressManager() {
        app.navigator.push({
            component: AddressManager,
            passProps: {updateAddr: this.updateAddr},
        });
    },
    changePaymethod(value) {
        var data = this.state.placeOrderData;
        data.paymethod==value?data.paymethod=0:data.paymethod=value;
        this.setState({placeOrderData:data});
    },
    changeInvoice(value) {
        var data = this.state.placeOrderData;
        data.isNeedInvoice==value?data.isNeedInvoice=!value:data.isNeedInvoice=value;
        this.setState({placeOrderData:data});
    },
    render() {
        return (
            <View style={styles.mainContainer}>
                <ScrollView>
                    <this.ReceivingInfoItem/>
                    <this.GoodsInfoItem />
                    <this.payWayInfoItem />
                    <this.invoiceInfoItem />
                    <this.GoodsPriceInfoItem />
               </ScrollView>
               <this.BottomViewItem/>
          </View>

        )
    },
    goGoodsDetailView() {
        app.navigator.push({
            component: CommodityDetail,
            passProps: {goodsID: this.props.goodsInfo.goodsID},
        });
    },
    //收货信息
    ReceivingInfoItem() {
        return (
            <View style={styles.ReceivingInfoViewStyle}>
                    <View style={{flexDirection: 'column',}}>
                        <View style={styles.profitTitle}>
                            <View style={styles.profitTitle_Name}>
                                <Text style={styles.orderPersonNameText}>{'收货人: '}{this.state.orderData.name}</Text>
                            </View>
                            <View style={styles.profitTitle_Code}>
                                <Text style={styles.orderPersonPhoneText}>{this.state.orderData.phone}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={this.gotoAddressManager}>
                            <View style={{flexDirection:'row',marginTop: 10,}}>
                                <Image
                                    resizeMode='contain'
                                    source={app.img.mall_address_icon}
                                    style={styles.address_icon_style} />
                                <Text style={styles.addressTextStyle}>{'收货地址: '}{this.state.orderData.addr}</Text>
                                <View style={styles.rightViewGoStyle}>
                                    <Image
                                        resizeMode='stretch'
                                        source={app.img.common_go}
                                        style={styles.right_go_style1} />
                                </View>
                            </View>
                            <Text style={styles.addressSubTextStyle}>(请仔细核查收货地址，或点击修改为最新收货地址)</Text>
                        </TouchableOpacity>
                    </View>
            </View>
        )
    },
    //商品信息
    GoodsInfoItem() {
        return (
              <TouchableOpacity onPress={this.goGoodsDetailView} style={styles.goodsInfoViewStyle}>
                  <View style={styles.goodsImgStyle}>
                      <Image
                          resizeMode='stretch'
                          source={{uri:this.props.goodsInfo.goodsImg}}
                          style={styles.shopImgStyle} />
                  </View>
                  <View style={styles.goodsContentStyle}>
                      <Text numberOfLines={3} style={styles.goodsName}>{this.props.goodsInfo.goodsDec}</Text>
                      <Text style={[styles.goodsName, {color: '#ff3c30'}]}>{'￥ '+this.props.goodsInfo.goodsPrice}</Text>
                  </View>
                  <View style={styles.rightViewGoStyle}>
                      <Image
                          resizeMode='stretch'
                          source={app.img.common_go}
                          style={styles.right_go_style1} />
                  </View>
              </TouchableOpacity>
        )
    },

    //请选择支付方式
    payWayInfoItem() {
        return (
              <View style={styles.logisticsListViewStyle}>
                  <View style={styles.payWayViewStyle}>
                      <View style={styles.profitTitle_Name}>
                          <Text style={styles.payWayTextStyle}>{'请选择支付方式'}</Text>
                      </View>
                  </View>
                  <View style={styles.logisticsListInfoViewStyle}>
                      <View style={styles.profitTitle_Name}>
                      <TouchableOpacity onPress={this.changePaymethod.bind(this,1)}>
                          <Image
                              resizeMode='cover'
                              source={this.state.placeOrderData.paymethod==1?app.img.common_check:app.img.common_no_check}
                              style={styles.payCheckBox}
                              />
                      </TouchableOpacity>
                          <Text style={styles.payWayContentStyle}>{'微信支付'}</Text>
                      </View>
                      <View style={styles.profitTitle_Code}>
                      <TouchableOpacity onPress={this.changePaymethod.bind(this,2)}>
                          <Image
                              resizeMode='cover'
                              source={this.state.placeOrderData.paymethod==2?app.img.common_check:app.img.common_no_check}
                              style={styles.payCheckBox}
                              />
                      </TouchableOpacity>
                          <Text style={styles.payWayContentStyle}>{'支付宝支付'}</Text>
                      </View>
                  </View>
                  <Text style={styles.logisticsListText}>{'本商品由商家选择合作快递为您配送'}</Text>
              </View>
        )
    },

    //发票信息
    invoiceInfoItem() {
        return (
              <View style={styles.logisticsListViewStyle}>
                  <View style={styles.payWayViewStyle}>
                      <View style={styles.profitTitle_Name}>
                          <Text style={styles.payWayTextStyle}>{'发票信息'}</Text>
                      </View>
                  </View>
                  <View style={styles.logisticsListInfoViewStyle}>
                      <View style={styles.profitTitle_Name}>
                          <TouchableOpacity onPress={this.changeInvoice.bind(this,1)}>
                              <Image
                                  resizeMode='cover'
                                  source={this.state.placeOrderData.isNeedInvoice==1?app.img.common_check:app.img.common_no_check}
                                  style={styles.payCheckBox}
                                  />
                          </TouchableOpacity>
                          <Text style={styles.payWayContentStyle}>{'开发票'}</Text>
                      </View>
                      <View style={styles.profitTitle_Code}>
                          <TouchableOpacity onPress={this.changeInvoice.bind(this,0)}>
                              <Image
                                  resizeMode='cover'
                                  source={this.state.placeOrderData.isNeedInvoice==0?app.img.common_check:app.img.common_no_check}
                                  style={styles.payCheckBox}
                                  />
                          </TouchableOpacity>
                          <Text style={styles.payWayContentStyle}>{'不开发票'}</Text>
                      </View>
                  </View>
                  <TextInput
                      placeholder='请填写发票抬头'
                      onChangeText={(text) => {this.state.placeOrderData.invoice= text}}
                      defaultValue={this.state.placeOrderData.invoice}
                      style={styles.logisticsListNewInfoStyle}
                      editable={this.state.placeOrderData.isNeedInvoice==1?true:false}
                      />
              </View>
        )
    },
    //发票信息
    GoodsPriceInfoItem() {
        return (
            <View style={styles.goodsTotalPriceViewStyle}>
                <View style={styles.goodsTotalPriceChildViewStyle}>
                    <Text style={styles.totalPriceTag}>{'商品金额: '}</Text>
                    <Text style={styles.totalPriceText}>{'￥ '}{this.props.totalPrice}</Text>
                </View>
                <View style={styles.goodsTotalShippingChildViewStyle}>
                    <Text style={styles.totalShippingTag}>{'运费：'}</Text>
                    <Text style={styles.totalShippingText}>{'商家包邮'}</Text>
                </View>
            </View>
        )
    },
    //底部按钮区
    BottomViewItem() {
        return (
            <View style={styles.bottomViewStyle}>
                <View style={styles.bottomLeftBottonStyle}>
                    <Text style={[styles.bottomBottonTextStyle, {marginLeft: 20}]}>实付款：</Text>
                    <Text style={styles.bottomBottonTextStyle}>{'￥ '}{this.props.totalPrice}</Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={this.placeOrderData}
                  style={styles.bottomRightBottonStyle}>
                    <Text style={styles.bottomBottonTextStyle}>提交订单</Text>
                </TouchableOpacity>
            </View>
        )
    },
});

var styles = StyleSheet.create({
  mainContainer: {
      flex:1,
      width: sr.w,
      flexDirection: 'column',
      backgroundColor: 'transparent',
  },
  profitTitle: {
      marginTop: 10,
      width: sr.w,
      flexDirection: 'row',
      backgroundColor: '#FFFFFF',
  },
  profitTitle_Name: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
  },
  payCheckBox: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginLeft:10,
  },
  profitTitle_Code: {
      flex: 1,
      marginRight: 10,
      flexDirection: 'row',
      justifyContent: 'flex-end',
  },
  orderPersonNameText: {
      marginTop: 10,
      marginLeft: 35,
      fontSize: 13,
      color: '#000000',
  },
  orderPersonPhoneText: {
      marginTop: 10,
      marginRight: 30,
      fontSize: 13,
      color: '#000000',
  },
  address_icon_style: {
      marginLeft: 5,
      width: 30,
      height: 40,
  },
  addressTextStyle: {
      marginTop: 10,
      fontSize: 13,
      color: '#000000',
  },
  addressSubTextStyle: {
      marginTop:-12,
      marginBottom:10,
      marginLeft: 35,
      fontSize: 10,
      color: '#239fdb',
  },
  shopImgStyle: {
      width: 80,
      height: 80,
  },
  right_go_style1: {
      width: 12,
      height: 15,
      alignSelf:'flex-end',
      marginRight:20,
  },
  ReceivingInfoViewStyle: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF'
  },
  goodsInfoViewStyle: {
    marginTop: 1,
    width: sr.w,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },
  goodsImgStyle: {
    flex: 1,
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 10
  },
  goodsContentStyle: {
    flex: 3,
    flexDirection: 'column',
    marginTop: 20,
    marginLeft: 10,
  },
  goodsName: {
    color:'#000000',
    fontSize: 13,
  },
  logisticsListViewStyle: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    width: sr.w,
    flexDirection: 'column'
  },
  payWayViewStyle: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'row',
    width: sr.w
  },
  payWayTextStyle: {
    marginLeft: 10,
    alignSelf: 'center',
    color:'#239fdb'
  },
  payWayContentStyle: {
    marginRight: 15,
    marginLeft: 5,
    alignSelf: 'center',
    color:'#666666'
  },
  logisticsListInfoViewStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'row',
    marginTop:10,
    width: sr.w
  },
  logisticsListNewInfoStyle: {
    width: sr.w-20,
    height: 40,
    backgroundColor:'#efefef',
    color:'#666666',
    marginVertical:10,
    marginHorizontal:10,
  },
  logisticsListText: {
    width: sr.w-20,
    height: 40,
    backgroundColor:'#efefef',
    color:'#666666',
    padding:12,
    marginVertical:10,
    marginHorizontal:10,
  },
  rightViewGoStyle: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  goodsTotalPriceViewStyle: {
    marginTop: 1,
    flexDirection:'column',
    backgroundColor: '#FFFFFF',
  },
  goodsTotalPriceChildViewStyle: {
    marginTop: 10,
    flexDirection:'row',
    width: sr.w
  },
  goodsTotalShippingChildViewStyle: {
    marginVertical: 10,
    flexDirection:'row',
    width: sr.w
  },
  totalPriceText: {
    flex:1,
    textAlign:'right',
    marginRight: 10,
    color:'red'
  },
  totalPriceTag: {
    flex:1,
    marginLeft: 10,
  },
  totalShippingText: {
      flex:1,
    textAlign:'right',
    marginRight: 10,
  },
  totalShippingTag: {
      flex:1,
    marginLeft: 10,
  },
  bottomViewStyle: {
    bottom:0,
    flexDirection:'row',
    width: sr.w,
    height: 50,
  },
  bottomLeftBottonStyle: {
    flex:2,
    alignItems: 'center',
    backgroundColor: '#666666',
    flexDirection:'row',
    height: 50,
  },
  bottomRightBottonStyle: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF3C30',
    height: 50,
  },
  bottomBottonTextStyle: {
    color:'#FFFFFF',
    fontSize: 15,
  },
});
