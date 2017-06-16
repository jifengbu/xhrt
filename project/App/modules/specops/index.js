'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
} = ReactNative;
const Unauthorized = require('./UnauthorizedMainPage.js');
const MainPage = require('./MainPage.js');
// const Search = require('../search/index.js');

module.exports = React.createClass({
    statics: {
        title: '赢销特种兵',
    },
    getInitialState () {
        const { isAgent, isSpecialSoldier } = app.personal.info;
        return {
            authorized: isAgent || isSpecialSoldier, //是否是特种兵1—是  0—不是
        };
    },
    onWillFocus (flag) {
        app.updateNavbarColor('#DE3031');
        const { isAgent, isSpecialSoldier } = app.personal.info;
        const authorized = isAgent || isSpecialSoldier;
        setTimeout(() => {
            if (this.mainPage) {
                this.mainPage.onWillFocus();
            }
        }, 200);
        this.setState({ authorized });
    },
    setAuthorized () {
        app.personal.setSpecialSoldier(true);
        this.setState({ authorized: true });
    },
    render () {
        const { authorized } = this.state;
        if (!authorized) {
            return (
                <MainPage setEditFlag={this.props.setEditFlag} ref={(ref) => { this.mainPage = ref; }} isSpecialSoldier={authorized} setAuthorized={this.setAuthorized} />
            );
        } else {
            return (
                <MainPage setEditFlag={this.props.setEditFlag} ref={(ref) => { this.mainPage = ref; }} isSpecialSoldier={authorized} setAuthorized={this.setAuthorized} />
            );
        }
    },
});
