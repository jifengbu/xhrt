'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    View,
    Text,
    Image,
    StyleSheet,
    ListView,
    ScrollView,
    TouchableHighlight,
} = ReactNative;

var {PageList,RText} = COMPONENTS;
var AidBigImage = require('../actualCombat/AidBigImage.js');
const {STATUS_TEXT_HIDE, STATUS_START_LOAD, STATUS_HAVE_MORE, STATUS_NO_DATA, STATUS_ALL_LOADED, STATUS_LOAD_ERROR} = CONSTANTS.LISTVIEW_INFINITE.STATUS;

module.exports = React.createClass({
    statics: {
        title: '我的周任务',
    },
    showBigImage(imageArray, index) {
        app.showModal(
            <AidBigImage
                doImageClose={app.closeModal}
                defaultIndex={index}
                defaultImageArray={imageArray}>
            </AidBigImage>
        );
    },
    renderRow(obj,sectionID,rowID) {
        var imageArray = obj.images;
        var strHomeworkContent = obj.homeworkContent?obj.homeworkContent:'';
        return (
            <TouchableHighlight
                onPress={null}
                underlayColor="#EEB422">
                <View style={styles.itemContainer}>
                    <View style={styles.dataContainer}>
                        <Image
                            resizeMode='stretch'
                            source={app.img.specops_calendar}
                            style={styles.icon_item}  />
                        <Text style={styles.dateText}>{obj.homeworkTime}</Text>
                    </View>
                    <View style={styles.questionContainer}>
                        <Text style={styles.questionText}>{'问题：'+strHomeworkContent}</Text>
                    </View>
                    <View style={styles.lineStyle}>
                    </View>
                    {
                        imageArray.length>0&&
                        <ScrollView horizontal={true} style={styles.imageContainer}>
                            {
                                imageArray.map((item, i)=>{
                                    return (
                                        <TouchableHighlight key={i} underlayColor="rgba(0, 0, 0, 0)" onPress={this.showBigImage.bind(null, imageArray, i)} style={styles.bigImageTouch}>
                                            <Image
                                                resizeMode='stretch'
                                                defaultSource={app.img.common_default}
                                                source={{uri: item}}
                                                style={styles.imageStyle}
                                                />
                                        </TouchableHighlight>
                                    )
                                })
                            }
                        </ScrollView>
                    }
                    <View style={styles.bottomStyle}>
                        <RText style={styles.commonText}>{obj.answer}</RText>
                    </View>
                </View>
            </TouchableHighlight>
        )
    },
    render() {
        return (
            <View style={styles.container}>
                    <PageList
                        ref={listView=>this.listView=listView}
                        disable={this.props.disable}
                        style={styles.list}
                        renderRow={this.renderRow}
                        renderSeparator={()=>null}
                        listParam={{userID: app.personal.info.userID}}
                        listName={"homeworkList"}
                        listUrl={app.route.ROUTE_GET_SPECIAL_SOLDIER_HOMEWORK}
                        refreshEnable={true}
                        />
            </View>
        )
    },
});


var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    itemContainer: {
        backgroundColor: '#FFFFFF',
    },
    dataContainer: {
        width: sr.w,
        height: 40,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#EEEEEE',
    },
    icon_item: {
        marginHorizontal: 10,
        width: 30,
        height: 30,
    },
    dateText: {
        fontSize: 16,
        color: '#555555',
    },
    questionContainer: {
        backgroundColor: '#FFFFFF',
    },
    questionText: {
        fontSize: 16,
        marginLeft: 10,
        marginVertical: 10,
    },
    lineStyle: {
        height: 1,
        width: sr.w,
        backgroundColor: '#EEEEEE',
    },
    commonText: {
        marginVertical: 10,
        fontSize: 16,
        lineHeight: 20,
        color: '#555555'
    },
    bottomStyle: {
        marginHorizontal: 10,
        marginBottom: 10,
    },
    imageContainer: {
        flexDirection: 'row',
        marginVertical: 10,
        paddingVertical: 8,
        height: 116,
        backgroundColor: '#FFFFFF',
    },
    imageStyle: {
        width: 100,
        height: 100,
    },
    bigImageTouch: {
        flexDirection: 'row',
        width: 100,
        height: 100,
        marginLeft: 10,
    },
});
