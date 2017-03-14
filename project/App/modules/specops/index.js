'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
} = ReactNative;
var Unauthorized = require('./Unauthorized.js');
var MainPage = require('./MainPage.js');
var PersonInfo = require('../person/PersonInfo.js');
// var Search = require('../search/index.js');

module.exports = React.createClass({
    statics: {
        title: '赢销特种兵',
        leftButton: { image: app.img.personal_entrance, handler: ()=>{
            app.navigator.push({
                component: PersonInfo,
                fromLeft: true,
            });
        }},
    },
    getInitialState() {
        const {isAgent, isSpecialSoldier} = app.personal.info;
        return {
            authorized: isAgent||isSpecialSoldier, //是否是特种兵1—是  0—不是
        };
    },
    onWillFocus(flag) {
        const {isAgent, isSpecialSoldier} = app.personal.info;
        var authorized = isAgent||isSpecialSoldier;
        if (authorized) {
            setTimeout(()=>{
                if (this.mainPage) {
                    this.mainPage.onWillFocus(flag);
                }
            }, 200);
        }
        this.setState({authorized});
    },
    setAuthorized() {
        app.personal.setSpecialSoldier(true);
        this.setState({authorized: true});
    },
    render() {
        const {authorized} = this.state;
        if (!authorized) {
            return (
                <Unauthorized setAuthorized={this.setAuthorized}/>
            )
        } else {
            return (
                <MainPage setEditFlag={this.props.setEditFlag} ref={(ref)=>{this.mainPage=ref}}/>
            )
        }
    },
});
