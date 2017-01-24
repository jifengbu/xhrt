'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    TouchableHighlight,
} = ReactNative;

var {PageList} = COMPONENTS;
var TaskDetail = require('./taskDetail.js');

module.exports = React.createClass({
    getInitialState (){
        return {
            rowHeight: 0,
            isFirst: 0,
        };
    },
    _onPressRow(obj) {
        app.navigator.push({
            title: obj.authorName,
            component: TaskDetail,
            passProps: {homeworkDetail: obj,courseObj:this.props.ProObj},
        });
    },
    renderSeparator(sectionID, rowID) {
          return (
              <View
                  style={styles.separator}
                  key={rowID}/>
          );
      },
    renderRow(obj) {
        return (
            <TouchableOpacity
                style={styles.itemContainer}
                onPress={this._onPressRow.bind(null, obj)}
                underlayColor="#EEB422">
                <View style={styles.itemTopContainer}>
                    <Text
                        style={styles.TextLeft}>
                        {obj.authorName}
                    </Text>
                    <View style={styles.companyView}>
                        <Text numberOfLines={1} style={[styles.TextRight, {alignSelf: 'flex-end'}]}>
                            {obj.authorCompany}
                        </Text>
                    </View>
                </View>
                <Text
                    style={styles.TextRight}>
                    {obj.authorPosition}
                </Text>
                <View style={styles.lineView}></View>
                <View style={styles.itemMidContainer}>
                    <Text
                        numberOfLines={3}
                        style={styles.Textstyle}>
                        {obj.homeworkDetail}
                    </Text>
                </View>
                <View style={styles.itemBottomContainer}>
                    <View style={styles.itemBottomView}>
                        <Image
                            source={app.img.excellentWorks_timeto}
                            style={styles.iconStyle}>
                        </Image>
                        <Text style={styles.TextBottomLeft}>{obj.homeworkSubmitTime}</Text>
                    </View>

                    <View style={styles.itemBottomView}>
                        <Image
                            source={app.img.excellentWorks_praise_off}
                            style={styles.iconStyle}>
                        </Image>
                        <Text style={styles.TextBottomRight}>{obj.praise}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    },
    render() {
        return (
            <View style={styles.container}>
                <PageList
                    ref={listView=>this.listView=listView}
                    style={styles.list}
                    renderRow={this.renderRow}
                    listName="homeworkList"
                    renderSeparator={this.renderSeparator}
                    listParam={{courseId: this.props.ProObj.id,userID: app.personal.info.userID}}
                    listUrl={app.route.ROUTE_GET_EXCELLENT_HOME_WORK_LIST}
                    refreshEnable={true}
                    />
            </View>
        )
    }

});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#EEEEEE',
    },
    dateContainer: {
        height: 20,
        alignItems: 'center',
        marginRight: 10,
        justifyContent: 'flex-end',
        flexDirection: 'row',
        marginBottom: 5,
    },
    Textstyle: {
        fontSize: 13,
        marginVertical: 2,
        color: '#555555',
        fontWeight: '400',
    },
    TextTime: {
        fontSize: 16,
        color: '#D8B86C',
        textAlign: 'right',
    },
    TextTitle: {
        fontSize: 16,
        marginHorizontal: 5,
        color: 'gray',
    },
    itemContainer: {
        width:sr.w,
        backgroundColor: '#FFFFFF',
    },
    itemTopContainer: {
        height: 20,
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginHorizontal:10,
        marginTop: 10,
        alignItems: 'center',
    },
    itemMidContainer: {
        width:sr.w-20,
        marginTop: 10,
        marginHorizontal: 10,
    },
    itemBottomContainer: {
        marginRight: 10,
        flexDirection: 'row',
        marginVertical: 12,
        marginHorizontal: 10,
        justifyContent: 'space-between',
    },
    itemBottomView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    TextLeft: {
        fontSize: 13,
        color: '#666666',
        textAlign: 'left',
        fontWeight: '500',
    },
    TextBottomLeft: {
        fontSize: 13,
        fontWeight: '500',
        color: 'gray',
        marginLeft:5,
        textAlign: 'left',
    },
    companyView: {
        width: sr.w*3/4,
    },
    TextRight: {
        fontSize: 12,
        color: '#999999',
        fontWeight: '500',
        marginLeft: 10,
    },
    lineView: {
        width: sr.w-20,
        height: 1,
        alignSelf: 'center',
        marginTop: 5,
        backgroundColor: '#EEEEEE',
    },
    TextBottomRight: {
        fontSize: 13,
        color: 'gray',
        marginHorizontal:10,
        textAlign: 'right',
    },
    separator: {
          backgroundColor: '#EEEEEE',
          height: 10,
      },
    iconStyle: {
        height: 15,
        width: 15,
    },
});
