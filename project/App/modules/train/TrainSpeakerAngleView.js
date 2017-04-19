'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    Navigator,
    Text,
    Image,
    TouchableOpacity,
} = ReactNative;
const { Button } = COMPONENTS;
const PropAnimateLayer = require('./PropAnimateLayer.js');

module.exports = React.createClass({
    render () {
        const hearerList = _.reject(this.props.competitors, (item) => app.personal.info.userID == item.userID);
        return (
            <View style={styles.container}>
                <Image
                    resizeMode='stretch'
                    source={app.img.train_background}
                    style={styles.backgroundlightImage}>
                    <View style={styles.imageContainer}>
                        {
                            hearerList.map((item, i) => {
                                const source = item.userInfo.sex == 0 ? app.img.train_girl_sit : app.img.train_boy_sit;
                                return (
                                    <Image
                                        key={i}
                                        resizeMode='stretch'
                                        source={source}
                                        style={styles.icon} />
                                );
                            })
                        }
                    </View>
                    <Image
                        resizeMode='stretch'
                        source={app.img.train_table}
                        style={styles.tableIcon} />

                    <Image
                        resizeMode='stretch'
                        source={app.img.train_microphone}
                        style={styles.microphoneIcon} />
                    <PropAnimateLayer propItem={this.props.propItem} />
                    <View style={styles.microphoneIconView}>
                        {
                            this.props.showStartBtn &&
                                <TouchableOpacity onPress={this.props.doStartSpeach}>
                                    <Image
                                        resizeMode='stretch'
                                        source={app.img.train_begin}
                                        style={styles.trainStartNowButton} />
                                </TouchableOpacity>
                        }
                    </View>

                    {
                        this.props.showStopBtn &&
                        <Button
                            onPress={this.props.doStopSpeach}
                            style={styles.trainStopNowButton}>结束演讲</Button>
                    }

                </Image>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        alignItems:'center',
        justifyContent:'center',
    },
    backgroundlightImage: {
        width:sr.w,
        height: sr.ch,
        alignItems:'center',
    },
    imageContainer: {
        flexDirection:'row',
        marginTop:130,
        alignItems:'center',
        justifyContent:'center',
    },
    icon: {
        width: 62,
        height: 86,
        marginHorizontal: 6,
    },
    tableIcon: {
        width:sr.w * 7 / 8,
        height:155,
        marginTop: -30,
    },
    microphoneIconView: {
        position:'absolute',
        top: sr.h * 2 / 8,
        left: sr.w / 2 - 47,
        width:95,
        height:222,
    },
    microphoneIcon: {
        position:'absolute',
        top: sr.h * 2 / 8 + 100,
        left: sr.w / 2 - 47,
        width:94,
        height:222,
    },
    trainStartNowButton: {
        width:94,
        height:94,
    },
    trainStopNowButton: {
        position:'absolute',
        bottom: 210,
        left: sr.w / 2 + 65,
        width:100,
        height:30,
        borderRadius:15,
    },
});
