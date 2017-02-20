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
var {MessageBox} = COMPONENTS;

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
        POST(app.route.ROUTE_GET_PERSONAL_HOMEWORK_DETAILS, param, this.getListSuccess, this.getListFailed);
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
    render() {
        let { isLookAll } = this.state;
        let { obj , rowID } = this.props;
        return (
            <View>
                <View style={styles.listViewItemContain}>
                    {
                      rowID==0?<View style={{backgroundColor: '#FFFFFF'}}/>:
                      <View style={styles.separator}/>
                    }
                    <View style={styles.ItemContentContain}>
                        <View style={styles.messageStyle}>
                            <Text
                                numberOfLines={1}
                                style={styles.detailTextStyles}>
                                {obj.courseTitle}
                            </Text>
                            <Text numberOfLines={1} style={styles.lastTimeText}>
                                {moment(obj.submitTime).format('YYYY.MM.DD HH:mm:ss')}
                            </Text>
                        </View>
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
        width: sr.w-36,
        marginLeft: 8,
        justifyContent: 'space-between',
    },
      titleStyle: {
          width: sr.w-36,
          marginLeft: 8,
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
    detailTextStyles: {
        color: '#444444',
        marginBottom: 5,
        fontSize: 16,
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
        marginTop: 15,
        marginBottom: 8,
    },
    synopsisText: {
        width: sr.w-40,
        marginLeft: 10,
        fontSize: 16,
        color: '#000000',
        fontFamily: 'STHeitiSC-Medium'
    },
    maskImage: {
        width: sr.w,
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
