'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
    Image,
    View,
    TouchableHighlight,
    Text,
} = ReactNative;

var PlanDetails = require('./PlanDetails');

var {PageList, StarBar} = COMPONENTS;

module.exports = React.createClass({
    _onPressRow(obj) {
        console.log(obj);
        app.navigator.push({
            title: '方案详情',
            component: PlanDetails,
            passProps: {schemeID: obj.id, schemeDetail: obj, tabIndex:0,doRefresh:this.doRefresh},
        });
    },
    doRefresh() {
        this.listView.refresh();
    },
    renderRow(obj) {
        var img_win;
        if (obj.isWin==1) {
            img_win = app.img.actualCombat_no_0;
        };
        return (
            <TouchableHighlight
                style={styles.itemContainer}
                onPress={this._onPressRow.bind(null, obj)}
                underlayColor="#EEB422">
                <View style={styles.titleContainer}>
                    <View style={styles.titleView}>
                        {
                            obj.isWin==1?
                            <Image
                                resizeMode='stretch'
                                style={styles.headerIcon}
                                source={img_win}/>
                            :
                            <View style={styles.headerIcon}/>
                        }
                        <View style={styles.titleStyle}>
                            <Text numberOfLines={1} style={styles.titleText}>
                                {obj.title}
                            </Text>
                            <Text  style={styles.timeText}>
                                {obj.createTime}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.userInfoStyle}>
                        <StarBar value={obj.score} style={styles.scoreIconStyle} starStyle={styles.scoreIcon}/>
                        <Image
                            resizeMode='stretch'
                            source={app.img.common_go}
                            style={styles.iconGo}  />
                    </View>
                </View>
            </TouchableHighlight>
        )
    },
    render() {
        return (
            <View style={this.props.style}>
                <PageList
                    ref={listView=>this.listView=listView}
                    disable={this.props.disable}
                    renderRow={this.renderRow}
                    listParam={{userID: app.personal.info.userID}}
                    listName="kitList"
                    listUrl={app.route.ROUTE_MY_JOIN_KIT}
                    refreshEnable={true}
                    />
            </View>
        )
    }
});

var styles = StyleSheet.create({
    itemContainer: {
        paddingVertical: 10,
        width:sr.w,
        backgroundColor: '#FFFFFF',
    },
    titleContainer: {
        flexDirection: 'row',
        width: sr.w,
        justifyContent: 'space-between',
    },
    titleStyle: {
        backgroundColor: '#FFFFFF',
    },
    titleText: {
        fontSize: 17,
        marginBottom: 5,
        color: '#666664',
    },
    titleView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userInfoStyle: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF'
    },
    headerIcon: {
        marginHorizontal:10,
        width: 20,
        height: 20,
    },
    scoreIconStyle: {
        flexDirection: 'row',
    },
    scoreIcon: {
        alignSelf: 'center',
        marginLeft: 2,
        width: 18,
        height: 18,
    },
    iconGo: {
        alignSelf: 'center',
        width: 8,
        marginHorizontal: 10,
        height: 12,
    },
    timeText: {
        fontSize: 12,
        color: '#BE9451',
    },
});
