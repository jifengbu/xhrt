'use strict';

const React = require('react');
const ReactNative = require('react-native');
const {
    KeyboardAvoidingView,
    Modal,
    SegmentedControlIOS,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    View,
    Image,
} = ReactNative;

const SplashScreen = require('@remobile/react-native-splashscreen');
const { ScoreSelect } = COMPONENTS;

module.exports = React.createClass({
    componentWillMount () {
        SplashScreen.hide();
    },
    getInitialState () {
        return {
            index: 0,
        };
    },
    render () {
        const { index } = this.state;
        return (
            <View style={styles.outerContainer}>
                <Image
                    resizeMode='cover'
                    source={app.img.personal_head}
                    style={styles.videoPlayer} />
                <KeyboardAvoidingView behavior='Padding' style={styles.container}>
                    <TextInput
                        placeholder='<TextInput />'
                        style={styles.textInput} />
                    <TextInput
                        placeholder='<TextInput />'
                        style={styles.textInput} />
                    <TextInput
                        placeholder='<TextInput />'
                        style={styles.textInput} />
                    <TextInput
                        placeholder='<TextInput />'
                        style={styles.textInput} />
                    <TextInput
                        placeholder='<TextInput />'
                        style={styles.textInput} />
                    <TextInput
                        placeholder='<TextInput />'
                        style={styles.textInput} />
                    <TextInput
                        placeholder='<TextInput />'
                        style={styles.textInput} />
                    <TextInput
                        placeholder='<TextInput />'
                        style={styles.textInput} />
                </KeyboardAvoidingView>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
    },
    videoPlayer: {
        backgroundColor: 'pink',
        position: 'absolute',
        width: sr.w,
        height: sr.h,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    textInput: {
        borderRadius: 5,
        borderWidth: 1,
        height: 44,
        paddingHorizontal: 10,
    },
    segment: {
        marginBottom: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 30,
        left: 10,
    },
});
