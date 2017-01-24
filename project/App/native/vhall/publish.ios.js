var React = require('react');
var {
    PropTypes,
    Component,
} = React;
var ReactNative = require('react-native');
var {
    StyleSheet,
    requireNativeComponent,
    View,
    Platform,
} = ReactNative;

class PublishView extends Component {
    static propTypes = {
        ...View.propTypes,
        videoId: PropTypes.string,
        appKey: PropTypes.string,
        appSecretKey: React.PropTypes.string,
        accessToken: React.PropTypes.string,
        // isStart:React.PropTypes.bool,
        // isMute:React.PropTypes.bool,
        // isFrontCamera:React.PropTypes.bool,
        // torchMode:React.PropTypes.number, [0:off, 1:on, 2:auto]
        // isFilterOn:React.PropTypes.bool,
        // fps:React.PropTypes.number,
        // videoResolution:React.PropTypes.number, [0:352*288, 1:640*480, 2:960*540, 3:1280*720]
        // bitRate:React.PropTypes.number,
        // connectTimes:React.PropTypes.number,
        // orgiation:React.PropTypes.number, [0: portrait, 1:landSpaceRight, 2:landSpaceLeft]
    };
    constructor(props, context) {
        super(props, context);
    }
    render() {
        const nativeProps = Object.assign({
            isStart: true,
            isMute: false,
            isFrontCamera: true,
            torchMode: 0,
            isFilterOn: true,
            fps: 15,
            videoResolution: 0,
            bitRate: 300000,
            connectTimes: 5,
            orgiation: 0,
        }, this.props);
        return (
            <RCTVhallPubllistView {...nativeProps} />
        );
    }
}

const RCTVhallPubllistView = requireNativeComponent('RCTVhallPublish', PublishView, {
    nativeOnly: {
        onPublishStatus: true,
        isStart: true,
        isMute: true,
        isFrontCamera: true,
        torchMode: true,
        isFilterOn: true,
        fps: true,
        videoResolution: true,
        bitRate: true,
        connectTimes: true,
        orgiation: true,
    },
});

module.exports =  PublishView;
