'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
} = ReactNative;

const AidKitManagement = require('./AidKitManagement.js');
const PacketClassificationForHelp = require('./PacketClassificationForHelp.js');

const { Button } = COMPONENTS;

module.exports = React.createClass({
    statics: {
        title: '实战记录',
    },
    getInitialState () {
        return {
            tabIndex: 0,
        };
    },
    changeTab (tabIndex) {
        this.setState({ tabIndex });
    },
    render () {
        const isFirstTap = this.state.tabIndex === 0;
        return (
            <View style={styles.container}>
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        onPress={this.changeTab.bind(null, 0)}
                        style={[styles.tabButton, isFirstTap ? { backgroundColor: CONSTANTS.THEME_COLOR } : null]}>
                        <Text style={[styles.tabText, { color:isFirstTap ? '#FFFFFF' : CONSTANTS.THEME_COLOR }]} >求救包管理</Text>
                        {isFirstTap && <View style={[styles.makeup, { right:0 }]} />}
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.changeTab.bind(null, 1)}
                        style={[styles.tabButton, !isFirstTap ? { backgroundColor:CONSTANTS.THEME_COLOR } : null]}>
                        <Text style={[styles.tabText, { color:!isFirstTap ? '#FFFFFF' : CONSTANTS.THEME_COLOR }]} >急救包管理</Text>
                        {!isFirstTap && <View style={[styles.makeup, { left:0 }]} />}
                    </TouchableOpacity>
                </View>
                <PacketClassificationForHelp
                    tabIndex={0}
                    disable={this.state.tabIndex !== 0}
                    style={isFirstTap ? { flex:1 } : { left:-sr.tw, top:0, position:'absolute' }} />
                <AidKitManagement
                    tabIndex={1}
                    disable={this.state.tabIndex !== 1}
                    style={isFirstTap ? { left:-sr.tw, top:0, position:'absolute' } : { flex:1 }} />
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabContainer: {
        height: 30,
        marginTop: 20,
        marginHorizontal: 10,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: CONSTANTS.THEME_COLOR,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    tabButton: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
        borderRadius: 10,
    },
    tabText: {
        fontSize: 18,
    },
    makeup: {
        backgroundColor:CONSTANTS.THEME_COLOR,
        top: 0,
        width: 10,
        height: 50,
        position: 'absolute',
    },
});
