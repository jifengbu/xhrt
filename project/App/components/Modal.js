'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    StyleSheet,
    View,
    Text,
    Animated,
    Navigator,
    PanResponder,
} = ReactNative;

module.exports = React.createClass({
    getDefaultProps () {
        return {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
        };
    },
    getInitialState () {
        return {
            opacity: new Animated.Value(0),
        };
    },
    componentWillMount () {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (e, gestureState) => true,
            onPanResponderGrant: (e, gestureState) => {
                this.closeModal();
            },
        });
    },
    componentDidMount () {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 500,
        }
        ).start();
    },
    closeModal () {
        Animated.timing(this.state.opacity, {
            toValue: 0,
            duration: 500,
        }
        ).start(() => {
            app.removeModal();
        });
    },
    render () {
        const { modalTouchHide } = this.props;
        return (
            <Animated.View style={[styles.container, { backgroundColor: this.props.backgroundColor, opacity: this.state.opacity }]} {...(modalTouchHide ? this._panResponder.panHandlers : {})}>
                {
                    !!this.props.title &&
                    <View style={styles.title}>
                        <View style={[styles.titleContainer, { marginTop: Navigator.NavigationBar.Styles.General.StatusBarHeight }]}>
                            <Text style={styles.titleText}>
                                {this.props.title}
                            </Text>
                        </View>
                    </View>
                }
                {this.props.children}
            </Animated.View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    title: {
        backgroundColor: CONSTANTS.THEME_COLOR,
        height:sr.totalNavHeight,
    },
    titleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: '500',
    },
});
