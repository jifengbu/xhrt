'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
} = ReactNative;

const { ClipRect } = COMPONENTS;

module.exports = React.createClass({
    render () {
        return (
            <TouchableOpacity onPress={app.hideAssistModal} style={{ flex:1 }}>
                <View style={{ flex:1 }}>
                    <View style={styles.HeadContainer} />
                    <View style={{ flexDirection:'row' }}>
                        <View style={styles.rect1} />
                        <ClipRect style={styles.cliprect1} />
                        <View style={styles.rect2} />
                    </View>
                    <View style={styles.line} >
                        <Image
                            resizeMode='stretch'
                            source={app.img.guide_hand_gif}
                            style={styles.imgHand} />
                    </View>
                    <View style={styles.rect2}>
                        <Image
                            resizeMode='stretch'
                            source={app.img.guide_in_meeting_txt}
                            style={styles.textBG} />
                    </View>
                </View>
            </TouchableOpacity>
        );
    },
});
const BACK_COLOR = 'rgba(0, 0, 0, 0.4)';
const styles = StyleSheet.create({
    textBG:{
        marginLeft:30,
        width:261,
        height:80,
        backgroundColor:BACK_COLOR,
    },
    imgHand:{
        transform:[{ rotate:'155deg' }],
        width: 50,
        marginLeft: 50,
        height: 80,
    },
    titleText: {
        margin:10,
        fontSize: 24,
        fontWeight: '400',
    },
    HeadContainer: {
        height:sr.h / 12,
        backgroundColor:BACK_COLOR,
    },
    cliprect1: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginLeft:15,
        color: BACK_COLOR,
    },
    line: {
        flexDirection:'row',
        height: 80,
        backgroundColor: BACK_COLOR,
    },
    rect1: {
        flex: 0.2,
        backgroundColor: BACK_COLOR,
    },
    rect3: {
        flex: 1.3,
        backgroundColor: BACK_COLOR,
    },
    rect2: {
        flex: 4.5,
        backgroundColor: BACK_COLOR,
    },
    rect4: {
        flex: 0.5,
        backgroundColor: BACK_COLOR,
    },
});
