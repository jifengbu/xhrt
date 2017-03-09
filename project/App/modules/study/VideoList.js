'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
    Text,
    ListView,
    Image,
    TouchableOpacity,
    TouchableHighlight,
} = ReactNative;

var VideoPlay = require('./VideoPlay.js');

module.exports = React.createClass({
    getInitialState() {
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            dataSource: this.ds.cloneWithRows(this.props.videoList),
        };
    },
    componentWillReceiveProps(nextProps) {
        this.setState({dataSource: this.ds.cloneWithRows(nextProps.videoList)});
    },
    //更新视频的播放和点赞数量
    updateClickOrLikeNum(clickNum) {
        var video = _.find(this.props.videoList, (item)=>item.videoID==clickNum.videoID);
        if (video) {
            if (clickNum.type === 'click') {
                video.clicks += 1;
            } else if (clickNum.type === 'heart') {
                video.likes += 1;
            }
            this.setState({dataSource: this.ds.cloneWithRows(this.props.videoList)})
        }
    },
    _onPressRow(obj) {
        if (app.personal.info.userType == "0" && obj.isFree != 1) {
            this.props.ShowMealBoxChange();
            return;
        }
        if (app.personal.info.userType == "1" && obj.isFree != 1) {

            if (_.find(app.personal.info.validVideoList,(item)=>item==obj.videoID)) {
                app.navigator.push({
                    title: obj.name,
                    component: VideoPlay,
                    passProps: {videoInfo:obj, updateClickOrLikeNum: this.updateClickOrLikeNum},
                });
                return;
            }
            this.props.ShowMealBoxChange();
            return;
        }
        app.navigator.push({
            title: obj.name,
            component: VideoPlay,
            passProps: {videoInfo:obj, updateClickOrLikeNum: this.updateClickOrLikeNum},
        });
    },
    renderSeparator(sectionID, rowID) {
        return (
            <View style={styles.separator} key={rowID}/>
        );
    },
    renderRow(obj, sectionID, rowID) {
        return (
            <TouchableOpacity
                onPress={this._onPressRow.bind(null, obj)}>
                <Image
                    resizeMode='stretch'
                    defaultSource={app.img.common_default}
                    source={{uri:obj.urlImg}}
                    style={styles.row} >
                    <Image
                        resizeMode='stretch'
                        source={app.img.study_mask}
                        style={styles.row} >
                        <View style={styles.detailContainer}>
                            <Text style={styles.title} >
                                {obj.name}
                            </Text>
                            <View style={styles.infoContainer}>
                                <Text style={styles.content} >
                                    {'主讲: '+obj.author}
                                </Text>
                                <Text style={styles.content} >
                                    {'     播放: '+(obj.clicks*3+50)}
                                </Text>
                                <Text style={styles.content} >
                                    {'     赞: '+obj.likes}
                                </Text>
                            </View>
                        </View>
                        {
                            // <View style={styles.bannerTextContainer}>
                            //     <View style={styles.leftTextContainer}>
                            //         <Image
                            //             resizeMode='stretch'
                            //             source={app.img.study_prize_label}
                            //             style={styles.prize}/>
                            //         <Text style={styles.bannerText}>
                            //             {'有奖视频'}
                            //         </Text>
                            //     </View>
                            //     <View style={styles.rightTextContainer}>
                            //         {
                            //             obj.label.map((item, i)=>{
                            //                 return (
                            //                     i<3 &&
                            //                     <View style={styles.buttonTextContainer} key={i}>
                            //                         <Text style={styles.labelText}>
                            //                             {item.labelName}
                            //                         </Text>
                            //                     </View>
                            //                 )
                            //             })
                            //         }
                            //     </View>
                            // </View>
                        }
                    </Image>
                </Image>
            </TouchableOpacity>
        )
    },
    render() {
        return (
            <View style={styles.container}>
                <ListView                    initialListSize={1}
                    enableEmptySections={true}
                    style={styles.list}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    renderSeparator={this.renderSeparator}
                    />
            </View>
        );
    },
});


var styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    list: {
        alignSelf:'stretch'
    },
    separator: {
        backgroundColor: '#CCC'
    },
    row: {
        height: 195,
        flex: 1,
    },
    detailContainer: {
        flex: 1,
        width: sr.w,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    title: {
        fontSize:26,
        color: '#FFFFFF',
        fontWeight: '900',
    },
    infoContainer: {
        height: 40,
        flexDirection: 'row',
    },
    content: {
        fontSize: 16,
        marginTop: 10,
        fontWeight: '500',
        color: '#A8BBC9',
    },
    bannerTextContainer: {
        height: 30,
        width: sr.w,
        position: 'absolute',
        bottom: 0,
        left: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'red',
    },
    leftTextContainer: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',

    },
    prize: {
        height: 15,
        width: 15,
        marginLeft: 10,
        marginRight: 3,
    },
    bannerText: {
        fontSize: 11,
        fontWeight: '900',
        color: '#DDDDDD',
    },
    rightTextContainer: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonTextContainer: {
        padding: 3,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#B3B3B3',
        borderRadius: 4,
        paddingHorizontal: 2,
        marginRight: 10,
    },
    labelText: {
        fontSize: 11,
        fontWeight: '900',
        color: '#DDDDDD',
    },
});
