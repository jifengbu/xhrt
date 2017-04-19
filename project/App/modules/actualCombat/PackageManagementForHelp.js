'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    TouchableHighlight,
} = ReactNative;

const MyCaseList = require('./MyCaseList.js');
const { Button, PageList } = COMPONENTS;
const SplashScreen = require('@remobile/react-native-splashscreen');

module.exports = React.createClass({
    componentWillMount () {
        SplashScreen.hide();
    },
    _onPressRow (obj) {
        app.navigator.push({
            title: '我的求救包方案',
            component: MyCaseList,
            passProps: { isPlayer:this.isPlayer, tabIndex: this.props.tabIndex, kitID:obj.id, theme:obj.title, showCardType: 1 },
        });
    },
    isPlayer () {

    },
    goSendMadKit () {
        app.navigator.pop();
    },
    renderRow (obj) {
        return (
            <TouchableHighlight
                underlayColor='#f0f8ff'
                style={styles.container}
                onPress={this._onPressRow.bind(null, obj)}>
                <View style={styles.dataContainer}>
                    <View style={styles.leftStyle}>
                        <Text style={styles.textTime} numberOfLines={1}>
                            {obj.title}
                        </Text>
                        <Text style={styles.textTitle}>
                            {obj.releaseTime + ' 至 ' + obj.endTime}
                        </Text>
                    </View>
                    <View style={styles.rightStyle}>
                        <Image
                            resizeMode='stretch'
                            source={app.img.train_integral}
                            style={styles.iconCount}
                              />
                        <Text
                            numberOfLines={1}
                            style={styles.textPrice}>
                            {'¥ ' + obj.price + '元'}
                        </Text>
                        <Image
                            source={app.img.common_go}
                            style={styles.common_go} />
                    </View>
                </View>
            </TouchableHighlight>
        );
    },
    changeTab (tabIndex) {
        this.setState({ tabIndex });
    },
    getInitialState () {
        return {
            tabIndex: 0,
        };
    },
    renderSeparator (sectionID, rowID) {
        return (
            <View style={styles.separator} key={rowID} />
        );
    },
    render () {
        const isFirstTap = this.state.tabIndex === 0;
        return (
            <View style={this.props.style}>
                <PageList
                    ref={listView => { this.listView = listView; }}
                    disable={this.props.disable}
                    renderRow={this.renderRow}
                    renderSeparator={this.renderSeparator}
                    listParam={{ userID: app.personal.info.userID, type:0 }}
                    listName={'kidsList'}
                    listUrl={app.route.ROUTE_MY_KID}
                    refreshEnable
                    />
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#EEEEEE',
    },
    dataContainer: {
        height:51,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        justifyContent: 'space-between',
    },
    leftStyle: {
        height: 40,
        justifyContent: 'space-between',
    },
    rightStyle: {
        marginRight:10,
        alignItems: 'center',
        flexDirection:'row',
    },
    textTitle: {
        fontSize: 14,
        color :'#BE9451',
        marginLeft: 10,
    },
    textTime: {
        fontSize: 16,
        color: '#AAAAAA',
        marginLeft: 10,
    },
    textPrice: {
        fontSize: 16,
        marginHorizontal: 5,
    },
    common_go: {
        width:11,
        height:13,
        marginLeft: 5,
    },
    iconCount: {
        width: 12,
        height: 12,
    },
    separator: {
        backgroundColor: '#DDDDDD',
        height: 1,
        marginHorizontal: 10,
    },
});
