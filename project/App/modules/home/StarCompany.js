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
    TouchableOpacity,
    TouchableHighlight,
} = ReactNative;

const CompanyDetail = require('./CompanyDetail.js');
const { Button, MessageBox, DImage } = COMPONENTS;

const moment = require('moment');

const VIDEO_TYPES = ['精品课程', '精彩案例', '编辑推荐', '课程亮点'];
const { STATUS_TEXT_HIDE, STATUS_START_LOAD, STATUS_HAVE_MORE, STATUS_NO_DATA, STATUS_ALL_LOADED, STATUS_LOAD_ERROR } = CONSTANTS.LISTVIEW_INFINITE.STATUS;

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        leftButton: { handler: () => { app.navigator.pop(); } },
    },
    getInitialState () {
        this.pageNo = 1;
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return {
            dataSource: this.ds.cloneWithRows([]),
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
        POST(app.route.ROUTE_GET_STAR_COMPANY_LIST, param, this.getListSuccess, this.getListFailed);
    },
    getListSuccess (data) {
        if (data.success) {
            let length = 0;
            if (data.context.starCompanyList) {
                const shopInfo = data.context.starCompanyList;
                const infiniteLoadStatus = length < CONSTANTS.PER_PAGE_COUNT ? STATUS_ALL_LOADED : STATUS_TEXT_HIDE;
                this.setState({
                    dataSource: this.ds.cloneWithRows(shopInfo),
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
            title: '明星企业',
            component: CompanyDetail,
            passProps: { starCompanyID: obj.id },
        });
    },
    renderRow (obj, sectionID, rowID, onRowHighlighted) {
        return (
            <TouchableHighlight
                onPress={this.playVideo.bind(null, obj)}
                underlayColor='#EEB422'>
                <View style={styles.listViewItemContain}>
                    {
                      rowID == 0 ? <View style={styles.separatorTop} /> :
                      <View style={styles.separator} />
                    }
                    <View style={styles.ItemContentContain}>
                        <DImage
                            resizeMode='stretch'
                            defaultSource={app.img.common_default}
                            source={{ uri:obj.logo }}
                            style={styles.LeftImage} />
                        <View style={styles.flexConten}>
                            <View style={styles.rowViewStyle}>
                                <Text
                                    numberOfLines={1}
                                    style={styles.nameTextStyles}>
                                    {obj.title}
                                </Text>
                            </View>
                            <View style={styles.rowViewStyle}>
                                <Text
                                    numberOfLines={3}
                                    style={styles.detailTextStyles}>
                                    {obj.introduction}
                                </Text>
                            </View>
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
        backgroundColor: '#EEEEEE',
    },
    listStyle: {
        alignSelf:'stretch',
        backgroundColor: '#FFFFFF',
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
        position: 'absolute',
        width: sr.w - 30,
        height: 1,
        left: 15,
        right: 14,
        top: 0,
        backgroundColor: '#F7F7F7',
    },
    separatorTop: {
        position: 'absolute',
        width: sr.w,
        height: 1,
        left: 0,
        top: 0,
        backgroundColor: '#F7F7F7',
    },
    listViewItemContain: {
        flexDirection: 'row',
        width: sr.w,
        paddingVertical: 2,
        backgroundColor: '#FFFFFF',
    },
    ItemContentContain: {
        flexDirection: 'row',
        width: sr.w - 30,
        marginVertical: 10,
        marginHorizontal:15,
    },
    LeftImage: {
        width: 107,
        height:72,
        borderRadius: 2,
    },
    flexConten: {
        width: 222,
        marginLeft: 15,
        justifyContent: 'space-between',
        flexDirection: 'column',
    },
    rowViewStyle: {
        backgroundColor: '#FFFFFF',
    },
    nameTextStyles: {
        color: '#313131',
        fontFamily: 'STHeitiSC-Medium',
        fontSize:14,
    },
    detailTextStyles: {
        lineHeight: 14,
        color: '#969696',
        fontFamily: 'STHeitiSC-Medium',
        fontSize:10,
    },
});
