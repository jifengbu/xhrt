'use strict';

var React = require('react');var ReactNative = require('react-native');

var {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TouchableHighlight,
    ScrollView,
} = ReactNative;

var SplashScreen = require('@remobile/react-native-splashscreen');
var SpecopsTask = require('./specopsTask');
var StudyTask = require('./studyTask');
var TrainTask = require('./trainTask');
var CommonTask = require('./commonTask');

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        title: '当前任务',
    },
    componentWillMount() {
        SplashScreen.hide();
    },
    getInitialState() {
        return {
            tabIndex: 0,
        };
    },
    changeTab(tabIndex) {
        this.setState({tabIndex});
    },
    componentDidMount: function() {
        this.changeTab(this.props.index);
    },
    render() {
        var {tabIndex} = this.state;
        var menus = ['特种兵任务', '学习任务', '训练任务', '平台任务'];
        var pages = [SpecopsTask, StudyTask, TrainTask, CommonTask];
        return (
            <View style={styles.container}>
                <View style={styles.divisionLine}></View>
                <View style={styles.tabContainer}>
                    {
                        !app.GlobalVarMgr.getItem('isFullScreen') &&
                        menus.map((item, i)=>{
                            return (
                                <TouchableHighlight
                                    key={i}
                                    underlayColor="rgba(0, 0, 0, 0)"
                                    onPress={this.changeTab.bind(null, i)}
                                    style={styles.touchTab}>
                                    <View style={styles.tabButton}>
                                        <Text style={tabIndex===i?{color:'#FC4145',fontSize: 15}:{color:'#666666',fontSize: 13}} >
                                            {item}
                                        </Text>
                                        <View style={[styles.tabLine, tabIndex===i?{backgroundColor: '#FC4145'}:null]}>
                                        </View>
                                    </View>
                                </TouchableHighlight>
                            )
                        })
                    }
                </View>
                {React.createElement(pages[tabIndex])}
            </View>
        );
    }
});


var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    tabContainer: {
        width:sr.w,
        flexDirection: 'row',
    },
    touchTab: {
        flex: 1,
        paddingTop: 20,
    },
    tabButton: {
        alignItems:'center',
        justifyContent:'center',
    },
    tabLine: {
        width: sr.w/8,
        height: 2,
        marginTop: 10,
        alignSelf: 'center',
    },
    divisionLine: {
        height: 1,
        backgroundColor: '#f4f4f4',
    },
});
