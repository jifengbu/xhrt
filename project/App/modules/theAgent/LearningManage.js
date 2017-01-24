'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
} = ReactNative;

var Accordion = require('react-native-accordion');
var TimerMixin = require('react-timer-mixin');
var {Button, DImage, PageList} = COMPONENTS;

module.exports = React.createClass({
    mixins: [TimerMixin],
    statics: {
        title: '学习管理',
    },
    getStduiestItem(obj, accordion) {
        var param = {
            userID: app.personal.info.userID,
            staffID: obj.userID,
        };
        POST(app.route.ROUTE_GET_STUIEST_ITEM, param, this.getStduiestItemSuccess.bind(null, obj, accordion), true);
    },
    getStduiestItemSuccess(obj, accordion, data) {
        if (data.success) {
            obj.detail = data.context.userList||[];
            this.listView.updateList((list)=>list);
            this.setTimeout(accordion.toggle, 300);
        } else {
            Toast(data.msg);
        }
    },
    onPressRow(obj, rowID, accordion) {
        accordion.toggle();
        this.selectedRowID = !accordion.is_visible?rowID:null;
        if (!obj.detail) {
            this.selectedRowID = accordion.is_visible?rowID:null;
            this.getStduiestItem(obj, accordion);
        } else {
            this.listView.updateList((list)=>list);
        }
        if (this.oldAccordion && this.oldAccordion!==accordion) {
            this.oldAccordion.open();
        }
        this.oldAccordion = accordion;
    },
    renderRow(obj, sectionID, rowID){
        var header = (
            <View style={styles.BGContainer}>
                <DImage
                    defaultSource={app.img.personal_head}
                    source={{uri: obj.userImg}}
                    style={styles.imageIcon} />
                <Text style={styles.textTitle}>
                    {obj.user}
                </Text>
                <View style={[styles.detailsView,{backgroundColor:this.selectedRowID==rowID?'#EEEEEE':'#4FC1E9'}]}>
                    <Text
                        numberImgStyles = {1}
                        style={[styles.textDetails,
                        {color:this.selectedRowID==rowID?'gray':'#FFFFFF'}]}>
                        {this.selectedRowID==rowID?'隐藏详情':'查看详情'}
                    </Text>
                </View>
            </View>
        );
        var detail = obj.detail||[];
        var content = (app.isandroid? (detail.length && this.selectedRowID==rowID) : (detail.length)) ?
            <View  style={ styles.detailView}>
                {
                    detail.map((item, i)=>
                    <View  key={i}>
                        <Text style={styles.textCourse}>
                            {'优秀案例：'+item.title}
                        </Text>
                        <Text style={styles.textLecturer}>
                            {'主讲: '+item.author +'          点击率: '+item.watchTimes}
                        </Text>
                        <View style={styles.timeView}>
                            <View style={styles.mainSpeakStyles}>
                                <Image
                                    resizeMode='stretch'
                                    source={app.img.personal_look_number}
                                    style={styles.numberImgStyles} />
                                <Text style={styles.clicks_watchTimeStyles}>
                                    {item.clicks*3+50}
                                </Text>
                            </View>
                            <View style={styles.mainSpeakStyles2}>
                                <Image
                                    resizeMode='stretch'
                                    source={app.img.personal_look_time}
                                    style={styles.numberImgStyles} />
                                <Text style={styles.clicks_watchTimeStyles}>
                                    {item.date}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.lineView}>
                        </View>
                    </View>)
                }
            </View> : null;
        return(
            <Accordion
                header={header}
                content={content}
                easing="easeOutCubic"
                onPress={this.onPressRow.bind(null, obj, rowID)}
                />
        )
    },
    render() {
        return (
            <View style={[this.props.style,{backgroundColor:'#EEEEEE'},{marginTop:15}]}>
                <PageList
                    ref={listView=>this.listView=listView}
                    renderRow={this.renderRow}
                    listParam={{userID: app.personal.info.userID}}
                    listName={"userList"}
                    refreshEnable={true}
                    listUrl={app.route.ROUTE_GET_STUIEST}
                    />
            </View>
        );
    },
});

var styles = StyleSheet.create({
    BGContainer: {
        height:55,
        flexDirection:'row',
        backgroundColor:'#FFFFFF',
    },
    mainSpeakStyles: {
        flexDirection: 'row',
        marginTop: 5,
        marginRight:10,
        flex:1,
    },
    mainSpeakStyles2: {
        flexDirection: 'row',
        marginTop: 5,
        marginRight:10,
        flex:1.5,
    },
    clicks_watchTimeStyles: {
        alignSelf: 'center',
        color: '#b4b4b4',
        fontSize: 13,
        marginHorizontal: 10,
    },
    numberImgStyles: {
        width: 25,
        height: 25,
        marginRight:5,
        alignSelf: 'center'
    },
    detailView:{
        backgroundColor:'#FFFFFF',
        marginHorizontal:15,
        marginVertical:10,
    },
    timeView:{
        flex:2,
        flexDirection:'row',
        width:sr.W-50,
        marginHorizontal:10,
    },
    lineView:{
       flex:0.5,
       backgroundColor:'#d3d3d3',
       height:1,
    },
    textCourse: {
        flex:1.2,
        fontSize: 20,
        textAlign: 'left',
        marginTop:10,
        marginHorizontal:5,
    },
    textLecturer: {
        flex:1,
        fontSize: 18,
        textAlign: 'left',
        color :'#b4b4b4',
        marginTop:10,
        marginHorizontal:5,
    },
    textTitle: {
        flex:6,
        fontSize: 18,
        textAlign: 'left',
        alignSelf:'center',
        paddingLeft:10,
    },
    detailsView:{
        marginVertical:15,
        marginHorizontal:10,
        width:80,
        borderRadius:3
    },
    textDetails: {
        paddingVertical:3,
        fontWeight:'400',
        justifyContent:'center',
        fontSize: 16,
        textAlign: 'center',
        alignSelf:'center',
    },
    imageIcon : {
        width: 40,
        height: 40,
        borderRadius:20,
        margin:10,
        alignSelf:'center',
    },
});
