'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    Text,
    View,
    TextInput,
    Image,
} = ReactNative;

const moment = require('moment');
const MeetingRoom = require('../meeting/MeetingRoom.js');

const { Button, PageList } = COMPONENTS;
const { STATUS_TEXT_HIDE, STATUS_ALL_LOADED } = CONSTANTS.LISTVIEW_INFINITE.STATUS;

module.exports = React.createClass({
    enterMeetingRoom (obj) {
        if (app.personal.info.isSpecialSoldier === 1) {
            app.navigator.push({
                title: obj.theme,
                component: MeetingRoom,
                passProps: { roomInfo: obj },
            });
        } else {
            Toast('特种兵身份才能进入!!');
        }
    },
    renderRow (obj, sectionID, rowID) {
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
                        {'(' + obj.roomNO + ')'}
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
        );
    },
    render () {
        const { keyword, roomList } = this.props;
        return (
            <View style={styles.container}>
                <Text style={styles.titleText}>房间</Text>
                <PageList
                    ref={listView => { this.listView = listView; }}
                    renderRow={this.renderRow}
                    listParam={{ userID: app.personal.info.userID, keyword }}
                    listName='roomList'
                    listUrl={app.route.ROUTE_SEARCH_ROOM}
                    refreshEnable
                    autoLoad={false}
                    list={roomList}
                    pageNo={1}
                    infiniteLoadStatus={roomList.length < CONSTANTS.PER_PAGE_COUNT ? STATUS_ALL_LOADED : STATUS_TEXT_HIDE}
                    />
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
    itemContainer: {
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
        marginTop: 1,
        fontSize: 16,
        color:'#BDA068',
    },
    company: {
        color: '#939495',
        fontSize: 15,
        backgroundColor: 'transparent',
        width: sr.w - 40,
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
