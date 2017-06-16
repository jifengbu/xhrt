'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    Animated,
    StyleSheet,
    View,
    Dimensions,
} = ReactNative;

const DEFAULT_ANIMATE_TIME = 300;
const Subscribable = require('Subscribable');
const TimerMixin = require('react-timer-mixin');

module.exports = React.createClass({
    mixins: [Subscribable.Mixin, TimerMixin],
    componentWillMount () {
        this.addListenerOn(app.personal, 'CLOSE_SHARE_SHEET_OVERLAY_EVENT', this.closeModel);
    },
    getInitialState () {
        return {
            fadeAnim: new Animated.Value(0),
            overlayStyle: styles.emptyOverlay, //on android opacity=0 also can cover screen, so use overlayStyle fix it
        };
    },
    closeModel (result) {
        !this.props.visible && this.setState({ overlayStyle:styles.emptyOverlay });
    },
    componentWillReceiveProps (newProps) {
        const { visible } = newProps;
        const oldVisible = this.props.visible;
        newProps.visible && this.setState({ overlayStyle: styles.fullOverlay });
        return Animated.timing(this.state.fadeAnim, {
            toValue: newProps.visible ? 1 : 0,
            duration: DEFAULT_ANIMATE_TIME,
        }).start();
    },

    render () {
        return (
            <Animated.View style={[this.state.overlayStyle, { opacity: this.state.fadeAnim }]}>
                {this.props.children}
            </Animated.View>
        );
    },
});

const styles = StyleSheet.create({
    fullOverlay: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        position: 'absolute',
    },
    emptyOverlay: {
        width: sr.w,
        height: 0,
        backgroundColor: 'transparent',
        position: 'absolute',
    },
});
