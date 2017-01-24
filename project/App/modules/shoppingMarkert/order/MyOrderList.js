'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    RefreshControl,
    TouchableHighlight,
    TouchableOpacity,
} = ReactNative;

var {Button, MessageBox, PageList} = COMPONENTS;
var OrderDetails = require('./OrderDetails.js');
var OrderComment = require('./OrderComment');

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        title: '我的订单',
        rightButton: {image: app.img.common_title_delete, handler: ()=>{app.scene.toggleMenuPanel()} },
    },
    getInitialState() {
        this.selects = [false];
        return {
            showDeleteMessageBox: false,
            showDeletePanel: false,
        };
    },
    toggleMenuPanel() {
        this.setState({showDeletePanel: !this.state.showDeletePanel});
        this.listView.updateList(list=>list);
    },
    selectDelete(sectionID, rowID) {
        this.selects[rowID] = !this.selects[rowID];
        this.listView.updateList(list=>list);
    },
    selectAll() {
        var flag = _.every(this.selects, (i)=>!!i);
        this.selects = this.listView.list.map(()=>!flag),
        this.listView.updateList(list=>list);
    },
    doDelete() {
        var flag = _.every(this.selects, (i)=>!i);
        if (flag) {
            Toast('请选择需要删除的记录');
        } else {
            this.setState({showDeleteMessageBox: true});
        }
    },
    doCancel() {
        this.setState({showDeleteMessageBox: false});
    },
    doConfirmDelete() {
        var deleteList = _.map(_.filter(this.listView.list, (o, i)=>this.selects[i]), (item)=>item.orderNo);
        var param = {
            userID: app.personal.info.userID,
            orderNoArray: deleteList,
        };
        POST(app.route.ROUTE_DEL_ORDER, param, this.deleteSuccess, this.deleteFailed, true);
    },
    deleteSuccess(data) {
        if (data.success) {
            this.listView.updateList((list)=>{
                list = _.reject(list, (o, i)=>this.selects[i]);
                this.selects = [false];
                this.setState({
                    showDeleteMessageBox: false,
                });
                return list;
            });
        } else {
            this.deleteFailed();
            Toast(data.msg);
        }
    },
    deleteFailed() {
        this.setState({showDeleteMessageBox: false,});
    },
    updateIsComment(isComment) {
        this.listView.updateList((list)=>{
            var item = _.find(list, (o)=>o.orderNo==isComment.orderNo);
            if (item) {
                item.isComment = isComment.isComment;
            }
            return list;
        });
    },
    goComment(obj) {
        app.navigator.push({
            component: OrderComment,
            passProps: {data:obj, updateIsComment: this.updateIsComment},
        });
    },
    updateIsFinish(isFinish) {
        this.listView.updateList((list)=>{
            var item = _.find(list, (o)=>o.orderNo==isFinish.orderNo);
            if (item) {
                item.isOver = isFinish.isOver;
            }
            return list;
        });
    },
    goOrderDetails(obj) {
        app.navigator.push({
            component: OrderDetails,
            passProps: {data:obj, updateIsFinish: this.updateIsFinish},
        });
    },
    renderRow(obj, sectionID, rowID, onRowHighlighted) {
        return (
            <TouchableHighlight
                onPress={this.state.showDeletePanel?this.selectDelete.bind(null, sectionID, rowID):null}
                underlayColor="#EEB422">
                <View style={styles.row}>
                    {this.state.showDeletePanel&&
                        <TouchableOpacity
                            onPress={this.selectDelete.bind(null, sectionID, rowID)}>
                            <Image
                                resizeMode='stretch'
                                source={this.selects[rowID]?app.img.common_delete:app.img.common_no_delete}
                                style={styles.deleteStyle} />
                        </TouchableOpacity>
                    }
                    <View style={{flexDirection: 'column'}}>
                        <View style={styles.profitTitle}>
                            <View style={[styles.shopNameViewStyle, this.state.showDeletePanel?styles.fullWithWithDelete:null]}>
                                <View style={styles.profitTitle_Name}>
                                    <Image
                                        resizeMode='stretch'
                                        source={app.img.mall_tagging_icon}
                                        style={styles.tagging_icon_style} />
                                    <Text style={styles.shopNameStyle}>
                                        {obj.shopName}
                                    </Text>
                                </View>
                                <View style={styles.profitTitle_Code}>
                                    <Image
                                        resizeMode='stretch'
                                        source={app.img.mall_delete_icon}
                                        style={styles.delete_icon_style} />
                                </View>
                            </View>
                        </View>

                        <View style={[styles.goodsInfoViewStyle, this.state.showDeletePanel?styles.fullWithWithDelete:null]}>
                            <View style={styles.goodsImgStyle}>
                                <Image
                                    resizeMode='stretch'
                                    source={{uri:obj.goodsImg}}
                                    style={styles.shopImgStyle} />
                            </View>
                            <View style={styles.payPriceView}>
                                <Text style={styles.goodsName}>
                                    {obj.goodsDec}
                                </Text>
                            </View>
                        </View>
                        {
                            !this.state.showDeletePanel &&
                            <View style={{marginTop: 1}}>
                                <View style={[styles.shopNameViewStyle, this.state.showDeletePanel?styles.fullWithWithDelete:null]}>
                                    <View style={styles.profitTitle_Name}>
                                        <Text style={styles.payText}>
                                            实付款: {obj.totalPrice}
                                        </Text>
                                    </View>
                                    <View style={styles.profitTitle_Code}>
                                        {
                                            obj.isComment === 1 ?
                                            <TouchableOpacity
                                                activeOpacity={0.7}
                                                onPress={this.goComment.bind(null,obj)}
                                                style={styles.onTouchStyle} >
                                                <Text style={styles.orderDetailButton}>评价晒单</Text>
                                            </TouchableOpacity>
                                            : null
                                        }
                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            onPress={this.goOrderDetails.bind(null,obj)}
                                            style={styles.onTouchStyle} >
                                            <Text style={styles.orderDetailButton}>订单详情</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        }
                        {
                            obj.isOver === 2 ?
                            <View style={styles.orderCompletion}>
                                <Image
                                    resizeMode='stretch'
                                    source={app.img.mall_order_completion}
                                    style={[styles.orderCompletionStyle, this.state.showDeletePanel?{left:-35}:null]} />
                            </View>
                            : null
                        }
                    </View>
                </View>
            </TouchableHighlight>
        )
    },
    render() {
        return (
            <View style={styles.mainContian}>
                <PageList
                    ref={listView=>this.listView=listView}
                    style={this.state.showDeletePanel ? styles.listWithMarginBottom : null}
                    renderRow={this.renderRow}
                    listParam={{userID: app.personal.info.userID}}
                    listName="orderList"
                    listUrl={app.route.ROUTE_GET_MY_ORDER}
                    />
                <View style={this.state.showDeletePanel ? styles.bottomStyle : styles.bottomStyle2}>
                    <Text style={styles.bottomLine}>
                    </Text>
                    <View style={styles.bottomChildStyle}>
                        <TouchableHighlight
                            onPress={this.selectAll}
                            underlayColor="#a0d468"
                            style={styles.bottomSelectAllStyle}>
                            <Text style={styles.bottomSelectAllText}>全选</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            onPress={this.doDelete}
                            style={styles.bottomDeleteStyle}
                            underlayColor="#b4b4b4">
                            <Text style={styles.bottomDeleteText}>删除</Text>
                        </TouchableHighlight>
                    </View>
                </View>
                {
                    this.state.showDeleteMessageBox &&
                    <MessageBox
                        content="是否删除已选中项?"
                        doCancel={this.doCancel}
                        doConfirm={this.doConfirmDelete}
                        />
                }
            </View>
        )
    },
});

var styles = StyleSheet.create({
    orderCompletion: {
        flex: 1,
        top: 20,
        right: 50,
        position:'absolute',
        flexDirection: 'column',
    },
    deleteStyle: {
        marginLeft: 10,
        height: 25,
        width: 25,
        alignSelf: 'center',
    },
    orderCompletionStyle: {
        width: 100,
        height: 100,
    },
    mainContian: {
        flex: 1,
        height: sr.h,
        width: sr.w
    },
    listWithMarginBottom: {
        marginBottom: 60,
    },
    bottomStyle: {
        position:'absolute',
        bottom: 0,
        left: 0,
        flexDirection: 'column',
    },
    bottomStyle2: {
        position:'absolute',
        bottom: -60,
        left: 0,
        flexDirection: 'column',
    },
    bottomSelectAllStyle: {
        flex: 1,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    bottomDeleteStyle: {
        flex: 1,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ff3c30',
    },
    bottomSelectAllText: {
        color: '#000000',
        fontSize: 16,
    },
    bottomDeleteText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    bottomLine: {
        backgroundColor: '#DDDDDD',
        height: 1,
        width: sr.w,
    },
    bottomChildStyle: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        height: 50,
        width: sr.w,
    },
    row: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
    },
    profitTitle: {
        marginTop: 10,
        width: sr.w,
        flexDirection: 'row',
    },
    profitTitle_Name: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    profitTitle_Code: {
        flex: 1,
        marginRight: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
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
    payPriceView: {
        flex: 3,
        flexDirection: 'column',
        marginTop: 20,
        marginLeft: 10,
    },
    chatImgStyle: {
        width: 30,
        height: 30,
        marginTop: 5,
        marginLeft: 20,
    },
    shopNameViewStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection:'row',
        width: sr.w,
        height: 40
    },
    shopNameStyle: {
        alignSelf: 'center',
        color:'#000000'
    },
    goodsInfoViewStyle: {
        marginTop: 1,
        width: sr.w,
        flexDirection: 'row',
    },
    fullWithWithDelete: {
        width: sr.w-35,
    },
    goodsImgStyle: {
        flex: 1,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10
    },
    goodsContentStyle: {
        flex: 3,
        flexDirection: 'column',

    },
    goodsName: {
        color:'#000000',
        marginTop: 5,
        fontSize: 13,
    },
    payPriceViewStyle: {
        marginLeft: 10,
        marginRight: 10,
        flexDirection: 'row'
    },
    onTouchStyle: {
        borderRadius: 4,
        justifyContent: 'center',
        marginRight: 10,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#239fdb',
        height: 30
    },
    payText: {
        color: '#000000',
        marginLeft: 10,
    },
    orderDetailButton: {
        marginRight: 10,
        marginLeft: 10,
        alignSelf: 'center',
        color: '#FFFFFF'
    },
});
