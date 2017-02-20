'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    View,
    Text,
    Image,
    StyleSheet,
    Navigator,
    ListView,
    TouchableOpacity,
    TouchableHighlight,
} = ReactNative;

var {DImage} = COMPONENTS;

module.exports = React.createClass({
    getInitialState() {
        this.allListUser = [];
        this.firstListUser = [];
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            dataSource: this.ds.cloneWithRows(this.firstListUser),
            isFirstUserList: true,
        };
    },
    componentDidMount() {
        let item = {};
        item.urlImg = '';
        item.userName = '222';
        item.post = '333';

        for (var i = 0; i < 5; i++) {
            let tempArray = [];
            for (var j = 0; j < 5; j++) {
                tempArray.push(item);
            }
            this.allListUser.push(tempArray);
            if (i == 0) {
                this.firstListUser.push(tempArray);
            }
        }

        this.userCount = 10;

        // process data
        if (this.props.userData && this.props.userData.length > 0) {
            let {userData} = this.props;
            this.allListUser = [];
            this.firstListUser = [];
            let tempArray = [];
            this.userCount = userData.length;

            for (var i = 0; i < userData.length; i++) {
                tempArray.push(userData[i]);
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
            if (this.allListUser.length == 0 && tempArray.length > 0) {
                this.allListUser.push(tempArray);
            }
        }
    },

    onPressAllUser() {
        this.setState({isFirstUserList:this.state.isFirstUserList===false});
    },
    renderRow(obj) {
        // 一行五个头。
        return (
            <View style={styles.itemListView}>
                {
                    obj.map((item, i)=>{
                        return (
                            <View style={styles.itemView}
                                  key={i}>
                                <DImage
                                    resizeMode='stretch'
                                    defaultSource={app.img.personal_head}
                                    source={item.urlImg?{uri:item.userImg}:app.img.personal_head}
                                    style={styles.itemImage} />
                                <Text style={styles.itemNameText}>{item.userName}</Text>
                                <Text style={styles.itemJobText}>{item.post}</Text>
                            </View>
                        )
                    })
                }
            </View>
        )
    },
    render() {
        let userList = [];
        if (this.state.isFirstUserList) {
            userList = this.firstListUser;
        }else {
            userList = this.allListUser;
        }
        return (
            <View>
                <View style={styles.separator}/>
                <View style={styles.listHeaderContainer}>
                    <Text style={styles.headText}>未提交的员工   (</Text>
                    <Text style={styles.headText}>{this.userCount}</Text>
                    <Text style={styles.headText}>人)</Text>
                </View>
                <View style={styles.separator1}/>
                <View style={styles.itemParentView}>
                    {
                        userList.map((item, i)=>{
                            return (
                                this.renderRow(item)
                            )
                        })
                    }
                </View>
                {
                    this.allListUser.length > 1 &&
                    <View>
                        <View style={styles.separator1}/>
                        <TouchableOpacity style={styles.btnView}
                            onPress={this.onPressAllUser}>
                            <Text style={styles.textBtn}>{this.state.isFirstUserList?'展开全部':'点击收起'}</Text>
                            <Image
                                resizeMode='stretch'
                                defaultSource={app.img.specopsBoss_moreData}
                                source={this.state.isFirstUserList?app.img.specopsBoss_moreData:app.img.specopsBoss_lessData}
                                style={styles.btnImage} />
                        </TouchableOpacity>
                    </View>
                }

            </View>
        )
    },
});


var styles = StyleSheet.create({
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
    itemImage: {
        height: 40,
        width: 40,
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
