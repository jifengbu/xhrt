'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    TouchableWithoutFeedback,
} = ReactNative;

var moment = require('moment');
var MeetingRoom = require('./MeetingRoom.js');
var ApplyRoom = require('./ApplyRoom.js');
var UmengMgr = require('../../manager/UmengMgr.js');
var {MessageBox, PageList} = COMPONENTS;

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        title: '我的房间',
        rightButton: {image: app.img.personal_delete, handler: ()=>{app.scene.toggleEdit()} },
    },
    getInitialState() {
        this.selects = [false];
        return {
            showDeleteMessageBox: false,
            showDeletePanel: false,
            tabIndex: 1,
        };
    },
    refresh() {
        this.listView.refresh();
    },
    toggleEdit() {
        if (this.state.tabIndex===0) {
            app.navigator.push({
                component: ApplyRoom,
                passProps: {refresh: this.refresh},
            });
        } else {
            this.setState({showDeletePanel: !this.state.showDeletePanel});
            this.listView.updateList(list=>list);
            this.refresh();
        }
    },
    changeTab(tabIndex) {
        this.setState({tabIndex});
        if (tabIndex===0) {
            app.getCurrentRoute().rightButton = {title: '添加', handler: ()=>{
                app.scene.toggleEdit()
            }};
        } else {
            app.getCurrentRoute().rightButton = {image: app.img.personal_delete, handler: ()=>{
                app.scene.toggleEdit()
            }};
        }
        app.forceUpdateNavbar();
    },
    onGetList(data, pageNo) {
        if (data.success&&data.context.roomList.length !== 0) {
            this.changeTab(1);
        } else {
            this.changeTab(0);
        }
    },
    selectDelete(sectionID, rowID) {
        this.selects[rowID] = !this.selects[rowID];
        this.listView.updateList(list=>list);
    },
    selectAll() {
        var flag = _.every(this.selects, (i)=>!!i);
        this.selects = this.listView.list.map(()=>!flag),
        this.listView.updateList(list=>list);
    },
    doDelete() {
        var flag = _.every(this.selects, (i)=>!i);
        if (flag) {
            Toast('请选择需要删除的记录');
        } else {
            this.setState({showDeleteMessageBox: true});
        }
    },
    doCancel() {
        this.setState({showDeleteMessageBox: false});
    },
    doConfirmDelete() {
        var deleteList = _.map(_.filter(this.listView.list, (o, i)=>this.selects[i]), (item)=>item.id);
        var param = {
            userID: app.personal.info.userID,
            ids: deleteList,
        };
        POST(app.route.ROUTE_SUBMIT_DELETE_ROOM, param, this.deleteSuccess, this.deleteFailed, true);
    },
    deleteSuccess(data) {
        if (data.success) {
            this.listView.updateList((list)=>{
                list = _.reject(list, (o, i)=>this.selects[i]);
                this.selects = [false];
                this.setState({
                    showDeleteMessageBox: false,
                });
                return list;
            });
        } else {
            this.deleteFailed();
            Toast(data.msg);
        }
    },
    deleteFailed() {
        this.setState({showDeleteMessageBox: false,});
    },
    shareMyRoom(obj, sectionID, rowID) {
        var data = 'roomNum='+obj.roomNO+'&company='+obj.theme+'&startTime='+obj.startTime;
        var desc = '特种兵学习交流，房间号('+obj.roomNO+'),'+obj.theme+'时间：'+obj.startTime;
        var dataEncode = encodeURI(data);
        UmengMgr.doActionSheetShare(CONSTANTS.SHARE_SHAREDIR_SERVER+'shareRoomNum.html?'+dataEncode,'特种兵交流场',desc,'web',CONSTANTS.SHARE_IMGDIR_SERVER+'communication.png',this.doShareCallback);
    },
    doShareCallback(){

    },
    doEnterMeetingRoom(obj) {
        app.navigator.push({
            title: obj.theme,
            component: MeetingRoom,
            passProps: {roomInfo: obj},
        });
    },
    getDiffFormat(duration) {
        var minutes = Math.floor(duration._milliseconds/60000);
        var hours = Math.floor(minutes/60);
        minutes = minutes-hours*60;
        return hours+':'+app.utils.numberFormat(minutes);
    },
    renderRow(obj, sectionID, rowID, onRowHighlighted) {
        var show = this.state.showDeletePanel;
        return (
            <TouchableHighlight
                onPress={show ? this.selectDelete.bind(null, sectionID, rowID):this.doEnterMeetingRoom.bind(null, obj)}
                underlayColor="#EEB422">
                <View style={styles.row}>
                    {show &&
                        <TouchableOpacity
                            onPress={this.selectDelete.bind(null, sectionID, rowID)}>
                            <Image
                                resizeMode='stretch'
                                source={this.selects[rowID]?app.img.common_delete:app.img.common_no_delete}
                                style={styles.deleteStyle} />
                        </TouchableOpacity>
                    }
                    <View style={styles.itemInnerContainer}>
                        <View style={show?styles.sectionContainer:styles.sectionContainer1}>
                            <Image
                                resizeMode='stretch'
                                source={app.img.personal_home}
                                style={styles.homeIamge} />
                            <Text style={styles.theme}>{obj.theme}</Text>
                            <Text style={styles.segment}>(</Text>
                            <Text style={styles.segment}>
                                {obj.roomNO}
                            </Text>
                            <Text style={styles.segment}>)</Text>
                        </View>
                        <View style={[show?styles.sectionContainer:styles.sectionContainer1,{justifyContent: 'space-between',marginTop: 10}]}>
                            <Text style={styles.text}>开始时间:{moment(obj.startTime).format('YYYY-MM-DD HH:mm')}</Text>
                                <TouchableOpacity
                                    style={styles.btnStyle}
                                    onPress={this.shareMyRoom.bind(null, obj)}>
                                    <Text style={styles.btnStyleText}>分享</Text>
                                </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        )
    },
    render() {
        return (
            <View style={styles.container}>
                <PageList
                    ref={listView=>this.listView=listView}
                    style={this.state.showDeletePanel ? styles.listWithMarginBottom : null}
                    renderRow={this.renderRow}
                    onGetList={this.onGetList}
                    listParam={{userID: app.personal.info.userID}}
                    listName="roomList"
                    listUrl={app.route.ROUTE_GET_MY_ROOM_LIST}
                    refreshEnable={true}
                    />
                <View style={this.state.showDeletePanel ? styles.bottomStyle : styles.bottomStyle2}>
                    <Text style={styles.bottomLine}>
                    </Text>
                    <View style={styles.bottomChildStyle}>
                        <TouchableHighlight
                            onPress={this.selectAll}
                            underlayColor="#a0d468"
                            style={styles.bottomSelectAllStyle}>
                            <Text style={styles.bottomSelectAllText}>全选</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            onPress={this.doDelete}
                            style={styles.bottomDeleteStyle}
                            underlayColor="#b4b4b4">
                            <Text style={styles.bottomDeleteText}>删除</Text>
                        </TouchableHighlight>
                    </View>
                </View>
                {
                    this.state.showDeleteMessageBox &&
                    <MessageBox
                        content="是否删除已选中项?"
                        doCancel={this.doCancel}
                        doConfirm={this.doConfirmDelete}
                        />
                }
            </View>
        )
    },
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    listWithMarginBottom: {
        marginBottom: 60,
    },
    bottomStyle: {
        position:'absolute',
        bottom: 0,
        left: 0,
        flexDirection: 'column',
    },
    bottomStyle2: {
        position:'absolute',
        bottom: -60,
        left: 0,
        flexDirection: 'column',
    },
    bottomSelectAllStyle: {
        flex: 1,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    bottomDeleteStyle: {
        flex: 1,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: CONSTANTS.THEME_COLOR,
    },
    bottomSelectAllText: {
        color: '#000000',
        fontSize: 16,
    },
    bottomDeleteText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    bottomLine: {
        backgroundColor: '#DDDDDD',
        height: 1,
        width: sr.w,
    },
    bottomChildStyle: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        height: 50,
        width: sr.w,
    },
    deleteStyle: {
        marginLeft: 10,
        height: 25,
        width: 25,
        alignSelf: 'center',
    },
    itemInnerContainer: {
        paddingVertical: 10,
        paddingHorizontal: 5,
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 2,
        width: sr.w-35,
    },
    sectionContainer1: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 2,
        width: sr.w,
    },
    homeIamge: {
        marginHorizontal: 10,
        height: 25,
        width: 25,
    },
    theme: {
        fontSize: 16,
        marginRight: 5,
        color:'#3D3E40',
    },
    segment: {
        fontSize: 13,
        color:'#B7985C',
    },
    text: {
        color: '#939495',
        fontSize: 13,
        marginLeft: 45,
    },
    btnStyle: {
        width: 60,
        height: 25,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#A62045',
        borderRadius: 4,
    },
    btnStyleText: {
        fontSize: 14,
        color: '#FFFFFF',
    },
});
