'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableHighlight,
} = ReactNative;

const VideoPlay = require('../study/VideoPlay.js');
const ShowMealBox = require('../package/ShowMealBox.js');
const PackageList = require('../package/PackageList.js');
const { PageList } = COMPONENTS;
const { STATUS_TEXT_HIDE, STATUS_ALL_LOADED } = CONSTANTS.LISTVIEW_INFINITE.STATUS;
// 备注：因为没有课程亮点标签，所以后台选的类型事课程亮点的话就显示特种兵
const LABEL_IMAGES = [
    app.img.home_class,
    app.img.study_mark_1,
    app.img.study_mark_2,
    app.img.study_mark_3,
    app.img.study_mark_3,
];

module.exports = React.createClass({
    getInitialState () {
        return {
            ShowMealBox: false,
        };
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
    updateClickOrLikeNum (clickNum) {
        this.listView.updateList((list) => {
            const video = _.find(list, (item) => item.videoID == clickNum.videoID);
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
    playVideo (obj) {
        if (app.personal.info.userType == '0' && obj.isFree != 1) {
            this.setState({ ShowMealBox: true });
            return;
        }
        if (app.personal.info.userType == '1' && obj.isFree != 1) {
            if (_.find(app.personal.info.validVideoList, (item) => item == obj.videoID)) {
                app.navigator.push({
                    title: obj.name,
                    component: VideoPlay,
                    passProps: { videoInfo:obj, updateClickOrLikeNum: this.updateClickOrLikeNum },
                });
                return;
            }
            this.setState({ ShowMealBox: true });
            return;
        }
        app.navigator.push({
            title: obj.name,
            component: VideoPlay,
            passProps: { videoInfo:obj, updateClickOrLikeNum: this.updateClickOrLikeNum },
        });
    },
    renderRow (obj) {
        return (
            <TouchableHighlight
                onPress={this.playVideo.bind(null, obj)}
                style={styles.renderStyle}
                underlayColor='#EEB422'>
                <View style={styles.row}>
                    <View style={styles.rowLeft}>
                        <Image
                            resizeMode='stretch'
                            defaultSource={app.img.common_default}
                            source={{ uri:obj.videoListImg || obj.urlImg }}
                            style={styles.icon} />
                        <Image
                            resizeMode='stretch'
                            source={LABEL_IMAGES[obj.videoType - 1]}
                            style={styles.labelStyle} />
                    </View>
                    <View style={styles.rowRight}>
                        <Text style={styles.title} >
                            {obj.name}
                        </Text>
                        <View style={styles.contentContainer}>
                            <Text style={styles.content} >
                                {'主讲: ' + obj.author}
                            </Text>
                        </View>
                        <View style={styles.contentContainer}>
                            <Text style={styles.content} >
                                {'点击: ' + (obj.clicks * 3 + 50)}
                            </Text>
                            <Text style={styles.content} >
                                {'    赞: ' + obj.likes}
                            </Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            {
                                obj.label.map((item, i) => {
                                    if (i < 3) {
                                        return (
                                            <View key={i} style={styles.buttonTextContainer}>
                                                <Text style={styles.button} >
                                                    {item.labelName}
                                                </Text>
                                            </View>
                                        );
                                    }
                                })
                            }
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    },
    render () {
        const { keyword, videoList } = this.props;
        return (
            <View style={styles.container}>
                <Text style={styles.titleText}>学习</Text>
                <PageList
                    ref={listView => { this.listView = listView; }}
                    renderRow={this.renderRow}
                    listParam={{ userID: app.personal.info.userID, keyword, searchType: 0 }}
                    listName='videoList'
                    listUrl={app.route.ROUTE_SEARCH_VIDEO}
                    refreshEnable
                    autoLoad={false}
                    list={videoList}
                    pageNo={1}
                    infiniteLoadStatus={videoList.length < CONSTANTS.PER_PAGE_COUNT ? STATUS_ALL_LOADED : STATUS_TEXT_HIDE}
                    />
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
    },
    titleText: {
        fontSize: 16,
        color: '#8A8A8A',
        marginLeft: 20,
        marginTop: 20,
        marginBottom: 20,
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
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
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
        fontSize: 12,
    },
});
