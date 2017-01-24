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

var VideoPlay = require('../study/VideoPlay.js');
var ShowMealBox = require('../package/ShowMealBox.js');
var PackageList = require('../package/PackageList.js');
var CoursePlayer = require('../specops/CoursePlayer.js');
var {Button,PageList} = COMPONENTS;

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        title: '我的收藏',
        leftButton: { image: app.img.common_back2, handler: ()=>{app.navigator.pop()}},
        rightButton: { title: '管理', delayTime:1, handler: ()=>{app.scene.toggleMenuPanel()}},
    },
    getInitialState() {
        this.selects = [false];
        return {
            showDeletePanel: false,
            ShowMealBox: false,
        };
    },
    doCancle() {
        this.setState({ShowMealBox: false});
    },
    doPayConfirm() {
        app.navigator.push({
            title: '套餐',
            component: PackageList,
        });
        this.setState({ShowMealBox: false});
    },
    toggleMenuPanel() {
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
    doConfirmDelete() {
        var flag = _.every(this.selects, (i)=>!i);
        if (flag) {
            Toast('请选择需要删除的记录');
            return;
        }
        var deleteList = _.map(_.filter(this.listView.list, (o, i)=>this.selects[i]), (item)=>item.videoID);
        var param = {
            userID: app.personal.info.userID,
            vedioIDList: deleteList,
        };
        POST(app.route.ROUTE_SUBMIT_DELETEMYCOLLECTION, param, this.deleteSuccess, this.deleteFailed, true);
    },
    deleteSuccess(data) {
        if (data.success) {
            this.listView.updateList((list)=>{
                list = _.reject(list, (o, i)=>this.selects[i]);
                this.selects = [false];
                return list;
            });
            if (!this.listView.list.length) {
                this.setState({showDeletePanel: false});
                app.getCurrentRoute().rightButton = { title: '管理', delayTime:1, handler: ()=>{app.scene.toggleMenuPanel()}};
                app.getCurrentRoute().leftButton = { image: app.img.common_back2, handler: ()=>{app.navigator.pop()}};
                app.forceUpdateNavbar();
            }
        } else {
            this.deleteFailed();
            Toast(data.msg);
        }
    },
    deleteFailed() {
    },
    //更新视频的播放和点赞数量
    updateClickOrLikeNum(clickNum) {
        this.listView.updateList((list)=>{
            var video = _.find(list, (item)=>item.videoID==clickNum.videoID);
            if (video) {
                if (clickNum.type === 'click') {
                    video.clicks += 1;
                } else if (clickNum.type === 'heart') {
                    video.likes += 1;
                }
            }
            return list;
        });
    },
    playVideo(obj, sectionID, rowID) {
        if (this.state.showDeletePanel) {
            this.selects[rowID] = !this.selects[rowID];
            this.listView.updateList(list=>list);
        } else {
            const {isAgent, isSpecialSoldier} = app.personal.info;
            let authorized = isAgent||isSpecialSoldier; //是否是特种兵1—是  0—不是
            if (obj.videoType==6) {
                if (!authorized) {
                    //跳转到购买特种兵页
                    app.navigator.popToTop();
                    app.showMainScene(1);
                } else {
                    //跳转到特种兵视频播放页
                    var param = {
                        userID:app.personal.info.userID,
                        videoID: obj.videoID,
                    };
                    POST(app.route.ROUTE_STUDY_PROGRESS, param, (data)=>{
                        if (data.success) {
                            app.navigator.push({
                                component: CoursePlayer,
                                passProps: {isCourseRecord:true, lastStudyProgress: data.context, updateClickOrLikeNum: this.updateClickOrLikeNum, otherVideoID: obj.videoID},
                            });
                        } else {
                            Toast('该特种兵课程学习进度获取失败，请重试！');
                        }
                    });
                }
            } else {
                //跳转到普通视频播放页
                app.navigator.push({
                    component: VideoPlay,
                    passProps: {videoInfo:obj, updateClickOrLikeNum: this.updateClickOrLikeNum, isFromRecords: false},
                });
            }
        }
    },
    formatTime(time) {
        let timeArr = [];
        let timeStr = '';
        if (time) {
            timeArr = time.split(' ');
            timeStr = timeArr[0].replace(/-/g,".");
        }
        return timeStr;
    },
    renderRow(obj, sectionID, rowID, onRowHighlighted) {
        return (
            <TouchableHighlight
                onPress={this.playVideo.bind(null, obj, sectionID, rowID)}
                underlayColor="#EEB422">
                <View style={styles.rowItem}>
                    <View style={styles.separator}/>
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
                    <View style={styles.rowLeft}>
                        <Image
                            resizeMode='stretch'
                            defaultSource={app.img.common_default}
                            source={{uri:obj.videoListImg||obj.urlImg}}
                            style={styles.icon} />
                    </View>
                    <View style={this.state.showDeletePanel?styles.rowRightPanel:styles.rowRight}>
                        <Text numberOfLines={2} style={styles.title} >
                            {obj.name}
                        </Text>
                        <View style={styles.contentContainer}>
                            <View style={styles.praise}>
                                <Image
                                    resizeMode='stretch'
                                    source={app.img.personal_eye}
                                    style={styles.iconPlay} />
                                <Text style={styles.content} >
                                    {obj.clicks*3+50}
                                </Text>
                            </View>
                            <Text style={styles.content} >
                                {this.formatTime(obj.collectTime)}
                            </Text>
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
                    renderRow={this.renderRow}
                    listParam={{userID: app.personal.info.userID}}
                    listName="vedioList"
                    renderSeparator={()=> null}
                    listUrl={app.route.ROUTE_SUBMIT_GETMYCOLLECTION}
                    />
                {
                    this.state.ShowMealBox &&
                    <ShowMealBox
                        doConfirm={this.doPayConfirm}
                        doCancle={this.doCancle}>
                    </ShowMealBox>
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
    rowItem: {
        height: 100,
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowLeft: {
        height: 72,
        width: 100,
        marginRight: 24,
        marginLeft: 20,
    },
    icon: {
        height: 72,
        width: 100,
        borderRadius: 3,
    },
    rowRight: {
        height: 72,
        width:210,
    },
    rowRightPanel: {
        height: 72,
        width:160,
    },
    title: {
        flex: 1,
        fontSize: 16,
        color:'#3C3C3C',
        fontFamily: 'STHeitiSC-Medium',
    },
    contentContainer: {
        height: 18,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    praise: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    iconPlay: {
        height: 12,
        width: 13,
    },
    content: {
        marginHorizontal: 6,
        alignSelf: 'center',
        color:'gray',
        fontSize: 12,
    },
    separator: {
        position: 'absolute',
        left: 0,
        top: 0,
        backgroundColor: '#F7F7F7',
        width: 342,
        height: 1,
        marginLeft: 13,
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
        backgroundColor: '#FFFFFF',
        alignSelf: 'center',
    },
    seletedStyle: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: '#E93536',
        alignSelf: 'center',
    },
});
