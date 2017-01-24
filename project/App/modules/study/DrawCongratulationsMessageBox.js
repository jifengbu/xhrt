'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    StyleSheet,
    Text,
    Image,
    Animated,
    View,
    TextInput,
    TouchableHighlight,
} = ReactNative;

var {Button} = COMPONENTS;

var DrawCongratulations = React.createClass({
    doDrawAgain() {
        this.closeModal(()=>{
            this.props.doClose();
        });
    },
    doConfirm() {
        if (this.props.prizeContext.prize.prizeTypeCode!=10001) {
            this.closeModal(()=>{
                this.props.doClose();
            });
        } else {
            this.props.showDrawCongratulationsCompleteInfo();
        }
    },
    getInitialState() {
        return {
            opacity: new Animated.Value(0)
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
    render() {
        var notWinning = false;
        var contentStr = this.props.prizeContext.prize.name;
        if (contentStr.indexOf("啥都没有") >= 0 || contentStr.indexOf("未中奖") >= 0) {
            contentStr = '您未抽到任何奖励...';
            notWinning = true;
        }
        return (
            <Animated.View style={[styles.overlayContainer, {opacity: this.state.opacity}]}>
                <View style={styles.container}>
                    <Image
                        resizeMode='stretch'
                        source={app.img.draw_header}
                        style={styles.drawCongratulationsHeaderImage}>
                        <Text style={notWinning ? styles.content2 : styles.content}>
                            {'你的奖品是 '}<Text style={{color: 'red'}}> {contentStr}</Text>
                        </Text>
                        {
                            notWinning ?
                            <Text>
                            </Text>
                            :
                            <Image
                                resizeMode='contain'
                                defaultSource={app.img.common_default}
                                source={{uri:this.props.prizeContext.prize.img}}
                                style={styles.awardIcon}>
                            </Image>
                        }
                    </Image>
                    <View style={styles.drawCongratulationsButtonView}>
                        <Button
                            onPress={this.doDrawAgain}
                            style={styles.drawCongratulationsButtonLeft}>再抽一次</Button>
                        <Button
                            onPress={this.doConfirm}
                            style={styles.drawCongratulationsButtonRight}>确定</Button>
                    </View>
                </View>
                <View style={styles.topContainer}>
                    {
                        notWinning ?
                        <Text style={styles.notWinningText}>很遗憾</Text>
                        :
                        <Image
                            resizeMode='stretch'
                            source={app.img.draw_congratulations}
                            style={styles.drawCongratulationsImage}>
                        </Image>
                    }
                    <TouchableHighlight
                        onPress={this.doClose}
                        underlayColor="rgba(0, 0, 0, 0)"
                        style={styles.touchableCancel}>
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
var DrawCongratulationsCompleteInfo = React.createClass({
    doBack() {
        this.props.showDrawCongratulations();
    },
    doSubmit() {
        var data={
            name:this.state.name,
            phone:this.state.phone,
            address:this.state.address,
            lotteryId:this.props.prizeContext.lotteryId,
        };
        if (data.name=='') {
            Toast('信息不完整，请填写姓名');
            return;
        }
        if (!app.utils.checkPhone(data.phone)) {
            Toast('手机号码不是有效的手机号码');
            return;
        }
        if (data.address=='') {
            Toast('信息不完整，请填写地址');
            return;
        }
        this.closeModal(()=>{
            this.props.doSubmit(data);
        });
    },
    getInitialState() {
        return {
            opacity: new Animated.Value(0),
            name:'',
            phone:'',
            address:'',
        };
    },
    componentDidMount() {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 500,
        }
    ).start();
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
    }
).start(()=>{
    callback();
});
},
render() {
    return (
        <Animated.View style={[styles.overlayContainer, {opacity: this.state.opacity}]}>
            <View style={styles.totalContainer}>
                <View style={styles.container}>
                    <Image
                        resizeMode='stretch'
                        source={app.img.draw_header}
                        style={styles.drawCongratulationsHeaderImage}>
                        <Text style={styles.content}>你的奖品是 <Text style={{color: 'red'}}> {this.props.prizeContext.prize.name}</Text> </Text>
                        <Image
                            resizeMode='contain'
                            defaultSource={app.img.common_default}
                            source={{uri:this.props.prizeContext.prize.img}}
                            style={styles.awardIcon}>
                        </Image>
                    </Image>
                    <View style={styles.drawCongratulationsInfo}>
                        <Text style={styles.infoTitle}>请输入你的联系信息，我们的工作人员会联系你发奖</Text>
                        <TextInput
                            style={styles.infoInput}
                            onChangeText={(text) => this.setState({name:text})}
                            defaultValue={this.state.name}
                            placeholder={'请输入您的姓名'}
                            />
                        <TextInput
                            style={styles.infoInput}
                            onChangeText={(text) => this.setState({phone:text})}
                            defaultValue={this.state.phone}
                            placeholder={'请输入您的手机号'}
                            />
                        <TextInput
                            style={styles.infoInput}
                            onChangeText={(text) => this.setState({address:text})}
                            defaultValue={this.state.address}
                            placeholder={'请输入您的详细地址'}
                            />
                    </View>
                    <View style={styles.drawCongratulationsCompleteButtonView}>
                        <Button
                            onPress={this.doBack}
                            style={styles.drawCongratulationsButtonLeft}>返回</Button>
                        <Button
                            onPress={this.doSubmit}
                            style={styles.drawCongratulationsButtonRight}>提交</Button>
                    </View>
                </View>
                <View style={styles.topCompleteContainer}>
                    <Image
                        resizeMode='stretch'
                        source={app.img.draw_congratulations}
                        style={styles.drawCongratulationsImage}>
                    </Image>
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
                </View>
        </Animated.View>
    );
}
});
module.exports = React.createClass({
    getInitialState() {
        return {
            showType:this.props.showType
        };
    },
    showDrawCongratulations() {
        this.setState({showType:0});
    },
    showDrawCongratulationsCompleteInfo() {
        this.setState({showType:1});
    },
    render() {
        return (
            this.state.showType===0?
            <DrawCongratulations
                prizeContext={this.props.prizeContext}
                doClose={this.props.doClose}
                doDrawAgain={this.props.doDrawAgain}
                showDrawCongratulationsCompleteInfo={this.showDrawCongratulationsCompleteInfo}/>
            :
            <DrawCongratulationsCompleteInfo
                prizeContext={this.props.prizeContext}
                doClose={this.props.doClose}
                doSubmit={this.props.doSubmit}
                showDrawCongratulations={this.showDrawCongratulations}/>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        width:sr.w*5/6,
        alignItems:'center',
        justifyContent:'center',
    },
    totalContainer: {
        width:sr.w,
        paddingTop: 25,
        alignItems:'center',
        justifyContent:'center',
    },
    topContainer: {
        position:'absolute',
        width:sr.w*5/6,
        alignItems:'center',
        top:sr.h/2-155,
        right:30,
    },
    topCompleteContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width:sr.w,
        alignItems:'center',
    },
    drawCongratulationsHeaderImage: {
        width:sr.w*5/6,
        height:120,
        alignItems:'center',
        justifyContent:'center',
    },
    drawCongratulationsImage: {
        width:100,
        height:50,
        alignSelf:'center',
    },
    drawCongratulationsButtonView: {
        width:sr.w*5/6,
        height:70,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'peachpuff'
    },
    drawCongratulationsCompleteButtonView: {
        width:sr.w*5/6,
        height:60,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'peachpuff'
    },
    drawCongratulationsButtonRight: {
        width:sr.w*5/18,
        height:40,
        borderRadius: 6,
        marginHorizontal:20
    },
    drawCongratulationsButtonLeft: {
        width:sr.w*5/18,
        height:40,
        borderRadius: 6,
        marginHorizontal:20,
        backgroundColor:'#6ebe97'
    },
    drawCongratulationsInfo: {
        width:sr.w*5/6,
        height:180,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'peachpuff'
    },
    infoTitle: {
        paddingHorizontal:50,
        marginVertical:2,
        color: CONSTANTS.THEME_COLOR,
        fontSize: 14,
        textAlign:'center',
        fontWeight: '100',
        overflow: 'hidden',
    },
    infoInput: {
        height:35,
        width: sr.w*3/4,
        marginHorizontal:10,
        marginVertical:2,
        paddingVertical: -3,
        backgroundColor: '#FFFFFF',
        borderColor:'gray',
        borderWidth:1,
        borderRadius: 6,
        fontSize:13,
        paddingLeft:10
    },
    content: {
        marginTop:30,
        color: 'black',
        fontSize: 18,
        textAlign:'center',
        fontWeight: '100',
        overflow: 'hidden',
    },
    content2: {
        marginTop:45,
        color: 'black',
        fontSize: 18,
        textAlign:'center',
        fontWeight: '100',
        overflow: 'hidden',
    },
    overlayContainer: {
        position:'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
    touchableHighlight: {
        position:'absolute',
        top: 10,
        left:sr.w*5/6+5,
        width: 38,
        height: 38,
    },
    touchableCancel: {
        position:'absolute',
        top: app.isandroid?5:15,
        left:sr.w*5/6-22,
        width: 38,
        height: 38,
    },
    closeIcon: {
        width: 38,
        height: 38
    },
    awardIcon: {
        width: 50,
        height: 50,
        marginVertical:10
    },
    notWinningText: {
        fontSize: 25,
        alignSelf:'center',
        color: 'blue',
        marginTop: app.isandroid?40:55,
    },
});
