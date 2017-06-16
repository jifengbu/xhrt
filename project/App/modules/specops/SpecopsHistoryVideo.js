'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    Image,
    ListView,
    Text,
    TouchableHighlight,
    StyleSheet,
    View,
} = ReactNative;

const moment = require('moment');

const { Button, DImage } = COMPONENTS;

module.exports = React.createClass({
    statics: {
        leftButton: { image: app.img.common_back2, handler: () => { app.navigator.pop(); } },
    },
    getInitialState () {
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        const videoList = this.props.videoList ? this.props.videoList : [];
        this.list = this.props.briefDisplay && videoList.length >= 4 ? (videoList.slice(0, 4) || []) : videoList;
        return {
            dataSource: this.ds.cloneWithRows(this.list),
        };
    },
    renderSeparator (sectionID, rowID) {
        return (
            <View style={styles.separator} key={rowID} />
        );
    },
    _onPressRow (obj, rowID) {
        this.props.doRestart(obj, rowID, this.props.routeIndex);
    },
    renderRow (obj, sectionID, rowID) {
        let videoType = '';
        if (obj.videoType === 1) {
            videoType = '精品课程: ';
        } else if (obj.videoType === 2) {
            videoType = '精彩案例: ';
        } else if (obj.videoType === 3) {
            videoType = '编辑推荐: ';
        } else if (obj.videoType === 4) {
            videoType = '课程亮点: ';
        }
        return (
            <TouchableHighlight
                onPress={this._onPressRow.bind(null, obj, rowID)}
                style={styles.itemContainer}
                underlayColor='#EEB422'>
                <View style={styles.itemStyle}>
                    <DImage
                        resizeMode='stretch'
                        defaultSource={app.img.common_default}
                        source={{ uri: obj.videoListImg || obj.urlImg }}
                        style={styles.videoImg} />
                    <View style={styles.titleStyle}>
                        <Text
                            numberOfLines={1}
                            style={[styles.itemNameText, obj.isOver ? { color: '#151515' } : { color: '#989898' }]}>
                            {videoType + obj.name || app.login.list[0]}
                        </Text>
                        <View style={styles.iconContainer}>
                            <View style={[styles.praiseContainer, { marginLeft: 17 }]}>
                                {
                                    this.props.briefDisplay &&
                                    <DImage
                                        resizeMode='contain'
                                        source={!obj.isPraise ? app.img.personal_praise_pressed : app.img.personal_praise}
                                        style={styles.iconStyle} />
                                }
                                {
                                    this.props.briefDisplay &&
                                    <Text style={[styles.textStyle, { marginLeft: 10, marginRight: 25 }]}>
                                        {obj.likes}
                                    </Text>
                                }
                                <DImage
                                    resizeMode='contain'
                                    source={app.img.personal_eye}
                                    style={styles.eyeIcon} />
                                <Text style={[styles.textStyle, { marginLeft: 10 }]}>
                                    {obj.clicks * 3 + 50}
                                </Text>
                            </View>
                            {
                                this.props.briefDisplay ?
                                    <Text style={styles.textStyle}>
                                        {moment(obj.createTime).format('YYYY/MM/DD')}
                                    </Text> :
                                    <Text style={styles.textStyle}>
                                        {moment(obj.createTime).format('YYYY.MM.DD')}
                                    </Text>
                            }
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    },
    render () {
        const videoListLength = this.props.videoList && this.props.videoList.length;
        return (
            <View style={styles.container}>
                {
                    !this.props.briefDisplay &&
                    <View style={styles.lineView} />
                }
                {
                    videoListLength ?
                        <ListView
                            initialListSize={1}
                            removeClippedSubviews={false}
                            enableEmptySections
                            dataSource={this.state.dataSource}
                            renderRow={this.renderRow}
                            renderSeparator={this.renderSeparator}
                        />
                    : <Text style={styles.promptText}>暂无更多视频</Text>
                }
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
        width: sr.w - 20,
        marginLeft: 10,
        height: 1,
        backgroundColor: '#F1F1F1',
    },
    itemContainer: {
        backgroundColor: '#FFFFFF',
    },
    itemStyle: {
        flexDirection: 'row',
        marginVertical: 10,
    },
    videoImg: {
        width: 112,
        height: 77,
        marginLeft:12,
        borderRadius: 4,
        justifyContent:'flex-end',
    },
    titleStyle: {
        flexDirection: 'column',
        alignSelf: 'center',
    },
    itemNameText: {
        width: sr.w - 148,
        fontSize: 16,
        marginLeft: 15,
        fontFamily: 'STHeitiSC-Medium',
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
    },
    praiseContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    eyeIcon: {
        width: 16,
        height: 15,
    },
    iconStyle: {
        width: 14,
        height: 14,
    },
    textStyle: {
        fontSize: 14,
        color: '#989898',
        fontFamily: 'STHeitiSC-Medium',
    },
    lineView: {
        height: 1,
        width: sr.w,
        backgroundColor: '#EFEFEF',
    },
});
