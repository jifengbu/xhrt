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

var {Button} = COMPONENTS;

module.exports = React.createClass({
    getInitialState() {
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            dataSource: this.ds.cloneWithRows([]),
            listData: [],
            personinfo: app.personal.info,
            videoInfo: this.props.data,
        };
    },
    componentDidMount() {
        this.getRelevantVideo();
    },
    renderSeparator(sectionID, rowID) {
        return (
            <View style={styles.separator} key={rowID}/>
        );
    },
    _onPressRow(obj) {
        this.props.doRestart(obj);
    },
    getRelevantVideo() {
        var param = {
            userID:this.state.personinfo.userID,
            videoID: this.state.videoInfo.videoID,
        };
        POST(app.route.ROUTE_RELEVANT_VIDEO, param, this.doRelevantVideoSuccess);
    },
    doRelevantVideoSuccess(data) {
        if (data.success) {
            let videoList = data.context.videoList||[];
            this.setState({listData: videoList, dataSource: this.ds.cloneWithRows(videoList)});
        }
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
                underlayColor="#EEB422">
                <View style={styles.ItemContainer}>
                    <Image
                        resizeMode='stretch'
                        defaultSource={app.img.common_default}
                        source={{uri: obj.videoListImg||obj.urlImg}}
                        style={styles.icon_item}>
                        <Text style={styles.timeText}>{obj.length}</Text>
                    </Image>
                    <View style={styles.titleStyle}>
                        <Text
                            numberOfLines={1}
                            style={styles.itemNameText}>
                            {videoType}
                            {'  '+obj.name||app.login.list[0]}
                        </Text>
                        <Text style={styles.itemContentText}>
                            播放次数:{'\t'}{obj.clicks*3+50}次
                        </Text>
                    </View>
                </View>
            </TouchableHighlight>
        )
    },
    render() {
        return (
            <View style={styles.listContainer}>
                <Text style={styles.titleTypeText}>相关视频推荐</Text>
                <View style={styles.separator}/>
                <View style={styles.container}>
                    <ListView
                        initialListSize={1}
                        enableEmptySections={true}
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow}
                        renderSeparator={this.renderSeparator}
                        />
                </View>
            </View>
        )
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContainer: {
        width:sr.w,
        marginTop: 20,
        backgroundColor: '#FFFFFF',
    },
    titleTypeText: {
        marginTop: 5,
        fontSize: 12,
        marginLeft: 8,
        color: '#555555',
        paddingBottom: 6,
        paddingTop: 12,
    },
    separator: {
        height: 1,
        backgroundColor: '#EEEEEE'
    },
    ItemContainer: {
        flexDirection: 'row',
        paddingVertical: 12,
    },
    icon_item: {
        width: 90,
        height: 68,
        marginLeft:8,
        justifyContent:'flex-end',
    },
    titleStyle: {
        marginLeft: 15,
        flexDirection: 'column',
        alignSelf: 'center',
    },
    itemNameText: {
        width: 240,
        fontSize: 14,
        color: '#555555'
    },
    itemContentText: {
        marginTop: 5,
        fontSize: 12,
        color: 'gray',
    },
    timeText: {
        alignSelf:'flex-end',
        color: 'white',
        fontSize: 12,
        marginRight: 3,
    },
});