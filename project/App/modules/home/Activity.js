'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    View,
    Text,
    Image,
    StyleSheet,
    Navigator,
    ListView,
    TouchableHighlight,
} = ReactNative;

var ActivityDetail = require('./ActivityDetail.js');
var moment = require('moment');
var {DImage} = COMPONENTS;

const {STATUS_TEXT_HIDE, STATUS_START_LOAD, STATUS_HAVE_MORE, STATUS_NO_DATA, STATUS_ALL_LOADED, STATUS_LOAD_ERROR} = CONSTANTS.LISTVIEW_INFINITE.STATUS;

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        title: '热门活动',
        leftButton: { handler: ()=>{app.navigator.pop()}},
    },
    getInitialState() {
        this.pageNo = 1;
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.list = [];
        return {
            dataSource: this.ds.cloneWithRows(this.list),
            infiniteLoadStatus: STATUS_TEXT_HIDE,
        };
    },
    componentDidMount() {
        this.getList();
    },
    getList() {
        var param = {
            userID: app.personal.info.userID,
            pageNo: this.pageNo,
        };
        this.setState({infiniteLoadStatus: this.pageNo===1?STATUS_START_LOAD:STATUS_HAVE_MORE});
        POST(app.route.ROUTE_GET_HOT_AVTIVITY_LIST, param, this.getListSuccess, this.getListFailed);
    },
    getListSuccess(data) {
        if (data.success) {
            var length = 0;
            if (data.context.hotActivity) {
                this.list = data.context.hotActivity;
                var infiniteLoadStatus = length < CONSTANTS.PER_PAGE_COUNT ? STATUS_ALL_LOADED : STATUS_TEXT_HIDE;
                this.setState({
                    dataSource: this.ds.cloneWithRows(this.list),
                    infiniteLoadStatus: infiniteLoadStatus
                });
            }
        } else {
            this.getListFailed();
        }
    },
    getListFailed() {
        this.pageNo--;
        this.setState({infiniteLoadStatus: STATUS_LOAD_ERROR});
    },
    onEndReached() {
        if (this.state.infiniteLoadStatus !== STATUS_TEXT_HIDE) {
            return;
        }
        this.pageNo++;
        this.getList();
    },
    playVideo(obj) {
        app.navigator.push({
            title: '活动详情页',
            component: ActivityDetail,
            passProps: {activeityId: obj.activeityId},
        });
    },
    renderRow(obj, sectionID, rowID) {
        let title = obj.title ? obj.title: '';
        let des = '';
        if (obj.mode == 1) {
            des = obj.address?'地点：'+obj.address:'';
        } else {
            des = obj.mainTeacher?'主讲人：'+obj.mainTeacher:'';
        }
        let time = obj.startDate&&obj.endDate?'时间：'+moment(obj.startDate).format('M月D号 HH:mm')+'-'+moment(obj.endDate).format('MM月DD号 HH:mm'):'';
        return (
            <TouchableHighlight
                onPress={this.playVideo.bind(null, obj)}
                style={styles.listViewItemContain}
                underlayColor="#EEB422">
                <View style={styles.ItemContentContain}>
                    <DImage
                        resizeMode='stretch'
                        defaultSource={app.img.common_default}
                        source={{uri:obj.minImage}}
                        style={styles.LeftImage} />
                    <View style={styles.flexConten}>
                        <Text
                            numberOfLines={2}
                            style={styles.nameTitle}>
                            {title}
                        </Text>
                        <Text
                            numberOfLines={1}
                            style={styles.midTitle}>
                            {des}
                        </Text>
                        <Text
                            numberOfLines={1}
                            style={styles.midTitle}>
                            {time}
                        </Text>
                    </View>
                    <Image
                        resizeMode='stretch'
                        source={obj.mode==1?app.img.home_offline:app.img.home_liveTitle}
                        style={styles.LabelImage} />
                </View>
            </TouchableHighlight>
        )
    },
    renderFooter() {
        return (
            <View style={styles.listFooterContainer}>
                <Text style={styles.listFooter}>{CONSTANTS.LISTVIEW_INFINITE.TEXT[this.state.infiniteLoadStatus]}</Text>
            </View>
        )
    },
    render() {
        return (
            <View style={styles.container}>
                <ListView
                    initialListSize={1}
                    onEndReachedThreshold={10}
                    enableEmptySections={true}
                    onEndReached={this.onEndReached}
                    style={styles.listStyle}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    renderFooter={this.renderFooter}
                    />
            </View>
        )
    },
});


var styles = StyleSheet.create({
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
    listViewItemContain: {
        flexDirection: 'row',
        width: sr.w-14,
        marginLeft: 7,
        marginTop: 5,
        borderRadius: 2,
        backgroundColor: '#FFFFFF',
    },
    ItemContentContain: {
        flexDirection: 'row',
        width: sr.w-14,
        paddingVertical: 10,
        paddingHorizontal:7,
        borderRadius: 2,
    },
    LeftImage: {
        width: 118,
        height:72,
        borderRadius: 2,
    },
    flexConten: {
        width: 225,
        marginLeft: 10,
        justifyContent: 'space-between',
    },
    nameTitle: {
      color: '#313131',
      fontFamily: 'STHeitiSC-Medium',
      fontSize:14,
      width: 200,
    },
    midTitle: {
      color: '#313131',
      fontFamily: 'STHeitiSC-Medium',
      fontSize:12,
    },
    LabelImage: {
      height: 28,
      width: 28,
      position: 'absolute',
      top: 0,
      right: 0,
    },
});
