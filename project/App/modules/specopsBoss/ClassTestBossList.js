'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    View,
    Text,
    Image,
    StyleSheet,
    ListView,
    ScrollView,
    TouchableOpacity,
    TouchableHighlight,
} = ReactNative;

var SpecopsPerson = require('./SpecopsPerson.js');
var moment = require('moment');

module.exports = React.createClass({
    getInitialState() {
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            excellent: null,
            good: null,
            medium: null,
            poor: null,
            listData:[],
            dataSource: this.ds.cloneWithRows([]),
        };
    },
    componentDidMount() {
        if (this.props.quizzesDetailsData) {
            let {excellent, good, medium, poor} = this.props.quizzesDetailsData;
            var listData = [];
            (excellent&&JSON.stringify(excellent)!='{}'&&excellent.userList.length)&&listData.push(excellent);
            (good&&JSON.stringify(good)!='{}'&&good.userList.length)&&listData.push(good);
            (medium&&JSON.stringify(medium)!='{}'&&medium.userList.length)&&listData.push(medium);
            (poor&&JSON.stringify(poor)!='{}'&&poor.userList.length)&&listData.push(poor);
            var infiniteLoadStatus = !listData.length ? '暂无成绩数据' : '没有更多数据';
            this.setState({dataSource: this.ds.cloneWithRows(listData), infiniteLoadStatus: infiniteLoadStatus});
        }
    },
    goSpecopsPersonPage(userId) {
        app.navigator.push({
            component: SpecopsPerson,
            passProps: {userID: userId},
        });
    },
    calculateStrLength(oldStr) {
        let height = 0;
        let linesWidth = 0;
        if (oldStr) {
            oldStr = oldStr.replace(/<\/?.+?>/g,/<\/?.+?>/g,"");
            oldStr = oldStr.replace(/[\r\n]/g, '|');
            let StrArr = oldStr.split('|');
            for (var i = 0; i < StrArr.length; i++) {
                //计算字符串长度，一个汉字占2个字节
                linesWidth = StrArr[i].replace(/[^\x00-\xff]/g,"aa").length;
            }
            return linesWidth;
        }
    },
    renderRow(obj) {
        let title = obj.sectionMax + '~' + obj.sectionMin + ' (分) ' + obj.number + ' 人';
        return (
            <View style={styles.itemContainer}>
                <View style={styles.headerContainer}>
                    <Text style={styles.monthStyle}>
                        {title}
                    </Text>
                </View>
                <View>
                    {
                        obj.userList.map((item, i)=>{
                            let headUrl = item.userImg?item.userImg:item.sex===1?app.img.personal_sex_male:app.img.personal_sex_female;
                            let nameTemWidth = this.calculateStrLength(item.userName);
                            let postTemWidth = this.calculateStrLength(item.post);
                            let nameWidth = nameTemWidth*9+3;
                            let postWidth = postTemWidth*6+3;
                            return (
                                <TouchableOpacity onPress={this.goSpecopsPersonPage.bind(null, item.userId)} key={i} style={styles.listViewItemContain}>
                                    <View style={styles.listTtemContainer}>
                                        <View style={styles.rowLeft}>
                                            <Image
                                                resizeMode='cover'
                                                defaultSource={app.img.common_default}
                                                source={item.userImg?{uri: headUrl}:headUrl}
                                                style={styles.headImg} />
                                        </View>
                                        <View style={styles.rowRight}>
                                            <View style={styles.courseContent}>
                                                <View style={styles.rightTopStyle}>
                                                    <View style={{width: nameWidth>145?sr.ws(145):sr.ws(nameWidth)}}>
                                                        <Text numberOfLines={1} style={styles.nameText} >
                                                            {item.userName}
                                                        </Text>
                                                    </View>
                                                    {
                                                        item.post!=''&&
                                                        <View style={[styles.postContainer,{width: postWidth>56?sr.ws(56):sr.ws(postWidth)}]}>
                                                            <Text numberOfLines={1} style={styles.positionText} >
                                                                {item.post}
                                                            </Text>
                                                        </View>
                                                    }
                                                </View>
                                                <Text numberOfLines={1} style={styles.courseText} >
                                                    {'课程: '+item.courseTitle}
                                                </Text>
                                            </View>
                                            <View style={styles.courseScore}>
                                                <View style={styles.scoreStyle}>
                                                    <Text numberOfLines={1} style={styles.scoreText} >
                                                        {item.mark}
                                                    </Text>
                                                    <Text numberOfLines={1} style={styles.scoreText1} >
                                                        {'分'}
                                                    </Text>
                                                </View>
                                                <Text numberOfLines={1} style={styles.dateText} >
                                                    {moment(item.submitTime).format('YYYY.MM.DD')}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    {
                                        obj.userList.length-1!=i&&<View style={styles.separator} />
                                    }
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </View>
        )
    },
    renderFooter() {
        var status = this.state.infiniteLoadStatus;
        return (
            <View style={styles.listFooterContainer}>
                <Text style={styles.listFooter}>{status}</Text>
            </View>
        )
    },
    render() {
        return (
            <View style={styles.container}>
                <ListView
                    initialListSize={1}
                    enableEmptySections={true}
                    renderRow={this.renderRow}
                    dataSource={this.state.dataSource}
                    renderFooter={this.renderFooter}/>
            </View>
        )
    },
});


var styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'column',
    },
    container1: {
        alignItems: 'center',
    },
    listFooterContainer: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listFooter: {
        color: 'gray',
        fontSize: 14,
    },
    headerContainer: {
        width: sr.w,
        height: 36,
        justifyContent: 'center',
        backgroundColor: '#F1F1F1',
    },
    monthStyle: {
        fontSize: 15,
        color: '#999999',
        marginLeft: 24,
    },
    listViewItemContain: {
        width: sr.w,
        backgroundColor: '#FFFFFF',
    },
    listTtemContainer: {
        flexDirection: 'row',
        width: sr.w,
        alignItems: 'center',
    },
    rowLeft: {
        marginLeft: 19,
    },
    headImg: {
        height: 40,
        width: 40,
        borderRadius: 20,
    },
    rowRight: {
        flex: 1,
        marginLeft: 14,
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    courseContent: {
        height: 70,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    rightTopStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nameText: {
        fontSize: 16,
        color: '#313131',
        fontWeight: '800',
    },
    postContainer: {
        height: 16,
        borderRadius: 2,
        marginLeft: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF7373',
    },
    positionText: {
        fontSize: 10,
        color: '#FFFFFF',
        fontFamily: 'STHeitiSC-Medium',
        marginHorizontal: 3,
    },
    courseText: {
        fontSize: 12,
        color: '#A7A7A7',
        fontWeight: '600',
        width: 220,
        marginTop: 10,
    },
    courseScore: {
        height: 70,
        justifyContent: 'center',
        marginRight: 15,
    },
    scoreStyle: {
        flexDirection: 'row',
    },
    scoreText: {
        fontSize: 24,
        color: '#FF6363',
        fontWeight: '600',
    },
    scoreText1: {
        fontSize: 16,
        fontWeight: '600',
        color: '#494949',
        marginBottom: 3,
        alignSelf: 'flex-end',
    },
    dateText: {
        fontSize: 10,
        color: '#A7A7A7',
        marginTop: 2,
        fontFamily: 'STHeitiSC-Light',
    },
    separator: {
        height: 1,
        width: sr.w,
        backgroundColor: '#EDEDED',
    },
});
