'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    Image,
    ListView,
    Text,
    TouchableHighlight,
    StyleSheet,
    View,
} = ReactNative;

const { Button, DImage } = COMPONENTS;

module.exports = React.createClass({
    getInitialState () {
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return {
            dataSource: this.ds.cloneWithRows([]),
        };
    },
    componentDidMount () {
        if (this.props.briefDisplay) {
            this.setState({ dataSource: this.ds.cloneWithRows(this.props.dataList) });
        } else {
            this.getRelevantVideo();
        }
    },
    getRelevantVideo () {
        const param = {
            userID:app.personal.info.userID,
            videoID: this.props.videoID,
        };
        POST(app.route.ROUTE_RELEVANT_VIDEO, param, this.doRelevantVideoSuccess, true);
    },
    doRelevantVideoSuccess (data) {
        if (data.success) {
            const list = data.context.videoList || [];
            const listData = this.props.briefDisplay && list.length >= 4 ? (list.slice(0, 4) || []) : list;
            this.setState({ dataSource: this.ds.cloneWithRows(listData) });
        }
    },
    renderSeparator (sectionID, rowID) {
        return (
            <View style={styles.separator} key={rowID} />
        );
    },
    _onPressRow (obj) {
        this.props.doRestart(obj);
    },
    renderRow (obj) {
        return (
            <TouchableHighlight
                onPress={this._onPressRow.bind(null, obj)}
                style={styles.listViewItemContain}
                underlayColor='#EEB422'>
                <View style={styles.itemContainer}>
                    <DImage
                        resizeMode='stretch'
                        defaultSource={app.img.common_default}
                        source={{ uri: obj.videoListImg || obj.urlImg }}
                        style={styles.videoImg} />
                    <View style={styles.titleStyle}>
                        <View style={styles.rowViewStyle}>
                            <Text
                                numberOfLines={2}
                                style={styles.nameTextStyles}>
                                { obj.name}
                            </Text>
                            <Text
                                numberOfLines={1}
                                style={styles.detailTextStyles}>
                                {obj.detail}
                            </Text>
                        </View>
                        <View style={styles.iconContainer}>
                            <View style={styles.praiseContainer}>
                                <Image
                                    resizeMode='contain'
                                    source={app.img.home_icon_specops}
                                    style={styles.iconSpecops} />
                            </View>
                            <Text style={[styles.playTimesText,{color: '#FFB235'}]}>
                                {obj.clicks * 3 + 50}
                                <Text style={[styles.playTimesText,{color: '#979797'}]}>
                                    {'人正在学习'}
                                </Text>
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    },
    render () {
        return (
            <View style={styles.container}>
                {
                    !this.props.briefDisplay &&
                    <View style={styles.line} />
                }
                <ListView
                    initialListSize={1}
                    enableEmptySections
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    renderSeparator={this.renderSeparator}
                    />
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    promptText: {
        fontSize: 16,
        color: '#989898',
        marginVertical: 20,
        alignSelf: 'center',
    },
    separator: {
        height: 1,
        backgroundColor: '#F1F1F1',
    },
    listViewItemContain: {
        flexDirection: 'row',
        width: sr.w,
        paddingVertical: 2,
    },
    itemContainer: {
        flexDirection: 'row',
        width: sr.w - 20,
        margin: 10,
    },
    videoImg: {
        width: 125,
        height: 85,
        justifyContent:'flex-end',
    },
    titleStyle: {
        width: 220,
        marginLeft: 10,
    },
    rowViewStyle: {
        backgroundColor: 'transparent',
    },
    nameTextStyles: {
        color: '#383838',
        fontSize:14,
    },
    detailTextStyles: {
        marginTop: 10,
        color: '#AFAFAF',
        fontSize:12,
    },
    iconContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 220,
        height: 20,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    praiseContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    playTimesText: {
        fontSize: 11,
    },
    line: {
        height: 1,
        width: sr.w,
        backgroundColor: '#E0E0E0',
    },
    iconSpecops: {
        width: 55,
        height: 17,
    },
});
