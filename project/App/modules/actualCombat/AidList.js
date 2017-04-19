'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    StyleSheet,
    Image,
    View,
    TouchableHighlight,
    Text,
    TouchableOpacity,
} = ReactNative;

const UmengMgr = require('../../manager/UmengMgr.js');
const AidDetail = require('./AidDetail.js');
const { PageList } = COMPONENTS;

module.exports = React.createClass({
    _onPressRow (obj) {
        app.navigator.push({
            title: this.props.type === 0 ? '求救包详情' : '急救包详情',
            component: AidDetail,
            passProps: { kitInfo: obj, tabIndex: this.props.type, updateAidList: this.updateAidList },
        });
    },
    checkFirstPageList () {
        if (!this.hasGetList) {
            this.hasGetList = true;
            this.listView.getList(true);
        }
    },
    updateAidList (kitId, type) {
        this.listView.updateList((list) => {
            const item = _.find(list, (o) => o.id == kitId);
            if (item) {
                if (type === 0) {
                    item.persons += 1;
                } else {
                    item.num += 1;
                }
            }
            return list;
        });
    },
    doRefresh () {
        this.listView.refresh();
    },
    _onPress (index, rowID) {
        switch (index) {
            case 0:
                const param = {
                    userID: app.personal.info.userID,
                    type:this.props.type,
                    kitID: this.listView.list[rowID].id,
                };
                POST(app.route.ROUTE_PARISE_KITS, param, this.praiseKitsSuccess.bind(null, rowID));
                break;
            case 1:
                this.doShare();// 弹出分享框
                break;
        }
    },
    praiseKitsSuccess (rowID, data) {
        if (data.success) {
            const aidInfo = this.listView.list[rowID];
            if (aidInfo) {
                aidInfo.isPraise = aidInfo.isPraise == 0 ? 1 : 0;
                aidInfo.isPraise == 0 ? aidInfo.praiseCount -= 1 : aidInfo.praiseCount += 1;
            }
            this.listView.updateList(list => list);
        } else {
            Toast(data.msg);
        }
    },
    doShare () {
        UmengMgr.doActionSheetShare(CONSTANTS.SHARE_APPDOWNLOAD_SERVER, '急救包分享', '赢销截拳道APP下载页面', 'web', CONSTANTS.SHARE_IMGDIR_SERVER + 'study-video.png', this.doShareCallback);
    },
    doShareCallback () {
        // 分享回调
    },
    renderRow (obj, sectionID, rowID) {
        const isFirstTap = this.props.type === 0;
        const tempPrice = obj.price.toFixed(2);
        return (
            <TouchableHighlight
                style={styles.itemContainer}
                onPress={this._onPressRow.bind(null, obj)}
                underlayColor='#EEB422'>
                <View style={styles.container}>
                    <View style={styles.topPanelStyle}>
                        <View style={styles.titleContainer}>
                            <Text numberOfLines={1} style={[styles.titleText, { flex: 1 }]}>
                                {obj.title}
                            </Text>
                            <View style={styles.rightTitle}>
                                <Image
                                    resizeMode='stretch'
                                    source={app.img.train_integral}
                                    style={styles.iconCount}
                                    />
                                <Text style={styles.rewardText}>
                                    {this.props.type === 0 ? '悬赏 ' : '打赏 '}
                                </Text>
                                <Text style={styles.titleText}>
                                    {'¥ ' + tempPrice + '元'}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.separator} />
                        <Text
                            numberOfLines={2}
                            style={styles.contextText1}>
                            {obj.desc}
                        </Text>
                        <Text style={styles.contextTime}>
                            {obj.releaseTime}
                        </Text>
                    </View>
                    <View style={styles.bottomPanelStyle}>
                        <View style={styles.btnContainer}>
                            <Text style={[styles.contextText, { marginLeft: 10 }]}>
                                {isFirstTap ? '报名人数: ' : '打赏人数: '}{isFirstTap ? obj.persons : obj.num}
                            </Text>
                        </View>
                        <View style={styles.btnContainer}>
                            <TouchableOpacity
                                onPress={this._onPress.bind(null, 0, rowID)}
                                style={styles.menuBtnContainer}>
                                <Image
                                    resizeMode='contain'
                                    source={obj.isPraise == 1 ? app.img.study_heart_press : app.img.study_heart}
                                    style={styles.imageStyle} />
                                <Text style={styles.panleMenuBtnText}>
                                    {obj.praiseCount}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={this._onPress.bind(null, 1, rowID)}
                                style={styles.menuBtnContainer}>
                                <Image
                                    resizeMode='contain'
                                    source={app.img.study_share}
                                    style={styles.imageStyle} />
                                <Text style={styles.panleMenuBtnText}>
                                    分享
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    },
    render () {
        return (
            <View style={this.props.style}>
                <PageList
                    ref={listView => { this.listView = listView; }}
                    autoLoad={false}
                    disable={this.props.disable}
                    renderRow={this.renderRow}
                    renderSeparator={() => null}
                    listParam={{ type: this.props.type, userID: app.personal.info.userID }}
                    listName='kidsList'
                    listUrl={app.route.ROUTE_GET_KITS}
                    refreshEnable
                    />
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection: 'column',
    },
    itemContainer: {
        marginTop: 5,
        marginBottom: 20,
        backgroundColor: '#FFFFFF',
    },
    separator: {
        width: sr.w,
        backgroundColor: '#EEEEEE',
        marginTop: 8,
        marginBottom: 10,
        height: 1,
    },
    topPanelStyle: {
        paddingTop: 7,
        paddingBottom: 5,
        flexDirection: 'column',
    },
    titleText: {
        fontSize: 16,
        fontWeight: '400',
        color: CONSTANTS.THEME_COLOR,
    },
    rewardText: {
        fontSize: 12,
        fontWeight: '400',
        color: 'grey',
    },
    rightTitle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
    contextTime: {
        fontSize: 11,
        marginRight: 10,
        marginTop: 5,
        alignSelf: 'flex-end',
        color: 'grey',
    },
    contextText: {
        fontSize: 11,
        marginRight: 10,
        color: 'grey',
    },
    contextText1: {
        fontSize: 14,
        height: 40,
        marginHorizontal: 10,
        color: '#999999',
        fontWeight: '400',
    },
    bottomPanelStyle: {
        backgroundColor: '#f7f7f7',
        flexDirection: 'row',
        paddingVertical: 4,
        justifyContent: 'space-between',
        width: sr.w,
    },
    btnContainer: {
        height: 25,
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuBtnContainer: {
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 5,
        marginHorizontal: 5,
    },
    imageStyle: {
        width:20,
        height:20,
    },
    panleMenuBtnText: {
        marginRight: 5,
        fontSize: 11,
        color: 'grey',
    },
    iconCount: {
        marginRight: 5,
        width: 12,
        height: 12,
    },
});
