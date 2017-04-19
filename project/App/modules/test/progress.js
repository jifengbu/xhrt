'use strict';

const React = require('react');const ReactNative = require('react-native');

const {
    StyleSheet,
    View,
    Text,
    Image,
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
        setInterval(() => {
            let progress = this.state.progress + 0.01;
            if (progress >= 1) {
                progress = 0;
            }
            this.setState({ progress });
        }, 100);
    },
    render () {
        return (
            <View style={styles.container}>
                <Progress.Circle
                    progress={this.state.progress}
                    size={200}
                    unfilledColor='blue'
                    borderWidth={5}
                    borderColor='black'
                    thickness={20}
                    direction='clockwise'
                    textStyle={{ color:'black', fontSize: 80, fontWeight:'800' }}
                    showsText
                    formatText={(p) => {
                        p = Math.floor(p * 10);
                        return 10 - p;
                    }}
                    color='red' />
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
