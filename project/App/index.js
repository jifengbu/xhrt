'use strict';

console.disableYellowBox = true;

var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
    Navigator,
    Platform,
    BackAndroid,
    NetInfo,
    View,
    PixelRatio,
    Text,
    Image,
    TouchableOpacity,
    NativeModules,
    StatusBar,
    AsyncStorage,
} = ReactNative;
var AccessibilityManager = NativeModules.AccessibilityManager;

global._ = require('lodash');
global.sr = require('./config/Screen.js');
global.Toast = require('@remobile/react-native-toast').show;
global.CONSTANTS = require('./config/Constants.js');
global.POST = require('./utils/net/Post.js');
global.GET = require('./utils/net/Get.js');
global.UPLOAD = require('./utils/net/Upload.js');
global.MULTIUPLOAD = require('./utils/net/MultiUpload.js');
global.COMPONENTS = require('./components/index.js');
global.DelayTouchableOpacity = COMPONENTS.DelayTouchableOpacity;

var ProgressHud = COMPONENTS.ProgressHud;
var TimerMixin = require('react-timer-mixin');
var Utils = require('./utils/common/index.js');
var Route = require('./config/Route.js');
var img = require('./resource/image.js');
var aud = require('./resource/audio.js');
var PersonalInfoMgr = require('./manager/PersonalInfoMgr.js');
var NetMgr = require('./manager/NetMgr.js');
var JPushMgr = require('./manager/JPushMgr.js');
var SettingMgr = require('./manager/SettingMgr.js');
var UpdateMgr = require('./manager/UpdateMgr.js');
var LoginMgr = require('./manager/LoginMgr.js');
var ChatMgr = require('./manager/ChatMgr.js');
var PhoneMgr = require('./manager/PhoneMgr.js');
var AudioFileMgr = require('./manager/AudioFileMgr.js');
var ReplaceBGColorMgr = require('./manager/ReplaceBGColorMgr.js');
var RefreshComments = require('./manager/RefreshComments.js');
var GlobalVarMgr = require('./manager/GlobalVarMgr.js');
var LeftTimes = require('./manager/LeftTimes.js');
var StudyNum = require('./data/StudyNum.js');

const ITEM_NAME_SAM = "showAssistModal";
const ITEM_NAME_PRMB = "PublishRuleMessageBox";

global.app = {
    route: Route,
    utils: Utils,
    img: img,
    aud: aud,
    data: {},
    personal: PersonalInfoMgr,
    login: LoginMgr,
    net: NetMgr,
    chatMgr: ChatMgr,
    jpush: JPushMgr,
    setting: SettingMgr,
    phoneMgr:PhoneMgr,
    updateMgr:UpdateMgr,
    audioFileMgr:AudioFileMgr,
    leftTimesMgr:LeftTimes,
    studyNumMgr:StudyNum,
    replaceBGColorMgr:ReplaceBGColorMgr,
    refreshComments:RefreshComments,
    isandroid: Platform.OS==="android",
    GlobalVarMgr: GlobalVarMgr,
    touchPosition: {x:0, y:0},
};

global.SceneMixin = {
    componentWillMount() {
        app.scene = this;
    }
};

global.HideStatusMixin = {
    componentWillMount() {
        app.hideStatus();
    },
    onWillFocus() {
        app.hideStatus();
    },
    onWillHide() {
        app.showStatus();
    },
};

app.configureScene = function(route) {
    route = route||{};
    var sceneConfig = route.sceneConfig;
    if (sceneConfig) {
        return sceneConfig;
    }
    if (Platform.OS==="android") {
        if (route.fromLeft) {
            sceneConfig = {...Navigator.SceneConfigs.FloatFromLeft, gestures: null};
        } else {
            sceneConfig = Navigator.SceneConfigs.FadeAndroid;
        }
    } else {
        if (route.fromLeft) {
            sceneConfig = {...Navigator.SceneConfigs.FloatFromLeft, gestures: null};
        } else {
            sceneConfig = {...Navigator.SceneConfigs.HorizontalSwipeJump, gestures: null};
        }
    }
    return sceneConfig;
};

var Splash = require('./modules/splash/index.js');

var NavigationBarRouteMapper = {
    LeftButton(route, navigator, index, navState) {
        var leftButton = route.leftButton||route.component.leftButton;
        if (index===0 && !leftButton) {
            return null;
        }
        var image = leftButton&&leftButton.image;
        var title = leftButton&&leftButton.title||'';
        var textColor = leftButton&&leftButton.color||'#1F1F1F';
        var handler = leftButton&&leftButton.handler||navigator.pop;
        if (!image&&!title) {
            return (
                <DelayTouchableOpacity
                    onPress={handler}
                    style={styles.navBarButton}>
                    <Image
                        resizeMode='stretch'
                        source={textColor!='#1F1F1F'?app.img.common_back:app.img.personal_blackback}
                        style={styles.navBarIcon} />
                    <Text style={[styles.navBarButtonText, {color: textColor}]}>
                        {'返回'}
                    </Text>
                </DelayTouchableOpacity>
            );
        } else if (image&&!title) {
            return (
                <DelayTouchableOpacity
                    onPress={handler}
                    style={styles.navBarButton}>
                    <Image
                        resizeMode='stretch'
                        source={image}
                        style={styles.navBarIcon} />
                </DelayTouchableOpacity>
            );
        } else {
            return (
                <DelayTouchableOpacity
                    onPress={handler}
                    delayTime={leftButton.delayTime||1000}
                    style={styles.navBarButton}>
                    <Text style={styles.navBarButtonText}>
                        {leftButton.title}
                    </Text>
                </DelayTouchableOpacity>
            );
        }
    },
    RightButton(route, navigator, index, navState) {
        var rightButton = route.rightButton||route.component.rightButton;
        if (!rightButton) {
            return <View style={[styles.navBarRightEmptyButton, {backgroundColor: (app.root)?app.root.state.navbarColor:app.THEME_COLOR}]}/>;
        }
        if (rightButton.image) {
            return (
                <DelayTouchableOpacity
                    onPress={rightButton.handler}
                    style={styles.navBarButton}>
                    <Image
                        resizeMode='stretch'
                        source={rightButton.image}
                        style={styles.navBarIcon} />
                </DelayTouchableOpacity>
            );
        } else {
            return (
                <DelayTouchableOpacity
                    onPress={rightButton.handler}
                    delayTime={rightButton.delayTime||1000}
                    style={styles.navBarButton}>
                    <Text style={styles.navBarButtonText}>
                        {rightButton.title}
                    </Text>
                </DelayTouchableOpacity>
            );
        }
    },
    Title(route, navigator, index, navState) {
        var title = route.title||route.component.title;
        var color = route.color||route.component.color||'#000000';
        if (typeof title === 'string') {
            return (
                <View style={styles.titleContainer}>
                    <Text
                        numberOfLines={1}
                        style={[styles.navBarTitleText, {color}]}>
                        {title}
                    </Text>
                </View>
            );
        } else {
            return (
                <View style={styles.titleContainer}>
                    {title}
                </View>
            )
        }
    },
};

module.exports = React.createClass({
    mixins: [ProgressHud.Mixin, TimerMixin],
    getInitialState() {
        return {
            showNavBar: false,
            modalShow: false,
            modalContent: null,
            modalTitle: '',
            modalBackgroundColor: null,
            modalTouchHide: false,
            assistModalShow: false,
            assistModalContent: null,
            statusColor: 'rgba(0, 0, 0, 1)',
            navbarColor: CONSTANTS.THEME_COLORS[1],
            statusHidden: false
        };
    },
    componentWillMount() {
        if (!app.isandroid) {
            AccessibilityManager.setAccessibilityContentSizeMultipliers({
                "extraSmall": 1,
                "small": 1,
                "medium": 1,
                "large": 1,
                "extraLarge": 1,
                "extraExtraLarge": 1,
                "extraExtraExtraLarge": 1,
                "accessibilityMedium": 1,
                "accessibilityLarge": 1,
                "accessibilityExtraLarge": 1,
                "accessibilityExtraExtraLarge": 1,
                "accessibilityExtraExtraExtraLarge": 1
            });
        }

        new Promise(async(resolve, reject)=>{
            try {
                var showAssistModal = await AsyncStorage.getItem(ITEM_NAME_SAM);
                if (showAssistModal == "no") {
                    CONSTANTS.GUIDE_SHOW_TIMES = 0;
                }else {
                    CONSTANTS.GUIDE_SHOW_TIMES = 0;
                }

                var showPublishRuleMessageBox = await AsyncStorage.getItem(ITEM_NAME_PRMB);
                if (showPublishRuleMessageBox == "no") {
                    CONSTANTS.IS_RULES_SHOW = false;
                }else {
                    CONSTANTS.IS_RULES_SHOW = true;
                }
            } catch(e) {
            }

            await AsyncStorage.setItem(ITEM_NAME_SAM, "no");
            resolve();
        });
        app.audioFileMgr.checkRootDir();
        app.root = this;
        app.showProgressHUD = this.showProgressHUD;
        app.dismissProgressHUD = ()=>{
            this.dismissProgressHUD();
        }
        app.showModal = (view, options={}) => {
            const { title, backgroundColor, touchHide} = options;
            this.setState({
                modalShow: true,
                modalContent: view,
                modalTitle: title,
                modalBackgroundColor: backgroundColor,
                modalTouchHide: touchHide,
            });
        };
        app.closeModal = () => {
            this.refs.modal.closeModal();
        };
        app.removeModal = () => {
            this.setState({
                modalShow: false,
            });
        };
        app.showAssistModal = (Layer) => {
            if (Layer) {
                if (Layer.times === undefined) {
                    Layer.times = CONSTANTS.GUIDE_SHOW_TIMES;
                }
                if (Layer.times === 0) {
                    return;
                }
                if (Layer.times > 0) {
                    Layer.times--;
                }
                this.setState({assistModalShow: true,assistModalContent: <Layer />});
            }
        };
        app.hideAssistModal = () => {
            this.setState({
                assistModalShow: false,
            });
        };
        app.showUnopenTipBox = (info) => {
            app.showModal(<COMPONENTS.UnopenTipBox {...info}/>, {touchHide: true, backgroundColor: 'rgba(0, 0, 0, 0.7)'});
        };
        app.update = () => {
            this.setState({});
        };
        app.updateNavbarColor = (color) => {
            this.setState({navbarColor: color});
        };
        app.forceUpdateNavbar = () => {
            this.setState({
                showNavBar: true,
            });
        };
        app.toggleNavigationBar = (show) => {
            this.setImmediate(()=>{
                this.setState({showNavBar:show});
            });
        };
        //如果颜色为空，则使用上一次的颜色
        app.showStatus = () => {
            this.setState({statusHidden: false});
        };
        app.hideStatus = () => {
            this.setState({statusHidden: true});
        };
        app.getCurrentRoute = ()=>{
            var {routeStack, presentedIndex} = app.navigator.state;
            return routeStack[presentedIndex];
        };
        app.pop = (step=1)=>{
            if (step ===1 ) {
                app.navigator.pop();
            } else {
                var routes = app.navigator.getCurrentRoutes();
                var index = routes.length-step-1;
                if (index > 0) {
                    app.navigator.popToRoute(routes[index]);
                } else {
                    app.navigator.popToTop();
                }
            }
        };
        if (app.isandroid) {
            BackAndroid.addEventListener('hardwareBackPress', ()=>{
                if (app.GlobalVarMgr.getItem('isFullScreen')) {
                    return true;
                }
                if (this.state.is_hud_visible) {
                    this.setState({is_hud_visible: false});
                    return true;
                }
                if (this.state.modalShow) {
                    this.setState({modalShow: false});
                    return true;
                }
                if (this.state.assistModalShow) {
                    this.setState({assistModalShow: false});
                    return true;
                }
                var routes = app.navigator.getCurrentRoutes();
                if (routes.length > 1) {
                    var leftButton = routes[routes.length-1].component.leftButton;
                    if (leftButton && leftButton.handler) {
                        leftButton.handler();
                    } else {
                        app.navigator.pop();
                    }
                    return true;
                }
                if (!this.willExitAndroid) {
                    Toast("再按一次返回键退出程序");
                    this.willExitAndroid = true;
                    this.setTimeout(()=>{this.willExitAndroid = false}, 3000);
                    return true;
                }
                return false;
            });
        }
    },
    componentDidMount: function() {
        app.net.register();
        app.jpush.register();
    },
    configureScene(route){
        return app.configureScene(route);
    },
    renderScene(route, navigator) {
        return (
            <View style={{flex: 1}}>
                {this.state.showNavBar&&<View style={[styles.navBarBack, {backgroundColor:this.state.navbarColor}]} />}
                <route.component
                    {...route.passProps}
                    ref={(ref)=>{if(ref)route.ref=ref}}/>
            </View>
        );
    },
    render() {
        const {statusColor, statusHidden, navbarColor} = this.state;
        var initialRoute = {
            component: Splash,
        };
        var navigationBar = (
            <Navigator.NavigationBar
                routeMapper={NavigationBarRouteMapper}
                style={[styles.navBar, {backgroundColor: navbarColor}]}
                />
        );
        return (
            <View style={{flex:1}}>
                <StatusBar backgroundColor={statusColor} hidden={statusHidden}/>
                <Navigator
                    ref={(navigator) => {
                        if (navigator) {
                            app.navigator = navigator;
                        }
                    }}
                    debugOverlay={false}
                    style={styles.container}
                    initialRoute={initialRoute}
                    configureScene={this.configureScene}
                    renderScene={this.renderScene}
                    onDidFocus={(route)=>{
                        if (route) {
                            var ref = route.ref;
                            var getChildScene = ref && ref.getChildScene;
                            //注意：app.scene调用的时候一定需要使用封装函数，如：{handler: ()=>{app.scene.toggleEdit()}}，不能直接使用 handler: app.scene.toggleEdit.
                            //在动画加载完成前 app.scene 还没有被赋值， 需要使用 SceneMixin 来设置 app.scene
                            var scene = app.scene = getChildScene ? getChildScene() : ref;
                            if (getChildScene && !scene.hasMouted) {
                                scene.hasMouted = true;
                                return;
                            }
                            app.showAssistModal&&app.showAssistModal(route.component.guideLayer);
                            scene && scene.onDidFocus && scene.onDidFocus();
                            //如果时主页面，需要检测主页面和其子页面的回调
                            ref && ref!==scene && ref.onDidFocus && ref.onDidFocus();
                        }
                    }}
                    onWillFocus={(route)=>{
                        if (route) {
                            var preRoute = app.navigator && app.getCurrentRoute();
                            if (preRoute) {
                                var preRef = preRoute.ref;
                                var preGetChildScene = preRef && preRef.getChildScene;
                                var preScene = preGetChildScene ? preGetChildScene() : preRef;
                                preScene && preScene.onWillHide && preScene.onWillHide();
                                //如果时主页面，需要检测主页面和其子页面的回调
                                preRef && preRef!==preScene && preRef.onWillHide && preRef.onWillHide();
                            }
                            var ref = route.ref;
                            var getChildScene = ref && ref.getChildScene;
                            var scene = getChildScene ? getChildScene() : ref;
                            //如果时主页面，需要检测主页面和其子页面的回调
                            scene && scene.onWillFocus && scene.onWillFocus();//注意：在首次加载的时候页面没有被加载，route.ref为空，不会调用该函数，需要在该页面的componentWillMount里面处理首次逻辑，只有从上页面返回的时候才能被调用
                            ref && ref!==scene && ref.onWillFocus && ref.onWillFocus();
                        }
                    }}
                    navigationBar={this.state.showNavBar ? navigationBar : null}
                    />
                {
                    this.state.modalShow &&
                    <COMPONENTS.Modal ref="modal" title={this.state.modalTitle} backgroundColor={this.state.modalBackgroundColor} modalTouchHide={this.state.modalTouchHide}>
                        {this.state.modalContent}
                    </COMPONENTS.Modal>
                }
                <ProgressHud
                    isVisible={this.state.is_hud_visible}
                    isDismissible={false}
                    overlayColor="rgba(0, 0, 0, 0.6)"
                    color='#239FDB'
                    />
                {
                    this.state.assistModalShow &&
                    <View style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,}}>
                        {this.state.assistModalContent}
                    </View>
                }
            </View>
        );
    },
});


var NAVBAR_HEIGHT = sr.rws(Navigator.NavigationBar.Styles.General.NavBarHeight);
var styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#EEEEEE'
    },
    navBarBack: {
        height:sr.totalNavHeight,
    },
    navBar: {
        backgroundColor: CONSTANTS.THEME_COLOR,
        alignItems:'center',
    },
    titleContainer: {
        width: sr.w,
        height: NAVBAR_HEIGHT,
        alignItems:'center',
        justifyContent: 'center',
    },
    navBarButtonText: {
        fontSize: 18,
        fontFamily: 'STHeitiSC-Medium',
    },
    navBarTitleText: {
        fontSize: 18,
        textAlign: 'center',
        fontWeight: '500',
        width: sr.w/2,
    },
    navBarButton: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        height:NAVBAR_HEIGHT,
        alignItems: 'center',
    },
    navBarRightEmptyButton: {
        width: 80,
        height: NAVBAR_HEIGHT,
    },
    navBarIcon: {
        width: NAVBAR_HEIGHT*0.5,
        height: NAVBAR_HEIGHT*0.5,
    },
});
