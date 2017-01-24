'use strict';

var React = require('react');var ReactNative = require('react-native');
var Progress = require('react-native-progress');
var TimerMixin = require('react-timer-mixin');
var {
    Image,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} = ReactNative;

module.exports = React.createClass({
    mixins: [TimerMixin],
    getDefaultProps() {
        return {
            time: 60,
        };
    },
    getInitialState() {
        return {
            progress: 1,
        };
    },
    componentDidMount() {
        if (this.props.autoStart) {
            this.doStartProgress();
        }
    },
    doStartProgress() {
        var step = this.props.time/1000;
        this.state.progress = 1;
        var timeID = this.setInterval(()=>{
            var progress = this.state.progress - 0.001;
            if (progress <= 0) {
                clearInterval(timeID);
                this.props.onEnd();
                return;
            }
            this.props.onProgress && this.props.onProgress(progress);
            this.setState({progress});
        }, step);
    },
    render() {
        var time = Math.floor(this.state.progress*this.props.time/1000);
        if (time < 0) {
            time = 0;
        }
        return (
            <View style={styles.container}>
              <Progress.Bar
                  progress={this.state.progress}
                  width={sr.ws(sr.w-80)}
                  height={sr.ws(10)}
                  marginTop={sr.ws(12)}
                  marginBottom={0}
                  borderRadius={sr.ws(6)}
                  animated={true}
                  borderWidth={1}
                  borderColor='white'
                  color='#ff3c30'/>
                <Text style={app.isandroid?styles.textAndroid:styles.textIos}>{'时间剩余:'+time+'秒'}</Text>
            </View>
        );
    }
});

var styles = StyleSheet.create({
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
