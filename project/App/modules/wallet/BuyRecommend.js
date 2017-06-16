'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
} = ReactNative;

const Recommend = require('./Recommend.js');
const PersonInfo = require('../person/PersonInfo.js');

module.exports = React.createClass({
    statics: {
        title: '推荐大使',
        color: '#FFFFFF',
        leftButton: { image: app.img.common_back, handler: () => { app.scene.goBack(); } },
    },
    goBack() {
        if (this.props.comeSpecops) {
            const routes = app.navigator.getCurrentRoutes();
            app.navigator.popToRoute(routes[1]);
        } else {
            app.navigator.pop();
        }
    },
    componentWillMount () {
        app.updateNavbarColor('#DE3031');
    },
    onWillFocus () {
        app.updateNavbarColor('#DE3031');
    },
    becomeRecommend () {
        const param = {
            userID: app.personal.info.userID,
        };
        POST(app.route.ROUTE_APPLY_RECOMMEND, param, this.recommendSuccess, true);
    },
    recommendSuccess (data) {
        if (data.success) {
            if (data.context) {
                let { feeQRCode } = data.context;
                let { info } = app.personal;
                info.recommendAmbassador = 1;
                app.personal.set(info);
                app.navigator.push({
                    component: Recommend,
                    passProps:{ feeQRCode, comeRecommend: true},
                });
            }

        }
    },
    render () {
        return (
            <ScrollView style={styles.container}>
                <Image
                    resizeMode='stretch'
                    source={app.img.wallet_re_detail}
                    style={styles.img_icon} >
                    <View style={styles.title_style}>
                        <Text numberOfLines={1} style={styles.titleText}>
                            {app.personal.info.name+' ：'}
                        </Text>
                    </View>
                </Image>
                <TouchableOpacity
                    style={styles.btn_containerView}
                    onPress={this.becomeRecommend}>
                    <Image
                        resizeMode='stretch'
                        source={app.img.wallet_become_btn}
                        style={styles.btn_container} />
                </TouchableOpacity>
                <View style={[styles.empty, {height:app.isandroid?20:0}]} />
            </ScrollView>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        width: sr.w,
    },
    img_icon: {
        alignSelf: 'center',
        width: 355,
        height: 476,
    },
    title_style: {
        width: 200,
        height: 22,
        marginTop: 27,
        marginLeft: 70,
        justifyContent: 'flex-end',
    },
    titleText: {
        fontSize: 14,
        color: '#292929',
    },
    title_text: {
        marginBottom: 15,
        fontSize: 16,
        color: '#444444',
    },
    icon_text: {
        marginBottom: 15,
        fontSize: 16,
        color: 'red',
    },
    btn_container: {
        height: 56,
        width: 352,
    },
    btn_containerView: {
        alignSelf: 'center',
        marginTop: 30,
        height: 56,
        width: 352,
    },
    empty: {
        height: 20,
        width: sr.w,
    },
});
