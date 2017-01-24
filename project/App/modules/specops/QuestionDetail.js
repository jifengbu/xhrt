'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
    Text,
    Image,
    TextInput,
    ScrollView,
    TouchableOpacity,
    TouchableHighlight,
} = ReactNative;

var QuestionForCoach = require('./QuestionForCoach.js');
var AidBigImage = require('../actualCombat/AidBigImage.js');
var {PageList, Button, DImage} = COMPONENTS;

module.exports = React.createClass({
  statics: {
        title: '精彩问答',
    },
    toQuestion() {
        app.navigator.push({
            title: '我的答案',
            component: QuestionForCoach,
            passProps: {QuestionType: 1,questionID:this.props.obj.questionID,taskName:this.props.obj.questionContent,doRefresh:this.doRefresh},//QuestionType 0提问 1回答 2写作业
        });
    },
    doRefresh() {
        this.listView.refresh();
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
    renderRow(obj){
        var imageArray = obj.answerImages;
        return(
            <TouchableHighlight
                underlayColor="#EEB422"
                style={styles.itemContainer}
                onPress={null}>
                <View>
                    <View style={styles.topContainer}>
                    <View style={styles.iconConstainer}>
                        <DImage
                            resizeMode='stretch'
                            defaultSource={app.img.personal_head}
                            source={{uri:obj.answerHead}}
                            style={styles.iconStyle} />
                        <Text numberOfLines={1} style={styles.nameTitle}>
                            {obj.answerAlias}
                        </Text>
                    </View>
                        <Text style={styles.textTitle}>
                            {'回答时间: '+ obj.answerTime}
                        </Text>
                    </View>
                    {
                        imageArray&&imageArray.length>0&&
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
                    <Text style={styles.commontTile}>
                        {obj.answerContent}
                    </Text>
                </View>
            </TouchableHighlight>
        )
    },
    render() {
        var {questionImages,questionContent} = this.props.obj;
        return (
            <View style={styles.container}>
                <View style={styles.topStyle}>
                    <Text style={styles.themeTitle}>
                        {'题目: '+questionContent}
                    </Text>
                    {
                        questionImages.length>0&&
                        <ScrollView horizontal={true} style={styles.imageContainer}>
                            {
                                questionImages.map((item, i)=>{
                                    return (
                                        <TouchableHighlight key={i} underlayColor="rgba(0, 0, 0, 0)" onPress={this.showBigImage.bind(null, questionImages, i)} style={styles.bigImageTouch}>
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
                </View>
                <PageList
                    ref={listView=>this.listView=listView}
                    disable={this.props.disable}
                    style={styles.list}
                    renderRow={this.renderRow}
                    renderSeparator={()=>null}
                    listParam={{questionID: this.props.obj.questionID}}
                    listName={"answerList"}
                    listUrl={app.route.ROUTE_QAND_ADETAIL}
                    refreshEnable={true}
                    />
                {
                    this.props.MyQuestionType===1&&
                    <View style={styles.inputStyle}>
                        <TouchableOpacity
                            onPress={this.toQuestion}
                            style={styles.bottomInput}>
                            <View style={styles.inputView}>
                                <Text style={styles.inputTitle}>我来回答</Text>
                            </View>
                            <View style={styles.btnView}>
                                <Text style={styles.btnTitle}>发送</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEEEEE',
    },
    topStyle: {
        backgroundColor: '#FFFFFF',
    },
    themeTitle: {
        fontSize: 16,
        marginVertical: 10,
        marginLeft: 15,
        fontWeight: 'bold',
        color: '#555555',
        backgroundColor: '#FFFFFF',
    },
    itemContainer: {
        backgroundColor: '#FFFFFF',
        marginTop: 10,
    },
    topContainer: {
        height: 40,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    iconConstainer: {
        height: 40,
        alignItems: 'center',
        flexDirection: 'row',
    },
    iconStyle: {
        marginLeft: 15,
        height: 30,
        width: 30,
        borderRadius: app.isandroid? 120: 15,
    },
    nameTitle: {
        fontSize: 16,
        marginHorizontal: 5,
        color: '#555555'
    },
    textTitle: {
        fontSize: 12,
        marginRight: 10,
        color :'#555555',
    },
    commontTile: {
        fontSize: 16,
        marginVertical: 10,
        marginHorizontal:15,
        color: '#555555',
    },
    inputStyle: {
        width: sr.w,
        height: 50,
        bottom: 0,
        left: 0,
        position: 'absolute',
        backgroundColor: '#cbcccd',
    },
    inputView: {
        width: sr.w-90,
        height: 32,
        marginLeft: 15,
        borderRadius: 4,
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    btnView: {
        width: 50,
        height: 32,
        marginRight: 10,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: CONSTANTS.THEME_COLOR
    },
    bottomInput: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    inputTitle: {
        marginLeft: 10,
        fontSize: 14,
        color: '#838B8B',
    },
    btnTitle: {
        fontSize: 16,
        color: '#FFFFFF',
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
