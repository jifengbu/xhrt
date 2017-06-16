'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
} = ReactNative;

import Badge from 'react-native-smart-badge'
var Call = require('@remobile/react-native-call');
const { DImage, Button, ActionSheet } = COMPONENTS;

const rulesList=['每天可申请提现一次', '余额大于300才可提现', '提交提现申请后需等待审核', '审核通过后将在每月25～30日内到账', '若提现失败请联系客服'];

module.exports = React.createClass({
    statics: {
        color: '#FFFFFF',
        title: '提现规则',
        leftButton: { image: app.img.common_back, handler: () => { app.navigator.pop(); } },
    },
    getInitialState() {
        return {
            actionSheetVisible: false,
        };
    },
    doCloseActionSheet() {
        this.setState({actionSheetVisible:false});
    },
    doShowActionSheet() {
        this.setState({actionSheetVisible:true});
    },
    //底部ActionSheet
    ActionSheetViewItem() {
        return (
            <ActionSheet
                visible={this.state.actionSheetVisible}
                cancelText="取   消"
                onCancel={this.doCloseActionSheet} >
                <ActionSheet.Button onPress={this.callPhone}>085186810083</ActionSheet.Button>
            </ActionSheet>
        )
    },
    onPressCall() {
        this.doShowActionSheet();
    },
    callPhone(data) {
        this.doCloseActionSheet();
        Call.callNumber((a, b)=>{
              console.log(a, b);
          }, (a, b)=>{
              console.log(a, b);
          },
          "085186810083",
          true,
        );
    },
    render () {
        return (
            <View style={styles.container}>
                <View style={styles.panelContainer}>
                    {
                        rulesList.map((item ,i) =>{
                            return(
                                <View key={i} style={[styles.contentContainer, {marginTop: i===0?sr.ws(15):0, marginBottom: i===rulesList.length-1?sr.ws(15):0}]}>
                                    <Badge style={styles.cellContentLabelLeft} textStyle={{color: '#FFFFFF'}}>
                                      {parseInt(i)+1}
                                    </Badge>
                                    <Text style={styles.numberText}>{item}</Text>
                                </View>
                            );
                        })
                    }
                </View>
                <View style={styles.phoneContainer}>
                    <View style={styles.phoneContainer1}>
                        <Text style={styles.phoneTitle}>{'客服电话'}</Text>
                    </View>
                    <View style={styles.phoneContainer2}>
                        <TouchableOpacity onPress={this.onPressCall} style={styles.touchCall} underlayColor="rgba(0, 0, 0, 0)">
                            <DImage
                                resizeMode='cover'
                                source={app.img.wallet_phone}
                                style={styles.phoneImage} />
                            <Text style={styles.phoneText}>{'0851-86810083'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <this.ActionSheetViewItem/>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F0EFF5',
    },
    panelContainer: {
        width: sr.w-30,
        marginTop: 10,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
    },
    contentContainer: {
        height: 30,
        flexDirection: 'row',
        alignItems: 'center',
    },
    cellContentLabelLeft: {
       marginLeft:20,
       backgroundColor:'#d93336'
    },
    numberText: {
        fontSize: 14,
        marginLeft: 5,
        color: '#666666',
    },
    phoneContainer: {
        width: sr.w-30,
        height: app.isandroid?60:45,
        flexDirection: 'row',
        marginTop: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    phoneContainer1: {
        width: 140,
        height: 45,
        marginTop: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    phoneContainer2: {
        width: sr.w-170,
        height: 45,
        marginTop: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    phoneTitle: {
        fontSize: 15,
        color: '#d93336',
    },
    touchCall: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    phoneText: {
        fontSize: 14,
        color: '#666666',
        marginLeft: 5,
        fontFamily: 'STHeitiSC-Medium',
    },
    phoneImage: {
        width: 16,
        height: 16,
    },

});
