'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    View,
    Text,
    Image,
    ListView,
    StyleSheet,
} = ReactNative;


var {Button, PageList} = COMPONENTS;

module.exports = React.createClass({
    statics: {
        title: '我的收益',
    },
    getInitialState() {
        return {
            info: {
                userName: '',
                InviteCode: '',
                totalProfit: 0
            }
        };
    },
    onGetList(data, pageNo) {
        if (data.success && pageNo === 1) {
            var context = data.context;
            this.setState({
                info: {
                    userName: context.name,
                    InviteCode: context.InviteCode||'',
                    totalProfit: Math.round(context.totalProfit*15)/100
                }
            });
        }
    },
    renderRow(obj) {
        return (
            <View style={styles.right_Container}>
                <ItemListView obj={obj} />
            </View>
        )
    },
    render() {
        return (
            <View style={styles.mainContian}>
                <View style={styles.mainContianTwo}>
                    <View style={styles.profitTitle}>
                        <View style={styles.profitTitle_Name}>
                            <Text style={styles.titleNameText}>姓名:</Text>
                            <Text style={styles.titleTimeText}>
                                {this.state.info.userName}
                            </Text>
                        </View>
                        <View style={styles.profitTitle_Code}>
                            <Text style={styles.titleNameText}>邀请码:</Text>
                            <Text style={styles.titleTimeText}>
                                {this.state.info.InviteCode}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.newsLine}>
                    </Text>
                    <PageList
                        renderRow={this.renderRow}
                        listParam={{userID: app.personal.info.userID}}
                        listName="dateList"
                        listUrl={app.route.ROUTE_SUBMIT_GETMYPROFIT}
                        onGetList={this.onGetList}
                        renderSeparator={null}
                        />
                </View>
                <View style={styles.bottomStyle}>
                    <View style={styles.bottomColorStyle}>
                        <View style={styles.bottomTextStyle}>
                            <View style={styles.tagTextStyle}>
                                <Text style={styles.textSizeStyle}>
                                    按 15% 计算，当前收益合计：
                                </Text>
                            </View>
                            <View style={styles.priceTextStyle}>
                                <Text style={styles.textSizeStyle2}>￥{this.state.info.totalProfit}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    },
});

var date = '';
var ItemListView = React.createClass({
    getInitialState() {
        var obj = this.props.obj;
        date = obj.date;
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            lineHeight: 10,
            tastContentData: this.ds.cloneWithRows(obj.content),
        };
    },
    _measureLineHeight(e) {
        if (!this.state.lineHeight) {
            this.setState({lineHeight: e.nativeEvent.layout.height+10});
        }
    },
    renderRow(obj) {
        var time = obj.time;
        var name = obj.name;
        var thing = obj.thing;
        var cost = parseFloat(obj.cost);
        var myProfit = cost * 0.15;
        var strContent = '您的好朋友 '+ name+' 在"'+thing+'"中消费了';
        return(
            <View style={styles.detailsListVeiw}>
                <View style={styles.detailsTime_HS}>
                    <Image
                        resizeMode='contain'
                        source={app.img.task_spot_1}
                        style={styles.spotIcon} />
                    <Text style={styles.detailTimeTow}>
                        {obj.time}
                    </Text>
                </View>
                <Text style={styles.detailsTextContent}>
                    {strContent}
                    <Text style={styles.costStyle}>￥{cost}</Text>
                </Text>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceLine}>
                    </Text>
                    <Text style={styles.priceText}>￥{myProfit}</Text>
                </View>
            </View>
        );
    },
    render() {
        return(
            <View style={styles.rowViewStyle}>
                <View style={styles.columnViewStyle}>
                    <Image
                        resizeMode='cover'
                        source={app.img.task_point_1}
                        style={styles.pointStyle} />
                    <Image
                        resizeMode='stretch'
                        source={app.img.task_axis_1}
                        style={{alignSelf: 'center', width: 8, height: this.state.lineHeight}} />
                </View>
                <View style={styles.columnFlexViewStyle}>
                    <Text style={styles.leftTime}>
                        {date}
                    </Text>
                    <ListView                        initialListSize={1}
                        enableEmptySections={true}
                        onLayout={this._measureLineHeight}
                        style={{marginTop: 5, marginLeft: -8,}}
                        dataSource={this.state.tastContentData}
                        renderRow={this.renderRow}
                        />
                </View>
            </View>
        )
    },
});


var styles = StyleSheet.create({
    mainContian: {
        flex: 1,
        flexDirection: 'column',
        height: sr.h
    },
    mainContianTwo: {
        flex: 1,
        marginBottom: 50,
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
    },
    leftTime: {
        fontSize: 17,
        marginLeft: 5,
        marginTop: 2,
        color: '#239fdb',
        alignSelf: 'flex-start',
    },
    right_Container: {
        marginLeft: 10,
    },
    detailsTime_HS: {
        marginTop: 7,
        flexDirection: 'row',
    },
    detailTimeTow: {
        marginTop: -4,
        marginLeft: 5,
        fontSize: 15,
        color: '#00BBFF',
        alignSelf: 'center',
    },
    spotIcon: {
        marginLeft: 10,
        width: 13,
        height: 13,
    },
    priceContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        flexDirection: 'row',
    },
    priceLine: {
        marginTop: 4,
        width: 90,
        height: 2,
        marginLeft: 50,
        backgroundColor: '#00BBFF',
        alignSelf: 'center',
    },
    priceText: {
        marginLeft: 10,
        fontSize: 17,
        color: '#00BBFF',
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
    titleNameText: {
        marginLeft: 10,
        fontSize: 15,
        color: '#000000',
        alignSelf: 'center',
    },
    titleTimeText: {
        marginRight: 10,
        marginLeft: 5,
        fontSize: 15,
        alignSelf: 'center',
        color: '#000000',
    },
    newsLine: {
        marginTop: 4,
        width: sr.w-4,
        height: 2,
        marginLeft: 2,
        marginRight: 2,
        backgroundColor: '#00BBFF',
    },
    bottomStyle: {
        flex: 1,
        position:'absolute',
        bottom: 0,
        left: 0,
    },
    bottomColorStyle: {
        flexDirection: 'row',
        backgroundColor: '#a0d468'
    },
    bottomTextStyle: {
        justifyContent: 'flex-end',
        flexDirection: 'row',
        width: sr.w,
        height: 50,
    },
    tagTextStyle: {
        flex: 2,
        justifyContent: 'flex-end',
        alignSelf: 'center',
        flexDirection: 'row',
    },
    textSizeStyle: {
        fontSize: 16,
    },
    textSizeStyle2: {
        fontSize: 18,
    },
    priceTextStyle: {
        flex: 1,
        height: 48,
        marginTop: 2,
        marginRight: 3,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    rowViewStyle: {
        flexDirection: 'row',
    },
    columnViewStyle: {
        flexDirection: 'column',
    },
    columnFlexViewStyle: {
        flexDirection: 'column',
        flex: 1,
    },
    pointStyle: {
        width: 28,
        height: 27,
    },
    detailsListVeiw: {
        flexDirection: 'column',
        marginTop: 10,
        marginBottom: 10,
        marginRight: 25,
    },
    detailsTextContent: {
        color: '#000000',
        marginLeft: 15,
        marginTop: 5,
    },
    costStyle: {
        color: 'red',
    },
});
