'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    View,
    Text,
    Image,
    StyleSheet,
    ListView,
    TouchableOpacity,
    TouchableHighlight,
} = ReactNative;

var moment = require('moment');
var SpecopsPerson = require('./SpecopsPerson.js');
var {DImage} = COMPONENTS;

const {STATUS_TEXT_HIDE, STATUS_START_LOAD, STATUS_HAVE_MORE, STATUS_NO_DATA, STATUS_ALL_LOADED, STATUS_LOAD_ERROR} = CONSTANTS.LISTVIEW_INFINITE.STATUS;

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        leftButton: { handler: ()=>{app.navigator.pop()}},
    },
    getInitialState() {
        this.pageNo = 1;
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            dataSource: this.ds.cloneWithRows([]),
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
        POST(app.route.ROUTE_GET_HOMEWORK_DETAILS, param, this.getListSuccess, this.getListFailed);
    },
    getListSuccess(data) {
        if (data.success) {
            var length = 0;
            if (data.context.specopsUserTask) {
                let videoList = data.context.specopsUserTask.length != 0&&data.context.specopsUserTask;
                let list = (this.props.showAll == false&&videoList.length > 3)?videoList.slice(0,3):videoList;
                var infiniteLoadStatus = (list.length < CONSTANTS.PER_PAGE_COUNT) ? '您的员工还没有完成课后作业' : STATUS_TEXT_HIDE;
                this.setState({
                    dataSource: this.ds.cloneWithRows(list),
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

    renderRow(obj, sectionID, rowID) {
        return (
            <RowItem obj={obj} rowID={rowID} />
        );
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
                <View style={styles.line}/>
                <ListView
                    ref={listView=>this.listView=listView}
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

var RowItem = React.createClass({
    getInitialState() {
        return {
            lineHeight: 0,
            isLookAll: false,
        };
    },
    _measureLineHeight(e) {
        if (!this.state.lineheight) {
            var {height} = e.nativeEvent.layout;
            this.setState({lineHeight: height+26});
        }
    },
    doLookAll() {
        this.setState({isLookAll: !this.state.isLookAll});
    },
    toStudyDetail(userId) {
        app.navigator.push({
            component: SpecopsPerson,
            passProps: {userId: userId},
        });
    },
    render() {
        let { isLookAll } = this.state;
        let { obj , rowID } = this.props;
        return (
            <View style={styles.listViewItemContain}>
                {
                  rowID==0?<View style={{backgroundColor: '#FFFFFF'}}/>:
                  <View style={styles.separator}/>
                }
                <View style={styles.ItemContentContain}>
                    <TouchableOpacity onPress={this.toStudyDetail.bind(null,obj.userId)}>
                        <View style={styles.messageStyle}>
                            <DImage
                                resizeMode='stretch'
                                defaultSource={app.img.personal_head}
                                source={{uri:obj.userImg}}
                                style={styles.LeftImage} />
                            <View style={styles.leftStyle}>
                                <View style={styles.detailStyle}>
                                    <View style={styles.nameStyle}>
                                        <Text style={styles.nameTextStyles}>
                                            {obj.userName}
                                        </Text>
                                        <View style={styles.postStyle}>
                                            <Text style={styles.postTextStyle}>
                                                {obj.post}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text numberOfLines={1} style={styles.lastTimeText}>
                                        {moment(obj.submitTime).format('YYYY.MM.DD HH:mm:ss')}
                                    </Text>
                                </View>
                                <Text
                                    numberOfLines={1}
                                    style={styles.detailTextStyles}>
                                    {'课程：'+obj.courseTitle}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.titleStyle}>
                        <Text style={styles.titleText}>{'题目：'+obj.taskTitle}</Text>
                    </View>
                    <View style={styles.flexConten}>
                        <View style={[styles.synopsisStyle, {height: this.state.lineHeight}]}>
                            <Text onLayout={this._measureLineHeight} numberOfLines={isLookAll?200:4} style={styles.synopsisText}>
                                {obj.taskAnswer}
                            </Text>
                            {
                                !isLookAll&&
                                <Image resizeMode='stretch' source={app.img.specops_mask} style={[styles.maskImage, {height: (this.state.lineHeight)/2}]}/>
                            }
                            <TouchableOpacity onPress={this.doLookAll} style={styles.lookAllStyle}>
                                <Text style={styles.lookAllText}>{isLookAll?'点击收起':'点击展开更多'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    },
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listStyle: {
        alignSelf:'stretch',
        backgroundColor: '#FFFFFF',
    },
    listFooterContainer: {
        alignItems: 'center',
    },
    listFooter: {
        color: 'gray',
        fontSize: 14,
    },
    separator: {
        position: 'absolute',
        width: sr.w-20,
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
        width: sr.w-20,
        margin: 10,
        backgroundColor: '#FFFFFF'
    },
    messageStyle: {
        width: sr.w-20,
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
        marginLeft: 7,
        marginVertical: 8,
        borderRadius: 18,
    },
    titleStyle: {
        width: sr.w-20,
        marginTop: 5,
        borderRadius: 2,
        backgroundColor: '#F8F8F8'
    },
    titleText: {
        color: '#585858',
        fontSize: 14,
        margin: 7,
    },
    flexConten: {
        width: sr.w-20,
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
        backgroundColor: '#FF7373'
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
        width: sr.w-20,
        marginTop: 10,
        marginBottom: 8,
    },
    synopsisText: {
        width: sr.w-30,
        marginLeft: 7,
        fontSize: 16,
        color: '#0A0A0A',
        fontFamily: 'STHeitiSC-Medium'
    },
    maskImage: {
        width: sr.w-20,
        bottom: 20,
        left: 0,
        position: 'absolute',
    },
    lookAllStyle: {
        width: 100,
        height: 20,
        bottom: 0,
        left: sr.w/2-50,
        position: 'absolute',
        alignItems: 'center',
        flexDirection: 'row',
    },
    lookAllText: {
        fontSize: 14,
        color: '#45B0F7',
        fontFamily: 'STHeitiSC-Medium',
        backgroundColor: 'transparent',
    },
});
