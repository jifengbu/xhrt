'use strict';

var React = require('react');
var {
    Navigator,
    PixelRatio,
    StyleSheet,
    ScrollView,
    Text,
    TouchableHighlight,
    View,
    Image
} = ReactNative;

import TabNavigator from 'react-native-tab-navigator';
var Home = require('./Home1.js');
var Study = require('../study/index.js');
var TrainHome = require('../train/TrainHome.js');
var ActualCombat = require('./Empty.js');//require('../actualCombat/index.js');
var Specops = require('../specops/index.js');

var INIT_ROUTE_INDEX = 0;
var ROUTE_STACK = [
    {index: 0, component: Home},
    {index: 1, component: Specops},
    {index: 2, component: Study},
    {index: 3, component: TrainHome},
];
if (CONSTANTS.ISSUE_IOS) {
    _.remove(ROUTE_STACK, (o)=>o.index===4||o.index===3);
}

var HomeTabBar = React.createClass({
    componentWillMount() {
        app.updateNavbarColor(CONSTANTS.THEME_COLORS[0]);
        app.showMainScene = (i)=> {
            var {title, leftButton, rightButton} = _.find(ROUTE_STACK, (o)=>o.index===i).component;
            Object.assign(app.getCurrentRoute().component, {
                color: CONSTANTS.THEME_COLORS[1],
                title: title,
                leftButton: leftButton,
                rightButton: rightButton,
            });
            this.props.onTabIndex(i);
            app.forceUpdateNavbar();
        }
    },
    componentDidMount() {
        app.hasLoadMainPage = true;
        app.toggleNavigationBar(true);
    },
    componentWillUnmount() {
        app.hasLoadMainPage = false;
    },
    getInitialState() {
        return {
            tabIndex: this.props.initTabIndex,
        };
    },
    handleWillFocus(route) {
        var tabIndex = route.index;
        this.setState({tabIndex});
        if (tabIndex !== 1) {
            app.closeSpecopsPlayer && app.closeSpecopsPlayer();
        }
    },
    render() {
        var menus = [
            {index: 0, title: '首页', icon: app.img.home_home, selected: app.img.home_home_press},
            {index: 1, title: '特种兵', icon: app.img.home_specops, selected: app.img.home_specops_press},
            {index: 2, title: '学习场', icon: app.img.home_learn, selected: app.img.home_learn_press},
            {index: 3, title: '训练场', icon: app.img.home_train, selected: app.img.home_train_press},
        ];
        if (CONSTANTS.ISSUE_IOS) {
            _.remove(menus, (o)=>o.index===3||o.index===4);
        }
        var TabNavigatorItems = menus.map((item)=>{
            return (
                <TabNavigator.Item
                    key={item.index}
                    selected={this.state.tabIndex === item.index}
                    title={item.title}
                    titleStyle={styles.titleStyle}
                    selectedTitleStyle={styles.titleSelectedStyle}
                    renderIcon={() =>
                        <Image
                            resizeMode='stretch'
                            source={item.icon}
                            style={styles.icon} />
                    }
                    renderSelectedIcon={() =>
                        <Image
                            resizeMode='stretch'
                            source={item.selected}
                            style={styles.icon} />
                    }
                    onPress={() => {
                        app.showMainScene(item.index);
                    }}>
                    <View />
                </TabNavigator.Item>
            )
        });
        return (
            <View style={app.GlobalVarMgr.getItem('isFullScreen')?styles.tabsFull:[styles.tabs, this.props.hasEdit ? {top: sr.ws(sr.ch-50)}: {bottom: 0}]}>
                <TabNavigator
                    tabBarStyle={styles.tabBarStyle}
                    tabBarShadowStyle={styles.tabBarShadowStyle}
                    hidesTabTouch={true} >
                    {TabNavigatorItems}
                </TabNavigator>
            </View>
        );
    },
});

module.exports = React.createClass({
    statics: {
        color: CONSTANTS.THEME_COLORS[1],
        title: ROUTE_STACK[INIT_ROUTE_INDEX].component.title,
        leftButton: ROUTE_STACK[INIT_ROUTE_INDEX].component.leftButton,
        rightButton: ROUTE_STACK[INIT_ROUTE_INDEX].component.rightButton,
    },
    getInitialState() {
        return {
            hasEdit: false,
        };
    },
    onWillFocus() {
        app.updateNavbarColor(CONSTANTS.THEME_COLORS[0]);
    },
    onWillHide() {
        app.updateNavbarColor(CONSTANTS.THEME_COLORS[1]);
    },
    getChildScene() {
        return this.scene;
    },
    setEditFlag(flag) {
        if (this.state.hasEdit != flag) {
            this.setState({hasEdit: flag});
        }
    },
    renderScene(route, navigator) {
        return <route.component ref={(ref)=>{if(ref)route.ref=ref}} setEditFlag={this.setEditFlag}/>;
    },
    render() {
        var hasEdit = this.state.hasEdit;
        return (
                <Navigator
                    debugOverlay={false}
                    style={styles.container}
                    ref={(navigator) => {
                        this._navigator = navigator;
                    }}
                    initialRoute={ROUTE_STACK[INIT_ROUTE_INDEX]}
                    initialRouteStack={ROUTE_STACK}
                    renderScene={this.renderScene}
                    onDidFocus={(route)=>{
                        var ref = this.scene = app.scene = route.ref;
                        app.showAssistModal(route.component.guideLayer);
                        ref && ref.onDidFocus && ref.onDidFocus();
                    }}
                    onWillFocus={(route)=>{
                        if (this._navigator) {
                            var {routeStack, presentedIndex} = this._navigator.state;
                            var preRoute = routeStack[presentedIndex];
                            if (preRoute) {
                                var preRef = preRoute.ref;
                                preRef && preRef.onWillHide && preRef.onWillHide();
                            }
                        }
                        var ref = route.ref;
                        ref && ref.onWillFocus && ref.onWillFocus(true); //注意：因为有initialRouteStack，在mounted的时候所有的页面都会加载，因此只有第一个页面首次不会调用，需要在componentDidMount中调用，其他页面可以调用
                    }}
                    configureScene={(route) => ({
                        ...app.configureScene(route),
                    })}
                    navigationBar={
                        <HomeTabBar
                            initTabIndex={INIT_ROUTE_INDEX}
                            onTabIndex={(index) => {
                                this._navigator.jumpTo(_.find(ROUTE_STACK, (o)=>o.index===index));
                            }}
                            hasEdit={hasEdit}
                            />
                    }
                    />
        );
    },
});


var styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        flex: 1,
    },
    tabs: {
        height: 50,
        width: sr.w,
        position: 'absolute',
        left: 0,
    },
    tabsFull: {
        height: 50,
        width: sr.w,
        position: 'absolute',
        left: 0,
        top: sr.ch+120,
    },
    titleStyle: {
        fontSize:10,
        color: '#929292',
    },
    titleSelectedStyle: {
        fontSize:10,
        color: '#DF3932',
    },
    tabBarStyle: {
        borderColor: '#EEEEEE',
        borderTopWidth: 1,
        height:50,
        backgroundColor: '#fefcfd',
        alignItems: 'center',
    },
    tabBarShadowStyle: {
        height: 0,
        backgroundColor: '#7A7A7A',
    },
    icon: {
        width:22,
        height:22
    },
});