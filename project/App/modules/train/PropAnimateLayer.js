'use strict';

const React = require('react');const {    PropTypes,} = React;const ReactNative = require('react-native');

const {
    StyleSheet,
    Text,
    Image,
    Animated,
    View,
} = ReactNative;

const PROPS = require('../../data/gifProps.js');
const Audio = require('@remobile/react-native-audio');

const ImageLayer = React.createClass({
    componentWillMount () {
        if (!this.props.aud) {
            return;
        }
        const player = new Audio(this.props.aud,
            (error) => {
                if (!error) {
                    player.setNumberOfLoops(this.props.count - 1);
                    player.play(() => {
                        player.release();
                    });
                }
            });
    },
    componentDidMount: function () {
        setTimeout(() => {
            this.props.deleteSelf();
        }, this.props.time * this.props.count);
    },
    render () {
        return (
            <Image
                resizeMode='contain'
                style={styles.propImageGIF}
                source={this.props.img} />
        );
    },
});

module.exports = React.createClass({
    getInitialState () {
        return {
            propCodes: [],
        };
    },
    deleteChild (propCode) {
        const propCodes = this.state.propCodes;
        let i = 0;
        for (i in propCodes) {
            if (propCodes[i] === propCode) {
                break;
            }
        }
        propCodes.splice(i, 1);
        this.setState({ propCodes });
    },
    componentWillReceiveProps (nextProps) {
        const propItem = nextProps.propItem;
        if (propItem.propIndex != this.props.propItem.propIndex) {
            const propCodes = this.state.propCodes;
            propCodes.push(propItem.propCode);
            this.setState({ propCodes });
        }
    },
    render () {
        return (
            <View style={styles.container}>
                {
                    this.state.propCodes.map((propCode, i) => {
                        const item = PROPS[propCode];
                        return (
                            <ImageLayer
                                key={i}
                                img={item.img}
                                aud={item.aud}
                                time={item.time}
                                count={item.count}
                                deleteSelf={this.deleteChild.bind(null, propCode)}
                                />
                        );
                    })
                }
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        position:'absolute',
        bottom: 120,
        alignItems:'center',
        justifyContent: 'center',
        width:sr.w,
        height:sr.h,
    },
    propImageGIF: {
        width:sr.w,
        height:sr.h,
        position: 'absolute',
        top: 120,
        left: 0,
    },
});
