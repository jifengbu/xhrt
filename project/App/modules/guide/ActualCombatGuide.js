'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    View,
    Text,
    Image,
    TouchableOpacity,
    Navigator,
    StyleSheet
} = ReactNative;

var {ClipRect} = COMPONENTS;

module.exports = React.createClass({
    getInitialState() {
        return {
            isImage: false,
        };
    },
    changeImage() {
        this.setState({isImage: true});
    },
    changeTap() {
        app.hideAssistModal();
    },
    render() {
        return (
            !this.state.isImage?
            <TouchableOpacity
                onPress={this.changeImage}
                style={styles.container}>
                <View style={styles.line1} />
                <View style={styles.buttonContainer}>
                    <View style={styles.buttonPreRect} />
                    <ClipRect style={styles.buttonClipRect}/>
                    <View style={styles.rect1} />
                </View>
                <View style={styles.line2} />
                <View style={styles.container1}>
                    <View style={styles.rect1} />
                    <ClipRect style={styles.rowContainer}/>
                    <View style={styles.rect1} />
                </View>
                <View style={styles.line1}>
                    <Image
                        resizeMode='stretch'
                        source={app.img.guide_hand_gif}
                        style={styles.guide_hand_gif1}>
                    </Image>
                </View>
                <View style={styles.rect1} />
                <Image
                    resizeMode='stretch'
                    source={app.img.guide_kit_go_detail_txt}
                    style={styles.guide_kit_txt_image}>
                </Image>
            </TouchableOpacity>
            :
            <TouchableOpacity
                onPress={this.changeTap}
                style={styles.container}>
                <View style={styles.line1} />
                <View style={styles.buttonContainer}>
                    <View style={styles.rect1} />
                    <ClipRect style={styles.buttonClipRect1}/>
                    <View style={styles.buttonPreRect} />
                </View>
                <View style={styles.line2} />
                <View style={styles.container1}>
                    <View style={styles.rect1} />
                    <ClipRect style={styles.rowContainer}/>
                    <View style={styles.rect1} />
                </View>
                <View style={styles.line1}>
                    <Image
                        resizeMode='stretch'
                        source={app.img.guide_hand_gif}
                        style={styles.guide_hand_gif1}>
                    </Image>
                </View>
                <View style={styles.rect1} />
                <Image
                    resizeMode='stretch'
                    source={app.img.guide_kit_go_publish_txt}
                    style={styles.guide_kit_txt_image}>
                </Image>
            </TouchableOpacity>
        );
    }
});

var BACK_COLOR = 'rgba(0, 0, 0, 0.4)';
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonClipRect: {
        width: sr.w/2-10,
        height: 50,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        color: BACK_COLOR,
    },
    buttonClipRect1: {
        width: sr.w/2-10,
        height: 50,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        color: BACK_COLOR,
    },
    rowContainer: {
        width: sr.w-20,
        height: 152,
        borderRadius: 10,
        color: BACK_COLOR,
    },
    guide_hand_gif: {
        transform:[{rotate:'225deg'}],
        marginLeft:80,
        marginTop:-20,
        width: 50,
        height: 80,
    },
    guide_hand_gif1: {
        transform:[{rotate:'180deg'}],
        marginLeft: 80,
        marginTop: -5,
        width: 50,
        height: 80,
    },
    line: {
        height: 10,
        backgroundColor: BACK_COLOR,
    },
    line1: {
        height: 10+sr.totalNavHeight,
        backgroundColor: BACK_COLOR,
    },
    line2: {
        height: 10,
        backgroundColor: BACK_COLOR,
    },
    buttonContainer: {
        height: 50,
        flexDirection:'row',
    },
    container1: {
        flexDirection: 'row',
    },
    rect1: {
        flex: 1,
        backgroundColor: BACK_COLOR,
    },
    buttonPreRect: {
        width:10,
        backgroundColor: BACK_COLOR,
    },
    guide_publish_txt_image: {
        top: 180,
        left: (sr.w-266)/2,
        position: 'absolute',
        alignSelf: 'center',
        width: 266,
        height:110,
    },
    guide_kit_txt_image: {
        top: 300+sr.totalNavHeight,
        left: (sr.w-266)/2,
        position: 'absolute',
        width: 266,
        height:110,
    },
});
