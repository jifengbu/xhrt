'use strict';

const React = require('react');const ReactNative = require('react-native');

const {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TouchableHighlight,
    ScrollView,
} = ReactNative;

const VideoList = require('./VideoList.js');
const TaskMessageBox = require('./TaskMessageBox.js');
const PersonInfo = require('../person/PersonInfo.js');
const ShowMealBox = require('../package/ShowMealBox.js');
const PackageList = require('../package/PackageList.js');

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        title: '学习场',
        leftButton: { image: app.img.personal_entrance, handler: () => {
            app.closeSpecopsPlayer && app.closeSpecopsPlayer();
            app.navigator.push({
                component: PersonInfo,
                fromLeft: true,
            });
        } },
        // rightButton: { image: app.img.study_label_button, handler: ()=>{app.scene.toggleMenuPanel();app.closeSpecopsPlayer&&app.closeSpecopsPlayer();}},
    },
    getInitialState () {
        return {
            tabIndex: 0,
            videoList:[],
            ShowMealBox: false,
            pageData: {},
        };
    },
    componentWillMount () {
        this.lists = {
            videoList0:[],
            videoList1:[],
            videoList2:[],
            videoList3:[],
        };
        this.listFlags = 0;
    },
    onWillHide () {
        app.closeSpecopsPlayer && app.closeSpecopsPlayer();
    },
    onWillFocus () {
        const { tabIndex } = this.state;
        if (!(this.listFlags & (1 << tabIndex))) {
            this.getVideoList(tabIndex);
        }
        app.openSpecopsPlayer && app.openSpecopsPlayer();
    },
    changeTab (tabIndex) {
        const videoList = this.lists['videoList' + tabIndex];
        this.setState({ tabIndex, videoList: videoList });
        if (!(this.listFlags & (1 << tabIndex))) {
            this.getVideoList(tabIndex);
        }
    },
    getSpecopsHomeData () {
        const param = {
            userID: app.personal.info.userID,
        };
        POST(app.route.ROUTE_SPECIAL_SOLDIER_VIDEO, param, this.getSpecopsHomeDataSuccess, true);
    },
    getSpecopsHomeDataSuccess (data) {
        if (data.success) {
            this.setState({ pageData: data.context });
        } else {
            Toast(data.msg);
        }
    },
    toggleMenuPanel () {
        if (!this.state.overlayShowTask) {
            const param = {
                userID: app.personal.info.userID,
            };
            POST(app.route.ROUTE_GET_TASK_INTEGRATION, param, this.doGetTaskIntegrationSuccess, true);
        }
    },
    doGetTaskIntegrationSuccess (data) {
        if (data.success) {
            const taskList = data.context.taskList || [];
            this.setState({ taskList: taskList, overlayShowTask:true });
        } else {
            Toast(data.msg);
        }
    },
    ShowMealBoxChange () {
        // this.setState({ShowMealBox: true});
    },
    getVideoList (tabIndex) {
        if (tabIndex === 3) {
            return;
        }
        this.listFlags |= (1 << tabIndex);
        const param = {
            userID: app.personal.info.userID,
            videoType: tabIndex + 1,
            pageNo:1,
        };
        POST(app.route.ROUTE_GET_VIDEO_LIST, param, this.getVideoListSuccess.bind(null, tabIndex), this.getVideoListError.bind(null, tabIndex), true);
    },
    getVideoListSuccess (tabIndex, data) {
        if (data.success) {
            const videoList = data.context.videoList || [];
            this.lists['videoList' + tabIndex] = videoList;
            if (this.state.tabIndex === tabIndex) {
                this.setState({ videoList: videoList });
            }
        } else {
            Toast(data.msg);
            this.listFlags &= (~(1 << tabIndex));
        }
    },
    getVideoListError (tabIndex, error) {
        this.listFlags &= (~(1 << tabIndex));
    },
    doCancle () {
        this.setState({ ShowMealBox: false });
    },
    doPayConfirm () {
        app.navigator.push({
            title: '套餐',
            component: PackageList,
        });
        this.setState({ ShowMealBox: false });
    },
    doCloseTask () {
        this.setState({ overlayShowTask:false });
    },
    render () {
        const { tabIndex } = this.state;
        const menuAdminArray = ['精品课程', '精彩案例'];
        if (CONSTANTS.ISSUE_IOS) {
            _.remove(menuAdminArray, (o, i) => i === 2);
        }
        return (
            <View style={styles.container}>
                <View style={styles.tabContainer}>
                    {
                        !app.GlobalVarMgr.getItem('isFullScreen') &&
                        menuAdminArray.map((item, i) => {
                            return (
                                <TouchableHighlight
                                    key={i}
                                    underlayColor='rgba(0, 0, 0, 0)'
                                    onPress={this.changeTab.bind(null, i)}
                                    style={styles.touchTab}>
                                    <View style={styles.tabButton}>
                                        <Text style={[styles.tabText, this.state.tabIndex === i ? { color:'#A62045' } : { color:'#666666' }]} >
                                            {item}
                                        </Text>
                                        <View style={[styles.tabLine, this.state.tabIndex === i ? { backgroundColor: '#A62045' } : null]} />
                                    </View>
                                </TouchableHighlight>
                            );
                        })
                    }
                </View>
                {
                    this.state.tabIndex < 3 &&
                    <VideoList ShowMealBoxChange={this.ShowMealBoxChange} videoList={this.state.videoList} />
                }
                {
                    typeof (this.state.taskList) != 'undefined' && this.state.overlayShowTask &&
                    <TaskMessageBox
                        style={styles.overlayContainer}
                        taskList={this.state.taskList}
                        doCloseTask={this.doCloseTask}
                        doDraw={this.doDraw}
                        doShare={this.doShare} />
                }
                {
                    this.state.ShowMealBox &&
                    <ShowMealBox
                        doConfirm={this.doPayConfirm}
                        doCancle={this.doCancle} />
                }
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingBottom: 49,
    },
    tabContainer: {
        width:sr.w,
        flexDirection: 'row',
    },
    touchTab: {
        flex: 1,
        paddingTop: 20,
    },
    tabButton: {
        alignItems:'center',
        justifyContent:'center',
    },
    tabButtonCenter: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
    },
    tabButtonRight: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
        borderRadius: 9,
    },
    tabText: {
        fontSize: 13,
    },
    tabLine: {
        width: sr.w / 4,
        height: 2,
        marginTop: 10,
        alignSelf: 'center',
    },
    makeup: {
        backgroundColor:'#4FC1E9',
        top: 0,
        width: 10,
        height: 50,
        position: 'absolute',
    },
});
