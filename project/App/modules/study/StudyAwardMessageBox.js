'use strict';

var React = require('react');var ReactNative = require('react-native');
var {
    StyleSheet,
    Text,
    Image,
    Animated,
    View,
    TouchableHighlight,
} = ReactNative;
var {Button, DImage} = COMPONENTS;
module.exports = React.createClass({
    doDraw() {
        this.closeModal(()=>{
            this.props.doDraw();
        });
    },
    doShare() {
        this.closeModal(()=>{
            this.props.doShare(this.props.makePoint);
        });
    },
    getInitialState() {
        return {
            opacity: new Animated.Value(0),
            info: app.personal.info,
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
        var showMakePoint = true;
        if (this.props.makePoint == 0) {
            showMakePoint = false;
        }
        return (
            <Animated.View style={[styles.overlayContainer, {opacity: this.state.opacity}]}>
                <View style={styles.container}>
                    <View
                        resizeMode='stretch'
                        source={app.img.study_popup}
                        style={styles.studyAwardBackgroundImage}>
                        <Image
                            resizeMode='stretch'
                            style={styles.overheadImage}
                            source={app.img.study_overhead}>
                            <Text style={styles.studyAwardTitle}>恭喜你完成本节课程的学习</Text>
                        </Image>
                        <Image
                            resizeMode='stretch'
                            source={app.img.study_balloon}
                            style={styles.studyAwardBalloonImage}>
                            <DImage
                                resizeMode='cover'
                                defaultSource={app.img.personal_head}
                                source={{uri: this.state.info.headImg}}
                                style={styles.studyAwardHeadImage}>
                            </DImage>
                        </Image>
                        <View style={styles.bottomView}>
                            <Text style={styles.levelText}>等级：{this.state.info.level}{'  '}{this.state.info.alias}</Text>
                            {
                                showMakePoint ?
                                <Text style={{color:'#777777',fontSize:13}}>获得赢销积分：+{this.props.makePoint}分</Text>
                                :<View style={{marginVertical: 3}}></View>
                            }
                            <Text style={styles.pointText}>获得一次抽奖机会!</Text>
                            <Button
                                onPress={this.doDraw}
                                textStyle={styles.drawText}
                                style={styles.studyAwardBtnDraw}>现在抽奖</Button>
                            <Button
                                onPress={this.doShare}
                                style={styles.studyAwardBtnShare}
                                textStyle={styles.awardText}>分享成果</Button>
                        </View>
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
        paddingBottom: 55,
        alignItems:'center',
        justifyContent:'center'
    },
    studyAwardTitle: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '900',
        alignSelf:'flex-start',
        overflow: 'hidden',
        marginTop:10,
        marginLeft:10,
        backgroundColor: 'transparent',
    },
    studyAwardBackgroundImage: {
        width:sr.w*5/6,
        height:sr.w*12/13+10,
        alignItems:'center',
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
    },
    overheadImage: {
        width:sr.w*5/6,
        height: (sr.w*3/4-25)/2,
    },
    studyAwardBalloonImage: {
        position: 'absolute',
        left: sr.w*5/12-sr.w/6,
        top: 30,
        width:sr.w/3,
        height:sr.w/3,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    studyAwardHeadImage: {
        width:sr.w*5/24,
        height:sr.w*5/24,
        borderRadius: sr.w*5/48,
    },
    bottomView: {
        flex: 1,
        position: 'absolute',
        left: sr.w*5/12-sr.w/6,
        bottom: 20,
        alignItems: 'center',
    },
    nameText: {
        color: CONSTANTS.THEME_COLOR,
        marginTop: 10,
        fontSize:16,
    },
    levelText: {
        fontSize:14,
        fontWeight: '500',
        color: '#777777',
    },
    pointText: {
        fontSize:14,
        fontWeight: '500',
        color: CONSTANTS.THEME_COLOR,
    },
    drawText: {
        fontSize: 15,
        fontWeight: '700',
    },
    studyAwardBtnDraw: {
        height: 45,
        width: 140,
        borderRadius: 4,
        marginTop: 20,
    },
    studyAwardBtnShare: {
        height: 30,
        width: 90,
        marginTop: 15,
        backgroundColor:'#bf9f62',
        borderRadius: 4,
    },
    awardText: {
        fontSize: 11,
        fontWeight: '500',
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
        left:sr.w*5/6-24,
        width: 38,
        height: 38,
    },
    closeIcon: {
        width: 38,
        height: 38
    },
});
