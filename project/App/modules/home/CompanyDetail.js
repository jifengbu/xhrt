'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
    AppState,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    InteractionManager
} = ReactNative;

var Player = require('./Player.js');
var WebView = require('react-native-webview-bridge');

var {DImage} = COMPONENTS;

var CompanyDetail = React.createClass({
    statics: {
        title: '明星企业',
        leftButton: { handler: ()=>{app.navigator.pop()}},
    },
    getInitialState() {
        this.posHeight = 0;
        var _scrollView: ScrollView;
        this.scrollView = _scrollView;
        return {
            webHeight: 0,
            playing: false,
            isFullScreen: false,
            dataDetail: {},
            scrollEnabled: true,
        };
    },
    componentDidMount: function() {
        this.getDetail();
        AppState.addEventListener('change', this._handleAppStateChange);
    },
    getDetail() {
        app.showProgressHUD();
        var param = {
            userID: app.personal.info.userID,
            starCompanyID: this.props.starCompanyID,
        };
        POST(app.route.ROUTE_STAR_COMPANY_INFO, param, this.getListSuccess);
    },
    getListSuccess(data) {
        if (data.success) {
            if (data.context) {
                this.setState({
                    dataDetail: data.context,
                });
            }
        }
    },
    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    },
    _handleAppStateChange: function(currentAppState) {
        if (currentAppState === 'active') {
            // this.playerPlay && this.playerPlay.stopPlayVideo();
        }else {
            this.playerPlay && this.playerPlay.stopPlayVideo();
        }
    },
    fullScreenListener(isFullScreen) {
        app.toggleNavigationBar(!isFullScreen);
        if (app.isandroid) {
            this.setState({isFullScreen});
            this.setState({scrollEnabled: !isFullScreen});
            app.GlobalVarMgr.setItem('isFullScreen', isFullScreen);
        }else {
            setTimeout(()=>{
                this.setState({isFullScreen});
                this.setState({scrollEnabled: !isFullScreen});
                app.GlobalVarMgr.setItem('isFullScreen', isFullScreen);
            }, 100);
        }
        setTimeout(()=>{
            if (!isFullScreen&&this.posHeight > sr.h) {
                InteractionManager.runAfterInteractions(() => {
                    this.scrollView.scrollTo({y: this.posHeight-sr.ws(350)});
                });
            }
        }, 600);

    },
    onEnd() {
        this.fullScreenListener(false);
        this.setState({playing: false});
    },
    changePlaying() {
        this.setState({playing: true});
    },
    onLoadEnd() {
        app.dismissProgressHUD();
    },
    onLayoutPos(e) {
        this.posHeight = e.nativeEvent.layout.y;
    },
    onBridgeMessage(message){
        const { webviewbridge } = this.refs;
        let type, data;
        try {
            let result = JSON.parse(message);
            type = result.type;
            data = result.data;
        } catch (e) {}
        switch (type) {
            case "heightChange":
                this.setState({webHeight: data});
            break;
        }
    },
    render() {
        let {dataDetail} = this.state;
        const injectScript = `
        (function () {
            var height = document.body.offsetHeight;
            WebViewBridge.send(JSON.stringify({
                type:'heightChange',
                data: height,
            }));
          }());`;
        return (
            <View style={styles.container}>
                <ScrollView style={styles.container} ref={(scrollView) => { this.scrollView = scrollView}}
                            scrollEnabled={this.state.scrollEnabled}>
                    {
                        !this.state.isFullScreen &&
                        <View>
                            <View style={styles.line}></View>
                            <View style={styles.topView}>
                                <Text style={styles.titleText}>{dataDetail.title}</Text>
                            </View>
                            <View style={styles.imgView}>
                                <DImage
                                    resizeMode='stretch'
                                    defaultSource={app.img.common_default}
                                    source={{uri:dataDetail.logo}}
                                    style={styles.imageStyle} />
                            </View>

                        </View>
                    }
                    {
                        <WebView
                            style={[!this.state.isFullScreen?styles.webview:styles.webviewFull,{height: this.state.webHeight+30}]}
                            ref="webviewbridge"
                            startInLoadingState={true}
                            onLoadEnd={this.onLoadEnd}
                            onBridgeMessage={this.onBridgeMessage}
                            injectedJavaScript={injectScript}
                            scrollEnabled={false}
                            source={{uri: app.route.ROUTE_STAR_COMPANY_PAGE+'?userID='+app.personal.info.userID+'&starCompanyID='+this.props.starCompanyID}}
                            scalesPageToFit={false}
                            />
                    }
                    {
                        !this.state.isFullScreen &&
                        <View style={styles.blankView}></View>
                    }
                    <View  onLayout={this.onLayoutPos} >
                        {
                            dataDetail.videoDesc != undefined && dataDetail.videoDesc != '' && dataDetail.videoDescImg != '' &&
                            (
                                this.state.playing?
                                    <Player
                                        ref={(ref)=>this.playerPlay = ref}
                                        uri={dataDetail.videoDesc}
                                        fullScreenListener={this.fullScreenListener}
                                        onEnd={this.onEnd}
                                        width={sr.ws(343)}
                                        height={sr.ws(231)}
                                        />
                                    :
                                    <DImage
                                        resizeMode='stretch'
                                        defaultSource={app.img.common_default}
                                        source={{uri: dataDetail.videoDescImg}}
                                        style={styles.playerContainer}>
                                        <TouchableOpacity
                                            style={styles.video_icon_container}
                                            onPress={this.changePlaying}>
                                            <Image
                                                resizeMode='stretch'
                                                source={app.img.specops_play}
                                                style={styles.video_icon}>
                                            </Image>
                                        </TouchableOpacity>
                                    </DImage>
                            )
                        }
                    </View>
                    {
                        !this.state.isFullScreen &&
                        <View style={styles.blankView}></View>
                    }
                </ScrollView>
            </View>
        );
    }
});
module.exports = CompanyDetail;

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    fullContainer: {
        width: sr.w,
        height: sr.fh,
    },
    topView: {
        width: sr.w,
        height: 71,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    titleText: {
        fontSize: 18,
        color: '#494949',
        fontWeight: '600',
        fontFamily: 'STHeitiSC-Medium',
    },
    imgView: {
        width: sr.w,
        height: 165,
        backgroundColor: '#FFFFFF',
    },
    imageStyle: {
        width: sr.w-28,
        marginLeft: 14,
        borderRadius: 2,
        height: 165,
        backgroundColor: '#FFFFFF',
    },
    webview: {
        width: sr.w,
        backgroundColor: '#FFFFFF',
    },
    webviewFull: {
        position: 'absolute',
        top: 0,
        right: -sr.w,
        width: sr.w,
        backgroundColor: '#FFFFFF',
    },
    line: {
        width: sr.w,
        height: 1,
        backgroundColor: '#E0E0E0'
    },
    blankView: {
        width: sr.w,
        height: 12,
        backgroundColor: 'white',
    },
    midView: {
        width: sr.w,
        backgroundColor: '#FFFFFF',
    },
    playerContainer: {
        width: 343,
        marginLeft: 16,
        height: 231,
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor: 'white',
    },
    video_icon_container: {
        height: 51,
        width: 51,
        borderRadius: 25.5,
        justifyContent: 'center',
        alignItems:'center',
    },
    video_icon: {
        height: 51,
        width: 51,
    },
});
