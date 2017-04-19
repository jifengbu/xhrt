'use strict';

const React = require('react');const ReactNative = require('react-native');

const {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TouchableHighlight,
    ScrollView,
} = ReactNative;

const SplashScreen = require('@remobile/react-native-splashscreen');
const SpecopsTask = require('./specopsTask');
const StudyTask = require('./studyTask');
const TrainTask = require('./trainTask');
const CommonTask = require('./commonTask');

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        title: '当前任务',
    },
    componentWillMount () {
        SplashScreen.hide();
    },
    getInitialState () {
        return {
            tabIndex: 0,
        };
    },
    changeTab (tabIndex) {
        this.setState({ tabIndex });
    },
    componentDidMount: function () {
        this.changeTab(this.props.index);
    },
    render () {
        const { tabIndex } = this.state;
        const menus = ['特种兵任务', '学习任务', '训练任务', '平台任务'];
        const pages = [SpecopsTask, StudyTask, TrainTask, CommonTask];
        return (
            <View style={styles.container}>
                <View style={styles.divisionLine} />
                <View style={styles.tabContainer}>
                    {
                        !app.GlobalVarMgr.getItem('isFullScreen') &&
                        menus.map((item, i) => {
                            return (
                                <TouchableHighlight
                                    key={i}
                                    underlayColor='rgba(0, 0, 0, 0)'
                                    onPress={this.changeTab.bind(null, i)}
                                    style={styles.touchTab}>
                                    <View style={styles.tabButton}>
                                        <Text style={tabIndex === i ? { color:'#FC4145', fontSize: 15 } : { color:'#666666', fontSize: 13 }} >
                                            {item}
                                        </Text>
                                        <View style={[styles.tabLine, tabIndex === i ? { backgroundColor: '#FC4145' } : null]} />
                                    </View>
                                </TouchableHighlight>
                            );
                        })
                    }
                </View>
                {React.createElement(pages[tabIndex])}
            </View>
        );
    },
});

const styles = StyleSheet.create({
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
        width: sr.w / 8,
        height: 2,
        marginTop: 10,
        alignSelf: 'center',
    },
    divisionLine: {
        height: 1,
        backgroundColor: '#f4f4f4',
    },
});
