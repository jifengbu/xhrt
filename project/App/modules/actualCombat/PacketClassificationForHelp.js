'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    TouchableHighlight,
} = ReactNative;

const AidKitManagement = require('./AidKitManagement.js');
const PackageManagementForHelp = require('./PackageManagementForHelp.js');
const CaseList = require('./CaseList.js');
const { PageList } = COMPONENTS;
const Button = require('@remobile/react-native-simple-button');
const SplashScreen = require('@remobile/react-native-splashscreen');

module.exports = React.createClass({
    componentWillMount () {
        SplashScreen.hide();
    },
    _onPressRow () {
        app.navigator.push({
            title: '求救包管理',
            component: AidKitManagement,
            passProps: { tabIndex: this.props.tabIndex },
        });
    },
    goSendMadKit () {
        app.navigator.pop();
    },
    changeTab (tabIndex) {
        this.setState({ tabIndex });
    },
    getInitialState () {
        return {
            tabIndex: 0,
        };
    },
    render () {
        const isFirstTap = this.state.tabIndex === 0;
        return (
            <View style={this.props.style}>
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        onPress={this.changeTab.bind(null, 0)}
                        style={[styles.tabButton, isFirstTap ? { backgroundColor:CONSTANTS.THEME_COLOR } : { backgroundColor:'#D5D5D7' }]}>
                        <Text style={[styles.tabText, { color:isFirstTap ? '#FFFFFF' : CONSTANTS.THEME_COLOR }]} >发布的</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.changeTab.bind(null, 1)}
                        style={[styles.tabButton, !isFirstTap ? { backgroundColor:CONSTANTS.THEME_COLOR } : { backgroundColor:'#D5D5D7' }]}>
                        <Text style={[styles.tabText, { color:!isFirstTap ? '#FFFFFF' : CONSTANTS.THEME_COLOR }]} >参与的</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.makeup}>
                    <PackageManagementForHelp
                        tabIndex={0}
                        disable={this.props.disable || this.state.tabIndex !== 0}
                        style={isFirstTap ? { flex:1 } : { left:-sr.tw, top:0, position:'absolute' }} />
                    <CaseList
                        tabIndex={1}
                        disable={this.props.disable || this.state.tabIndex !== 1}
                        style={isFirstTap ? { left:-sr.tw, top:0, position:'absolute' } : { flex:1 }} />
                </View>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 2,
        backgroundColor: '#EEEEEE',
        justifyContent: 'space-around',
    },
    tabContainer: {
        height: 60,
        marginTop: 20,
        marginLeft:20,
        width: 140,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    textTitle: {
        flex:4,
        fontSize: 14,
        color :'#4FC1E9',
        marginTop:5,
        marginHorizontal:7,
    },
    textTitle2: {
        flex:3,
        fontSize: 16,
        textAlign: 'left',
        alignSelf:'flex-start',
        marginHorizontal:5,
        marginVertical:1,
    },
    textTitle3: {
        fontSize: 15,
        marginHorizontal:15,
        textAlign: 'left',
        marginVertical:5,
        height:23,
    },
    textTitle4: {
        flex:1,
        fontSize: 14,
        color :'red',
        alignSelf: 'center',
    },
    tabButton: {
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:35,
        borderWidth: 0.1,
        borderColor: '#EEEEEE',
        marginHorizontal:5,
    },
    tabText: {
        fontSize: 16,
    },
    makeup: {
        flex:3,
        backgroundColor:'#f5f5f5',
        top: 0,
        width:sr.w,
        height:sr.h / 5 * 4,
        marginTop:60,
        marginHorizontal:0,
        position: 'absolute',
    },
});
