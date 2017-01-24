'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
    Text,
    Image,
    View,
    TouchableOpacity,
} = ReactNative;

var {ClipRect} = COMPONENTS;
module.exports = React.createClass({
    getInitialState() {
        return {
            overlayIntroduce: true,
            overlayStudy: false,
            overlayTrain: false,
            overlayActualCombat: false
        };
    },
    _onPressIntroduce() {
        this.setState({
            overlayIntroduce: false,
            overlayStudy: true,
        });
    },
    _onPressStudy() {
        this.setState({
            overlayStudy: false,
            overlayTrain: true,
        });
    },
    _onPressTrain() {
        this.setState({
            overlayTrain: false,
            overlayActualCombat: true,
        });
    },
    render() {
        return (
            <View style={styles.container}>
                {
                    this.state.overlayIntroduce &&
                    <TouchableOpacity
                        onPress={this._onPressIntroduce}
                        style={styles.container}>
                        <Image
                            resizeMode='stretch'
                            source={app.img.guide_main}
                            style={styles.guideStyle}>
                        </Image>
                    </TouchableOpacity>
                }
                {
                    this.state.overlayStudy &&
                    <TouchableOpacity
                        onPress={this._onPressStudy}
                        style={styles.container}>
                        <View style={styles.container}>
                            <View style={styles.topRect} >
                                <Image
                                    resizeMode='stretch'
                                    source={app.img.guide_study_txt}
                                    style={styles.guide_study_txt}>
                                </Image>
                            </View>
                            <View style={styles.buttonContainer}>
                                <View style={styles.marginRect2} />
                                <ClipRect style={styles.cliprect2}/>
                                <View style={styles.rect1} />
                            </View>
                            <View style={styles.rect1} />
                            <View style={styles.tabBar} >
                                <View style={styles.rect1} />
                                <ClipRect style={styles.cliprect3}/>
                                <View style={styles.rect1} />
                                <View style={styles.rect1} />
                            </View>
                            <Image
                                resizeMode='stretch'
                                source={app.img.guide_cartoon_image}
                                style={styles.guide_cartoon_image}>
                            </Image>
                            <Image
                                resizeMode='stretch'
                                source={app.img.guide_hand_gif}
                                style={styles.guide_hand_gif}>
                            </Image>
                        </View>
                    </TouchableOpacity>
                }
                {
                    this.state.overlayTrain &&
                    <TouchableOpacity
                        onPress={this._onPressTrain}
                        style={styles.container}>
                        <View style={styles.container}>
                            <View style={styles.topRect} >
                                <Image
                                    resizeMode='stretch'
                                    source={app.img.guide_train_txt}
                                    style={styles.guide_train_txt}>
                                </Image>
                            </View>
                            <View style={styles.buttonContainer}>
                                <View style={styles.rect1} />
                                <ClipRect style={styles.cliprect2}/>
                                <View style={styles.marginRect2} />
                            </View>
                            <View style={styles.rect1} />
                            <View style={styles.tabBar} >
                                <View style={styles.rect1} />
                                <View style={styles.rect1} />
                                <ClipRect style={styles.cliprect3}/>
                                <View style={styles.rect1} />
                            </View>
                            <Image
                                resizeMode='stretch'
                                source={app.img.guide_cartoon_image2}
                                style={styles.guide_cartoon_image2}>
                            </Image>
                            <Image
                                resizeMode='stretch'
                                source={app.img.guide_hand_gif}
                                style={styles.guide_hand_gif2}>
                            </Image>
                        </View>
                    </TouchableOpacity>
                }
                {
                    this.state.overlayActualCombat &&
                    <TouchableOpacity
                        onPress={app.hideAssistModal}
                        style={styles.container}>
                        <View style={styles.container}>
                            <View style={styles.topRect} />

                                <View style={styles.buttonContainer1}>
                                    <View style={styles.marginRect3} />
                                    <ClipRect style={styles.cliprect1}/>
                                    <View style={styles.rect1} />
                                </View>
                            <View style={styles.rect1} />
                            <View style={styles.tabBar} >
                                <View style={styles.rect1} />
                                <View style={styles.rect1} />
                                <View style={styles.rect1} />
                                <ClipRect style={styles.cliprect3}/>
                            </View>
                            <Image
                                resizeMode='stretch'
                                source={app.img.guide_actual_combat_txt}
                                style={styles.guide_actual_combat_txt}>
                            </Image>
                            <Image
                                resizeMode='stretch'
                                source={app.img.guide_cartoon_image}
                                style={styles.guide_cartoon_image}>
                            </Image>
                            <Image
                                resizeMode='stretch'
                                source={app.img.guide_hand_gif}
                                style={styles.guide_hand_gif3}>
                            </Image>
                        </View>
                    </TouchableOpacity>
                }
            </View>
        );
    }
});

var BACK_COLOR = 'rgba(0, 0, 0, 0.4)';
var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    marginRect2: {
        width:10,
        height: 74,
        backgroundColor: BACK_COLOR,
    },
    marginRect3: {
        width:10,
        height: 40,
        backgroundColor: BACK_COLOR,
    },
    cliprect1: {
        width: sr.w-20,
        height: 40,
        borderRadius: 4,
        color: BACK_COLOR,
    },
    cliprect2: {
        flex:1,
        width: sr.w/2-13,
        height: 74,
        borderRadius: 6,
        color: BACK_COLOR,
    },
    cliprect3:{
        flex:1,
        width:(sr.w-20)/4,
        height:(sr.w-20)/4,
        borderRadius:(sr.w-20)/8,
        color: BACK_COLOR,
    },
    topRect: {
        backgroundColor: BACK_COLOR,
        height: 220+sr.totalNavHeight,
    },
    buttonContainer: {
        height: 74,
        flexDirection: 'row',
    },
    buttonContainer1: {
        height: 40,
        flexDirection: 'row',
    },
    rect1: {
        flex: 1,
        backgroundColor: BACK_COLOR,
    },
    tabBar: {
        height: 60,
        flexDirection:'row',
        backgroundColor: BACK_COLOR,
    },
    rect3: {
        flex: 0.5,
        flexDirection:'row',
        backgroundColor: BACK_COLOR,
    },
    guideStyle: {
        width: sr.w,
        height: sr.h,
    },
    guideStyle2: {
        width: sr.w-20,
        height: (sr.w-20)/3,
    },
    guide_study_txt: {
        width: sr.w-30,
        height: 120,
        marginHorizontal:10,
        marginTop:130,
    },
    guide_train_txt: {
        position: 'absolute',
        left: 20,
        marginTop:80,
        width: sr.w-30,
        height: 120,
    },
    guide_actual_combat_txt: {
        width: sr.w-100,
        height: (sr.w-100)/2.8,
        position: 'absolute',
        left: 10,
        top: 120,
    },
    guide_cartoon_image: {
        position: 'absolute',
        width: 116,
        height: 240,
        right: 20,
        top: 200,
    },
    guide_cartoon_image2: {
        position: 'absolute',
        width: 112,
        height: 233,
        left: 20,
        top: 200,
    },
    guide_hand_gif: {
        transform:[{rotate:'135deg'}],
        position: 'absolute',
        width: 74,
        height: 115,
        left: 100,
        top: 340,
    },
    guide_hand_gif2: {
        transform:[{rotate:'180deg'}],
        position: 'absolute',
        width: 74,
        height: 115,
        right: sr.w/4-37,
        top: 340,
    },
    guide_hand_gif3: {
        transform:[{rotate:'0deg'}],
        position: 'absolute',
        width: 74,
        height: 115,
        right: 20,
        bottom: 50,
    },
});
