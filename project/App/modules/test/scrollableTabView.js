'use strict';
const React = require('react');
const ReactNative = require('react-native');
const {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} = ReactNative;

const SplashScreen = require('@remobile/react-native-splashscreen');
const ScrollableTabView = require('@remobile/react-native-scrollable-tab-view');
const Page = require('./page.js');

module.exports = React.createClass({
    componentWillMount () {
        SplashScreen.hide();
    },
    render () {
        return (
            <ScrollableTabView>
                <Page tabLabel='第一页' />
                <Page tabLabel='第二页' />
            </ScrollableTabView>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
