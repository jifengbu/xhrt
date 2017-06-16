'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    View,
    Text,
    Image,
    StyleSheet,
    ListView,
    TouchableOpacity,
    TouchableHighlight,
} = ReactNative;

const moment = require('moment');
const PageList = require('./PageList20.js');
const { Button, MessageBox, DImage } = COMPONENTS;

module.exports = React.createClass({
    statics: {
        color: '#FFFFFF',
        title: '邀请记录',
        leftButton: { image: app.img.common_back, handler: () => { app.navigator.pop(); } },
    },
    getInitialState () {
        return {
            number: 0,
            reward: 0.00,
            titleText: '',
            isShow: true,
        };
    },
    onGetList(data, pageNo){
         let { number, reward} = data.context;
         reward = reward&&reward.toFixed(2);
         this.setState({number, reward});
    },
    renderSeparator (sectionID, rowID) {
        return (
            <View>
            {
                rowID != 0&&
                <View style={styles.separator}/>
            }
            </View>
        );
    },
    renderRow (obj, sectionID, rowID, onRowHighlighted) {
        let states = obj.payState == 0?'未付款':'成功付款';
        return (
            <View style={styles.itemContainer}>
                {
                    rowID != 0&&
                    <View style={styles.separator}/>
                }
                <View style={styles.leftView}>
                    <DImage
                        resizeMode='cover'
                        defaultSource={app.img.personal_head}
                        source={{uri: obj.userImg}}
                        style={styles.img_icon} />
                    <View style={styles.name_style}>
                        <Text style={styles.name_text}>{obj.userName}</Text>
                        <Text style={styles.num_text}>{obj.phone}</Text>
                    </View>
                </View>
                <View style={styles.rightView}>
                    <Text style={[styles.stateText,{color: obj.payState == 0?'red':'#333333'}]}>{states}</Text>
                    <Text style={styles.dateText}>{obj.createTime&&moment(obj.createTime).format('YYYY/MM/DD HH:mm')}</Text>
                </View>
            </View>
        );
    },
    render () {
        let { reward, number, titleText, isShow } = this.state;
        return (
            <View style={styles.container}>
                {
                    isShow?
                    <View style={styles.themeStyle}>
                        <View style={styles.themeStyle2}>
                            <Text style={styles.theme_text}>
                                {'已邀请好友: '}
                            </Text>
                            <Text style={styles.theme_text2}>
                                {number}
                            </Text>
                            <Text style={styles.theme_text}>
                                {'人'}
                            </Text>
                        </View>
                        <View style={styles.themeStyle2}>
                            <Text style={styles.theme_text}>
                                {'获得奖励: '}
                            </Text>
                            <Text style={styles.theme_text2}>
                                {reward}
                            </Text>
                            <Text style={styles.theme_text}>
                                {'元'}
                            </Text>
                        </View>
                    </View>:
                    <View style={styles.titleStyle}>
                        <Text style={styles.title_text}>
                            {titleText}
                        </Text>
                    </View>
                }
                <PageList
                    ref={listView => { this.listView = listView; }}
                    renderRow={this.renderRow}
                    renderSeparator={this.renderSeparator}
                    listParam={{ userID: app.personal.info.userID }}
                    listName='invitationList'
                    listUrl={app.route.ROUTE_INVITATION_LIST}
                    onGetList={this.onGetList}
                    />
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEEEEE',
    },
    separator: {
        position: 'absolute',
        top: 0,
        height: 1,
        width: sr.w-50,
        left: 25,
        backgroundColor: '#EEEEEE',
    },
    listFooterContainer: {
        alignItems: 'center',
    },
    listFooter: {
        color: 'gray',
        fontSize: 14,
    },
    listStyle: {
        alignSelf:'stretch',
        backgroundColor: '#eeeeee',
    },
    themeStyle: {
        height: 45,
        width: sr.w,
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    themeStyle2: {
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
    },
    titleStyle: {
        height: 45,
        width: sr.w,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    itemContainer: {
        width: sr.w,
        paddingHorizontal: 10,
        height: 72,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
    },
    leftView: {
        marginLeft: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    name_style: {
        marginLeft: 10,
    },
    img_icon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'lightgray',
    },
    name_text: {
        fontSize: 14,
        color: '#333333',
    },
    dateText: {
        fontSize: 14,
        color: '#888888',
        marginTop: 5,
    },
    rightView: {
        marginRight: 15,
        alignItems: 'flex-end',
    },
    stateText: {
        fontSize: 14,
    },
    theme_text: {
        fontSize: 14,
        color: '#333333',
    },
    theme_text2: {
        fontSize: 14,
        color: '#DC3237',
    },
    title_text: {
        fontSize: 14,
        color: '#777777',
    },
    num_text: {
        fontSize: 14,
        marginTop: 5,
        color: '#333333',
    },
});
