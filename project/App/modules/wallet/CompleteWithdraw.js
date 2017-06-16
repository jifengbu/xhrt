'use strict';
const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    ListView,
    Image,
    TextInput,
} = ReactNative;

module.exports = React.createClass({
    statics: {
        title: '提现详情',
        color: '#FFFFFF',
        leftButton: { noLeftButton: true },
    },
    popToWallet() {
        const routes = app.navigator.getCurrentRoutes();
        app.navigator.popToRoute(routes[2]);
    },
    render () {
        let { name,text } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.topView}>
                    <Image
                        resizeMode='stretch'
                        source={app.img.wallet_detail}
                        style={styles.icon_detail} />
                    <Text style={styles.theme_text}>{'提现申请已提交，请等待审核'}</Text>
                    <Text style={styles.sub_text}>{'审核通过后，将在5个工作日内到账'}</Text>
                </View>
                <View style={styles.line}>
                </View>
                <View style={styles.midView}>
                    <View style={styles.bank}>
                        <Text style={styles.card_text}>{'银行卡'}</Text>
                        <Text style={styles.bank_text}>{name}</Text>
                    </View>
                    <View style={[styles.bank,{marginTop: 10}]}>
                        <Text style={styles.card_text}>{'提现金额'}</Text>
                        <View style={{flexDirection:'row'}}>
                            <Text style={styles.bank_text1}>{text}</Text>
                            <Text style={styles.bank_text}>{'元'}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.line}>
                </View>
                <TouchableOpacity style={styles.btn_bottom} onPress={this.popToWallet}>
                    <Text style={styles.btn_text}>{'完  成'}</Text>
                </TouchableOpacity>
            </View>

        );
    },
});

const styles = StyleSheet.create({
    container: {
        width: sr.w,
        height: sr.ch,
        backgroundColor: '#EEEEEE',
    },
    btn_bottom: {
        marginTop: 37,
        height: 42,
        borderRadius: 6,
        marginLeft: 15,
        width: sr.w-30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DE3031',
    },
    theme_text: {
        marginTop: 20,
        fontSize: 20,
        color: '#222222',
    },
    sub_text: {
        marginTop: 10,
        fontSize: 14,
        color: '#444444',
    },
    btn_text: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    card_text: {
        marginLeft: 10,
        fontSize: 14,
        color: '#444444',
    },
    bank_text: {
        marginRight: 10,
        fontSize: 14,
        color: '#111111',
    },
    bank_text1: {
        fontSize: 14,
        color: '#111111',
    },
    topView: {
      width: sr.w,
      height: 240,
      alignItems: 'center',
    },
    icon_detail: {
      width: 80,
      height: 80,
      marginTop: 65,
    },
    midView: {
      width: sr.w,
      height: 77,
      alignItems: 'center',
      justifyContent: 'center',
    },
    line: {
      width: sr.w,
      height: 1,
      backgroundColor: '#cdcdcd',
    },
    bank: {
      width: sr.w,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
});
