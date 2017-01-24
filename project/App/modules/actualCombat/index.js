'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
} = ReactNative;

var AidList = require('./AidList.js');
var PersonInfo = require('../person/PersonInfo.js');
var SendMadKit = require('./SendMadKit.js');
var SendAid = require('./SendAid.js');

var {Button} = COMPONENTS;

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        guideLayer: require('../guide/ActualCombatGuide.js'),
        title: '实战场',
        leftButton: { image: app.img.home_personal, handler: ()=>{
            app.navigator.push({
                component: PersonInfo,
                fromLeft: true,
            });
        }},
        rightButton: { image: app.img.actualCombat_release_help, handler: ()=>{
            app.scene.toggleEdit()
        }},
    },
    getInitialState() {
        return {
            tabIndex: 0,
        };
    },
    onWillFocus() {
        if (this.state.tabIndex === 0) {
            this.aidList0.checkFirstPageList();
        } else {
            this.aidList1.checkFirstPageList();
        }
    },
    toggleEdit() {
        if (this.state.tabIndex===0) {
            app.navigator.push({
                component: SendMadKit,
                passProps: {tabIndex: 0, updateAidList:this.updateAidList},
            });
        } else {
            app.navigator.push({
                component: SendAid,
                passProps: {tabIndex: 1, updateAidList:this.updateAidList},
            });
        }
    },
    updateAidList() {
        if (this.state.tabIndex === 0) {
            this.aidList0.doRefresh();
        } else {
            this.aidList1.doRefresh();
        }
    },
    changeTab(tabIndex) {
        this.setState({tabIndex});
        if (tabIndex===0) {
            this.aidList0.checkFirstPageList();
            app.getCurrentRoute().rightButton = { image: app.img.actualCombat_release_help, handler: ()=>{
                app.scene.toggleEdit()
            }};
        } else {
            this.aidList1.checkFirstPageList();
            app.getCurrentRoute().rightButton = { image: app.img.actualCombat_first_aid_kit_icon, handler: ()=>{
                app.scene.toggleEdit()
            }};
        }
        app.forceUpdateNavbar();
    },
    render() {
        var isFirstTap = this.state.tabIndex===0;
        return (
            <View style={styles.container}>
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        onPress={this.changeTab.bind(null, 0)}
                        style={[styles.tabButton, {backgroundColor: isFirstTap?CONSTANTS.THEME_COLOR:'#FFFFFF'}]}>
                        <Text style={[styles.tabText, {color:isFirstTap?'#FFFFFF':CONSTANTS.THEME_COLOR}]} >求救包</Text>
                        {isFirstTap&&<View style={[styles.makeup, {right:0}]}></View>}
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.changeTab.bind(null, 1)}
                        style={[styles.tabButton, {backgroundColor:!isFirstTap?CONSTANTS.THEME_COLOR:'#FFFFFF'}]}>
                        <Text style={[styles.tabText, {color:!isFirstTap?'#FFFFFF':CONSTANTS.THEME_COLOR}]} >急救包</Text>
                        {!isFirstTap&&<View style={[styles.makeup, {left:0}]}></View>}
                    </TouchableOpacity>
                </View>
                <View style={{flex:1}}>
                    <AidList
                        ref={(ref)=>this.aidList0 = ref}
                        disable={this.state.tabIndex!==0}
                        type={0}
                        style={isFirstTap?{flex:1}:{left:-sr.tw, top:0, position:'absolute'}}/>
                    <AidList
                        ref={(ref)=>this.aidList1 = ref}
                        disable={this.state.tabIndex!==1}
                        type={1}
                        style={isFirstTap?{left:-sr.tw, top:0, position:'absolute'}:{flex:1}}/>
                </View>
            </View>
        );
    },
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 40,
    },
    tabContainer: {
        height: 30,
        marginVertical: 20,
        marginHorizontal: 40,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: CONSTANTS.THEME_COLOR,
        flexDirection: 'row',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
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
        position: 'absolute'
    },
});
