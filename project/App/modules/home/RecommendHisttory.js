'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    Image,
    ListView,
    Text,
    TouchableHighlight,
    StyleSheet,
    View,
} = ReactNative;

var moment = require('moment');

var {Button, DImage} = COMPONENTS;

module.exports = React.createClass({
    getInitialState() {
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            dataSource: this.ds.cloneWithRows([]),
        };
    },
    componentDidMount() {
        if (this.props.briefDisplay) {
            this.setState({dataSource: this.ds.cloneWithRows(this.props.dataList)});
        } else {
            this.getRelevantVideo();
        }
    },
    getRelevantVideo() {
        var param = {
            userID:app.personal.info.userID,
            videoID: this.props.videoID,
        };
        POST(app.route.ROUTE_RELEVANT_VIDEO, param, this.doRelevantVideoSuccess,true);
    },
    doRelevantVideoSuccess(data) {
        if (data.success) {
            let list = data.context.videoList || [];
            let listData = this.props.briefDisplay&&list.length>=4?(list.slice(0,4)||[]):list;
            this.setState({dataSource: this.ds.cloneWithRows(listData)});
        }
    },
    renderSeparator(sectionID, rowID) {
        return (
            <View style={styles.separator} key={rowID}/>
        );
    },
    _onPressRow(obj) {
        this.props.doRestart(obj);
    },
    renderRow(obj) {
        var videoType = "";
        if (obj.videoType === 1) {
            videoType = "精品课程:";
        } else if (obj.videoType === 2) {
            videoType = "精彩案例:";
        } else if (obj.videoType === 3) {
            videoType = "编辑推荐:";
        } else if (obj.videoType === 4) {
            videoType = "课程亮点:";
        }
        return (
            <TouchableHighlight
                onPress={this._onPressRow.bind(null, obj)}
                style={styles.listViewItemContain}
                underlayColor="#EEB422">
                <View style={styles.itemContainer}>
                    <DImage
                        resizeMode='stretch'
                        defaultSource={app.img.common_default}
                        source={{uri: obj.videoListImg||obj.urlImg}}
                        style={styles.videoImg} />
                    <View style={styles.titleStyle}>
                        <View style={styles.rowViewStyle}>
                            <Text
                                numberOfLines={1}
                                style={styles.nameTextStyles}>
                                {videoType+obj.name}
                            </Text>
                            <Text
                                numberOfLines={2}
                                style={styles.detailTextStyles}>
                                {videoType+obj.name}
                            </Text>
                        </View>
                        <View style={styles.iconContainer}>
                            <View style={styles.praiseContainer}>
                                <DImage
                                    resizeMode='contain'
                                    source={app.img.personal_eye}
                                    style={styles.eyeIcon}/>
                                <Text style={styles.textStyle}>
                                    {obj.clicks*3+50}
                                </Text>
                                <DImage
                                    resizeMode='contain'
                                    source={!obj.isPraise?app.img.personal_praise_pressed:app.img.personal_praise}
                                    style={styles.iconStyle}/>
                                <Text style={styles.textStyle}>
                                    {obj.likes}
                                </Text>
                            </View>
                            <Text style={styles.textStyle}>
                                {moment(obj.createTime).format('YYYY/MM/DD')}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        )
    },
    render() {
        return (
            <View style={styles.container}>
                {
                    !this.props.briefDisplay&&
                    <View style={styles.line}/>
                }
                <ListView
                    initialListSize={1}
                    enableEmptySections={true}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    renderSeparator={this.renderSeparator}
                    />
            </View>
        )
    }
});

var styles = StyleSheet.create({
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
        width: sr.w-20,
        margin: 10,
    },
    videoImg: {
        width: 112,
        height: 77,
        borderRadius: 4,
        justifyContent:'flex-end',
    },
    titleStyle: {
        width: 236,
        marginLeft: 10,
        flexDirection: 'column',
    },
    rowViewStyle: {
        backgroundColor: 'transparent',
    },
    nameTextStyles: {
        color: '#252525',
        fontSize:16,
    },
    detailTextStyles: {
        marginTop: 3,
        color: '#989898',
        fontSize:12,
    },
    iconContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 236,
        height: 20,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    praiseContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    eyeIcon: {
        width: 16,
        height: 15,
        marginRight: 5,
    },
    iconStyle: {
        width: 14,
        height: 14,
        marginRight: 5,
        marginLeft: 15,
    },
    textStyle: {
        fontSize: 14,
        color: '#989898',
        fontFamily: 'STHeitiSC-Medium',
    },
    line: {
        height: 1,
        width: sr.w,
        backgroundColor: '#E0E0E0',
    },
});
