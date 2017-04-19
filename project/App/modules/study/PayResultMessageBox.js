'use strict';

const React = require('react');const ReactNative = require('react-native');
const {
    StyleSheet,
    Text,
    Image,
    Animated,
    View,
} = ReactNative;

const { Button } = COMPONENTS;

module.exports = React.createClass({
    doCancel () {
        this.closeModal(() => {
            this.props.doCancel();
        });
    },
    doConfirm () {
        this.closeModal(() => {
            this.props.doConfirm();
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
    closeModal (callback) {
        Animated.timing(this.state.opacity, {
            toValue: 0,
            duration: 500,
        }).start(() => {
            callback();
        });
    },
    render () {
        let buyIsSuccess = false;
        const contentStr = this.props.contentText;
        if (contentStr.indexOf('成功') >= 0) {
            buyIsSuccess = true;
        }
        return (
            <Animated.View style={[styles.overlayContainer, { opacity: this.state.opacity }]}>
                <View style={styles.container}>
                    <Image
                        resizeMode='stretch'
                        source={app.img.draw_header}
                        style={styles.drawCongratulationsHeaderImage}>
                        <Text style={styles.content}>
                            {contentStr}
                        </Text>
                    </Image>
                    <View
                        style={styles.drawCongratulationsButtonView}>
                        <Button
                            onPress={this.doConfirm}
                            style={styles.drawCongratulationsButtonRight}>
                            确 定
                        </Button>
                    </View>
                </View>
                <View style={styles.topContainer}>
                    {
                        buyIsSuccess ?
                            <Image
                                resizeMode='stretch'
                                source={app.img.draw_congratulations}
                                style={styles.drawCongratulationsImage} />
                        :
                            <Text />
                    }
                </View>
            </Animated.View>
        );
    },
});

const styles = StyleSheet.create({
    textStyle: {
        fontSize: 25,
        alignSelf:'center',
        color: 'blue',
        marginTop: 35,
    },
    container: {
        width:sr.w * 5 / 6,
        alignItems:'center',
        justifyContent:'center',
    },
    topContainer: {
        position:'absolute',
        width:sr.w * 5 / 6,
        alignItems:'center',
        top:210,
        right:30,
    },
    topCompleteContainer: {
        position:'absolute',
        width:sr.w * 5 / 6,
        alignItems:'center',
        top:130,
        right:30,
    },
    drawCongratulationsHeaderImage: {
        width:sr.w * 5 / 6,
        height:120,
        alignItems:'center',
        justifyContent:'center',
    },
    drawCongratulationsImage: {
        width:100,
        height:50,
        alignSelf:'center',
    },
    drawCongratulationsButtonView: {
        width:sr.w * 5 / 6,
        height:80,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'peachpuff',
    },
    drawCongratulationsCompleteButtonView: {
        width:sr.w * 5 / 6,
        height:60,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'peachpuff',
    },
    drawCongratulationsButtonRight: {
        width:sr.w * 5 / 18,
        height:50,
        marginHorizontal:20,
    },
    drawCongratulationsButtonLeft: {
        width:sr.w * 5 / 18,
        height:50,
        marginHorizontal:20,
        backgroundColor:'#a0d468',
    },
    drawCongratulationsInfo: {
        width:sr.w * 5 / 6,
        height:180,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'peachpuff',
    },
    infoTitle: {
        paddingHorizontal:50,
        marginVertical:2,
        color: 'red',
        fontSize: 14,
        textAlign:'center',
        fontWeight: '100',
        overflow: 'hidden',
    },
    infoInput: {
        height:35,
        marginHorizontal:10,
        marginVertical:2,
        backgroundColor: 'white',
        borderColor:'gray',
        borderWidth:1,
        borderRadius:10,
    },
    content: {
        marginTop:40,
        color: 'black',
        fontSize: 18,
        textAlign:'center',
        fontWeight: '100',
        overflow: 'hidden',
    },
    content2: {
        marginTop:45,
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
        top:16,
        left:sr.w * 5 / 6 - 24,
        width: 30,
        height: 30,
    },
    closeIcon: {
        width: 30,
        height: 30,
    },
    awardIcon: {
        width: 40,
        height: 40,
        marginVertical:10,
    },
});
