'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    StyleSheet,
    Text,
    Animated,
    ListView,
    View,
    TouchableHighlight,
    Image,
} = ReactNative;
const { Button, DImage } = COMPONENTS;

module.exports = React.createClass({
    doExit () {
        this.closeModal(() => {
            this.props.doExit();
        });
    },
    doRestart () {
        this.closeModal(() => {
            this.props.doRestart();
        });
    },
    getInitialState () {
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return {
            opacity: new Animated.Value(0),
            dataSource: ds.cloneWithRows(this.props.rankList),
        };
    },
    componentDidMount () {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 500,
        }).start();
    },
    closeModal (callback) {
        Animated.timing(this.state.opacity, {
            toValue: 0,
            duration: 500,
        }).start(() => {
            callback();
        });
    },
    renderRow (obj) {
        return (
            <View style={styles.row}>
                <View style={styles.rowLeft}>
                    <Image
                        resizeMode='cover'
                        defaultSource={app.img.personal_head}
                        source={{ uri:obj.userInfo.userImg }}
                        style={styles.icon} />
                </View>
                <View style={styles.rowRight}>
                    <View style={styles.rowRightUserView}>
                        <Text style={styles.rowTitle} >
                            {obj.userInfo.userName}
                        </Text>
                        <Text style={styles.scoreText} >
                            {'平均分:'}
                        </Text>
                        <Text style={styles.scoreText1} >
                            {obj.score + '分'}
                        </Text>
                    </View>
                    <Text style={styles.userAliasText} >
                        {obj.userInfo.userAlias}
                    </Text>
                </View>
            </View>
        );
    },
    render () {
        return (
            <Animated.View style={[styles.overlayContainer, { opacity: this.state.opacity }]}>
                <View style={styles.container}>
                    <View style={styles.headerView}>
                        <Text style={styles.title}>本轮排名</Text>
                    </View>
                    <ListView                        initialListSize={1}
                        enableEmptySections
                        style={styles.list}
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow}
                            />
                    <View style={styles.trainRankButtonView}>
                        <Button
                            onPress={this.doExit}
                            style={styles.trainRankButtonExit}
                            textStyle={styles.trainRankButtonExitText}>退出</Button>
                        <Button
                            onPress={this.doRestart}
                            style={styles.trainRankButtonReStart}>重新开始</Button>
                    </View>
                </View>
            </Animated.View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        width:sr.w * 7 / 8,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: 'white',
    },
    headerView: {
        width:sr.w * 7 / 8,
        height:50,
        backgroundColor:'white',
        alignItems:'center',
        justifyContent:'center',
    },
    title: {
        color: 'black',
        fontSize: 18,
        textAlign: 'center',
        overflow: 'hidden',
    },
    list: {
        width:sr.w * 7 / 8,
        backgroundColor:'white',
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowLeft: {
        flex: 1,
    },
    icon: {
        marginHorizontal:10,
        marginVertical:5,
        width: 50,
        height: 50,
        borderRadius:25,
        borderColor:'#A62045',
        borderWidth:2,
    },
    rowRight: {
        flex: 5,
        marginTop: -15,
        marginLeft: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowRightUserView: {
        flexDirection: 'row',
        alignSelf:'flex-start',
    },
    rowTitle: {
        fontSize:14,
        color:'black',
    },
    userAliasText: {
        marginTop: 2,
        color:'gray',
        alignSelf:'flex-start',
        fontSize: 11,
    },
    scoreText: {
        color:'gray',
        position:'absolute',
        left: 150,
    },
    scoreText1: {
        color:'#A62045',
        position:'absolute',
        left: 210,
    },
    overlayContainer: {
        position:'absolute',
        bottom: 0,
        alignItems:'center',
        justifyContent: 'center',
        width:sr.w,
        height:sr.ch,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    trainRankButtonView: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'white',
    },
    trainRankButtonExit: {
        flex:1,
        height:45,
        marginTop:20,
        borderRadius:0,
        borderTopColor:'#A62045',
        borderTopWidth:1,
        borderBottomColor:'#A62045',
        borderBottomWidth:1,
        backgroundColor: 'white',
    },
    trainRankButtonExitText: {
        color: '#A62045',
    },
    trainRankButtonReStart: {
        flex:1,
        height:45,
        marginTop:20,
        borderRadius:0,
        borderWidth:1,
        borderColor:'#A62045',
    },
});
