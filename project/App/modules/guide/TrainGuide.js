'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    StyleSheet,
    Text,
    Image,
    View,
    TouchableOpacity,
} = ReactNative;

module.exports = React.createClass({
    getInitialState () {
        return {
            overlayIntroduce: true,
        };
    },
    render () {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={app.hideAssistModal} style={styles.container}>
                    <View style={styles.rect1}>
                        <Image
                            resizeMode='stretch'
                            source={app.img.guide_in_train_txt}
                            style={styles.guide_txt_image} />
                        <Image
                            resizeMode='stretch'
                            source={app.img.guide_hand_gif}
                            style={styles.guide_hand_image} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    },
});

const BACK_COLOR = 'rgba(0, 0, 0, 0.4)';
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    guide_txt_image: {
        marginTop: (sr.h - 110) / 2,
        alignSelf: 'center',
        width: 266,
        height:110,
    },
    guide_hand_image: {
        transform:[{ rotate:'45deg' }],
        marginLeft: 30,
        marginTop: 10,
        width: 50,
        height: 80,
    },
    rect1: {
        flex: 1,
        backgroundColor: BACK_COLOR,
    },
});
