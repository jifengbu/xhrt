'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    Image,
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
} = ReactNative;

var {Button, PageList} = COMPONENTS;

var CommodityDetail = require('../commodityDetail/index.js');

var searchText = '';
var Title = React.createClass({
    render() {
        return (
            <TextInput
                placeholder="输入商品关键字"
                onChangeText={(text) => {searchText=text}}
                style={styles.txtInputSearch}
                />
        )
    }
});

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        title: <Title />,
        rightButton: { image: app.img.home_search, handler: ()=>{app.scene.doSearchGoods()}},
    },
    getInitialState() {
        return {
            lineWidth: 0,
            lineHeight: 0,
            searchTextContext: searchText,
        };
    },
    componentWillUnmount() {
        app.dismissProgressHUD();
    },
    doSearchGoods() {
        if (this.listView.isRefreshing()) {
            Toast("请求太频繁，请稍后再试");
            return;
        }
        if (searchText === '') {
            Toast('请输入搜索关键字');
            return;
        }
        this.setState({searchTextContext:searchText});
        this.listView.refresh();
    },
    doBuyGoods (obj, type) {
        app.navigator.push({
            component: CommodityDetail,
            passProps: {goodsID: obj.goodsID, buyType: type},
        });
    },
    render() {
        return (
            <View style={styles.container}>
                <PageList
                    ref={listView=>this.listView=listView}
                    renderRow={this.renderRow}
                    listParam={{keyword: this.state.searchTextContext}}
                    listName="goodsList"
                    listUrl={app.route.ROUTE_SEARCH_GOODS}
                    autoLoad={false}
                    />
            </View>
        );
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
                                <Text numberOfLines={2} style={styles.commodityTitleText}>
                                    {obj.goodsDec}
                                </Text>
                                <Text style={styles.soldText}>
                                    {'已售:'+obj.sales+'件'}
                                </Text>
                            </View>
                            <View style={styles.priceContainer}>
                                <View style={{width: (sr.w-165), flexDirection: 'row'}}>
                                    <Text style={{color: '#333333', fontSize: 14}}>
                                        {'专享价:'}
                                    </Text>
                                    <Text style={{color: '#ff3c30', fontSize: 14}}>
                                        {'￥'+obj.goodsPrice}
                                    </Text>
                                    <View style={{marginLeft: 10, alignSelf: 'center'}}>
                                        <View style={styles.container}>
                                            <Text
                                                onLayout={this._measureLineWidth}
                                                style={{color: '#666666', fontSize: 9,marginRight:2}}>
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
});


var styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    txtInputSearch: {
        height: 34,
        width: 216,
        fontSize: 14,
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
    separator: {
        height: 1,
        backgroundColor: '#EEEEEE'
    },
    commodityStyle: {
        width: sr.w,
        height: sr.w*2/5,
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
        width:sr.w,
        flexDirection: 'row',
        paddingBottom: 8,
        backgroundColor: '#FFFFFF',
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
        marginTop: 5,
        marginLeft: 8,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'center',
    },
    typeText: {
        fontSize: 12,
        marginHorizontal: 5,
        color: 'white',
        alignSelf: 'center',
    },
    commodityTitleText: {
        marginLeft: 8,
        fontSize: 18,
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
        fontSize: 10,
        color: '#666666',
        alignSelf: 'flex-end',
        marginRight: 10,
    },
});
