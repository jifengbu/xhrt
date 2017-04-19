'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    ListView,
    TouchableOpacity,
    Text,
    Image,
} = ReactNative;

const { DImage } = COMPONENTS;

module.exports = React.createClass({

    getInitialState () {
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return {
            dataSource: this.ds.cloneWithRows([]),
            listData: [],
            detailData: {},
        };
    },
    componentDidMount () {
        this.getMyAidDetail();
    },
    getMyAidDetail () {
        const param = {
            firstAidPacketId: this.props.info.id,
            userID: app.personal.info.userID,
        };
        POST(app.route.ROUTE_GET_MY_AID_DETAIL, param, this.doGetMyAidDetailSuccess);
    },
    doGetMyAidDetailSuccess (data) {
        if (data.success) {
            const monthList = data.context.monthList || [];
            this.setState({ detailData: data.context, dataSource: this.ds.cloneWithRows(monthList) });
        }
    },
    renderSeparator (sectionID, rowID) {
        return (
            <View
                style={styles.separator}
                key={rowID} />
        );
    },
    renderFooter () {
        let status = null;
        if (this.state.detailData.monthList && this.state.detailData.monthList.length === 0) {
            status = '暂无数据';
        } else {
            status = '没有更多数据';
        }
        return (
            <View style={styles.listFooterContainer}>
                <Text style={styles.listFooter}>{status}
                </Text>
            </View>
        );
    },
    renderRow (obj) {
        const array = obj.content;
        return (
            <View style={styles.rowStyle}>
                <View style={styles.dateContainer}>
                    <View style={styles.viewContainer} />
                    <View style={[styles.lineContainer, { height:46 * array.length + (array.length - 1) * 10 }]} />
                </View>
                <View style={styles.rightContainer}>
                    <View style={styles.timeContainer}>
                        <Text style={styles.dateTextTitle}>
                            {obj.month}
                        </Text>
                    </View>
                    <ItemListView obj={obj} />
                </View>

            </View>
        );
    },
    render () {
        let tempPrice = 0;
        if (this.state.detailData.total != undefined && this.state.detailData.total != null) {
            tempPrice = this.state.detailData.total.toFixed(2);
        }
        return (
            <View style={styles.container}>
                <View style={styles.topStyle}>
                    <Text
                        style={styles.textTitle}
                        numberOfLines={1}>
                        {'主题：' + this.props.info.title}
                    </Text>
                </View>
                <View style={styles.topBotStyle}>
                    <Text
                        numberOfLines={1}
                        style={styles.textTitle1}>
                        {'发布时间：' + this.props.info.releaseTime}
                    </Text>
                </View>
                <ListView
                    initialListSize={1}
                    enableEmptySections
                    style={styles.list}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    renderFooter={this.renderFooter}
                    renderSeparator={this.renderSeparator}
                    />
                <View style={styles.incomeContainer}>
                    <View style={styles.textTitleContainer}>
                        <Text style={styles.profitStyle}>
                            {'当前收益合计'}
                        </Text>
                    </View>
                    <View style={styles.priceContainer}>
                        <Text style={styles.moneyTitle}>
                            {'￥' + tempPrice}
                        </Text>
                    </View>
                </View>
            </View>
        );
    },
});

const ItemListView = React.createClass({
    render () {
        const { obj } = this.props;
        const array = obj.content;
        array.concat(obj.content);
        return (
            <View>
                {
                    array.map((item, i) => {
                        return (
                            <View key={i} style={styles.timeContainerChild}>
                                <View style={{ flexDirection:'row', justifyContent: 'space-between' }}>
                                    <View style={[styles.dataContainer, { alignItems: 'center' }]}>
                                        <DImage
                                            resizeMode='cover'
                                            defaultSource={app.img.personal_head}
                                            source={{ uri:item.headImg }}
                                            style={styles.imageStyle} />
                                        <Text
                                            numberOfLines={1}
                                            style={styles.textStyle}>
                                            {item.rewardName}
                                        </Text>
                                    </View>
                                    <View style={[styles.dataContainer, { alignItems: 'flex-end' }]}>
                                        <Text style={styles.textStyle}>
                                            {'打赏￥' + item.price.toFixed(2) + '元'}
                                        </Text>
                                        <Text style={[styles.textStyle, { marginHorizontal: 10 }]}>
                                            {item.rewardTimes}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.bottomLine} />
                            </View>
                        );
                    })
                }
            </View>
        );
    },
});

const styles = StyleSheet.create({
    textTitleContainer: {
        flex: 2,
    },
    moneyTitle: {
        fontSize: 20,
        color:'#555555',
    },
    priceContainer: {
        flex: 1,
        height: 32,
        margin: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    rowStyle: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
    },
    profitStyle: {
        color: 'white',
        fontSize: 20,
        alignSelf: 'flex-end',
    },
    incomeContainer: {
        flexDirection: 'row',
        backgroundColor:'#A42346',
        width: sr.w,
        height: 36,
        left: 0,
        bottom: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#EEEEEE',
    },
    topStyle: {
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#BE9451',
    },
    topBotStyle: {
        height: 45,
        marginLeft: 10,
        justifyContent: 'center',
        backgroundColor: '#EBEBEB',
    },
    dateContainer: {
        width: 50,
    },
    viewContainer: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginTop: 17,
        marginBottom: 15,
        marginLeft: 25,
        backgroundColor: '#A42346',
    },
    lineContainer: {
        width: 2,
        marginLeft: 33,
        backgroundColor: '#DDDDDD',
    },
    rightContainer: {
        flex: 1,
    },
    timeContainer: {
        marginTop: 17,
        justifyContent: 'center',
    },
    timeContainerChild: {
        flex:1,
        marginTop: 10,
    },
    textTitle: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    textTitle1: {
        color:'#555555',
        fontSize: 12,
    },
    dateTextTitle: {
        fontSize: 14,
        color: CONSTANTS.THEME_COLOR,
    },
    dataContainer: {
        flexDirection: 'row',
    },
    textStyle: {
        fontSize:14,
        color: '#555555',
    },
    imageStyle: {
        width: 40,
        height: 40,
        marginHorizontal:2,
        marginVertical:3,
        borderWidth:1.5,
        borderColor:'#A60245',
        borderRadius:20,
    },
    bottomLine: {
        height: 1.5,
        marginRight: 10,
        backgroundColor:'#DDDDDD',
    },
    imageLongView: {
        flex:0.02,
        marginLeft: 13,
        alignSelf:'center',
    },
    listFooter: {
        color: 'gray',
        fontSize: 14,
    },
    listFooterContainer: {
        height: 60,
        alignItems: 'center',
    },
});
