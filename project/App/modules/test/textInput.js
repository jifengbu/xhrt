'use strict';

const React = require('react');
const ReactNative = require('react-native');

const {
    StyleSheet,
    View,
    TextInput,
    Image,
} = ReactNative;

const SplashScreen = require('@remobile/react-native-splashscreen');
const Button = require('@remobile/react-native-simple-button');
const { AutogrowInput } = COMPONENTS;

module.exports = React.createClass({
    getInitialState () {
        return {
            title: '',
            height: sr.ws(30),
        };
    },
    componentWillMount () {
        SplashScreen.hide();
    },
    render () {
        return (
            <View style={styles.container}>
                <View style={styles.innercontainer}>
                    <AutogrowInput
                        maxHeight={sr.ws(300)}
                        style={styles.themeStyle}
                        placeholder={'请输入您所要发布的求救包主题(150字以内)'}
                        />
                </View>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50,
    },
    innercontainer: {
        width: sr.w - 20,
        height: 300,
        backgroundColor: 'white',
    },
    themeStyle:{
        fontSize:14,
        width: sr.w - 20,
        height: 30,
        padding: 2,
        backgroundColor: 'white',
    },
});
