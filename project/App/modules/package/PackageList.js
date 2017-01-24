'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
    Text,
    Image,
    ListView,
    ScrollView,
    TouchableHighlight,
    TouchableOpacity,
} = ReactNative;

var MyPackage = require('./MyPackage.js');
var BuyPlan = require('./BuyPlan.js');
var PixelRatio = require('PixelRatio');

module.exports = React.createClass({
    statics: {
        title: '套餐',
    },
    getInitialState() {
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            dataSource: this.ds.cloneWithRows([]),
        };
    },
    componentDidMount() {
        this.getPackageList();
    },
    renderSeparator(sectionID, rowID) {
        return (
            <View
                style={styles.separator}
                key={rowID}/>
        );
    },
    getPackageList() {
        var param = {
            userID: app.personal.info.userID,
        };
        POST(app.route.ROUTE_GET_PACKAGE_LIST, param, this.getPackageListSuccess, true);
    },
    getPackageListSuccess(data) {
        if (data.success) {
            var context = data.context;
            let packageList = data.context.packageList||[];
            this.setState({dataSource: this.ds.cloneWithRows(CONSTANTS.ISSUE_IOS?[_.first(packageList)]:packageList)});
        } else {
            Toast(data.msg);
        }
    },
    _onPressRow(obj) {
        app.navigator.push({
            component: AidDetail,
            passProps: {},
        });
    },
    doMyPackage(obj) {
        if (obj.typeCode=='10004') {
            if (app.personal.info.userType =='2'|| app.personal.info.userType =='3' || app.personal.info.userType =='4') {
                Toast('您已经是拥有所有功能权限，无需再次购买！');
                return;
            }
            app.navigator.push({
                component: BuyPlan,
                passProps: {packageData: obj},
            });
        } else {
            app.navigator.push({
                title: obj.packageName,
                component: MyPackage,
                passProps: {packageData: obj},
            });
        }
    },
    renderRow(obj, sectionID, rowID) {
        var backColor = obj.color;
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={this.doMyPackage.bind(null, obj)} style={[styles.panelContainer,{backgroundColor: backColor}]}>
                    <Image
                        resizeMode='contain'
                        defaultSource={app.img.common_default}
                        source={{uri: obj.packageImg}}
                        style={styles.icon} />
                    <View style={styles.titleContainer}>
                        <Text
                            style={styles.titleText}>
                            {obj.packageName}
                        </Text>
                        <Text
                            style={[styles.detailText,{lineHeight:parseInt(20*PixelRatio.get()/PixelRatio.getFontScale())}]}>
                            {obj.packageIntroduction}
                        </Text>
                        <View style={styles.entranceContainer}>
                            <View
                                style={styles.ownContainer}>
                                <Text style={styles.entranceText}>{obj.typeCode=='10004'?'购买':'开始学习'}</Text>
                                <Image
                                    resizeMode='contain'
                                    source={app.img.home_train_go}
                                    style={styles.goIcon} />
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                {rowID==0&&
                    <View style={styles.divisionContainer}>
                        <View style={styles.separator}/>
                        <Text style={{fontSize: 12}, {color: '#b4b4b4'}}>或者你也可以</Text>
                        <View style={styles.separator}/>
                    </View>
                }
            </View>
        )
    },
    render() {
        return (
            <View style={styles.container}>
                <ListView
                    initialListSize={1}
                    enableEmptySections={true}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    renderSeparator={this.renderSeparator}
                    />
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        alignSelf:'stretch'
    },
    itemContainer: {
        marginTop: 10,
        marginHorizontal: 10,
        width:sr.w-20,
    },
    titleContainer: {
        flexDirection: 'column',
        alignSelf: 'center',
        width:sr.w-70,
        overflow: 'hidden',
    },
    titleText: {
        fontSize: 16,
        color: 'white',
    },
    detailText: {
        marginTop:5,
        marginRight: 5,
        fontSize: 14,
        color: '#EEEEEE',
    },
    entranceContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: sr.w-70,
        marginTop: 10,
    },
    ownContainer: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: 'row',
    },
    entranceText: {
        fontSize: 14,
        color: 'white',
    },
    goIcon: {
        alignSelf: 'center',
        height: 15,
        marginHorizontal: 5,
    },
    divisionContainer: {
        flexDirection: 'row',
        width: sr.w-40,
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
    panelContainer: {
        paddingVertical: 10,
        marginTop: 20,
        marginHorizontal: 5,
        width:sr.w-10,
        borderRadius: 10,
        flexDirection: 'row',
    },
    icon: {
        width: 40,
        height: 40,
        alignSelf: 'center',
        marginHorizontal: 10,
    },
});
