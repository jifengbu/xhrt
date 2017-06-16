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
                style={styles.listViewItemContain}
                underlayColor='#EEB422'>
                <View style={styles.ItemContentContain}>
                    <DImage
                        resizeMode='stretch'
                        defaultSource={app.img.common_default}
                        source={{ uri:obj.minImage }}
                        style={styles.LeftImage} >
                        <Image
                            resizeMode='stretch'
                            source={obj.mode == 1 ? app.img.home_offline : app.img.home_liveTitle}
                            style={styles.LabelImage} />
                    </DImage>
                    <View style={styles.flexConten}>
                        <Text
                            numberOfLines={2}
                            style={styles.nameTitle}>
                            {title}
                        </Text>
                        <View style={{flexDirection: 'row',alignItems: 'center'}}>
                            <Image
                                resizeMode='stretch'
                                source={obj.mode == 1 ? app.img.home_adress : app.img.home_icon_speaker}
                                style={styles.iconImage} />
                            <Text
                                numberOfLines={1}
                                style={styles.midAdress}>
                                {des}
                            </Text>
                        </View>
                        <View style={{flexDirection: 'row',alignItems: 'center'}}>
                            <Image
                                resizeMode='stretch'
                                source={app.img.home_time}
                                style={styles.iconImage} />
                            <Text
                                numberOfLines={1}
                                style={styles.midTitle}>
                                {time}
                            </Text>
                        </View>
                    </View>
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
    render () {
        return (
            <View style={styles.container}>
                <ListView
                    initialListSize={1}
                    onEndReachedThreshold={10}
                    enableEmptySections
                    onEndReached={this.onEndReached}
                    style={styles.listStyle}
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
    listViewItemContain: {
        flexDirection: 'row',
        width: sr.w,
        marginBottom: 1,
        backgroundColor: '#FFFFFF',
    },
    ItemContentContain: {
        flexDirection: 'row',
        width: sr.w,
        paddingVertical: 20,
        paddingHorizontal:10,
    },
    LeftImage: {
        width: 125,
        height: 85,
    },
    iconImage: {
        marginHorizontal: 5,
        width: 12,
        height: 12,
    },
    flexConten: {
        width: 225,
        marginLeft: 10,
        justifyContent: 'space-between',
    },
    nameTitle: {
        color: '#383838',
        fontSize:14,
        width: 220,
    },
    midTitle: {
        color: '#FFB235',
        width: 200,
        fontSize:12,
    },
    midAdress: {
        color: '#AFAFAF',
        width: 200,
        fontSize:12,
    },
    LabelImage: {
        height: 35,
        width: 40,
        position: 'absolute',
        top: 0,
        left: 0,
    },
});
