'use strict';

var React = require('react');
var ReactNative = require('react-native');
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
    doCloseFirst() {
        this.closeModal(()=>{
            this.props.doCloseFirst();
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
        return (
            <Animated.View style={[styles.overlayContainer, {opacity: this.state.opacity}]}>
                <View style={styles.container}>
                    <View style={styles.studyAwardBackgroundImage}>
                        <Image
                            resizeMode='stretch'
                            style={styles.overheadImage}
                            source={app.img.study_overhead}>
                            <Text style={styles.studyAwardTitle}>{'恭喜你完成一次'+this.props.title+'获得奖励'}</Text>
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
                            <Text style={styles.pointText}>{`获得赢销积分：${this.props.point}分`}</Text>
                        </View>
                    </View>
                    <TouchableHighlight
                        onPress={this.doCloseFirst}
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
        paddingBottom: 60,
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
        height:sr.w*3/4-25,
        borderRadius: 4,
        alignItems:'center',
        backgroundColor: '#FFFFFF'
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
        bottom: 35,
        alignItems: 'center',
    },
    nameText: {
        color: CONSTANTS.THEME_COLOR,
        fontSize:16,
        fontWeight: '400',
        marginBottom: 5,
    },
    pointStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    levelText: {
        fontSize:14,
        fontWeight: '500',
        marginBottom: 5,
        color: '#777777',
    },
    pointText: {
        fontSize:15,
        fontWeight: '500',
        color: CONSTANTS.THEME_COLOR,
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
