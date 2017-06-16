'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    Text,
    Animated,
    View,
    Image,
    Linking,
    TouchableOpacity,
    TouchableHighlight,
} = ReactNative;

const PaySpecopsMessageBox = require('../specops/PaySpecopsMessageBox.js');
const BuyRecommend = require('./BuyRecommend.js');

module.exports = React.createClass({
    statics: {
        title: '开通赢销特种兵',
    },
    getInitialState () {
        const packageList = app.data.packageList;
        const packageInfo01 = _.find(packageList, (item) => item.typeCode === '10005');
        const packageInfo02 = _.find(packageList, (item) => item.typeCode === '10006');
        return {
            packageInfo01: packageInfo01,
            packageInfo02: packageInfo02,
        };
    },
    toUnauthorized (packageInfo) {
        if (packageInfo === undefined) {
            Toast('特种兵套餐数据错误，请选择其他套餐！');
            return;
        } else {
            if (packageInfo.typeCode === '10005') {
                app.showModal(
                    <PaySpecopsMessageBox
                        title={'开通总裁特种兵'}
                        describe={'购买后你将拥有一年的企业管理端+特种兵特权'}
                        packagePrice={packageInfo.packagePrice}
                        packageID={packageInfo.packageID}
                        orderType={5}
                        doPayByWechat={this.doPayByWechat}
                        doPayByAlipay={this.doPayByAlipay}
                        doBack={this.goBack}
                        doClose={() => app.closeModal}
                    />
                );
            } else if (packageInfo.typeCode === '10006') {
                app.showModal(
                    <PaySpecopsMessageBox
                        title={'开通特种兵'}
                        describe={'购买后你将拥有一年的特种兵特权'}
                        packagePrice={packageInfo.packagePrice}
                        packageID={packageInfo.packageID}
                        orderType={6}
                        doPayByWechat={this.doPayByWechat}
                        doPayByAlipay={this.doPayByAlipay}
                        doBack={this.goBack}
                        doClose={() => app.closeModal}
                    />
                );
            }
        }
    },
    goBack () {
        app.navigator.push({
            component: BuyRecommend,
            passProps:{ comeSpecops: true},
        });
    },
    doPayByWechat (orderType) {
        this.onBuySuccess(orderType);
    },
    doPayByAlipay (orderType) {
        this.onBuySuccess(orderType);
    },
    onBuySuccess (orderType) {
        if (this.props.setAuthorized) {
            this.props.setAuthorized();
        }
        app.personal.setSpecialSoldier(true);
        app.personal.info.specopsPrice = orderType==5?4800:500;
        app.personal.set(app.personal.info);
        Toast(orderType==5?'恭喜你成为总裁特种兵':'恭喜你成为特种兵');

        app.closeModal();
        app.navigator.push({
            component: BuyRecommend,
            passProps:{ comeSpecops: true},
        });
    },
    render () {
        const titles2 = ['赢销特种兵企业管理系统', '员工日常监管系统', '员工日常学习数据统计系统', '附赠一个赢销特种兵账号'];
        const titles1 = ['一年48周赢销特种兵成才帮辅计划', '每周五上传新的赢销特种兵线上学习视频', '标配365天成功行为习惯管理系统，帮助建立长期工作日志'];
        return (
            <View style={styles.container}>
                <View style={styles.separa} />
                <TouchableOpacity
                    onPress={this.toUnauthorized.bind(null, this.state.packageInfo02)}
                    style={styles.touchStyle}>
                    <Image
                        resizeMode='stretch'
                        source={app.img.specops_bk_1}
                        style={styles.btnBk_1}>
                        <View style={styles.contentView}>
                            {
                                titles1.map((item, i) => {
                                    return (
                                        <View key={i} style={styles.contentItemView}>
                                            <Image
                                                resizeMode='contain'
                                                source={app.img.specops_icon_1}
                                                style={styles.icon} />
                                            <Text style={styles.content}>
                                                {item}
                                            </Text>
                                        </View>
                                    );
                                })
                            }
                        </View>
                        <Image
                            resizeMode='contain'
                            source={app.img.specops_priceBtn}
                            style={styles.closePrompt} />
                    </Image>
                </TouchableOpacity>
                <View style={styles.separator} />
                <TouchableOpacity
                    onPress={this.toUnauthorized.bind(null, this.state.packageInfo01)}
                    style={styles.touchStyle}>
                    <Image
                        resizeMode='stretch'
                        source={app.img.specops_bk_2}
                        style={styles.btnBk_1}>
                        <View style={styles.contentView}>
                            {
                                titles2.map((item, i) => {
                                    return (
                                        <View key={i} style={styles.contentItemView}>
                                            <Image
                                                resizeMode='contain'
                                                source={app.img.specops_icon_1}
                                                style={styles.icon} />
                                            <Text style={styles.content}>
                                                {item}
                                            </Text>
                                        </View>
                                    );
                                })
                            }
                        </View>
                        <Image
                            resizeMode='contain'
                            source={app.img.specops_priceBtn}
                            style={styles.closePrompt} />
                        <View style={styles.titleView}>
                            <Text style={styles.titleText}>
                                {'(限员工100名以内)'}
                            </Text>
                        </View>
                    </Image>
                </TouchableOpacity>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:'center',
        backgroundColor: '#FFFFFF',
    },
    separa: {
        width: sr.w,
        marginBottom: 40,
        backgroundColor: '#EDEDED',
        height: 1,
    },
    separator: {
        width: sr.w - 40,
        marginVertical: 40,
        backgroundColor: '#EDEDED',
        height: 1,
    },
    touchStyle: {
        width: sr.w - 40,
        height: 200,
        borderRadius: 2,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnBk_1: {
        width: sr.w - 40,
        height: 200,
    },
    contentView: {
        width: sr.w - 40,
        marginTop: 65,
    },
    contentItemView: {
        width: sr.w - 60,
        marginLeft: 10,
        marginTop: 5,
        flexDirection: 'row',
    },
    icon: {
        marginTop: 2,
        width: 12,
        height: 12,
        marginRight: 10,
    },
    content: {
        width: sr.w - 96,
        color:'#666666',
        fontSize:12,
        fontFamily: 'STHeitiSC-Medium',
    },
    closePrompt: {
        position: 'absolute',
        left: (sr.w - 120) / 2,
        bottom: 10,
        width: 80,
        height: 32,
    },
    titleView: {
        position: 'absolute',
        left: 170,
        top: 30,
        width: 130,
        backgroundColor: 'transparent',
    },
    titleText: {
        color:'#D9DADB',
        fontSize:10,
        fontFamily: 'STHeitiSC-Medium',
    },
});
