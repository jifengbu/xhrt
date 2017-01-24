'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
} = ReactNative;

var Details = require('./MyNewsDetails.js');
var {Button, MessageBox, PageList} = COMPONENTS;

module.exports = React.createClass({
    statics: {
        title: '消息中心',
        leftButton: { image: app.img.common_back2, handler: ()=>{app.navigator.pop()}},
        rightButton: { title: '管理', delayTime:1, handler: ()=>{app.scene.toggleMenuPanel()}},
    },
    toggleMenuPanel() {
        //改变状态 批量删除数据
        if (this.state.showDeletePanel) {
            this.doConfirmDelete();
        } else {
            this.setState({showDeletePanel: true});
            this.listView.updateList(list=>list);
            app.getCurrentRoute().rightButton = { title: '删除', delayTime:1, handler: ()=>{app.scene.toggleMenuPanel()}};
            app.getCurrentRoute().leftButton = { title: '取消', delayTime:1, handler: ()=>{app.scene.toggleImageMenuPanel()}};
            app.forceUpdateNavbar();
        }
    },
    toggleImageMenuPanel() {
        //取消删除时恢复不选中状态
        this.selects = _.fill(this.selects, false);
        app.getCurrentRoute().rightButton = { title: '管理', delayTime:1, handler: ()=>{app.scene.toggleMenuPanel()}};
        if (app.getCurrentRoute().leftButton.title) {
            this.setState({showDeletePanel: false});
            app.getCurrentRoute().leftButton = { image: app.img.common_back2, handler: ()=>{app.navigator.pop()}};
            app.forceUpdateNavbar();
        }
    },
    selectDelete(sectionID, rowID) {
        this.selects[rowID] = !this.selects[rowID];
        this.listView.updateList(list=>list);
    },
    getInitialState() {
        this.selects = [false];
        return {
            showDeletePanel: false,
        };
    },
    doConfirmDelete() {
        var flag = _.every(this.selects, (i)=>!i);
        if (flag) {
            Toast('请选择需要删除的记录');
            return;
        }
        var deleteList = _.map(_.filter(this.listView.list, (o, i)=>this.selects[i]), (item)=>item.messageID);
        //过滤出被删除的数组，用于更改个人中心的消息数量参数
        var deleteListDetail = _.map(_.filter(this.listView.list, (o, i)=>this.selects[i]), (item)=>item);
        var param = {
            userID: app.personal.info.userID,
            messageIDList: deleteList,
        };
        POST(app.route.ROUTE_SUBMIT_DELNEWS, param, this.deleteSuccess.bind(null, deleteListDetail), this.deleteFailed, true);
    },
    deleteSuccess(deleteListDetail, data) {
        if (data.success) {
            this.listView.updateList((list)=>{
                list = _.reject(list, (o, i)=>this.selects[i]);
                this.selects = [false];
                return list;
            });
            //更改个人中心 消息数量
            _.map(deleteListDetail, (item)=>{
                if (!item.state) {
                    app.personal.info.newMsgCount -= 1;
                    app.personal.set(app.personal.info);
                }
            });
            if (!this.listView.list.length) {
                this.setState({showDeletePanel: false});
                app.getCurrentRoute().rightButton = { title: '管理', delayTime:1, handler: ()=>{app.scene.toggleMenuPanel()}};
                app.getCurrentRoute().leftButton = { image: app.img.common_back2, handler: ()=>{app.navigator.pop()}};
                app.forceUpdateNavbar();
            }
            Toast('删除成功');
        } else {
            this.deleteFailed();
            Toast(data.msg);
        }
    },
    deleteFailed() {
        //删除失败
        Toast('删除失败');
    },
    goDetails(obj, sectionID, rowID) {
        if (this.state.showDeletePanel) {
            this.selects[rowID] = !this.selects[rowID];
            this.listView.updateList(list=>list);
        } else {
            if (obj.state == 0) {
                this.listView.updateList((list)=>{
                    _.find(list, (item)=>item.messageID==obj.messageID).state = 1;
                    return list;
                });
                var param = {
                    userID: app.personal.info.userID,
                    messageID: obj.messageID,
                };
                POST(app.route.ROUTE_CHANGE_MESSAGE_STATE, param);
                app.personal.info.newMsgCount -= 1;
                app.personal.set(app.personal.info);
            }
            app.navigator.push({
                component: Details,
                passProps: { contentText: obj.content, time: obj.time},
            });
        }
    },
    renderRow(obj, sectionID, rowID, onRowHighlighted) {
        return (
                <TouchableHighlight
                    onPress={this.goDetails.bind(null, obj, sectionID, rowID)}
                    underlayColor="#b4b4b4">
                    <View style={styles.itemContainer}>
                        {this.state.showDeletePanel&&
                            <TouchableOpacity
                                style={styles.btnTouchStyle}
                                onPress={this.selectDelete.bind(null, sectionID, rowID)}>
                                <View style={styles.deleteStyle}>
                                    {
                                        this.selects[rowID]&&
                                        <View style={styles.seletedStyle}/>
                                    }
                                </View>
                            </TouchableOpacity>
                        }
                        <View style={styles.rightView}>
                            <View style={styles.titleStyle}>
                                <View style={styles.typeView}>
                                    <Text style={obj.state==1 ? styles.itemNameText2 : styles.itemNameText}>系统通知</Text>
                                </View>
                                <View style={styles.timeView}>
                                    <Text style={obj.state==1 ? styles.itemTimeText2 : styles.itemTimeText}>
                                        {obj.time}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.infoStyle}>
                                <Text
                                    numberOfLines={1}
                                    style={obj.state==1 ? styles.itemContentText2 : styles.itemContentText}>
                                    {obj.content}
                                </Text>
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>
        )
    },
    renderSeparator(sectionID, rowID) {
        return (
            <View style={styles.separator} key={sectionID+'_'+rowID}/>
        );
    },
    render() {
        return (
            <View style={styles.container}>
                <PageList
                    ref={listView=>this.listView=listView}
                    renderRow={this.renderRow}
                    renderSeparator={this.renderSeparator}
                    listParam={{userID: app.personal.info.userID}}
                    listName="newsList"
                    listUrl={app.route.ROUTE_SUBMIT_GETMYNEWS}
                    />
            </View>
        )
    },
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0EFF5',
    },
    separator: {
        height: 5,
    },
    itemContainer: {
        width: sr.w,
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    btnTouchStyle: {
        width: 23,
        height: 23,
        marginLeft: 30,
        marginRight: 7,
    },
    deleteStyle: {
        height: 23,
        width: 23,
        borderRadius: 11.5,
        borderWidth: 1,
        borderColor: '#E93536',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: '#FFFFFF'
    },
    seletedStyle: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: '#E93536',
        alignSelf: 'center',
    },
    rightView: {
        height: 80,
        marginLeft: 24,
        flexDirection: 'column',
    },
    titleStyle: {
        height: 16,
        marginTop: 19,
        flexDirection: 'row',
        alignItems: 'center',
    },
    typeView: {
        width: 74,
        height: 16,
        justifyContent: 'center',
    },
    timeView: {
        height: 14,
        marginLeft: 10,
        justifyContent: 'center',
    },
    infoStyle: {
        width: 291,
        height: 14,
        marginTop: 14,
        alignItems: 'center',
        flexDirection: 'row',
    },
    itemNameText: {
        fontSize: 16,
        color: '#373737',
        fontFamily: 'STHeitiSC-Medium',
    },
    itemNameText2: {
        fontSize: 16,
        color: '#373737',
        opacity: 0.48,
        fontFamily: 'STHeitiSC-Medium',
    },
    itemContentText: {
        width: 291,
        fontSize: 14,
        color: '#A1A1A1',
        fontFamily: 'STHeitiSC-Medium',
    },
    itemContentText2: {
        width: 291,
        fontSize: 14,
        opacity: 0.48,
        color: '#A1A1A1',
        fontFamily: 'STHeitiSC-Medium',
    },
    itemTimeText: {
        fontSize: 14,
        alignSelf: 'center',
        color: '#ACACAC',
        fontFamily: 'STHeitiSC-Medium',
    },
    itemTimeText2: {
        fontSize: 16,
        opacity: 0.48,
        color: '#373737',
        fontFamily: 'STHeitiSC-Medium',
    },
});
