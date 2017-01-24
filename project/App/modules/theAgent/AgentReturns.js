'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    navigator,
} = ReactNative;

var {PageList} = COMPONENTS;
var ApplyCash = require('./ApplyCash.js');

module.exports = React.createClass({
    statics: {
        title:'我的收益',
    },
    getInitialState() {
        return {
            info: {
                userName: '',
                InviteCode: '',
                totalProfit: 0,
                leftBrokerage: 0
            }
        };
    },
    _onPressApply() {
        app.navigator.push({
            component: ApplyCash,
        });
    },
    onGetList(data) {
        if (data.success) {
            var context = data.context;
            this.setState({
                info: {
                    userName: context.name,
                    InviteCode: context.InviteCode||'',
                    totalProfit: context.totalProfit,
                    leftBrokerage: context.leftBrokerage
                }
            });
        }
    },
    renderRow(obj){
        var array = obj.content;
        return(
            <View style={styles.itemContainer}>
                <View style={styles.dateContainer}>
                    <View style={styles.viewContainer}>
                    </View>
                    <Text style={styles.dateTextTitle}>
                        {obj.month}
                    </Text>
                </View>
                <View style={styles.rightContainer}>
                    <View style={styles.lineContainer}>
                        <ItemListView obj={obj} />
                    </View>
                </View>
            </View>
        )
    },
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.themeContainer}>
                    <Text
                        style={styles.textTitle}>
                        {'用户名：'+this.state.info.userName}
                    </Text>
                    <Text
                        style={styles.detailTitle}>
                        {'收益详情'}
                    </Text>
                </View>
                <View  style={styles.imageView} />
                <PageList
                    renderRow={this.renderRow}
                    listParam={{userID: app.personal.info.userID}}
                    listName={"dateList"}
                    renderSeparator={()=>null}
                    listUrl={app.route.ROUTE_GET_MY_PROFIT}
                    onGetList={this.onGetList}
                    refreshEnable={true}
                    />
                    <View style={styles.incomeContainer}>
                        <View style={styles.textTitleContainer}>
                            <Text style={styles.profitStyle}>
                                {'当前收益合计'}
                            </Text>
                        </View>
                        <View style={styles.priceContainer}>
                            <Text style={styles.moneyTitle}>
                                {'￥'+this.state.info.totalProfit.toFixed(2)}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={this._onPressApply}
                        style={styles.btnContainer}>
                        <Text style={styles.btnStyle}>
                             申 请 提 现
                        </Text>
                    </TouchableOpacity>
            </View>
        );
    }
});

var ItemListView = React.createClass({
    render() {
        var {obj} = this.props;
        var array = obj.content;
        array.concat(obj.content);
        return(
            <View style={{marginLeft: 2,backgroundColor: '#FFFFFF'}}>
                {
                    array.map((item, i)=> {
                        return (
                            <View style={[styles.timeContainerChild,{marginBottom: i != array.length-1 ?10:0}]} key={i}>
                                <Text style={styles.timeTitle}>
                                    {item.time}
                                </Text>
                                <View style={styles.nameStyle}>
                                    <Text
                                        numberOfLines={2}
                                        style={styles.nameTitle}>
                                        {item.name+'    '+item.thing}
                                    </Text>
                                </View>
                                <View style={styles.divisionContainer}>
                                    <Text style={[styles.textFont,{color: '#555555'}]}>
                                        {'￥'+item.cost}
                                    </Text>
                                    <View style={styles.separator}/>
                                    <Text style={[styles.textFont,{color: '#BC9451'}]}>
                                        {'返利 ￥'+item.returnValue.toFixed(2)}
                                    </Text>
                                </View>
                            </View>
                        )
                    })
                }
            </View>
        )
    },
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    textFont:{
      fontSize:16,
    },
    divisionContainer: {
        flexDirection: 'row',
        width: sr.w-65,
    },
    separator: {
        height: 1.5,
        flex: 1,
        marginHorizontal:20,
        marginTop:10,
        backgroundColor: '#CFD0D1',
    },
    themeContainer: {
        height:35,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginHorizontal:10,
    },
    itemContainer: {
        marginTop: 10,
    },
    dateContainer: {
        width: sr.w,
        height: 35,
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewContainer: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginLeft: 25,
        backgroundColor: '#A42346'
    },
    rightContainer: {
        backgroundColor: '#FFFFFF',
    },
    lineContainer: {
        marginLeft: 32,
        marginTop: 10,
        backgroundColor: '#DDDDDD',
    },
    dateTextTitle: {
        fontSize: 14,
        marginLeft: 10,
        color: CONSTANTS.THEME_COLOR,
    },
    timeContainerChild: {
        marginLeft: 20,
        backgroundColor: '#FFFFFF',
    },
    textTitle: {
        fontSize: 13,
        color: '#555555'
    },
    detailTitle: {
        fontSize: 14,
        color: '#555555',
        fontWeight: '500',
    },
    timeTitle: {
        color:'#A22346',
        fontSize: 14,
    },
    nameTitle: {
        fontSize: 14,
        width: sr.w-65,
        color: '#555555',
    },
    nameStyle: {
        marginVertical: 6,
        width: sr.w-65,
        flexDirection: 'row',
        alignItems:'center',
    },
    priceContainer: {
        flex: 1,
        height: 32,
        margin: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    incomeContainer: {
        flexDirection: 'row',
        backgroundColor:'#BC9451',
        width: sr.w,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnContainer: {
        backgroundColor:'#A22346',
        width: sr.w,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnStyle: {
        fontSize: 18,
        color: '#FFFFFF',
    },
    profitStyle: {
        color: 'white',
        fontSize: 20,
        alignSelf: 'flex-end',
    },
    moneyTitle: {
        fontSize: 20,
        color:'#555555'
    },
    textTitleContainer: {
        flex: 2,
    },
    imageView: {
        height: 1.5,
        marginTop: 1.5,
        width:sr.w-20,
        marginHorizontal:10,
        marginBottom:10,
        backgroundColor:'#CFD0D1',
    },
});
