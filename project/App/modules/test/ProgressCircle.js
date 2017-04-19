'use strict';

const React = require('react');const ReactNative = require('react-native');

const {
    StyleSheet,
    View,
    Text,
    Navigator,
    RefreshControl,
} = ReactNative;

const SplashScreen = require('@remobile/react-native-splashscreen');
const Progress = require('react-native-progress');

module.exports = React.createClass({
    getInitialState () {
        return {
            progress: 0,
        };
    },
    componentDidMount () {
        SplashScreen.hide();
        const timeID = setInterval(() => {
            const progress = this.state.progress + 0.01;
            if (progress >= 1) {
                clearInterval(timeID);
            }
            this.setState({ progress });
        }, 100);
    },
    render () {
        return (
            <View style={styles.container}>
                <Progress.Circle
                    progress={this.state.progress}
                    size={80}
                    borderWidth={5}
                    borderColor='#239fdb'
                    textStyle={{ color:'black', fontSize: 40, fontWeight:'10', alignSelf:'center' }}
                    showsText
                    formatText={(p) => {
                        p = Math.floor(p * 10);
                        return 10 - p;
                    }}
                    color='black' />
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
