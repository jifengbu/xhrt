'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
    Text,
    View,
    TextInput,
    Image,
} = ReactNative;

var moment = require('moment');
var ApplyRoom = require('./ApplyRoom.js');
var MeetingRoom = require('./MeetingRoom.js');
var PasswordInputBox = require('./PasswordInputBox.js');

var {Button, PageList} = COMPONENTS;

module.exports = React.createClass({
    statics: {
        title: '特种兵交流场',
        guideLayer: require('../guide/ApplyField.js'),
    },
    getInitialState() {
        return {
            searchText: '',
        };
    },
    doSearch() {
        if (this.listView.isRefreshing()) {
            Toast("请求太频繁，请稍后再试");
            return;
        }
        this.listView.refresh();
        this.setState({searchText:''});
    },
    refresh() {
        this.listView.refresh();
    },
    doShowApplyView() {
        app.navigator.push({
            component: ApplyRoom,
            passProps: {refresh: this.refresh},
        });
    },
    enterMeetingRoom(obj) {
        app.navigator.push({
            title: obj.theme,
            component: MeetingRoom,
            passProps: {roomInfo: obj},
        });
    },
    renderRow(obj, sectionID, rowID) {
        return (
            <View style={styles.itemContainer}>
                <View style={styles.itemInnerContainer}>
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
                        <Text style={styles.company}
                            numberOfLines={2}>
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
            </View>
        )
    },
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <Button
                        onPress={this.doShowApplyView}
                        style={styles.btnApply}
                        textStyle={styles.btnApplyText}>
                        创建房间
                    </Button>
                    <View style={styles.txtInputView}>
                        <Image
                            resizeMode='stretch'
                            source={app.img.train_search}
                            style={styles.txtInputImage}
                            />
                        <View style={styles.txtInputTView}/>
                        <TextInput
                            placeholder="输入房间代号"
                            onChangeText={(text) => this.setState({searchText: text})}
                            defaultValue={this.state.searchText}
                            style={styles.txtInputSearch}
                            />
                    </View>
                    <Button
                        onPress={this.doSearch}
                        style={styles.btnSearch}
                        textStyle={styles.btnSearchText}>
                        搜索
                    </Button>
                </View>
                <PageList
                    ref={listView=>this.listView=listView}
                    renderRow={this.renderRow}
                    listParam={{userID: app.personal.info.userID, keyword: this.state.searchText,}}
                    listName="roomList"
                    listUrl={app.route.ROUTE_SEARCH_ROOM}
                    refreshEnable={true}
                    />
            </View>
        );
    }
});


var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchContainer: {
        marginTop: 10,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    btnApply: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 3,
        height: 30,
        marginRight: 6,
        width: 100
    },
    btnApplyText: {
        fontSize: 16,
        fontWeight: '800',
    },
    txtInputView: {
        flexDirection: 'row',
        flex: 1,
        height: 32,
        borderWidth: 1,
        borderColor: '#D7D7D7',
        borderRadius: 3,
        backgroundColor: '#FFFFFF',
    },
    txtInputImage: {
        width: 28,
        height: 28,
        margin: 1,
    },
    txtInputTView: {
        width: 2,
        marginTop: 4,
        height: 24,
        borderWidth: 1,
        borderColor: '#D7D7D7',
    },
    txtInputSearch: {
        flex: 1,
        height: 30,
        fontSize: 14,
        paddingLeft: 10,
        paddingVertical: -2,
        backgroundColor: '#FFFFFF',
    },
    btnSearch: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 3,
        height: 30,
        width: 65,
    },
    btnSearchText: {
        fontSize: 16,
        fontWeight: '800',
    },
    listView: {
        flex: 1,
    },
    itemContainer: {
        marginHorizontal:5,
        paddingVertical: 5,
        paddingHorizontal: 5,
    },
    itemInnerContainer: {
        paddingVertical: 10,
        paddingHorizontal: 5,
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
        fontSize: 15,
        color:'#BDA068',
    },
    company: {
        color: '#939495',
        fontSize: 15,
        backgroundColor: 'transparent',
        width: sr.w-40,
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
        width:100,
    },
    btnStyleText: {
        fontSize: 14,
        fontWeight: '800',
    },
});
