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

const { PageList, RText } = COMPONENTS;
const BusinessDetail = require('./BusinessDetail.js');

module.exports = React.createClass({
    _onPressRow (obj) {
        app.navigator.push({
            title: obj.schoolName,
            component: BusinessDetail,
            passProps: { schoolID: obj.schoolID },
        });
    },
    renderRow (obj) {
        return (
            <TouchableHighlight
                style={styles.itemContainer}
                onPress={this._onPressRow.bind(null, obj)}
                underlayColor='rgba(0, 0, 0, 0)'>
                <View style={styles.container}>
                    <View style={styles.containerTheme}>
                        <Text numberOfLines={1} style={styles.titleText}>
                            {obj.schoolName}
                        </Text>
                    </View>
                    <View style={styles.lineStyle} />
                    <View style={styles.bottomPanelStyle}>
                        <RText numberOfLines={3} style={styles.contextText}>
                            {obj.schoolIntroduction}
                        </RText>
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
                    listName='businessSchoolList'
                    renderSeparator={() => null}
                    listUrl={app.route.ROUTE_BUSINESS_SCHOOL_LIST}
                    refreshEnable
                    />
            </View>
        );
    },

});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerTheme: {
        flex: 1,
        height: 36,
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    lineStyle: {
        width: sr.w,
        height: 0.5,
        backgroundColor: 'lightgray',
    },
    bottomPanelStyle: {
        width:sr.w - 20,
        height: 63,
        marginHorizontal: 10,
        marginTop: 10,
    },
    titleText: {
        fontSize: 18,
        marginLeft: 10,
        color: CONSTANTS.THEME_COLOR,
    },
    contextText: {
        fontSize: 14,
        lineHeight: 18,
        color: '#777777',
    },
    itemContainer: {
        marginTop: 25,
        width:sr.w,
        backgroundColor: '#FFFFFF',
    },

});
