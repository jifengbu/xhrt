'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
} = ReactNative;

var PixelRatio = require('PixelRatio');
var UmengMgr = require('../../manager/UmengMgr.js');
var {PageList,RText} = COMPONENTS;

module.exports = React.createClass({
    mixins: [SceneMixin],
    statics: {
        rightButton: { image: app.img.excellentWorks_share, handler: ()=>{
            app.scene.toggleEdit();
        }},
    },
    getInitialState (){
        return {
            homeworkDetail: '',
        };
    },
    componentDidMount() {
        var tmp1 = this.props.homeworkDetail.homeworkDetail.replace(/\r\n/g,"")
        var tmp2 = tmp1.replace(/♖/g,"\n\n")
		var detail = tmp2.replace(/♔/g,"\n\t");
        this.setState({homeworkDetail:detail});
    },
    toggleEdit() {
        this.doShare();
    },
    doShare() {
        var data = 'homeworkId='+this.props.homeworkDetail.homeworkId;
        var desc =this.props.homeworkDetail.authorCompany+this.props.homeworkDetail.authorPosition+this.props.homeworkDetail.authorName+this.props.courseObj.courseName+'的作业'
        var dataEncode = encodeURI(data);
        UmengMgr.doActionSheetShare(CONSTANTS.SHARE_HOMEWORKDETAIL_SERVER+'homeworkDetail.html?'+dataEncode,this.props.courseObj.courseName,desc,'web',CONSTANTS.SHARE_IMGDIR_SERVER+'homework.png',this.doShareCallback);
    },
    doShareCallback() {
        //分享回调
    },
    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={styles. messageContainer}>
                    <View style={styles. messageContainer1}>
                        <View style={styles.container2}>
                            <Text style={styles.Textstyle}>
                                {this.props.homeworkDetail.authorName?'姓名： '+this.props.homeworkDetail.authorName:'姓名： '}
                            </Text>
                        </View>
                        <View style={styles.container2}>
                            <Text style={styles.Textstyle}>
                                {this.props.homeworkDetail.authorPosition?'职位： '+this.props.homeworkDetail.authorPosition:'职位： '}
                            </Text>
                        </View>
                    </View>
                    <View style={styles. messageContainer1}>
                        <Text numberOfLines={2} style={[styles.Textstyle, {width: sr.w-30}]}>
                            {this.props.homeworkDetail.authorCompany?'公司： '+this.props.homeworkDetail.authorCompany:'公司： '}
                        </Text>
                    </View>
                </View>
                <View style={styles. dateContainer}>
                    <Image
                        source={app.img.excellentWorks_timeto}
                        style={styles.iconStyle}>
                    </Image>
                    <Text style={styles.TextstyleTime}>
                        {this.props.homeworkDetail.homeworkSubmitTime}
                    </Text>
                </View>
                <View style={styles. contentContainer}>
                    <RText style={styles.TextstyleText}>
                        {this.state.homeworkDetail}
                    </RText>
                </View>
            </ScrollView>
        )
    }

});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    container2: {
        flex: 1,
        height: 40,
        justifyContent: 'center',
    },
    messageContainer1: {
        marginLeft: 10,
        alignItems: 'center',
        flexDirection: 'row',
    },
    messageContainer: {
        height: 72,
        margin: 10,
        width: sr.w -20,
        borderRadius: 6,
        backgroundColor: '#edeeef',
    },
    dateContainer: {
        marginHorizontal: 10,
        width: sr.w -20,
        alignItems: 'center',
        flexDirection: 'row',
    },
    contentContainer: {
        flex: 1,
        margin: 16,
        marginTop:15,
    },
    Textstyle: {
        fontSize: 13,
        color: '#666666',
        fontWeight: '400',
    },
    TextstyleText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#777777',
        lineHeight: 25,
    },
    TextstyleTime: {
        fontSize: 13,
        color: '#999999',
        fontWeight: '500',
    },
    iconStyle: {
        height: 15,
        width: 15,
        marginHorizontal: 5,
    },
});
