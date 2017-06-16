'use strict';

const React = require('react');
const ReactNative = require('react-native');

const {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} = ReactNative;

const PaySpecopsMessageBox = require('../specops/PaySpecopsMessageBox.js');

module.exports = React.createClass({
    statics: {
        title: '开通企业管理系统',
    },
    getInitialState () {
        const packageList = app.data.packageList;
        const packageInfo01 = _.find(packageList, (item) => item.typeCode === '10005');
        return {
            packageInfo01: packageInfo01,
        };
    },
    toSpecops(packageInfo) {
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
    },
    doPayByWechat () {
        this.onBuySuccess();
    },
    doPayByAlipay () {
        this.onBuySuccess();
    },
    onBuySuccess () {
        app.closeModal();
        app.personal.info.specopsPrice = 4800;
        app.personal.set(app.personal.info);
        app.personal.setSpecialSoldier(true);
        Toast('恭喜你成为总裁特种兵');
        app.navigator.pop();
    },
    render () {
        let {packageInfo01} = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.line}/>
                <Image
                    resizeMode='stretch'
                    source={app.img.home_dredge}
                    style={styles.bannerImage}
                    >
                    <TouchableOpacity
                        style={styles.btnStyle}
                        onPress={this.toSpecops.bind(null,packageInfo01)}>
                        <Image
                            resizeMode='stretch'
                            source={app.img.home_dredge_btn}
                            style={styles.btnImage}
                            />
                    </TouchableOpacity>
                </Image>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    bannerImage: {
        width: sr.w-40,
        marginLeft: 20,
        height: 420,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    line: {
        width: sr.w,
        height: 1,
        marginBottom: 50,
        backgroundColor: '#E3E3E3',
    },
    btnStyle: {
        position: 'absolute',
        bottom: 30,
        width: 200,
        height: 42,
    },
    btnImage: {
        width: 200,
        height: 42,
    },
});
