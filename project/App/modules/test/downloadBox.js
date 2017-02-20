'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
    Text,
    Animated,
    View,
    Linking,
    TouchableHighlight,
} = ReactNative;

var SplashScreen = require('@remobile/react-native-splashscreen');

module.exports = React.createClass({
    componentWillMount() {
        SplashScreen.hide();
    },
    getInitialState() {
        return {
            opacity: new Animated.Value(0)
        };
    },
    doCancel() {
        this.closeModal(()=>{
            this.props.doCancel();
        });
    },
    doConfirm() {
        // this.closeModal(()=>{
        //     this.props.doConfirm();
        // });
        if (!app.isandroid) {
            Linking.canOpenURL(app.route.ROUTE_APK_URL).then(
                supported => {
                  if (!supported) {
                    console.log('不能打开链接: ' + app.route.ROUTE_APK_URL);
                  } else {
                    return Linking.openURL(app.route.ROUTE_APK_URL);
                  }
              }
           ).catch(err => console.log('打开链接失败:'+app.route.ROUTE_APK_URL));
        }
    },
    componentDidMount() {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 500,
        }).start();
    },
    closeModal(callback) {
        Animated.timing(this.state.opacity, {
            toValue: 0,
            duration: 500,
        }).start(()=>{
            callback();
        });
    },
    render() {
        return (
            <Animated.View style={[styles.overlayContainer, {opacity: this.state.opacity}]}>
                <View style={styles.container}>
                    <Text style={styles.title}>{'发现新版本(2.3.1)'}</Text>
                    <Text style={styles.redLine}>
                    </Text>
                    <Text style={styles.content}>
                        {'更新内容：优化首页部分页面,更改部分已知'}
                    </Text>

                    <View style={styles.buttonViewStyle}>
                        <TouchableHighlight
                            onPress={this.doCancel}
                            style={styles.buttonStyleContainCannel}>
                            <Text style={styles.buttonStyleCannel}>取 消</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            onPress={this.doConfirm}
                            style={styles.buttonStyleContain}>
                            <Text style={styles.buttonStyle} >下 载</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Animated.View>
        );
    }
});

var styles = StyleSheet.create({
    buttonViewStyle: {
        flexDirection: 'row',
        width: sr.w-40,
        height: 60,
        justifyContent: 'center',
    },
    redLine: {
        marginTop: 15,
        width: sr.w-60,
        height: 1,
        backgroundColor: '#F1F1F1'
    },
    buttonStyleContain: {
        width: 120,
        height: 35,
        marginLeft: 30,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: '#DE3031',
    },
    buttonStyleContainCannel: {
        width: 120,
        height: 35,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#DE3031',
    },
    buttonStyle: {
        fontSize: 16,
        color: 'white',
        fontFamily: 'STHeitiSC-Medium',
    },
    buttonStyleCannel: {
        fontSize: 16,
        color: '#DE3031',
        fontFamily: 'STHeitiSC-Medium',
    },
    container: {
        width:sr.w-60,
        alignItems:'center',
        backgroundColor:'#FFFFFF',
    },
    title: {
        color: '#151515',
        fontSize: 18,
        textAlign: 'center',
        overflow: 'hidden',
        marginTop: 15,
        fontFamily: 'STHeitiSC-Medium',
    },
    content: {
        alignSelf:'center',
        color:'#000000',
        marginTop: 10,
        marginBottom: 20,
        marginHorizontal: 20,
        fontSize:16,
        fontFamily: 'STHeitiSC-Medium',
    },
    overlayContainer: {
        position:'absolute',
        bottom: 0,
        alignItems:'center',
        justifyContent: 'center',
        width:sr.w,
        height:sr.h,
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
});
