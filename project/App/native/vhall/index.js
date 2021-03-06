const React = require('react');
const {
    PropTypes,
    Component,
} = React;
const ReactNative = require('react-native');
const {
    StyleSheet,
    requireNativeComponent,
    View,
    Platform,
} = ReactNative;

class PlayerView extends Component {
    static propTypes = {
        ...View.propTypes,
        videoId: PropTypes.string,
        appKey: PropTypes.string,
        appSecretKey: React.PropTypes.string,
        name: React.PropTypes.string,
        email: React.PropTypes.string,
        password: React.PropTypes.string,
    };
    constructor (props, context) {
        super(props, context);
    }
    render () {
        const nativeProps = Object.assign({}, this.props);
        return (
            <RCTVhallPlayerView
                {...nativeProps}
                />
        );
    }
}

const RCTVhallPlayerView = requireNativeComponent('RCTVhallRTMPPlayer', PlayerView, {
    nativeOnly: {
        onDocFlash: true,
        onStateChange: true,
        onPlayError: true,
    },
});

module.exports = PlayerView;
