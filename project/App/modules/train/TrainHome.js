'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    Image,
    StyleSheet,
    ListView,
    ScrollView,
    Text,
    View,
    TouchableOpacity,
} = ReactNative;

const PixelRatio = require('PixelRatio');
const TrainWaitingView = require('./TrainWaitingView.js');
const TrainSelfRecord = require('./TrainSelfRecord.js');
const RoomList = require('../meeting/RoomList.js');
const PersonInfo = require('../person/PersonInfo.js');
const ShowMealBox = require('../package/ShowMealBox.js');
const TaskMessageBox = require('../study/TaskMessageBox.js');
const moment = require('moment');

const { Button } = COMPONENTS;

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        title: '训练场',
        leftButton: { image: app.img.personal_entrance, handler: () => {
            app.navigator.push({
                component: PersonInfo,
                fromLeft: true,
            });
        } },
        // rightButton: { image: app.img.study_label_button, handler: ()=>{app.scene.toggleMenuPanel()}},
        guideLayer: require('../guide/TrainHome.js'),
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
    doCloseTask () {
        this.setState({ overlayShowTask:false });
    },
    getInitialState () {
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return {
            dataSource: this.ds.cloneWithRows([]),
            ShowMealBox: false,
        };
    },
    onWillFocus () {
        if (!this.trainingList) {
            this.getTrainingInfo(true);
        }
    },
    renderSeparator (sectionID, rowID) {
        return (
            <View
                style={styles.separator}
                key={rowID} />
        );
    },
    getTrainingInfo (wait) {
        const param = {
            userID: app.personal.info.userID,
        };
        POST(app.route.ROUTE_GET_TRAINING_INFO, param, this.getTrainingInfoSuccess, wait);
    },
    getTrainingInfoSuccess (data) {
        if (data.success) {
            const context = data.context;
            this.propList = context.propList || [];
            this.trainingList = context.trainingList || [];
            this.setState({ dataSource: this.ds.cloneWithRows(CONSTANTS.ISSUE_IOS ? [_.first(this.trainingList)] : this.trainingList) });
            // if (app.personal.info.userType == "0" || app.personal.info.userType == "1") {
            //     for(const item of this.trainingList) {
            //         app.leftTimesMgr.setLeftTimes(item.trainingCode, item.leftTimes);
            //     }
            // }
        } else {
            Toast(data.msg);
        }
    },
    doCancle () {
        this.setState({ ShowMealBox: false });
    },
    doPayConfirm () {
        app.navigator.push({
            title: '套餐',
            component: require('../package/PackageList.js'),
        });
        this.setState({ ShowMealBox: false });
    },
    doTrainPK (obj) {
        // if (obj.trainingCode === '10001') {
        //     // time
        //     const time1 = moment();
        //     const time2 = moment();
        //     time1.hour(20);
        //     time1.minute(30);
        //     time2.hour(21);
        //     time2.minute(30);
        //     if (!moment().isBetween(time1, time2)){
        //         app.showUnopenTipBox({
        //             title: '',
        //             content: '当前时间未开放',
        //         });
        //         return;
        //     }
        //     app.navigator.push({
        //         component: TrainWaitingView,
        //         passProps: {trainingCode:obj.trainingCode, trainingID: obj.id, propList:this.propList, getTrainingInfo:this.getTrainingInfo.bind(null, false) }
        //     });
        // }else {
        app.showUnopenTipBox({
            title: '',
            content: '暂未开放',
        });
        // }
    },
    doSelfTrain (obj) {
        app.navigator.push({
            component: TrainSelfRecord,
            passProps: { trainingCode:obj.trainingCode },
        });
        const param = {
            userID: app.personal.info.userID,
            objID: obj.id,
            type: 2,
        };
        POST(app.route.ROUTE_INSERT_CURRENT_TASK_LOG, param);
    },
    applyCustomRoom () {
        if (app.personal.info.isSpecialSoldier === 1) {
            app.navigator.push({
                component: RoomList,
            });
        } else {
            Toast('特种兵身份才能进入!!');
        }
    },
    renderRow (obj) {
        // const backColor = obj.backColor;
        const backColor = 'white';
        return (
            <View style={[styles.panelContainer, { backgroundColor: backColor }]}>
                <Image
                    resizeMode='contain'
                    defaultSource={app.img.common_default}
                    source={{ uri: obj.trainingLogo }}
                    style={obj.trainingCode === '10003' ? styles.iconFiveMinute : styles.icon} />
                <View style={styles.titleContainer}>
                    <Text
                        style={styles.titleText}>
                        {obj.trainingName}
                    </Text>
                    <Text
                        style={styles.detailText}
                        numberOfLines={1}>
                        {obj.trainingIntroduce}
                    </Text>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image
                                resizeMode='stretch'
                                source={app.img.train_integral}
                                style={styles.iconCount}
                                  />
                            <Text style={[styles.countText, { marginLeft: 5 }]}>
                                获胜积分:{'   '}
                            </Text>
                            <Text style={styles.countTextColor}>
                                {obj.victoryIntegral}分
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Image
                                resizeMode='stretch'
                                source={app.img.train_win}
                                style={styles.iconCountWin}
                                />
                            <Text style={[styles.countText, { marginLeft: 5 }]}>
                                胜利场次:
                            </Text>
                            <Text style={[styles.countTextColor, { marginLeft: 10 }]}>
                                {obj.victoryTimes}场
                            </Text>
                        </View>
                    </View>
                    <View style={styles.entranceContainer}>
                        <TouchableOpacity
                            style={styles.ownContainerSelf}
                            onPress={this.doSelfTrain.bind(null, obj)}>
                            <Text style={styles.entranceTextSelf}>自我训练</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    },
    render () {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.container}>
                    <View>
                        <ListView
                            initialListSize={1}
                            enableEmptySections
                            dataSource={this.state.dataSource}
                            renderRow={this.renderRow}
                            renderSeparator={this.renderSeparator}
                            />
                    </View>
                    {!CONSTANTS.ISSUE_IOS &&
                    <View style={styles.divisionContainer}>
                        <View style={styles.separator} />
                        <Text style={{ fontSize: 12, color: '#595959' }}>或者你也可以</Text>
                        <View style={styles.separator} />
                    </View>
                      }
                    {!CONSTANTS.ISSUE_IOS &&
                    <View style={[styles.panelContainer, { backgroundColor: 'white' }]}>
                        <Image
                            resizeMode='contain'
                            source={app.img.train_home}
                            style={styles.icon} />
                        <View style={styles.titleContainer}>
                            <Text
                                style={styles.titleText}>
                                      特种兵交流场
                                  </Text>
                            <Text
                                style={styles.detailText}
                                numberOfLines={1}>
                                      申请特种兵交流场房间
                                  </Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.detailText}>
                                          邀请您的特种兵好友入场交流
                                      </Text>
                            </View>
                            <View style={styles.entranceContainer}>
                                <TouchableOpacity
                                    style={styles.ownContainerApply}
                                    onPress={this.applyCustomRoom}>
                                    <Text style={styles.entranceTextApply}>进场交流</Text>
                                    <Image
                                        resizeMode='contain'
                                        source={app.img.home_train_go}
                                        style={styles.goIcon} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                      }
                    <View style={styles.emptyView} />
                </ScrollView>
                {
                    this.state.ShowMealBox &&
                    <ShowMealBox
                        doConfirm={this.doPayConfirm}
                        doCancle={this.doCancle} />
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
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    emptyView: {
        width: sr.w,
        height: 60,
    },
    panelContainer: {
        paddingVertical: 10,
        marginTop: 13,
        width:sr.w,
        flexDirection: 'row',
    },
    icon: {
        width: 25,
        height: 25,
        marginHorizontal: 10,
        marginTop: 7,
    },
    iconFiveMinute: {
        width: 20,
        height: 20,
        marginHorizontal: 10,
        marginTop: 7,
    },
    iconCount: {
        marginTop: 5,
        width: 12,
        height: 12,
    },
    iconCountWin: {
        marginTop: 5,
        marginLeft: 30,
        width: 8,
        height: 10,
    },
    titleContainer: {
        flexDirection: 'column',
        width:(sr.w - 70),
    },
    titleText: {
        fontSize: 16,
        color: 'black',
        marginVertical: 10,
    },
    detailText: {
        marginTop: 5,
        fontSize: 13,
        color: '#595959',
    },
    countText: {
        marginTop: 5,
        fontSize: 10,
        color: '#595959',
    },
    countTextColor: {
        marginTop: 5,
        fontSize: 10,
        color: '#A62045',
    },
    entranceContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 15,
        width: (sr.w - 60),
        marginBottom: 8,
    },
    ownContainerPk: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#A62045',
        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#A62045',
        width: 150,
        height: 29,
    },
    ownContainerSelf: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#A62045',
        width: 150,
        height: 29,
    },
    ownContainerApply: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#A62045',
        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#A62045',
        width: 250,
        height: 29,
        marginTop: 5,
    },
    entranceTextPk: {
        fontSize: 14,
        color: 'white',
    },
    entranceTextSelf: {
        fontSize: 14,
        color: '#A62045',
    },
    entranceTextApply: {
        fontSize: 14,
        color: 'white',
    },
    divisionContainer: {
        flexDirection: 'row',
        width: (sr.w - 40),
        marginTop: 20,
        alignItems: 'center',
        alignSelf: 'center',
    },
    separator: {
        height: 1,
        flex: 1,
        alignSelf: 'center',
        backgroundColor: '#b4b4b4',
    },
    goIcon: {
        height: 15,
        marginLeft: 10,
        marginTop:10,
    },
});
