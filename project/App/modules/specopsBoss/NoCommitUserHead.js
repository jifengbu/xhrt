'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    View,
    Text,
    Image,
    StyleSheet,
    Navigator,
    ListView,
    TouchableOpacity,
    TouchableHighlight,
} = ReactNative;

const { DImage } = COMPONENTS;
const SpecopsPerson = require('./SpecopsPerson.js');

module.exports = React.createClass({
    getInitialState () {
        this.allListUser = [];
        this.firstListUser = [];
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return {
            dataSource: this.ds.cloneWithRows(this.firstListUser),
            isFirstUserList: true,
            haveData: false,
        };
    },
    componentDidMount () {
        // const item = {};
        // item.userId = '';
        // item.urlImg = '';
        // item.userName = '222';
        // item.post = '333';
        //
        // for (let i = 0; i < 5; i++) {
        //     const tempArray = [];
        //     for (let j = 0; j < 5; j++) {
        //         tempArray.push(item);
        //     }
        //     this.allListUser.push(tempArray);
        //     if (i == 0) {
        //         this.firstListUser.push(tempArray);
        //     }
        // }
        // this.userCount = 10;

        // process data
        if (this.props.userData && this.props.userData.length > 0) {
            const tempUserData = this.props.userData.slice(0);
            this.allListUser = [];
            this.firstListUser = [];
            let tempArray = [];
            this.userCount = tempUserData.length;

            for (let i = 0; i < tempUserData.length; i++) {
                tempArray.push(tempUserData[i]);
                if (tempArray.length == 5) {
                    if (this.firstListUser.length == 0) {
                        this.firstListUser.push(tempArray);
                    }
                    this.allListUser.push(tempArray);
                    tempArray = [];
                }
            }
            if (this.firstListUser.length == 0 && tempArray.length > 0) {
                this.firstListUser.push(tempArray);
            }
            if (tempArray.length > 0) {
                this.allListUser.push(tempArray);
            }
        }
        setTimeout(() => {
            this.setState({ haveData: true });
        }, 200);
    },
    toSpecopsPerson (strUserId) {
        app.navigator.push({
            component: SpecopsPerson,
            passProps: { userID: strUserId },
        });
    },
    onPressAllUser () {
        this.setState({ isFirstUserList:this.state.isFirstUserList === false });
    },
    renderRow (obj, i) {
        // 一行五个头。
        return (
            <View key={i} style={styles.itemListView}>
                {
                    obj.map((item, i) => {
                        const headUrl = item.userImg ? item.userImg : item.sex === 1 ? app.img.personal_sex_male : app.img.personal_sex_female;
                        return (
                            <View style={styles.itemView}
                                key={i}>
                                <TouchableOpacity style={styles.itemTouch} onPress={this.toSpecopsPerson.bind(null, item.userId)}>
                                    <DImage
                                        resizeMode='cover'
                                        defaultSource={app.img.personal_head}
                                        source={item.userImg ? { uri: headUrl } : headUrl}
                                        style={styles.itemImage} />
                                    <Text style={styles.itemNameText} numberOfLines={1}>{item.userName}</Text>
                                    <Text style={styles.itemJobText} numberOfLines={1}>{item.post}</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })
                }
            </View>
        );
    },
    render () {
        let userList = [];
        if (this.state.isFirstUserList) {
            userList = this.firstListUser;
        } else {
            userList = this.allListUser;
        }
        return (
            <View>
                {
                    userList.length > 0 && this.state.haveData &&
                    <View>
                        <View style={styles.separator} />
                        <View style={styles.listHeaderContainer}>
                            <Text style={styles.headText}>未提交的员工   (</Text>
                            <Text style={styles.headText}>{this.userCount}</Text>
                            <Text style={styles.headText}>人)</Text>
                        </View>
                        <View style={styles.separator1} />
                        <View style={styles.itemParentView}>
                            {
                                userList.map((item, i) => {
                                    return (
                                        this.renderRow(item, i)
                                    );
                                })
                            }
                        </View>
                    </View>
                }
                {
                    this.allListUser.length > 1 && this.state.haveData &&
                    <View>
                        <View style={styles.separator1} />
                        <TouchableOpacity style={styles.btnView}
                            onPress={this.onPressAllUser}>
                            <Text style={styles.textBtn}>{this.state.isFirstUserList ? '展开全部' : '点击收起'}</Text>
                            <Image
                                resizeMode='stretch'
                                defaultSource={app.img.specopsBoss_moreData}
                                source={this.state.isFirstUserList ? app.img.specopsBoss_moreData : app.img.specopsBoss_lessData}
                                style={styles.btnImage} />
                        </TouchableOpacity>
                    </View>
                }
            </View>
        );
    },
});

const styles = StyleSheet.create({
    separator: {
        height:10,
        backgroundColor:'#F1F1F1',
    },
    separator1: {
        height:2,
        backgroundColor:'#F1F1F1',
        // backgroundColor:'red',
    },
    listHeaderContainer: {
        height:40,
        alignItems: 'center',
        flexDirection:'row',
        backgroundColor:'#FFFFFF',
        paddingLeft: 20,
    },
    headText: {
        color:'#333333',
        fontSize: 18,
        fontFamily:'STHeitiSC-Medium',
    },
    listStyle: {
        flex: 1,
        backgroundColor: 'blue',
    },
    btnView: {
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection:'row',
        backgroundColor:'#FFFFFF',
    },
    textBtn: {
        color:'#4E99E7',
        fontSize: 14,
        fontFamily:'STHeitiSC-Medium',
        marginRight: 10,
    },
    btnImage: {
        height: 6,
        width: 8,
    },
    itemListView: {
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    itemParentView: {
        backgroundColor:'#FFFFFF',
    },
    itemView: {
        flex: 1,
        alignItems: 'center',
        // justifyContent: 'space-between',
        backgroundColor:'#FFFFFF',
        marginVertical: 10,
    },
    itemTouch: {
        alignItems: 'center',
        // justifyContent: 'space-between',
    },
    itemImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    itemNameText: {
        color:'#333333',
        fontSize: 14,
        fontFamily:'STHeitiSC-Medium',
    },
    itemJobText: {
        color:'#818181',
        fontSize: 10,
        fontFamily:'STHeitiSC-Medium',
    },
});
