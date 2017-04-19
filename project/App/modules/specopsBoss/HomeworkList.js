'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    View,
    Text,
    Image,
    StyleSheet,
    ListView,
    TouchableOpacity,
    TouchableHighlight,
} = ReactNative;

const moment = require('moment');
const CopyBox = require('../home/CopyBox.js');
const SpecopsPerson = require('./SpecopsPerson.js');
const { DImage } = COMPONENTS;

const { STATUS_TEXT_HIDE, STATUS_START_LOAD, STATUS_HAVE_MORE, STATUS_NO_DATA, STATUS_ALL_LOADED, STATUS_LOAD_ERROR } = CONSTANTS.LISTVIEW_INFINITE.STATUS;

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        leftButton: { handler: () => { app.navigator.pop(); } },
    },
    onStartShouldSetResponderCapture (evt) {
        app.touchPosition.x = evt.nativeEvent.pageX;
        app.touchPosition.y = evt.nativeEvent.pageY;
        return false;
    },
    onLongPress (str) {
        if (str != '' && str.length > 0) {
            // 显示复制按钮
            app.showModal(
                <CopyBox copyY={app.touchPosition.y}
                    copyX={app.touchPosition.x}
                    copyString={str} />,
                        { backgroundColor: 'transparent' }
            );
        }
    },
    getInitialState () {
        this.list = [];
        this.pageNo = 1;
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
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
            companyId: app.personal.info.companyInfo.companyId,
            pageNo: this.pageNo,
        };
        this.setState({ infiniteLoadStatus: this.pageNo === 1 ? STATUS_START_LOAD : STATUS_HAVE_MORE });
        POST(app.route.ROUTE_GET_HOMEWORK_DETAILS, param, this.getListSuccess, this.getListFailed);
    },
    getListSuccess (data) {
        if (data.success) {
            let length = 0;
            if (data.context.specopsUserTask) {
                let videoList = [];
                if (data.context.specopsUserTask.length > 0) {
                    videoList = data.context.specopsUserTask.slice(0);
                }
                const list = (this.props.showAll == false && videoList.length > 3) ? videoList.slice(0, 3) : videoList;
                this.list = this.list.concat(list);
                // const infiniteLoadStatus = (list.length < CONSTANTS.PER_PAGE_COUNT) ? '您的员工还没有完成课后作业' : STATUS_TEXT_HIDE;
                const infiniteLoadStatus = (!list.length && this.pageNo === 1) ? '您的员工还没有完成课后作业' : (!list.length && this.pageNo === 1) ? '您的员工还没有完成课后作业' : list.length < CONSTANTS.PER_PAGE_COUNT ? STATUS_ALL_LOADED : STATUS_TEXT_HIDE;
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
        if (this.props.showAll == false) {
            return;
        }

        if (this.state.infiniteLoadStatus !== STATUS_TEXT_HIDE) {
            return;
        }
        this.pageNo++;
        this.getList();
    },

    renderRow (obj, sectionID, rowID) {
        return (
            <RowItem obj={obj} rowID={rowID} onLongPress={this.onLongPress} />
        );
    },
    renderFooter0 () {
        const status = this.state.infiniteLoadStatus;
        return (
            <View style={[styles.listFooterContainer, (!this.list.length && this.pageNo === 1) && { justifyContent: 'center' }]}>
                <Text style={styles.listFooter}>{typeof status === 'string' ? status : CONSTANTS.LISTVIEW_INFINITE.TEXT[status]}</Text>
            </View>
        );
    },
    renderFooter1 () {
        const status = this.state.infiniteLoadStatus;
        return (
            <View>
                {
                    (!this.list.length && this.pageNo === 1) ?
                        <View style={[styles.listFooterContainer, { justifyContent: 'center' }]}>
                            <Text style={styles.listFooter}>{typeof status === 'string' ? status : CONSTANTS.LISTVIEW_INFINITE.TEXT[status]}</Text>
                        </View>
                    : null
                }
            </View>
        );
    },
    render () {
        return (
            <View style={styles.container}
                onStartShouldSetResponderCapture={this.onStartShouldSetResponderCapture}>
                <View style={styles.line} />
                <ListView
                    ref={listView => { this.listView = listView; }}
                    initialListSize={1}
                    onEndReachedThreshold={10}
                    enableEmptySections
                    onEndReached={this.onEndReached}
                    style={styles.listStyle}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    renderFooter={this.props.showAll == true ? this.renderFooter0 : this.renderFooter1}
                    />
            </View>
        );
    },
});

const RowItem = React.createClass({
    getInitialState () {
        return {
            lineHeight: 0,
            isLookAll: false,
            isShowBtn: false,
        };
    },
    _measureLineHeight (e) {
        if (!this.state.lineheight) {
            const { height } = e.nativeEvent.layout;
            if (height > 90) {
                this.setState({ isShowBtn: true });
            }
            this.setState({ lineHeight: height + 26 });
        }
    },
    doLookAll () {
        this.setState({ isLookAll: !this.state.isLookAll });
    },
    toStudyDetail (userId) {
        app.navigator.push({
            component: SpecopsPerson,
            passProps: { userID: userId },
        });
    },
    render () {
        const { isLookAll, lineHeight, isShowBtn } = this.state;
        const { obj, rowID } = this.props;
        const headUrl = obj.userImg ? obj.userImg : obj.sex === 1 ? app.img.personal_sex_male : app.img.personal_sex_female;
        return (
            <View style={styles.listViewItemContain}>
                {
                  rowID == 0 ? <View style={{ backgroundColor: '#FFFFFF' }} /> :
                  <View style={styles.separator} />
                }
                <View style={styles.ItemContentContain}>
                    <TouchableOpacity onPress={this.toStudyDetail.bind(null, obj.userId)}>
                        <View style={styles.messageStyle}>
                            <DImage
                                resizeMode='cover'
                                defaultSource={app.img.personal_head}
                                source={obj.userImg ? { uri: headUrl } : headUrl}
                                style={styles.LeftImage} />
                            <View style={styles.leftStyle}>
                                <View style={styles.detailStyle}>
                                    <View style={styles.nameStyle}>
                                        <Text style={styles.nameTextStyles}>
                                            {obj.userName}
                                        </Text>
                                        {
                                            obj.post != '' &&
                                            <View style={styles.postStyle}>
                                                <Text style={styles.postTextStyle}>
                                                    {obj.post || ''}
                                                </Text>
                                            </View>
                                        }
                                    </View>
                                    <Text numberOfLines={1} style={styles.lastTimeText}>
                                        {moment(obj.submitTime).format('YYYY.MM.DD HH:mm:ss')}
                                    </Text>
                                </View>
                                <Text
                                    numberOfLines={1}
                                    style={styles.detailTextStyles}>
                                    {'课程：' + (obj.courseTitle || '')}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.titleStyle}>
                        <Text style={styles.titleText}>{'题目：' + (obj.taskTitle || '')}</Text>
                    </View>
                    <View style={styles.flexConten}>
                        <View style={[styles.synopsisStyle, { height: lineHeight }]}>
                            <TouchableOpacity onLongPress={this.props.onLongPress.bind(null, obj.taskAnswer)}>
                                <Text onLayout={this._measureLineHeight} numberOfLines={(isLookAll) ? 200 : isShowBtn ? 4 : 10} style={styles.synopsisText}>
                                    {obj.taskAnswer || ''}
                                </Text>
                            </TouchableOpacity>
                            {
                                !isLookAll && isShowBtn &&
                                <Image resizeMode='stretch' source={app.img.specops_mask} style={[styles.maskImage, { height: (lineHeight) / 2 }]} />
                            }
                            {
                                isShowBtn &&
                                <TouchableOpacity onPress={this.doLookAll} style={styles.lookAllStyle}>
                                    <Text style={styles.lookAllText}>{isLookAll ? '点击收起' : '点击展开更多'}</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                </View>
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
        backgroundColor: '#FFFFFF',
    },
    listFooterContainer: {
        height: 60,
        alignItems: 'center',
    },
    listFooter: {
        color: 'gray',
        fontSize: 14,
    },
    separator: {
        position: 'absolute',
        width: sr.w - 20,
        height: 1,
        left: 10,
        right: 10,
        top: 0,
        backgroundColor: '#F7F7F7',
    },
    listViewItemContain: {
        width: sr.w,
        paddingVertical: 2,
        backgroundColor: '#FFFFFF',
    },
    ItemContentContain: {
        width: sr.w - 20,
        margin: 10,
        backgroundColor: '#FFFFFF',
    },
    messageStyle: {
        width: sr.w - 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    leftStyle: {
        justifyContent: 'space-between',
    },
    detailStyle: {
        flexDirection: 'row',
        marginTop: 8,
        justifyContent: 'space-between',
        width: 300,
        alignItems: 'center',
    },
    nameStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    LeftImage: {
        width: 36,
        height: 36,
        marginVertical: 8,
        borderRadius: 18,
    },
    titleStyle: {
        width: sr.w - 20,
        marginTop: 5,
        borderRadius: 2,
        backgroundColor: '#F8F8F8',
    },
    titleText: {
        color: '#585858',
        fontSize: 14,
        marginTop: 7,
        marginLeft: 7,
        marginBottom: 7,
    },
    flexConten: {
        width: sr.w - 20,
    },
    nameTextStyles: {
        color: '#313131',
        fontSize: 16,
        fontFamily: 'STHeitiSC-Medium',
    },
    postStyle: {
        height: 14,
        borderRadius: 4,
        marginLeft: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FF7373',
    },
    postTextStyle: {
        color: '#FFFFFF',
        marginHorizontal: 3,
        fontSize: 10,
    },
    detailTextStyles: {
        color: '#A7A7A7',
        marginBottom: 3,
        fontSize: 12,
        width: 300,
    },
    lastTimeText: {
        color: '#A7A7A7',
        fontSize: 10,
        fontFamily: 'STHeitiSC-Medium',
    },
    line: {
        height: 1,
        width: sr.w,
        backgroundColor: '#E0E0E0',
    },
    synopsisStyle: {
        width: sr.w - 20,
        marginTop: 10,
        marginBottom: 8,
    },
    synopsisText: {
        fontSize: 16,
        color: '#0A0A0A',
        fontFamily: 'STHeitiSC-Medium',
        backgroundColor: 'transparent',
    },
    maskImage: {
        width: sr.w - 20,
        bottom: 20,
        left: 0,
        position: 'absolute',
    },
    lookAllStyle: {
        width: 100,
        height: 20,
        bottom: 0,
        left: (sr.w - 20) / 2 - 50,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    lookAllText: {
        fontSize: 14,
        color: '#45B0F7',
        fontFamily: 'STHeitiSC-Medium',
        backgroundColor: 'transparent',
    },
});
