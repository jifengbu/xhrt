'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    Image,
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
} = ReactNative;

const SearchAll = require('./SearchAll.js');
const SearchVideoList = require('./SearchVideoList.js');
const SearchQuestionList = require('./SearchQuestionList.js');
const SearchRoomList = require('./SearchRoomList.js');

const { Button } = COMPONENTS;
let searchText = '';

const Title = React.createClass({
    render () {
        return (
            <View style={styles.txtInputView}>
                <TextInput
                    placeholder='输入搜索关键字'
                    defaultValue={searchText}
                    onChangeText={(text) => { searchText = text; }}
                    onSubmitEditing={this.props.doStartSearch}
                    style={styles.txtInputSearch}
                    />
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={this.props.doStartSearch}
                    style={styles.txtFindView}>
                    <Image
                        resizeMode='cover'
                        source={app.img.search_search}
                        style={styles.icon_find} />
                </TouchableOpacity>
            </View>
        );
    },
});

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        title: (<Title doStartSearch={() => { app.scene.doStartSearch(); }} />),
        leftButton: { image: app.img.common_back2, handler: () => { app.navigator.pop(); } },
        rightButton: { image: app.img.home_fnd, handler: () => { app.scene.doStartSearch(); } },
    },
    componentWillUnmount () {
        app.dismissProgressHUD();
    },
    doStartSearch () {
        this.doSearch(searchText, 0);
    },
    doSearch (keyword, searchType) {
        if (keyword === '') {
            Toast('请输入搜索关键字');
            return;
        }
        const param = {
            keyword: keyword,
            userID: app.personal.info.userID,
        };
        POST(app.route.ROUTE_SEARCH, param, this.doSearchSuccess.bind(null, keyword), true);
    },
    doSearchSuccess (keyword, data) {
        if (data.success) {
            let { videoList, questionList, roomList } = data.context;
            videoList = videoList || [];
            questionList = questionList || [];
            roomList = roomList || [];
            if (!(videoList.length || questionList.length || roomList.length)) {
                Toast('没有相关内容');
                return;
            }
            app.navigator.push({
                title: !keyword ? '为您推荐' : keyword + ' 的结果',
                component: SearchAll,
                passProps: { videoList, questionList, roomList },
            });
        } else {
            Toast('没有相关内容');
        }
    },
    doSearchVideo () {
        const param = {
            keyword: searchText,
            userID: app.personal.info.userID,
            searchType: 0,
            pageNo: 1,
        };
        POST(app.route.ROUTE_SEARCH_VIDEO, param, this.doSearchVideoSuccess.bind(null, searchText), true);
    },
    doSearchVideoSuccess (keyword, data) {
        if (data.success) {
            const videoList = data.context.videoList || [];
            if (!videoList.length) {
                Toast('没有相关视频');
                return;
            }
            app.navigator.push({
                title: !keyword ? '为您推荐' : keyword + ' 的结果',
                component: SearchVideoList,
                passProps: { videoList, keyword },
            });
        } else {
            Toast(data.msg);
        }
    },
    doSearchQuestion () {
        const param = {
            keyword: searchText,
            userID: app.personal.info.userID,
            pageNo: 1,
        };
        POST(app.route.ROUTE_SEARCH_QUESTION, param, this.doSearchQuestionSuccess.bind(null, searchText), true);
    },
    doSearchQuestionSuccess (keyword, data) {
        if (data.success) {
            const questionList = data.context.questionList || [];
            if (!questionList.length) {
                Toast('没有相关问题');
                return;
            }
            app.navigator.push({
                title: !keyword ? '为您推荐' : keyword + ' 的结果',
                component: SearchQuestionList,
                passProps: { questionList, keyword },
            });
        } else {
            Toast(data.msg);
        }
    },
    doSearchRoom () {
        const param = {
            keyword: searchText,
            userID: app.personal.info.userID,
            pageNo: 1,
        };
        POST(app.route.ROUTE_SEARCH_ROOM, param, this.doSearchRoomSuccess.bind(null, searchText), true);
    },
    doSearchRoomSuccess (keyword, data) {
        if (data.success) {
            const roomList = data.context.roomList || [];
            if (!roomList.length) {
                Toast('没有相关房间');
                return;
            }
            app.navigator.push({
                title: !keyword ? '为您推荐' : keyword + ' 的结果',
                component: SearchRoomList,
                passProps: { roomList, keyword },
            });
        } else {
            Toast(data.msg);
        }
    },
    render () {
        return (
            <View style={styles.container}>
                <View style={styles.typeContainer}>
                    <TouchableOpacity style={styles.itemContainer} onPress={this.doSearchVideo}>
                        <Image
                            resizeMode='cover'
                            source={app.img.search_study}
                            style={styles.menuIcon} />
                        <Text style={styles.menuTest}>学习</Text>
                    </TouchableOpacity>
                    {
                            !CONSTANTS.ISSUE_IOS &&
                            <TouchableOpacity style={styles.itemContainer} onPress={this.doSearchQuestion}>
                                <Image
                                    resizeMode='cover'
                                    source={app.img.search_question}
                                    style={styles.menuIcon} />
                                <Text style={styles.menuTest}>问答</Text>
                            </TouchableOpacity>
                        }
                    {
                            !CONSTANTS.ISSUE_IOS &&
                            <TouchableOpacity style={styles.itemContainer} onPress={this.doSearchRoom}>
                                <Image
                                    resizeMode='cover'
                                    source={app.img.search_room}
                                    style={styles.menuIcon} />
                                <Text style={styles.menuTest}>交流场</Text>
                            </TouchableOpacity>
                        }
                </View>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEEEEE',
    },
    typeContainer: {
        flexDirection: 'row',
        height: 200,
    },
    itemContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuIcon: {
        width: 70,
        height: 70,
    },
    menuTest: {
        marginTop: 10,
        fontSize: 14,
        color: '#969696',
    },
    txtInputSearch: {
        height: 25,
        width: 270,
        color: '#FFFFFF',
        paddingVertical: -2,
        fontSize: 14,
        marginLeft: 5,
        borderColor: '#D7D7D7',
        backgroundColor: 'transparent',
        overflow: 'hidden',
        alignItems:'center',
    },
    txtInputView: {
        height: 25,
        width: 306,
        marginLeft: 30,
        paddingVertical: -10,
        borderRadius: 4,
        backgroundColor: '#8b1a3b',
        flexDirection: 'row',
        overflow: 'hidden',
        alignItems:'center',
    },
    txtFindView: {
        backgroundColor: 'transparent',
        width: 25,
        height: 25,
        justifyContent:'center',
        alignItems:'center',
    },
    icon_find: {
        height: 20,
        width: 20,
    },
});
