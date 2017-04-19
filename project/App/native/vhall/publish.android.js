const React = require('react');
const ReactNative = require('react-native');
const {
    NativeModules,
} = ReactNative;

module.exports = React.createClass({
    componentWillMount () {
        let {
            videoId,
            accessToken,
            appKey,
            appSecretKey,
            bitRate,
            fps,
            videoResolution,
            orgiation,
        } = this.props;

        if (bitRate === undefined)bitRate = 300000;
        if (fps === undefined)fps = 15;
        if (videoResolution === undefined)videoResolution = 0;
        if (orgiation === undefined)orgiation = 0;

        const param = JSON.stringify({
            videoId,
            accessToken,
            appKey,
            appSecretKey,
            bitRate,
            fps,
            videoResolution,
            orgiation,
        });
        NativeModules.UtilsModule.startChildApp('com.yxjqd.vhalllive', 'com.yxjqd.vhalllive.BroadcastActivity', param, (error) => {
            if (error) {
                Toast('直播失败');
            }
            app.navigator.pop();
        });
    },
    render () {
        return null;
    },
});
