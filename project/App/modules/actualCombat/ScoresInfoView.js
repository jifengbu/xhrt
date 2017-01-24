
'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TextInput,
    TouchableOpacity,
} = ReactNative;

var {Button, PageList,RText} = COMPONENTS;

function getHalfStarNum(score){
    var tempScore = Math.floor(score * 10);
    var subTempScore = tempScore % 10;

    var starNum = Math.floor(score);
    var starHalfNum = 0;

    if (subTempScore < 4) {
        starHalfNum = 0;
    };
    if (subTempScore > 3 && subTempScore < 7) {
        starHalfNum = 1;
    };
    if (subTempScore > 6) {
        starNum = starNum + 1;
        if (starNum > 5) { starNum = 5};
    };

    return {starNum:starNum, starHalfNum:starHalfNum};
}

var ScoresView = React.createClass({
    statics: {
        title: '打分',
    },
    getInitialState() {
        return {
            starNum: 1,
        };
    },
    onPress(index) {
        this.setState({starNum: index+1});
        this.props.onParentChangeStarNum(index+1);
    },
    render() {
        var {starNum} = this.state;
        return(
            <View style={styles.themeScoresView}>
                {
                    [0,1,2,3,4].map((i)=>{
                        return (
                            <TouchableOpacity
                                key={i}
                                activeOpacity={1}
                                onPress={this.onPress.bind(null, i)} >
                                <Image
                                    resizeMode='stretch'
                                    source={i<starNum?app.img.actualCombat_star_1:app.img.actualCombat_star_2}
                                    style={styles.imageStar} />
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
        );
    }
});

var AuthorView = React.createClass({
    render() {
        var retArray = getHalfStarNum(this.props.issueScore);
        var starNum = retArray.starNum;
        var starHalfNum = retArray.starHalfNum;
        var issueText;
        if (this.props.issueScore < 1 || this.props.issueScore == undefined) {
          issueText = '发布者暂无评价';
        }
        else{
          issueText = this.props.issueContent;
        }
        return(
            <View style={styles.authorView}>
                <View style={styles.authorSubView}>
                    <Text style={styles.scoresInfoText}>
                        发布者打分
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                        {
                            [0,1,2,3,4].map((i)=>{
                                var imgSource;
                                if (i < starNum) {
                                    imgSource = app.img.actualCombat_star_1;
                                }
                                else{
                                    imgSource = app.img.actualCombat_star_2;
                                };
                                if (i === starNum && starHalfNum === 1) {
                                    imgSource = app.img.actualCombat_star_3;
                                };
                                return (
                                    <Image
                                        key={i}
                                        resizeMode='stretch'
                                        source={imgSource}
                                        style={styles.authorViewImage} />
                                )
                            })
                        }
                    </View>
                </View>
                <View style={styles.authorViewContent}>
                    <RText
                        style={styles.authorTextContent}>
                        {issueText}
                    </RText>
                </View>
                <View style={styles.authorTimeSubView}>
                    <Text style={styles.timeStr}>
                        {this.props.issueTime}
                    </Text>
                </View>
            </View>
        );
    }
});

var ScoresPanel = React.createClass({
    getInitialState() {
        return {
          starNum: 1,
          content: '',
          textCount: 128,
        };
    },
    onChangeStarNum(starNumCount: number) {
        this.setState({starNum:starNumCount});
    },
    submitScore(){
        var param = {
            score: this.state.starNum,
            userID: app.personal.info.userID,
            content: this.state.content,
            schemeID: this.props.schemeID,
        };
        POST(app.route.ROUTE_SUBMIT_SCHEME_SCORE, param, this.submitScoreSuccess, this.submitScoreFailed);
    },
    submitScoreSuccess(data) {
        this.setState({content: ''});
        if (data.success) {
            var msg = data.msg;
            this.noticeShow();
            Toast('成功提交');
        } else {
            this.noticeShow();
            this.submitScoreFailed();
            Toast('你已经提交过评分');
        }
    },
    noticeShow() {
        this.show(()=>{
            this.props.noticeShow();
        });
    },
    show(callback) {
        return callback();
    },
    submitScoreFailed() {
    },
    render() {
        return (
            <ScrollView style={this.props.style}>
                <Text style={styles.themeText}>
                    {'主题：'}{this.props.theme}
                </Text>
                <ScoresView onParentChangeStarNum = {this.onChangeStarNum} />
                <View style={styles.themeInfoContainer}>
                    <TextInput
                        style={styles.themeInfoText}
                        multiline={true}
                        maxLength={128}
                        placeholder={'请输入您的评价'}
                        defaultValue={this.state.content}
                        onChangeText={(text) => this.setState({textCount: 128 - text.length, content: text})}>
                    </TextInput>
                    <View style={styles.textCountView}>
                        <Text style={styles.textCountText}>
                            {this.state.textCount}
                        </Text>
                    </View>
                </View>
                <Button
                    onPress={this.submitScore}
                    style={styles.btnForgetPassWord}
                    textStyle={styles.btnForgetPassWordText}>提交</Button>
            </ScrollView>
        );
    }
});

var ScoresInfoPanel = React.createClass({
    getInitialState() {
        return {
            issueScore: 0,
            issueContent: 'content',
            issueTime: 'time',
        };
    },
    componentWillReceiveProps(nextProps) {
        if (nextProps.isSuccess === 2 && this.props.isSuccess === 0) {
            this.listView.refresh(()=>{
            });
        }
    },
    renderRow: function(rowData: serverJosn, sectionID: number, rowID: number) {
        var retArray = getHalfStarNum(rowData.score);
        var starNum = retArray.starNum;
        var starHalfNum = retArray.starHalfNum;
        var imageUrl;
        if (rowData.image.length < 5) {
          imageUrl = app.img.personal_head;
        }
        else {
          imageUrl = {uri:rowData.image};
        }
        return (
            <View style={styles.otherUserView}>
                <View style={styles.otherUserSubView}>
                    <Image
                        source={imageUrl}
                        style={styles.otherUserHeadImage}>
                    </Image>
                    <Text style={styles.otherUserText}>
                        {' '}{rowData.name}{': '}
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                        {
                            [0,1,2,3,4].map((i)=>{
                                var imgSource;
                                if (i < starNum) {
                                    imgSource = app.img.actualCombat_star_1;
                                }
                                else{
                                    imgSource = app.img.actualCombat_star_2;
                                };
                                if (i === starNum && starHalfNum === 1) {
                                    imgSource = app.img.actualCombat_star_3;
                                };
                                return (
                                    <Image
                                        key={i}
                                        resizeMode='stretch'
                                        source={imgSource}
                                        style={styles.otherUserStarImage} />
                                )
                            })
                        }
                    </View>
                </View>
                <View style={styles.lineView}>
                </View>
                <View style={styles.otherUserContentView}>
                    <Text
                        style={styles.otherUserContentText}>{rowData.content}</Text>
                </View>
                <View style={styles.authorTimeSubView}>
                    <Text style={styles.timeOtherStr}>
                        {rowData.time}
                    </Text>
                </View>
            </View>
        );
    },
    onGetList(data, pageNo) {
        if (data.success && pageNo === 1) {
            this.setState({
                issueScore: data.context.score,
                issueContent: data.context.content,
                issueTime: data.context.time,
            });
        }
    },
    render() {
        return (
            <View style={this.props.style}>
                <Text style={styles.themeText}>
                    {'主题：'}{this.props.theme}
                </Text>
                <AuthorView {...this.state}/>
                <PageList
                    ref={listView=>this.listView=listView}
                    renderRow={this.renderRow}
                    listParam={{schemeID: this.props.schemeID}}
                    listName="scoreList"
                    listUrl={app.route.ROUTE_GET_SCORE_DETAIL}
                    refreshEnable={true}
                    renderSeparator={null}
                    onGetList={this.onGetList}
                    />
            </View>
        );
    }
});

module.exports = React.createClass({
    changeTab(tabIndex,isSuccess) {
        this.setState({tabIndex:tabIndex, isSuccess:isSuccess});
    },
    getInitialState() {
        return {
            tabIndex: 0,
            isSuccess:0,
        };
    },
    updateTabIndex() {
        this.changeTab(1, 2);
    },
    render() {
        var isFirst = this.state.tabIndex===0;
        var isSecond = this.state.tabIndex===1;
        return (
            <View style={styles.container}>
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        onPress={this.changeTab.bind(null, 0, 0)}
                        style={[styles.tabButton, isFirst?{backgroundColor: CONSTANTS.THEME_COLOR}:null]}>
                        <Text style={[styles.tabText, isFirst?{color:'#ffffff'}:{color: CONSTANTS.THEME_COLOR}]} >我来打分</Text>
                        {this.state.tabIndex===1&&
                            <View style={[styles.makeup, {right:0}]}>
                            </View>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.changeTab.bind(null, 1, 0)}
                        style={[styles.tabButton, isSecond?{backgroundColor: CONSTANTS.THEME_COLOR}:null]}>
                        <Text style={[styles.tabText, isSecond?{color:'#ffffff'}:{color: CONSTANTS.THEME_COLOR}]} >打分详情</Text>
                        {this.state.tabIndex===0&&
                            <View style={[styles.makeup, {left:0}]}>
                            </View>
                        }
                    </TouchableOpacity>
                </View>
                <View style={{flex:1}}>
                    <ScoresPanel
                        style={isFirst?{flex:1}:{left:-sr.tw, top:0, position:'absolute'}}
                        theme={this.props.theme}
                        noticeShow={this.updateTabIndex}
                        schemeID={this.props.schemeID}/>
                    <ScoresInfoPanel
                        style={isFirst?{left:-sr.tw, top:0, position:'absolute'}:{flex:1}}
                        isSuccess={this.state.isSuccess}
                        theme={this.props.theme}
                        schemeID={this.props.schemeID}/>
                </View>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    tabContainer: {
        height: 40,
        marginTop: 10,
        marginHorizontal: 10,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: CONSTANTS.THEME_COLOR,
        flexDirection: 'row',
        overflow: 'hidden',
        backgroundColor: CONSTANTS.THEME_COLOR,
    },
    tabButton: {
        flex: 1,
        borderRadius: 5,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: '#FFFFFF',
    },
    tabText: {
        fontSize: 15,
    },
    makeup: {
        backgroundColor: CONSTANTS.THEME_COLOR,
        top: 0,
        width: 10,
        height: 50,
        position: 'absolute'
    },
    themeText: {
        fontSize: 16,
        color: '#B78F4E',
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    themeScoresView: {
        flexDirection: 'row',
        height: 120,
        backgroundColor: '#FFFFFF',
        marginHorizontal: 10,
        paddingHorizontal: 80,
        alignItems:'center',
        justifyContent:'center',
    },
    imageStar: {
        width: 30,
        height: 30,
        marginHorizontal: 3,
    },
    themeInfoContainer: {
        height: 180,
        marginVertical: 25,
        marginHorizontal: 10,
        backgroundColor: '#FFFFFF',
    },
    themeInfoText: {
        height: 160,
        padding: 10,
        fontSize: 14,
        textAlignVertical: 'top',
        backgroundColor: '#FFFFFF',
    },
    authorView: {
        backgroundColor: '#FFFFFF',
        borderColor: CONSTANTS.THEME_COLOR,
        borderWidth: 1,
        marginHorizontal: 10,
        marginBottom: 5,
    },
    authorSubView: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 5,
        justifyContent: 'space-between',
        borderRadius: 6,
    },
    authorTimeSubView: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignItems:'flex-end',
        justifyContent:'center',
        borderRadius: 6,
    },
    authorViewImage: {
        width: 15,
        height: 15,
        marginHorizontal: 2,
        marginTop: 2,
    },
    authorViewContent: {
        backgroundColor: CONSTANTS.THEME_COLOR,
        padding: 5,
        marginTop: 2
    },
    authorTextContent: {
        fontSize: 12,
        lineHeight: 18,
        color: '#ffffff',
    },
    timeStr:{
        marginTop: 2,
        fontSize: 12,
        color: '#BE9451'
    },
    timeOtherStr:{
        fontSize: 12,
        color: '#BE9451'
    },
    textCountView:{
        position: 'absolute',
        right: 10,
        bottom: 10
    },
    textCountText:{
        fontStyle: 'italic',
        fontSize: 10,
        color: '#cccccc'
    },
    scoresInfoText: {
        fontSize: 16,
        color: CONSTANTS.THEME_COLOR,
        fontWeight: 'bold',
    },

    otherUserView: {
        backgroundColor: '#FFFFFF',
        borderColor: '#FFFFFF',
        borderWidth: 1,
        marginHorizontal: 10,
        marginVertical: 5,
    },
    otherUserSubView: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingTop: 5,
        borderRadius: 6,
    },
    otherUserHeadImage: {
        borderColor: CONSTANTS.THEME_COLOR,
        borderRadius: 15,
        borderWidth: 1,
        width: 30,
        height: 30,
        alignSelf : 'center',
    },
    otherUserText: {
        fontSize: 15,
        color: '#7E7F80',
        marginTop: 6,
        fontWeight: 'bold',
    },
    otherUserStarImage: {
        width: 15,
        height: 15,
        marginTop: 6,
        marginHorizontal: 2
    },
    lineView:{
        height: 1,
        backgroundColor: '#DDDDDD',
        marginHorizontal: 5
    },
    otherUserContentView: {
        padding: 5,
        marginHorizontal: 3,
    },
    otherUserContentText: {
        fontSize: 12,
        lineHeight: 18,
        marginLeft: 10,
        color: '#7E7F80',
    },
    btnForgetPassWord: {
        marginHorizontal: 10,
        marginTop: 30,
        height: 40,
        borderRadius: 6,
    },
    btnForgetPassWordText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
