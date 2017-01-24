'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    View,
    Text,
    Image,
    StyleSheet,
    Navigator,
    TouchableOpacity,
    TouchableHighlight,
} = ReactNative;

var IntegralExplain = require('./IntegralExplain.js');

var {PageList, DImage} = COMPONENTS;

module.exports = React.createClass({
    statics: {
        title: '我的积分',
        leftButton: { image: app.img.common_back2, handler: ()=>{app.navigator.pop()}},
    },
    renderRow(obj, sectionID, rowID, onRowHighlighted) {
        return (
            <View style={styles.itemContainer}>
                <Text style={styles.contextText}>{obj.taskName}</Text>
                <View style={styles.rightRowView}>
                    <Text style={[styles.contextText, {marginBottom: 2}]}>{'+'}</Text>
                    <Text style={styles.contextText}>{obj.integration}</Text>
                </View>
            </View>
        )
    },
    renderSeparator(sectionID, rowID) {
        return (
            <View style={styles.separator} key={sectionID+'_'+rowID}/>
        );
    },
    goBack () {
        app.navigator.pop();
        app.toggleNavigationBar(true);
    },
    goIntegralExplain() {
        app.navigator.push({
            component: IntegralExplain,
            sceneConfig: {
                ...Navigator.SceneConfigs.HorizontalSwipeJump, gestures: null
            }
        });
    },
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.topViewContainer}>
                    <View style={styles.topView}>
                        <View style={styles.integralView}>
                            <Text numberOfLines={1} style={styles.integralText}>{app.personal.info.integral}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={this.goIntegralExplain}
                        style={styles.explainStyle}>
                        <DImage
                            resizeMode='contain'
                            style={styles.iconImage}
                            source={app.img.personal_explain}/>
                        <Text style={styles.explainText}>积分说明</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.divisionContainer}>
                    <View style={[styles.divisionLine, {marginLeft :10, marginRight: 22}]}/>
                    <Text style={styles.contextText}>当日积分明细</Text>
                    <View style={[styles.divisionLine, {marginLeft: 22, marginRight: 10}]}/>
                </View>
                <View style={styles.pageListView}>
                    <PageList
                        renderRow={this.renderRow}
                        renderSeparator={this.renderSeparator}
                        listParam={{userID: app.personal.info.userID}}
                        listName="IntegralDetailList"
                        listUrl={app.route.ROUTE_GET_INTEGRAL_DETAIL}
                        />
                </View>
            </View>
        )
    },
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    topViewContainer: {
        height: 108,
        marginTop: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    topView: {
        width: 108,
        height: 108,
        borderRadius: 54,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF5858',
    },
    integralView: {
        width: 92,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    integralText: {
        fontSize: 42,
        color: '#FFFFFF',
        fontFamily: 'STHeitiSC-Medium',
        backgroundColor: 'transparent'
    },
    explainStyle: {
        height: 30,
        left: sr.w/2+74,
        top: 39,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    iconImage: {
        width: 15,
        height: 15,
    },
    explainText: {
        marginLeft: 1,
        fontSize: 10,
        color: '#A2A2A2',
        fontFamily: 'STHeitiSC-Medium',
    },
    divisionContainer: {
        marginTop: 41,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    divisionLine: {
        height: 1,
        width:117,
        alignSelf: 'center',
        backgroundColor: '#CECECE',
    },
    separator: {
        height: 20,
    },
    pageListView: {
        marginTop: 24,
    },
    itemContainer: {
        width: sr.w-53,
        height: 16,
        marginRight: 22,
        marginLeft: 31,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    contextText: {
        fontSize: 16,
        color: '#373737',
        fontFamily: 'STHeitiSC-Medium',
    },
    rightRowView: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
});
