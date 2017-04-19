'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    ListView,
    TouchableHighlight,
} = ReactNative;

module.exports = React.createClass({
    getInitialState () {
        this.isClick = false;
        this.currentVideoId = '';
        return {
            tabIndexID: 0,
            tabIndex: 0,
            workDetail: null,
        };
    },
    changeTab (tabIndex) {
        this.isClick = true;
        this.setState({ tabIndex });
    },
    getSections (dataDetail) {
        const sections = [];
        if (dataDetail && dataDetail.otherVideo) {
            const { otherVideo, quarterlySeries } = dataDetail;
            const sectionLength = Math.ceil(otherVideo.length / quarterlySeries);
            const letters = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
            let startNum = 1;
            let endNum = 1;
            for (let i = 0; i < sectionLength; i++) {
                endNum = startNum + quarterlySeries - 1;
                sections.push({
                    title: '第' + app.utils.chineseNumber(i + 1) + '季(' + app.utils.numberFormat(startNum) + '-' + app.utils.numberFormat(endNum) + ')',
                    index: i,
                });
                startNum = endNum + 1;
            }
        }
        return sections;
    },
    doFinish () {
        Toast('本周已经学习了新的内容');
    },
    getVideoList (dataDetail, index) {
        const list = [];
        if (dataDetail && dataDetail.otherVideo && this.props.dataArray) {
            const { quarterlySeries, currentVideoId, replay } = dataDetail;
            if (this.currentVideoId !== currentVideoId) {
                this.isClick = false;
                this.currentVideoId = currentVideoId;
            }
            const otherVideo = this.props.dataArray.slice();
            const len = otherVideo.length;
            const sectionLength = Math.ceil(len / quarterlySeries);
            const startNum = quarterlySeries * index;
            const endNum = Math.min(len, startNum + quarterlySeries);
            let row = 0, col = 0;
            for (let i = startNum; i < endNum; i++) {
                if (col === 0) {
                    list[row] = [];
                }
                const video = otherVideo[i];
                list[row].push({ video: video, number:i + 1, playing: video.otherVideoID === currentVideoId });
                col++;
                if (col === 5) {
                    col = 0;
                    row++;
                }
            }
        }
        return list;
    },
    getTabindex (dataDetail) {
        let index = 0;
        if (dataDetail) {
            const { otherVideo, quarterlySeries, currentVideoId } = dataDetail;
            const len = otherVideo.length;
            const sectionLength = Math.ceil(len / quarterlySeries);
            let pos = 0;
            for (let i = 0; i < len; i++) {
                if (otherVideo[i].otherVideoID === currentVideoId) {
                    pos = i;
                    break;
                }
            }
            index = Math.floor(pos / quarterlySeries);
        }
        return index;
    },
    render () {
        const { dataDetail } = this.props;
        let tabIndex = 0;
        if (this.isClick) {
            tabIndex = this.state.tabIndex;
        } else {
            tabIndex = this.getTabindex(dataDetail);
        }
        const sections = this.getSections(dataDetail);
        const videoList = this.getVideoList(dataDetail, tabIndex);
        return (
            <View style={styles.container}>
                <ScrollView
                    horizontal
                    scrollEnabled
                    style={styles.tabContainer}>
                    {
                        sections.map((item, i) => {
                            return (
                                <TouchableOpacity
                                    key={i}
                                    onPress={this.changeTab.bind(null, i)}
                                    style={styles.tabButtonLeft}>
                                    <Text style={[styles.tabText, tabIndex === i ? { color:'#A62045' } : { color:'#666666' }]} >
                                        {item.title}
                                    </Text>
                                    <View style={[styles.tabLine, tabIndex === i ? { backgroundColor: '#A62045' } : null]} />
                                </TouchableOpacity>
                            );
                        })
                    }
                </ScrollView>
                <View style={styles.bottomContainer}>
                    {
                        videoList.map((list, i) => {
                            return (
                                <View style={styles.backView} key={i}>
                                    <View style={styles.lineView} />
                                    <View key={i} style={styles.rowContainer}>
                                        {
                                            list.map((item, j) => {
                                                return (
                                                    <View style={{ flexDirection: 'row' }} key={j}>
                                                        <View style={styles.lineStyle} />
                                                        {
                                                            item.video ?
                                                                <TouchableOpacity
                                                                    onPress={(item.video.isOver || item.playing) ? this.props.doRestart.bind(null, item.video) : this.doFinish}
                                                                    style={styles.tabButtonPlay}>
                                                                    <View style={[styles.tabButtonPlay, { backgroundColor: item.playing ? '#FFFFFF' : item.video.isOver ? '#97CEA3' : '#FFFFFF' }]}>
                                                                        {
                                                                        item.playing &&
                                                                        <View style={styles.playView}>
                                                                            <Image
                                                                                resizeMode='stretch'
                                                                                source={app.img.play_play}
                                                                                style={styles.playImage} />
                                                                            <Text style={styles.playText} >
                                                                                {'第' + item.number + '集'}
                                                                            </Text>
                                                                        </View>

                                                                    }
                                                                        {
                                                                        !item.playing &&
                                                                        <Text style={[styles.tabText, { color:'#555555' }]} >
                                                                            {'第' + item.number + '集'}
                                                                        </Text>
                                                                    }
                                                                        {
                                                                        !item.video.isOver && !item.playing &&
                                                                        <Image
                                                                            resizeMode='stretch'
                                                                            source={app.img.specops_lock}
                                                                            style={styles.btnImage} />
                                                                    }
                                                                    </View>
                                                                </TouchableOpacity>
                                                            :
                                                                <View key={j} style={styles.tabButtonPlay} />

                                                        }
                                                    </View>
                                                );
                                            })
                                        }
                                        <View style={styles.lineStyle} />
                                    </View>
                                </View>
                            );
                        })
                    }
                    <View style={styles.lineView} />
                </View>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    tabContainer: {
        width:sr.w - 20,
        height: 25,
        marginHorizontal: 10,
        marginBottom: 5,
        flexDirection: 'row',
    },
    bottomContainer: {
        width:sr.w,
        marginBottom: 5,
    },
    tabButtonLeft: {
        width: sr.w / 4,
        alignItems:'center',
        marginRight: 5,
        justifyContent:'center',
    },
    tabButtonPlay: {
        width: sr.w / 5 - 5,
        height: 32,
        alignItems:'center',
        justifyContent:'center',
    },
    tabLine: {
        width: sr.w / 4 - 3,
        height: 1.5,
        marginTop: 2,
        alignSelf: 'center',
    },
    tabText: {
        fontSize: 14,
        backgroundColor: 'transparent',
    },
    rowContainer: {
        width: sr.w - 20,
        marginHorizontal: 10,
        flexDirection: 'row',
    },
    lineView: {
        width: sr.w,
        height: 1,
        backgroundColor: '#EEEEEE',
    },
    lineStyle: {
        width: 1,
        height: 32,
        backgroundColor: '#EEEEEE',
    },
    btnImage: {
        width: 25,
        height: 25,
        position: 'absolute',
        left: (sr.w / 5 - 35) / 2,
        bottom: 4,
        tintColor: '#8B8386',
    },
    playView: {
        width: sr.w / 5 - 10,
        height: 28,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'center',
        borderRadius: 2,
        backgroundColor: '#A60245',
    },
    playImage: {
        width: 14,
        height: 14,
    },
    playText: {
        fontSize: 12,
        marginLeft: 5,
        color: '#FFFFFF',
    },
});
