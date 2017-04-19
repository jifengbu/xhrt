'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} = ReactNative;

const Call = require('@remobile/react-native-call');
const LogisticsList = require('./LogisticsList.js');
const CommodityDetail = require('../commodityDetail/index.js');

const { Button, ActionSheet } = COMPONENTS;
const orderStateTitleArray = ['未发货', '在途中', '已收货'];

module.exports = React.createClass({
    statics: {
        title: '订单详情',
    },
    getInitialState () {
        return {
            orderDetail:{},
            logisticsList:[],
        };
    },
    componentDidMount () {
        this.getOrderDetail();
    },
    getOrderDetail () {
        const param = {
            userID: app.personal.info.userID,
            orderNo: this.props.data.orderNo,
        };
        POST(app.route.ROUTE_GET_ORDER_DETAIL, param, this.getOrderDetailSuccess, true);
    },
    getOrderDetailSuccess (data) {
        if (data.success) {
            this.setState({ orderDetail:data.context });
            this.getLogisticsList();
        } else {
            Toast(data.msg);
        }
    },
    goGoodsDetailView () {
        app.navigator.push({
            component: CommodityDetail,
            passProps: { goodsID: this.props.data.goodsID },
        });
    },
    goLogisticsList () {
        app.showModal(
            <LogisticsList logisticsList={this.state.logisticsList} />,
            { title: '物流信息' }
        );
    },
    endOrder () {
        const param = {
            userID: app.personal.info.userID,
            orderNo: this.props.data.orderNo,
        };
        POST(app.route.ROUTE_END_ORDER, param, this.endOrderSuccess, true);
    },
    endOrderSuccess (data) {
        if (data.success) {
            this.props.updateIsFinish({ isOver:2, orderNo: this.props.data.orderNo });
            app.navigator.pop();
        } else {
            Toast(data.msg);
        }
    },
    getLogisticsList () {
        GET('http://apis.baidu.com/netpopo/express/express1?type=zto&number=719262557003', this.getLogisticsListDataSuccess, true);
    },
    getLogisticsListDataSuccess (data) {
        if (data.status === '0' && data.msg === 'ok') {
            this.setState({ logisticsList: data.result.list });
        } else {
            Toast(data.msg);
        }
    },
    callPhone (data) {
        this.doCloseActionSheet();
        Call.callNumber((a, b) => {
            console.log(a, b);
        }, (a, b) => {
            console.log(a, b);
        },
          '085186810083',
          true,
        );
    },
    onPressCall () {
        this.doShowActionSheet();
    },
    doCloseActionSheet () {
        this.setState({ actionSheetVisible:false });
    },
    doShowActionSheet () {
        this.setState({ actionSheetVisible:true });
    },
    render () {
        return (
            <View style={styles.mainContainer}>
                <ScrollView>
                    <this.orderStatusItem />
                    <this.receivingInfoItem />
                    <this.goodsInfoItem />
                    <this.payWayInfoItem />
                    <this.invoiceInfoItem />
                    <this.GoodsPriceInfoItem />
                </ScrollView>
                {
                  this.props.data.isOver == 2 ? null : <this.bottomButtonItem />
              }
                <this.ActionSheetViewItem />
            </View>

        );
    },
    // 底部ActionSheet
    ActionSheetViewItem () {
        return (
            <ActionSheet
                visible={this.state.actionSheetVisible}
                cancelText='取   消'
                onCancel={this.doCloseActionSheet} >
                <ActionSheet.Button onPress={this.callPhone}>085186810083</ActionSheet.Button>
            </ActionSheet>
        );
    },
    // 订单状态
    orderStatusItem () {
        return (
            <View style={styles.profitTitle}>
                <View style={styles.profitTitle_Name}>
                    <Text style={styles.orderNoText}>订单号:{this.state.orderDetail.orderNo}</Text>
                </View>
                <View style={styles.profitTitle_Code}>
                    <Text style={styles.orderStateText}>订单状态:{orderStateTitleArray[this.state.orderDetail.orderState]}</Text>
                </View>
            </View>
        );
    },
    // 收货信息
    receivingInfoItem () {
        return (
            <View style={styles.personInfoViewStyle}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flexDirection: 'column' }}>
                        <View style={styles.profitTitle}>
                            <View style={styles.profitTitle_Name}>
                                <Text style={styles.orderPersonNameText}>{'收货人: '}{this.state.orderDetail.name}</Text>
                            </View>
                            <View style={styles.profitTitle_Code}>
                                <Text style={styles.orderPersonPhoneText}>{this.state.orderDetail.phone}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection:'row', marginTop: 2 }}>
                            <Image
                                resizeMode='contain'
                                source={app.img.mall_address_icon}
                                style={styles.address_icon_style} />
                            <Text style={styles.addressTextStyle}>{'收货地址: '}{this.state.orderDetail.addr}</Text>
                        </View>
                    </View>
                </View>
                <Image
                    resizeMode='stretch'
                    source={app.img.mall_address_interval}
                    style={styles.address_interval} />
            </View>
        );
    },
    // 商品信息
    goodsInfoItem () {
        return (
            <View>
                <View style={styles.profitTitle}>
                    <View style={styles.shopNameViewStyle}>
                        <View style={styles.profitTitle_Name}>
                            <Image
                                resizeMode='stretch'
                                source={app.img.mall_tagging_icon}
                                style={styles.tagging_icon_style} />
                            <Text style={styles.shopNameStyle}>{this.props.data.shopName}</Text>
                        </View>
                        <View style={styles.profitTitle_Code}>
                            <Image
                                resizeMode='stretch'
                                source={app.img.mall_delete_icon}
                                style={styles.delete_icon_style} />
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={this.goGoodsDetailView}
                    style={styles.goodsInfoViewStyle}>
                    <View style={styles.goodsImgStyle}>
                        <Image
                            resizeMode='stretch'
                            source={{ uri:this.props.data.goodsImg }}
                            style={styles.shopImgStyle} />
                    </View>
                    <View style={styles.goodsContentStyle}>
                        <Text style={styles.goodsName}>{this.props.data.goodsDec}</Text>
                    </View>
                    <View style={styles.rightViewGoStyle}>
                        <Image
                            resizeMode='stretch'
                            source={app.img.common_go}
                            style={styles.right_go_style} />
                    </View>
                </TouchableOpacity>

                <View style={styles.chatViewStyle}>
                    <TouchableOpacity activeOpacity={0.7} onPress={this.onPressCall} style={styles.chatTouchStyle}>
                        <Image
                            resizeMode='stretch'
                            source={app.img.mall_customer_service_icon}
                            style={styles.chatImgStyle} />
                        <Text style={styles.chatTextStyle}>联系商家客服</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    },

    // 支付方式
    payWayInfoItem () {
        return (
            <View>
                <View style={styles.logisticsListViewStyle}>
                    <View style={styles.payWayViewStyle}>
                        <View style={styles.profitTitle_Name}>
                            <Text style={styles.payWayTextStyle}>{'支付方式'}</Text>
                        </View>
                        <View style={styles.profitTitle_Code}>
                            <Text style={styles.payWayContentStyle}>{this.state.orderDetail.payMethod}</Text>
                        </View>
                    </View>
                    <View style={styles.lineStyles} />
                    <View style={styles.logisticsListInfoViewStyle}>
                        <View style={styles.profitTitle_Name}>
                            <Text style={styles.payWayTextStyle}>{'最新配送信息'}</Text>
                        </View>
                        <View style={styles.profitTitle_Code}>
                            <Text style={styles.payWayContentStyle}>{this.state.orderDetail.deliveryName}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={this.goLogisticsList}
                        style={styles.logisticsListNewInfoStyle}>
                        <Text style={styles.logisticsListContentStyle}>{this.state.logisticsList[0] == null ? '' : this.state.logisticsList[0].status + ' 感谢使用'}{this.state.orderDetail.deliveryName}{' 期待再次为您服务'}</Text>
                        <View style={styles.rightViewGoStyle}>
                            <Image
                                resizeMode='stretch'
                                source={app.img.common_go}
                                style={styles.right_go_style} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    },

    // 发票信息
    invoiceInfoItem () {
        return (
            <View>
                <View style={styles.invoiceViewStyle}>
                    <View style={styles.invoiceTitleSylte}>
                        <View style={styles.profitTitle_Name}>
                            <Text style={styles.payWayTextStyle}>{'发票信息'}</Text>
                        </View>
                        {
                            this.props.data.isNeedInvoice == 0 ? null
                            :
                            <View style={styles.profitTitle_Code}>
                                <Text style={styles.payWayContentStyle}>{'纸质发票'}</Text>
                            </View>
                        }
                    </View>
                    <View style={styles.invoiceContentViewStyle}>
                        <View style={styles.i_c_viewStyle}>
                            <Text style={styles.invoiceTitle}>{'发票抬头:'}{this.state.orderDetail.invoice}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    },
    // 金额和下单时间
    GoodsPriceInfoItem () {
        return (
            <View style={styles.goodsTotalPriceViewStyle}>
                <View style={styles.goodsTotalPriceChildViewStyle}>
                    <View style={styles.profitTitle_Name}>
                        <Text style={styles.totalPriceTag}>{'商品总额:'}</Text>
                        <Text style={styles.totalPriceText}>{' ￥'}{this.props.data.totalPrice}</Text>
                    </View>
                    <View style={styles.profitTitle_Code}>
                        <Text style={styles.sumitOrderTime}>{'下单时间: '}{this.state.orderDetail.orderTime == null ? '未知' : this.state.orderDetail.orderTime.split(' ')[0]}</Text>
                    </View>
                </View>
            </View>
        );
    },
    // 底部按钮区
    bottomButtonItem () {
        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={this.endOrder}
                style={styles.bottomBottonStyle}>
                <Text style={styles.bottomBottonTextStyle}>确认收货</Text>
            </TouchableOpacity>
        );
    },
});

const styles = StyleSheet.create({
    bottomStyle: {
        position:'absolute',
        bottom: 0,
        left: 0,
        flexDirection: 'column',
    },
    mainContainer: {
        flex: 1,
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
    profitTitle_Code: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    orderNoText: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        fontSize: 12,
        color: '#000000',
    },
    orderStateText: {
        marginTop: 10,
        marginBottom: 10,
        marginRight: 10,
        marginLeft: 5,
        fontSize: 12,
        color: '#239fdb',
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
    address_interval: {
        marginTop: 10,
        width: sr.w,
    },
    addressTextStyle: {
        marginTop: 10,
        fontSize: 13,
        color: '#000000',
    },
    tagging_icon_style: {
        marginLeft: 5,
        width: 25,
        height: 25,
    },
    delete_icon_style: {
        marginRight: 10,
        width: 30,
        height: 30,
    },
    shopImgStyle: {
        width: 80,
        height: 80,
    },
    chatImgStyle: {
        width: 30,
        height: 30,
        marginTop: 5,
        marginLeft: 20,
    },
    right_go_style: {
        width: 12,
        height: 15,
    },
    personInfoViewStyle: {
        marginTop: 10,
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
    },
    shopNameViewStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection:'row',
        width: sr.w,
        height: 40,
    },
    shopNameStyle: {
        alignSelf: 'center',
        color:'#000000',
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
        marginLeft:20,
        marginBottom: 10,
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
    chatViewStyle: {
        backgroundColor: '#FFFFFF',
        marginTop: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection:'row',
        width: sr.w,
    },
    chatTextStyle: {
        color:'#FFFFFF',
        fontSize: 14,
        marginRight: 20,
    },
    logisticsListViewStyle: {
        marginTop: 10,
        backgroundColor: '#FFFFFF',
        width: sr.w,
        flexDirection: 'column',
    },
    payWayViewStyle: {
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection:'row',
        width: sr.w,
    },
    payWayTextStyle: {
        marginLeft: 10,
        alignSelf: 'center',
        color:'#666666',
    },
    payWayContentStyle: {
        marginRight: 15,
        alignSelf: 'center',
        color:'#239fdb',
    },
    lineStyles: {
        marginBottom: 5,
        marginTop: 5,
        backgroundColor: 'transparent',
        height: 1,
        width: sr.w,
    },
    logisticsListInfoViewStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection:'row',
        width: sr.w,
    },
    logisticsListNewInfoStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        width: sr.w,
        height: 70,
    },
    logisticsListContentStyle: {
        flex: 6,
        color:'#999999',
        marginLeft: 10,
        fontSize: 13,
    },
    rightViewGoStyle: {
        marginHorizontal:20,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    invoiceViewStyle: {
        marginTop: 1,
        backgroundColor: '#FFFFFF',
    },
    invoiceTitleSylte: {
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection:'row',
        width: sr.w,
    },
    invoiceTagSylte: {
        marginLeft: 10,
        alignSelf: 'center',
        color:'#666666',
    },
    invoiceContentViewStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        width: sr.w,
        height: 70,
    },
    i_c_viewStyle: {
        flex: 6,
        flexDirection: 'column',
    },
    invoiceTitle: {
        marginLeft: 10,
        flex: 6,
        color:'#999999',
        fontSize: 13,
    },
    goodsTotalPriceViewStyle: {
        marginTop: 1,
        backgroundColor: '#FFFFFF',
    },
    goodsTotalPriceChildViewStyle: {
        marginTop: 10,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection:'row',
        width: sr.w,
    },
    totalPriceText: {
        alignSelf: 'center',
        color:'red',
    },
    totalPriceTag: {
        marginLeft: 10,
        alignSelf: 'center',
        color:'#666666',
    },
    sumitOrderTime: {
        marginRight: 10,
        alignSelf: 'center',
        color:'#999999',
    },
    bottomBottonStyle: {
        marginTop: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FF3C30',
        width: sr.w,
        height: 50,
    },
    bottomBottonTextStyle: {
        alignSelf: 'center',
        color:'#FFFFFF',
        fontSize: 15,
    },
    chatTouchStyle: {
        borderRadius: 4,
        marginTop: 8,
        marginBottom: 8,
        flexDirection:'row',
        alignItems: 'center',
        backgroundColor: '#239fdb',
        height: 40,
    },
});
