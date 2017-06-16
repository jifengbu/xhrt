'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    TouchableHighlight,
    Text,
    Image,
} = ReactNative;

import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
var ReadingList = require('./ReadingList.js');

const FirstRoute = () =>
    <View style={styles.container}>
        <ReadingList tabIndex={1}/>
    </View>;
const SecondRoute = () =>
    <View style={styles.container}>
        <ReadingList tabIndex={2}/>
    </View>;
const _renderScene = SceneMap({
    '1': FirstRoute,
    '2': SecondRoute,
});

module.exports = React.createClass({
    getInitialState () {
        return {
            index: 0,
            routes: [
              { key: '1', title: 'First' },
              { key: '2', title: 'Second' },
            ],
        };
    },
    _handleChangeTab(index) {
        this.setState({ index });
    },
    _renderHeader (props) {
        const { index } = this.state;
        return (
            <View style={styles.headerContainer}>
                <View style={styles.tabContainer}>
                    <TouchableHighlight
                        underlayColor='rgba(0, 0, 0, 0)'
                        onPress={this._handleChangeTab.bind(null, 0)}
                        style={styles.touchTab}>
                        <View style={styles.tabButton}>
                            <Text style={[styles.tabText, { color:index === 0 ? '#FA6263' : '#666666' }]} >
                                {'销售技巧'}
                            </Text>
                            <View style={[styles.tabLineSelect,{backgroundColor: index === 0 ?'#FA6263':'transparent'}]} />
                        </View>
                    </TouchableHighlight>
                    <View style={styles.vLine}/>
                    <TouchableHighlight
                        underlayColor='rgba(0, 0, 0, 0)'
                        onPress={this._handleChangeTab.bind(null, 1)}
                        style={styles.touchTab}>
                        <View style={styles.tabButton}>
                            <Text style={[styles.tabText, { color:index === 1 ? '#FA6263' : '#666666' }]} >
                                {'企业管理'}
                            </Text>
                            <View style={[styles.tabLineSelect,{backgroundColor: index === 1 ?'#FA6263':'transparent'}]} />
                        </View>
                    </TouchableHighlight>
                </View>
                <View style={styles.line}/>
            </View>
        )
    },
    render () {
        return (
            <View style={styles.container}>
                <View style={styles.line}/>
                <TabViewAnimated
                    style={styles.container}
                    navigationState={this.state}
                    renderScene={_renderScene}
                    renderHeader={this._renderHeader}
                    onRequestChangeTab={this._handleChangeTab}
                  />
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        width: sr.w,
    },
    line: {
      width: sr.w,
      height: 1,
      backgroundColor: '#E0E0E0',
    },
    vLine: {
      width: 1,
      marginTop: 15,
      height: 20,
      backgroundColor: '#E0E0E0',
    },
    tabContainer: {
        width:sr.w,
        height: 50,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
    },
    touchTab: {
        flex: 1,
    },
    tabButton: {
        height: 50,
        alignItems:'center',
        justifyContent:'center',
    },
    tabText: {
        fontSize: 15,
    },
    tabLineSelect: {
        position: 'absolute',
        bottom: 0,
        width: 72,
        height: 2,
    },
});
