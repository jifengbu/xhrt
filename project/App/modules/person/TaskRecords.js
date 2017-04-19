'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
} = ReactNative;

const { Button, PageList } = COMPONENTS;

module.exports = React.createClass({
    statics: {
        title: '任务记录',
    },
    renderRow (obj, sectionID, rowID) {
        return (
            <View style={styles.row}>
                <ItemListView obj={obj} rowID={rowID} />
            </View>
        );
    },
    render () {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.container}>
                    <View style={styles.backgroundStyle}>
                        <Image
                            resizeMode='cover'
                            source={app.img.personal_background_1}
                            style={styles.backgroundStyle1}>
                            <View style={styles.textViewStyle}>
                                <Text style={styles.titleStyle}>
                                    赢销截拳道
                                </Text>
                            </View>
                            <View style={styles.textViewStyle1}>
                                <Text style={styles.titleStyle1}>
                                    我的成长之路
                                </Text>
                            </View>
                        </Image>
                    </View>
                    <PageList
                        renderRow={this.renderRow}
                        listParam={{ userID: app.personal.info.userID }}
                        listName='taskList'
                        renderSeparator={() => null}
                        listUrl={app.route.ROUTE_SUBMIT_GETMYTASKRECORD}
                        />
                </ScrollView>
            </View>

        );
    },
});

const Item = React.createClass({
    render () {
        return (
            <View style={{ flex: 2, flexDirection: 'row', marginTop: 5, marginBottom: 10 }}>
                <Text style={styles.myText}>
                    {this.props.children}
                </Text>
            </View>
        );
    },
});

const ItemListView = React.createClass({
    render () {
        const { obj } = this.props;
        const modules = [
            '分享了 ' + obj.share + ' 次',
            '看完了 ' + obj.wacthVedio + ' 个视频',
            '观看了 ' + obj.cases + ' 个优秀案例',
            '发表了了 ' + obj.publish + ' 个精彩评论',
        ];
        return (
            <View style={{ flexDirection: 'row', backgroundColor: '#FFFFFF' }}>
                <View style={{ flexDirection: 'column', backgroundColor: '#FFFFFF', width:60 }}>
                    <View style={[styles.lineStyle, { height: 12 }]} />
                    <Image
                        resizeMode='contain'
                        source={this.props.rowID == 0 ? app.img.personal_time_1 : this.props.rowID == 1 ? app.img.personal_time_2 : app.img.personal_time_3}
                        style={styles.iconStyle} />
                    <View style={[styles.lineStyle, { height: 120 }]} />
                </View>
                <View style={styles.container}>
                    <View style={styles.dateStyle}>
                        <Text style={[styles.leftTime, this.props.rowID == 0 ? { color: '#BDA066' } : this.props.rowID == 1 ? { color: '#229573' } : { color: 'black' }]}>
                            {this.props.obj.date}
                        </Text>
                    </View>
                    <View style={{ backgroundColor: '#FFFFFF' }}
                        >
                        {
                            modules.map((item, i) => {
                                return (
                                    <Item key={i}>
                                        {item}
                                    </Item>
                                );
                            })
                        }
                    </View>
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
    myText:{
        flex: 1,
        color: 'black',
        marginRight: 10,
        marginLeft: 5,
        marginTop: -4,
        fontSize:14,
    },
    row: {
        flexDirection: 'row',
        width: sr.w,
    },
    backgroundStyle: {
        width: sr.w,
        height: 145,
        marginBottom: 10,
    },
    backgroundStyle1: {
        width: sr.w,
        height: 145,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    textViewStyle: {
        width: sr.w,
        height: 40,
        marginTop: 30,
        marginLeft: 70,
    },
    dateStyle: {
        marginTop: 5,
        width: sr.w - 60,
        height: 40,
        backgroundColor:'#FFFFFF',
        flexDirection: 'row',
    },
    lineStyle: {
        width: 2,
        alignSelf: 'center',
        backgroundColor:'#EEEEEE',
    },
    textViewStyle1: {
        width: sr.w,
        height: 30,
        marginLeft: 70,
    },
    leftTime: {
        fontSize: 15,
        fontWeight: '900',
        alignSelf: 'center',
    },
    leftTime1: {
        fontSize: 10,
        fontWeight: '900',
        alignSelf: 'center',
    },
    titleStyle: {
        color: '#FFFFFF',
        fontSize: 30,
    },
    titleStyle1: {
        color: '#FFFFFF',
        fontSize: 14,
    },
    iconStyle: {
        width: 15,
        height: 15,
        marginVertical: 5,
        alignSelf: 'center',
    },
    right_Container: {
        flex: 1,
    },
    text_title: {
        flex: 1,
        color: 'black',
        marginRight: 10,
        marginLeft: 5,
        marginTop: -4,
    },
});
