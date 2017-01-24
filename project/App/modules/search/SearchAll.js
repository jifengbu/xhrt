'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableHighlight,
    TouchableOpacity,
    ListView,
} = ReactNative;

var moment = require('moment');
var VideoPlay = require('../study/VideoPlay.js');
var ShowMealBox = require('../package/ShowMealBox.js');
var PackageList = require('../package/PackageList.js');
var MeetingRoom = require('../meeting/MeetingRoom.js');
var QuestionDetail = require('../specops/QuestionDetail.js');
var AidDetail = require('../actualCombat/AidDetail.js');

var {PageList, Button} = COMPONENTS;
const {STATUS_TEXT_HIDE,  STATUS_ALL_LOADED} = CONSTANTS.LISTVIEW_INFINITE.STATUS;
//备注：因为没有课程亮点标签，所以后台选的类型事课程亮点的话就显示特种兵
const LABEL_IMAGES = [
     app.img.home_class,
     app.img.study_mark_1,
     app.img.study_mark_2,
     app.img.study_mark_3,
     app.img.study_mark_3,
];

module.exports = React.createClass({
    getInitialState() {
        const {videoList, questionList, roomList} = this.props;
        this.ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged : (s1, s2) => s1 !== s2
        });
        return {
            dataSource: this.ds.cloneWithRowsAndSections({videoList, questionList, roomList}),
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
    updateClickOrLikeNum(clickNum) {
        const {videoList, questionList, roomList} = this.props;
        var video = _.find(videoList, (item)=>item.videoID==clickNum.videoID);
        if (video) {
            if (clickNum.type === 'click') {
                video.clicks += 1;
            } else if (clickNum.type === 'heart') {
                video.likes += 1;
            }
            this.setState({
                dataSource: this.ds.cloneWithRowsAndSections({videoList, questionList, roomList}),
            });
        }
    },
    playVideo(obj) {
        if (app.personal.info.userType == "0" && obj.isFree != 1) {
            this.setState({ShowMealBox: true});
            return;
        }
        if (app.personal.info.userType == "1" && obj.isFree != 1) {
            if (_.find(app.personal.info.validVideoList,(item)=>item==obj.videoID)) {
                app.navigator.push({
                    title: obj.name,
                    component: VideoPlay,
                    passProps: {videoInfo:obj, updateClickOrLikeNum: this.updateClickOrLikeNum},
                });
                return;
            }
            this.setState({ShowMealBox: true});
            return;
        }
        app.navigator.push({
            title: obj.name,
            component: VideoPlay,
            passProps: {videoInfo:obj, updateClickOrLikeNum: this.updateClickOrLikeNum},
        });
    },
    renderVideoRow(obj) {
        return (
            <TouchableHighlight
                onPress={this.playVideo.bind(null, obj)}
                style={styles.renderStyle}
                underlayColor="#EEB422">
                <View style={styles.row}>
                    <View style={styles.rowLeft}>
                        <Image
                            resizeMode='stretch'
                            defaultSource={app.img.common_default}
                            source={{uri:obj.videoListImg||obj.urlImg}}
                            style={styles.icon} />
                        <Image
                            resizeMode='stretch'
                            source={LABEL_IMAGES[obj.videoType-1]}
                            style={styles.labelStyle} />
                        {
                            obj.isFree == 1&&
                            <Image
                                resizeMode='stretch'
                                source={app.img.study_free_video}
                                style={styles.labelFreeStyle} />
                        }
                    </View>
                    <View style={styles.rowRight}>
                        <Text style={styles.title} >
                            {obj.name}
                        </Text>
                        <View style={styles.contentContainer}>
                            <Text style={styles.content} >
                                {'主讲: '+obj.author}
                            </Text>
                        </View>
                        <View style={styles.contentContainer}>
                            <Text style={styles.content} >
                                {'点击: '+(obj.clicks*3+50)}
                            </Text>
                            <Text style={styles.content} >
                                {'    赞: '+obj.likes}
                            </Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            {
                                obj.label.map((item, i)=>{
                                    if (i<3) {
                                        return (
                                            <View key={i} style={styles.buttonTextContainer}>
                                                <Text style={styles.button} >
                                                    {item.labelName}
                                                </Text>
                                            </View>
                                        )
                                    }
                                })
                            }
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        )
    },
    doShowSpecialSoldierDetail(obj) {
        app.navigator.push({
            title:'问答详情',
            component: QuestionDetail,
            passProps: {obj: obj.specialSoldier, MyQuestionType:false},
        });
    },
    doShowKitsDetail(obj) {
        app.navigator.push({
            title: this.props.type===0?'求救包详情':'急救包详情',
            component: AidDetail,
            passProps: {kitInfo: obj.kits, tabIndex: obj.type, updateAidList: ()=>{}},
        });
    },
    renderSpecialSoldierRow(obj, sectionID, rowID) {
        const {specialSoldier} = obj;
        return (
            <TouchableOpacity style={styles.itemContainer} onPress={this.doShowSpecialSoldierDetail.bind(null, obj)}>
                <Text style={styles.contentRow}>
                    {'特种兵：' +specialSoldier.questionContent}
                </Text>
                <View style={styles.bottomStyle}>
                    <Text numberOfLines={1} style={styles.contextText}>
                        {specialSoldier.questionTime}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    },
    renderKitsRow(obj, sectionID, rowID) {
        const {kits, type} = obj;
        return (
            <TouchableOpacity style={styles.itemContainer} onPress={this.doShowKitsDetail.bind(null, obj)}>
                <Text style={styles.contentRow}>
                    {'实战场'+(type==0?' - 求救包':' - 急救包')+'：' +kits.title}
                </Text>
                <View style={styles.bottomStyle}>
                    <Text numberOfLines={1} style={styles.contextText}>
                        {kits.releaseTime}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    },
    renderQuestionRow(obj, sectionID, rowID) {
        const {questionType} = obj;
        if (questionType==1) {
            return this.renderSpecialSoldierRow(obj, sectionID, rowID);
        } else {
            return this.renderKitsRow(obj, sectionID, rowID);
        }
    },
    enterMeetingRoom(obj) {
        app.navigator.push({
            title: obj.theme,
            component: MeetingRoom,
            passProps: {roomInfo: obj},
        });
    },
    renderRoomRow(obj, sectionID, rowID) {
        return (
            <View style={styles.itemContainer}>
                <View style={styles.sectionContainer}>
                    <Text
                        numberOfLines={1}
                        style={styles.theme}>
                        {obj.theme}
                    </Text>
                    <Text
                        numberOfLines={1}
                        style={styles.roomNo}>
                        {'('+obj.roomNO+')'}
                    </Text>
                </View>
                <View style={styles.sectionContainer}>
                    <Text style={styles.company}>
                        {obj.company}
                    </Text>
                </View>
                <View style={styles.sectionContainer}>
                    <Text style={styles.time}>开始时间:{moment(obj.startTime).format('YYYY-MM-DD HH:mm:ss')}</Text>
                    <Button
                        style={styles.btnStyle}
                        textStyle={styles.btnStyleText}
                        onPress={this.enterMeetingRoom.bind(null, obj)}
                        >
                        进入房间
                    </Button>
                </View>
            </View>
        )
    },
    renderRow(obj, sectionID, rowID) {
        if (sectionID==='videoList') {
            return this.renderVideoRow(obj, sectionID, rowID);
        } else if (sectionID==='questionList') {
            return this.renderQuestionRow(obj, sectionID, rowID);
        } else {
            return this.renderRoomRow(obj, sectionID, rowID);
        }
    },
    renderSectionHeader(obj, sectionID) {
        var text = (sectionID==='videoList')?'学习':(sectionID==='questionList')?'问答':'房间';
        return (
            <View style={styles.listHeaderContainer}>
                {sectionID!=='videoList' && <View style={styles.listHeaderSeparator}/>}
                <Text style={styles.titleText}>{text}</Text>
                <View style={styles.separator} />
            </View>
        );
    },
    renderSeparator(sectionID, rowID) {
        return (
            <View style={styles.separator} key={sectionID+''+rowID}/>
        );
    },
    renderFooter() {
        return (
            <View style={styles.listFooterContainer} />
        )
    },
    render() {
        const {dataSource} = this.state;
        return (
            <View style={styles.container}>
                <ListView
                    initialListSize={1}
                    enableEmptySections={true}
                    dataSource={dataSource}
                    style={styles.list}
                    renderRow={this.renderRow}
                    renderSectionHeader={this.renderSectionHeader}
                    renderSeparator={this.renderSeparator}
                    renderFooter={this.renderFooter}
                    />
                {
                    this.state.ShowMealBox &&
                    <ShowMealBox
                        doConfirm={this.doPayConfirm}
                        doCancle={this.doCancle}>
                    </ShowMealBox>
                }
            </View>
        );
    },
});


var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EDEEEF',
    },
    separator: {
        height:1,
        marginHorizontal: 10,
        backgroundColor: '#CCC'
    },
    listHeaderContainer: {
        backgroundColor: '#FFFFFF',
    },
    listHeaderSeparator: {
        height: 20,
        backgroundColor: '#EDEEEF',
    },
    listFooterContainer: {
        height: 40,
    },
    titleText: {
        fontSize: 16,
        color: '#8A8A8A',
        marginLeft: 10,
        marginTop: 30,
        marginBottom: 10,
    },
    icon: {
        marginHorizontal:5,
        marginTop:10,
        marginBottom:5,
        height: 80,
        width: 120,
    },
    labelStyle: {
        position: 'absolute',
        right: 5,
        top: 10,
        height: 50,
        width: 50,
    },
    labelFreeStyle: {
        position: 'absolute',
        left: 3,
        bottom: 6,
        height: 20,
        width: 60,
    },
    row: {
        height: 100,
        width: sr.w,
        paddingLeft: 10,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    renderStyle: {
        height: 105,
        width: sr.w,
    },
    rowLeft: {
        height:100,
        flexDirection: 'row',
        marginRight: 10,
    },
    rowRight: {
        height:100,
        flex: 1,
    },
    title: {
        flex: 1,
        fontSize:15,
        color:'gray',
        marginTop: 10,
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    content: {
        alignSelf: 'center',
        color:'gray',
        fontSize: 12,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 10,
    },
    buttonTextContainer: {
        height: 20,
        backgroundColor:'#e1e4e9',
        marginRight: 5,
        paddingVertical: 2,
        paddingHorizontal: 6,
        borderRadius: 2,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    button: {
        color:'#95999f',
        fontSize: 12
    },
    contentRow: {
        fontSize: 16,
        color: '#717273',
    },
    bottomStyle: {
        height: 30,
        justifyContent: 'center',
    },
    contextText: {
        fontSize: 11,
        marginRight: 10,
        color: 'grey',
        alignSelf:'flex-end',
    },
    itemContainer: {
        paddingVertical: 10,
        paddingLeft: 10,
        paddingRight: 6,
        backgroundColor: '#FFFFFF',
        borderRadius: 3,
    },
    sectionContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 5,
    },
    theme: {
        fontSize: 16,
        color:'#444444',
    },
    roomNo:{
        marginTop: 1,
        fontSize: 16,
        color:'#BDA068',
    },
    company: {
        color: '#939495',
        fontSize: 15,
        backgroundColor: '#EDEEEF',
    },
    time: {
        color: '#939495',
        fontSize: 13,
    },
    btnStyle: {
        position: 'absolute',
        top: 0,
        right: 0,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 3,
    },
    btnStyleText: {
        fontSize: 14,
        fontWeight: '800',
    },
});
