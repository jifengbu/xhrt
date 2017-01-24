'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity
} = ReactNative;

var {ClipRect} = COMPONENTS;

module.exports = React.createClass({
    render() {
        return (
            <TouchableOpacity onPress={app.hideAssistModal} style={styles.Mcontainer}>
            <View style={styles.Mcontainer}>
                <View style={styles.HeadContainer}/>
                <View style={{flexDirection:'row'}}>
                    <View style={styles.rect1}/>
                    <ClipRect style={styles.cliprect1}/>
                    <View style={styles.rect2}/>
                </View>
                <View style={styles.line} >
                    <View style={styles.rect3}/>
                    <Image
                        resizeMode='stretch'
                        source={app.img.guide_hand_gif}
                        style={styles.imgHand}>
                    </Image>
                    <View style={styles.rect2}/>
                </View>
                <View style={styles.rect2}>
                    <Image
                        resizeMode='stretch'
                        source={app.img.guide_go_train_txt}
                        style={styles.textBG}>
                    </Image>
                </View>
            </View>
            </TouchableOpacity>
        )
    }
});
var BACK_COLOR = 'rgba(0, 0, 0, 0.4)';
const styles = StyleSheet.create({
    Mcontainer: {
        flex: 1,
    },
    textBG:{
        marginLeft:30,
        width:282,
        height:110,
        backgroundColor:BACK_COLOR,
    },
    imgHand:{
        transform:[{rotate:'180deg'}],
        width: 50,
        height: 80,
        backgroundColor:BACK_COLOR,
    },
    titleText: {
        margin:10,
        fontSize: 24,
        fontWeight: '400',
    },
    HeadContainer: {
        height:sr.h/6,
        backgroundColor:BACK_COLOR,
    },
    cliprect1: {
        width: 80,
        height: 80,
        borderRadius: 40,
        color: BACK_COLOR,
    },
    line: {
        flexDirection:'row',
        height: 80,
    },
    rect1: {
        flex: 1,
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
});
