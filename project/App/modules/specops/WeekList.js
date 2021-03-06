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
const WeekRecord = require('./WeekRecord.js');
const LocalPageList = require('./LocalPageList.js');

const weekNumArray = ['一', '二', '三', '四', '五'];
const { STATUS_TEXT_HIDE, STATUS_START_LOAD, STATUS_HAVE_MORE, STATUS_NO_DATA, STATUS_ALL_LOADED, STATUS_LOAD_ERROR } = CONSTANTS.LISTVIEW_INFINITE.STATUS;
const WeekListRow = React.createClass({
    getInitialState () {
        return {
            showFirstDetail:true,
            showDetail:false,
        };
    },
    _onPressRow (obj, rowID) {
        if (rowID == 0) {
            this.setState({ showFirstDetail: !this.state.showFirstDetail });
        }else {
            this.setState({ showDetail: !this.state.showDetail });
        }
    },
    render () {
        const obj = this.props.obj.time;
        const weekNum = this.props.obj.weekNum;
        const rowID = this.props.rowID;
        const haveImage = this.props.haveImage;
        return (
            <View
                underlayColor='#EEB422'>
                <TouchableHighlight
                    onPress={this._onPressRow.bind(null, obj, rowID)}
                    underlayColor='#E6EBEC'>
                    <View style={styles.rowContain}>
                        <View style={styles.rowLeft} />
                        <Text style={styles.rowMiddle}>{'第' + weekNumArray[weekNum] + '周' + '(' + obj.format('YYYY.MM.DD') + '-' + moment(obj).add(6, 'd').format('YYYY.MM.DD') + ')'}</Text>
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
                </TouchableHighlight>
                {
                    this.state.showDetail &&
                    <View style={styles.greyLine} />
                }
                {
                    rowID == 0?
                        this.state.showFirstDetail &&
                        <WeekRecord time={obj} haveImage={haveImage} userID={this.props.userID}/>
                    :
                        this.state.showDetail &&
                        <WeekRecord time={obj} haveImage={haveImage} userID={this.props.userID}/>
                }
            </View>
        );
    },
});
module.exports = React.createClass({
    mixins: [SceneMixin],
    getWeekArray (start, end) {
        const firstDay = moment(start).date(1);
        let firstMonday = moment(firstDay).day(1);
        if (moment(firstMonday).month() != moment(start).month()) {
            firstMonday = moment(firstDay).day(8);
        }
        const range = moment.range(firstMonday, end);
        const array = range.toArray('weeks');
        const backArray = [];
        let j = 0;
        for (let i = 0; i < array.length; i++) {
            let tmp = {};
            if (moment(array[i]).subtract(28, 'days').month() == moment(array[i]).month()) {
                tmp = {
                    weekNum:4,
                    time:array[i],
                };
            } else {
                tmp = {
                    weekNum:j,
                    time:array[i],
                };
                j == 3 ? j = 0 : j++;
            }
            backArray.push(tmp);
        }
        return backArray.reverse();
    },
    getMonthArray (start, end) {
        const range = moment.range(start, end);
        return range.toArray('months');
    },
    getInitialState () {
        this.dataList = this.getWeekArray(moment(app.personal.info.gotoSpecialSoldierTime, 'YYYY.MM.DD'), moment())
        return {
            selects: {},
        };
    },
    renderRow(obj, sectionID, rowID){
        return (
            <WeekListRow obj={obj} rowID={rowID} haveImage={this.props.haveImage} userID={this.props.userID} />
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
                <LocalPageList
                    list={this.dataList}
                    pageCount={15}
                    renderRow={this.renderRow}
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
        height: 44,
        alignItems: 'center',
        flexDirection:'row',
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
