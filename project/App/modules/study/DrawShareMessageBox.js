'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    StyleSheet,
    Text,
    Image,
    Animated,
    View,
    TouchableHighlight,
} = ReactNative;
const { Button } = COMPONENTS;
module.exports = React.createClass({
    doShareWechat () {
        this.closeModal(() => {
            this.props.doShareWechat();
        });
    },
    doShareFriends () {
        this.closeModal(() => {
            this.props.doShareFriends();
        });
    },
    doShareQQ () {
        this.closeModal(() => {
            this.props.doShareQQ();
        });
    },
    getInitialState () {
        return {
            opacity: new Animated.Value(0),
        };
    },
    componentDidMount () {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 500,
        }).start();
    },
    doClose () {
        this.closeModal(() => {
            this.props.doClose();
        });
    },
    closeModal (callback) {
        Animated.timing(this.state.opacity, {
            toValue: 0,
            duration: 500,
        }).start(() => {
            callback();
        });
    },
    render () {
        return (
            <Animated.View style={[styles.overlayContainer, { opacity: this.state.opacity }]}>
                <View style={styles.container}>
                    <Image
                        resizeMode='stretch'
                        source={app.img.draw_header}
                        style={styles.drawHeaderImage}>
                        <Text style={styles.title}>温馨提示</Text>
                        <Text style={styles.drawcontent}>将本次获奖分享到</Text>
                    </Image>
                    <View style={styles.drawButtonView}>
                        <Button
                            onPress={this.doShareWechat}
                            style={styles.drawButton}>微信</Button>
                        <Button
                            onPress={this.doShareFriends}
                            style={styles.drawButton}>朋友圈</Button>
                        <Button
                            onPress={this.doShareQQ}
                            style={styles.drawButton}>QQ</Button>
                    </View>
                    <TouchableHighlight
                        onPress={this.doClose}
                        underlayColor='rgba(0, 0, 0, 0)'
                        style={styles.touchableHighlight}>
                        <Image
                            resizeMode='contain'
                            source={app.img.draw_back}
                            style={styles.closeIcon} />
                    </TouchableHighlight>
                </View>
            </Animated.View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        alignItems:'center',
        justifyContent:'center',
    },
    drawHeaderImage: {
        width:sr.w * 5 / 6,
        height:100,
        alignItems:'center',
        justifyContent:'center',
    },
    drawButtonView: {
        width:sr.w * 5 / 6,
        height:80,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'orange',
    },
    drawButton: {
        width:60,
        height:60,
        marginHorizontal:20,
    },
    title: {
        marginVertical:10,
        color: 'red',
        fontSize: 18,
        fontWeight: '100',
        overflow: 'hidden',
    },
    drawContent: {
        flex:1,
        marginVertical:15,
        color: 'black',
        fontSize: 18,
        textAlign:'center',
        fontWeight: '100',
        overflow: 'hidden',
    },
    overlayContainer: {
        position:'absolute',
        bottom: 0,
        alignItems:'center',
        justifyContent: 'center',
        width:sr.w,
        height:sr.h,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    touchableHighlight: {
        position:'absolute',
        top:0,
        left:sr.w * 5 / 6 - 24,
        width: 30,
        height: 30,
        marginTop:-8,
    },
    closeIcon: {
        width: 30,
        height: 30,
    },
});
