'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    Navigator,
    PixelRatio,
    StyleSheet,
    ScrollView,
    Text,
    TouchableHighlight,
    View,
    Image,
} = ReactNative;

import TabNavigator from 'react-native-tab-navigator';
const Home = require('./Home.js');
const Study = require('../study/index.js');
const Person = require('../person/PersonInfo.js');
const TrainHome = require('../train/TrainHome.js');
const ActualCombat = require('./Empty.js');// require('../actualCombat/index.js');
const Specops = require('../specops/index.js');
const PersonalInfoMgr = require('../../manager/PersonalInfoMgr.js');
const Subscribable = require('Subscribable');

let INIT_ROUTE_INDEX = 0;
const ROUTE_STACK = [
    { index: 0, component: Home },
    { index: 1, component: Specops },
    { index: 2, component: Person },
    { index: 3, component: TrainHome },
];
if (CONSTANTS.ISSUE_IOS) {
    _.remove(ROUTE_STACK, (o) => o.index === 4 || o.index === 3);
}

const HomeTabBar = React.createClass({
    componentWillMount () {
        app.updateNavbarColor(CONSTANTS.THEME_COLORS[0]);
        app.showMainScene = (i) => {
            const { title, leftButton, rightButton } = _.find(ROUTE_STACK, (o) => o.index === i).component;
            Object.assign(app.getCurrentRoute().component, {
                color: CONSTANTS.THEME_COLORS[1],
                title: title,
                leftButton: leftButton,
                rightButton: rightButton,
            });
            this.props.onTabIndex(i);
            app.forceUpdateNavbar();
        };
    },
    componentDidMount () {
        app.hasLoadMainPage = true;
        app.toggleNavigationBar(true);
    },
    componentWillUnmount () {
        app.hasLoadMainPage = false;
    },
    componentWillReceiveProps (nextProps) {
        this.setState({ tabIndex: nextProps.initTabIndex });
    },
    getInitialState () {
        return {
            tabIndex: this.props.initTabIndex,
        };
    },
    handleWillFocus (route) {
        const tabIndex = route.index;
        this.setState({ tabIndex });
        if (tabIndex !== 1) {
            app.closeSpecopsPlayer && app.closeSpecopsPlayer();
        }
    },
    render () {
        const menus = [
            { index: 0, title: '首页', icon: app.img.home_home, selected: app.img.home_home_press },
            { index: 1, title: '特种兵', icon: app.img.home_specops, selected: app.img.home_specops_press },
            { index: 2, title: '我的', icon: app.img.home_mine, selected: app.img.home_mine_press },
        ];
        if (CONSTANTS.ISSUE_IOS) {
            _.remove(menus, (o) => o.index === 3 || o.index === 4);
        }
        const TabNavigatorItems = menus.map((item) => {
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
            );
        });
        return (
            <View style={app.GlobalVarMgr.getItem('isFullScreen') ? styles.tabsFull : [styles.tabs, this.props.hasEdit ? { top: sr.ws(sr.ch - 50) } : { bottom: 0 }]}>
                <TabNavigator
                    tabBarStyle={styles.tabBarStyle}
                    tabBarShadowStyle={styles.tabBarShadowStyle}
                    hidesTabTouch >
                    {TabNavigatorItems}
                </TabNavigator>
            </View>
        );
    },
});

module.exports = React.createClass({
    mixins: [Subscribable.Mixin],
    statics: {
        color: CONSTANTS.THEME_COLORS[1],
        title: ROUTE_STACK[INIT_ROUTE_INDEX].component.title,
        leftButton: ROUTE_STACK[INIT_ROUTE_INDEX].component.leftButton,
        rightButton: ROUTE_STACK[INIT_ROUTE_INDEX].component.rightButton,
    },
    componentWillMount: function () {
        this.addListenerOn(PersonalInfoMgr, 'INDEX_TAB_CHANGE_EVENT', (param) => {
            this.setState({ initTabIndex: param.index });
            this._navigator.jumpTo(_.find(ROUTE_STACK, (o) => o.index === param.index));
        });
    },
    getInitialState () {
        return {
            hasEdit: false,
            initTabIndex:0,
        };
    },
    onWillFocus () {
        app.updateNavbarColor(CONSTANTS.THEME_COLORS[0]);
    },
    onWillHide () {
        app.updateNavbarColor(CONSTANTS.THEME_COLORS[1]);
    },
    getChildScene () {
        return this.scene;
    },
    setEditFlag (flag) {
        if (this.state.hasEdit != flag) {
            this.setState({ hasEdit: flag });
        }
    },
    renderScene (route, navigator) {
        return <route.component ref={(ref) => { if (ref)route.ref = ref; }} setEditFlag={this.setEditFlag} />;
    },
    render () {
        const { hasEdit, initTabIndex } = this.state;
        return (
            <Navigator
                debugOverlay={false}
                style={styles.container}
                ref={(navigator) => {
                    this._navigator = navigator;
                }}
                initialRoute={ROUTE_STACK[initTabIndex]}
                initialRouteStack={ROUTE_STACK}
                renderScene={this.renderScene}
                onDidFocus={(route) => {
                    if (route) {
                        const ref = this.scene = app.scene = route.ref;
                        app.showAssistModal(route.component.guideLayer);
                        ref && ref.onDidFocus && ref.onDidFocus();
                    }
                }}
                onWillFocus={(route) => {
                    if (route) {
                        if (this._navigator) {
                            const { routeStack, presentedIndex } = this._navigator.state;
                            const preRoute = routeStack[presentedIndex];
                            if (preRoute) {
                                const preRef = preRoute.ref;
                                preRef && preRef.onWillHide && preRef.onWillHide();
                            }
                        }
                        const ref = route.ref;
                        ref && ref.onWillFocus && ref.onWillFocus(true); // 注意：因为有initialRouteStack，在mounted的时候所有的页面都会加载，因此只有第一个页面首次不会调用，需要在componentDidMount中调用，其他页面可以调用
                    }
                }}
                configureScene={(route) => ({
                    ...app.configureScene(route),
                })}
                navigationBar={
                    <HomeTabBar
                        initTabIndex={initTabIndex}
                        onTabIndex={(index) => {
                            this.setState({ initTabIndex: index });
                            this._navigator.jumpTo(_.find(ROUTE_STACK, (o) => o.index === index));
                        }}
                        hasEdit={hasEdit}
                            />
                    }
                    />
        );
    },
});

const styles = StyleSheet.create({
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
        top: sr.ch + 120,
    },
    titleStyle: {
        fontSize:10,
        color: '#929292',
    },
    titleSelectedStyle: {
        fontSize:10,
        color: '#FB5631',
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
        height:22,
    },
});
