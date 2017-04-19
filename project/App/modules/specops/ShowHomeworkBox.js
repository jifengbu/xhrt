'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    Text,
    Image,
    Animated,
    View,
    TouchableHighlight,
} = ReactNative;
const { Button, DImage } = COMPONENTS;
module.exports = React.createClass({
    getInitialState () {
        return {
            info: app.personal.info,
        };
    },
    doShare () {
        this.props.doShare(this.props.completeData);
        app.closeModal();
    },
    render () {
        return (
            <Animated.View style={[styles.overlayContainer, { opacity: this.state.opacity }]}>
                <View style={styles.container}>
                    <View
                        resizeMode='stretch'
                        source={app.img.study_popup}
                        style={styles.studyAwardBackgroundImage}>
                        <Image
                            resizeMode='stretch'
                            style={styles.overheadImage}
                            source={app.img.study_overhead}>
                            <Text style={styles.studyAwardTitle}>{'亲爱的特种兵' + app.personal.info.name + '同志'}</Text>
                        </Image>
                        <Image
                            resizeMode='stretch'
                            source={app.img.study_balloon}
                            style={styles.studyAwardBalloonImage}>
                            <DImage
                                resizeMode='cover'
                                defaultSource={app.img.personal_head}
                                source={{ uri: app.personal.info.headImg }}
                                style={styles.studyAwardHeadImage} />
                        </Image>
                        <View style={styles.bottomView}>
                            <Text style={[styles.pointText, { color: '#555555' }]}>{'周任务已经提交成功，相信天道酬勤'}</Text>
                            <Text style={[styles.pointText, { color: '#A60245' }]}>{'加油! 加油!!'}</Text>
                            <Button
                                onPress={this.doShare}
                                style={styles.studyAwardBtnShare}
                                textStyle={styles.awardText}>分享周任务</Button>
                        </View>
                    </View>
                    <TouchableHighlight
                        onPress={app.closeModal}
                        underlayColor='rgba(0, 0, 0, 0)'
                        style={styles.touchableHighlight}>
                        <Image
                            resizeMode='contain'
                            source={app.img.draw_back}
                            style={styles.closeIcon} />
                    </TouchableHighlight>
                </View>
            </Animated.View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        alignItems:'center',
        justifyContent:'center',
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
        width:sr.w * 5 / 6,
        height:sr.w * 4 / 5,
        alignItems:'center',
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
    },
    overheadImage: {
        width:sr.w * 5 / 6,
        height: (sr.w * 3 / 4 - 25) / 2,
    },
    studyAwardBalloonImage: {
        position: 'absolute',
        left: sr.w * 5 / 12 - sr.w / 6,
        top: 30,
        width:sr.w / 3,
        height:sr.w / 3,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    studyAwardHeadImage: {
        width:sr.w * 5 / 24,
        height:sr.w * 5 / 24,
        borderRadius: sr.w * 5 / 48,
    },
    bottomView: {
        position: 'absolute',
        left: 0,
        width: sr.w * 5 / 6,
        height: 120,
        bottom: 10,
        alignItems: 'center',
    },
    nameText: {
        color: CONSTANTS.THEME_COLOR,
        marginTop: 10,
        fontSize:16,
    },
    pointText: {
        fontSize:14,
        marginVertical: 3,
        fontWeight: '500',
    },
    studyAwardBtnShare: {
        height: 40,
        width: 120,
        marginTop: 15,
        backgroundColor:'#A60245',
        borderRadius: 4,
    },
    awardText: {
        fontSize: 14,
        fontWeight: '500',
    },
    overlayContainer: {
        position:'absolute',
        top: 0,
        alignItems:'center',
        justifyContent: 'center',
        width:sr.w,
        height:sr.h,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    touchableHighlight: {
        position:'absolute',
        top:-12,
        left:sr.w * 5 / 6 - 24,
        width: 38,
        height: 38,
    },
    closeIcon: {
        width: 38,
        height: 38,
    },
});
