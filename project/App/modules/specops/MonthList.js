'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    View,
    Text,
    Image,
    StyleSheet,
    ListView,
    TouchableOpacity,
    TouchableHighlight,
} = ReactNative;
const moment = require('moment');
require('moment-range');
const MonthRecord = require('./MonthRecord.js');
const { STATUS_TEXT_HIDE, STATUS_START_LOAD, STATUS_HAVE_MORE, STATUS_NO_DATA, STATUS_ALL_LOADED, STATUS_LOAD_ERROR } = CONSTANTS.LISTVIEW_INFINITE.STATUS;

const MonthListRow = React.createClass({
    getInitialState () {
        return {
            showFirstDetail:true,
            showDetail:false,
        };
    },
    _onPressRow (obj, rowID) {
        rowID == 0 ? this.setState({ showFirstDetail: !this.state.showFirstDetail }) : this.setState({ showDetail: !this.state.showDetail });
        this.setState({ firstInto: false });
    },
    render () {
        const obj = this.props.obj;
        const rowID = this.props.rowID;
        return (
            <View
                underlayColor='#EEB422'>
                <TouchableOpacity
                    onPress={this._onPressRow.bind(null, obj, rowID)}
                    underlayColor='#E6EBEC'>
                    <View style={styles.rowContain}>
                        <View style={styles.rowLeft} />
                        <Text style={styles.rowMiddle}>{obj.format('YYYY年MM月工作计划')}</Text>
                        <View style={styles.rowRight}>
                            {
                                rowID == 0 ? (
                                    <Image
                                        resizeMode='contain'
                                        source={this.state.showFirstDetail ? app.img.specops_up_white : app.img.specops_down_white}
                                        style={styles.iconArrowStyle} />
                                ) : (
                                    <Image
                                        resizeMode='contain'
                                        source={this.state.showDetail ? app.img.specops_up_white : app.img.specops_down_white}
                                        style={styles.iconArrowStyle} />
                                )
                            }

                        </View>
                    </View>
                </TouchableOpacity>
                {
                    this.state.showDetail &&
                    <View style={styles.greyLine} />
                }
                {
                    rowID == 0 ? (
                        this.state.showFirstDetail &&
                        <MonthRecord time={obj} userID={this.props.userID} />
                    ) : (
                        this.state.showDetail &&
                        <MonthRecord time={obj} userID={this.props.userID} />
                    )
                }
            </View>
        );
    },
});

module.exports = React.createClass({
    mixins: [SceneMixin],
    getWeekArray (start, end) {
        const range = moment.range(start, end);
        return range.toArray('weeks');
    },
    getMonthArray (start, end) {
        const firstDay = moment(start).date(1);
        const range = moment.range(firstDay, end);
        return range.toArray('months').reverse();
    },
    getInitialState () {
        this.list = {};
        this.personRecord = {};
        this.pageNo = 1;
        this.ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged : (s1, s2) => s1 !== s2,
        });

        this.list[0] = this.props.briefDisplay && this.props.learningRecordBase != undefined && this.props.learningRecordBase.videoList != undefined ? this.props.learningRecordBase.videoList : {};
        return {
            dataSource: this.ds.cloneWithRows(this.getMonthArray(moment(app.personal.info.gotoSpecialSoldierTime, 'YYYY.MM.DD'), moment())),
            selects: {},
            infiniteLoadStatus: STATUS_TEXT_HIDE,
        };
    },
    componentDidMount () {

    },
    componentWillReceiveProps: function (nextProps) {
        const { learningRecordBase } = nextProps;
        const oldLearningRecordBase = this.props.learningRecordBase;
        if (!_.isEqual(learningRecordBase, oldLearningRecordBase)) {
            this.list[0] = this.props.briefDisplay && learningRecordBase != undefined && learningRecordBase.videoList != undefined ? learningRecordBase.videoList : {};
            this.setState({ dataSource: this.ds.cloneWithRowsAndSections(this.list) });
        }
    },
    playVideo (obj) {
        const tmp = !this.state.showDetail;
        this.setState({ showDetail:tmp });
    },
    renderRow (obj, sectionID, rowID, onRowHighlighted) {
        return (
            <MonthListRow obj={obj} rowID={rowID} userID={this.props.userID} />
        );
    },
    renderFooter () {
        return (
            <View style={styles.listFooterContainer}>
                <Text style={styles.listFooter}>{CONSTANTS.LISTVIEW_INFINITE.TEXT[this.state.infiniteLoadStatus]}</Text>
            </View>
        );
    },
    renderSeparator (sectionID, rowID) {
        return (
            <View
                style={styles.separator}
                key={rowID} />
        );
    },
    render () {
        return (
            <View style={styles.container}>
                <ListView
                    initialListSize={1}
                    onEndReachedThreshold={10}
                    enableEmptySections
                    onEndReached={this.props.briefDisplay ? null : this.onEndReached}
                    style={styles.listStyle}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    renderFooter={this.renderFooter}
                    renderSeparator={this.renderSeparator}
                    />
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listStyle: {
        marginTop:1,
        alignSelf:'stretch',
        backgroundColor: '#E6EBEC',
    },
    listFooterContainer: {
        alignItems: 'center',
    },
    listFooter: {
        marginVertical: 10,
        color: 'gray',
        fontSize: 14,
    },
    rowContain: {
        flex: 1,
        height: 44,
        flexDirection:'row',
        alignItems: 'center',
        backgroundColor: '#C8B086',
        borderColor: '#E3E3E3',
        borderBottomWidth: 1,
        borderTopWidth: 1,
    },
    separator: {
        height: 4,
        backgroundColor: '#F0EFF5',
    },
    greyLine: {
        height: 1,
        backgroundColor: '#F0EFF5',
    },
    rowLeft: {
        width:10,
        height: 44,
        backgroundColor: '#99886A',
        borderColor: '#E3E3E3',
        borderBottomWidth: 1,
        borderTopWidth: 1,
    },
    rowMiddle: {
        width: sr.w - 22,
        fontFamily:'STHeitiSC-Medium',
        fontSize:20,
        color: '#FFFFFF',
        marginLeft: 11,
    },
    rowRight: {
        flex:1,
        alignItems:'flex-end',
    },
    iconArrowStyle: {
        width: 18,
        height: 18,
        marginRight:19,
    },
});
