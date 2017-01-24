'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  View,
  Text,
  TouchableOpacity,
  ListView,
  ScrollView,
  Clipboard,
  Image,
  StyleSheet
} = ReactNative;


module.exports = React.createClass({
    changeTab(tabIndex) {
        var adminArray = this.lists["adminArray"+tabIndex];
        this.setState({tabIndex, adminArray: adminArray});
    },
    changeIDTab(tabIndexID) {
        this.setState({tabIndexID});
    },
    getInitialState() {
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            tabIndex: 0,
            tabIndexID: 0,
            adminArray:[],
            dataSource: this.ds.cloneWithRows([]),
        };
    },
    renderSeparator(sectionID, rowID) {
        return (
            <View
                style={styles.separator}
                key={rowID}/>
        );
    },
    componentWillMount() {
        this.lists = {
            adminArray0:[],
            adminArray1:[],
        };
    },
    componentDidMount() {
        this.getPackageItem(0);
        this.getPackageItem(1);
    },
    getPackageItem(tabIndex) {
        var param = {
            type: tabIndex+'',
            userID: app.personal.info.userID,
        };
        POST(app.route.ROUTE_MY_INVIATION_CODE_DETAIL, param, this.getMyInvitationCodeDetailSuccess.bind(null, tabIndex));
    },
    getMyInvitationCodeDetailSuccess(tabIndex, data) {
        if (data.success) {
            var adminArray = data.context.adminArray||[];
            this.lists["adminArray"+tabIndex] = adminArray;
            if (this.state.tabIndex === tabIndex) {
                this.setState({adminArray: adminArray});
            }
        } else {
            Toast(data.msg);
        }
    },
    DetailContent() {
        return (
            <View style={styles.container}>
                {
                    this.state.adminArray!=null?
                    <View style={styles.container}>
                        <View style={styles.scrollImageStyle}>
                            <ScrollView horizontal={true} style={styles.changeTabContainer}>
                                {
                                    this.state.adminArray.map((item, i)=>{
                                        return (
                                            <TouchableOpacity
                                                key={i}
                                                onPress={this.changeIDTab.bind(null, i)}
                                                style={[styles.tabButtonLeft, this.state.adminArray.length<3?{flex: 1}:{width: 120}]}>
                                                <Text style={[styles.tabText, this.state.tabIndexID===i?{color:'#239fdb'}:null]} >{item.adminID}</Text>
                                                <View style={[styles.tabLine, this.state.tabIndexID===i?{backgroundColor: '#239fdb'}:null]}>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                             </ScrollView>
                         </View>
                         {
                             this.state.adminArray.map((item, i)=>{
                                 return (
                                     <DetailData
                                         key={i}
                                         adminContent={item.adminContent}
                                         style={this.state.tabIndexID===i?{flex:1}:{left:-sr.tw, top:0, position:'absolute'}}
                                         />
                                 )
                             })
                         }
                     </View>:null
                }
            </View>
        )
    },
    render() {
        var isFirstTap = this.state.tabIndex===0;
        return (
            <View style={this.props.style}>
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        onPress={this.changeTab.bind(null, 0)}
                        style={[styles.tabButton, isFirstTap?{backgroundColor:'#4FC1E9'}:{backgroundColor:'gray'}]}>
                        <Text style={[styles.tabText, isFirstTap?{color:'#FFFFFF'}:null]} >免费的</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.changeTab.bind(null, 1)}
                        style={[styles.tabButton, !isFirstTap?{backgroundColor:'#4FC1E9'}:{backgroundColor:'gray'}]}>
                        <Text style={[styles.tabText, !isFirstTap?{color:'#FFFFFF'}:null]} >收费的</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.makeup}>
                    <this.DetailContent tabIndex={0} style={isFirstTap?{flex:1}:{left:-sr.tw, top:0, position:'absolute'}}/>
                </View>
            </View>
        );
    }
});

var DetailData = React.createClass({
    componentWillMount() {
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    },
    renderSeparator(sectionID, rowID) {
        return (
            <View
                style={styles.separator}
                key={rowID}/>
        );
    },
    renderRowYes(obj) {
        return (
            <View style={styles.panelContainer}>
                <Text style={[styles.codeText, {marginLeft:10}]}>{obj.sonCodeNu+' 已经成功绑定'}</Text>
                <Image
                    resizeMode='cover'
                    style={styles.headerIcon}
                    defaultSource={app.img.personal_head}
                    source={{uri: obj.userImg}} />
                <Text numberOfLines={1} style={styles.codeText}>
                    {obj.userName}
                </Text>
            </View>
        )
    },
    copyCodeToClipboard(code) {
         Clipboard.setString(code);
         Toast("该邀请码("+code+")复制成功");
    },
    renderRowNo(obj) {
        return (
            <TouchableOpacity onLongPress={this.copyCodeToClipboard.bind(null, obj)}>
                <View style={styles.panelContainer}>
                    <Text style={[styles.codeText, {marginLeft:20}]}>{obj}</Text>
                </View>
            </TouchableOpacity>
        )
    },
    render() {
        return (
            <ScrollView style={this.props.style}>
                <View style={styles.describeContainer}>
                    <View style={{flexDirection: 'row', marginLeft: 10}}>
                        <Text style={styles.describeText}>{'你拥有 '}</Text>
                        <Text style={[styles.describeText, {color: 'red'}]}>{this.props.adminContent.freeCodeNum}</Text>
                        <Text style={styles.describeText}>{' 个邀请码，该码使用权限为1年'}</Text>
                    </View>
                    <Text style={[styles.describeText, {marginHorizontal: 10}]}>长按邀请码复制给你的好友，在其个人中心进行绑定</Text>
                </View>
                <Text style={styles.numText}>{'已使用的邀请码: '+this.props.adminContent.freeCodeUsedNum}</Text>
                <View style={styles.listViewStyle}>
                    {
                        this.props.adminContent.freeCodeUsedNum!=0?
                        <ListView
                            initialListSize={1}
                            pageSize={50}
                            enableEmptySections={true}
                            removeClippedSubviews={true}
                            style={styles.list}
                            dataSource={this.ds.cloneWithRows(this.props.adminContent.freeCodeUsedList)}
                            renderRow={this.renderRowYes}
                            renderSeparator={this.renderSeparator}
                            />:<Text style={{alignSelf: 'center', marginVertical: 10,color:'gray'}}>暂无好友绑定!</Text>
                    }

                </View>
                <Text style={styles.numText}>{'未使用的邀请码: '+(this.props.adminContent.freeCodeNum-this.props.adminContent.freeCodeUsedNum)}</Text>
                <View style={styles.listViewStyle}>
                    <ListView
                        initialListSize={1}
                        pageSize={50}
                        enableEmptySections={true}
                        removeClippedSubviews={true}
                        style={[styles.list, {paddingBottom: 150}]}
                        dataSource={this.ds.cloneWithRows(this.props.adminContent.freeCodeUsedArray)}
                        renderRow={this.renderRowNo}
                        renderSeparator={this.renderSeparator}
                        />
                </View>
            </ScrollView>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabContainer: {
        height: 60,
        marginTop: 10,
        marginLeft:20,
        width: 140,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    tabButton: {
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:35,
        borderWidth: 0.1,
        borderColor: '#EEEEEE',
        marginHorizontal:5,
    },
    tabText: {
        fontSize: 16,
    },
    makeup: {
        top: 55,
        width:sr.w,
        height:sr.h-55,
        position: 'absolute'
    },
    scrollImageStyle: {
        paddingTop: 10,
        width:sr.w,
    },
    changeTabContainer: {
        flexDirection: 'row',
        backgroundColor: '#feffff',
    },
    tabButtonLeft: {
        height: 50,
        alignItems:'center',
        justifyContent:'center',
    },
    tabButtonCenter: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
    },
    tabLine: {
        width: 120,
        height: 3,
        marginTop: 10,
        alignSelf: 'center',
    },
    describeContainer: {
        width: sr.w,
        height: 50,
        marginTop: 10,
        justifyContent: 'center',
        backgroundColor: '#feffff',
    },
    describeText: {
        fontSize: 14,
        color: 'grey',
    },
    numText: {
        marginTop: 20,
        color: '#239fdb',
        fontSize: 14,
        marginLeft: 20,
    },
    listViewStyle: {
        backgroundColor: '#feffff',
        width: sr.w,
    },
    list: {
        alignSelf:'stretch',
    },
    separator: {
        height: 1,
        backgroundColor: '#EEEEEE'
    },
    panelContainer: {
        width: sr.w,
        height: 50,
        alignItems: 'center',
        flexDirection: 'row',
    },
    codeText: {
        fontSize: 16,
        color: 'grey',
    },
    headerIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginLeft: 5,
    },
});
