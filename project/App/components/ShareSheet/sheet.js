'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    Animated,
    StyleSheet,
    View,
    Dimensions,
} = ReactNative;

const DEFAULT_BOTTOM = -300-sr.h;
const DEFAULT_ANIMATE_TIME = 300;
const EventEmitter = require('EventEmitter');

module.exports = React.createClass({
    getInitialState () {
        return {
            bottom: new Animated.Value(DEFAULT_BOTTOM),
        };
    },
    onAnimatedEnd () {
        app.personal.closeShareSheetOverlay();
    },
    componentWillReceiveProps (nextProps) {
        const { visible } = nextProps;
        const oldVisible = this.props.visible;
        if (!_.isEqual(oldVisible, visible)) {
            return Animated.timing(this.state.bottom, {
                toValue: visible ? 0 : DEFAULT_BOTTOM,
                duration: DEFAULT_ANIMATE_TIME,
            }).start(this.onAnimatedEnd);
        }
    },

    render () {
        return (
            <Animated.View style={{ bottom: this.state.bottom }}>
                {this.props.children}
            </Animated.View>
        );
    },
});
