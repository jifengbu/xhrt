'use strict';

const React = require('react');const ReactNative = require('react-native');
const Progress = require('react-native-progress');
const TimerMixin = require('react-timer-mixin');
const {
    Image,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} = ReactNative;

module.exports = React.createClass({
    mixins: [TimerMixin],
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
        if (this.props.autoStart) {
            this.doStartProgress();
        }
    },
    doStartProgress () {
        const step = this.props.time / 1000;
        this.state.progress = 1;
        const timeID = this.setInterval(() => {
            const progress = this.state.progress - 0.001;
            if (progress <= 0) {
                clearInterval(timeID);
                this.props.onEnd();
                return;
            }
            this.props.onProgress && this.props.onProgress(progress);
            this.setState({ progress });
        }, step);
    },
    render () {
        let time = Math.floor(this.state.progress * this.props.time / 1000);
        if (time < 0) {
            time = 0;
        }
        return (
            <View style={styles.container}>
                <Progress.Bar
                    progress={this.state.progress}
                    width={sr.ws(sr.w - 80)}
                    height={sr.ws(10)}
                    marginTop={sr.ws(12)}
                    marginBottom={0}
                    borderRadius={sr.ws(6)}
                    animated
                    borderWidth={1}
                    borderColor='white'
                    color='#ff3c30' />
                <Text style={app.isandroid ? styles.textAndroid : styles.textIos}>{'时间剩余:' + time + '秒'}</Text>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#00000055',
        height: 35,
    },
    textAndroid: {
        marginTop: -13,
        fontSize: 9,
        color: '#FFFFFF',
    },
    textIos: {
        marginTop: -11,
        fontSize: 9,
        color: '#FFFFFF',
    },
});
