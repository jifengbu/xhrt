'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    Image,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} = ReactNative;

var {Button} = COMPONENTS;

module.exports = React.createClass({
    getInitialState() {
        return {
            propList: this.props.propList||[],
        };
    },
    showPropsPrompt(propInfo) {
        if (!CONSTANTS.ISSUE_IOS) {
            var personInfo = app.personal.info;
            //0表示用积分购买1-用赢销币购买 发送成功后 减去相应的积分和营销币
            if (propInfo.propType == 1) {
                if (personInfo.integral < propInfo.propValue) {
                    this.props.ShowBuyChange(0, propInfo.propValue);
                    return;
                }
            } else if (propInfo.propType == 2) {
                if (personInfo.winCoin < propInfo.propValue) {
                    this.props.ShowBuyChange(1, propInfo.propValue);
                    return;
                }
            }
            this.noticeShowPrompt(propInfo);
        } else {
            this.noticeShowPrompt(propInfo);
        }
    },
    noticeShowPrompt(propInfo) {
        this.show(()=>{
            this.props.noticeShowPrompt(propInfo);
        });
    },
    show(callback) {
        return callback();
    },
    render() {
        return (
            <View style={[styles.container, this.props.style]}>
                <View style={styles.panelContainer}>
                    {
                        this.state.propList.map((item, i)=>{
                            return (
                                <TouchableOpacity
                                    key={i}
                                    style={styles.propComtainer}
                                    onPress={this.showPropsPrompt.bind(null, item)}>
                                    <Image
                                        style={styles.chatImage}
                                        resizeMode='contain'
                                        defaultSource={app.img.common_default}
                                        source={{uri:item.propImg}}>
                                    </Image>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
                <View style={styles.currencyContainer}>
                    <Text style={styles.currencyText}>{(CONSTANTS.ISSUE_IOS?'积分:':'赢销积分:') + app.personal.info.integral}</Text>
                    {!CONSTANTS.ISSUE_IOS&&<Text style={styles.currencyText}>{'赢销币:' + app.personal.info.winCoin}</Text>}
                </View>
            </View>
        );
    }
});

// <View style={styles.separator}/>

var styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: '#1E1F20',
    },
    panelContainer: {
        marginTop: 5,
        marginLeft: 3,
        marginRight: 8,
        alignSelf: 'flex-start',
        width:sr.w-11,
        flexDirection: 'row',
    },
    propComtainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#CFD0D0',
        marginLeft: 5,
        borderRadius: 5,
    },
    chatImage: {
        alignSelf: 'center',
        width: 40,
        height: 40,
    },
    currencyContainer: {
        marginRight: 8,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
        marginBottom: 5,
    },
    currencyText: {
        fontSize: 12,
        marginLeft: 20,
        color: '#EEEEEE',
    },
    separator: {
        height: 1,
        width: sr.w,
        backgroundColor: '#EEEEEE'
    },
});
