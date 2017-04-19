'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    ScrollView,
    Text,
    Image,
    TouchableHighlight,
    TouchableOpacity,
} = ReactNative;

const Player = require('./Player.js');
const { DImage, Button, PageList } = COMPONENTS;

const PlayerItem = React.createClass({
    render () {
        const { video, img } = this.props.data;
        return (
            this.props.playing ?
                <Player uri={video} />
            :
                <DImage
                    resizeMode='stretch'
                    defaultSource={app.img.common_default}
                    source={{ uri: img }}
                    style={styles.playerContainer}>
                    <TouchableOpacity
                        style={styles.video_icon_container}
                        onPress={this.props.onPress}>
                        <Image
                            resizeMode='stretch'
                            source={app.img.play_play}
                            style={styles.video_icon} />
                    </TouchableOpacity>
                </DImage>
        );
    },
});

module.exports = React.createClass({
    getInitialState () {
        return {
            tabIndex: 0,
            commentDetail: { favorableRate: 0, totalComment:0 },
            playingIndex: -1,
        };
    },
    changeTab (tabIndex) {
        this.setState({ tabIndex });
    },
    GoodsIntroduce () {
        const { videoArray, infoImageArray } = this.props.goodsDetail;
        const { videoDesc, videoRecommend } = videoArray;
        return (
            <View style={styles.container}>
                {
                    !!videoDesc.video && [
                        <PlayerItem
                            key={1}
                            playing={this.state.playingIndex === 0}
                            onPress={() => { this.setState({ playingIndex: 0 }); }}
                            data={videoDesc} />,
                        <View key={2} style={styles.separator} />,
                    ]
                }
                {
                    !!videoRecommend.video && [
                        <PlayerItem
                            key={1}
                            playing={this.state.playingIndex === 1}
                            onPress={() => { this.setState({ playingIndex: 1 }); }}
                            data={videoRecommend} />,
                        <View key={2} style={styles.separator} />,
                    ]
                }
                {
                    infoImageArray.map((item, i) => {
                        return (
                            <Image
                                key={i}
                                resizeMode='stretch'
                                source={{ uri: item }}
                                defaultSource={app.img.common_default}
                                style={styles.pictureStyle} />
                        );
                    })
                }
            </View>
        );
    },
    onGetList (data, pageNo) {
        if (data.success && pageNo === 1) {
            this.setState({ commentDetail: data.context });
        }
    },
    GoodsComment () {
        const { commentDetail } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    <View style={styles.commentContainer}>
                        <Text style={[styles.titleText, { color: '#666666' }]}>
                            {'好评度'}
                        </Text>
                        <Text style={[styles.titleText, { color:'#ff3c30' }]}>
                            {commentDetail.favorableRate}
                        </Text>
                        <Text style={[styles.titleText, { color: '#666666' }]}>
                            {'共' + commentDetail.totalComment + '条评论'}
                        </Text>
                    </View>
                    <PageList
                        renderRow={this.renderRow}
                        listParam={{ goodsID: this.props.goodsID }}
                        listName='commentList'
                        listUrl={app.route.ROUTE_GET_GOODS_COMMENT}
                        ListFailedText='暂无评论!'
                        onGetList={this.onGetList}
                        />
                </View>
            </View>
        );
    },
    renderRow (obj) {
        const startNum = Math.round(obj.startNum);
        const starImage = _.fill(Array(startNum), app.img.mall_commodity_review_icon);
        return (
            <View style={styles.itemContainer}>
                <View style={styles.topContainer}>
                    <View style={styles.scoreSytle}>
                        {
                            starImage.map((item, i) => {
                                return (
                                    <Image
                                        key={i}
                                        resizeMode='stretch'
                                        source={item}
                                        style={styles.starImageStyle}
                                        />
                                );
                            })
                        }
                    </View>
                    <View style={styles.titleStyle}>
                        <Text
                            style={styles.textStyle}>
                            {obj.userName}
                        </Text>
                        <Text style={[styles.textStyle, { marginLeft: 10 }]}>
                            {obj.commentTime}
                        </Text>
                    </View>
                </View>
                <Text
                    style={styles.contentTextStyle}>
                    {obj.comment}
                </Text>
                <View style={{ flexDirection: 'row' }}>
                    {
                        obj.imageArray.map((item, i) => {
                            return (
                                <TouchableHighlight key={i} underlayColor='rgba(0, 0, 0, 0)' onPress={this.props.noticeShow.bind(null, obj.imageArray, i)} style={styles.bigImageTouch}>
                                    <Image
                                        resizeMode='contain'
                                        defaultSource={app.img.common_default}
                                        source={{ uri:item }}
                                        style={styles.commentImageStyle} />
                                </TouchableHighlight>
                            );
                        })
                    }
                </View>
            </View>
        );
    },
    render () {
        return (
            <View style={styles.container}>
                {
                    this.props.tabIndex === 1 ?
                        <this.GoodsComment /> :
                        <this.GoodsIntroduce />
                }
            </View>
        );
    },
});

const NORMAL_WIDTH = sr.w;
const NORMAL_HEIGHT = NORMAL_WIDTH * 2 / 3;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    changeTabContainer: {
        height: 40,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    tabButtonLeft: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
    },
    tabButtonCenter: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
    },
    tabText: {
        fontSize: 16,
    },
    playerContainer: {
        width: NORMAL_WIDTH,
        height: NORMAL_HEIGHT,
        justifyContent: 'center',
        alignItems:'center',
    },
    video_icon_container: {
        height: 80,
        width: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems:'center',
    },
    video_icon: {
        height: 40,
        width: 40,
    },
    pictureStyle: {
        width: sr.w,
        height: 200,
        alignSelf: 'center',
    },
    separator: {
        height: 1,
        width: sr.w,
        marginVertical: 5,
        backgroundColor: '#b4b4b4',
    },
    commentContainer: {
        width: sr.w - 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 14,
        marginLeft: 5,
    },
    itemContainer: {
        flex: 1,
    },
    topContainer: {
        flexDirection: 'row',
        flex: 1,
        marginHorizontal: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scoreSytle: {
        flexDirection: 'row',
        flex: 1,
        width: 60,
        height: 10,
        marginTop: 10,
        alignSelf: 'flex-start',
    },
    titleStyle: {
        flex: 1,
        marginRight: 8,
        marginTop: 10,
        flexDirection: 'row',
        alignSelf: 'flex-end',
    },
    textStyle: {
        alignSelf: 'center',
        fontSize: 12,
    },
    contentTextStyle: {
        fontSize: 14,
        marginHorizontal: 6,
    },
    bigImageTouch: {
        marginVertical: 10,
        flexDirection: 'row',
        width: 50,
        height: 50,
        marginHorizontal: 8,
    },
    starImageStyle: {
        width: 10,
        height: 10,
        alignSelf: 'center',
    },
    commentImageStyle: {
        width: 50,
        height: 50,
        marginRight: 8,
    },
});
