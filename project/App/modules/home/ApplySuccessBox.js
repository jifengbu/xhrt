'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    Text,
    Animated,
    View,
    TouchableOpacity,
} = ReactNative;

module.exports = React.createClass({
    doConfirm () {
        this.props.doConfirm();
        app.closeModal();
    },
    render () {
        return (
            <View style={styles.overlayContainer}>
                <View style={styles.container}>
                    <Text style={[styles.content, { marginTop: sr.ws(25) }]}>
                        {'报名成功，我们会尽快联系你'}
                    </Text>
                    <Text style={[styles.content, { marginTop: 5 }]}>
                        {'为了更好服务你，请完善个人资料'}
                    </Text>
                    <View style={styles.lineStyleTop} />
                    <View style={styles.buttonViewStyle}>
                        <TouchableOpacity
                            onPress={app.closeModal}
                            style={styles.buttonStyleContainCannel}>
                            <Text style={styles.buttonStyle}>取消</Text>
                        </TouchableOpacity>
                        <Text style={styles.lineStyle} />
                        <TouchableOpacity
                            onPress={this.doConfirm}
                            style={styles.buttonStyleContain}>
                            <Text style={styles.buttonStyle} >完善资料</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    buttonViewStyle: {
        position:'absolute',
        bottom: 0,
        flexDirection: 'row',
        width: 269,
        height: 44,
        justifyContent:'space-between',
    },
    buttonStyleContain: {
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
        borderBottomRightRadius: 12,
        backgroundColor: '#FFFFFF',
    },
    buttonStyleContainCannel: {
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: 'white',
        borderBottomLeftRadius: 12,
    },
    buttonStyle: {
        fontSize: 17,
        color: '#0076FF',
    },
    lineStyle: {
        width: 1,
        height: 44,
        backgroundColor: '#D6D6D6',
    },
    lineStyleTop: {
        position: 'absolute',
        bottom: 44,
        left: 0,
        width: 270,
        height: 1,
        backgroundColor: '#D6D6D6',
    },
    container: {
        width:288,
        height:129,
        borderRadius: 12,
        alignItems:'center',
        backgroundColor:'#FFFFFF',
    },
    content: {
        color:'#030303',
        fontFamily: 'STHeitiSC-Medium',
        fontSize:17,
        backgroundColor: 'transparent',
    },
    overlayContainer: {
        flex: 1,
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
});
