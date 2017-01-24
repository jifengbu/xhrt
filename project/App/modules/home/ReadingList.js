'use strict';

var React = require('react');var ReactNative = require('react-native');

var {
    Image,
    StyleSheet,
    Text,
    ListView,
    TouchableHighlight,
    View,
} = ReactNative;
var ReadingDetail = require('./ReadingDetail');
var moment = require('moment');
var {DImage} = COMPONENTS;

module.exports = React.createClass({
    getInitialState() {
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            tabIndex: this.props.tabIndex-1,
            articleList: [],
            dataSource: this.ds.cloneWithRows([]),
        };
    },
    componentWillMount() {
        this.lists = {
            articleList0:[],
            articleList1:[],
            articleList2:[],
            articleList3:[],
        };
        this.listFlags = 0;
    },
    componentDidMount() {
        var {tabIndex} = this.state;
        if (!(this.listFlags&(1 << tabIndex))) {
            this.getReadingList(tabIndex);
        }
    },
    getReadingList(tabIndex) {
        this.listFlags |= (1 << tabIndex);
        var param = {
            userID: app.personal.info.userID,
            type: tabIndex+1,
        };
        POST(app.route.ROUTE_GET_ARTICLE_LIST, param, this.getReadingListSuccess.bind(null, tabIndex), this.getReadingListError.bind(null, tabIndex), true);
    },
    getReadingListSuccess(tabIndex, data) {
        if (data.success) {
            var articleList = data.context.articleList||[];
            this.lists["articleList"+tabIndex] = articleList;
            if (this.state.tabIndex === tabIndex) {
                this.setState({dataSource: this.ds.cloneWithRows(this.lists["articleList"+tabIndex])});
            }
        } else {
            Toast(data.msg);
            this.listFlags &= (~(1 << tabIndex));
        }
    },
    getReadingListError(tabIndex, error) {
        this.listFlags &= (~(1 << tabIndex));
    },
    changeTab(tabIndex) {
        var articleList = this.lists["articleList"+tabIndex];
        this.setState({tabIndex, dataSource: this.ds.cloneWithRows(articleList)});
        if (!(this.listFlags&(1 << tabIndex))) {
            this.getReadingList(tabIndex);
        }
    },
    updateClickAndLikeNum(articleParam) {
        var articleList = this.lists["articleList"+this.state.tabIndex];
        var articleInfo = _.find(articleList, (item)=>item.id==articleParam.articleId);
        if (articleInfo) {
            if (articleParam.type === 'reads') {
                articleInfo.reads += 1;
            } else if (articleParam.type === 'addPraise') {
                articleInfo.likes += 1;
                articleInfo.isPraise = 1;
            }else if (articleParam.type === 'subPraise') {
                articleInfo.likes -= 1;
                articleInfo.isPraise = 0;
            }
            this.setState({dataSource: this.ds.cloneWithRows(articleList)})
        }
    },
    _onPressRow(obj) {
        app.navigator.push({
            title: '推荐阅读',
            component: ReadingDetail,
            passProps: {articleId: obj.id, updateClickAndLikeNum: this.updateClickAndLikeNum, tabIndex: this.state.tabIndex},
        });
    },
    renderRow(obj, sectionID, rowID) {
        return (
            <TouchableHighlight
                onPress={this._onPressRow.bind(null, obj)}
                underlayColor="rgba(0, 0, 0, 0)">
                <View style={styles.itemContainer}>
                    <DImage
                        resizeMode='stretch'
                        defaultSource={app.img.common_default}
                        source={{uri: obj.imgUrl}}
                        style={styles.videoImg} />
                    <View style={styles.titleStyle}>
                        <Text
                            numberOfLines={1}
                            style={styles.itemNameText}>
                            {obj.title}
                        </Text>
                        <Text
                            numberOfLines={2}
                            style={styles.itemSynopsisText}>
                            {obj.describe}
                        </Text>
                        <View style={styles.iconContainer}>
                            <Text style={styles.dateStyle}>
                                {moment(obj.createTime).format('YYYY.MM.DD')}
                            </Text>
                            <View style={styles.iconView}>
                                <View style={styles.praiseContainer}>
                                    <DImage
                                        resizeMode='contain'
                                        source={obj.isPraise?app.img.personal_praise_pressed:app.img.personal_praise}
                                        style={styles.iconStyle}/>
                                    <Text style={[styles.textStyle, {marginLeft: 6}]}>
                                        {obj.likes}
                                    </Text>
                                </View>
                                <View style={[styles.praiseContainer, {marginLeft: 17}]}>
                                    <DImage
                                        resizeMode='contain'
                                        source={app.img.personal_eye}
                                        style={styles.eyeIcon}/>
                                    <Text style={[styles.textStyle, {marginLeft: 6}]}>
                                        {obj.reads}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        )
    },
    renderSeparator(sectionID, rowID) {
        return (
            <View style={styles.separator} key={rowID}/>
        );
    },
    render() {
        var {tabIndex} = this.state;
        var menuAdminArray = ['名人文章', '学员分享', '赢销干货', '行业热点'];
        return (
            <View style={styles.container}>
                <View style={styles.divisionLine2}/>
                <View style={styles.tabContainer}>
                    {
                        !app.GlobalVarMgr.getItem('isFullScreen') &&
                        menuAdminArray.map((item, i)=>{
                            return (
                                <TouchableHighlight
                                    key={i}
                                    underlayColor="rgba(0, 0, 0, 0)"
                                    onPress={this.changeTab.bind(null, i)}
                                    style={styles.touchTab}>
                                    <View style={styles.tabButton}>
                                        <Text style={[styles.tabText, this.state.tabIndex===i?{color:'#FF3F3F', fontSize: 14}:{color:'#6B6B6B', fontSize: 12}]} >
                                            {item}
                                        </Text>
                                        <View style={[styles.tabLine, this.state.tabIndex===i?{backgroundColor: '#FF3F3F'}:null]}>
                                        </View>
                                    </View>
                                </TouchableHighlight>
                            )
                        })
                    }
                </View>
                <View style={styles.listViewStyle}>
                    <View style={styles.divisionLine}/>
                    <ListView
                        initialListSize={1}
                        enableEmptySections={true}
                        style={styles.list}
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow}
                        renderSeparator={this.renderSeparator}
                        />
                </View>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    tabContainer: {
        width:sr.w,
        flexDirection: 'row',
    },
    touchTab: {
        flex: 1,
        justifyContent: 'center',
    },
    tabButton: {
        height: 44,
        alignItems:'center',
        justifyContent:'center',
    },
    tabButtonCenter: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
    },
    tabButtonRight: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
        borderRadius: 9,
    },
    tabText: {
        fontFamily: 'STHeitiSC-Medium',
    },
    tabLine: {
        width: 60,
        height: 2,
        position: 'absolute',
        bottom: 0,
        left: (sr.w/4-60)/2,
    },
    listViewStyle: {
        flex: 1,
        flexDirection: 'column',
    },
    divisionLine: {
        height: 1,
        backgroundColor: '#F1F1F1',
    },
    divisionLine2: {
        height: 1,
        backgroundColor: '#F1F1F1',
    },
    list: {
        paddingTop: 20,
        alignSelf: 'stretch',
    },
    separator: {
        height: 1,
        marginVertical: 10,
        backgroundColor: '#F5F5F5',
    },
    itemContainer: {
        flexDirection: 'row',
    },
    videoImg: {
        width: 110,
        height: 80,
        marginLeft:15,
        justifyContent:'flex-end',
    },
    titleStyle: {
        width: sr.w-136,
        height: 80,
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginLeft: 11,
    },
    itemNameText: {
        width: sr.w-156,
        fontSize: 16,
        color: '#3C3C3C',
        lineHeight: 20,
        fontFamily: 'STHeitiSC-Medium',
    },
    itemSynopsisText: {
        width: sr.w-156,
        fontSize: 12,
        color: '#989898',
        lineHeight: 16,
        fontFamily: 'STHeitiSC-Medium'
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    praiseContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconView: {
        flexDirection: 'row',
        marginRight: 20,
    },
    eyeIcon: {
        width: 18,
        height: 18,
    },
    iconStyle: {
        width: 13,
        height: 13,
    },
    dateStyle: {
        fontSize: 12,
        color: '#B2B2B2',
        fontFamily: 'STHeitiSC-Medium',
    },
    textStyle: {
        fontSize: 10,
        color: '#909090',
        fontFamily: 'STHeitiSC-Medium',
    },
});
