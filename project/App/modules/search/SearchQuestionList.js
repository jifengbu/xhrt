'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    Text,
    View,
    TextInput,
    Image,
    TouchableOpacity,
} = ReactNative;

const QuestionDetail = require('../specops/QuestionDetail.js');
const AidDetail = require('../actualCombat/AidDetail.js');

const { Button, PageList } = COMPONENTS;
const { STATUS_TEXT_HIDE, STATUS_ALL_LOADED } = CONSTANTS.LISTVIEW_INFINITE.STATUS;

module.exports = React.createClass({
    doShowSpecialSoldierDetail (obj) {
        app.navigator.push({
            title:'问答详情',
            component: QuestionDetail,
            passProps: { obj: obj.specialSoldier, MyQuestionType:false },
        });
    },
    doShowKitsDetail (obj) {
        app.navigator.push({
            title: this.props.type === 0 ? '求救包详情' : '急救包详情',
            component: AidDetail,
            passProps: { kitInfo: obj.kits, tabIndex: obj.type, updateAidList: () => {} },
        });
    },
    renderSpecialSoldierRow (obj, sectionID, rowID) {
        const { specialSoldier } = obj;
        return (
            <TouchableOpacity style={styles.itemContainer} onPress={this.doShowSpecialSoldierDetail.bind(null, obj)}>
                <Text style={styles.contentRow}>
                    {'特种兵：' + specialSoldier.questionContent}
                </Text>
                <View style={styles.bottomStyle}>
                    <Text numberOfLines={1} style={styles.contextText}>
                        {specialSoldier.questionTime}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    },
    renderKitsRow (obj, sectionID, rowID) {
        const { kits, type } = obj;
        return (
            <TouchableOpacity style={styles.itemContainer} onPress={this.doShowKitsDetail.bind(null, obj)}>
                <Text style={styles.contentRow}>
                    {'实战场' + (type == 0 ? ' - 求救包' : ' - 急救包') + '：' + kits.title}
                </Text>
                <View style={styles.bottomStyle}>
                    <Text numberOfLines={1} style={styles.contextText}>
                        {kits.releaseTime}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    },
    renderRow (obj, sectionID, rowID) {
        const { questionType } = obj;
        if (questionType == 1) {
            return this.renderSpecialSoldierRow(obj, sectionID, rowID);
        } else {
            return this.renderKitsRow(obj, sectionID, rowID);
        }
    },
    render () {
        const { keyword, questionList } = this.props;
        return (
            <View style={styles.container}>
                <Text style={styles.titleText}>问答</Text>
                <PageList
                    ref={listView => { this.listView = listView; }}
                    renderRow={this.renderRow}
                    listParam={{ userID: app.personal.info.userID, keyword }}
                    listName='questionList'
                    listUrl={app.route.ROUTE_SEARCH_QUESTION}
                    refreshEnable
                    autoLoad={false}
                    list={questionList}
                    pageNo={1}
                    infiniteLoadStatus={questionList.length < CONSTANTS.PER_PAGE_COUNT ? STATUS_ALL_LOADED : STATUS_TEXT_HIDE}
                    />
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    titleText: {
        fontSize: 16,
        color: '#8A8A8A',
        marginLeft: 20,
        marginTop: 20,
        marginBottom: 20,
    },
    itemContainer: {
        paddingVertical: 20,
        paddingHorizontal: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 3,
    },
    contentRow: {
        fontSize: 16,
        color: '#717273',
    },
    bottomStyle: {
        height: 30,
        justifyContent: 'center',
    },
    contextText: {
        fontSize: 11,
        marginRight: 10,
        color: 'grey',
        alignSelf:'flex-end',
    },
});
