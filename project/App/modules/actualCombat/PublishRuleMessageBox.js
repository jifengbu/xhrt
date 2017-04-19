'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    Animated,
    Text,
    TouchableOpacity,
    Navigator,
    WebView,
} = ReactNative;

const { Button } = COMPONENTS;

module.exports = React.createClass({
    getInitialState () {
        return {
            opacity: new Animated.Value(0),
            rulesContent:[],
        };
    },
    componentDidMount () {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 500,
        }
        ).start();
    },
    doConfirm () {
        this.closeModal(() => {
            this.props.doRuleConfirm();
        });
    },
    doNoPrompt () {
        this.closeModal(() => {
            this.props.doRuleNoPrompt();
        });
    },
    closeModal (callback) {
        Animated.timing(this.state.opacity, {
            toValue: 0,
            duration: 500,
        }).start(() => {
            callback();
        });
    },
    render () {
        return (
            <Animated.View style={[styles.overlayContainer, { opacity: this.state.opacity }]}>
                <View style={styles.container}>
                    <View style={styles.contentInput}>
                        <Text style={styles.textTitle}>发布规则</Text>
                        <WebView
                            style={styles.webview}
                            source={{ uri:app.route.ROUTE_GET_PUBLISHER_RULES_PAGE }}
                            scalesPageToFit={this.state.scalesPageToFit}
                            />
                    </View>
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            onPress={this.doNoPrompt}
                            style={[styles.tabButton, { marginLeft: 1, marginVertical: 1, borderBottomLeftRadius: 6, backgroundColor: '#FFFFFF' }]}>
                            <Text style={[styles.tabText, { color:CONSTANTS.THEME_COLOR }]} >不再提示</Text>
                            <View style={[styles.makeup, { right:0, backgroundColor:CONSTANTS.THEME_COLOR }]} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.doConfirm}
                            style={[styles.tabButton, { backgroundColor: CONSTANTS.THEME_COLOR }]}>
                            <Text style={[styles.tabText, { color:'#FFFFFF' }]} >确定</Text>
                            <View style={[styles.makeup, { left:0, top: 0, backgroundColor: CONSTANTS.THEME_COLOR }]} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        width:sr.w * 9 / 10,
        height:sr.h * 6 / 7,
        top: sr.totalNavHeight,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'white',
        borderRadius:6,
        position: 'absolute',
        left: sr.w * 1 / 20,
        marginTop:10,
    },
    overlayContainer: {
        position:'absolute',
        bottom: 0,
        width:sr.w,
        height:sr.h,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    tabContainer: {
        width:sr.w * 9 / 10,
        height: 45,
        marginTop: 20,
        marginHorizontal: 10,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        flexDirection: 'row',
        overflow: 'hidden',
        backgroundColor: CONSTANTS.THEME_COLOR,
    },
    tabButton: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
    },
    tabText: {
        fontSize: 16,
    },
    textTitle: {
        fontSize: 18,
        textAlign:'center',
        marginTop:10,
        fontWeight: '500',
        color:CONSTANTS.THEME_COLOR,
    },
    makeup: {
        top: 0,
        width: 10,
        height: 49,
        position: 'absolute',
    },
    contentInput: {
        flex: 1,
        width:sr.w * 5 / 6,
        padding:10,
        backgroundColor:'#FFFFFF',
    },
    lineside: {
        height: 1,
        marginTop:10,
        backgroundColor:'#9adeff',
    },
    webview: {
        alignSelf: 'center',
        width: sr.w * 9 / 10,
        height: sr.h * 6 / 7 - sr.totalNavHeight - 70,
    },
});
