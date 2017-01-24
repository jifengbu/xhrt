'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
    Text,
    Image,
    View,
    TouchableHighlight,
    TouchableOpacity,
} = ReactNative;

module.exports = React.createClass({
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.panelContainer}>
                    <Text style={styles.paneltext}>
                        {'试看时间已结束'}
                    </Text>
                    <View style={styles.paneltex}>
                        <Text style={styles.paneltext}>
                            {'需要购买'}
                        </Text>
                        <Text style={styles.membersText}>
                            {' 特种兵会员 '}
                        </Text>
                        <Text style={styles.paneltext}>
                            {'才能继续观看！'}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={this.props.doConfirm}
                        style={styles.panelBtn}>
                        <Text style={styles.btnText} >去付费</Text>
                    </TouchableOpacity>
                </View>
                <TouchableHighlight
                    onPress={app.closeModal}
                    underlayColor="rgba(0, 0, 0, 0)"
                    style={styles.touchableHighlight}>
                    <Image
                        resizeMode='contain'
                        source={app.img.draw_back}
                        style={styles.closeIcon}>
                    </Image>
                </TouchableHighlight>
            </View>
        );
    }
});


var styles = StyleSheet.create({
    container: {
        position:'absolute',
        bottom: 0,
        top:0,
        left: 0,
        right: 0,
        alignItems:'center',
    },
    panelContainer: {
        alignSelf: 'center',
        alignItems:'center',
        justifyContent:'center',
        paddingTop: 50,
        marginTop: (sr.h-200)/2,
        paddingBottom: 10,
        borderRadius: 6,
        width:sr.w/8*7,
        backgroundColor:'#FFFFFF',
    },
    btnText: {
        fontSize: 12,
        alignSelf: 'center',
        color:'white',
    },
    paneltex: {
        flexDirection:'row',
    },
    paneltext: {
        fontSize: 12,
        alignSelf: 'center',
        color:'gray',
        marginBottom:5,
    },
    membersText: {
        fontSize: 16,
        alignSelf: 'center',
        color:'red',
        marginBottom:5,
    },
    panelBtn: {
        height: 40,
        width:160,
        marginVertical:30,
        borderRadius: 4,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#A62045',
    },
    touchableHighlight: {
        position:'absolute',
        top:0,
        left:sr.w*8/9-3,
        width: 30,
        height: 30,
        marginTop: (sr.h-200-20)/2,
    },
    closeIcon: {
        width: 30,
        height: 30
    },
});
