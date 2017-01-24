'use strict';
var React = require('react');
var ReactNative = require('react-native');
var {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} = ReactNative;

var SplashScreen = require('@remobile/react-native-splashscreen');
var ScrollableTabView = require('@remobile/react-native-scrollable-tab-view');
var Page = require('./page.js');

module.exports = React.createClass({
    componentWillMount() {
        SplashScreen.hide();
    },
    render() {
        return (
            <ScrollableTabView>
                <Page tabLabel="第一页" />
                <Page tabLabel="第二页" />
            </ScrollableTabView>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
