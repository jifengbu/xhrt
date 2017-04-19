'use strict';

const React = require('react');const ReactNative = require('react-native');

const {
    Image,
    StyleSheet,
    Text,
    View,
} = ReactNative;

const Progress = require('react-native-progress');
const SplashScreen = require('@remobile/react-native-splashscreen');

module.exports = React.createClass({
    getDefaultProps () {
        return {
            time: 60,
        };
    },
    getInitialState () {
        return {
            progress: 1,
        };
    },
    componentDidMount () {
        SplashScreen.hide();
        const step = this.props.time * 10;
        const timeID = setInterval(() => {
            const progress = this.state.progress - 0.01;
            if (progress <= 0) {
                clearInterval(timeID);
            }
            this.setState({ progress });
        }, step);
    },
    render () {
        let time = Math.floor(this.state.progress * this.props.time);
        if (time < 0) {
            time = 0;
        }
        return (
            <View style={styles.container}>
                <Text>{'时间剩余:' + time + '秒'}</Text>
                <Progress.Bar
                    progress={this.state.progress}
                    width={sr.w - 100}
                    height={10}
                    borderRadius={6}
                    animated
                    borderWidth={1}
                    borderColor='white'
                    color='#ff3c30' />
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
