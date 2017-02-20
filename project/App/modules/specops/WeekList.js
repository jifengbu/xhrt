'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    View,
    Text,
    Image,
    StyleSheet,
    ListView,
    TouchableOpacity,
    TouchableHighlight,
} = ReactNative;
var moment = require('moment');
require('moment-range');
var WeekRecord = require('./WeekRecord.js');

const weekNumArray = ['一','二','三','四','五'];
const {STATUS_TEXT_HIDE, STATUS_START_LOAD, STATUS_HAVE_MORE, STATUS_NO_DATA, STATUS_ALL_LOADED, STATUS_LOAD_ERROR} = CONSTANTS.LISTVIEW_INFINITE.STATUS;
var WeekListRow = React.createClass({
    getInitialState() {
        return {
            showFirstDetail:true,
            showDetail:false,
        };
    },
    _onPressRow(obj,rowID) {
        rowID==0?this.setState({showFirstDetail: !this.state.showFirstDetail}):this.setState({showDetail: !this.state.showDetail});
        this.setState({firstInto: false});
    },
    render() {
        var obj = this.props.obj.time;
        var weekNum = this.props.obj.weekNum;
        var rowID = this.props.rowID;
        return (
            <View
                underlayColor="#EEB422">
                <TouchableHighlight
                    onPress={this._onPressRow.bind(null, obj,rowID)}
                    underlayColor="#E6EBEC">
                    <View style={styles.rowContain}>
                        <View style={styles.rowLeft}/>
                        <Text style={styles.rowMiddle}>{'第'+weekNumArray[weekNum] +'周'+'('+obj.format('YYYY.MM.DD')+'-'+moment(obj).add(6, 'd').format('YYYY.MM.DD')+')'}</Text>
                        <View  style={styles.rowRight}>
                            {
                                rowID==0?(
                                    <Image
                                        resizeMode='contain'
                                        source={this.state.showFirstDetail?app.img.specops_up_white:app.img.specops_down_white}
                                        style={styles.iconArrowStyle}>
                                    </Image>
                                ):(
                                    <Image
                                        resizeMode='contain'
                                        source={this.state.showDetail?app.img.specops_up_white:app.img.specops_down_white}
                                        style={styles.iconArrowStyle}>
                                    </Image>
                                )
                            }
                        </View>
                    </View>
                </TouchableHighlight>
                {
                    this.state.showDetail&&
                    <View style={styles.greyLine}/>
                }
                {
                    rowID==0?(
                        this.state.showFirstDetail &&
                        <WeekRecord time = {obj}/>
                    ):(
                        this.state.showDetail &&
                        <WeekRecord time = {obj}/>
                    )
                }
            </View>
        );
    },
});
module.exports = React.createClass({
    mixins: [SceneMixin],
    getWeekArray(start,end){
        var firstDay = moment(start).date(1)
        var firstMonday = moment(firstDay).day(1);
        if (moment(firstMonday).month() != moment(start).month()) {
            firstMonday = moment(firstDay).day(8);
        }
        var range = moment.range(firstMonday, end);
        var array = range.toArray('weeks');
        var backArray = []
        var j=0;
        for (var i = 0; i < array.length; i++) {
            var tmp = {};
            if(moment(array[i]).subtract(28, 'days').month() == moment(array[i]).month()){
                tmp = {
                    weekNum:4,
                    time:array[i]
                }
            } else {
                tmp = {
                    weekNum:j,
                    time:array[i]
                }
                j==3?j=0:j++;
            }
            backArray.push(tmp);
        }
        return backArray.reverse();
    },
    getMonthArray(start,end){
        var range = moment.range(start, end);
        return range.toArray('months');
    },
    getInitialState() {
        this.list = {};
        this.personRecord = {};
        this.pageNo = 1;
        this.ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged : (s1, s2) => s1 !== s2
        });

        this.list[0] = this.props.briefDisplay&&this.props.learningRecordBase!=undefined&&this.props.learningRecordBase.videoList!=undefined?this.props.learningRecordBase.videoList:{};
        return {
            dataSource: this.ds.cloneWithRows(this.getWeekArray(moment(app.personal.info.gotoSpecialSoldierTime,"YYYY.MM.DD"),moment())),
            selects: {},
            infiniteLoadStatus: STATUS_TEXT_HIDE,
        };
    },
    componentDidMount() {

    },
    componentWillReceiveProps: function(nextProps) {
        const {learningRecordBase} = nextProps;
        const oldLearningRecordBase = this.props.learningRecordBase;
        if (!_.isEqual(learningRecordBase, oldLearningRecordBase)) {
            this.list[0] = this.props.briefDisplay&&learningRecordBase!=undefined&&learningRecordBase.videoList!=undefined?learningRecordBase.videoList:{};
            this.setState({dataSource: this.ds.cloneWithRowsAndSections(this.list)});
        }
    },
    playVideo(obj) {

    },
    renderRow(obj, sectionID, rowID, onRowHighlighted) {
        return (
            <WeekListRow obj = {obj} rowID = {rowID}/>
        )
    },
    renderFooter() {
        return (
            <View style={styles.listFooterContainer}>
                <Text style={styles.listFooter}>{CONSTANTS.LISTVIEW_INFINITE.TEXT[this.state.infiniteLoadStatus]}</Text>
            </View>
        )
    },
    renderSeparator(sectionID, rowID) {
        return (
            <View
                style={styles.separator}
                key={rowID}/>
        );
    },
    render() {
        return (
            <View style={styles.container}>
                <ListView
                    initialListSize={1}
                    onEndReachedThreshold={10}
                    enableEmptySections={true}
                    onEndReached={this.props.briefDisplay?null:this.onEndReached}
                    style={styles.listStyle}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    renderFooter={this.renderFooter}
                    renderSeparator={this.renderSeparator}
                    />
            </View>
        )
    },
});


var styles = StyleSheet.create({
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
        width: sr.w-22,
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
