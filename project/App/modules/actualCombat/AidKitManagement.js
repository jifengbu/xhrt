'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableHighlight,
} = ReactNative;

const MyAidKitDetails = require('./MyAidKitDetails.js');
const MyCaseList = require('./MyCaseList.js');
const { PageList } = COMPONENTS;

module.exports = React.createClass({
    _onPressRow (obj) {
        app.navigator.push({
            title:this.props.tabIndex === 0 ? '' : '打赏记录',
            component: this.props.tabIndex === 0 ? MyCaseList : MyAidKitDetails,
            passProps: this.props.tabIndex === 0 ? { isPlayer:this.isPlayer } : { info:obj, firstAidPacketId:obj.id },
        });
    },
    isPlayer () {

    },
    renderRow (obj) {
        return (
            <TouchableHighlight
                underlayColor='#f0f8ff'
                onPress={this._onPressRow.bind(null, obj)}>
                <View style={styles.dataContainer}>
                    <View style={styles.topStyle}>
                        <Text numberOfLines={1} style={styles.textTitle2}>
                            {'主题：' + obj.title}
                        </Text>
                        <View style={styles.rightTitle}>
                            <Image
                                resizeMode='stretch'
                                source={app.img.train_integral}
                                style={styles.iconCount}
                                />
                            <Text numberOfLines={1} style={{ fontSize:12, color:'#555555' }}>
                                    打赏
                                </Text>
                            <Text numberOfLines={1} style={{ fontSize:16 }}>
                                {'￥' + obj.price + '元'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.pictureStyle} />
                    <View style={{ backgroundColor: '#FFFFFF', marginVertical: 5 }}>
                        <Text
                            style={styles.textTitle3}
                            numberOfLines={3}>
                            {obj.desc}
                        </Text>
                    </View>
                    <View style={styles.bottomStyle}>
                        <Text numberOfLines={1} style={styles.textTitle}>
                            {'发布时间: ' + obj.releaseTime}
                        </Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    },
    render () {
        // 0表示求救包管理 1表示急救包管理
        return (
            <View style={this.props.tabIndex === 0 ? styles.container : this.props.style}>
                <PageList
                    ref={listView => { this.listView = listView; }}
                    disable={this.props.disable}
                    style={styles.list}
                    renderRow={this.renderRow}
                    renderSeparator={() => null}
                    listParam={{ userID: app.personal.info.userID }}
                    listName={'aidManageList'}
                    listUrl={app.route.ROUTE_GET_AID_MANAGE_LIST}
                    refreshEnable
                    />
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEEEEE',
        justifyContent: 'space-around',
    },
    dataContainer: {
        backgroundColor: '#FFFFFF',
        justifyContent: 'space-around',
        marginTop: 25,
    },
    topStyle: {
        height: 38,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bottomStyle: {
        height: 38,
        alignItems: 'flex-end',
        justifyContent: 'center',
        backgroundColor: '#F5F5F5',
    },
    rightTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    btnStyle: {
        height:22,
        width:60,
        marginLeft:15,
        backgroundColor: '#a0d468',
        justifyContent: 'space-around',
        borderRadius:3,
        marginBottom:5,
    },
    btnStyle2: {
        height:50,
        backgroundColor: '#4FC1E9',
        justifyContent: 'space-around',
        marginHorizontal:20,
        marginVertical:30,
        borderRadius:10,
    },
    btnText: {
        fontSize: 18,
        fontWeight: '600',
        color:'#FFFFFF',
    },
    pictureStyle: {
        height: 0.5,
        backgroundColor:'rgba(213,214,215,1)',
    },
    textTitle: {
        fontSize: 14,
        marginRight: 10,
        color :'#555555',
    },
    textTitle2: {
        flex: 1,
        fontSize: 18,
        marginHorizontal:15,
        color: 'rgba(124,125,126,1)',
    },
    textTitle3: {
        fontSize: 16,
        marginHorizontal:15,
        color: '#838B8B',
    },
    iconCount: {
        marginRight: 5,
        width: 13,
        height: 13,
    },

});
