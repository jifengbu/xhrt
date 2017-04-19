'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableHighlight,
} = ReactNative;

module.exports = React.createClass({
    statics: {
        leftButton: { image: app.img.common_back2, handler: () => { app.navigator.pop(); } },
    },
    getInitialState () {
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.list = this.props.list || [];
        return {
            dataSource: this.ds.cloneWithRows(this.list),
        };
    },
    componentDidMount () {
        this.getList();
    },
    selectPosition (obj) {
        this.props.getPosition(obj.industryName);
        app.navigator.pop();
    },
    getList () {
        const param = {
            userID: app.personal.info.userID,
        };
        POST(app.route.ROUTE_GET_INDUSTRY, param, this.getListSuccess);
    },
    getListSuccess (data) {
        if (data.success) {
            const list = data.context.industryAll;
            this.list = this.list.concat(list);
            this.setState({
                dataSource: this.ds.cloneWithRows(this.list),
            });
        }
    },
    renderRow (obj, sectionID, rowID) {
        return (
            <TouchableHighlight
                style={styles.itemContainer}
                onPress={this.selectPosition.bind(null, obj)}
                underlayColor='#EEB422'>
                <View style={styles.rowContainer}>
                    <Text style={[styles.labelText, { backgroundColor: obj.colorCode }]}>{obj.industryType}</Text>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>{obj.industryName}</Text>
                    </View>
                    <View style={styles.lineContainer} />
                </View>
            </TouchableHighlight>
        );
    },
    render () {
        return (
            <View style={styles.container}>
                <ListView
                    ref={listView => { this.listView = listView; }}
                    renderRow={this.renderRow}
                    enableEmptySections
                    dataSource={this.state.dataSource}
                    />
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    itemContainer: {
        height: 43,
        backgroundColor: '#FFFFFF',
    },
    rowContainer: {
        height: 43,
        flexDirection: 'row',
        alignItems:'center',
    },
    textContainer: {
        height: 43,
        width: 325,
        justifyContent: 'center',
    },
    labelText: {
        fontSize: 12,
        width: 35,
        marginLeft: 11,
        marginRight: 5,
        paddingTop: 0,
        textAlign: 'center',
        fontFamily: 'STHeitiSC-Medium',
        color: '#FFFFFF',
        borderRadius: 2,
    },
    textStyle: {
        fontSize: 16,
        fontFamily: 'STHeitiSC-Medium',
        color: '#151515',
    },
    lineContainer: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        height: 1,
        width: 325,
        backgroundColor: '#E8E8E8',
    },

});
