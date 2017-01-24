'use strict';

var React = require('react');var ReactNative = require('react-native');

var {
    Image,
    StyleSheet,
    Text,
    View,
} = ReactNative;


module.exports = React.createClass({
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.container1}>
                    <Text style={styles.title}>温馨提示</Text>
                    <Text style={styles.actualContent}>暂未开放，敬情期待...</Text>
                </View>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingBottom: 80,
    },
    container1: {
        width:sr.w*5/6,
        height:120,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#A62045',
        borderRadius:10,
    },
    title: {
        color: '#BDA066',
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 10,
        textAlign: 'center',
        overflow: 'hidden',
    },
    actualContent: {
        marginVertical:10,
        color: 'white',
        fontSize: 18,
        fontWeight: '400',
        overflow: 'hidden',
        textAlign:'center',
    },
});
