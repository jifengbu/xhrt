'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    NativeModules,
} = ReactNative;

const PaySpecopsMessageBox = require('./PaySpecopsMessageBox.js');
const ScanQRCode = require('./ScanQRCode.js');
const OpenSpecops = require('./OpenSpecops.js');
const UtilsModule = NativeModules.UtilsModule;

const { Button } = COMPONENTS;

module.exports = React.createClass({
    specialSoldierVerification (code) {
        const param = {
            userID: app.personal.info.userID,
            verificationCode: code,
        };
        POST(app.route.ROUTE_SPECIAL_SOLDIER_VERIFICATION, param, this.specialSoldierVerificationSuccess, true);
    },
    specialSoldierVerificationSuccess (data) {
        if (data.success) {
            const { context } = data;
            if (context.isFree === 0) {
                this.props.setAuthorized();
                Toast('验证成功');
            } else {
                this.doShowPaySpecops();
            }
        } else {
            Toast(data.msg);
        }
    },
    onCode (code) {
        app.pop();
        this.specialSoldierVerification(code);
    },
    doScanQRCode () {
        UtilsModule.checkCameraPermission((hasPermission) => {
            if (hasPermission) {
                app.navigator.push({
                    component: ScanQRCode,
                    passProps: {
                        onCode: this.onCode,
                    },
                });
            } else {
                Toast('需要开启相机权限');
            }
        });
    },
    doShowPaySpecops () {
        app.navigator.push({
            title: '开通赢销特种兵',
            component: OpenSpecops,
            passProps: { setAuthorized:this.props.setAuthorized },
        });
    },
    render () {
        return (
            <Image resizeMode='stretch'
                source={app.img.specops_background_3}
                style={styles.imageContainer}>
                <Image resizeMode='stretch'
                    source={app.img.specops_chat}
                    style={styles.promptImage}>
                    <Text style={styles.promptText}>亲，需要进行如下其中一种操</Text>
                    <Text style={[styles.promptText, { marginTop: 8 }]}>作才能成为我们的特种兵哦~~~!</Text>
                </Image>
                <Image resizeMode='stretch'
                    source={app.img.guide_cartoon_image}
                    style={styles.cartoonImage} />
                <View style={styles.btnStyle}>
                    <TouchableOpacity
                        onPress={this.doScanQRCode}
                        style={styles.tabButton}>
                        <Text style={[styles.textcenter, { color :'#FFFFFF' }]} >扫码试用</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.btnStyleBottom}>
                    <TouchableOpacity
                        onPress={this.doShowPaySpecops}
                        style={styles.tabButtonBottom}>
                        <Text style={[styles.textcenter, { color :'#FF6363' }]} >直接购买</Text>
                    </TouchableOpacity>
                </View>
            </Image>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageContainer: {
        width: sr.w,
        height: sr.ch,
        alignItems: 'center',
    },
    promptImage: {
        width: 280,
        height: 91,
        marginTop: 85,
        marginRight: 50,
        alignItems: 'center',
    },
    promptText: {
        fontSize: 18,
        marginTop: 10,
        fontFamily: 'STHeitiSC-Medium',
        color: '#FFFFFF',
        backgroundColor:'transparent',
    },
    cartoonImage: {
        width: sr.w / 4 + 15,
        height: sr.h / 3 + 10,
        right: 15,
        top: 100,
        position: 'absolute',
    },
    btnStyle:{
        height:46,
        width: 330,
        marginTop: sr.h / 4,
        marginBottom: 20,
        marginHorizontal:10,
        borderRadius:2,
    },
    btnStyleBottom:{
        height:46,
        width: 330,
        marginTop: 20,
        marginBottom: 20,
        marginHorizontal:10,
        borderRadius:2,
    },
    tabButton: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
        borderRadius: 2,
        backgroundColor: '#FF6363',
    },
    tabButtonBottom: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#FF6363',
        backgroundColor: '#FFFFFF',
    },
    textcenter:{
        fontSize: 16,
        fontFamily: 'STHeitiSC-Medium',
        textAlign: 'center',
    },
});
