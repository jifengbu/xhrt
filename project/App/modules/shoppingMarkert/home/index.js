'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
} = ReactNative;

var {Button, PageList} = COMPONENTS;
var Search = require('./Search.js');
var CommodityDetail = require('../commodityDetail/index.js');
var PersonInfo = require('../../person/PersonInfo.js');
var MyOrderList = require('../order/MyOrderList.js');

var Title = React.createClass({
    render() {
        return (
            <TouchableOpacity
                style={styles.txtInputSearch}
                activeOpacity={0.9}
                onPress={this.props.doSearch}
                >
                <Text
                    style={styles.title}
                    onPress={this.props.doSearch}>
                    输入商品关键字
                </Text>
            </TouchableOpacity>
        )
    }
});
module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        title: <Title doSearch={()=>{app.scene.doSearch()}}/>,
        leftButton: { image: app.img.home_personal, handler: ()=>{
            app.navigator.push({
                component: PersonInfo,
                fromLeft: true,
            });
        }},
        rightButton: { image: app.img.mall_my_order_icon, handler: ()=>{
            app.navigator.push({
                component: MyOrderList,
            });
        }},
    },
    doSearch() {
        app.navigator.push({
            component: Search,
        });
    },
    getInitialState() {
        return {
            lineWidth: 0,
            lineHeight: 0,
        };
    },
    doBuyGoods (obj, type) {
        app.navigator.push({
            component: CommodityDetail,
            passProps: {goodsID: obj.goodsID, buyType: type},
        });
    },
    _measureLineWidth(e) {
        if (!this.state.lineWidth) {
            var {width, height} = e.nativeEvent.layout;
            this.setState({lineWidth: width, lineHeight: height});
        }
    },
    renderRow(obj) {
        var lineHeight = this.state.lineHeight/2;
        return(
            <View style={styles.rowViewStyle}>
                <TouchableOpacity onPress={this.doBuyGoods.bind(null, obj, 0)}>
                    <Image
                        resizeMode='stretch'
                        source={{uri:obj.goodsImg}}
                        style={styles.commodityStyle} />
                </TouchableOpacity>
                <Image
                    resizeMode='stretch'
                    source={app.img.mall_commodity_display_end}
                    style={styles.commodityDetailStyle}>
                    <View style={styles.panleMenuContainer}>
                        <View style={styles.typeContainer}>
                            <Text style={styles.typeText}>
                                {obj.goodsLable}
                            </Text>
                        </View>
                        <View style={styles.detailContainer}>
                            <View style={{flexDirection: 'row', marginTop: 5}}>
                                <Text
                                    numberOfLines={2}
                                    style={styles.commodityTitleText}>
                                    {obj.goodsDec}
                                </Text>
                                <Text style={styles.soldText}>
                                    {'已售:'+obj.sales+'件'}
                                </Text>
                            </View>
                            <View style={styles.priceContainer}>
                                <View style={{width: (sr.w-165), flexDirection: 'row'}}>
                                    <Text style={styles.specialPriceLabel}>
                                        {'专享价:'}
                                    </Text>
                                    <Text style={styles.specialPrice}>
                                        {'￥'+obj.goodsPrice}
                                    </Text>
                                    <View style={{marginLeft: 10, alignSelf: 'center'}}>
                                        <View style={{flex: 1}}>
                                            <Text
                                                onLayout={this._measureLineWidth}
                                                style={{textDecorationLine:'line-through', color: '#666666', fontSize: 9,marginRight:2}}>
                                                {'原价:￥'+ obj.goodsSale}
                                            </Text>
                                            <View style={{height: 1, width: this.state.lineWidth, backgroundColor: '#666666', position: 'absolute', bottom: lineHeight}}>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={{flex: 1}}>
                                    <Button
                                        onPress={this.doBuyGoods.bind(null, obj, 1)}
                                        style={styles.goPayBtn}
                                        textStyle={styles.btnText}>
                                        {'购买'}
                                    </Button>
                                </View>
                            </View>
                        </View>
                    </View>
                </Image>
            </View>
        )
    },
    render() {
        return (
            <View style={styles.container}>
                <PageList
                    renderRow={this.renderRow}
                    listName="goodsList"
                    listUrl={app.route.ROUTE_GET_GOODS_INFO}
                    refreshEnable={true}
                    />
            </View>
        );
    },
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 60,
    },
    title: {
        width: 216,
        flex: 1,
        fontSize: 14,
        color: 'gray',
    },
    commodityStyle: {
        width: sr.w,
        height: sr.w*2/5-10,
    },
    commodityDetailStyle: {
        width: sr.w,
        flex: 1,
        margin:1,
    },
    rowViewStyle: {
        flex: 1,
        height:sr.w*2/3,
        marginTop:2,
        borderRadius:15,
    },
    panleMenuContainer: {
        width: sr.w,
        height:100,
        flexDirection: 'row',
        paddingBottom: 8,
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderBottomRightRadius:15,
        borderBottomLeftRadius:15,
        borderWidth:1,
        borderColor:'#FFFFFF',
    },
    typeContainer: {
        height: 30,
        width: 60,
        marginTop: 8,
        borderRadius: 4,
        marginLeft: 5,
        justifyContent: 'center',
        backgroundColor: '#239fdb',
    },
    detailContainer: {
        flex: 1,
        marginTop: 8,
        alignSelf: 'flex-start',
    },
    priceContainer: {
        marginLeft: 8,
        marginTop: 5,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'center',
    },
    specialPriceLabel: {
        color: '#333333',
        fontSize: 14,
    },
    specialPrice: {
        color: '#ff3c30',
        fontSize: 14,
    },
    typeText: {
        fontSize: 12,
        marginHorizontal: 5,
        color: 'white',
        alignSelf: 'center',
    },
    commodityTitleText: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: '#333333',
    },
    specificationsTitleText: {
        width: (sr.w-75)/2,
        marginLeft: 8,
        fontSize: 18,
        color: '#333333',
    },
    goPayBtn: {
        width: 80,
        height: 35,
        marginRight: 5,
        borderRadius: 4,
        alignSelf: 'flex-end',
        alignItems:'center',
        backgroundColor: '#ff3c30',
        justifyContent:'center',
    },
    btnText: {
        fontSize: 14,
        alignSelf: 'center',
        color: 'white',
    },
    soldText: {
        paddingBottom: 5,
        fontSize: 10,
        color: '#666666',
        alignSelf: 'flex-end',
        marginHorizontal: 8,
    },
    txtInputSearch: {
        height: 34,
        width: 216,
        alignSelf: 'center',
        marginHorizontal: 10,
        paddingLeft: 10,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#D7D7D7',
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        overflow: 'hidden',
        alignItems:'center',
    },
});
