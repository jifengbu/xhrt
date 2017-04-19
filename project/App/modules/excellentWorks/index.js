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

const { PageList } = COMPONENTS;
const excellentDetail = require('./excellentDetail.js');
const array = ['一阶', '二阶', '三阶'];

module.exports = React.createClass({
    statics: {
        title: '优秀作业',
    },
    getInitialState () {
        return {
            rowHeight: 0,
            isFirst: 0,
        };
    },
    _onPressRow (obj) {
        app.navigator.push({
            title: obj.courseName,
            component: excellentDetail,
            passProps: { ProObj: obj },
        });
    },
    renderSeparator (sectionID, rowID) {
        return (
            <View
                style={styles.separator}
                key={rowID} />
        );
    },
    renderRow (obj) {
        return (
            <TouchableHighlight
                style={styles.itemContainer}
                onPress={this._onPressRow.bind(null, obj)}
                underlayColor='#EEB422'>
                <View style={styles.container}>
                    <View>
                        <Text
                            style={styles.Textstyle}>
                            {'[ ' + array[obj.courseType - 1] + ' ]  ' + obj.address}
                        </Text>
                    </View>
                    <View style={styles.dateContainer}>
                        <Text style={styles.TextTime}>
                            {obj.courseStartTime}
                        </Text>
                        <Text style={styles.TextTitle}>至
                        </Text>
                        <Text style={styles.TextTime}>
                            {obj.courseEndTime}
                        </Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    },
    render () {
        return (
            <View style={styles.container}>
                <PageList
                    ref={listView => { this.listView = listView; }}
                    style={styles.list}
                    renderRow={this.renderRow}
                    listName='courseList'
                    renderSeparator={this.renderSeparator}
                    listParam={{ type: 0, userID: app.personal.info.userID }}
                    listUrl={app.route.ROUTE_GET_COURSE_LIST}
                    refreshEnable
                    />
            </View>
        );
    },

});

const styles = StyleSheet.create({
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
        fontSize: 17,
        marginLeft: 6,
        marginVertical: 5,
        color: '#555555',
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
        backgroundColor: 'white',
    },
    separator: {
        backgroundColor: '#cccccc',
        height: 1,
    },
});
