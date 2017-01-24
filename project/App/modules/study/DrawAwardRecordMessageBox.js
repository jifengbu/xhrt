'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    StyleSheet,
    Text,
    Image,
    Animated,
    ListView,
    View,
    TouchableHighlight,
} = ReactNative;
var {Button} = COMPONENTS;

module.exports = React.createClass({
    doBuyIntegral() {
        this.closeModal();
    },
    getInitialState() {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            isNull: !this.props.recordList.length,
            opacity: new Animated.Value(0),
            dataSource: ds.cloneWithRows(this.props.recordList),
        };
    },
    componentDidMount() {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 500,
        }).start();
    },
    doClose() {
        this.closeModal(()=>{
            this.props.doClose();
        });
    },
    closeModal(callback) {
        Animated.timing(this.state.opacity, {
            toValue: 0,
            duration: 500,
        }).start(()=>{
            callback();
        });
    },
    renderSeparator(sectionID, rowID) {
        return (
            <View
                style={styles.separator}
                key={rowID}/>
        );
    },
    renderRow(obj) {
        return (
            <View>
                <TouchableHighlight
                    underlayColor="#EEB422">
                    <View style={styles.row}>
                        <View style={styles.rowLeft}>
                            <Image
                                resizeMode='contain'
                                source={{uri:obj.goodsImage}}
                                style={styles.icon} />
                        </View>
                        <View style={styles.rowRight}>
                            <Text style={styles.rowTitle} >
                                {'奖品 '+obj.goodsName}
                            </Text>
                            <Text style={styles.content} >
                                {'获奖时间 '+obj.lotteryTime}
                            </Text>
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        )
    },
    render() {
        return (
            <Animated.View style={[styles.overlayContainer, {opacity: this.state.opacity}]}>
                <View style={styles.container}>
                    <Image
                        resizeMode='stretch'
                        source={app.img.draw_header}
                        style={[styles.drawHeaderImage,{height:50}]}>
                        <Text style={styles.title}>获奖记录</Text>
                    </Image>
                    <View style={styles.drawRecordBottomView}>
                        {
                            this.state.isNull ?
                            <View style={styles.textStyleView}>
                                <Text style={styles.textStyle}>暂未获得任何奖励</Text>
                            </View>
                            :
                            <ListView                                initialListSize={1}
                                enableEmptySections={true}
                                style={styles.list}
                                dataSource={this.state.dataSource}
                                renderRow={this.renderRow}
                                renderSeparator={this.renderSeparator}
                                />
                        }
                    </View>
                    <TouchableHighlight
                        onPress={this.doClose}
                        underlayColor="rgba(0, 0, 0, 0)"
                        style={styles.touchableHighlight}>
                        <Image
                            resizeMode='contain'
                            source={app.img.draw_back}
                            style={styles.closeIcon}>
                        </Image>
                    </TouchableHighlight>
                </View>
            </Animated.View>
        );
    }
});


var styles = StyleSheet.create({
    container: {
        alignItems:'center',
        justifyContent:'center',
    },
    drawHeaderImage: {
        width:sr.w*5/6,
        height:100,
        alignItems:'center',
        justifyContent:'center',
    },
    title: {
        color: 'red',
        fontSize: 18,
        fontWeight: '100',
        textAlign: 'center',
        overflow: 'hidden',
    },
    drawRecordBottomView: {
        width:sr.w*5/6,
        height:200,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#ffc89c'
    },
    list: {
        width:sr.w*5/6-10,
        height:190,
        alignSelf:'stretch',
        margin:5,
        backgroundColor:'white',
        borderRadius:4,
    },
    textStyle: {
        fontSize: 15,
        color: '#000000',
    },
    textStyleView: {
        alignSelf:'center',
        justifyContent:'center',
        alignItems: 'center',
        margin:5,
        width:sr.w*5/6,
        height:200,
        backgroundColor: '#FFFFFF',
    },
    row: {
        height:80,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowLeft: {
        height:80,
        flex: 1,
    },
    icon: {
        marginHorizontal:10,
        marginVertical:10,
        width:50,
        height: 50,
    },
    rowRight: {
        height:80,
        flex: 4,
        marginLeft: 15,
        justifyContent: 'center',
    },
    rowTitle: {
        fontSize:16,
        color:'black',
    },
    content: {
        color:'gray',
        marginTop: 10,
    },
    overlayContainer: {
        position:'absolute',
        bottom: 0,
        alignItems:'center',
        justifyContent: 'center',
        width:sr.w,
        height:sr.h,
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
    touchableHighlight: {
        position:'absolute',
        top:-12,
        left:sr.w*5/6-20,
        width: 38,
        height: 38,
    },
    closeIcon: {
        width: 38,
        height: 38
    },
    separator: {
        height:2,
        backgroundColor: '#CCC'
    },
});
