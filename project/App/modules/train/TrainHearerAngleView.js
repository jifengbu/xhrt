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

const PropAnimateLayer = require('./PropAnimateLayer.js');

module.exports = React.createClass({
    getDefaultProps () {
        return {
            propItem: {},
        };
    },
    getInitialState () {
        return {
            isSpeakerOn:app.phoneMgr.isSpeakerOn,
        };
    },
    toggleSpeaker () {
        app.phoneMgr.toggleSpeaker();
        this.setState({ isSpeakerOn:app.phoneMgr.isSpeakerOn });
    },
    componentDidMount () {
        app.phoneMgr.toggleSpeaker(true);
        this.setState({ isSpeakerOn:app.phoneMgr.isSpeakerOn });
    },
    componentWillUnmount () {
        app.phoneMgr.toggleSpeaker(false);
    },
    render () {
        const speakerSource = this.props.speaker.userInfo.sex == 0 ? app.img.train_girl : app.img.train_boy;
        const hearerList = _.reject(this.props.competitors, (item) => this.props.speaker.userID == item.userID);
        return (
            <View style={styles.container}>
                <Image
                    resizeMode='stretch'
                    source={app.img.train_backgroundlight}
                    style={styles.backgroundlightImage}>
                    <Image
                        resizeMode='contain'
                        source={speakerSource}
                        style={styles.speakerIcon}>
                        <Image
                            resizeMode='stretch'
                            source={app.img.train_start_microphone}
                            style={styles.microphoneIcon} />
                    </Image>
                    <Image
                        resizeMode='stretch'
                        source={app.img.train_desktop}
                        style={app.isandroid ? styles.tableIconAndroid : styles.tableIconIos} />
                    <View style={styles.hearerIconContainer}>
                        {
                            hearerList.map((item, i) => {
                                const source = item.userInfo.sex == 0 ? app.img.train_girl_back : app.img.train_boy_back;
                                return (
                                    <Image
                                        key={i}
                                        resizeMode='stretch'
                                        source={source}
                                        style={app.isandroid ? styles.hearerIconAndroid : styles.hearerIconIos} />
                                );
                            })
                        }
                    </View>
                    <PropAnimateLayer propItem={this.props.propItem} />
                    <TouchableOpacity
                        style={styles.speakerOnContainer}
                        onPress={this.toggleSpeaker}>
                        { this.state.isSpeakerOn ?
                            <Image
                                resizeMode='stretch'
                                source={app.img.train_speaker_on}
                                style={styles.speakerOn} />
                        : <Image
                            resizeMode='stretch'
                            source={app.img.train_speaker_off}
                            style={styles.speakerOff} />
                        }
                    </TouchableOpacity>
                </Image>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        alignItems:'center',
        justifyContent:'center',
        flex:1,
    },
    backgroundlightImage: {
        width:sr.w,
        height:sr.ch,
        alignItems:'center',
        justifyContent:'center',
    },
    speakerIcon: {
        width:sr.w / 5,
        height:(sr.w / 5) * 596 / 320,
        marginTop:-70,
    },
    tableIconAndroid: {
        position:'absolute',
        marginTop:60,
        width:sr.w,
        height:(sr.w) * 149 / 750,
    },
    tableIconIos: {
        position:'absolute',
        marginTop:70,
        width:sr.w,
        height:(sr.w) * 149 / 750,
    },
    microphoneIcon: {
        position: 'absolute',
        left: (sr.w / 5 - sr.w * 1 / 17) / 2,
        width:sr.w * 1 / 17,
        height:(sr.w * 1 / 17) * 220 / 45,
        bottom: 0,
    },
    speakerOnContainer: {
        position: 'absolute',
        right: 10,
        top:0,
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems:'center',
        justifyContent:'center',
        marginTop:20,
    },
    speakerOn: {
        width: 25,
        height: 25,
    },
    speakerOff: {
        width: 22,
        height: 22,
    },
    hearerIconContainer: {
        height:sr.h / 5,
        flexDirection:'row',
        justifyContent:'center',
    },
    hearerIconAndroid: {
        width:95,
        height:125,
        marginHorizontal:10,
        marginTop:10,
    },
    hearerIconIos: {
        width:95,
        height:125,
        marginHorizontal:10,
        marginTop:20,
    },
});
