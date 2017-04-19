'use strict';

const React = require('react');
const ReactNative = require('react-native');

const {
    StyleSheet,
    View,
    Text,
    Image,
    Platform,
    TouchableOpacity,
    screenPhysicalPixels,
    Dimensions,
    UIManager,
} = ReactNative;

const SplashScreen = require('@remobile/react-native-splashscreen');
const Button = require('@remobile/react-native-simple-button');
const ImageSelect = require('../home/ImageSelect');
const moment = require('moment');

module.exports = React.createClass({
    getInitialState () {
        return {
            gradeScore: 0,
        };
    },
    componentWillMount () {
        SplashScreen.hide();
        this.queryTime = moment();
    },
    afterChange (gradeScore) {
        this.setState({ gradeScore });
    },
    doSelect (i) {
        console.log('=====d===', i);
    },
    getIndexPointX (index, arrLength) {

    },
    render () {
        const { gradeScore } = this.state;
        return (
            <View style={styles.container}>
                <ImageSelect
                    width={sr.ws(254)}
                    height={sr.ws(158)}
                    afterChange={this.afterChange}
                    >
                    {
                        [1, 2, 3, 4, 5].map((n, i) => {
                            return (
                                <TouchableOpacity key={i} onPress={this.doSelect.bind(null, i)} style={styles.itemContainer} >
                                    <Image
                                        source={app.img.common_default}
                                        style={gradeScore == i ? styles.selectedScoreContainer : styles.scoreContainer}>
                                        <View style={gradeScore == i ? styles.bottomStyleMid : styles.bottomStyle}>
                                            <Text numberOfLines={2} style={gradeScore == i ? styles.textStyleMid : styles.textStyle}>{'贵阳赢销截拳道成立一周年活动'}</Text>
                                        </View>
                                    </Image>
                                </TouchableOpacity>
                            );
                        })
                    }
                </ImageSelect>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scoreContainer: {
        width: 234,
        height: 138,
        alignItems: 'center',
        borderRadius: 4,
        justifyContent: 'center',
    },
    selectedScoreContainer: {
        width: 254,
        height: 158,
        alignItems: 'center',
        borderRadius: 4,
        justifyContent: 'center',
    },
    bottomStyleMid: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: 254,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    bottomStyle: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: 234,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    textStyleMid: {
        fontSize: 16,
        fontFamily:'STHeitiSC-Medium',
        color: '#FFFFFF',
    },
    textStyle: {
        fontSize: 10,
        color: '#FFFFFF',
    },
});
