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
            excellent&&listData.push(excellent);
            good&&listData.push(good);
            medium&&listData.push(medium);
            poor&&listData.push(poor);
            this.setState({dataSource: this.ds.cloneWithRows(listData)});
        }
    },
    renderRow(obj) {
        let title = obj.sectionMax + '~' + obj.sectionMin + ' (分) ' + obj.number + ' 次';
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
                            let headUrl = item.userImg?item.userImg:app.img.common_default;
                            return (
                                <View key={i} style={styles.listViewItemContain}>
                                    <View style={styles.listTtemContainer}>
                                        <View style={styles.rowLeft}>
                                            <Image
                                                resizeMode='stretch'
                                                defaultSource={app.img.common_default}
                                                source={item.userImg?{uri: headUrl}:headUrl}
                                                style={styles.headImg} />
                                        </View>
                                        <View style={styles.rowRight}>
                                            <View style={styles.courseContent}>
                                                <View style={styles.rightTopStyle}>
                                                    <Text numberOfLines={1} style={styles.nameText} >
                                                        {item.userName}
                                                    </Text>
                                                    <View style={styles.postContainer}>
                                                        <Text numberOfLines={1} style={styles.positionText} >
                                                            {item.post}
                                                        </Text>
                                                    </View>
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
                                                    {item.submitTime}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    {
                                        obj.userList.length-1!=i&&<View style={styles.separator} />
                                    }
                                </View>
                            )
                        })
                    }
                </View>
            </View>
        )
    },
    render() {
        return (
            <View style={styles.container}>
                <ListView
                    initialListSize={1}
                    enableEmptySections={true}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    />
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
    },
    nameText: {
        fontSize: 16,
        color: '#313131',
        fontWeight: '800',
    },
    postContainer: {
        height: 16,
        borderRadius: 2,
        marginLeft: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF7373',
    },
    positionText: {
        fontSize: 10,
        color: '#FFFFFF',
        fontFamily: 'STHeitiSC-Medium',
        paddingHorizontal: 5,
    },
    courseText: {
        fontSize: 12,
        color: '#A7A7A7',
        fontWeight: '600',
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
