'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    Text,
    Image,
    ListView,
    ScrollView,
    TouchableHighlight,
    TouchableOpacity,
} = ReactNative;

const BuyPlan = require('./BuyPlan.js');
const ShowMealBox = require('./ShowMealBox.js');
const VideoPlay = require('../study/VideoPlay.js');

const { PageList } = COMPONENTS;
module.exports = React.createClass({
    getInitialState () {
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return {
            dataSource: this.ds.cloneWithRows([]),
            tabIndex: 0,
            packageContext: {},
            overlayShowBuyPromptMessageBox: false,
        };
    },
    componentDidMount () {
        this.getPackageItem();
    },
    getPackageItem () {
        const param = {
            userID: app.personal.info.userID,
            packageID: this.props.packageData.packageID,
            typeCode: this.props.packageData.typeCode,
        };
        POST(app.route.ROUTE_GET_PACKAGE_ITEM, param, this.getPackageItemSuccess, true);
    },
    getPackageItemSuccess (data) {
        if (data.success) {
            const context = data.context;
            const packageVideoList = data.context.packageVideoList || [];
            this.setState({ packageContext: context, dataSource: this.ds.cloneWithRows(CONSTANTS.ISSUE_IOS ? [_.first(packageVideoList)] : packageVideoList) });
        } else {
            Toast(data.msg);
        }
    },
    // 更新视频的播放和点赞数量
    updateClickOrLikeNum (clickNum) {
        const video = _.find(this.state.packageContext.packageVideoList, (item) => item.videoID == clickNum.videoID);
        if (video) {
            if (clickNum.type === 'click') {
                video.clicks += 1;
            } else if (clickNum.type === 'heart') {
                video.likes += 1;
            }
            this.setState({ dataSource: this.ds.cloneWithRows(this.state.packageContext.packageVideoList) });
        }
    },
    _onPressRow (obj) {
        if (app.personal.info.userType == '0') {
            this.setState({ overlayShowBuyPromptMessageBox: true });
            return;
        }
        if (app.personal.info.userType == '1') {
            if (_.find(app.personal.info.validVideoList, (item) => item == obj.videoID)) {
                app.navigator.push({
                    title: obj.name,
                    component: VideoPlay,
                    passProps: { videoInfo:obj, updateClickOrLikeNum: this.updateClickOrLikeNum },
                });
                return;
            }
            this.setState({ overlayShowBuyPromptMessageBox: true });
            return;
        }
        app.navigator.push({
            title: obj.name,
            component: VideoPlay,
            passProps: { videoInfo: obj },
        });
    },
    renderRow (obj) {
        return (
            <TouchableHighlight
                onPress={this._onPressRow.bind(null, obj)}
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
                            source={app.img.home_boutique_curriculum}
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
                                {'播放: ' + (obj.clicks * 3 + 50)}
                            </Text>
                            <Text style={styles.content} >
                                {'    赞: ' + obj.likes}
                            </Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            {
                                obj.label.map((item, i) => {
                                    return (
                                        i < 3 &&
                                        <View key={i} style={styles.buttonTextContainer}>
                                            <Text style={styles.button} >
                                                {item.labelName}
                                            </Text>
                                        </View>
                                    );
                                })
                            }
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    },
    renderSeparator (sectionID, rowID) {
        return (
            <View
                style={styles.separator}
                key={rowID} />
        );
    },
    CourseList () {
        return (
            <View style={this.state.tabIndex === 0 ? { left:-sr.tw, top:0, position:'absolute' } : { flex:1 }}>
                <View style={styles.panelContainer}>
                    <ListView
                        initialListSize={1}
                        enableEmptySections
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow}
                        renderSeparator={this.renderSeparator}
                        />
                    {
                        app.personal.info.userType == '0' || app.personal.info.userType == '1' ?
                            <View
                                style={styles.doTrainStyle}>
                                <Text style={styles.doTrainText}>{'剩余' + this.state.packageContext.packageTime + '/' + this.state.packageContext.packageTimeAll + '次  ' + this.state.packageContext.packageTitle + '  训练机会'}</Text>
                            </View> : null
                    }
                </View>
                {
                    this.state.overlayShowBuyPromptMessageBox &&
                    <ShowMealBox
                        doCancle={this.doCancle}
                        doConfirm={this.doConfirm} />
                }
            </View>
        );
    },
    PackageDetail () {
        let arrayList = [];
        if (this.state.packageContext.packageContent != undefined) {
            arrayList = this.state.packageContext.packageContent.split('_');
        }
        return (
            <View style={this.state.tabIndex === 0 ? { flex:1 } : { left:-sr.tw, top:0, position:'absolute' }}>
                <View style={styles.panelContainer}>
                    <Text style={styles.titleStyle}>
                        {this.state.packageContext.packageTitle}
                    </Text>
                    {
                        arrayList.map((item, i) => {
                            return (
                                <View key={i} style={styles.detailContainer}>
                                    <View style={styles.dotStyle} />
                                    <Text style={styles.textStyle}>
                                        {item}
                                    </Text>
                                </View>
                            );
                        })
                    }
                </View>
            </View>
        );
    },
    changeTab (tabIndex) {
        this.setState({ tabIndex });
    },
    doConfirm () {
        this.setState({ overlayShowBuyPromptMessageBox: false });
        app.navigator.push({
            component: BuyPlan,
            passProps: { packageData: this.props.packageData, packageContext: this.state.packageContext },
        });
    },
    doCancle () {
        this.setState({ overlayShowBuyPromptMessageBox: false });
    },
    render () {
        return (
            <View style={styles.container}>
                <View style={styles.changeTabContainer}>
                    <TouchableOpacity
                        onPress={this.changeTab.bind(null, 0)}
                        style={styles.tabButtonLeft}>
                        <Text style={[styles.tabText, this.state.tabIndex === 0 ? { color:'#239fdb' } : null]} >套餐详情</Text>
                        <View style={[styles.tabLine, this.state.tabIndex === 0 ? { backgroundColor: '#239fdb' } : null]} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.changeTab.bind(null, 1)}
                        style={styles.tabButtonCenter}>
                        <Text style={[styles.tabText, this.state.tabIndex === 1 ? { color:'#239fdb' } : null]} >课程目录</Text>
                        <View style={[styles.tabLine, this.state.tabIndex === 1 ? { backgroundColor: '#239fdb' } : null]} />
                    </TouchableOpacity>
                </View>
                <this.PackageDetail />
                <this.CourseList />
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        alignSelf:'stretch',
    },
    changeTabContainer: {
        height: 40,
        paddingTop: 10,
        flexDirection: 'row',
        overflow: 'hidden',
        backgroundColor: '#feffff',
    },
    tabButtonLeft: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
    },
    tabButtonCenter: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
    },
    tabText: {
        fontSize: 16,
    },
    panelContainer: {
        marginTop: 10,
        flex: 1,
        backgroundColor: '#feffff',
    },
    titleStyle: {
        marginTop: 30,
        color: '#239fdb',
        fontSize: 20,
        marginLeft: 10,
    },
    detailContainer: {
        flexDirection: 'row',
        marginLeft: 15,
        marginTop: 20,
    },
    textStyle: {
        fontSize: 16,
        color: 'grey',
        marginLeft: 20,
        marginRight: 20,
    },
    tabLine: {
        width: 120,
        height: 3,
        marginTop: 10,
        alignSelf: 'center',
    },
    dotStyle: {
        width: 10,
        height: 10,
        alignSelf: 'center',
        borderRadius: 5,
        backgroundColor: '#239fdb',
    },
    row: {
        height: 100,
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
    },
    rowLeft: {
        height:100,
        flexDirection: 'row',
        marginRight: 10,
    },
    icon: {
        marginHorizontal:5,
        marginTop:10,
        marginBottom:5,
        height: 80,
        width: 120,
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
    labelStyle: {
        position: 'absolute',
        right: 3,
        top: 8,
        height: 60,
        width: 60,
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    content: {
        color:'gray',
        fontSize: 12,
    },
    buttonContainer: {
        marginBottom: 10,
        flex: 1,
        flexDirection: 'row',
    },
    buttonTextContainer: {
        height: 20,
        backgroundColor:'#e1e4e9',
        marginRight: 5,
        paddingVertical: 2,
        paddingHorizontal: 2,
        borderRadius: 2,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    button: {
        color:'#95999f',
        fontSize: 14,
    },
    separator: {
        height:5,
        backgroundColor: '#CCC',
    },
    doTrainStyle: {
        width: sr.w,
        height: 50,
        alignSelf: 'flex-end',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#a0d26f',
    },
    doTrainText: {
        fontSize: 20,
        color: 'white',
    },
});
