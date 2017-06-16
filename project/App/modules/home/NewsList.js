import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TextInput,
    ListView,
    ScrollView,
    TouchableHighlight,
    TouchableOpacity,
    InteractionManager,
} from 'react-native';

const moment = require('moment');
const {DImage } = COMPONENTS;
const { STATUS_TEXT_HIDE, STATUS_START_LOAD, STATUS_HAVE_MORE, STATUS_NO_DATA, STATUS_ALL_LOADED, STATUS_LOAD_ERROR } = CONSTANTS.LISTVIEW_INFINITE.STATUS;

module.exports = React.createClass({
    statics: {
        title: '消息',
        color: 'white',
        leftButton: { color: 'white', image: app.img.common_back
        },
    },
    getInitialState () {
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.NewsListData = []; 
        this.pageNo = 1;
        return {
            infiniteLoadStatus: STATUS_TEXT_HIDE,
        };
    },
    componentDidMount () {
        this.getNewsList();
    },
    componentWillMount () {
        app.updateNavbarColor('#DE3031');
    },
    getNewsList (month) {
        const info = app.personal.info;
        const param = {
            userID: info.userID,
            pageNo: this.pageNo,
        };
        POST(app.route.ROUTE_SUBMIT_GETMYNEWS, param, this.getNewsListSuccess, this.getNewsListFailed);
    },
    getNewsListSuccess (data) {
        if (data.success) {
            // add new pageData to MonthPlanListData
            for (let i = 0; i < data.context.newsList.length; i++) {
                this.NewsListData.push(data.context.newsList[i]);
            }
            const infiniteLoadStatus = data.context.newsList.length < CONSTANTS.PER_PAGE_COUNT ? STATUS_ALL_LOADED : STATUS_HAVE_MORE;

            console.log('------3', infiniteLoadStatus, data.context.newsList.length, CONSTANTS.PER_PAGE_COUNT);
            this.setState({
                infiniteLoadStatus: infiniteLoadStatus,
            });
        } else {
            this.getNewsListFailed();
        }
    },
    getNewsListFailed () {
        this.pageNo--;
        this.setState({ infiniteLoadStatus: STATUS_LOAD_ERROR });
    },
    onEndReached () {
        console.log('------onEndReached');
        if (this.state.infiniteLoadStatus == STATUS_ALL_LOADED || this.state.infiniteLoadStatus == STATUS_TEXT_HIDE) {
            return;
        }
        this.pageNo++;
        this.getNewsList();
    },
    renderRow (obj, sectionID, rowID) {
        // let contentStr = '成功邀请'+obj.userName+'加入特种兵，'+obj.userProfit+'元现金奖励已存入你的钱包';
        let headUrl = obj.userHeadImage ? obj.userHeadImage : app.img.home_news_default_head;
        return (
            <View style={styles.listItemTextView}>
                    <Text style={styles.listItemTextTime}>
                        {moment(obj.time).format('M月D日 HH:mm')}
                    </Text>
                <View style={styles.listItemView}>
                    <DImage
                        resizeMode='cover'
                        defaultSource={app.img.personal_head}
                        source={obj.userHeadImage ? { uri: headUrl } : headUrl}
                        style={styles.headViewImage} />
                    <View style={styles.listItemTextViewContent}>
                        <Text style={styles.listItemTextContent}>
                            {obj.content}
                        </Text>
                    </View>
                </View>
            </View>
        );
    },
    renderFooter () {
        return (
            <View style={styles.listFooterContainer}>
                {
                    this.state.infiniteLoadStatus == STATUS_HAVE_MORE &&
                    <Text style={styles.listFooter}>{CONSTANTS.LISTVIEW_INFINITE.TEXT[this.state.infiniteLoadStatus]}</Text>
                }
            </View>
        );
    },
    render () {
        return (
            <View style={styles.containerAll}>
                <ListView
                    initialListSize={1}
                    onEndReachedThreshold={10}
                    enableEmptySections
                    style={styles.listStyle}
                    onEndReached={this.onEndReached}
                    dataSource={this.ds.cloneWithRows(this.NewsListData)}
                    renderRow={this.renderRow}
                    renderFooter={this.renderFooter}
                    />
            </View>
        );
    },
});

const styles = StyleSheet.create({
    containerAll: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    listStyle: {
        alignSelf:'stretch',
        backgroundColor: '#FFFFFF',
    },
    listFooterContainer: {
        height: 60,
        alignItems: 'center',
    },
    listFooter: {
        marginVertical: 10,
        color: 'gray',
        fontSize: 14,
    },
    listItemView: {
        // height: 90,
        flexDirection: 'row',
        backgroundColor: 'white',
    },
    headViewImage: {
        width: 36,
        height: 36,
        marginHorizontal: 16,
    },
    listItemTextView: {
        // height: 140,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    listItemTextTime: {
        marginTop: 20,
        height: 24,
        backgroundColor: '#FFFFFF',
        fontSize: 14,
        color: '#666666',
    },
    listItemTextViewContent: {
        width: sr.w -90,
        backgroundColor: '#eeeeee',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 20,
        borderRadius: 4,
    },
    listItemTextContent: {
        marginVertical: 20,
        marginHorizontal: 16,
        backgroundColor: 'transparent',
        fontSize: 14,
        color: '#222222',
    },

});
