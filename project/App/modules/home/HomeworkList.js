'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    View,
    Text,
    Image,
    StyleSheet,
    Navigator,
    ListView,
    TouchableHighlight,
} = ReactNative;

const ActivityDetail = require('./ActivityDetail.js');
const moment = require('moment');
const { DImage } = COMPONENTS;

const { STATUS_TEXT_HIDE, STATUS_START_LOAD, STATUS_HAVE_MORE, STATUS_NO_DATA, STATUS_ALL_LOADED, STATUS_LOAD_ERROR } = CONSTANTS.LISTVIEW_INFINITE.STATUS;

module.exports = React.createClass({
    mixins: [SceneMixin],
    getInitialState () {
        this.pageNo = 1;
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.list = [];
        return {
            dataSource: this.ds.cloneWithRows(this.list),
            infiniteLoadStatus: STATUS_TEXT_HIDE,
        };
    },
    componentDidMount () {
        this.getList();
    },
    getList () {
        const param = {
            userID: app.personal.info.userID,
            pageNo: this.pageNo,
        };
        this.setState({ infiniteLoadStatus: this.pageNo === 1 ? STATUS_START_LOAD : STATUS_HAVE_MORE });
        POST(app.route.ROUTE_GET_HOT_AVTIVITY_LIST, param, this.getListSuccess, this.getListFailed);
    },
    getListSuccess (data) {
        if (data.success) {
            let length = 0;
            if (data.context.hotActivity) {
                this.list = data.context.hotActivity;
                const infiniteLoadStatus = length < CONSTANTS.PER_PAGE_COUNT ? STATUS_ALL_LOADED : STATUS_TEXT_HIDE;
                this.setState({
                    dataSource: this.ds.cloneWithRows(this.list),
                    infiniteLoadStatus: infiniteLoadStatus,
                });
            }
        } else {
            this.getListFailed();
        }
    },
    getListFailed () {
        this.pageNo--;
        this.setState({ infiniteLoadStatus: STATUS_LOAD_ERROR });
    },
    onEndReached () {
        if (this.state.infiniteLoadStatus !== STATUS_TEXT_HIDE) {
            return;
        }
        this.pageNo++;
        this.getList();
    },
    playVideo (obj) {
        app.navigator.push({
            title: '活动详情页',
            component: ActivityDetail,
            passProps: { activeityId: obj.activeityId },
        });
    },
    renderRow (obj, sectionID, rowID) {
        const title = obj.title ? obj.title : '';
        let des = '';
        if (obj.mode == 1) {
            des = obj.address ? obj.address : '';
        } else {
            des = obj.mainTeacher ? obj.mainTeacher : '';
        }
        const time = obj.startDate && obj.endDate ? moment(obj.startDate).format('M月D号 HH:mm') + '-' + moment(obj.endDate).format('MM月DD号 HH:mm') : '';
        return (
            <TouchableHighlight
                onPress={this.playVideo.bind(null, obj)}
                underlayColor='#EEB422'>
                <View style={styles.itemContentContain}>
                    <View style={styles.leftContentContain}>
                        <View style={[styles.contentContain, {marginTop: sr.ws(16), marginLeft: sr.ws(15), height: sr.ws(24)}]}>
                            <Image resizeMode='contain' source={app.img.home_oval} style={styles.ovalIcon} />
                            <Text style={styles.titleStyle}>{'「上海二阶」 赢销截拳道优秀作业'}</Text>
                        </View>
                        <View style={[styles.contentContain, {marginTop: sr.ws(12), marginLeft: sr.ws(35), height: sr.ws(20)}]}>
                            <Image resizeMode='contain' source={app.img.home_icon_xianxiashijian} style={styles.timeIcon} />
                            <Text style={styles.timeStyle}>{'8月24日 10:00-8月28日 10:30'}</Text>
                        </View>
                        <View style={[styles.contentContain, {marginTop: sr.ws(9), marginLeft: sr.ws(35), height: sr.ws(20)}]}>
                            <Image resizeMode='contain' source={app.img.home_icon_zuoyeshuliang} style={styles.numIcon} />
                            <Text style={styles.timeStyle}>{'作业数量：8868'}</Text>
                        </View>
                    </View>
                    <Image resizeMode='contain' source={app.img.home_arrow_icon} style={styles.arrowIcon}/>
                </View>
            </TouchableHighlight>
        );
    },
    renderFooter () {
        return (
            <View style={styles.listFooterContainer}>
                <Text style={styles.listFooter}>{CONSTANTS.LISTVIEW_INFINITE.TEXT[this.state.infiniteLoadStatus]}</Text>
            </View>
        );
    },
    renderSeparator (sectionID, rowID) {
        return (
            <View style={styles.separator} key={rowID} />
        );
    },
    render () {
        return (
            <View style={styles.container}>
                <ListView
                    initialListSize={1}
                    onEndReachedThreshold={10}
                    enableEmptySections
                    onEndReached={this.onEndReached}
                    style={styles.listStyle}
                    renderSeparator={this.renderSeparator}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    renderFooter={this.renderFooter}
                    />
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listStyle: {
        alignSelf:'stretch',
        backgroundColor: '#EEEEEE',
    },
    listFooterContainer: {
        alignItems: 'center',
    },
    listFooter: {
        marginVertical: 10,
        color: 'gray',
        fontSize: 14,
    },
    separator: {
        backgroundColor: '#EEEEEE',
        height: 1,
        width: sr.w,
    },
    itemContentContain: {
        width: sr.w,
        height: 114,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
    },
    leftContentContain: {
        flexDirection: 'column',
    },
    contentContain: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ovalIcon: {
        width: 9,
        height: 9,
    },
    titleStyle: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'PingFang-SC-Regular',
    },
    timeStyle: {
        marginLeft: 5,
        fontSize: 12,
        lineHeight: 16,
        fontFamily: 'PingFang-SC-Regular',
    },
    timeIcon: {
        width: 12,
        height: 12,
    },
    numIcon: {
        width: 10,
        height: 11,
    },
    arrowIcon: {
        width: 9,
        height: 16,
        marginRight: 16,
    },
});
