'use strict';

const React = require('react');const ReactNative = require('react-native');

const {
    Image,
    StyleSheet,
    Text,
    FlatList,
    ListView,
    TouchableHighlight,
    View,
} = ReactNative;
const ReadingDetail = require('./ReadingDetail');
const moment = require('moment');
const { DImage, PageList } = COMPONENTS;

module.exports = React.createClass({
    getInitialState () {
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return {
            articleList: [],
            dataSource: this.ds.cloneWithRows([]),
        };
    },
    updateClickAndLikeNum (articleParam) {
        this.listView.updateList((list) => {
            const articleInfo = _.find(list, (item) => item.id == articleParam.articleId);
            if (articleInfo) {
                if (articleParam.type === 'reads') {
                    articleInfo.reads += 1;
                } else if (articleParam.type === 'addPraise') {
                    articleInfo.likes += 1;
                    articleInfo.isPraise = 1;
                } else if (articleParam.type === 'subPraise') {
                    articleInfo.likes -= 1;
                    articleInfo.isPraise = 0;
                }
            }
            return list;
        });
    },
    _onPressRow (obj) {
        app.navigator.push({
            title: '推荐阅读',
            component: ReadingDetail,
            passProps: { articleId: obj.id, updateClickAndLikeNum: this.updateClickAndLikeNum },
        });
    },
    renderRow (obj, sectionID, rowID) {
        return (
            <TouchableHighlight
                onPress={this._onPressRow.bind(null, obj)}
                underlayColor='rgba(0, 0, 0, 0)'>
                <View style={styles.listViewItemContain}>
                    <View style={styles.itemContentContain}>
                        <Image
                            resizeMode='stretch'
                            defaultSource={app.img.common_default}
                            source={{ uri: obj.imgUrl }}
                            style={styles.videoImage}>
                        </Image>
                        <View style={styles.flexConten}>
                            <View style={styles.rowViewStyle}>
                                <Text
                                    numberOfLines={2}
                                    style={styles.nameTextStyles}>
                                    {obj.title}
                                </Text>
                                <Text
                                    numberOfLines={1}
                                    style={styles.detailTextStyles}>
                                    {obj.describe}
                                </Text>
                            </View>
                            <View style={styles.columnViewStyle}>
                                <Text style={styles.timeStyle}>{moment(obj.createTime).format('YYYY.MM.DD')}
                                </Text>
                                <View style={styles.mainSpeakStyles}>
                                    <Image
                                        resizeMode='stretch'
                                        source={app.img.home_eye}
                                        style={styles.iconImage}>
                                    </Image>
                                    <Text style={styles.timeStyle}>{obj.reads}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    },
    renderSeparator (sectionID, rowID) {
        return (
            <View style={styles.separator} key={rowID} />
        );
    },
    render () {
        const type = this.props.tabIndex;
        return (
            <View style={styles.container}>
                <View style={styles.listViewStyle}>
                    <PageList
                        ref={listView => { this.listView = listView; }}
                        renderRow={this.renderRow}
                        renderSeparator={this.renderSeparator}
                        listParam={{ type: type, userID: app.personal.info.userID }}
                        listName='articleList'
                        listUrl={app.route.ROUTE_GET_ARTICLE_LIST}
                        refreshEnable
                        />
                </View>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    listViewStyle: {
        flex: 1,
        flexDirection: 'column',
    },
    divisionLine: {
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
    textStyle: {
        fontSize: 10,
        color: '#909090',
        fontFamily: 'STHeitiSC-Medium',
    },
    listViewItemContain: {
        flexDirection: 'row',
        width: sr.w,
        paddingVertical: 2,
        backgroundColor: '#FFFFFF',
    },
    itemContentContain: {
        flexDirection: 'row',
        width: sr.w - 20,
        margin: 10,
    },
    videoImage: {
        width: 125,
        height: 85,
    },
    flexConten: {
        width: 220,
        marginLeft: 10,
        flexDirection: 'column',
    },
    rowViewStyle: {
        backgroundColor: 'transparent',
    },
    nameTextStyles: {
        color: '#383838',
        fontSize:14,
    },
    detailTextStyles: {
        marginTop: 10,
        color: '#AFAFAF',
        fontSize:12,
    },
    columnViewStyle: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 220,
        height: 20,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    timeStyle: {
        fontSize: 10,
        color: '#9E9E9E',
    },
    mainSpeakStyles: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconImage: {
        width: 15,
        height: 10,
        marginHorizontal: 5,
    },
});
